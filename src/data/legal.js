const LEGAL_INFO = {
  name: "TORGAS BLUE ENERGY",
  nib: "<KOSONG>",
  ahu: "<KOSONG>",
  status: "<KOSONG>",
  bases: "Jatinangor & Pangandaran, Jawa Barat",
  focus: "Riset Kelautan, Energi Biomassa Laut, & Sistem Pemantauan Otonom"
};

/* ================================================================
   HALAMAN KHUSUS: MITRA & KOLABORATOR (Universitas & LSM)
   Diperbarui: Menghapus efek grayscale agar warna asli logo langsung tampil
================================================================ */
/* ================================================================
   HALAMAN LEGAL — KEBIJAKAN PRIVASI & KETENTUAN LAYANAN
   ----------------------------------------------------------------
   ⚠️ DRAFT. Disusun berdasarkan data yang benar-benar dikumpulkan
   website ini (form magang, part-time, booking lab, student portal)
   yang seluruhnya dikirim ke Google Apps Script → Google Sheets.
   Mohon ditinjau penasihat hukum sebelum dijadikan acuan resmi.
================================================================ */
const LEGAL_UPDATED = '3 Agustus 2026';

const LEGAL_CONTENT = {
  privacy: {
    title: 'Kebijakan Privasi',
    intro: 'Kebijakan ini menjelaskan data apa yang kami kumpulkan melalui situs Torgas Blue Energy, untuk apa data itu digunakan, dan hak apa yang Anda miliki atas data tersebut.',
    sections: [
      {
        h: '1. Data yang Kami Kumpulkan',
        p: 'Kami hanya mengumpulkan data yang Anda isikan sendiri pada formulir di situs ini. Kami tidak membeli maupun menerima data pribadi dari pihak ketiga.',
        list: [
          'Formulir Magang & Part-Time: nama lengkap, NIM, email, nomor telepon, universitas, program studi, IPK, nama dosen pembimbing, dan topik yang diusulkan.',
          'Formulir Pemesanan Laboratorium: nama, instansi, kontak, jenis layanan, dan kebutuhan pengujian.',
          'Student Portal: catatan progres riset, jadwal mentoring, dan pengajuan kebutuhan alat.',
          'Kami TIDAK mengumpulkan data pembayaran, NIK, maupun data biometrik.'
        ]
      },
      {
        h: '2. Bagaimana Data Digunakan',
        p: 'Data yang Anda kirim digunakan semata-mata untuk keperluan operasional laboratorium:',
        list: [
          'Menyeleksi dan menghubungi pelamar magang serta part-time.',
          'Menjadwalkan dan menyiapkan layanan pengujian laboratorium.',
          'Memantau perkembangan riset mahasiswa bimbingan.',
          'Menyusun statistik internal dalam bentuk agregat (tanpa identitas perorangan).'
        ]
      },
      {
        h: '3. Penyimpanan Data',
        p: 'Data formulir dikirim melalui Google Apps Script dan disimpan di Google Workspace (Google Sheets) milik Torgas Blue Energy. Akses dibatasi hanya untuk pengurus yang berkepentingan. Google bertindak sebagai pemroses data dan tunduk pada kebijakan privasi Google.'
      },
      {
        h: '4. Berbagi Data dengan Pihak Lain',
        p: 'Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi Anda. Data hanya dibagikan apabila:',
        list: [
          'Anda memberikan persetujuan tertulis lebih dahulu.',
          'Diperlukan oleh universitas mitra dalam rangka administrasi magang atau kerja praktik Anda.',
          'Diwajibkan oleh peraturan perundang-undangan atau permintaan resmi aparat yang berwenang.'
        ]
      },
      {
        h: '5. Masa Simpan',
        p: 'Data pelamar yang tidak diterima dihapus paling lambat 12 bulan setelah proses seleksi berakhir. Data peserta magang dan pengguna layanan laboratorium disimpan selama diperlukan untuk dokumentasi riset dan kewajiban pelaporan institusi.'
      },
      {
        h: '6. Hak Anda',
        p: 'Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda berhak untuk:',
        list: [
          'Meminta salinan data pribadi Anda yang kami simpan.',
          'Meminta koreksi atas data yang keliru atau tidak lengkap.',
          'Meminta penghapusan data Anda.',
          'Menarik persetujuan yang sebelumnya telah Anda berikan.'
        ],
        after: 'Permintaan dapat dikirim ke torgasblueenergy@gmail.com dan akan kami tanggapi dalam waktu 14 hari kerja.'
      },
      {
        h: '7. Cookie, Statistik & Pelacakan',
        p: 'Situs ini tidak memasang cookie pelacakan maupun iklan, dan tidak mengikuti aktivitas Anda di situs lain. Kunjungan diukur memakai layanan analitik tanpa cookie yang hanya mengumpulkan data agregat:',
        list: [
          'Jumlah kunjungan dan halaman yang dibuka.',
          'Perkiraan negara atau kota asal kunjungan.',
          'Jenis perangkat dan peramban yang digunakan.',
          'Tautan sumber yang membawa Anda ke situs ini.'
        ],
        after: 'Data ini bersifat agregat — kami TIDAK dapat mengetahui identitas pengunjung secara perorangan. Alamat IP hanya diproses sesaat untuk memperkirakan lokasi dan tidak disimpan. Bila peramban Anda mengaktifkan "Do Not Track", statistik tidak dikumpulkan sama sekali. Font juga dimuat dari Google Fonts, sehingga alamat IP Anda dapat tercatat oleh Google sebagai bagian dari proses pengiriman font tersebut.'
      },
      {
        h: '8. Perubahan Kebijakan',
        p: 'Kebijakan ini dapat diperbarui sewaktu-waktu. Tanggal pembaruan terakhir selalu dicantumkan di bagian atas halaman ini.'
      }
    ]
  },
  terms: {
    title: 'Ketentuan Layanan',
    intro: 'Dengan mengakses situs Torgas Blue Energy dan menggunakan layanan yang tersedia di dalamnya, Anda dianggap menyetujui ketentuan berikut.',
    sections: [
      {
        h: '1. Tentang Kami',
        p: 'Torgas Blue Energy menjalankan laboratorium riset kelautan terintegrasi di Jatinangor, Sumedang, Jawa Barat, dengan stasiun riset pesisir di Pangandaran. Kami bergerak di bidang teknologi pemantauan laut otonom dan energi bersih berbasis biomassa laut.'
      },
      {
        h: '2. Penggunaan Situs',
        p: 'Anda setuju untuk tidak:',
        list: [
          'Mengirimkan data palsu, menyesatkan, atau menyamar sebagai orang lain pada formulir mana pun.',
          'Mencoba mengakses Student Portal atau bagian lain tanpa izin.',
          'Mengganggu, membebani, atau merusak layanan dan infrastruktur situs.',
          'Mengambil konten situs secara otomatis (scraping) tanpa izin tertulis.'
        ]
      },
      {
        h: '3. Layanan Laboratorium',
        p: 'Pemesanan yang dikirim melalui situs ini bersifat permintaan, bukan kontrak yang mengikat. Setiap pemesanan masih menunggu konfirmasi ketersediaan alat, jadwal, dan kesepakatan biaya. Harga yang ditampilkan bersifat indikatif dan dapat berubah sesuai parameter serta jumlah sampel.'
      },
      {
        h: '4. Hasil Pengujian & Data Riset',
        p: 'Hasil pengujian laboratorium berlaku hanya untuk sampel yang diserahkan. Torgas Blue Energy tidak bertanggung jawab atas kekeliruan yang bersumber dari kesalahan pengambilan, penanganan, atau pengangkutan sampel oleh pengguna. Publikasi yang memuat hasil pengujian kami wajib mencantumkan atribusi yang sesuai.'
      },
      {
        h: '5. Magang & Part-Time',
        p: 'Pengiriman formulir tidak menjamin diterimanya lamaran. Seleksi mempertimbangkan kesesuaian bidang, kapasitas pembimbing, dan ketersediaan kuota. Peserta yang diterima wajib mematuhi prosedur keselamatan laboratorium dan menjaga kerahasiaan data riset yang belum dipublikasikan.'
      },
      {
        h: '6. Hak Kekayaan Intelektual',
        p: 'Seluruh konten situs — teks, logo, foto, dan materi riset — merupakan milik Torgas Blue Energy, kecuali dinyatakan lain. Penggunaan untuk keperluan akademik diperbolehkan dengan mencantumkan sumber. Penggunaan komersial memerlukan izin tertulis.'
      },
      {
        h: '7. Batasan Tanggung Jawab',
        p: 'Situs ini disediakan apa adanya. Kami berupaya menjaga keakuratan informasi, namun tidak menjamin situs bebas dari kesalahan atau selalu dapat diakses. Torgas Blue Energy tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan situs ini.'
      },
      {
        h: '8. Hukum yang Berlaku',
        p: 'Ketentuan ini tunduk pada hukum Republik Indonesia. Perselisihan akan diupayakan diselesaikan secara musyawarah sebelum ditempuh jalur hukum.'
      }
    ]
  }
};

export { LEGAL_INFO, LEGAL_UPDATED, LEGAL_CONTENT };
