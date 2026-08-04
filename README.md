# Torgas Blue Energy — Website

Website resmi **Torgas Blue Energy**, laboratorium riset kelautan terintegrasi di Jatinangor, Sumedang, Jawa Barat. Fokus pada teknologi pemantauan laut otonom dan solusi energi bersih berbasis biomassa laut.

🔗 [Instagram](https://www.instagram.com/torgasblueenergy) · [LinkedIn](https://www.linkedin.com/in/torgas-blue-energy-8400473b8) · WhatsApp +62 817-7653-6085

📄 **[SETUP.md](SETUP.md)** — panduan VS Code, GitHub, dan deploy · **[AUDIT.md](AUDIT.md)** — laporan audit teknis

---

## Menjalankan Secara Lokal

```bash
npm install
npm run dev      # http://localhost:5173
```

| Perintah          | Fungsi                            |
| ----------------- | --------------------------------- |
| `npm run dev`     | Server pengembangan + hot reload  |
| `npm run build`   | Build produksi ke `dist/`         |
| `npm run preview` | Menguji hasil build secara lokal  |

## Teknologi

| Komponen   | Teknologi                                       |
| ---------- | ----------------------------------------------- |
| Build      | Vite 5                                          |
| UI         | React 18                                        |
| Styling    | Tailwind CSS (di-compile) + CSS variable kustom |
| Font       | Manrope (Google Fonts)                          |
| Backend    | Google Apps Script → Google Sheets              |
| Deployment | GitHub Pages / Netlify / Vercel (siap pakai)    |

## Struktur Proyek

```
.
├── index.html                 # Entry point Vite
├── src/
│   ├── main.jsx               # Mount aplikasi
│   ├── App.jsx                # Routing halaman & modal
│   ├── index.css              # Tailwind + CSS kustom
│   ├── config.js              # WEBAPI_URL, kode portal, daftar NO_WEBP
│   ├── lib/
│   │   ├── api.js             # Pengiriman form terpusat
│   │   ├── images.js          # Helper path WebP
│   │   └── useReveal.js       # Animasi muncul saat scroll
│   ├── data/                  # Konten: tim, proyek, artikel, legal, mitra
│   ├── components/
│   │   ├── SmartImage.jsx     # <picture> + fallback WebP
│   │   ├── HeaderNav.jsx
│   │   ├── Footer.jsx
│   │   ├── sections/          # 7 bagian landing page
│   │   └── modals/            # 9 modal
│   └── pages/                 # 5 halaman terpisah
├── public/                    # symlink → images/ dan cvs/
├── images/                    # Aset asli + versi .webp
├── cvs/                       # CV anggota tim (PDF)
├── apps-script/Code.gs        # Backend penerima form
└── .github/workflows/         # Deploy otomatis
```

**Mengubah konten** cukup di `src/data/` — tidak perlu menyentuh komponen.

| Ingin mengubah        | Berkas                        |
| --------------------- | ----------------------------- |
| Anggota tim           | `src/data/team.js`            |
| Proyek riset          | `src/data/projects.js`        |
| Artikel & berita      | `src/data/articles.js`        |
| Universitas mitra     | `src/data/collaborators.js`   |
| Layanan laboratorium  | `src/data/services.js`        |
| Halaman legal         | `src/data/legal.js`           |

## Gambar & WebP

Setiap gambar punya dua versi: file asli (`.jpg`/`.png`) dan versi terkompresi (`.webp`). `SmartImage` menyajikan WebP lewat `<picture>`, dan browser lama otomatis mundur ke file asli — **jangan hapus file aslinya.**

```jsx
<SmartImage src="images/projects/Biokimia.jpg" alt="..." className="..." />
```

Tambahkan `eager` untuk gambar yang tampil di layar pertama.

**Menambah gambar baru:**

```bash
python3 -c "
from PIL import Image
im = Image.open('images/projects/baru.jpg')
im.thumbnail((1400, 1400))
im.save('images/projects/baru.webp', 'WEBP', quality=80, method=6)"
```

Bila hasil WebP-nya justru lebih besar, daftarkan path aslinya ke `NO_WEBP` di `src/config.js`.

## Formulir

Seluruh form melewati `submitForm()` di `src/lib/api.js`, yang membaca respons asli dari server dan menampilkan pesan gagal yang sebenarnya. Ini memerlukan Apps Script yang mengembalikan JSON — lihat `apps-script/Code.gs` dan bagian 4 di [SETUP.md](SETUP.md).

## Halaman

| ID / Halaman      | Bagian                    |
| ----------------- | ------------------------- |
| `#about`          | Profil & Status Legal     |
| `#projects`       | Proyek Riset              |
| `#integrated-lab` | Layanan Laboratorium      |
| `#team`           | Tim Peneliti              |
| `#news`           | Publikasi & Berita        |
| `#internship`     | Program Magang            |

Halaman terpisah: Student Portal, Form Magang, Form Part-Time, Kolaborator, Kebijakan Privasi, Ketentuan Layanan.

## Catatan

- `legacy-cdn.html` — salinan utuh versi lama (React via CDN) sebelum migrasi Vite. Disimpan sebagai rujukan, tidak dipakai runtime.
- Kode akses Student Portal tersimpan di sisi klien. Cocok sebagai pembatas ringan, **tidak** untuk melindungi data sensitif.

---

© Torgas Blue Energy
