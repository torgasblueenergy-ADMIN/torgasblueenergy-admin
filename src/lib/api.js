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

/* 45 detik, bukan 20.
   ----------------------------------------------------------------
   ⚠️ RIWAYAT 12 Agu 2026: pemohon uji lab melihat "The request timed out"
   padahal datanya SUDAH tersimpan dan emailnya SUDAH terkirim.

   Apps Script mengerjakan banyak hal sebelum menjawab: menulis ke Sheet,
   lalu mengirim tiga email — satu ke pemohon, dua ke pengurus. Setiap
   MailApp.sendEmail memakan 1-3 detik, dan skrip yang baru "bangun" jauh
   lebih lambat lagi. Dua puluh detik terlalu mepet.

   Menaikkan batas ini tidak membuat apa pun lebih lambat; ia hanya
   menentukan berapa lama browser mau menunggu sebelum menyerah. */
const TIMEOUT_MS = 45000;

/* ================================================================
   NONCE YANG TAHAN KIRIM ULANG
   ----------------------------------------------------------------
   ⚠️ Versi lama memakai Date.now() + angka acak, sehingga SETIAP
   pemanggilan menghasilkan nonce berbeda. Akibatnya penangkal ganda
   di Apps Script tidak pernah bekerja untuk kasus yang paling penting:
   pengguna melihat pesan gagal, menekan Kirim lagi, dan baris kedua
   masuk ke Sheet — pengajuan yang sama tercatat dua kali.

   Sekarang nonce dihitung dari ISI formulirnya, dipadu jendela waktu
   10 menit. Isi yang sama dikirim ulang dalam 10 menit menghasilkan
   nonce yang sama, dan Apps Script membalas ID yang sudah ada alih-alih
   membuat baris baru. Pengajuan yang memang berbeda tetap dapat nonce
   berbeda karena isinya tidak sama.
================================================================ */
function buatNonce(payload) {
  const inti = JSON.stringify(payload);
  const jendela = Math.floor(Date.now() / (10 * 60 * 1000)); // 10 menit

  // FNV-1a — cukup untuk membedakan isi, bukan untuk keamanan
  let h = 0x811c9dc5;
  const s = inti + '|' + jendela;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return 'n' + (h >>> 0).toString(36) + '-' + jendela.toString(36);
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
  const body = { ...payload, nonce: buatNonce(payload) };

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
      return { ok: false, message: `The server rejected the request (code ${res.status}). Please try again.` };
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Apps Script membalas HTML (biasanya halaman login) — tanda deploy belum "Anyone"
      return {
        ok: false,
        message: 'The server replied in an unexpected format. Please contact the admin — the Apps Script access setting may not be public yet.'
      };
    }

    /* ⚠️ RIWAYAT BUG — jangan dipersempit lagi:
       Versi pertama hanya menerima `{"status":"success"}`. Skrip Apps Script
       yang dipakai Torgas ternyata membalas dengan bentuk lain, sehingga
       pengiriman yang BERHASIL malah ditandai gagal — pengguna melihat
       "❌ Pengajuan tersimpan", pesan yang saling bertentangan.

       Sekarang seluruh bentuk balasan sukses yang lazim diterima. */
    if (isSukses(data)) {
      return { ok: true, message: data.message || 'Your data was sent successfully.', data };
    }
    /* Apps Script Torgas menaruh pesan kegagalan di properti `error`,
       bukan `message`. Kalau hanya `message` yang dibaca, pengguna dapat
       pesan gagal kosong tanpa keterangan apa pun. */
    return {
      ok: false,
      message: data.error || data.message || 'The server could not process your data.'
    };

  } catch (err) {
    if (err.name === 'AbortError') {
      /* Waktu tunggu habis TIDAK sama dengan gagal. Server mungkin masih
         menyelesaikan pekerjaannya, dan data bisa saja sudah tersimpan.
         Pesan lama menyuruh "coba lagi" — itu mendorong pengiriman ganda
         untuk sesuatu yang sebenarnya sudah berhasil. Katakan apa adanya. */
      return {
        ok: false,
        message: 'The server is taking longer than usual. Your request may already have been received — '
               + 'please check your email for a confirmation before submitting again.'
      };
    }
    // Kegagalan CORS juga mendarat di sini
    return {
      ok: false,
      message: 'Could not reach the server. Please check your internet connection, or contact the admin if this keeps happening.'
    };
  } finally {
    clearTimeout(timer);
  }
}
