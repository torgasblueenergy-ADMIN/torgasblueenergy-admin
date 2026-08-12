import { WEBAPI_URL } from '../config';

/* ================================================================
   PUBLIKASI & BERITA DARI SPREADSHEET
   ----------------------------------------------------------------
   GET ?action=publications

   Balasan yang diharapkan:

     { "success": true,
       "data": [ { "id": "NEW-01",
                   "title": "...",
                   "category": "news" | "artikel-ilmiah",
                   "categoryLabel": "News" | "Scientific Articles",
                   "date": "8 Januari 2026",
                   "sortKey": "2026-01-08",
                   "author": "...",
                   "summary": "...",
                   "content": "...",
                   "image": "https://lh3.googleusercontent.com/d/..." } ],
       "total": 1 }

   ⚠️ RIWAYAT 12 Agu 2026 — kenapa berkas ini ada:
   Backend `getPublications` sudah bekerja sejak lama dan sudah membalas
   dengan benar. Yang tidak pernah ada adalah PEMANGGILNYA. NewsSection
   memuat data langsung dari src/data/articles.js, sehingga baris apa pun
   yang ditambahkan pengurus ke tab "Publikasi" tidak pernah sampai ke
   situs. Dari sisi pengurus ini terlihat seperti salah mengisi Sheet,
   padahal isian mereka sudah benar sejak awal.

   Kegagalan di sini TIDAK dianggap galat. Kalau Spreadsheet tak terbaca,
   situs tetap menampilkan isi bawaan dari src/data/articles.js — bagian
   Publications & News tidak boleh sampai kosong hanya karena jaringan
   sedang bermasalah.
================================================================ */

const TIMEOUT_MS = 15000;

const BULAN_INGGRIS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/* Backend membalas tanggal dalam bahasa Indonesia ("8 Januari 2026"),
   sedangkan situs seluruhnya berbahasa Inggris sejak 5 Agu 2026. Kalau
   dibiarkan, satu kartu berbahasa Indonesia berdiri di antara kartu-kartu
   berbahasa Inggris.

   Diterjemahkan di sini, bukan di backend, supaya perbaikan ini bisa
   terbit tanpa menunggu penerbitan Apps Script — yang saat ini sedang
   ditahan sampai izin WhatsApp disetujui. */
function tanggalInggris(sortKey, tanggalAsli) {
  if (typeof sortKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sortKey)) {
    const [th, bl, tg] = sortKey.split('-').map(Number);
    if (bl >= 1 && bl <= 12) {
      return `${tg} ${BULAN_INGGRIS[bl - 1]} ${th}`;
    }
  }
  return tanggalAsli || '';
}

/* Judul dipakai sebagai penangkal ganda, jadi perbedaan huruf besar-kecil,
   spasi ganda, dan tanda baca di ujung tidak boleh membuat satu berita
   yang sama terhitung dua kali. */
function kunciJudul(judul) {
  return String(judul || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Ambil publikasi dari Spreadsheet.
 * @returns {Promise<{siap: boolean, data: array, alasan?: string}>}
 *          `siap: false` berarti Spreadsheet belum terbaca — bukan galat fatal.
 */
export async function ambilPublikasi() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${WEBAPI_URL}?action=publications`, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    });
    if (!res.ok) return { siap: false, data: [], alasan: 'server-menolak' };

    const teks = await res.text();
    let json;
    try {
      json = JSON.parse(teks);
    } catch {
      // Biasanya halaman login Google — tanda akses deploy belum "Anyone"
      return { siap: false, data: [], alasan: 'bukan-json' };
    }

    if (json.success !== true || !Array.isArray(json.data)) {
      return { siap: false, data: [], alasan: 'endpoint-belum-ada' };
    }

    const data = json.data
      .filter((r) => r && String(r.title || '').trim())
      .map((r) => ({
        ...r,
        date: tanggalInggris(r.sortKey, r.date)
      }));

    return { siap: true, data };
  } catch {
    return { siap: false, data: [], alasan: 'tidak-terhubung' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Gabungkan isi Spreadsheet dengan isi bawaan dari src/data/articles.js.
 *
 * Spreadsheet didahulukan. Entri bawaan yang ID atau judulnya sama
 * dibuang, sehingga memindahkan satu berita dari kode ke Spreadsheet
 * tidak pernah memunculkan kartu kembar.
 *
 * Entri bawaan yang belum ada di Spreadsheet tetap ditampilkan — kalau
 * tidak, menambahkan satu baris ke Sheet akan langsung melenyapkan
 * empat publikasi yang selama ini sudah tayang.
 */
export function gabungPublikasi(dariSheet, bawaan) {
  const idTerpakai = new Set(dariSheet.map((r) => String(r.id || '')));
  const judulTerpakai = new Set(dariSheet.map((r) => kunciJudul(r.title)));

  const sisaBawaan = bawaan.filter(
    (r) => !idTerpakai.has(String(r.id || '')) && !judulTerpakai.has(kunciJudul(r.title))
  );

  return [...dariSheet, ...sisaBawaan];
}
