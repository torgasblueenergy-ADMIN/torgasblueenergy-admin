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
  { id: 'univ-1',  name: 'Universitas Partner 1',  logo: 'images/collaborators/univ-1.png'  },
  { id: 'univ-2',  name: 'Universitas Partner 2',  logo: 'images/collaborators/univ-2.png'  },
  { id: 'univ-3',  name: 'Universitas Partner 3',  logo: 'images/collaborators/univ-3.png'  },
  { id: 'univ-4',  name: 'Universitas Partner 4',  logo: 'images/collaborators/univ-4.png'  },
  { id: 'univ-5',  name: 'Universitas Partner 5',  logo: 'images/collaborators/univ-5.png'  },
  { id: 'univ-6',  name: 'Universitas Partner 6',  logo: 'images/collaborators/univ-6.png'  },
  { id: 'univ-7',  name: 'Universitas Partner 7',  logo: 'images/collaborators/univ-7.png'  },
  { id: 'univ-8',  name: 'Universitas Partner 8',  logo: 'images/collaborators/univ-8.png'  },
  { id: 'univ-9',  name: 'Universitas Partner 9',  logo: 'images/collaborators/univ-9.png'  },
  { id: 'univ-10', name: 'Universitas Partner 10', logo: 'images/collaborators/univ-10.png' },
  { id: 'univ-11', name: 'Universitas Partner 11', logo: 'images/collaborators/univ-11.png' },
  { id: 'univ-12', name: 'Universitas Partner 12', logo: 'images/collaborators/univ-12.png' },
  { id: 'univ-13', name: 'Universitas Partner 13', logo: 'images/collaborators/univ-13.png' },
  { id: 'univ-14', name: 'Universitas Partner 14', logo: 'images/collaborators/univ-14.png' },
  { id: 'univ-15', name: 'Universitas Partner 15', logo: 'images/collaborators/univ-15.png' }
];

const LSM_COLLABORATORS = [
  { id: 'lsm-1', name: 'POKMASWAS BULAK SETRA' },
  { id: 'lsm-2', name: 'POKMASWAS PANDANAN' },

  /* REVISI PAK TORA 4/8/2026 — poin #11: tambah 1 community partner di Manado.
     ⚠️ Nama organisasinya belum disebutkan di notulen — mohon dilengkapi. */
  { id: 'lsm-3', name: 'MITRA MANADO — MOHON ISI NAMA ORGANISASINYA' }
];

export { UNIV_COLLABORATORS, LSM_COLLABORATORS };
