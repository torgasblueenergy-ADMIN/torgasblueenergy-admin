import { WEBAPI_URL } from '../config';

/* ================================================================
   PUBLIKASI & BERITA DARI SPREADSHEET
   ----------------------------------------------------------------
   GET ?action=publications

   Balasan yang diharapkan:

     { "success": true,
       "data": [ { "id": "NEW-01",
                   "title": "...",
                   "category": "news" | "artikel-ilmiah",
                   "categoryLabel": "News" | "Scientific Articles",
                   "date": "8 Januari 2026",
                   "sortKey": "2026-01-08",
                   "author": "...",
                   "summary": "...",
                   "content": "...",
                   "image": "https://lh3.googleusercontent.com/d/..." } ],
       "total": 1 }

   ⚠️ RIWAYAT 12 Agu 2026 — kenapa berkas ini ada:
   Backend `getPublications` sudah bekerja sejak lama dan sudah membalas
   dengan benar. Yang tidak pernah ada adalah PEMANGGILNYA. NewsSection
   memuat data langsung dari src/data/articles.js, sehingga baris apa pun
   yang ditambahkan pengurus ke tab "Publikasi" tidak pernah sampai ke
   situs. Dari sisi pengurus ini terlihat seperti salah mengisi Sheet,
   padahal isian mereka sudah benar sejak awal.

   Kegagalan di sini TIDAK dianggap galat. Kalau Spreadsheet tak terbaca,
   situs tetap menampilkan isi bawaan dari src/data/articles.js — bagian
   Publications & News tidak boleh sampai kosong hanya karena jaringan
   sedang bermasalah.
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

   Karena itu satu kegagalan tidak boleh langsung dianggap "tidak ada
   data". Dicoba beberapa kali dengan jeda; 'news' dan 'publications'
   sama-sama dipakai karena backend melayani keduanya dengan fungsi
   yang sama:

     if (action === 'publications' || action === 'news') return getPublications(p)

   ⚠️ Jangan hapus pengulangan ini hanya karena "sekali coba sudah
   berhasil di komputer saya". Ia berhasil di banyak percobaan juga. */
const PERCOBAAN = ['news', 'publications', 'news'];
const JEDA_MS = 1500;

const BULAN_INGGRIS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/* Backend membalas tanggal dalam bahasa Indonesia ("8 Januari 2026"),
   sedangkan situs seluruhnya berbahasa Inggris sejak 5 Agu 2026. Kalau
   dibiarkan, satu kartu berbahasa Indonesia berdiri di antara kartu-kartu
   berbahasa Inggris.

   Diterjemahkan di sini, bukan di backend, supaya perbaikan ini bisa
   terbit tanpa menunggu penerbitan Apps Script — yang saat ini sedang
   ditahan sampai izin WhatsApp disetujui. */
function tanggalInggris(sortKey, tanggalAsli) {
  if (typeof sortKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sortKey)) {
    const [th, bl, tg] = sortKey.split('-').map(Number);
    if (bl >= 1 && bl <= 12) {
      return `${tg} ${BULAN_INGGRIS[bl - 1]} ${th}`;
    }
  }
  return tanggalAsli || '';
}

/* Judul dipakai sebagai penangkal ganda, jadi perbedaan huruf besar-kecil,
   spasi ganda, dan tanda baca di ujung tidak boleh membuat satu berita
   yang sama terhitung dua kali. */
function kunciJudul(judul) {
  return String(judul || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Ambil publikasi dari Spreadsheet.
 * @returns {Promise<{siap: boolean, data: array, alasan?: string}>}
 *          `siap: false` berarti Spreadsheet belum terbaca — bukan galat fatal.
 */
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

    const data = json.data
      .filter((r) => r && String(r.title || '').trim())
      .map((r) => ({
        ...r,
        date: tanggalInggris(r.sortKey, r.date)
      }));

    return { siap: true, data };
  } catch {
    return { siap: false, data: [], alasan: 'tidak-terhubung' };
  } finally {
    clearTimeout(timer);
  }
}

export async function ambilPublikasi() {
  let terakhir = { siap: false, data: [], alasan: 'belum-dicoba' };

  for (let i = 0; i < PERCOBAAN.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, JEDA_MS));
    terakhir = await cobaSatuAksi(PERCOBAAN[i]);
    if (terakhir.siap) return terakhir;
  }

  return terakhir;
}

/* Untuk pengurutan. Entri Spreadsheet punya `sortKey` (YYYY-MM-DD) dari
   backend; entri bawaan di kode hanya punya tulisan seperti "15 May 2026",
   yang untungnya bisa dibaca langsung oleh Date. Yang tak terbaca ditaruh
   paling belakang, bukan dibuang. */
function waktuUrut(item) {
  if (typeof item.sortKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.sortKey)) {
    return Date.parse(item.sortKey + 'T00:00:00');
  }
  const t = Date.parse(item.date);
  return Number.isNaN(t) ? -Infinity : t;
}

/**
 * Gabungkan isi Spreadsheet dengan isi bawaan dari src/data/articles.js.
 *
 * Entri bawaan yang ID atau judulnya sama dengan entri Spreadsheet
 * dibuang, sehingga memindahkan satu berita dari kode ke Spreadsheet
 * tidak pernah memunculkan kartu kembar.
 *
 * Entri bawaan yang belum ada di Spreadsheet tetap ditampilkan — kalau
 * tidak, menambahkan satu baris ke Sheet akan langsung melenyapkan
 * empat publikasi yang selama ini sudah tayang.
 *
 * Hasil akhir diurutkan dari yang terbaru, supaya berita yang baru
 * ditambahkan lewat Spreadsheet muncul di kartu pertama — bukan
 * terselip di belakang entri kode yang lebih tua.
 */
export function gabungPublikasi(dariSheet, bawaan) {
  const idTerpakai = new Set(dariSheet.map((r) => String(r.id || '')));
  const judulTerpakai = new Set(dariSheet.map((r) => kunciJudul(r.title)));

  const sisaBawaan = bawaan.filter(
    (r) => !idTerpakai.has(String(r.id || '')) && !judulTerpakai.has(kunciJudul(r.title))
  );

  return [...dariSheet, ...sisaBawaan].sort((a, b) => waktuUrut(b) - waktuUrut(a));
}
