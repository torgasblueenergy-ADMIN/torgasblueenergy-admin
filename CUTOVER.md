# Rencana Penggantian Situs — torgasblueenergy.com

Situs **sudah hidup** dengan desain lama di GitHub Pages. Dokumen ini mengatur cara menggantinya dengan desain baru tanpa merusak apa pun.

> ⛔ **Jangan jalankan sebelum Pak Tora menyetujui desain baru.**
> Deploy otomatis sudah dimatikan di `.github/workflows/deploy.yml` — workflow hanya bisa dijalankan manual.

---

## Kondisi saat ini

| | Situs lama (hidup) | Situs baru (siap) |
| - | ------------------ | ----------------- |
| Alamat | https://torgasblueenergy.com | belum terbit |
| Hosting | GitHub Pages | repo `torgasblueenergy-ADMIN/torgas-blue-energy` |
| Deskripsi | "laboratorium riset kelautan di **Pangandaran**" | "di **Jatinangor**, Sumedang" |
| Sitemap | ❌ tidak ada | ✅ `public/sitemap.xml` |
| robots.txt | ❌ tidak ada | ✅ `public/robots.txt` |
| Struktur | satu halaman | satu halaman |

Keduanya satu halaman, jadi **risiko URL mati sangat kecil**.

---

## ⚠️ Tiga hal yang harus dibereskan dulu

### 1. Repo baru masih private

GitHub Pages dari repository **private** hanya tersedia di paket **GitHub Pro / Team / Enterprise**. Kalau akun Torgas memakai paket gratis, ada dua pilihan:

- Jadikan repo **public** — kode situs memang tidak berisi rahasia. Tapi periksa dulu: `src/config.js` memuat `STUDENT_PORTAL_CODE` dan URL Apps Script. Kode portal sebaiknya diganti sebelum repo dibuka.
- Atau **upgrade** ke GitHub Pro.

Cek paket Anda di [github.com/settings/billing](https://github.com/settings/billing).

### 2. Satu domain hanya boleh dipakai satu repo

`torgasblueenergy.com` sekarang terikat ke repo lama. Domain harus **dilepas dulu** dari repo lama sebelum bisa dipasang di repo baru. Kalau tidak, GitHub akan menolak dengan pesan *"domain is already taken"*.

### 3. Putuskan: Pangandaran atau Jatinangor?

Deskripsi kedua situs berbeda. Ini memengaruhi hasil pencarian Google. Kalau keduanya benar (lab di Jatinangor, stasiun di Pangandaran), sebaiknya sebut keduanya. Ubah di `index.html` pada `meta description`, `og:description`, dan `twitter:description`.

---

## Langkah penggantian

### Sebelum hari-H

1. **Simpan cadangan situs lama.** Repo lama sudah jadi cadangan — jangan dihapus, cukup diamkan. Catat nama repo-nya di sini: `________________`
2. Pastikan `npm run build` berhasil dan `dist/` berisi `CNAME`, `images/`, `cvs/`
3. Tunjukkan hasilnya ke Pak Tora lewat Port Forwarding (lihat SETUP.md)
4. Dapatkan persetujuan tertulis

### Hari-H (perkiraan 10–15 menit, situs mati sebentar)

**Langkah 1 — lepas domain dari repo lama**

Repo lama → **Settings** → **Pages** → kolom **Custom domain** → kosongkan → **Save**

**Langkah 2 — aktifkan Pages di repo baru**

Repo `torgas-blue-energy` → **Settings** → **Pages** → **Source: GitHub Actions**

**Langkah 3 — hidupkan deploy otomatis**

Buka `.github/workflows/deploy.yml`, hapus tanda komentar pada dua baris:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

**Langkah 4 — jalankan deploy**

Repo → tab **Actions** → **Build & Deploy** → **Run workflow**

**Langkah 5 — pasang domain**

Repo baru → **Settings** → **Pages** → **Custom domain** → isi `torgasblueenergy.com` → **Save**
Tunggu pemeriksaan DNS selesai, lalu centang **Enforce HTTPS**.

Sertifikat HTTPS baru butuh beberapa menit sampai satu jam. Selama itu mungkin muncul peringatan keamanan — normal, tunggu saja.

**Langkah 6 — DNS tidak perlu diubah**

Karena hosting lama juga GitHub Pages, record DNS-nya sudah benar. Tidak ada yang perlu disentuh di penyedia domain.

---

## Setelah terbit — periksa ini

- [ ] https://torgasblueenergy.com terbuka dengan desain baru
- [ ] Gembok HTTPS muncul di address bar
- [ ] Halaman Collaborator: 15 logo tampil, tidak ada kotak putih
- [ ] Research Team: 20 orang
- [ ] Footer: Kebijakan Privasi & Ketentuan Layanan terbuka
- [ ] Buka dari HP
- [ ] Bagikan tautannya di WhatsApp — pratinjau gambar & judul harus muncul
- [ ] Kirim satu form uji, pastikan datanya masuk ke Google Sheet
- [ ] Daftarkan ke [Google Search Console](https://search.google.com/search-console) dan kirim `sitemap.xml`
- [ ] Cek dasbor Umami — kunjungan mulai tercatat

---

## Kalau ada masalah — cara kembali

Situs lama masih utuh di repo lamanya. Untuk membatalkan:

1. Repo baru → Settings → Pages → kosongkan **Custom domain**
2. Repo lama → Settings → Pages → isi kembali `torgasblueenergy.com`

Situs lama hidup lagi dalam hitungan menit. Tidak ada data yang hilang.
