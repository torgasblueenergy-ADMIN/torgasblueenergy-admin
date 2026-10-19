# Panduan Timeline Bimbingan

Papan timeline di Student Portal membaca satu tab Google Sheet. Website hanya
menampilkan. Semua perubahan dan penambahan dilakukan di Sheet, lalu tekan
tombol **Refresh** di papan.

Ini bukan aturan yang dibuat-buat. Alamat yang dipakai website adalah alamat
CSV hasil "Publish to web", dan alamat semacam itu secara teknis hanya melayani
permintaan baca. Tidak ada jalan menulis balik ke Sheet lewat website.

---

## Bagian 1. Spreadsheetnya

Sudah dibuatkan, berdiri sendiri, terpisah dari spreadsheet portal:

**Timeline Bimbingan Torgas**
`https://docs.google.com/spreadsheets/d/1mQ3HqqOmClhA_FdKzDRFIsTjkxf784TPnyDTUlapROI/edit`

Sengaja dipisah dari spreadsheet portal
(`18seiQwjbwOiXWbqtwYS4zIogftVo_Yd3u-DbDb46jbQ`). Tab timeline nantinya
dipublikasikan ke web, dan memisahkannya berarti data Pengajuan, Magang, dan
Part Time tidak berada di dokumen yang sama dengan yang dipublikasikan sama
sekali.

Isinya sudah ada baris judul dan tiga baris contoh. Hapus baris contoh itu
kalau sudah mau diisi data sungguhan.

Baris pertama adalah baris judul. Isinya dua kelompok kolom:

**Kolom tetap** (boleh dipilih sebagian, urutannya bebas):

| Kolom | Isi |
|---|---|
| `Nama` | Wajib. Baris tanpa nama diabaikan. |
| `NIM` | Tampil kecil di bawah nama. |
| `Pembimbing` | Dipakai untuk penyaring "Semua pembimbing" di portal. |
| `Topik` | Judul penelitian, tampil abu-abu di bawah NIM. |
| `Catatan` | Catatan bebas, tidak ditampilkan di papan. |
| `Tampilkan` | Isi `n`, `tidak`, `arsip`, atau `lulus` untuk menyembunyikan baris. |

**Kolom tahapan**: semua kolom lain setelah itu. Nama kolomnya bebas, dan
urutannya di Sheet adalah urutannya di papan.

> Nama tahapan tidak ditulis di kode mana pun. Menambah tahap cukup menambah
> kolom di Sheet. Tidak perlu minta siapa pun mengubah website.

Contoh baris judul:

```
Nama | NIM | Pembimbing | Topik | Proposal | Sampling | Preparasi | Pengolahan Data | Analisis | Draf | Sidang
```

---

## Bagian 2. Mengisi sel tahapan

Sel tahapan sengaja dibuat longgar. Yang mengisi adalah manusia yang sedang
buru-buru, bukan formulir dengan dropdown. Semua tulisan di bawah ini dikenali:

| Yang kamu tulis | Yang muncul di papan |
|---|---|
| kosong atau `-` | Belum mulai, abu-abu |
| `Selesai`, `Done`, `OK`, `v`, `✓` | Selesai, hijau, 100% |
| `12/10/2026` atau `2026-10-12` | Selesai, hijau, dengan tanggalnya |
| `Selesai 12/10/2026` | Selesai, hijau, dengan tanggalnya |
| `Proses`, `Mulai`, `Berjalan` | Berjalan, biru, 50% |
| `60%` | Berjalan, biru, 60% |
| `Kendala`, `Revisi`, `Blocked` | Terkendala, oranye |
| `Revisi 60%` | Terkendala, oranye, 60% |

Angka persen paling berguna untuk kolom **Pengolahan Data**, karena tahap itu
jarang hitam-putih. `40%` jauh lebih informatif daripada `Proses`.

Persentase besar di kolom kiri adalah rata-rata semua tahap. Tahap terkendala
tetap dihitung dengan progresnya, supaya mahasiswa yang satu tahapnya macet
tidak tampak lebih tertinggal daripada yang tahapnya belum disentuh sama sekali.

### Soal tanggal

Tanggal `12/10/2026` dibaca sebagai **12 Oktober**, bukan 10 Desember. Kalau
suatu saat tanggal di papan tampak meleset sebulan, tulis dalam bentuk
`2026-10-12` yang tidak bisa salah baca.

---

## Bagian 3. Menerbitkan tab

1. Di spreadsheet: **File → Share → Publish to web**
2. Tab dropdown kiri: pilih tab yang berisi tabelnya (jangan "Entire document").
   Tab hasil impor biasanya bernama `Timeline Bimbingan Torgas`. Boleh
   diganti jadi `Timeline` supaya enak dibaca, website tidak mempermasalahkan
   namanya.
3. Dropdown kanan: pilih **Comma-separated values (.csv)**
4. Tekan **Publish**, lalu salin alamat yang muncul

Alamatnya berbentuk:

```
https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv
```

5. Tempel alamat itu ke `src/config.js`, pada baris:

```js
const TIMELINE_CSV_URL = '';
```

Selama baris itu masih kosong, papan tidak rusak. Ia menampilkan petunjuk
pemasangan ini.

---

## Yang perlu disadari soal keterbukaan

Tab yang di-publish bisa dibaca **siapa pun yang tahu alamatnya, tanpa login**,
termasuk orang yang tidak punya kode Student Portal.

Yang terbuka hanya tab itu, bukan seluruh spreadsheet, dan spreadsheet ini
memang terpisah dari spreadsheet portal. Tab Pengajuan, Magang, dan Part Time
ada di dokumen lain dan tidak tersentuh sama sekali.

Karena itu, jangan menaruh di tab Timeline:

* nilai atau penilaian apa pun
* nomor telepon dan alamat email
* catatan pribadi tentang mahasiswa

Simpan hal-hal itu di tab lain yang tidak di-publish. Papan ini juga dilihat
semua pemegang kode portal, bukan hanya pembimbing. Pertimbangannya sama dengan
kalender kegiatan, yang sengaja tidak menampilkan nama pemohon.

Untuk menutup kembali: **File → Share → Publish to web → Stop publishing**,
lalu kosongkan `TIMELINE_CSV_URL` di `config.js`.

---

## Kalau papan menampilkan pesan merah

**"Sheet membalas halaman HTML, bukan data"**
Tab belum di-publish, atau yang dipublish bukan format CSV. Ulangi Bagian 3.

**"Sheet menolak permintaan (kode 404)"**
Alamat CSV salah salin, atau publikasinya sudah dihentikan.

**"Tidak bisa menghubungi Google Sheet"**
Masalah koneksi internet pembaca, bukan masalah Sheet.

**Papan tampil, tapi kolom bergeser**
Ada koma di dalam sel yang tidak diapit tanda kutip. Google biasanya mengurus
ini sendiri. Kalau terjadi, periksa apakah ada sel yang dirapikan secara manual.

---

## Kalau nanti ingin pindah ke Apps Script

Sekarang timeline memakai CSV karena penerbitan Apps Script sedang ditahan
(lihat `apps-script/.deploy-hold`, menunggu izin WhatsApp disetujui). Setelah
hold itu dicabut, timeline boleh dipindahkan ke `action=timeline` kalau mau
satu pintu dengan data lain.

Yang perlu diganti hanya fungsi `ambilCsv()` di
`src/lib/timelineBimbingan.js`. Bentuk data yang dikembalikan `ambilTimeline()`
dirancang supaya tidak berubah, jadi komponen papannya tidak perlu disentuh.

Keuntungan pindah: tab tidak perlu di-publish, sehingga tidak ada yang terbuka
ke publik. Kerugiannya: setiap perubahan struktur butuh deploy ulang Apps Script.
