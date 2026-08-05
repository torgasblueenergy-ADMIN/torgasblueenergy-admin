import { WEBAPI_URL } from '../config';

/* ================================================================
   JADWAL KETERSEDIAAN PEMBIMBING
   ----------------------------------------------------------------
   Dibaca dari Google Calendar lewat Apps Script:

     GET ?action=availability&from=YYYY-MM-DD&to=YYYY-MM-DD

   Balasan yang diharapkan:

     { "success": true,
       "data": [ { "date": "2026-08-10",
                   "start": "13:00",
                   "end":   "16:00",
                   "note":  "Ruang Lab 2" } ] }

   ⚠️ Endpoint ini BELUM ADA di backend saat berkas ini ditulis
   (5 Agu 2026). Karena itu kegagalan di sini TIDAK dianggap galat:
   kalender tetap tampil dan tetap berguna menampilkan kegiatan yang
   sudah terjadwal — hanya bagian "slot tersedia" yang kosong, dengan
   keterangan bahwa jadwalnya belum disiapkan.

   Alasannya: kalau kegagalan diperlakukan sebagai galat, satu endpoint
   yang belum ada akan membuat seluruh kalender menolak tampil.
================================================================ */

const TIMEOUT_MS = 15000;

/**
 * @param {string} from  tanggal awal, format YYYY-MM-DD
 * @param {string} to    tanggal akhir, format YYYY-MM-DD
 * @returns {Promise<{siap: boolean, data: array, alasan?: string}>}
 *          `siap: false` berarti jadwal belum bisa dibaca — bukan galat fatal.
 */
export async function ambilKetersediaan(from, to) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const params = new URLSearchParams({ action: 'availability', from, to });

  try {
    const res = await fetch(`${WEBAPI_URL}?${params}`, {
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
      return { siap: false, data: [], alasan: 'bukan-json' };
    }

    // Backend lama membalas { success: false, error: 'Unknown action' }
    if (json.success !== true || !Array.isArray(json.data)) {
      return { siap: false, data: [], alasan: 'endpoint-belum-ada' };
    }

    return { siap: true, data: json.data };
  } catch {
    return { siap: false, data: [], alasan: 'tidak-terhubung' };
  } finally {
    clearTimeout(timer);
  }
}
