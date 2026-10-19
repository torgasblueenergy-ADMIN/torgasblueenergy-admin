import { TIMELINE_CSV_URL } from '../config';

/* ================================================================
   TIMELINE BIMBINGAN — DIBACA DARI GOOGLE SHEET (CSV)
   ----------------------------------------------------------------
   KENAPA CSV, BUKAN APPS SCRIPT

   Pengajuan, publikasi, dan ketersediaan semuanya lewat Apps Script
   (lihat lib/pengajuan.js). Timeline ini SENGAJA tidak ikut ke sana.

   Penerbitan Apps Script sedang ditahan — lihat apps-script/.deploy-hold.
   Selama berkas itu ada, menambah `action=timeline` di Code.js berarti
   fiturnya baru hidup entah kapan. Tab yang di-publish ke web sebagai
   CSV berjalan hari ini juga, tanpa menyentuh Apps Script sama sekali.

   Efek sampingnya justru pas dengan yang diminta: alamat CSV itu
   HANYA BISA DIBACA. Tidak ada cara menulis balik ke Sheet lewatnya.
   Jadi sifat "web cuma lihat, ubah lewat Sheet" bukan aturan yang
   kita tegakkan di kode — ia memang satu-satunya yang mungkin.

   ⚠️ Konsekuensi yang harus disadari: tab yang di-publish bisa dibaca
   siapa pun yang tahu alamatnya, tanpa login. Jangan menaruh nilai,
   catatan pribadi, atau apa pun yang tidak boleh dilihat mahasiswa
   lain di tab ini. Taruh di tab terpisah yang tidak di-publish.

   Kalau nanti deploy hold dicabut dan ingin pindah ke Apps Script,
   yang perlu diganti hanya fungsi ambilCsv() di bawah — bentuk data
   yang dikembalikan ambilTimeline() tetap sama.
================================================================ */

const TIMEOUT_MS = 15000;

/* ================================================================
   KOLOM TETAP vs KOLOM TAHAPAN
   ----------------------------------------------------------------
   Nama tahapan TIDAK ditulis di kode ini. Semua kolom yang BUKAN
   kolom tetap di bawah dianggap sebagai satu tahapan, urut sesuai
   urutan kolom di Sheet.

   Jadi menambah tahap baru = menambah kolom di Sheet. Tidak perlu
   mengubah berkas ini, tidak perlu build ulang.
================================================================ */
const KOLOM_TETAP = {
  nama:       ['nama', 'nama lengkap', 'mahasiswa', 'name'],
  nim:        ['nim', 'npm', 'id', 'nomor induk'],
  pembimbing: ['pembimbing', 'dosen', 'dosen pembimbing', 'supervisor', 'advisor'],
  topik:      ['topik', 'judul', 'topik riset', 'judul skripsi', 'penelitian', 'topic'],
  catatan:    ['catatan', 'keterangan', 'note', 'notes'],
  tampilkan:  ['tampilkan', 'aktif', 'show', 'active'],

  /* ================================================================
     KOLOM PROGRES — OPSIONAL, TAPI DIANJURKAN
     ----------------------------------------------------------------
     Kalau tidak ada, persentase besar di kolom kiri papan dihitung
     sendiri: rata-rata datar semua kolom tahapan.

     Rata-rata datar itu MELESET dari angka di workbook, karena dua hal:

       1. Workbook menimbang tiap kegiatan dengan bobotnya (durasi
          minggu). Rata-rata datar menganggap semua tahap sama berat,
          padahal "Pelaksanaan Penelitian" 14 minggu dan "Sidang"
          9 minggu.

       2. Kolom "Pengolahan Data" di tab Web sebenarnya kegiatan B3,
          yang SUDAH termasuk di dalam tahap B. Ikut dirata-ratakan
          berarti bagian itu dihitung dua kali.

     Terbukti 19 Okt 2026: papan menampilkan 7 / 7 / 21 / 93 persen,
     sedangkan Laporan Progres di workbook 10 / 10 / 29 / 94 persen.
     Dua angka berbeda untuk hal yang sama membuat papan sulit
     dipercaya.

     Dengan kolom ini terisi, papan memakai angka workbook apa adanya
     dan kedua masalah di atas hilang sekaligus. Isi kolomnya di tab
     Web (Publish) dengan:  =TEXT('Laporan Progres'!F8,"0%")
  ================================================================ */
  progres:    ['progres', 'progres keseluruhan', 'progress', 'total', 'persen', 'persentase'],
};

function kenaliKolom(judul) {
  const bersih = String(judul || '').trim().toLowerCase();
  for (const kunci of Object.keys(KOLOM_TETAP)) {
    if (KOLOM_TETAP[kunci].includes(bersih)) return kunci;
  }
  return null;
}

/* ================================================================
   PENGURAI CSV
   ----------------------------------------------------------------
   Ditulis sendiri, bukan split(',').

   Topik riset hampir selalu mengandung koma — "Analisis mikroplastik
   pada sedimen mangrove, Pangandaran". Dengan split(',') baris itu
   pecah di tengah judul dan seluruh kolom setelahnya bergeser satu,
   sehingga tahap "Pengolahan Data" membaca isi kolom sebelahnya.
   Rusaknya diam-diam: tabel tetap tampil, isinya saja yang salah.

   Google juga menulis tanda kutip ganda di dalam sel sebagai "" —
   itu ikut ditangani di sini.
================================================================ */
function uraiCsv(teks) {
  const baris = [];
  let sel = '';
  let kolom = [];
  let dalamKutip = false;

  // Samakan akhir baris Windows/Mac lama supaya satu aturan saja di bawah
  const s = String(teks || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (dalamKutip) {
      if (c === '"') {
        if (s[i + 1] === '"') { sel += '"'; i++; }  // "" = satu tanda kutip literal
        else dalamKutip = false;
      } else sel += c;
      continue;
    }

    if (c === '"') { dalamKutip = true; continue; }
    if (c === ',') { kolom.push(sel); sel = ''; continue; }
    if (c === '\n') { kolom.push(sel); baris.push(kolom); kolom = []; sel = ''; continue; }
    sel += c;
  }
  // Baris terakhir biasanya tidak diakhiri newline
  if (sel !== '' || kolom.length) { kolom.push(sel); baris.push(kolom); }

  // Buang baris yang seluruh selnya kosong (Sheet sering menyisakan ratusan)
  return baris.filter((r) => r.some((v) => String(v).trim() !== ''));
}

/* ================================================================
   MEMBACA ISI SEL TAHAPAN
   ----------------------------------------------------------------
   Sengaja dibuat longgar. Yang mengisi Sheet adalah manusia yang
   sedang buru-buru, bukan formulir dengan dropdown. "Selesai",
   "selesai 12/10/2026", "100%", "v", dan "✓" semuanya harus berarti
   hal yang sama, kalau tidak orang berhenti mengisinya.

   Empat keadaan yang dikenali:
     belum      — sel kosong atau "-"
     berjalan   — "proses", "60%", "mulai"
     selesai    — "selesai", "done", "100%", "v", atau sebuah tanggal
     terkendala — "kendala", "revisi", "blocked"
================================================================ */
const KATA_SELESAI    = ['selesai', 'done', 'ok', 'tuntas', 'beres', 'finish', 'finished', 'complete', 'v', '✓', 'ya', 'yes'];
const KATA_BERJALAN   = ['proses', 'berjalan', 'jalan', 'mulai', 'ongoing', 'wip', 'progress', 'in progress', 'berlangsung', 'dikerjakan'];
const KATA_TERKENDALA = ['kendala', 'terkendala', 'terhambat', 'hambat', 'blocked', 'block', 'revisi', 'ulang', 'stuck', 'tertunda', 'pending'];

/* ⚠️ "Menunggu Review" harus diperiksa SEBELUM kata terkendala.
   Alasannya: daftar terkendala memuat 'pending', dan sebagian orang
   menulis "pending review" yang maksudnya menunggu ACC dosen, bukan
   macet. Kalau urutannya terbalik, pekerjaan yang sebenarnya sudah
   rampung dan tinggal ditandatangani akan tampil oranye seolah
   bermasalah — persis kebalikan dari keadaannya.

   Nilainya 75% mengikuti tab Pengaturan di spreadsheet: pekerjaan
   mahasiswa sudah selesai, yang belum hanya masukan dosen. */
const KATA_REVIEW = ['menunggu review', 'menunggu', 'review', 'pending review', 'acc'];

/** Cari tanggal di dalam teks bebas. Mengembalikan teks tampilan, bukan Date —
 *  yang dibutuhkan tampilan hanya "12 Okt 2026", bukan perhitungan apa pun. */
const NAMA_BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function cariTanggal(teks) {
  const s = String(teks);

  // 2026-10-12  (bentuk yang dipakai Sheet kalau selnya bertipe tanggal)
  let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return formatTanggal(+m[1], +m[2], +m[3]);

  /* 12/10/2026 — DIBACA HARI/BULAN/TAHUN.
     ⚠️ Ini keputusan sadar, bukan kelalaian. Google Sheet berbahasa
     Indonesia menulis d/m/Y; Sheet berbahasa Inggris menulis m/d/Y.
     Keduanya mustahil dibedakan dari teksnya saja untuk tanggal 1–12.
     Dipilih d/m/Y karena itu yang dipakai pengisi Sheet ini.
     Kalau suatu saat tanggalnya tampak meleset sebulan, di sinilah
     penyebabnya — dan jalan keluarnya adalah menulis 2026-10-12 di
     Sheet, bukan menebak-nebak di kode. */
  m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return formatTanggal(+m[3], +m[2], +m[1]);

  return '';
}

function formatTanggal(tahun, bulan, tanggal) {
  if (bulan < 1 || bulan > 12 || tanggal < 1 || tanggal > 31) return '';
  return `${tanggal} ${NAMA_BULAN_PENDEK[bulan - 1]} ${tahun}`;
}

/** Baca sel kolom Progres. Menerima "46%", "46", dan "0,46".
 *  Mengembalikan null kalau selnya kosong atau tidak berisi angka,
 *  supaya pemanggilnya tahu harus memakai cara hitung cadangan —
 *  bukan menganggapnya nol dan menampilkan 0% untuk semua orang. */
function bacaPersen(nilai) {
  const s = String(nilai == null ? '' : nilai).trim().replace(',', '.');
  if (!s) return null;

  const m = s.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;

  const n = parseFloat(m[1]);
  if (Number.isNaN(n)) return null;

  /* Google kadang mengirim 0.46 alih-alih 46% kalau selnya angka biasa
     tanpa format persen. Angka di bawah 1 tanpa tanda % diperlakukan
     sebagai pecahan. "1" tanpa % tetap dibaca 1%, bukan 100% — menebak
     di titik itu lebih berisiko daripada menampilkan angka kecil yang
     jelas salah dan langsung ketahuan. */
  const pecahan = !s.includes('%') && n > 0 && n < 1;
  return Math.max(0, Math.min(100, Math.round(pecahan ? n * 100 : n)));
}

function bacaTahap(nilai) {
  const asli = String(nilai == null ? '' : nilai).trim();
  const kosong = { keadaan: 'belum', persen: 0, tanggal: '', teks: '' };

  if (!asli || asli === '-' || asli === '–' || asli === '—') return kosong;

  const rendah = asli.toLowerCase();
  const tanggal = cariTanggal(asli);

  // Angka persen di mana pun dalam sel: "60%", "progress 60%"
  const persenCocok = rendah.match(/(\d{1,3})\s*%/);
  const persen = persenCocok ? Math.min(100, Math.max(0, +persenCocok[1])) : null;

  const adaKata = (daftar) => daftar.some((k) => rendah.includes(k));

  /* Review diperiksa paling dulu — lihat catatan di atas KATA_REVIEW. */
  if (adaKata(KATA_REVIEW)) {
    return { keadaan: 'berjalan', persen: persen == null ? 75 : persen, tanggal, teks: asli };
  }

  /* Urutan pemeriksaan penting: "revisi 60%" harus jatuh ke terkendala,
     bukan ke berjalan, karena yang perlu terlihat adalah masalahnya. */
  if (adaKata(KATA_TERKENDALA)) {
    return { keadaan: 'terkendala', persen: persen == null ? 40 : persen, tanggal, teks: asli };
  }

  if (persen != null) {
    return {
      keadaan: persen >= 100 ? 'selesai' : persen > 0 ? 'berjalan' : 'belum',
      persen, tanggal, teks: asli
    };
  }

  if (adaKata(KATA_SELESAI)) return { keadaan: 'selesai', persen: 100, tanggal, teks: asli };
  if (adaKata(KATA_BERJALAN)) return { keadaan: 'berjalan', persen: 50, tanggal, teks: asli };

  /* Sel berisi tanggal saja, tanpa kata apa pun — misalnya "12/10/2026".
     Dibaca sebagai "tahap ini rampung pada tanggal itu", karena itulah
     yang dimaksud orang ketika hanya menulis tanggal di kolom tahapan. */
  if (tanggal) return { keadaan: 'selesai', persen: 100, tanggal, teks: asli };

  /* Ada isinya tapi tidak dikenali. Jangan dibuang dan jangan ditebak
     sebagai "selesai" — tampilkan apa adanya sebagai sedang berjalan,
     supaya pengisi Sheet melihat tulisannya muncul dan bisa memperbaiki. */
  return { keadaan: 'berjalan', persen: 50, tanggal, teks: asli };
}


/* ================================================================
   ALAMAT CSV
   ----------------------------------------------------------------
   Diterima empat bentuk, supaya siapa pun yang menyalin alamat dari
   Google tidak perlu tahu bentuk mana yang "benar":

     1. Sudah CSV           → .../pub?gid=0&single=true&output=csv
     2. Hasil Publish to web → .../d/e/2PACX-.../pubhtml?gid=0&single=true
     3. Alamat Sheet biasa   → .../d/<id>/edit#gid=0
     4. Bentuk CSV lain      → dipakai apa adanya

   ⚠️ KENAPA BENTUK 2 DITANGANI KHUSUS
   Setelah menekan Publish, yang Google tampilkan di layar adalah
   alamat `pubhtml` — halaman HTML, bukan data. Itulah yang paling
   mungkin disalin orang, dan memang itu yang terjadi 19 Okt 2026.

   Versi lama mencocokkan `/spreadsheets/d/([a-zA-Z0-9-_]+)`. Pada
   alamat terbitan, ruas setelah `/d/` adalah huruf `e` (jalurnya
   `/d/e/2PACX-.../pubhtml`), sehingga yang tertangkap sebagai ID
   spreadsheet adalah "e". Hasilnya alamat gviz yang menunjuk ke
   spreadsheet yang tidak ada, dan papan menampilkan galat yang
   menyesatkan: seolah tab belum di-publish, padahal sudah.

   Sekarang bentuk terbitan dikenali lebih dulu dan diubah menjadi
   `pub?...&output=csv`, yang memang alamat data dari tab yang sama.
================================================================ */
function normalkanAlamat(url) {
  const s = String(url || '').trim();
  if (!s) return '';
  if (s.includes('output=csv') || s.includes('tqx=out:csv')) return s;

  const gid = (s.match(/[#&?]gid=(\d+)/) || [])[1] || '0';

  // Bentuk terbitan: /spreadsheets/d/e/<token>/pubhtml  atau  /pub
  const terbit = s.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)\/pub/);
  if (terbit) {
    return `https://docs.google.com/spreadsheets/d/e/${terbit[1]}/pub?gid=${gid}&single=true&output=csv`;
  }

  // Alamat Sheet biasa → gviz. Hanya bekerja bila spreadsheet dibagikan
  // "Anyone with the link"; Publish to web lebih sempit dan lebih aman.
  const biasa = s.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!biasa) return s;

  return `https://docs.google.com/spreadsheets/d/${biasa[1]}/gviz/tq?tqx=out:csv&gid=${gid}`;
}


/* ================================================================
   SATU-SATUNYA TEMPAT YANG MENYENTUH JARINGAN
   ----------------------------------------------------------------
   Dipisah dari ambilTimeline() dengan sengaja. Kalau kelak deploy
   hold Apps Script dicabut dan timeline dipindah ke action=timeline,
   fungsi INI saja yang diganti. Bentuk kembalian ambilTimeline()
   tidak berubah, jadi komponen papannya tidak perlu disentuh.
================================================================ */
async function ambilCsv(alamat) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(alamat, { method: 'GET', redirect: 'follow', signal: controller.signal });
    if (!res.ok) {
      return { ok: false, message: `Sheet menolak permintaan (kode ${res.status}). Pastikan tab sudah di-publish ke web.` };
    }

    const teks = await res.text();

    /* Kalau tab belum di-publish, Google membalas halaman HTML (login
       atau "you need permission") dengan status 200 — jadi res.ok saja
       tidak cukup untuk menyimpulkan berhasil. */
    if (/^\s*<(!doctype|html)/i.test(teks)) {
      return {
        ok: false,
        message: 'Sheet membalas halaman HTML, bukan data. Tab-nya kemungkinan belum di-publish ke web sebagai CSV.'
      };
    }

    return { ok: true, teks };

  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, message: 'Permintaan terlalu lama. Periksa koneksi internet.' };
    }
    return { ok: false, message: 'Tidak bisa menghubungi Google Sheet. Periksa koneksi, atau pengaturan publish tab-nya.' };
  } finally {
    clearTimeout(timer);
  }
}


/**
 * Ambil timeline bimbingan dari Google Sheet.
 *
 * @returns {Promise<{ok: boolean, siap: boolean, tahapan?: string[], mahasiswa?: array, message?: string}>}
 *   siap=false berarti alamat CSV belum diisi di config.js. Itu BUKAN
 *   galat — komponen menampilkan petunjuk pemasangan, bukan pesan merah.
 */
export async function ambilTimeline() {
  const alamat = normalkanAlamat(TIMELINE_CSV_URL);
  if (!alamat) {
    return { ok: false, siap: false, message: 'Alamat CSV timeline belum diisi di src/config.js.' };
  }

  const hasil = await ambilCsv(alamat);
  if (!hasil.ok) return { ok: false, siap: true, message: hasil.message };

  {
    const baris = uraiCsv(hasil.teks);
    if (baris.length < 2) {
      return { ok: true, siap: true, tahapan: [], mahasiswa: [] };
    }

    const judul = baris[0];
    const petaTetap = {};   // nama kolom tetap → indeks
    const tahapan = [];     // { judul, indeks } urut sesuai Sheet

    judul.forEach((j, i) => {
      const bersih = String(j || '').trim();
      if (!bersih) return;
      const tetap = kenaliKolom(bersih);
      if (tetap) {
        // Kolom tetap pertama yang menang, kalau kebetulan ada dua yang mirip
        if (petaTetap[tetap] === undefined) petaTetap[tetap] = i;
      } else {
        tahapan.push({ judul: bersih, indeks: i });
      }
    });

    const mahasiswa = baris.slice(1).map((r, nomor) => {
      const ambil = (kunci) => {
        const i = petaTetap[kunci];
        return i === undefined ? '' : String(r[i] == null ? '' : r[i]).trim();
      };

      const nama = ambil('nama');
      if (!nama) return null;   // baris tanpa nama = baris sisa, bukan data

      // Kolom Tampilkan diisi "n"/"tidak"/"no"/"FALSE" → baris disembunyikan
      const tampil = ambil('tampilkan').toLowerCase();
      if (['n', 'no', 'tidak', 'false', '0', 'arsip', 'lulus'].includes(tampil)) return null;

      const langkah = tahapan.map((t) => ({
        judul: t.judul,
        ...bacaTahap(r[t.indeks])
      }));

      /* Persentase besar di kolom kiri papan.

         Kalau Sheet menyediakan kolom Progres, angka ITU yang dipakai —
         ia datang dari perhitungan berbobot di workbook dan merupakan
         satu-satunya angka yang benar. Lihat catatan panjang di
         KOLOM_TETAP.progres.

         Kalau tidak ada, jatuh ke rata-rata datar semua tahap. Tahap
         "terkendala" ikut dihitung dengan progres apa adanya — kalau
         tidak, mahasiswa yang satu tahapnya macet akan tampak mundur
         dibanding yang tahapnya belum disentuh sama sekali. */
      const dariSheet = bacaPersen(ambil('progres'));
      const total = dariSheet !== null
        ? dariSheet
        : langkah.length
          ? Math.round(langkah.reduce((a, l) => a + l.persen, 0) / langkah.length)
          : 0;

      return {
        kunci:      ambil('nim') || `baris-${nomor}`,
        nama,
        nim:        ambil('nim'),
        pembimbing: ambil('pembimbing'),
        topik:      ambil('topik'),
        catatan:    ambil('catatan'),
        langkah,
        persen:     total,
        adaKendala: langkah.some((l) => l.keadaan === 'terkendala'),
        // Tahap yang sedang dikerjakan = tahap berjalan/terkendala pertama,
        // atau tahap belum pertama kalau tidak ada yang sedang jalan.
        tahapSekarang:
          langkah.find((l) => l.keadaan === 'berjalan' || l.keadaan === 'terkendala')
          || langkah.find((l) => l.keadaan === 'belum')
          || null,
      };
    }).filter(Boolean);

    return {
      ok: true,
      siap: true,
      tahapan: tahapan.map((t) => t.judul),
      mahasiswa,
    };
  }
}
