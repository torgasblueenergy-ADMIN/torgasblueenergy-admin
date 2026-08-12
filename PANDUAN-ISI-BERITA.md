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
| **Ringkasan_Pendek** | tidak | Ringkasan singkat |
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

**Cukup tempelkan tautan YouTube ke kolom `Link_Gambar_Cover`.** Tidak perlu
mengetik "Video" di kolom kategori, dan tidak perlu mengunggah gambar apa pun.

Contoh baris video:

| ID | Judul | Tipe_Kategori | Tanggal | Link_Gambar_Cover |
| -- | ----- | ------------- | ------- | ----------------- |
| `VID-04` | Torgas Blue Energy Profile | News | 3 Agustus 2026 | `https://youtu.be/dQw4w9WgXcQ` |

Yang terjadi otomatis:

- Kartunya masuk kategori **Video** dan ikut terhitung di tombol 🎬 Video
- Thumbnail diambil sendiri dari YouTube — **tidak perlu diunggah**
- Muncul tombol putar di tengah kartu
- Saat diklik, videonya diputar langsung di dalam situs

Bentuk tautan yang dikenali:

```
https://www.youtube.com/watch?v=XXXXXXXXXXX
https://youtu.be/XXXXXXXXXXX
https://www.youtube.com/embed/XXXXXXXXXXX
https://www.youtube.com/shorts/XXXXXXXXXXX
https://www.youtube.com/live/XXXXXXXXXXX
```

Tautan boleh juga diselipkan di kolom `Konten_Lengkap` atau
`Ringkasan_Pendek` — tetap terbaca.

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
