/* ================================================================
   DATA MITRA & KOLABORATOR (16 Universitas, 2 LSM)
================================================================ */
/* CATATAN 2: 7 logo (univ-4, 5, 6, 8, 10, 12, 15) dulu berformat .jpg dengan
   latar putih yang tampak sebagai kotak di halaman Kolaborator. Latarnya sudah
   dihapus dan disimpan ulang sebagai .png transparan. File .jpg lamanya boleh
   dihapus. JANGAN kembalikan ke .jpg — format itu tidak mendukung transparansi.

   CATATAN: daftar ini ditulis eksplisit karena ekstensi file logo BERBEDA-BEDA
   (sebagian .png, sebagian .jpg). Versi lama memaksa semua jadi .png sehingga
   7 logo tampil rusak. Ganti nilai `name` dengan nama universitas sebenarnya. */
const UNIV_COLLABORATORS = [
  /* REVISI PAK TORA 4/8/2026 poin #18 — tambahkan Unpad. Masuk 5 Agu 2026.
     Diletakkan PALING ATAS atas permintaan Mahdan: Unpad institusi induk
     lab ini, jadi wajar tampil pertama. BRIN tidak dihapus, hanya bergeser
     ke urutan kedua.

     Berkasnya diberi nama `unpad`, bukan `univ-18`, supaya urutan tampil
     tidak lagi terikat pada nomor berkas — daftar inilah yang menentukan
     urutannya. */
  { id: 'unpad',   name: 'Universitas Padjadjaran',  logo: 'images/collaborators/unpad.png'  },
  { id: 'univ-1',  name: 'BRIN — Badan Riset dan Inovasi Nasional',  logo: 'images/collaborators/univ-1.png'  },
  { id: 'univ-2',  name: 'Rutgers, The State University of New Jersey',  logo: 'images/collaborators/univ-2.png'  },
  { id: 'univ-3',  name: 'Weill Cornell Medicine — Cornell University',  logo: 'images/collaborators/univ-3.png'  },
  { id: 'univ-4',  name: 'Xiamen University',  logo: 'images/collaborators/univ-4.png'  },
  { id: 'univ-5',  name: 'IOCAS — Institute of Oceanology, Chinese Academy of Sciences',  logo: 'images/collaborators/univ-5.png'  },
  /* ⚠️ 5 Agu 2026 — berkas univ-6 SEBELUMNYA berisi logo yang keliru sama
     sekali (lembaga sertifikasi selam). Sudah diganti dengan logo University
     of Tsukuba yang benar, dan univ-6.jpg lama dihapus. */
  { id: 'univ-6',  name: 'University of Tsukuba',  logo: 'images/collaborators/univ-6.png'  },
  { id: 'univ-7',  name: 'INTI International University & Colleges',  logo: 'images/collaborators/univ-7.png'  },
  { id: 'univ-8',  name: 'Universiti Teknologi Malaysia',  logo: 'images/collaborators/univ-8.png'  },
  { id: 'univ-9',  name: 'Universitas Indonesia',  logo: 'images/collaborators/univ-9.png'  },
  { id: 'univ-10', name: 'Universitas Gadjah Mada', logo: 'images/collaborators/univ-10.png' },
  { id: 'univ-11', name: 'Universitas Airlangga', logo: 'images/collaborators/univ-11.png' },
  { id: 'univ-12', name: 'Universitas Brawijaya', logo: 'images/collaborators/univ-12.png' },
  { id: 'univ-13', name: 'Universitas Negeri Jakarta', logo: 'images/collaborators/univ-13.png' },
  { id: 'univ-14', name: 'Universitas Diponegoro', logo: 'images/collaborators/univ-14.png' },
  { id: 'univ-15', name: 'Universitas Terbuka', logo: 'images/collaborators/univ-15.png' },

  /* REVISI PAK TORA 4/8/2026 poin #17 — mitra Taiwan. SELESAI 5 Agu 2026. */
  { id: 'univ-16', name: 'National Chung Hsing University', logo: 'images/collaborators/univ-16.png' },
  { id: 'univ-17', name: 'National Dong Hwa University',    logo: 'images/collaborators/univ-17.png' }
];

const LSM_COLLABORATORS = [
  { id: 'lsm-1', name: 'POKMASWAS BULAK SETRA' },
  { id: 'lsm-2', name: 'POKMASWAS PANDANAN' }

  /* MENUNGGU DATA — REVISI PAK TORA 4/8/2026 poin #11
     Perlu ditambah 1 community partner di Manado, tapi nama organisasinya
     belum disebutkan di notulen. Baris penampungnya sudah dihapus supaya
     tidak tampil di situs. Tambahkan kembali begitu namanya diketahui:

       { id: 'lsm-3', name: 'NAMA ORGANISASI DI MANADO' }
  */
];

export { UNIV_COLLABORATORS, LSM_COLLABORATORS };
