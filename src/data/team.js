/* ================================================================
   DATA ANGGOTA LAB & TIM PENELITI (TERBAGI DALAM 4 SEKSI)
================================================================ */
const LAB_SECTIONS = [
  {
    category: "FOUNDERS & ADVISORS",
    subtitle: "Founder, Chief Advisor, and Strategic Research Advisor",
    members: [
      {
        id: "fa-1",
        name: "Buntora Pasaribu, Ph.D.",
        role: "Founder & Supervisor",
        focus: "Marine Science & Ocean Policy",
        photo: "images/People/Head/buntora-head.jpg",
        detailPhoto: "images/People/Body/buntora-body.jpg", // Foto kedua untuk Pop-up
        cvPdf: "cvs/buntora.pdf"                  // Path File PDF CV
      }
    ]
  },
  {
    category: "LEADERSHIP TEAM",
    subtitle: "Management Team & Operational Board of Directors",
    members: [
      {
        id: "lt-1",
        name: "David Ferdinand Sinaga",
        role: "CEO And Head of the Jatinangor Laboratory",
        focus: "Ocean Atmosphere Interaction And Carbon Sequestration",
        photo: "images/People/Head/david-head.jpg",
        detailPhoto: "images/People/Body/david-body.jpg",
        cvPdf: "cvs/david.pdf"
      },
      {
        /* Ditambahkan 21 Okt 2026 atas permintaan Mahdan, diletakkan
           tepat setelah CEO sesuai instruksinya.

           Id-nya lt-6, bukan lt-2, supaya lt-2 sampai lt-5 yang sudah
           ada tidak perlu digeser — urutan tampilan ditentukan posisi
           di dalam array ini, bukan angka pada id. Penomoran jadi tidak
           berurutan, tapi id lama tetap menunjuk orang yang sama. */
        id: "lt-6",
        name: "Ingghrid Ranesti Clarita Hadi, S.Si., M.Si.",
        role: "Head of Torgas Laboratory",
        /* `focus` dan `cvPdf` dikosongkan: tidak ada keterangan bidang
           maupun CV yang diberikan, dan menebaknya berarti mengarang.
           Empat anggota Leadership lain punya keduanya, jadi kartunya
           akan terlihat lebih kosong sampai data itu ditambahkan.
           CvModal.jsx punya kalimat cadangan untuk keadaan ini. */
        photo: "images/People/Head/ingghrid-head.jpg",
        /* Hanya satu foto yang dikirim, jadi foto kartu dan foto detail
           berasal dari berkas yang sama: `-head` dipotong rapat di
           kepala-bahu mengikuti gaya kartu anggota lain, `-body`
           memakai potongan tengah seluruh badan. Kalau nanti ada sesi
           foto terpisah, ganti saja kedua berkasnya. */
        detailPhoto: "images/People/Body/ingghrid-body.jpg"
      },
      {
        id: "lt-2",
        name: "Raziq Aldin",
        role: "Head of the Pangandaran Laboratory",
        focus: "Microplastics, Marine Pollution & Coastal Ecosystem Health",
        photo: "images/People/Head/raziq-head.jpg",
        detailPhoto: "images/People/Body/raziq-body.jpg",
        cvPdf: "cvs/raziq.pdf"
      },
      {
        id: "lt-3",
        name: "Talita Risa Margharedna",
        role: "Chief Financial Officer",
        focus: "Chemistry & Biochemistry Laboratory Management",
        photo: "images/People/Head/talita-head.jpg",
        detailPhoto: "images/People/Body/talita-body.jpg",
        cvPdf: "cvs/talita.pdf"
      },
      {
        id: "lt-4",
        name: "Alifannursin Mahdan Atsarak",
        role: "Human Resources & Field Operations Manager",
        focus: "Coral Reef Survey & Coastal Biodiversity Assessment",
        photo: "images/People/Head/alifannursin-head.jpg",
        detailPhoto: "images/People/Body/alifannursin-body.jpg",
        cvPdf: "cvs/alifannursin.pdf"
      },
      {
        id: "lt-5",
        name: "Yolando Ambarita",
        role: "Chief Technology Officer",
        focus: "Marine Technology & IoT Sensor Integration",
        photo: "images/People/Head/yolando-head.jpg",
        detailPhoto: "images/People/Body/yolando-body.jpg",
        cvPdf: "cvs/yolando.pdf"
      }
    ]
  },
  /* ════════════════════════════════════════════════════════════════
     SATU SEKSI "RESEARCH TEAM" — gabungan Jatinangor + Pangandaran
     (7 Sep 2026, permintaan Mahdan).

     Sebelumnya terpisah menjadi "RESEARCH TEAM JATINANGOR" dan
     "RESEARCH TEAM PANGANDARAN". Keduanya kini satu daftar.

     ⚠️ Keterangan lokasi per orang jadi HILANG dari tampilan. Yudi
     Ardiansyah Saputra bertugas di stasiun Pangandaran, dan itu tidak
     lagi terbaca dari kartunya — subtitle hanya menyebut kedua lokasi
     secara umum. Kalau lokasi per orang perlu terlihat, tambahkan ke
     `role` atau `focus` masing-masing.

     Awalan id sengaja TIDAK diseragamkan: rtj- (Jatinangor) dan
     rtp- (Pangandaran) tetap apa adanya, supaya asal-usul tiap entri
     masih terlacak kalau nanti dipisah lagi.
     ════════════════════════════════════════════════════════════════ */
  {
    category: "RESEARCH TEAM",
    subtitle: "Research team and laboratory analysts across the Jatinangor Integrated Laboratory and the Pangandaran Coastal Marine Station",
    members: [
      /* ════════════════════════════════════════════════════════════════
         DIARSIPKAN — tidak ditampilkan di situs (7 Sep 2026, permintaan
         Mahdan; sewaktu-waktu bisa diminta tampil lagi oleh Pak Tora).

         ⚠️ Datanya SENGAJA TIDAK DIHAPUS. Foto (ari-head/ari-body, beserta
         versi .webp-nya) dan cvs/ari.pdf juga tetap di tempatnya. Menghapus
         semuanya berarti harus menggali riwayat git untuk memulihkan, dan
         entri ini kemungkinan besar memang akan diminta kembali.

         CARA MENAMPILKAN KEMBALI: ubah `tampilkan: false` menjadi `true`,
         atau hapus barisnya sama sekali. Tidak ada langkah lain.

         Penanda ini berlaku untuk siapa pun — cukup tambahkan
         `tampilkan: false` pada entri mana pun untuk menyembunyikannya.
         ════════════════════════════════════════════════════════════════ */
      {
        id: "rtj-1",
        name: "Ari Dwi Saputra",
        role: "Research Engineer",
        focus: "Sedimentology, Coastal Survey & Marine Instrumentation",
        photo: "images/People/Head/ari-head.jpg",
        detailPhoto: "images/People/Body/ari-body.jpg",
        cvPdf: "cvs/ari.pdf",
        tampilkan: false
      },
      {
        id: "rtj-2",
        name: "Bagus Dwi Cahyo",
        role: "Research Engineer",
        focus: "Modeling & Simulation of Marine Systems",
        photo: "images/People/Head/bagus-head.jpg",
        detailPhoto: "images/People/Body/bagus-body.jpg",
        cvPdf: "cvs/bagus.pdf"
      },
      {
        id: "rtj-3",
        name: "Fataya Alif Rahmani Priatna",
        role: "Research Scientist",
        focus: "Drone-based Coastal Survey & Remote Sensing",
        photo: "images/People/Head/fataya-head.jpg",
        detailPhoto: "images/People/Body/fataya-body.jpg",
        cvPdf: "cvs/fataya.pdf"
      },
      {
        id: "rtj-4",
        name: "Galuh Pramudya",
        role: "Research Scientist",
        focus: "Carbon Sequestration & Modeling of Blue Carbon Ecosystems",
        photo: "images/People/Head/galuh-head.jpg",
        detailPhoto: "images/People/Body/galuh-body.jpg",
        cvPdf: "cvs/galuh.pdf"
      },
      {
        id: "rtj-5",
        name: "Kathryn Trijatha Putri Rahayu",
        role: "Research Scientist",
        focus: "Heavy Metal Analysis & Water Quality Assessment",
        photo: "images/People/Head/kathryn-head.jpg",
        detailPhoto: "images/People/Body/kathryn-body.jpg",
        cvPdf: "cvs/kathryn.pdf"
      },
      {
        id: "rtj-6",
        name: "Sri Dewi",
        role: "Research Assistant",
        focus: "Heavy Metal Analysis & Laboratory Support",
        photo: "images/People/Head/sridewi-head.jpg",
        detailPhoto: "images/People/Body/sridewi-body.jpg",
        cvPdf: "cvs/sridewi.pdf"
      },
      /* ⚠️ id rtj-7 (Nurul Laeliiyah) DIHAPUS pada 21 Sep 2026 atas
         permintaan Mahdan — berbeda dari Ari Dwi Saputra yang hanya
         diarsipkan. Entri, foto (nurul-head/nurul-body beserta .webp),
         dan cvs/nurul.pdf ikut dihapus dari folder, supaya berkasnya
         tidak lagi bisa dibuka lewat alamat langsung.

         Kalau suatu saat perlu dipulihkan, semuanya masih ada di
         riwayat git pada commit sebelum tanggal tersebut.

         ⚠️ JANGAN keliru dengan "An-Nisa Nurul Azqiya" (rtj-8) di bawah
         ini — orang yang berbeda, dan tetap ditampilkan. */

      /* ────────────────────────────────────────────────────────────────
         6 anggota di bawah ini SUDAH punya foto + CV di folder, tapi
         sebelumnya tidak pernah ditampilkan di website.

         Nama lengkap & bidang keahlian diambil langsung dari isi CV
         masing-masing. Nilai `role` masih perlu Anda konfirmasi —
         saat ini diisi "Research Assistant" sebagai default.
         ──────────────────────────────────────────────────────────────── */
      {
        id: "rtj-8",
        name: "An-Nisa Nurul Azqiya",
        role: "Research Assistant",
        focus: "Marine Ecology & Water Quality Analysis",
        photo: "images/People/Head/annisa-head.jpg",
        detailPhoto: "images/People/Body/annisa-body.jpg",
        cvPdf: "cvs/annisa.pdf"
      },
      {
        id: "rtj-9",
        name: "Aziza Nabila Nurshafa",
        role: "Research Assistant",
        focus: "Coral Reef Conservation & Underwater Survey",
        photo: "images/People/Head/aziza-head.jpg",
        detailPhoto: "images/People/Body/aziza-body.jpg",
        cvPdf: "cvs/aziza.pdf"
      },
      {
        id: "rtj-10",
        name: "Fakhri Daffa Fauzi",
        role: "Research Assistant",
        focus: "Marine Conservation & Field Research",
        photo: "images/People/Head/fakhri-head.jpg",
        detailPhoto: "images/People/Body/fakhri-body.jpg",
        cvPdf: "cvs/fakhri.pdf"
      },
      {
        id: "rtj-11",
        name: "Muzhaffirah Gyda Kania Subagja",
        role: "Research Assistant",
        focus: "Hydro-Oceanography & Environmental Data Analysis",
        photo: "images/People/Head/muzhaffirah-head.jpg",
        detailPhoto: "images/People/Body/muzhaffirah-body.jpg",
        cvPdf: "cvs/Muzhaffirah.pdf"
      },
      {
        id: "rtj-12",
        name: "Tabriiz Rosyanfiqr",
        role: "Research Assistant",
        focus: "Scientific Visualization & Research Programming",
        photo: "images/People/Head/tabriiz-head.jpg",
        detailPhoto: "images/People/Body/tabriiz-body.jpg",
        cvPdf: "cvs/tabriiz.pdf"
      },
      {
        // ⚠️ cvs/akmal.pdf berupa hasil pindaian (tanpa teks), sehingga nama
        //    lengkap & bidang keahlian TIDAK bisa dibaca otomatis.
        //    Mohon lengkapi `name` dan `focus` di bawah ini.
        id: "rtj-13",
        name: "Akmal",
        role: "Research Assistant",
        focus: "Marine Science Research",
        photo: "images/People/Head/akmal-head.jpg",
        detailPhoto: "images/People/Body/akmal-body.jpg",
        cvPdf: "cvs/akmal.pdf"
      },

      /* ── Sebelumnya berdiri sendiri sebagai seksi RESEARCH TEAM PANGANDARAN ── */
      {
        id: "rtp-1",
        name: "Yudi Ardiansyah Saputra",
        role: "Technical Specialist",
        focus: "Marine Engineering & Coastal Survey Operations",
        photo: "images/People/Head/yudi-head.jpg",
        detailPhoto: "images/People/Body/yudi-body.jpg",
        cvPdf: "cvs/yudi.pdf"
      }
    ]
  },

  /* ════════════════════════════════════════════════════════════════
     ANAK MAGANG — ditambahkan 13 Agu 2026 atas permintaan Mahdan.

     Daftarnya masih kosong sampai foto-fotonya dikirim. Selama kosong,
     tab ini TETAP muncul dan menampilkan keterangan bahwa profilnya
     sedang disiapkan — bukan kotak kosong yang terlihat rusak.

     CARA MENAMBAH — salin blok di bawah ini ke dalam `members`:

       {
         id: "mg-1",                                  // mg-2, mg-3, dst.
         name: "Nama Lengkap",
         role: "Intern",                              // atau "Research Intern"
         focus: "Bidang yang dikerjakan",
         photo: "images/People/Head/nama-head.jpg",   // wajib
         detailPhoto: "images/People/Body/nama-body.jpg", // boleh dihapus
         cvPdf: "cvs/nama.pdf"                        // boleh dihapus
       }

     ⚠️ `photo` saja sudah cukup. Kalau `detailPhoto` DAN `cvPdf`
     dua-duanya tidak diisi, tombol "View Biography" otomatis tidak
     muncul pada kartu itu — jadi tidak ada tombol yang menuju
     halaman kosong. Anak magang umumnya tidak punya CV, dan itu
     tidak apa-apa.
     ════════════════════════════════════════════════════════════════ */
  {
    category: "INTERNS",
    subtitle: "Students and young researchers undertaking internships at Torgas Blue Energy",
    kosongPesan: "Intern profiles are being prepared and will appear here soon.",
    members: [
      /* ⚠️ Nilai `focus` ketiga orang di bawah DIRINGKAS DARI CV MASING-MASING
         (24 Agu 2026), bukan diberikan langsung oleh yang bersangkutan.
         Sumber kalimatnya ada di ringkasan diri pada halaman pertama CV.
         Kalau ada yang kurang tepat, perbaiki di sini — ini keterangan
         tentang orang sungguhan, jadi ketepatannya lebih penting daripada
         terdengar mengesankan. */
      {
        id: "mg-1",
        name: "Debora Arta Y. Sinaga",
        role: "Intern",
        // CV: "interest in marine science, coastal ecosystems, and
        //      sustainable aquatic resource management"
        focus: "Coastal Ecosystems & Sustainable Aquatic Resource Management",
        photo: "images/People/Head/debora-head.jpg",
        detailPhoto: "images/People/Body/debora-body.jpg",
        cvPdf: "cvs/debora.pdf"
      },
      {
        id: "mg-2",
        name: "Christian Nathaniel Raja Guk Guk",
        role: "Intern",
        // CV: "laboratory work and hands-on field sampling";
        //      surveyor pada kegiatan Marine Debris di Bojong Salawe, Pangandaran
        focus: "Marine Debris Survey & Field Sampling",
        photo: "images/People/Head/christian-head.jpg",
        detailPhoto: "images/People/Body/christian-body.jpg",
        cvPdf: "cvs/christian.pdf"
      },
      {
        id: "mg-3",
        name: "Hanna Febbryanti Siburian",
        role: "Intern",
        // CV: "Particularly interested in coral reef ecosystems, diving, and
        //      marine research"; pernah menjadi Diving Laboratory Assistant
        focus: "Coral Reef Ecosystems & Scientific Diving",
        photo: "images/People/Head/hanna-head.jpg",
        detailPhoto: "images/People/Body/hanna-body.jpg",
        cvPdf: "cvs/hanna.pdf"
      },
      {
        id: "mg-4",
        /* Ejaan "Ardhito" (pakai h) sesuai isian pendaftaran magang
           MGG-ASQEB, 5 Agu 2026. Sempat tertulis "Ardito" dan dibetulkan
           20 Okt 2026. */
        name: "Prima Ardhito Rheza Gunawan",
        role: "Intern",
        /* ⚠️ `focus` SENGAJA DIKOSONGKAN — 20 Okt 2026.
           Tidak ada CV maupun keterangan bidang yang diberikan untuk
           Prima, dan tiga entri di atas bidangnya diringkas dari CV
           masing-masing. Menuliskan tebakan di sini sama saja mengarang
           keterangan tentang orang sungguhan yang dipajang di situs
           resmi. CvModal.jsx sudah menyiapkan kalimat umum
           ("Marine Science & Technology Research") untuk keadaan ini,
           jadi tampilannya tetap rapi.

           Begitu bidangnya diketahui, tambahkan baris:
             focus: "...",
           dan `cvPdf: "cvs/prima.pdf"` kalau CV-nya sudah ada. */
        photo: "images/People/Head/prima-head.jpg",
        detailPhoto: "images/People/Body/prima-body.jpg",
        /* CV dari pendaftaran magang MGG-ASQEB. Lihat catatan tentang
           alamat Drive di entri Ridho di bawah. */
        cvPdf: "https://drive.google.com/file/d/13B4FGnesB1s-6IvkiP5mzOtDIjm3KEcD/preview"
      },
      {
        id: "mg-5",
        /* Nama lengkap TERKONFIRMASI 20 Okt 2026 dari isian pendaftaran
           magang MGG-8LAH8 di Spreadsheet DATABASE TORGAS WEBSITE —
           persis sama dengan dugaan awal dari pengajuan BIM-J2UR7. */
        name: "Berry Dzaikra Suherman Hibatullah",
        role: "Intern",
        /* `focus` dikosongkan dengan alasan yang sama seperti Prima:
           tidak ada CV atau keterangan bidang yang diberikan, dan
           menebaknya berarti mengarang. CvModal.jsx punya kalimat
           cadangan untuk keadaan ini. */
        photo: "images/People/Head/berry-head.jpg",
        detailPhoto: "images/People/Body/berry-body.jpg",
        /* CV dari pendaftaran magang MGG-8LAH8. Lihat catatan tentang
           alamat Drive di entri Ridho di bawah. */
        cvPdf: "https://drive.google.com/file/d/1COt4DzGpD0lQHcmDjptdA0TXc4-AjH3x/preview"
      },
      {
        id: "mg-6",
        /* Nama lengkap dari isian pendaftaran magang MGG-JRJZY di
           Spreadsheet DATABASE TORGAS WEBSITE, diisi 20 Okt 2026
           menggantikan "Ridho" yang sebelumnya ditulis apa adanya. */
        name: "Muhammad Ridho Fazli Rabbani",
        role: "Intern",
        /* `focus` dikosongkan atas permintaan Mahdan (20 Okt 2026):
           yang penting orangnya tampil dulu. CvModal.jsx punya kalimat
           cadangan untuk keadaan ini. */
        photo: "images/People/Head/ridho-head.jpg",
        detailPhoto: "images/People/Body/ridho-body.jpg",
        /* CV dari pendaftaran magang MGG-JRJZY.

           ⚠️ KENAPA ALAMAT DRIVE, BUKAN BERKAS DI cvs/
           Anggota lain memakai `cvPdf: "cvs/nama.pdf"` — berkas PDF
           yang ikut dipasang bersama situs. Tiga CV magang ini masih
           berada di Drive dan tidak bisa saya pindahkan sendiri ke
           folder cvs/, jadi yang dipakai sementara adalah alamat
           pratinjau Drive.

           Bedanya yang perlu diketahui:
           - Butuh koneksi ke Drive; kalau berkasnya dipindah, di-rename
             pemiliknya, atau izinnya diubah dari "anyone with link",
             pratinjau di situs ikut mati — berkas di cvs/ tidak begitu.
           - Pratinjau Drive memasang kerangka halaman Google di dalam
             iframe CvModal, tampilannya tidak seragam dengan CV lain.

           Supaya seragam: unduh ketiganya dari Drive, taruh di folder
           cvs/ (mis. cvs/ridho.pdf), lalu ganti baris ini menjadi
           `cvPdf: "cvs/ridho.pdf"`.

           Catatan privasi: CV biasanya memuat nomor HP, alamat surel,
           dan alamat rumah. Begitu tertaut di situs publik, semuanya
           bisa dibaca siapa saja. Sebaiknya minta izin ketiganya dulu,
           atau pakai versi CV yang kontaknya sudah disamarkan. */
        cvPdf: "https://drive.google.com/file/d/1r0ybcMwXsitZMaZ0A4HnESgLsFwBtzIn/preview"
      },
      {
        id: "mg-7",
        /* Nama lengkap dan CV dari isian pendaftaran magang MGG-PQZWD
           di Spreadsheet DATABASE TORGAS WEBSITE (29 Agu 2026).

           Mahdan menyatakan 21 Okt 2026 bahwa keempat pemagang sudah
           diterima. Catat bahwa kolom Status di sheet Magang saat itu
           masih tertulis PENDING untuk Zaidan (MGG-PQZWD) dan Berry
           (MGG-8LAH8) — jadi sheet-nya yang perlu disusulkan, bukan
           keterangan ini. */
        name: "Zaidan Rafi Fadhlih",
        role: "Intern",
        /* `focus` dikosongkan mengikuti keputusan Mahdan 20 Okt 2026
           untuk angkatan magang ini. Topik risetnya di formulir —
           AMDAL sebagai indikator kesehatan lingkungan untuk budidaya —
           belum tentu sama dengan bidang kerjanya di Torgas, jadi tidak
           dipakai begitu saja. CvModal.jsx punya kalimat cadangan. */
        photo: "images/People/Head/zaidan-head.jpg",
        detailPhoto: "images/People/Body/zaidan-body.jpg",
        /* Alasan memakai alamat Drive, bukan berkas di cvs/: lihat
           catatan panjang di entri Ridho (mg-6) di atas. */
        cvPdf: "https://drive.google.com/file/d/1Ms5_sTsPGfpuNue05Cp1KpU5QdeDt0Gw/preview"
      }
    ]
  }
];

export { LAB_SECTIONS };
