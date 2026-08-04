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
    if (!res.ok) return { ok: false, message: `Server menolak permintaan (kode ${res.status}).` };

    const teks = await res.text();
    let json;
    try {
      json = JSON.parse(teks);
    } catch {
      // Balasan HTML biasanya tanda deploy Apps Script belum berakses "Anyone"
      return { ok: false, message: 'Server membalas format tak terduga. Periksa pengaturan akses Apps Script.' };
    }

    if (json.success !== true) {
      return { ok: false, message: json.error || json.message || 'Server tidak dapat memuat data.' };
    }

    return {
      ok: true,
      data: json.data || [],
      stats: json.stats || {}
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, message: 'Waktu tunggu habis. Periksa koneksi internet Anda.' };
    }
    return { ok: false, message: 'Gagal menghubungi server. Periksa koneksi internet Anda.' };
  } finally {
    clearTimeout(timer);
  }
}
