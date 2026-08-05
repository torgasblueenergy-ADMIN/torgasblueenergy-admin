/* ================================================================
   DATA PUBLIKASI & BERITA (TANPA SUMMARY)
================================================================ */
/* Judul kedua publikasi ilmiah di bawah SENGAJA dibiarkan berbahasa
   Indonesia — itu judul resmi karyanya, dan judul karya tidak diterjemahkan.
   Keterangan di bawahnya tulisan situs sendiri, jadi ikut berbahasa Inggris.
   (Keputusan Mahdan, 5 Agu 2026) */
const ARTIKEL_ILMIAH = [
  {
    id: 'pub-1',
    title: 'Pengembangan Telemetri USV Berbasis IoT untuk Pemantauan Kualitas Air Pesisir',
    category: 'artikel-ilmiah',
    categoryLabel: 'Scientific Articles',
    date: '15 May 2026',
    author: 'TORGAS Research Team',
    image: 'images/projects/Biosystem-Engineering.jpg',
    content: `A scientific publication on integrating low-power wireless sensors into an autonomous monitoring vessel for real-time hydro-oceanographic data acquisition.

The telemetry system measures the physical and chemical parameters of coastal waters — temperature, salinity, pH, and turbidity — continuously. Readings are transmitted wirelessly to a shore station for further analysis in support of marine ecosystem conservation.`
  },
  {
    id: 'pub-3',
    title: 'Studi Potensi Rendemen Biogas Murni dari Fermentasi Makroalga Pesisir',
    category: 'artikel-ilmiah',
    categoryLabel: 'Scientific Articles',
    date: '18 March 2026',
    author: 'Bioenergy Laboratory Team',
    image: 'images/projects/biomassa.jpg',
    content: `Results from anaerobic co-digestion experiments on seaweed and coastal biomass samples, measuring the efficiency of pure CH4 production.

The study focuses on optimizing biomass pre-treatment to raise the rate of methane formation as a clean, renewable energy source.`
  }
];

const NEWS_DATA = [
  {
    id: 'pub-2',
    title: 'TORGAS Blue Energy Expands Its Coastal Marine Research Station in Pangandaran',
    category: 'news',
    categoryLabel: 'News',
    date: '02 April 2026',
    author: 'TORGAS Public Relations',
    image: 'images/Homepage/Homepage-2.jpg',
    content: `Torgas Blue Energy has officially expanded its marine research station facilities in Pangandaran.

The expansion supports marine biodiversity survey expeditions, blue carbon stock monitoring, and testing of autonomous marine vessels along the southern coast of Java.`
  },
  {
    id: 'pub-4',
    title: 'Field Visit & Marine Monitoring Technology Workshop in Jatinangor',
    category: 'news',
    categoryLabel: 'News',
    date: '10 February 2026',
    author: 'TORGAS Public Relations',
    image: 'images/Homepage/Homepage-3.jpg',
    content: `A workshop demonstrating telemetry instruments and water filtration systems, held with young researchers and the academic community at the Jatinangor Integrated Laboratory.

The activity aims to strengthen collaboration in national maritime technology research.`
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
    title: 'Torgas Blue Energy Profile',
    category: 'video',
    categoryLabel: 'Video',
    date: '3 August 2026',
    author: 'Torgas Blue Energy',

    // ⚠️ GANTI dengan kode video YouTube milik Torgas
    youtubeId: 'GANTI_DENGAN_ID_VIDEO',

    content: `A profile video of Torgas Blue Energy — an integrated marine research laboratory in Jatinangor, Sumedang.

Replace this title, date, and description with the details of the actual video.`
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
