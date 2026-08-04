import { WEBAPI_URL } from '../config';

/* ================================================================
   PENGIRIMAN FORM — TERPUSAT
   ----------------------------------------------------------------
   MASALAH VERSI LAMA:
     Seluruh form memakai `fetch(..., { mode: 'no-cors' })`. Mode itu
     membuat respons menjadi *opaque* — status, header, dan isi body
     tidak bisa dibaca sama sekali. Akibatnya `.then()` SELALU jalan,
     bahkan ketika server menolak data. Pengguna melihat pesan
     "berhasil dikirim" padahal datanya tidak pernah masuk.

   PERBAIKANNYA:
     1. `mode: 'no-cors'` dihapus, sehingga respons benar-benar terbaca.
     2. Content-Type memakai `text/plain` — ini membuat permintaan
        tergolong "simple request" sehingga browser TIDAK mengirim
        preflight OPTIONS. Google Apps Script tidak bisa menjawab
        preflight, jadi langkah ini penting. Apps Script tetap membaca
        JSON-nya lewat `e.postData.contents`.
     3. Ada batas waktu, supaya form tidak menggantung selamanya.

   ⚠️ Agar ini berfungsi, Apps Script HARUS mengembalikan JSON dan
      di-deploy dengan akses "Anyone". Lihat apps-script/Code.gs.
================================================================ */

const TIMEOUT_MS = 20000;

/**
 * Kirim satu payload form ke Apps Script.
 * @param {object} payload  Data form, wajib memuat properti `action`.
 * @returns {Promise<{ok: boolean, message: string, data?: object}>}
 */
export async function submitForm(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(WEBAPI_URL, {
      method: 'POST',
      // text/plain menghindari preflight OPTIONS yang tidak bisa dijawab Apps Script
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal
    });

    if (!res.ok) {
      return { ok: false, message: `Server menolak permintaan (kode ${res.status}). Silakan coba lagi.` };
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Apps Script membalas HTML (biasanya halaman login) — tanda deploy belum "Anyone"
      return {
        ok: false,
        message: 'Server membalas dalam format tak terduga. Hubungi admin — kemungkinan pengaturan akses Apps Script belum publik.'
      };
    }

    if (data.status === 'success' || data.ok === true) {
      return { ok: true, message: data.message || 'Data berhasil dikirim.', data };
    }
    return { ok: false, message: data.message || 'Server tidak dapat memproses data Anda.' };

  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, message: 'Waktu tunggu habis. Periksa koneksi internet Anda, lalu coba lagi.' };
    }
    // Kegagalan CORS juga mendarat di sini
    return {
      ok: false,
      message: 'Gagal menghubungi server. Periksa koneksi internet Anda, atau hubungi admin bila terus berulang.'
    };
  } finally {
    clearTimeout(timer);
  }
}
