import { WEBAPI_URL } from '../config';

/* ================================================================
   DAFTAR PENGAJUAN UNTUK TABEL STUDENT PORTAL
   ----------------------------------------------------------------
   ⚠️ RIWAYAT: tabel ini dulu berisi 3 baris CONTOH yang ditulis
   langsung di dalam kode. Pengajuan sungguhan tidak pernah muncul,
   dan statusnya tidak bisa diubah dari mana pun.

   Sekarang membaca dari Apps Script:  ?action=submissions

   Apps Script sudah mengembalikan data dalam bentuk siap pakai —
   lengkap dengan displayDate, statusBadge, dan activityStyle — jadi
   berkas ini tidak perlu mengolah ulang apa pun.

   Status diubah oleh admin lewat tombol SETUJUI / TOLAK di email.
================================================================ */

const TIMEOUT_MS = 15000;

/**
 * Ambil daftar pengajuan beserta statistiknya.
 * @param {object} filter  opsional: { jenis, email, status, limit }
 * @returns {Promise<{ok: boolean, data?: array, stats?: object, message?: string}>}
 */
export async function ambilPengajuan(filter = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const params = new URLSearchParams({ action: 'submissions', ...filter });

  try {
    const res = await fetch(`${WEBAPI_URL}?${params}`, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    });
    if (!res.ok) return { ok: false, message: `The server rejected the request (code ${res.status}).` };

    const teks = await res.text();
    let json;
    try {
      json = JSON.parse(teks);
    } catch {
      // Balasan HTML biasanya tanda deploy Apps Script belum berakses "Anyone"
      return { ok: false, message: 'The server replied in an unexpected format. Please check the Apps Script access setting.' };
    }

    if (json.success !== true) {
      return { ok: false, message: json.error || json.message || 'The server could not load the data.' };
    }

    return {
      ok: true,
      data: urutkanTerbaru(json.data || []),
      stats: json.stats || {}
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, message: 'The request timed out. Please check your internet connection.' };
    }
    return { ok: false, message: 'Could not reach the server. Please check your internet connection.' };
  } finally {
    clearTimeout(timer);
  }
}

/* ================================================================
   URUTAN TABEL — BERDASARKAN WAKTU PENGAJUAN DIKIRIM
   ----------------------------------------------------------------
   ⚠️ KENAPA DIURUTKAN ULANG DI SINI, PADAHAL BACKEND SUDAH MENGURUTKAN

   Apps Script memang mengurutkan (Code.js):

     data.sort(function (a, b) {
       return String(b.submittedAt).localeCompare(String(a.submittedAt));
     });

   Masalahnya `submittedAt` bukan tanggal ISO, melainkan teks penuh
   bentukan JavaScript Date, misalnya:

     "Wed Sep 16 2026 18:43:59 GMT+0700 (Waktu Indonesia Barat)"

   Membandingkannya sebagai TEKS berarti yang diadu lebih dulu adalah
   tiga huruf pertama — yaitu NAMA HARI. Hasilnya tabel terurut
   Wed → Tue → Thu → Sun → Sat → Mon → Fri, bukan menurut waktu sama
   sekali. Diperiksa langsung pada data sungguhan, 21 Sep 2026:
   25 baris, dan ketujuh kelompok hari itu muncul persis berurutan.

   Perbaikan yang benar ada di backend, tetapi penerbitan Apps Script
   sedang ditahan sampai izin WhatsApp disetujui. Karena itu urutannya
   diperbaiki di sini — dan pengurutan ini tetap aman dipertahankan
   setelah backend diperbaiki, karena hasilnya sama.

   ⚠️ Jangan menghapusnya dengan alasan "backend sudah mengurutkan".
   Backend memang mengurutkan; yang salah adalah caranya.
================================================================ */

/* Beberapa bentuk waktu yang mungkin datang dari Sheet, diterima semua:
     "Wed Sep 16 2026 18:43:59 GMT+0700 (...)"   ← bentuk sekarang
     "9/16/2026 18:43:59"                        ← bentuk lama Sheet (bulan/hari)
     "2026-09-16T18:43:59"                       ← bila backend kelak dibetulkan
   Yang tidak terbaca diberi nilai terkecil, sehingga jatuh ke bawah
   tabel — bukan dibuang, dan tidak mengacaukan urutan yang lain. */
function waktuKirim(nilai) {
  const s = String(nilai || '').trim();
  if (!s) return -Infinity;

  const langsung = Date.parse(s);
  if (!Number.isNaN(langsung)) return langsung;

  // Cadangan: M/D/YYYY H:MM(:SS)
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) {
    const [, bl, tg, th, jj, mm, dd] = m;
    return new Date(+th, +bl - 1, +tg, +jj, +mm, +(dd || 0)).getTime();
  }
  return -Infinity;
}

function urutkanTerbaru(data) {
  return [...data].sort((a, b) => waktuKirim(b.submittedAt) - waktuKirim(a.submittedAt));
}
