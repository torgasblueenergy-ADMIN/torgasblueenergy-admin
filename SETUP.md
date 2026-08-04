# Panduan Setup — VS Code, GitHub, dan Deploy

---

## 1. Membuka proyek di VS Code

```bash
cd ~/DESAIN_BARU_TORGAS\ 2
code .
```

Saat pertama dibuka, VS Code akan menawarkan **"Install recommended extensions"** — terima saja. Daftarnya sudah disiapkan di `.vscode/extensions.json`:

| Ekstensi                    | Gunanya                                            |
| --------------------------- | -------------------------------------------------- |
| Tailwind CSS IntelliSense   | Autocomplete + preview warna untuk class Tailwind  |
| Prettier                    | Format otomatis saat menyimpan file                |
| ES7 React Snippets          | Pintasan seperti `rafce` untuk membuat komponen    |
| Error Lens                  | Menampilkan error langsung di baris kodenya        |
| GitLens                     | Melihat siapa mengubah baris apa dan kapan         |

### Menjalankan situs

Setelah migrasi Vite, **jangan lagi pakai Live Server.** Gunakan terminal VS Code (`Ctrl+``):

```bash
npm install     # cukup sekali
npm run dev     # buka http://localhost:5173
```

Vite punya *hot reload*: simpan file, browser langsung memperbarui tampilan tanpa refresh.

| Perintah          | Fungsi                                   |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Server pengembangan + hot reload         |
| `npm run build`   | Build produksi ke `dist/`                |
| `npm run preview` | Menguji hasil build secara lokal         |

---

## 2. Menghubungkan ke GitHub

> **Catatan:** langkah ini harus Anda jalankan sendiri karena memerlukan kredensial GitHub Anda.

### a. Bersihkan file lock terlebih dahulu

```bash
cd ~/DESAIN_BARU_TORGAS\ 2
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock
find .git -name "tmp_obj_*" -delete
rm -f images/.__test.webp images/.__zz.tmp ssr-check.mjs
```

### b. Commit seluruh pekerjaan

```bash
git add -A
git commit -m "Fase 1-3: perbaikan aset, WebP, migrasi Vite, modularisasi"
```

### c. Buat repository di GitHub

Buka [github.com/new](https://github.com/new) → beri nama `torgas-blue-energy` → **jangan** centang "Add a README" (repo lokal Anda sudah punya).

### d. Hubungkan dan push

```bash
git remote add origin https://github.com/USERNAME/torgas-blue-energy.git
git push -u origin main
```

Ganti `USERNAME` dengan nama akun GitHub Anda. Bila diminta password, gunakan **Personal Access Token** ([buat di sini](https://github.com/settings/tokens)), bukan password akun — GitHub sudah tidak menerima password sejak 2021.

Lebih praktis: pasang GitHub CLI, lalu autentikasi lewat browser.

```bash
brew install gh
gh auth login
gh repo create torgas-blue-energy --private --source=. --push
```

### e. Alur kerja harian setelah terhubung

```bash
git add -A
git commit -m "deskripsi singkat perubahan"
git push
```

Di VS Code, ketiganya bisa dilakukan lewat panel **Source Control** (`Ctrl+Shift+G`) tanpa mengetik perintah.

---

## 3. Menerbitkan situs ke internet

Tiga opsi sudah dikonfigurasi. Pilih salah satu.

### Opsi A — GitHub Pages (gratis, paling menyatu dengan GitHub)

Berkasnya sudah ada di `.github/workflows/deploy.yml`. Cukup aktifkan:

1. Repo GitHub → **Settings** → **Pages**
2. **Source** → pilih **GitHub Actions**
3. Push apa pun ke `main` → situs terbit otomatis

Alamatnya: `https://USERNAME.github.io/torgas-blue-energy/`

> Bila memakai subpath seperti di atas (bukan domain sendiri), tambahkan `base: '/torgas-blue-energy/'` di `vite.config.js`.

### Opsi B — Netlify (paling mudah untuk domain sendiri)

1. [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Pilih repo Anda — Netlify otomatis membaca `netlify.toml`
3. Deploy

### Opsi C — Vercel

1. [vercel.com/new](https://vercel.com/new) → import repo
2. Konfigurasi terbaca otomatis dari `vercel.json`

### Setelah domain aktif — WAJIB

Buka `index.html` dan ganti **semua** `https://torgasblueenergy.com` dengan domain asli Anda (ada di 6 tempat: canonical, og:url, og:image, twitter:image, dan JSON-LD). Tanpa URL absolut yang benar, pratinjau link di WhatsApp dan LinkedIn tidak akan muncul.

---

## 4. Mengaktifkan perbaikan form

Perbaikan di sisi website **belum berfungsi** sampai Apps Script diperbarui. Selama belum, form akan menampilkan pesan error alih-alih sukses palsu — itu memang perilaku yang diinginkan, tapi jelas belum selesai.

1. Buka Google Sheet tujuan → **Extensions** → **Apps Script**
2. Timpa isi `Code.gs` dengan berkas `apps-script/Code.gs` di repo ini
3. Ganti `SPREADSHEET_ID` dengan ID Sheet Anda (ambil dari URL-nya)
4. **Deploy** → **New deployment** → **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** ← wajib, bukan "Anyone with Google account"
5. Salin URL `/exec` hasil deploy ke `WEBAPI_URL` di `src/config.js`

Uji cepat: buka URL `/exec` itu di browser. Kalau muncul `{"status":"success", ...}`, berarti sudah benar.

---

## 5. Mengaktifkan statistik pengunjung

> **Yang bisa dan tidak bisa dilihat.** Statistik ini menunjukkan **berapa banyak** dan **dari mana** pengunjung datang — bukan **siapa** orangnya. Tidak ada nama atau identitas perorangan. Mengetahui identitas pengunjung satu per satu hanya mungkin bila mereka login, dan melacak orang tanpa persetujuan melanggar UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

Yang akan terlihat di dasbor: jumlah kunjungan harian, halaman terpopuler, negara/kota asal, jenis perangkat, dan sumber rujukan (Google, Instagram, WhatsApp).

### Langkah pemasangan — Umami (gratis)

1. Daftar di [cloud.umami.is](https://cloud.umami.is) — tanpa kartu kredit
2. **Add website** → isi domain Torgas
3. Buka **Settings** → salin **Website ID**
4. Di folder proyek:

```bash
cp .env.example .env
```

5. Buka `.env`, isi dua baris ini:

```
VITE_ANALYTICS_PROVIDER=umami
VITE_UMAMI_WEBSITE_ID=<tempel Website ID di sini>
```

6. Jalankan ulang dev server (Vite hanya membaca `.env` saat start)

### Saat deploy

`.env` sengaja tidak ikut ter-commit ke GitHub. Isi nilai yang sama lewat **Environment Variables** di dasbor hosting:

| Hosting | Lokasi |
| ------- | ------ |
| GitHub Pages | Repo → Settings → Secrets and variables → Actions → Variables |
| Netlify | Site configuration → Environment variables |
| Vercel | Project Settings → Environment Variables |

### Catatan

- Statistik **tidak dihitung saat `npm run dev`** — agar data tidak tercemar kunjungan Anda sendiri saat mengembangkan
- Pengunjung yang mengaktifkan **Do Not Track** di peramban tidak dihitung
- Tidak ada cookie, jadi **tidak perlu banner cookie**
- Ingin pindah ke Plausible (USD 9/bulan)? Cukup ubah `VITE_ANALYTICS_PROVIDER=plausible` dan isi `VITE_PLAUSIBLE_DOMAIN` — kode tidak perlu disentuh

---

## 6. Kalau terjadi masalah

| Gejala                                   | Penyebab & solusi                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev` gagal                      | Jalankan `npm install` dulu                                                        |
| Gambar tidak muncul di dev server        | `public/images` adalah symlink — pastikan tidak terhapus                           |
| Situs blank setelah deploy               | Kemungkinan `base` di `vite.config.js` salah saat memakai subpath GitHub Pages     |
| Form selalu gagal                        | Apps Script belum di-deploy ulang dengan akses **Anyone** (lihat bagian 4)         |
| Perubahan Apps Script tidak berpengaruh  | Menyimpan saja tidak cukup — harus **Deploy → New version**                        |
| Ingin kembali ke versi lama              | `legacy-cdn.html` adalah salinan utuh versi CDN sebelum migrasi                    |
