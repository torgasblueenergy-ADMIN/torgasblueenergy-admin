/* ================================================================
   DATA TORGAS BLUE ENERGY (100% SAMA SEPERTI ORIGINAL)
================================================================ */
/* Endpoint Google Apps Script penerima seluruh formulir.
   Diperbarui 4/8/2026 dari Galuh — URL deployment yang aktif.
   Kalau Apps Script di-deploy ulang dengan versi baru, URL ini ikut berubah
   dan HARUS diperbarui di sini. */
const WEBAPI_URL = 'https://script.google.com/macros/s/AKfycbyOiKlR8jksYqNxwkHYCaqgDgcHhnMQMeSNXm7aZYXMac4Caxeb6Z4JiOxeuUXqwPg/exec';

/* Kode akses Student Portal — ubah di SATU tempat ini saja.
   Lihat catatan keamanan di komponen StudentCodeModal. */
/* ⚠️ WAJIB huruf kapital semua. StudentCodeModal membandingkan dengan
      `code.trim().toUpperCase()`, jadi kalau ditulis huruf kecil di sini,
      kode tersebut TIDAK AKAN PERNAH cocok — pengguna selalu ditolak.
      Pengguna tetap boleh mengetik huruf kecil; input mereka otomatis
      diubah jadi kapital sebelum dibandingkan. */
const STUDENT_PORTAL_CODE = 'TORGAS18JAYA';

/* ================================================================
   SMART IMAGE — sajikan WebP, otomatis mundur ke format asli
   ----------------------------------------------------------------
   Browser modern mengambil <source> WebP (rata-rata 69% lebih ringan).
   Browser lama mengabaikannya dan memakai <img> biasa, jadi tidak ada
   yang rusak. File asli sengaja TIDAK dihapus agar fallback tetap jalan.
================================================================ */

/* 4 gambar ini justru MEMBENGKAK saat dikonversi (aslinya sudah sangat
   terkompresi), jadi selalu disajikan dalam format aslinya. */
const NO_WEBP = new Set([
  'images/Brosur/Brosur-1.jpg',
  'images/Homepage/Homepage-2.jpg',
  'images/Homepage/Homepage-3.jpg',
  'images/Homepage/Homepage-4.jpg'
]);

/* ================================================================
   VIDEO LATAR HALAMAN DEPAN — REVISI PAK TORA poin #20
   ----------------------------------------------------------------
   Isi dengan alamat berkas video, misalnya 'videos/hero.mp4'.
   Berkasnya ditaruh di  public/videos/

   Dikosongkan ('') = Hero kembali memakai empat foto bergantian
   seperti sebelumnya. Tidak ada yang rusak, tidak ada kotak hitam.

   ⚠️ TIGA HAL YANG TIDAK BISA DITAWAR:

   1. TANPA SUARA. Chrome, Safari, dan Firefox memblokir pemutaran
      otomatis yang bersuara. Video ini dipasang `muted` secara paksa —
      jangan dilepas, karena videonya justru tidak akan jalan sama sekali.

   2. UKURAN BERKAS. Setiap pengunjung mengunduhnya. Di atas ~15 MB,
      halaman depan terasa berat di jaringan seluler. Kompres dulu.

   3. TETAP BERMAKNA TANPA SUARA. Kalau isinya wawancara atau narasi,
      video ini bukan tempatnya — pengunjung tidak akan mendengar apa pun.
================================================================ */
const HERO_VIDEO = '';

/* Gambar yang tampil selagi video dimuat, dan pada pengunjung yang
   videonya sengaja tidak diputar (lihat Hero.jsx). */
const HERO_VIDEO_POSTER = 'images/Homepage/Homepage-1.jpg';

export { WEBAPI_URL, STUDENT_PORTAL_CODE, NO_WEBP, HERO_VIDEO, HERO_VIDEO_POSTER };
