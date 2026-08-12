# Mengisi Publications, News & Video dari Google Sheet

Seluruh isi bagian **Scientific Publications & News** di situs berasal dari
tab **Publikasi** pada Google Spreadsheet. Tidak ada lagi isi yang tersimpan
di dalam kode — menambah, mengubah, dan menghapus cukup dilakukan di Sheet.

Perubahan muncul di situs **beberapa detik setelah halaman dimuat ulang**.
Tidak perlu menunggu penerbitan apa pun.

---

## Kolom yang dibaca

| Kolom | Wajib | Isi |
| ----- | ----- | --- |
| **ID** | ya | Penanda unik **dan penentu urutan** — lihat di bawah |
| **Judul** | ya | Judul artikel/berita/video. Baris tanpa judul dilewati |
| **Tipe_Kategori** | ya | `Scientific Articles`, `News`, atau `VIDEO` |
| **Tanggal** | ya | Tanggal yang tampil di kartu |
| **Link_Gambar_Cover** | ya | Tautan gambar Drive — **atau tautan YouTube untuk video** |
| **Penulis** | tidak | Nama penulis |
| **Ringkasan_Pendek** | tidak | **DOI artikel ilmiah** — lihat di bawah |
| **Konten_Lengkap** | tidak | Isi lengkap yang tampil saat kartu diklik |
| **Tampilkan** | tidak | Isi `NO` / `TIDAK` / `DRAFT` untuk menyembunyikan tanpa menghapus |

Nama kolom boleh bervariasi (`Judul` atau `Title`, `Gambar` atau `ImageURL`,
dan seterusnya) — backend mengenali beberapa penamaan sekaligus.

---

## Urutan tampil — ANGKA PADA ID

Yang paling **baru diunggah** tampil paling depan, **bukan** yang tanggalnya
paling muda. Penentunya adalah **angka pada kolom ID**: makin besar angkanya,
makin depan posisinya.

| ID | Urutan tampil |
| -- | ------------- |
| `ART-03` | 1 — paling depan |
| `NEW-02` | 2 |
| `NEW-01` | 3 |

**Aturannya satu saja: setiap menambah baris baru, pakai angka yang lebih
besar dari semua baris sebelumnya.** Awalannya bebas — `ART-`, `NEW-`, `VID-`,
atau tanpa awalan sama sekali. Yang dibaca hanya angkanya.

Kenapa begini? Karena artikel lama pun kadang baru sempat dimasukkan hari ini.
Kalau urutannya mengikuti tanggal, artikel itu langsung terkubur di belakang
padahal justru sedang ingin ditonjolkan.

> Baris tanpa angka pada ID akan jatuh ke urutan paling belakang, diurutkan
> menurut tanggal.

---

## Menambahkan video

Dua langkah:

1. Pilih **`VIDEO`** pada kolom `Tipe_Kategori`
2. Tempelkan tautan videonya ke kolom `Link_Gambar_Cover` — boleh **YouTube**
   maupun **Google Drive**

Contoh:

| ID | Judul | Tipe_Kategori | Tanggal | Link_Gambar_Cover |
| -- | ----- | ------------- | ------- | ----------------- |
| `VID-04` | Torgas Blue Energy Profile | VIDEO | 3 Agustus 2026 | `https://youtu.be/dQw4w9WgXcQ` |
| `VID-05` | Uji Coba USV Pangandaran | VIDEO | 9 Agustus 2026 | `https://drive.google.com/file/d/1AbC.../view` |

Yang terjadi otomatis:

- Kartunya masuk tab **🎬 Video** dan ikut terhitung di sana
- Gambar cuplikan diambil sendiri — **tidak perlu mengunggah thumbnail**
- Muncul tombol putar di tengah kartu
- Saat diklik, videonya diputar langsung di dalam situs

### YouTube

Bentuk tautan yang dikenali:

```
https://www.youtube.com/watch?v=XXXXXXXXXXX
https://youtu.be/XXXXXXXXXXX
https://www.youtube.com/embed/XXXXXXXXXXX
https://www.youtube.com/shorts/XXXXXXXXXXX
https://www.youtube.com/live/XXXXXXXXXXX
```

Tautan YouTube dikenali **walaupun kategorinya lupa diubah ke VIDEO** — ini
jaring pengaman, bukan cara yang dianjurkan.

### Google Drive

⚠️ **Berkas videonya wajib dibagikan "Siapa saja yang memiliki link".**
Kalau izinnya masih "Terbatas", pemutarnya muncul kosong bagi pengunjung —
padahal di layar Anda terlihat normal, karena Anda sudah login ke Drive itu.
Selalu periksa lewat jendela penyamaran (incognito).

⚠️ **Untuk video Drive, kolom `Tipe_Kategori` HARUS diisi `VIDEO`.** Tautan
Drive untuk video dan untuk foto bentuknya sama persis, jadi sistem tidak
punya cara lain membedakannya. Kalau kategorinya `News`, tautan itu akan
diperlakukan sebagai foto sampul dan videonya tidak bisa diputar.

> Video Drive berukuran besar butuh beberapa saat sebelum Google selesai
> membuat gambar cuplikannya. Sebelum itu kartunya tampil dengan latar polos
> dan tombol putar — videonya sendiri tetap bisa diputar.

---

## Menambahkan DOI artikel ilmiah

**Tempat DOI: kolom `Ringkasan_Pendek`.**

Isi selnya dengan DOI-nya saja:

```
10.21608/ejabf.2026.413273.6396
```

Boleh juga bentuk lengkapnya — keduanya sama-sama terbaca:

```
https://doi.org/10.21608/ejabf.2026.413273.6396
```

DOI akan tampil sebagai **tautan biru tepat di bawah judul** saat kartunya
diklik, dan membuka artikel aslinya di penerbit ketika ditekan.

> **Kenapa kolom `Ringkasan_Pendek`?** Kolom itu sudah dikirim oleh sistem
> tetapi tidak dipakai di mana pun oleh situs, jadi bisa langsung dipakai
> tanpa mengubah backend. Nama kolomnya jangan diganti — sistem mengenali
> kolom berdasarkan namanya.

### Kalau DOI sudah terlanjur ditulis di dalam abstrak

Tidak perlu disunting. Baris yang abstraknya berakhir dengan
`Doi: 10.21608/...` tetap bekerja — DOI-nya diambil otomatis, ditampilkan
sebagai tautan di bawah judul, dan **kalimat DOI itu dihapus dari badan
abstrak** supaya tidak tercetak dua kali.

Mengisi `Ringkasan_Pendek` tetap lebih baik: lebih rapi dan lebih pasti.

---

## Menambahkan gambar sampul

1. Unggah gambarnya ke Google Drive
2. Klik kanan → **Bagikan** → ubah ke **"Siapa saja yang memiliki link"**
3. Salin tautannya, tempel ke kolom `Link_Gambar_Cover`

⚠️ **Kalau izinnya masih "Terbatas", gambar tidak akan muncul di situs** —
pengunjung tidak punya akses ke Drive Anda. Ini penyebab gambar kosong yang
paling sering terjadi.

Bentuk tautan Drive apa pun bisa dipakai; sistem mengubahnya sendiri menjadi
alamat gambar langsung.

**Bentuk gambar:** kartu berbentuk mendatar (landscape). Gambar tegak
(portrait) tetap muncul tetapi terpotong atas-bawah. Gambar mendatar
memberi hasil paling rapi.

---

## Kalau bagian itu kosong di situs

| Yang tertulis di situs | Artinya |
| ---------------------- | ------- |
| *Loading publications…* | Sedang mengambil data — tunggu sebentar |
| *Publications could not be loaded right now.* | Gagal menghubungi Spreadsheet. Muat ulang halaman |
| *No publications in this category yet.* | Data terbaca, tetapi kategori itu memang belum ada isinya |

Pesan ketiga muncul misalnya saat tombol 🎬 Video ditekan padahal belum ada
satu pun baris yang berisi tautan YouTube.

⚠️ **Jangan menaruh isi cadangan di dalam kode lagi.** Dulu bagian ini
menyimpan empat artikel di kode, dan akibatnya baris yang ditambahkan ke
Spreadsheet tidak pernah muncul — tidak ada yang menyadarinya berbulan-bulan
karena bagian itu tetap terlihat penuh.
