# Laporan Audit — Website Torgas Blue Energy

Tanggal: 3 Agustus 2026 · File: `index.html` (3.171 baris, 192 KB) · Aset: 9,5 MB gambar + 1,5 MB CV

---

## Ringkasan

Kode ini **jauh lebih rapi dari yang biasa ditemui** di proyek satu-file: 25 komponen React terpisah dengan penamaan jelas, sistem CSS variable yang konsisten, dan data konten dipisah ke konstanta di atas. Struktur ini layak dipertahankan.

Masalahnya bukan pada arsitektur, tapi pada **hal-hal yang membuat situs terlihat rusak di mata pengunjung** dan **hambatan menuju produksi**. Ada 5 temuan kritis yang seluruhnya bisa diperbaiki dalam hitungan jam.

| Tingkat  | Jumlah | Ringkas                                             |
| -------- | ------ | --------------------------------------------------- |
| 🔴 Kritis | 5      | Gambar rusak, form tanpa validasi, Babel di browser |
| 🟠 Penting| 6      | SEO, aksesibilitas, ukuran gambar, keamanan portal  |
| 🟡 Rapikan| 5      | Aset menganggur, semantik HTML, hook, tautan mati   |

---

## 🔴 Kritis

### K1 — 7 logo kolaborator rusak (salah ekstensi)

Baris 441–445 membuat semua path logo dengan ekstensi `.png`:

```js
logo: `images/collaborators/univ-${i + 1}.png`
```

Padahal 7 dari 15 file sebenarnya berformat `.jpg`:

`univ-4` · `univ-5` · `univ-6` · `univ-8` · `univ-10` · `univ-12` · `univ-15`

**Akibat:** hampir separuh logo mitra tampil sebagai ikon gambar rusak di halaman Kolaborator.

**Perbaikan:** ubah data jadi array eksplisit berisi nama file asli (sekalian isi nama universitas yang sebenarnya — saat ini masih placeholder `"Universitas Partner 1"`).

### K2 — 5 file gambar/CV hilang

Dirujuk di kode tapi filenya tidak ada di folder:

```
cvs/alifannursin.pdf
images/activities/activity-1.jpeg
images/activities/activity-6.jpg
images/projects/biosentor-xray.jpg
images/projects/carbon-storage-1.jpg
```

**Akibat:** gambar rusak di section Proyek dan Kegiatan; tombol CV Alifannursin menghasilkan halaman kosong.

**Perbaikan:** sediakan file yang hilang, atau hapus/ganti rujukannya. Tambahkan juga *fallback* `onError` agar gambar rusak diganti placeholder, bukan ikon patah.

### K3 — Form tidak bisa tahu apakah pengiriman berhasil

Ke-9 form (booking lab, magang, part-time, portal mahasiswa) mengirim ke Google Apps Script dengan:

```js
fetch(WEBAPI_URL, { method: 'POST', mode: 'no-cors', ... })
```

`mode: 'no-cors'` membuat respons **selalu buram** — kode tidak bisa membaca status sukses/gagal. Artinya pesan "berhasil dikirim" yang muncul ke pengguna itu **selalu tampil**, bahkan ketika data sebenarnya gagal masuk.

**Akibat:** pendaftar magang bisa merasa sudah terdaftar padahal datanya tidak pernah sampai. Ini risiko paling mahal secara operasional.

**Perbaikan:** ubah Apps Script agar mengembalikan header CORS (`ContentService` + deploy "Anyone"), lalu hapus `no-cors` supaya respons benar-benar terbaca. Tambahkan penanganan error dan tombol "coba lagi".

### K4 — Babel dijalankan di browser pengunjung

```html
<script src="https://unpkg.com/@babel/standalone@7.23.9/babel.min.js"></script>
<script type="text/babel"> ... 3.051 baris JSX ... </script>
```

Babel Standalone berukuran ±3 MB dan harus **men-transpile 3.051 baris JSX di perangkat setiap pengunjung sebelum apa pun tampil**. Di HP kelas menengah dengan jaringan 4G, ini berarti layar putih 3–6 detik.

**Perbaikan:** pindah ke Vite (build sekali di komputer, pengunjung terima JS jadi). Bisa dilakukan bertahap tanpa mengubah komponen — lihat Roadmap Fase 3.

### K5 — Tailwind lewat CDN

`cdn.tailwindcss.com` juga men-generate CSS di browser dan secara resmi **tidak dianjurkan untuk produksi**. Menambah ±1 detik dan menyebabkan kedipan tanpa gaya (FOUC) saat halaman pertama dimuat.

**Perbaikan:** ikut terselesaikan saat migrasi ke Vite (Tailwind di-compile jadi satu file CSS kecil).

---

## 🟠 Penting

### P1 — Tidak ada meta tag Open Graph / Twitter (0 buah)

Saat tautan situs dibagikan di WhatsApp, LinkedIn, atau Instagram, **tidak muncul pratinjau gambar maupun judul** — hanya URL polos. Untuk lembaga riset yang mengandalkan penyebaran tautan, ini kerugian nyata.

**Perbaikan:** tambahkan `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, plus JSON-LD `ResearchOrganization` untuk Google.

### P2 — Tidak ada satu pun `loading="lazy"` pada 18 tag `<img>`

Semua gambar dimuat sekaligus di awal, termasuk yang berada jauh di bawah layar.

**Perbaikan:** tambahkan `loading="lazy"` + `decoding="async"` pada semua gambar kecuali yang tampil pertama di layar (hero).

### P3 — Gambar belum dioptimasi (9,5 MB total)

Yang terbesar:

| File                                   | Ukuran |
| -------------------------------------- | ------ |
| `collaborators/univ-10.jpg`            | 776 KB |
| `Brosur/Brosur-3.jpg`                  | 616 KB |
| `collaborators/univ-14.png`            | 604 KB |
| `projects/Biokimia.jpg`                | 384 KB |

Sebuah **logo universitas 776 KB** jelas berlebihan — seharusnya di bawah 30 KB.

**Perbaikan:** konversi ke WebP + ubah ukuran sesuai kebutuhan tampilan. Perkiraan hasil: 9,5 MB → sekitar 1,5 MB (turun ±84%).

### P4 — Kode akses Student Portal tertanam di kode sumber

```js
if (code.trim().toUpperCase() === 'TORGAS2026' || code.trim() === '1234')
```

Siapa pun yang menekan "View Source" bisa membacanya. Kode `1234` juga bisa ditebak dalam sekali coba.

**Perbaikan:** kalau isi portal tidak sensitif, ini bisa diterima — cukup hapus `1234`. Kalau ada data pribadi mahasiswa di dalamnya, verifikasi harus pindah ke sisi server (Apps Script).

### ~~P5 — Judul `<h1>` ada 5 buah~~ · ❌ TEMUAN KELIRU, DIBATALKAN

Saya awalnya menandai 5 `<h1>` sebagai masalah. **Setelah diperiksa ulang di `App()`, ini ternyata benar.**

Keempat `h1` lainnya berada di halaman terpisah (Student Portal, Form Magang, Form Part-Time, Kolaborator) yang dirender lewat *early return* yang saling eksklusif:

```js
if (isStudentPortalActive) return <StudentPortalPage ... />;
if (isInternshipFormActive) return <InternshipFormPage ... />;
```

Artinya **hanya satu `h1` yang pernah ada di DOM pada satu waktu**. Struktur ini sudah tepat — tidak ada yang perlu diubah.

### P6 — Tidak ada elemen `<main>`

Ada `<header>`, `<nav>`, `<footer>`, dan 7 `<section>` — tapi tidak ada `<main>` yang membungkus isi utama. Pembaca layar jadi kehilangan penanda "lompat ke konten".

---

## 🟡 Rapikan

| #  | Temuan                                                                                                                                          |
| -- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 | **6 anggota tim punya foto + CV lengkap tapi tidak ditampilkan**: Akmal, Annisa, Aziza, Fakhri, Muzhaffirah, Tabriiz. Sengaja atau terlewat?     |
| R2 | `images/projects/biomassa.jpg` tidak dipakai sama sekali.                                                                                        |
| R3 | Hook `useReveal()` (baris 456) tidak punya *dependency array*, sehingga `IntersectionObserver` dibuat ulang **setiap kali render**. Boros memori.|
| R4 | Tautan "Ketentuan Layanan" dan "Kebijakan Privasi" di footer mengarah ke `href="#"` — belum ada halamannya.                                      |
| R5 | Nama universitas mitra masih placeholder: `"Universitas Partner 1"` … `"Universitas Partner 15"`.                                                |

---

## Roadmap Perbaikan

### ✅ Fase 1 — SELESAI (3 Agustus 2026)

| # | Perbaikan                                                                                              | Status |
| - | ------------------------------------------------------------------------------------------------------ | ------ |
| 1 | `UNIV_COLLABORATORS` jadi array eksplisit — 7 logo `.jpg` yang tadinya rusak kini tampil (K1)           | ✅      |
| 2 | 4 gambar artikel dialihkan ke file yang ada; `onError` fallback yang tadinya juga rusak ikut diperbaiki | ✅      |
| 3 | `cvPdf` Alifannursin → `null` + UI *"CV belum tersedia"* menggantikan iframe kosong (K2)                | ✅      |
| 4 | 10 tag Open Graph, 4 Twitter Card, canonical, JSON-LD `ResearchOrganization` (P1)                       | ✅      |
| 5 | `loading="lazy"` di 11 gambar, `decoding="async"` di 14 (P2)                                           | ✅      |
| 6 | `<main id="konten-utama">` membungkus konten landing page (P6)                                         | ✅      |
| 7 | Skip link, `:focus-visible`, dan `prefers-reduced-motion` (aksesibilitas)                               | ✅      |
| 8 | `useReveal` diberi dependency array `[]` — observer tak lagi dibuat ulang tiap render (R3)              | ✅      |
| 9 | Kode akses `1234` dihapus; petunjuk yang menampilkan kode di layar juga dihapus (P4)                    | ✅      |

**Verifikasi yang dijalankan:**

- ✅ 78 rujukan file — semuanya ada, nol yang hilang
- ✅ 3.128 baris JSX berhasil dikompilasi Babel — nol syntax error
- ✅ JSON-LD lolos `JSON.parse`
- ✅ 15/15 logo kolaborator cocok dengan file aslinya
- ✅ Tepat satu `<main>`, satu `<h1>` aktif per halaman

**Alt text yang ikut diperbaiki:** logo kolaborator kini pakai `alt={`Logo ${univ.name}`}` (dulu semua sama), watermark diberi `alt="" aria-hidden="true"` karena murni dekoratif.

⚠️ **Perlu tindakan Anda:** ganti `https://torgasblueenergy.com` di bagian `<head>` dengan domain asli setelah deploy — tanpa URL absolut, pratinjau link tidak akan muncul. Isi juga nama 15 universitas mitra yang masih `"Universitas Partner 1…15"`.

### ✅ Fase 2 — SELESAI (3 Agustus 2026)

| #  | Perbaikan                                                                                   | Status |
| -- | -------------------------------------------------------------------------------------------- | ------ |
| 10 | 76 gambar dikonversi ke WebP dengan kualitas adaptif per file (P3)                           | ✅      |
| 11 | Komponen `SmartImage` — `<picture>` + WebP, mundur otomatis ke format asli                   | ✅      |
| 12 | Background CSS ikut diarahkan ke WebP agar tidak ada unduhan ganda                           | ✅      |
| 13 | 6 anggota tim ditampilkan; nama & bidang diambil dari isi CV masing-masing (R1)              | ✅      |
| 14 | Halaman Kebijakan Privasi & Ketentuan Layanan + link footer yang tadinya mati (R4)           | ✅      |

**Hasil kompresi: 9,35 MB → 2,87 MB (turun 69%).**

Penghematan terbesar:

| File                        | Sebelum | Sesudah | Turun |
| --------------------------- | ------- | ------- | ----- |
| `collaborators/univ-10.jpg` | 772 KB  | 22 KB   | −97%  |
| `collaborators/univ-14.png` | 600 KB  | 31 KB   | −94%  |
| `projects/Biokimia.jpg`     | 382 KB  | 29 KB   | −92%  |
| `People/Head/*.jpg` (×20)   | 98 KB   | 9 KB    | −90%  |

**Temuan tak terduga selama kompresi:**

- **Foto `Head` ternyata beresolusi sama persis dengan `Body`** — 900×1600 piksel, padahal hanya tampil sebagai potret kecil di kartu tim. Diturunkan ke 600 px sisi terpanjang.
- **`Brosur-3.jpg` berukuran 6000×8000 piksel.** Pada percobaan pertama hasil WebP-nya justru lebih besar dari aslinya (614 KB → 672 KB). Setelah target diturunkan ke 1200 px @ q72, jadi 327 KB.
- **4 gambar tidak menguntungkan bila dikonversi** (aslinya sudah sangat terkompresi). Keempatnya didaftarkan di konstanta `NO_WEBP` dan tetap disajikan dalam format asli:
  `Brosur-1.jpg` · `Homepage-2.jpg` · `Homepage-3.jpg` · `Homepage-4.jpg`

**Anggota tim yang kini tampil** — nama lengkap dan bidang keahlian diekstrak langsung dari CV:

| Nama                             | Bidang                                          |
| -------------------------------- | ----------------------------------------------- |
| An-Nisa Nurul Azqiya             | Marine Ecology & Water Quality Analysis         |
| Aziza Nabila Nurshafa            | Coral Reef Conservation & Underwater Survey     |
| Fakhri Daffa Fauzi               | Marine Conservation & Field Research            |
| Muzhaffirah Gyda Kania Subagja   | Hydro-Oceanography & Environmental Data Analysis|
| Tabriiz Rosyanfiqr               | Scientific Visualization & Research Programming |
| Akmal ⚠️                          | *CV berupa hasil pindaian — belum bisa dibaca*  |

Total anggota kini **20 orang** (sebelumnya 14).

**Verifikasi yang dijalankan:**

- ✅ Ketiga halaman berhasil dirender penuh lewat `react-dom/server` — nol runtime error
- ✅ 25 aset yang diminta saat render, semuanya ada
- ✅ 10 elemen `<picture>` dengan `<source type="image/webp">` yang cocok
- ✅ Semua 76 file WebP bisa dibuka Pillow — nol yang korup

⚠️ **Perlu tindakan Anda:**

1. Lengkapi `name` dan `focus` untuk **Akmal** (id `rtj-13`) — CV-nya hasil pindaian tanpa teks.
2. Konfirmasi `role` 6 anggota baru — sementara diisi `"Research Assistant"`.
3. Tinjau draft halaman legal bersama penasihat hukum, lalu hapus banner peringatan draft.
4. Hapus 2 file sampah uji coba: `images/.__test.webp` dan `images/.__zz.tmp` (sandbox saya tidak punya izin hapus).

### ✅ Fase 3 — SELESAI (3 Agustus 2026)

| #  | Perbaikan                                                                    | Status |
| -- | ---------------------------------------------------------------------------- | ------ |
| 15 | Migrasi ke Vite 5 — Babel tidak lagi berjalan di browser pengunjung (K4)     | ✅      |
| 16 | Tailwind di-compile jadi satu file CSS 44,5 KB, bukan JIT di browser (K5)    | ✅      |
| 17 | `index.html` 3.666 baris dipecah jadi 36 modul di `src/`                     | ✅      |
| 18 | `submitForm()` terpusat — respons server kini benar-benar terbaca (K3)       | ✅      |
| 19 | `apps-script/Code.gs` — backend pendamping yang mengembalikan JSON           | ✅      |
| 20 | GitHub Actions + Netlify + Vercel siap pakai                                 | ✅      |

**Ukuran yang diunduh pengunjung: ~759 KB → 84,5 KB gzip (turun 89%).**

| Berkas                     | Lama (gzip) | Baru (gzip) |
| -------------------------- | ----------- | ----------- |
| Babel Standalone           | 553,8 KB    | — (hilang)  |
| Tailwind CDN (JIT)         | ~115 KB     | 8,0 KB      |
| React                      | 46,2 KB     | 44,2 KB     |
| Kode aplikasi              | 43,7 KB     | 30,8 KB     |
| **Total**                  | **~759 KB** | **84,5 KB** |

Babel Standalone saja 2,4 MB mentah — hilang sepenuhnya karena JSX kini dikompilasi saat build, bukan di perangkat pengunjung.

**Struktur baru:** 36 modul — 7 section, 9 modal, 5 halaman, 6 berkas data, 3 helper.
Mengubah konten kini cukup menyentuh `src/data/`, tidak perlu membuka komponen.

**Perbaikan form (K3).** `mode: 'no-cors'` dihapus; `submitForm()` di `src/lib/api.js` membaca respons asli, memakai `Content-Type: text/plain` supaya tidak memicu preflight OPTIONS yang tidak bisa dijawab Apps Script, dan punya batas waktu 20 detik. Pesan gagal kini menyebut sebab yang sebenarnya.

**Empat bug yang ketahuan saat migrasi:**

1. **`ReactDOM.createRoot` lama ikut terbawa ke `App.jsx`** — akan menyebabkan aplikasi ter-mount dua kali. Ketahuan lewat uji render.
2. **`toWebp` tidak terimpor di `Hero.jsx` dan `ProjectsSection.jsx`** — pemindai simbol saya membuang isi `` `url('${toWebp(img)}')` `` karena mengira tanda kutip tunggal di dalamnya adalah literal string. Landing page gagal render sampai diperbaiki.
3. **Lima modal kehilangan `setTimeout` penutupnya** saat konversi form otomatis, karena barisnya mengandung `setStatusMsg`. Modal tidak akan menutup setelah sukses.
4. **`SystemModal` sama sekali tidak punya `.catch`** — kegagalan lolos tanpa jejak apa pun. Diperbaiki manual.

**Verifikasi yang dijalankan:**

- ✅ `vite build` — 63 modul, nol error
- ✅ Ketujuh halaman dirender lewat `react-dom/server` dari modul `src/` — nol runtime error
- ✅ Dev server diuji: `/`, `/src/main.jsx`, `/images/*`, `/cvs/*` semuanya HTTP 200
- ✅ 31 elemen `<picture>` cocok dengan 31 `<source webp>`
- ✅ Nol sisa `mode: 'no-cors'` di seluruh `src/`

⚠️ **Perlu tindakan Anda:**

1. **Deploy ulang Apps Script** dengan `apps-script/Code.gs` — tanpa ini form akan menampilkan error (bukan sukses palsu, tapi tetap belum berfungsi).
2. Push ke GitHub — perlu kredensial Anda. Lihat [SETUP.md](SETUP.md) bagian 2.
3. Ganti `https://torgasblueenergy.com` di `index.html` setelah domain aktif.

### Fase 4 — Online

15. Push ke GitHub
16. Deploy ke Netlify/Vercel (otomatis tiap `git push`)
17. Sambungkan domain, aktifkan HTTPS
18. Pasang Google Analytics + daftarkan ke Google Search Console

---

## Yang Sudah Beres

- ✅ Repository Git terinisialisasi (branch `main`, 101 file, commit awal)
- ✅ `.gitignore` (macOS, editor, node, rahasia)
- ✅ `README.md` — dokumentasi struktur & cara menjalankan
- ✅ `.vscode/settings.json` + `extensions.json` — Live Server, Prettier, Tailwind IntelliSense
- ✅ `.editorconfig` — konsistensi format antar editor
