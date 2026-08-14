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
  {
    category: "RESEARCH TEAM JATINANGOR",
    subtitle: "Research Team & Laboratory Analysts of Jatinangor Integrated Laboratory",
    members: [
      {
        id: "rtj-1",
        name: "Ari Dwi Saputra",
        role: "Research Engineer",
        focus: "Sedimentology, Coastal Survey & Marine Instrumentation",
        photo: "images/People/Head/ari-head.jpg",
        detailPhoto: "images/People/Body/ari-body.jpg",
        cvPdf: "cvs/ari.pdf"
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
      {
        id: "rtj-7",
        name: "Nurul Laeliiyah",
        role: "Research Assistant",
        focus: "Carbon Sequestration & Laboratory Support",
        photo: "images/People/Head/nurul-head.jpg",
        detailPhoto: "images/People/Body/nurul-body.jpg",
        cvPdf: "cvs/nurul.pdf"
      },

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
      }
    ]
  },
  {
    category: "RESEARCH TEAM PANGANDARAN",
    subtitle: "Research and Technical Team at the Pangandaran Coastal Marine Station",
    members: [
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
      {
        id: "mg-1",
        name: "Debora Arta Y. Sinaga",
        role: "Intern",
        /* ⚠️ `focus` sengaja TIDAK diisi — Mahdan baru mengirim nama dan
           foto, dan bidang keahlian tidak boleh dikarang. Selama kosong,
           CvModal menampilkan keterangan umum "Marine Science & Technology
           Research". Isi baris berikut begitu bidangnya diketahui:
             focus: "…", */
        photo: "images/People/Head/debora-head.jpg",
        detailPhoto: "images/People/Body/debora-body.jpg"
        // cvPdf sengaja dikosongkan — belum ada CV-nya
      },
      {
        id: "mg-2",
        name: "Christian Nathaniel Raja Guk Guk",
        role: "Intern",
        // `focus` belum diketahui — lihat catatan pada mg-1
        photo: "images/People/Head/christian-head.jpg",
        detailPhoto: "images/People/Body/christian-body.jpg"
      }
    ]
  }
];

export { LAB_SECTIONS };
