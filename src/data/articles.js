/* ================================================================
   DATA PUBLIKASI & BERITA (TANPA SUMMARY)
================================================================ */
const ARTIKEL_ILMIAH = [
  {
    id: 'pub-1',
    title: 'Pengembangan Telemetri USV Berbasis IoT untuk Pemantauan Kualitas Air Pesisir',
    category: 'artikel-ilmiah',
    categoryLabel: 'Scientific Articles',
    date: '15 Mei 2026',
    author: 'Tim Riset TORGAS',
    image: 'images/projects/Biosystem-Engineering.jpg',
    content: `Publikasi ilmiah mengenai integrasi sensor nirkabel berdaya rendah pada wahana pemantauan otonom untuk akuisisi data hidro-oseanografi real-time.

Sistem telemetri ini dirancang khusus untuk mengukur parameter fisik dan kimia perairan pesisir seperti suhu, salinitas, pH, dan kekeruhan air secara terus-menerus. Data dikirimkan secara nirkabel ke stasiun penerima di darat untuk dianalisis lebih lanjut guna mendukung konservasi ekosistem laut.`
  },
  {
    id: 'pub-3',
    title: 'Studi Potensi Rendemen Biogas Murni dari Fermentasi Makroalga Pesisir',
    category: 'artikel-ilmiah',
    categoryLabel: 'Scientific Articles',
    date: '18 Maret 2026',
    author: 'Tim Laboratorium Bioenergi',
    image: 'images/projects/biomassa.jpg',
    content: `Hasil eksperimen ko-digesti anaerobik sampel rumput laut dan biomassa pesisir dalam mengukur efisiensi produksi CH4 murni.

Penelitian ini berfokus pada optimasi pra-perlakuan biomassa untuk meningkatkan laju pembentukan gas metana sebagai sumber energi terbarukan ramah lingkungan.`
  }
];

const NEWS_DATA = [
  {
    id: 'pub-2',
    title: 'TORGAS Blue Energy Perluas Stasiun Riset Kelautan Pesisir di Pangandaran',
    category: 'news',
    categoryLabel: 'News',
    date: '02 April 2026',
    author: 'Humas TORGAS',
    image: 'images/Homepage/Homepage-2.jpg',
    content: `Torgas Blue Energy secara resmi memperluas fasilitas stasiun riset kelautan di Pangandaran.

Ekspansi ini ditujukan untuk mendukung kegiatan ekspedisi survei biodiversitas laut, pemantauan stok karbon biru, serta pengujian wahana laut otonom di lingkungan pesisir selatan Jawa.`
  },
  {
    id: 'pub-4',
    title: 'Kunjungan Lapangan & Workshop Teknologi Monitoring Laut di Jatinangor',
    category: 'news',
    categoryLabel: 'News',
    date: '10 Februari 2026',
    author: 'Humas TORGAS',
    image: 'images/Homepage/Homepage-3.jpg',
    content: `Pelaksanaan workshop demonstrasi alat telemetri dan sistem filtrasi air bersama para peneliti muda dan civitas akademika di Laboratorium Terpadu Jatinangor.

Kegiatan ini bertujuan memperkuat kolaborasi riset teknologi maritim nasional.`
  }
];

/* ================================================================
   DATA VIDEO YOUTUBE
   ----------------------------------------------------------------
   CARA MENAMBAH VIDEO BARU — cukup salin satu blok di bawah:

   1. Buka videonya di YouTube, lihat alamatnya:
        https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                        ^^^^^^^^^^^ ini youtubeId-nya
        https://youtu.be/dQw4w9WgXcQ
                         ^^^^^^^^^^^ sama saja

   2. Tempel kode itu ke `youtubeId`.

   Thumbnail TIDAK perlu diunggah — otomatis diambil dari YouTube.
   Videonya juga tetap dihosting YouTube, jadi tidak membebani situs.
================================================================ */
const VIDEO_DATA = [
  {
    id: 'vid-1',
    title: 'Profil Torgas Blue Energy',
    category: 'video',
    categoryLabel: 'Video',
    date: '3 Agustus 2026',
    author: 'Torgas Blue Energy',

    // ⚠️ GANTI dengan kode video YouTube milik Torgas
    youtubeId: 'GANTI_DENGAN_ID_VIDEO',

    content: `Video profil Torgas Blue Energy — laboratorium riset kelautan terintegrasi di Jatinangor, Sumedang.

Ganti judul, tanggal, dan keterangan ini sesuai isi video yang sebenarnya.`
  }
];

/* Thumbnail otomatis dari YouTube bila `image` tidak diisi sendiri.
   sddefault tersedia untuk hampir semua video; maxresdefault sering kosong
   pada video lama, jadi sengaja tidak dipakai. */
VIDEO_DATA.forEach((v) => {
  if (!v.image && v.youtubeId) {
    v.image = `https://img.youtube.com/vi/${v.youtubeId}/sddefault.jpg`;
  }
});

// Gabungkan seluruh data secara otomatis
const ARTICLES = [...ARTIKEL_ILMIAH, ...NEWS_DATA, ...VIDEO_DATA];

export { ARTIKEL_ILMIAH, NEWS_DATA, VIDEO_DATA, ARTICLES };
