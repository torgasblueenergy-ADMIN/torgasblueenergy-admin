# Menyalakan WhatsApp Otomatis — Panduan Lengkap

Notifikasi WhatsApp ke pemohon lewat **Meta Cloud API resmi**.
Gratis sampai 1.000 percakapan per bulan.

Kode di sisi Torgas **sudah siap seluruhnya**. Yang tersisa hanya menyiapkan
akun di pihak Meta, lalu memberikan dua nilai ke Claude.

---

## Sebelum mulai

**Pakai akun Facebook yang sudah lama.** Akun baru ditolak Meta dengan pesan
*"Facebook Account Too New To Create A Business"*, dan penolakan itu sering
bertahan berhari-hari — bukan sejam seperti yang tertulis.

Keluar dulu dari akun Facebook yang baru dibuat, lalu masuk dengan akun pribadi
yang sudah bertahun-tahun.

---

## Langkah 1 — Daftar sebagai developer

Buka `developers.facebook.com`

Kalau di pojok kanan atas tertulis **Get Started**, klik dan selesaikan
pendaftarannya. Kalau sudah tertulis **My Apps**, lewati langkah ini.

---

## Langkah 2 — Buat aplikasi

`developers.facebook.com/apps` → **Create app**

| Isian | Isi dengan |
| ----- | ---------- |
| App name | `Torgas Notifikasi` |
| App contact email | `torgasblueenergy@gmail.com` |

→ **Next**

---

## Langkah 3 — Use case

Di kiri, filter **Business messaging**.
Centang kotak di kanan atas kartu **"Connect with customers through WhatsApp"**.

→ **Next**

---

## Langkah 4 — Business portfolio

Kalau belum punya, **Create a business portfolio**:

| Isian | Isi dengan |
| ----- | ---------- |
| Business portfolio name | `Torgas Blue Energy` |
| Nama depan / belakang | nama Anda sendiri |
| Business email | `torgasblueenergy@gmail.com` |

⚠️ Business email **jangan** email pribadi. Ini alamat yang dipakai Meta kalau
akun bermasalah, dan harus tetap terbaca walau orangnya berganti.

→ **Create portfolio** → **Next** → **Requirements** → **Next** → **Create app**

---

## Langkah 5 — TAMBAHKAN ADMIN KEDUA (jangan dilewat)

**Business Settings → Users → People → Add**

Undang satu orang lagi dari tim sebagai **Admin** penuh.

Setiap business portfolio Meta selalu dikendalikan lewat akun pribadi
seseorang. Kalau hanya ada satu admin dan orang itu keluar dari lab,
kehilangan akses, atau akunnya diblokir — **WhatsApp Torgas ikut hilang
bersamanya, dan tidak ada cara memulihkannya.**

Lakukan sekarang, bukan nanti.

---

## Langkah 6 — Phone number ID

Dashboard aplikasi → **WhatsApp → API Setup**

Di sana ada:

- **Phone number ID** — angka panjang. **Ini yang dibutuhkan Claude.**
- **Temporary access token** — ⚠️ jangan dipakai, hanya berlaku 24 jam
- **Test number** dari Meta — gratis, dipakai dulu untuk uji coba

⚠️ **Jangan tekan "Add phone number" untuk mendaftarkan 0851-1104-4226.**

Nomor yang didaftarkan ke Cloud API **tidak bisa lagi dipakai di aplikasi
WhatsApp biasa**. Chat masuk berhenti muncul di HP dan berpindah ke kotak
masuk Meta Business Suite. Nomor itu tercantum di situs sebagai jalur kontak
resmi — kalau admin masih membalas dari HP, mendaftarkannya akan mengacaukan.

Pakai Test number dulu. Keputusan nomor menyusul setelah terbukti berfungsi.

---

## Langkah 7 — Token permanen

**Business Settings → Users → System Users → Add**

| Isian | Isi dengan |
| ----- | ---------- |
| Nama | `torgas-wa` |
| Peran | **Admin** |

Lalu **Generate new token**:

- Aplikasi: `Torgas Notifikasi`
- Centang izin: **`whatsapp_business_messaging`** dan **`whatsapp_business_management`**
- Expiration: **Never**

⚠️ **Token hanya muncul satu kali.** Salin segera. Kalau halamannya tertutup,
token harus dibuat ulang dari awal.

---

## Langkah 8 — Template pesan

**WhatsApp Manager → Message templates → Create template**

| Isian | Isi dengan |
| ----- | ---------- |
| Nama | `konfirmasi_pengajuan` |
| Kategori | **UTILITY** |
| Bahasa | **Indonesian (id)** |

Isi badan pesan **persis** seperti ini:

```
Halo {{1}}, permohonan {{2}} Anda sudah kami terima dengan nomor {{3}}.
Tim Torgas Blue Energy akan meninjau dan mengabari Anda kembali.
Terima kasih.
```

Tunggu sampai statusnya **APPROVED** (beberapa menit sampai beberapa jam).

**Kenapa harus template?** WhatsApp melarang bisnis mengirim pesan bebas
kepada orang yang belum pernah menghubungi lebih dulu. Pemohon kita justru
selalu begitu — mereka mengisi formulir di situs, bukan mengirim WhatsApp.
Ini aturan WhatsApp, bukan batasan kode.

---

## Langkah 9 — Serahkan ke Claude

Kirimkan dua nilai:

1. **Phone number ID**
2. **Token permanen**

Claude memasukkannya ke Apps Script.

---

## Langkah 10 — Setujui izin

Apps Script → pilih fungsi **`testWhatsApp`** pada dropdown → **Run** →
setujui jendela izin yang muncul.

WhatsApp memakai `UrlFetchApp`, dan itu izin baru. Apps Script menolak
menjalankan **apa pun** selama masih ada izin yang belum disetujui — termasuk
formulir pendaftaran dan tombol persetujuan email. Karena itu penerbitan
sengaja ditahan sampai langkah ini selesai.

Baca **Execution log**, lalu kabari Claude untuk melepas penahan.

---

## Yang sudah dijamin dari sisi kode

**Kegagalan WhatsApp tidak akan pernah menggagalkan pendaftaran.** Token
kedaluwarsa, template ditolak, jaringan putus — pendaftaran tetap tersimpan,
email tetap terkirim. WhatsApp itu pelengkap, bukan syarat.

Nomor HP dibakukan sejak disimpan: `0851-1104-4226`, `+62 851 1104 4226`, dan
`(0851) 1104-4226` semuanya menjadi `6285111044226`.

Pemohon yang tidak mengisi nomor, atau mengisi nomor tidak sah, dilewati
tanpa galat.
