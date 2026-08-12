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
   STATISTIK PENGUNJUNG — KODE BERBAGI UMAMI
   ----------------------------------------------------------------
   CARA MENGISI:
     Umami → Settings → Websites → Torgas → Edit → aktifkan "Share URL".
     Tautannya berbentuk:

       https://cloud.umami.is/share/AbCdEf123456/torgasblueenergy.com
                                    ^^^^^^^^^^^^ salin bagian ini saja

   Selama masih kosong, bagian statistik di footer TIDAK ditampilkan
   sama sekali — bukan tampil kosong atau bernilai nol. Mengisi baris
   ini adalah satu-satunya langkah untuk menyalakannya.

   ⚠️ Kode ini memang dirancang untuk terbuka: ia tertanam di dalam
   berkas situs dan bisa dibaca siapa pun. Karena itu JANGAN PERNAH
   menaruh API key Umami di sini — API key memberi akses penuh ke akun
   analitik, sedangkan kode berbagi hanya memberi akses baca ke satu
   situs. Keduanya terlihat mirip, akibatnya jauh berbeda.

   ⚠️ Siapa pun yang menemukan kode ini bisa membuka dasbor Umami
   Torgas: jumlah pengunjung, halaman terpopuler, negara asal, dan
   sumber rujukan. Tidak ada data pribadi pengunjung di sana karena
   Umami tidak memakai cookie. Ini konsekuensi yang sudah disetujui
   Mahdan pada 13 Agu 2026 demi bisa tayang tanpa menunggu penerbitan
   Apps Script. Untuk menutupnya kembali: kosongkan baris ini dan
   matikan "Share URL" di Umami. */
const UMAMI_SHARE_ID = 'HLW2ykFzLctTxABx';

/* Ambang tampil. Bagian statistik baru muncul setelah total pengunjung
   melewati angka ini. Tujuannya agar situs resmi tidak memajang
   "8 pengunjung" saat masih sepi — angka kecil justru merugikan di
   mata calon mitra. Isi 0 untuk selalu menampilkan. */
const STATISTIK_AMBANG_MINIMUM = 0;

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

export {
  WEBAPI_URL, STUDENT_PORTAL_CODE, NO_WEBP, HERO_VIDEO, HERO_VIDEO_POSTER,
  UMAMI_SHARE_ID, STATISTIK_AMBANG_MINIMUM
};
