/* ================================================================
   TITIK PETA — KOLABORATOR & LOKASI PENELITIAN
   ----------------------------------------------------------------
   REVISI PAK TORA 4/8/2026 poin #19 + #22, diperjelas Galuh 5/8/2026:
   satu peta, dua lapisan yang bisa dinyalakan bergantian.

   ⚠️ SELURUH KOORDINAT DI BAWAH BELUM DIVERIFIKASI TIM.
   Nama lembaganya saya kenali dari berkas logonya, lalu koordinatnya
   saya isi dari pengetahuan umum letak kampus masing-masing. Titiknya
   menunjuk ke kampus utama — bukan ke fakultas atau laboratorium
   tempat kerja sama sesungguhnya berlangsung.

   Untuk peta lembaga riset, salah menempatkan titik lebih buruk
   daripada tidak menampilkannya. Mohon Galuh atau Pak Tora memeriksa
   sekali sebelum ini dianggap final.

   ── KOREKSI 5 Agu 2026 dari Mahdan ──
   univ-6 sempat saya baca sebagai "University Scuba International"
   dari logonya. SALAH — yang benar University of Tsukuba, Jepang.
   Bukti bahwa mengenali lembaga dari gambar logo bisa meleset, dan
   daftar ini memang perlu dibaca ulang oleh yang tahu.

   Cara mengoreksi: buka Google Maps, klik kanan di titik yang benar,
   angka pertama yang muncul adalah `lat`, yang kedua `lng`.
================================================================ */

/* ── LAPISAN 1: SEBARAN KOLABORATOR ──────────────────────────── */
const TITIK_KOLABORATOR = [
  // ── Indonesia ──
  { id: 'univ-1',  nama: 'BRIN — Badan Riset dan Inovasi Nasional', kota: 'Jakarta',            lat: -6.1876, lng: 106.8271 },
  { id: 'univ-9',  nama: 'Universitas Indonesia',                   kota: 'Depok',              lat: -6.3617, lng: 106.8272 },
  { id: 'univ-13', nama: 'Universitas Negeri Jakarta',              kota: 'Jakarta',            lat: -6.1943, lng: 106.8797 },
  { id: 'univ-15', nama: 'Universitas Terbuka',                     kota: 'Tangerang Selatan',  lat: -6.3117, lng: 106.7085 },
  { id: 'univ-10', nama: 'Universitas Gadjah Mada',                 kota: 'Yogyakarta',         lat: -7.7713, lng: 110.3776 },
  { id: 'univ-14', nama: 'Universitas Diponegoro',                  kota: 'Semarang',           lat: -7.0509, lng: 110.4381 },
  { id: 'univ-11', nama: 'Universitas Airlangga',                   kota: 'Surabaya',           lat: -7.2698, lng: 112.7583 },
  { id: 'univ-12', nama: 'Universitas Brawijaya',                   kota: 'Malang',             lat: -7.9526, lng: 112.6137 },

  // ── Asia ──
  { id: 'univ-4',  nama: 'Xiamen University',                       kota: 'Xiamen, Tiongkok',   lat: 24.4364, lng: 118.0954 },
  { id: 'univ-5',  nama: 'IOCAS — Institute of Oceanology, CAS',    kota: 'Qingdao, Tiongkok',  lat: 36.0662, lng: 120.3800 },
  { id: 'univ-6',  nama: 'University of Tsukuba',                   kota: 'Tsukuba, Jepang',    lat: 36.1096, lng: 140.1017 },
  { id: 'univ-16', nama: 'National Chung Hsing University',         kota: 'Taichung, Taiwan',   lat: 24.1220, lng: 120.6748 },
  { id: 'univ-17', nama: 'National Dong Hwa University',            kota: 'Hualien, Taiwan',    lat: 23.8991, lng: 121.5450 },
  { id: 'univ-7',  nama: 'INTI International University',           kota: 'Nilai, Malaysia',    lat:  2.8137, lng: 101.7920 },
  { id: 'univ-8',  nama: 'Universiti Teknologi Malaysia',           kota: 'Johor Bahru',        lat:  1.5587, lng: 103.6376 },

  // ── Amerika ──
  { id: 'univ-2',  nama: 'Rutgers, The State University of New Jersey', kota: 'New Brunswick, AS', lat: 40.5008, lng: -74.4474 },
  { id: 'univ-3',  nama: 'Weill Cornell Medicine — Cornell University', kota: 'New York, AS',      lat: 40.7648, lng: -73.9540 },

  // ── Mitra masyarakat ──
  { id: 'lsm-1',   nama: 'POKMASWAS Bulak Setra',                   kota: 'Pangandaran, Jawa Barat',  lat: -7.6883, lng: 108.6500, komunitas: true },
  { id: 'lsm-2',   nama: 'POKMASWAS Pandanan',                      kota: 'Taman Laut Pandanan, Lombok Utara', lat: -8.3750, lng: 116.0620, komunitas: true },

  /* Kedua titik komunitas di atas menunjuk ke kawasan, bukan ke sekretariat
     kelompoknya. Kalau ada koordinat yang lebih tepat, silakan diganti. */
];

/* ── LAPISAN 2: LOKASI PENELITIAN ────────────────────────────── */
/* ⚠️ Daftar ini disusun dari lokasi yang SUDAH DISEBUT di halaman
   Research Projects dan Publications situs ini — bukan dari daftar
   resmi ekspedisi. Notulen poin #19 meminta "titik lokasi yang sudah
   dikerjakan", dan daftar itu belum pernah diberikan.

   Mohon dilengkapi: lokasi ekspedisi lain, tahunnya, dan jenis
   kegiatannya. */
const TITIK_PENELITIAN = [
  { id: 'r-jatinangor', nama: 'Laboratorium Terpadu Jatinangor', kota: 'Sumedang, Jawa Barat', lat: -6.9270, lng: 107.7730, jenis: 'Laboratorium utama', markas: true },
  { id: 'r-pangandaran', nama: 'Stasiun Riset Pesisir Pangandaran', kota: 'Pangandaran, Jawa Barat', lat: -7.6883, lng: 108.6500, jenis: 'Stasiun riset pesisir', markas: true },

  // Disebut pada proyek "Carbon storage and radiocarbon dating"
  { id: 'r-surabaya',  nama: 'Surabaya',  kota: 'Jawa Timur', lat: -7.2575, lng: 112.7521, jenis: 'Carbon storage & radiocarbon dating' },
  { id: 'r-gresik',    nama: 'Gresik',    kota: 'Jawa Timur', lat: -7.1560, lng: 112.6560, jenis: 'Carbon storage & radiocarbon dating' },
  { id: 'r-pasuruan',  nama: 'Pasuruan',  kota: 'Jawa Timur', lat: -7.6450, lng: 112.9080, jenis: 'Carbon storage & radiocarbon dating' },
  { id: 'r-malang',    nama: 'Malang',    kota: 'Jawa Timur', lat: -7.9666, lng: 112.6326, jenis: 'Carbon storage & radiocarbon dating' },
];

export { TITIK_KOLABORATOR, TITIK_PENELITIAN };
