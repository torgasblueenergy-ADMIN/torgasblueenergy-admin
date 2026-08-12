import { WEBAPI_URL } from '../config';

/* ================================================================
   PUBLIKASI, BERITA & VIDEO — SELURUHNYA DARI SPREADSHEET
   ----------------------------------------------------------------
   Sejak 13 Agu 2026 bagian "Scientific Publications & News" TIDAK LAGI
   menyimpan isi apa pun di dalam kode. Satu-satunya sumber adalah tab
   "Publikasi" di Google Spreadsheet. Menambah, mengubah, dan menghapus
   cukup dilakukan di sana — situs mengikuti dengan sendirinya.

   Berkas src/data/articles.js sudah dihapus. Jangan dihidupkan lagi:
   dua sumber isi berarti dua tempat mengedit, dan cepat atau lambat
   keduanya akan berbeda tanpa ada yang sadar.

   GET ?action=news  (alias: ?action=publications)

   Balasan yang diharapkan:

     { "success": true,
       "data": [ { "id": "NEW-01",
                   "title": "...",
                   "category": "news" | "artikel-ilmiah",
                   "categoryLabel": "News" | "Scientific Articles",
                   "rawCategory": "apa pun yang diketik di kolom Tipe",
                   "date": "8 Januari 2026",
                   "sortKey": "2026-01-08",
                   "author": "...",
                   "summary": "...",
                   "content": "...",
                   "image": "https://lh3.googleusercontent.com/d/..." } ],
       "total": 1 }
================================================================ */

/* Membaca Sheet lewat Apps Script memakan 7–14 detik saat skrip baru
   "bangun". 15 detik terlalu mepet dan sempat membuat pembacaan gagal. */
const TIMEOUT_MS = 30000;

/* ⚠️ KENAPA ADA PENGULANGAN — 404 YANG DATANG DAN PERGI
   ----------------------------------------------------------------
   Apps Script tidak membalas GET secara langsung. Ia menjawab dengan
   pengalihan (302) ke script.googleusercontent.com/macros/echo, dan
   alamat pengalihan itu membawa `user_content_key` yang hanya berlaku
   sekali pakai serta berumur pendek. Bila kunci itu telanjur hangus
   sebelum browser sempat mengambil isinya, yang diterima bukan JSON
   melainkan halaman 404 Google.

   Diamati pada 12 Agu 2026 dari halaman torgasblueenergy.com — SATU
   alamat yang sama, hanya berselang menit:

     ?action=submissions  → 200 (13,7 dtk)  ... lalu 404 (12,0 dtk)
     ?action=news         → 200 ( 7,1 dtk)  ... lalu 404 (21,7 dtk)
     ?action=publications → 404 ( 9,5 dtk)
     ?action=ping         → 200 selalu (balasan instan, kunci tak sempat hangus)

   Jadi ini BUKAN soal CORS, izin akses "Anyone", nama aksi, maupun isi
   datanya. Yang menentukan hanya keberuntungan waktu — dan endpoint yang
   lambat (membaca Sheet) jauh lebih sering apes daripada `ping`.

   ⚠️ CATATAN JUJUR: pengukuran di atas diambil lewat browser yang
   dipasangi ekstensi pemeriksa, dan ekstensi itu ikut membaca isi
   balasan — sangat mungkin justru ekstensi itulah yang menghanguskan
   kuncinya. Artinya pengunjung biasa mungkin tidak seapes ini. Yang
   pasti: kegagalannya nyata, sesekali, dan mengenai SEMUA aksi GET.

   ⚠️ Jangan hapus pengulangan ini hanya karena "sekali coba sudah
   berhasil di komputer saya". Ia berhasil di banyak percobaan juga. */
const PERCOBAAN = ['news', 'publications', 'news'];
const JEDA_MS = 1500;

const BULAN_INGGRIS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/* Backend membalas tanggal dalam bahasa Indonesia ("8 Januari 2026"),
   sedangkan situs seluruhnya berbahasa Inggris sejak 5 Agu 2026.
   Diterjemahkan di sini, bukan di backend, supaya perbaikan ini bisa
   terbit tanpa menunggu penerbitan Apps Script. */
function tanggalInggris(sortKey, tanggalAsli) {
  if (typeof sortKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sortKey)) {
    const [th, bl, tg] = sortKey.split('-').map(Number);
    if (bl >= 1 && bl <= 12) return `${tg} ${BULAN_INGGRIS[bl - 1]} ${th}`;
  }
  return tanggalAsli || '';
}

/* ================================================================
   VIDEO — TANPA MENGUBAH BACKEND
   ----------------------------------------------------------------
   Backend hanya mengenal dua kategori ('artikel-ilmiah' dan 'news'),
   dan menambah kategori ketiga di sana berarti menerbitkan ulang Apps
   Script. Itu tidak perlu, karena backend sudah meneruskan apa adanya
   teks kategori yang dipilih pengurus di Spreadsheet, lewat properti
   `rawCategory` — biarpun `category` hasil terjemahannya meleset.

   Jadi penentu kategorinya dibaca di sini:

     1. Kolom Tipe_Kategori berisi "VIDEO"  → video   (cara utama,
        sesuai daftar pilihan di Spreadsheet)
     2. atau ada tautan YouTube di baris itu → video  (jaring pengaman,
        kalau kategorinya lupa diubah)

   ⚠️ Aturan 1 harus tetap ada meski aturan 2 kelihatan cukup: video
   Google Drive TIDAK bisa dikenali dari alamatnya. Backend mengubah
   setiap tautan Drive — gambar maupun video — menjadi bentuk yang
   sama persis (lh3.googleusercontent.com/d/ID), sehingga dari alamat
   saja mustahil membedakan foto sampul dari berkas video.
================================================================ */
function idYoutube(teks) {
  const s = String(teks || '');
  const pola = [
    /[?&]v=([A-Za-z0-9_-]{11})/,        // youtube.com/watch?v=ID
    /youtu\.be\/([A-Za-z0-9_-]{11})/,   // youtu.be/ID
    /\/embed\/([A-Za-z0-9_-]{11})/,     // youtube.com/embed/ID
    /\/shorts\/([A-Za-z0-9_-]{11})/,    // youtube.com/shorts/ID
    /\/live\/([A-Za-z0-9_-]{11})/       // youtube.com/live/ID
  ];
  for (const p of pola) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return '';
}

/* ID berkas Google Drive panjangnya 25–45 karakter, sedangkan ID video
   YouTube tepat 11. Syarat minimal 20 di bawah membuat keduanya tidak
   pernah tertukar. */
function idDrive(teks) {
  const s = String(teks || '');
  const m = s.match(/\/d\/([A-Za-z0-9_-]{20,})/) || s.match(/[?&]id=([A-Za-z0-9_-]{20,})/);
  return m ? m[1] : '';
}

/* "VIDEO", "Video", "video klip", "vidio" (salah ketik) — semua terbaca. */
function kategoriVideo(rawCategory) {
  const s = String(rawCategory || '').toLowerCase();
  return s.includes('video') || s.includes('vidio');
}

function cariDiBaris(r, ambil) {
  return ambil(r.image) || ambil(r.summary) || ambil(r.content);
}

function terapkanKategori(r) {
  const yt = cariDiBaris(r, idYoutube);
  if (!yt && !kategoriVideo(r.rawCategory)) return r;

  const dasar = { ...r, category: 'video', categoryLabel: 'Video' };

  if (yt) {
    return {
      ...dasar,
      youtubeId: yt,
      /* sddefault tersedia untuk hampir semua video; maxresdefault sering
         kosong pada video lama, jadi sengaja tidak dipakai. */
      image: `https://img.youtube.com/vi/${yt}/sddefault.jpg`
    };
  }

  const drive = cariDiBaris(r, idDrive);
  if (drive) {
    return {
      ...dasar,
      driveId: drive,
      /* Drive membuatkan gambar cuplikan untuk berkas video. Kalau gagal
         (berkas belum selesai diproses, atau izinnya masih terbatas),
         kartunya tetap tampil rapi: latar gelap dengan tombol putar. */
      image: `https://drive.google.com/thumbnail?id=${drive}&sz=w800`
    };
  }

  /* Kategorinya VIDEO tetapi tidak ada tautan yang bisa diputar.
     Tetap ditandai video supaya pengurus melihat kartunya masuk ke tab
     yang benar dan sadar tautannya belum diisi. */
  return dasar;
}

/* ================================================================
   DOI ARTIKEL ILMIAH
   ----------------------------------------------------------------
   Backend tidak punya kolom khusus DOI, dan menambahkannya berarti
   menerbitkan ulang Apps Script. Tidak perlu — kolom Ringkasan_Pendek
   sudah dikirim backend tetapi TIDAK dipakai di mana pun oleh situs.
   Kolom itulah yang dipakai sebagai tempat DOI.

   Dua sumber diterima:

     1. Kolom Ringkasan_Pendek  → cara yang dianjurkan, satu sel bersih
     2. Menyelip di Konten_Lengkap → cara lama; baris yang sudah terlanjur
        mengakhiri abstraknya dengan "Doi: 10.21608/..." tetap bekerja
        tanpa perlu disunting

   Pada kasus 2 penyebutan DOI itu DIBUANG dari badan tulisan, supaya
   tidak tampil dua kali — sekali sebagai tautan di bawah judul, sekali
   lagi sebagai teks di ujung abstrak.

   Bentuk yang diterima: "10.21608/ejabf.2026.413273.6396",
   "Doi: 10.21608/...", maupun "https://doi.org/10.21608/...".
================================================================ */
const POLA_DOI = /\b10\.\d{4,9}\/[^\s"'<>,;)\]]+/;

function rapikanDoi(s) {
  // Titik di ujung biasanya tanda akhir kalimat, bukan bagian DOI-nya
  return String(s || '').replace(/[.,;:)\]]+$/, '');
}

function cariDoi(teks) {
  const m = String(teks || '').match(POLA_DOI);
  return m ? rapikanDoi(m[0]) : '';
}

function terapkanDoi(r) {
  const dariRingkasan = cariDoi(r.summary);
  if (dariRingkasan) return { ...r, doi: dariRingkasan };

  const dariKonten = cariDoi(r.content);
  if (!dariKonten) return r;

  /* Buang penyebutan DOI dari badan tulisan. Polanya dirakit dari DOI
     yang benar-benar ditemukan, bukan pola umum — supaya tidak ada
     kalimat lain yang ikut terpotong. */
  const escape = dariKonten.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const buang = new RegExp(
    '(?:\\bdoi\\s*[:：]?\\s*)?(?:https?:\\/\\/(?:dx\\.)?doi\\.org\\/)?' + escape + '\\.?',
    'gi'
  );

  const konten = String(r.content)
    .replace(buang, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { ...r, doi: dariKonten, content: konten };
}

/* ================================================================
   URUTAN — YANG BARU DIUNGGAH DI DEPAN, BUKAN YANG TANGGALNYA MUDA
   ----------------------------------------------------------------
   Backend sudah mengurutkan hasilnya berdasarkan TANGGAL menurun, dan
   urutan baris asli di Spreadsheet hilang di situ. Padahal yang
   diinginkan pengurus: yang paling BARU DIUNGGAH tampil paling depan —
   sebab artikel lama pun kadang baru dimasukkan hari ini, dan kalau
   diurutkan menurut tanggal ia langsung terkubur di belakang.

   Karena urutan baris tidak ikut terkirim, yang dipakai adalah ANGKA
   PADA KOLOM ID. Kolom itu memang sudah diisi pengurus, jadi tidak ada
   pekerjaan tambahan:

       ID        →  urutan tampil
       ART-03    →  1  (angka terbesar, paling depan)
       NEW-02    →  2
       NEW-01    →  3

   ⚠️ ATURAN PENGISIAN: angka pada ID harus TERUS NAIK setiap kali
   menambah baris baru, tak peduli awalannya ART- atau NEW- atau VID-.
   Yang dibaca hanya angkanya, awalan diabaikan. Baris tanpa angka
   sama sekali jatuh ke urutan tanggal.
================================================================ */
function nomorUrut(item) {
  const angka = String(item.id || '').match(/(\d+)(?!.*\d)/); // gugus angka terakhir
  return angka ? parseInt(angka[1], 10) : null;
}

function waktuTanggal(item) {
  if (typeof item.sortKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.sortKey)) {
    return Date.parse(item.sortKey + 'T00:00:00');
  }
  const t = Date.parse(item.date);
  return Number.isNaN(t) ? -Infinity : t;
}

function urutkan(data) {
  return [...data].sort((a, b) => {
    const na = nomorUrut(a);
    const nb = nomorUrut(b);

    // Keduanya bernomor → nomor besar duluan
    if (na !== null && nb !== null && na !== nb) return nb - na;
    // Yang bernomor didahulukan daripada yang tidak
    if (na !== null && nb === null) return -1;
    if (na === null && nb !== null) return 1;
    // Nomor sama atau sama-sama tanpa nomor → tanggal terbaru duluan
    return waktuTanggal(b) - waktuTanggal(a);
  });
}

async function cobaSatuAksi(aksi) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${WEBAPI_URL}?action=${aksi}`, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    });
    if (!res.ok) return { siap: false, data: [], alasan: 'server-menolak-' + res.status };

    const teks = await res.text();
    let json;
    try {
      json = JSON.parse(teks);
    } catch {
      // Biasanya halaman login Google — tanda akses deploy belum "Anyone"
      return { siap: false, data: [], alasan: 'bukan-json' };
    }

    if (json.success !== true || !Array.isArray(json.data)) {
      return { siap: false, data: [], alasan: 'endpoint-belum-ada' };
    }

    const data = urutkan(
      json.data
        .filter((r) => r && String(r.title || '').trim())
        .map((r) => terapkanDoi(terapkanKategori({ ...r, date: tanggalInggris(r.sortKey, r.date) })))
    );

    return { siap: true, data };
  } catch {
    return { siap: false, data: [], alasan: 'tidak-terhubung' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ambil seluruh publikasi, berita, dan video dari Spreadsheet.
 * @returns {Promise<{siap: boolean, data: array, alasan?: string}>}
 */
export async function ambilPublikasi() {
  let terakhir = { siap: false, data: [], alasan: 'belum-dicoba' };

  for (let i = 0; i < PERCOBAAN.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, JEDA_MS));
    terakhir = await cobaSatuAksi(PERCOBAAN[i]);
    if (terakhir.siap) return terakhir;
  }

  return terakhir;
}
