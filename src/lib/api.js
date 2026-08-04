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

/** Penanda unik per pengiriman, agar server bisa menolak kiriman ganda. */
function buatNonce() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/* Kata yang menandakan keberhasilan, dari berbagai gaya penulisan skrip. */
const KATA_SUKSES = ['success', 'sukses', 'ok', 'berhasil', 'true', 'saved', 'tersimpan'];

/**
 * Deteksi keberhasilan dari berbagai bentuk balasan Apps Script.
 * Ditulis longgar dengan sengaja — beda orang menulis balasannya beda-beda:
 *   {"status":"success"}   {"result":"ok"}      {"ok":true}
 *   {"success":true}       {"status":"sukses"}  {"message":"Data tersimpan"}
 */
function isSukses(d) {
  if (!d || typeof d !== 'object') return false;

  // Bentuk boolean
  if (d.ok === true || d.success === true || d.berhasil === true) return true;

  // Bentuk teks pada properti status yang umum dipakai
  const kandidat = [d.status, d.result, d.state, d.hasil, d.success, d.ok]
    .filter((v) => typeof v === 'string')
    .map((v) => v.toLowerCase());
  if (kandidat.some((v) => KATA_SUKSES.includes(v))) return true;

  // Ada tanda kegagalan yang jelas → jangan dianggap sukses
  const gagal = ['error', 'gagal', 'fail', 'failed', 'false'];
  if (kandidat.some((v) => gagal.includes(v))) return false;

  /* Tidak ada properti status sama sekali, tapi ada pesan yang berbunyi
     positif — misalnya {"message":"Pengajuan tersimpan"}. Diperlakukan
     sebagai sukses supaya pengguna tidak melihat pesan bertentangan. */
  if (typeof d.message === 'string') {
    const m = d.message.toLowerCase();
    if (['tersimpan', 'berhasil', 'success', 'saved', 'terkirim'].some((k) => m.includes(k))) return true;
  }
  return false;
}

/**
 * Kirim satu payload form ke Apps Script.
 * @param {object} payload  Data form, wajib memuat properti `action`.
 * @returns {Promise<{ok: boolean, message: string, data?: object}>}
 */
export async function submitForm(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  /* `nonce` dipakai Apps Script untuk menolak kiriman ganda. Kalau browser
     mengirim ulang permintaan yang sama (mis. karena jaringan tersendat),
     server membalas ID yang sudah ada alih-alih membuat baris kedua. */
  const body = { ...payload, nonce: buatNonce() };

  try {
    const res = await fetch(WEBAPI_URL, {
      method: 'POST',
      // text/plain menghindari preflight OPTIONS yang tidak bisa dijawab Apps Script
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
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

    /* ⚠️ RIWAYAT BUG — jangan dipersempit lagi:
       Versi pertama hanya menerima `{"status":"success"}`. Skrip Apps Script
       yang dipakai Torgas ternyata membalas dengan bentuk lain, sehingga
       pengiriman yang BERHASIL malah ditandai gagal — pengguna melihat
       "❌ Pengajuan tersimpan", pesan yang saling bertentangan.

       Sekarang seluruh bentuk balasan sukses yang lazim diterima. */
    if (isSukses(data)) {
      return { ok: true, message: data.message || 'Data berhasil dikirim.', data };
    }
    /* Apps Script Torgas menaruh pesan kegagalan di properti `error`,
       bukan `message`. Kalau hanya `message` yang dibaca, pengguna dapat
       pesan gagal kosong tanpa keterangan apa pun. */
    return {
      ok: false,
      message: data.error || data.message || 'Server tidak dapat memproses data Anda.'
    };

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
