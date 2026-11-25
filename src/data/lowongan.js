/* ================================================================
   DAFTAR POSISI LOWONGAN — Junior Scientist & kontrak proyek
   ----------------------------------------------------------------
   Dibuat 19 Nov 2026 dari flyer "We Are Hiring" (deadline tertulis
   25 November 2026).

   ⚠️ DAFTAR KEMBAR. Peta POSISI_CAREER di apps-script/live/Code.js
   memuat kode dan nama posisi yang sama. Yang tampil di dropdown
   pelamar berasal dari berkas ini; backend memakai salinannya hanya
   untuk menuliskan nama posisi yang rapi di email dan sheet. Kalau
   salah satu diubah, ubah keduanya.

   Kenapa tidak satu sumber saja: Apps Script berjalan di Google dan
   tidak bisa mengimpor berkas dari repositori ini. Pilihannya cuma
   menyalin, atau mengirim nama posisi mentah dari browser — dan yang
   kedua berarti siapa pun bisa menulis apa saja ke kolom Posisi.
   Backend sengaja TIDAK menolak kode asing, hanya mencatat apa
   adanya, supaya lamaran tidak pernah hilang diam-diam kalau kedua
   daftar ini sempat berbeda.
================================================================ */

/* `syarat` = keahlian teknis khusus yang diminta flyer untuk posisi
   itu. Dipakai sebagai petunjuk di kolom Keahlian Teknis, bukan
   sebagai penyaring — pelamar tetap boleh menulis apa pun. */
const POSISI_LOWONGAN = [
  {
    kelompok: 'Junior Scientist',
    daftar: [
      { kode: 'GM', nama: 'Genetics and Metabolomics',                   syarat: 'Bioinformatics' },
      { kode: 'BC', nama: 'Blue Carbon and Carbon Research',             syarat: 'Carbon Dating' },
      { kode: 'HE', nama: 'Heavy Metals and Environmental Contamination', syarat: 'ICP-OES' },
      { kode: 'MR', nama: 'Microplastics Research',                      syarat: 'FTIR analysis' },
      { kode: 'OH', nama: 'Ocean Hydrology',                             syarat: 'Remote Sensing' },
      { kode: 'MB', nama: 'Marine Biosystem Engineering',                syarat: 'Bacterial System' },
      { kode: 'CB', nama: 'Coral Reef Biogeochemistry',                  syarat: 'Scuba Diving' },
    ],
  },
  {
    kelompok: 'Project-Based Contract',
    daftar: [
      { kode: 'WI', nama: 'Wastewater Instrumentation Assessment',       syarat: 'Wastewater Instrumentation' },
    ],
  },
];

/* Pencarian cepat kode → posisi, dipakai form untuk menampilkan
   petunjuk keahlian begitu pelamar memilih posisi. */
const POSISI_PER_KODE = {};
POSISI_LOWONGAN.forEach((grup) => {
  grup.daftar.forEach((p) => {
    POSISI_PER_KODE[p.kode] = { ...p, kelompok: grup.kelompok };
  });
});

/* Nama lengkap yang dikirim ke backend, mis.
   "Junior Scientist — Ocean Hydrology". */
function namaPosisiLengkap(kode) {
  const p = POSISI_PER_KODE[kode];
  return p ? `${p.kelompok} — ${p.nama}` : '';
}

/* Tenggat yang tertulis di flyer, untuk ditampilkan ke pelamar. */
const TENGGAT_LOWONGAN = '25 November 2026';

/* ================================================================
   PENUTUPAN OTOMATIS — diputuskan Mahdan 25 Nov 2026

   Semula (19 Nov) formulir sengaja dibiarkan terbuka tanpa batas dan
   penutupannya diserahkan ke manusia. Keputusan itu diubah: portal
   menutup sendiri pada 25 Nov 2026 pukul 23.59 WIB.

   ⚠️ KENAPA DITULIS LENGKAP DENGAN ZONA WAKTU
   Nilai di bawah adalah SATU TITIK WAKTU MUTLAK, bukan "jam 23.59 di
   tempat pengunjung". Pelamar bisa membuka situs dari mana saja, dan
   jam di komputernya bisa salah atau beda zona. Dengan menulis
   +07:00, pelamar di Makassar, Jayapura, maupun luar negeri semuanya
   tertutup pada detik yang sama, yaitu 23.59 WIB.

   ⚠️ INI BARU SEPARUH PENGAMANNYA
   Pemeriksaan di sini hanya menyembunyikan formulir. Siapa pun bisa
   memanggil endpoint backend langsung. Penolakan yang sesungguhnya
   ada di handleCareer() pada apps-script/live/Code.js, yang memakai
   tenggat yang sama. Kalau tanggal ini diubah, UBAH JUGA DI SANA.
================================================================ */
const TUTUP_PENDAFTARAN = '2026-11-25T23:59:59+07:00';

function pendaftaranDitutup(sekarang = new Date()) {
  const batas = Date.parse(TUTUP_PENDAFTARAN);
  if (Number.isNaN(batas)) return false;   // salah tulis tanggal → jangan menutup diam-diam
  return sekarang.getTime() > batas;
}

export {
  POSISI_LOWONGAN, POSISI_PER_KODE, namaPosisiLengkap,
  TENGGAT_LOWONGAN, TUTUP_PENDAFTARAN, pendaftaranDitutup,
};
