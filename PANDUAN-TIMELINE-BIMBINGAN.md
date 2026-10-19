# Panduan Timeline Bimbingan

Papan timeline di Student Portal membaca satu tab Google Sheet. Website hanya
menampilkan. Semua perubahan dan penambahan dilakukan di Sheet, lalu tekan
tombol **Refresh** di papan.

Ini bukan aturan yang dibuat-buat. Alamat yang dipakai website adalah alamat
CSV hasil "Publish to web", dan alamat semacam itu secara teknis hanya melayani
permintaan baca. Tidak ada jalan menulis balik ke Sheet lewat website.

---

## Bagian 1. Memasang spreadsheetnya

Berkasnya ada di folder proyek: **`Timeline-Bimbingan-Torgas.xlsx`**

Strukturnya meniru `Tracking Skripsi Microplastic.xlsx` milik Sri: 23 kegiatan
berbobot, laporan progres otomatis, dan ambang status yang bisa diatur.

### Memasukkannya ke Google Drive

1. Buka [drive.google.com](https://drive.google.com), seret berkasnya ke sana
2. Klik kanan berkas itu → **Open with** → **Google Sheets**
3. Di menu: **File → Save as Google Sheets**

Langkah 3 wajib. Selama masih berbentuk `.xlsx` di Drive, menu *Publish to web*
tidak tersedia, jadi website tidak bisa membacanya.

> Saya sempat mencoba menaruhnya langsung ke Drive lewat koneksi otomatis, tapi
> berkas sebesar ini harus disalin sebagai teks panjang dan salinannya rusak di
> tengah jalan. Tiga klik di atas jauh lebih bisa diandalkan.

---

## Bagian 2. Isi keenam tabnya

| Tab | Isinya | Diisi tangan? |
|---|---|---|
| **Data Mahasiswa** | Nama, NIM, prodi, judul, pembimbing, Tanggal SK | Ya, kolom kuning |
| **Input Status** | 23 kegiatan × tiap mahasiswa, lewat dropdown | Ya, kolom kuning |
| **Laporan Progres** | Persentase, selisih jadwal, status, peringatan | Tidak, otomatis |
| **Web (Publish)** | Versi ringkas untuk website | Tidak, otomatis |
| **Pengaturan** | Persen tiap status, ambang status | Ya, bila perlu |
| **Petunjuk** | Ringkasan panduan ini di dalam berkasnya | — |

Empat mahasiswa bimbingan Pak Tora sudah terisi sebagai contoh, lengkap dengan
status yang sama seperti di berkas acuan. Kapasitasnya 25 baris.

### Kegiatannya

Empat tahap, 23 kegiatan:

- **A. Persiapan & Proposal** (A1–A7) — dari terima SK sampai revisi pasca seminar
- **B. Pelaksanaan Penelitian** (B1–B4) — izin, pengumpulan data, **pengolahan & analisis data**, bimbingan progres
- **C. Penulisan & Bimbingan Naskah** (C1–C6) — Bab 4 sampai ACC maju sidang
- **D. Sidang Sarjana** (D1–D6) — berkas, pendaftaran, sidang, revisi, pengesahan

Baris **Mulai**, **Durasi**, dan **Bobot** di atas tabel berlaku untuk semua
mahasiswa. Kegiatan yang tidak berlaku di prodi tertentu diberi **Bobot 0**,
jangan dihapus kolomnya.

### Lima pilihan status

| Status | Dihitung | Kapan dipakai |
|---|---|---|
| (kosong) | 0% | Belum mulai |
| Sedang Dikerjakan | 50% | Sudah jalan, belum selesai |
| Menunggu Review | 75% | Pekerjaan mahasiswa selesai, menunggu ACC dosen |
| Terhambat | 25% | Ada kendala. Muncul di peringatan dan penyaring portal |
| Selesai | 100% | Tuntas |

Angka persennya bisa diubah di tab **Pengaturan**.

### Cara menghitungnya

Progres Keseluruhan = jumlah(bobot × persen status) dibagi jumlah bobot.
Progres per tahap dihitung sama, hanya untuk kegiatan di tahap itu.

Progres Seharusnya = berapa yang semestinya tercapai hari ini menurut Mulai dan
Durasi, dihitung dari Tanggal SK masing-masing mahasiswa. Selisih = aktual
dikurangi seharusnya. Kolom ini kosong selama Tanggal SK belum diisi, dan itu
memang disengaja: tanpa titik mulai, jadwal tidak punya acuan.

Status mahasiswa: **Selesai** (100%) / **Tertinggal** (selisih melewati ambang
15%) / **Perlu Perhatian** (ada kegiatan Terhambat, atau selisih melewati 5%) /
**Sesuai Jalur**.

---

## Bagian 3. Menerbitkan ke website

1. **File → Share → Publish to web**
2. Dropdown kiri: pilih tab **Web (Publish)**. Jangan "Entire document"
3. Dropdown kanan: **Comma-separated values (.csv)**
4. Tekan **Publish**, salin alamat yang muncul
5. Tempel ke `TIMELINE_CSV_URL` di `src/config.js`

Selama baris itu masih kosong, papan tidak rusak. Ia menampilkan petunjuk
pemasangan.

### Kenapa lewat tab Web, bukan Input Status

Tab Input Status punya lima baris keterangan di atas baris judulnya, sedangkan
pembaca CSV di website mengharapkan baris judul ada di baris pertama. Tab Web
dibuat rata dan bersih khusus untuk itu.

Isinya juga sengaja dipangkas: nama, NIM, pembimbing, judul, dan persentase per
tahap, ditambah satu kolom Pengolahan Data. Tanggal SK, catatan, peringatan, dan
rincian 23 kegiatan tidak ikut.

---

## Yang perlu disadari soal keterbukaan

Setelah di-publish, tab **Web (Publish)** bisa dibaca siapa pun yang tahu
alamatnya, **tanpa login**, termasuk orang yang tidak punya kode Student Portal.

Tab Data Mahasiswa, Input Status, Laporan Progres, dan Pengaturan tidak ikut
terbuka. Spreadsheet ini juga terpisah dari spreadsheet portal, jadi data
Pengajuan, Magang, dan Part Time tidak tersentuh sama sekali.

Meski begitu, judul skripsi dan nama pembimbing tetap ikut terbaca publik. Kalau
itu dianggap terlalu terbuka, hapus kolom Topik di tab Web — papan tetap jalan,
hanya baris keterangan di bawah nama yang hilang.

Untuk menutup kembali: **File → Share → Publish to web → Stop publishing**, lalu
kosongkan `TIMELINE_CSV_URL`.

---

## Kalau papan menampilkan pesan merah

**"Sheet membalas halaman HTML, bukan data"**
Tab belum di-publish, atau berkasnya masih `.xlsx` dan belum dikonversi ke
Google Sheets. Ulangi Bagian 1 langkah 3, lalu Bagian 3.

**"Sheet menolak permintaan (kode 404)"**
Alamat CSV salah salin, atau publikasinya sudah dihentikan.

**"Tidak bisa menghubungi Google Sheet"**
Masalah koneksi internet pembaca, bukan masalah Sheet.

**Papan tampil, tapi semua tahap abu-abu**
Tab yang di-publish kemungkinan bukan **Web (Publish)**.

---

## Kalau nanti ingin pindah ke Apps Script

Sekarang timeline memakai CSV karena penerbitan Apps Script sedang ditahan
(lihat `apps-script/.deploy-hold`, menunggu izin WhatsApp disetujui). Setelah
hold itu dicabut, timeline boleh dipindahkan ke `action=timeline`.

Yang perlu diganti hanya fungsi `ambilCsv()` di
`src/lib/timelineBimbingan.js`. Bentuk data yang dikembalikan `ambilTimeline()`
dirancang supaya tidak berubah, jadi komponen papannya tidak perlu disentuh.

Keuntungan pindah: tidak ada tab yang perlu di-publish, sehingga tidak ada yang
terbuka ke publik. Kerugiannya: setiap perubahan struktur butuh deploy ulang.
