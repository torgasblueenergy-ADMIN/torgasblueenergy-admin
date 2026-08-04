# Backend Apps Script

Skrip backend **sengaja tidak disimpan di repositori ini.**

## Alasannya

Repositori ini **publik**. Skrip backend memuat nilai yang tidak boleh terbaca umum:

| Nilai | Kalau bocor |
| ----- | ----------- |
| `SECRET_KEY` | Siapa pun bisa menghitung sendiri token approve/reject, lalu **menyetujui atau menolak pengajuan orang lain** tanpa akses email admin. Ini yang paling berbahaya. |
| `SPREADSHEET_ID` | ID Sheet berisi data pribadi pelamar |
| `DRIVE_FOLDER_ID` | Folder berisi berkas CV pelamar |
| `ADMIN_EMAILS`, `RAB_CC_EMAILS` | Alamat email pribadi pengurus |

Skrip lengkapnya berada di **Apps Script**, yang punya riwayat versinya sendiri lewat Deploy → Manage deployments.

Buka lewat: Spreadsheet → **Extensions** → **Apps Script**

## Kontrak dengan website

Website di repositori ini sudah disesuaikan dengan skrip versi 2.0. Jangan ubah salah satu sisi tanpa menyesuaikan sisi lain.

### Pengiriman formulir — `POST`

```json
{ "action": "portal_mentoring", "nonce": "...", "studentName": "...", "email": "..." }
```

| Action | Tab tujuan |
| ------ | ---------- |
| `internship` | Magang |
| `part_time_app` | Part Time |
| `labbook` | Lab Booking |
| `portal_booking` · `portal_mentoring` · `portal_progress` · `portal_procurement` | Pengajuan |

Lampiran CV dikirim sebagai:

```json
"cvFile": { "name": "cv.pdf", "mimeType": "application/pdf", "data": "<base64>" }
```

Balasan:

```json
{ "success": true,  "id": "BIM-ABC12", "message": "Pengajuan tersimpan" }
{ "success": false, "error": "keterangan kegagalan" }
```

⚠️ Kegagalan memakai properti **`error`**, bukan `message`. Ditangani di `src/lib/api.js`.

### Daftar pengajuan — `GET ?action=submissions`

Balasan sudah berbentuk siap tampil (`displayDate`, `statusBadge`, `activityStyle`), sehingga `src/lib/pengajuan.js` tidak mengolah ulang apa pun. Filter opsional: `jenis`, `email`, `status`, `limit`.

### Endpoint lain

| Endpoint | Fungsi |
| -------- | ------ |
| `?action=ping` | Cek skrip hidup |
| `?action=publications` | Daftar publikasi dari tab Publikasi |
| `?action=stats` | Statistik saja |
| `?action=decide&...` | Tombol SETUJUI / TOLAK dari email — jangan dipanggil manual |

## Pemasangan pertama kali

1. Isi bagian **KONFIGURASI** di `Code.gs`
2. **Ganti `SECRET_KEY`** dengan kalimat acak yang panjang — jangan pakai contoh bawaan
3. Jalankan fungsi `setupSpreadsheet()` sekali → semua tab & header dibuat otomatis
4. **Deploy** → Web app → Execute as: **Me** → Who has access: **Anyone**
5. Salin URL `/exec` ke dua tempat: `WEB_APP_URL` di `Code.gs` dan `WEBAPI_URL` di `src/config.js`
6. Deploy ulang (**New version**) agar `WEB_APP_URL` yang baru terpakai

## Fungsi bantu di Apps Script

| Fungsi | Gunanya |
| ------ | ------- |
| `setupSpreadsheet()` | Membuat semua tab & header. Aman dijalankan berulang |
| `testKoneksi()` | Memeriksa Sheet, tab, folder Drive, dan kuota email |
| `cekKategoriPublikasi()` | Memeriksa penulisan kategori di tab Publikasi |
| `pasangDropdownKategori()` | Memasang dropdown kategori di tab Publikasi |

## Kalau ingin tetap menyimpannya di Git

Boleh, asalkan seluruh nilai rahasia dipindahkan ke **Script Properties** lebih dulu:

```javascript
const props = PropertiesService.getScriptProperties();
const SECRET_KEY     = props.getProperty('SECRET_KEY');
const SPREADSHEET_ID = props.getProperty('SPREADSHEET_ID');
```

Baru setelah itu isinya aman ikut ter-commit.
