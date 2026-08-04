# Revisi Pak Tora — Notulen 4 Agustus 2026, 14.45 (12 orang)

Status per 4 Agustus 2026. Nomor mengikuti urutan di notulen.

---

## ✅ Sudah dikerjakan

| # | Poin | Catatan |
| - | ---- | ------- |
| 10 | Logo collaborator diperbesar | 112 → 160 px. Susunan tetap 4 per baris (kompromi: notulen minta diperbesar, Mahdan sebelumnya minta diperkecil). |
| 14 | Research project tambah Salt (Garam) | Deskripsi **sudah terisi** — riset desalinasi berbasis hidrat (judul dari Galuh, 4 Agu). Sisa: **foto masih salah** (menunjuk gambar BIOSENSOR) dan **lokasi perlu dipastikan**. |
| 11 | Community partner Manado | **Ditunda** — nama organisasi belum diketahui, jadi barisnya dihapus dari `src/data/collaborators.js` agar tidak tampil di situs. Contoh baris penggantinya ada di komentar berkas itu. |
| 16 | Visitor website | Kode selesai — analitik tanpa cookie, bisa Umami (gratis) atau Plausible. **Perlu Anda daftar akun & isi `.env`**, lihat SETUP.md bagian 5. Kebijakan Privasi sudah diperbarui. |
| — | *(bonus)* `images/Projects/` → `images/projects/` | Bukan dari notulen. Salah huruf besar — aman di macOS, tapi gambar akan 404 setelah deploy ke server Linux. |
| — | *(bonus)* `fetchpriority` → `fetchPriority` | React mengabaikan versi huruf kecil dan memunculkan peringatan. |

---

## 🐛 Bug besar yang ditemukan 4/8/2026 — tombol upload CV palsu

Ditemukan saat memasukkan konfigurasi dari Galuh (ID Folder CV justru yang membongkarnya).

**Masalahnya.** Di kedua formulir, input file ditulis begini:

```jsx
<input type="file" className="hidden" accept=".pdf" />
```

Tanpa `onChange`, tanpa state, dan payload yang dikirim **tidak memuat file sama sekali**. Pelamar memilih CV, tampilan terlihat normal, tekan Kirim — filenya tidak pernah sampai ke mana pun. Folder Drive penampung CV selalu kosong tanpa ada yang menyadari.

Di formulir Part-Time lebih parah: labelnya ditandai wajib (`*`) padahal tidak divalidasi maupun dikirim.

**Sudah diperbaiki:**

- Komponen baru `src/components/CvUploadField.jsx` — file dibaca jadi base64 dan ikut dikirim
- Validasi ukuran (maks 2 MB) dan tipe berkas di sisi pengguna
- Nama berkas ditampilkan setelah dipilih, dengan tombol "Ganti" — pelamar dapat konfirmasi visual
- Form Part-Time kini benar-benar menolak kirim bila CV belum dilampirkan
- `apps-script/Code.gs` menyimpan CV ke folder Drive, lalu menulis **tautannya** ke Sheet (bukan isi base64-nya — kalau tidak, satu sel bisa berisi ratusan ribu karakter)

⚠️ **Belum berfungsi sampai Apps Script di-deploy ulang.** Perlu dipastikan dulu apakah Galuh sudah punya `Code.gs` sendiri — kalau ya, jangan ditimpa, cukup gabungkan bagian penyimpanan CV-nya.

### Konfigurasi dari Galuh (sudah dimasukkan)

| Nilai | Lokasi di kode |
| ----- | -------------- |
| Web App URL | `src/config.js` → `WEBAPI_URL` |
| ID Spreadsheet | `apps-script/Code.gs` → `SPREADSHEET_ID` |
| ID Folder CV | `apps-script/Code.gs` → `CV_FOLDER_ID` |

---

### ⚠️ Catatan penting untuk poin #16

Notulen menulis *"untuk melihat siapa saja yg melihat website"*. Perlu disampaikan ke Pak Tora: statistik ini menunjukkan **berapa banyak** dan **dari mana**, bukan **siapa**.

Yang terlihat: jumlah kunjungan, halaman terpopuler, negara/kota, perangkat, sumber rujukan.
Yang **tidak** terlihat: nama, email, atau identitas perorangan.

Mengetahui identitas pengunjung satu per satu hanya mungkin bila mereka login lebih dulu. Melacak orang tanpa persetujuan melanggar UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

---

## 🟡 Perlu materi dari Pak Tora

Poin di bawah **tidak bisa dikerjakan** sampai bahannya ada. Sebaiknya dikumpulkan sekaligus dalam satu folder.

| # | Poin | Yang dibutuhkan |
| - | ---- | --------------- |
| 1 | Biokimia: lipid droplet | Paper Pak Tora & Mahdan — judul, abstrak, PDF/tautan |
| 2 | Ocean Blue | Deskripsi yang benar (sudah ada entri "Ocean Blue Health Innovation" — perlu diperbarui atau ini hal lain?) |
| 3 | Microplastic | Idem — sudah ada entrinya, apa yang perlu diubah? |
| 5 | Carbon sequestration assessment & monitoring | Idem — sudah ada di Laboratory Services |
| 6 | Informatic: Galuh | Galuh Pramudya jadi PIC Bioinformatics? Perlu dipastikan maksudnya |
| 7 | Pangandaran: Andini | Nama "Andini" belum ada di data tim — perlu nama lengkap, jabatan, foto, CV |
| 9 | Cover artikel | File gambar (Pak Tora akan kirim) |
| 21 | Sasaran dan capaian | Teks isinya |
| 23 | Grant yang telah didapat | Daftar: nama grant, pemberi, tahun, nilai |
| 24 | Tiap publikasi cover beda-beda | 4 gambar cover (saat ini beberapa publikasi berbagi gambar yang sama) |
| 26 | Project Coordinator di sebelah Leadership | Nama, jabatan lengkap, foto, CV |
| 27 | Video 3 buah | Tautan YouTube: Recap, Java Trip, Pangandaran Trip |
| 17 | Taiwan (NCHU & NDHU) | Nama resmi + file logo |
| 18 | Tambahkan Unpad | File logo (atau sebutkan univ-1…15 mana yang Unpad) |
| 28 | Waste water monitoring | Gambar riset Kathryn (BioXRed) + penjelasan "Microsencus" |

**Catatan #25 vs #28:** kedua poin bertentangan. Diputuskan **#28 yang dipakai** (poin terakhir = koreksi): Biosentor dihapus, diganti Microsencus.

---

## 🔵 Fitur baru — perlu dibangun

| # | Poin | Perkiraan | Catatan teknis |
| - | ---- | --------- | -------------- |
| 15 | Progres project saat diklik | Sedang | Butuh data progres tiap proyek (persentase / tahapan) |
| 19 | Peta ekspedisi — titik lokasi yang sudah dikerjakan | Sedang | Butuh daftar koordinat + nama lokasi |
| 22 | Peta lokasi collaborator | Sedang | Bisa digabung dengan #19 dalam satu peta, beda warna penanda |
| 20 | Video depan autoplay | Mudah | ⚠️ Browser **memblokir autoplay bersuara**. Harus tanpa suara, dengan tombol nyalakan suara. Ini aturan browser, bukan batasan kode. |
| 16 | Visitor website | Mudah | Diputuskan pakai analytics **tanpa cookie** (Plausible/Umami) agar sesuai Kebijakan Privasi |
| 12 | Pendaftaran internship masuk ke 3 email | Sedang | Diubah di `apps-script/Code.gs`. ⚠️ Butuh alamat email Pak Tora & Kepala Lab. Apps Script juga **belum di-deploy ulang** |
| 29 | Label Torgas di dashboard | — | Belum jelas maksudnya. Dashboard yang mana — Student Portal? |

---

## ❓ Perlu diperjelas

| # | Poin | Pertanyaan |
| - | ---- | ---------- |
| 4 | Field survey disimpan di bagian depan | Di Laboratory Services, "Field Survey Services" **sudah paling depan**. Maksudnya dipindah ke section lain? |
| 8 | Tambahkan internship | Section Internship **sudah ada**. Yang ditambah apa — isinya, atau link di menu? |
| 13 | Student Portal untuk mahasiswa bimbingan | Sudah begitu sekarang. Ada yang perlu diubah? |
| 29 | Label Torgas di dashboard | Dashboard mana, dan "label" seperti apa? |

---

## Usulan urutan pengerjaan

**Tahap 1 — bisa jalan sekarang** *(sedang dikerjakan)*
Poin 10 ✅, 14 ✅, 11 ✅

**Tahap 2 — begitu materi masuk**
Poin 17, 18, 26, 7, 27, 9, 24, 21, 23 — semuanya hanya mengisi data, cepat.

**Tahap 3 — fitur baru**
Poin 20, 16, 12 (mudah) → 15, 19, 22 (peta & progres)

**Tahap 4 — setelah diperjelas**
Poin 4, 8, 13, 29
