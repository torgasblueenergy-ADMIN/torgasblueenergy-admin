import { WEBAPI_URL } from '../config';

/* ================================================================
   MENGAMBIL DAFTAR PENGAJUAN DARI GOOGLE SHEET
   ----------------------------------------------------------------
   ⚠️ RIWAYAT: tabel di Student Portal dulu berisi 3 baris CONTOH yang
   ditulis langsung di dalam kode. Pengajuan sungguhan yang dikirim
   mahasiswa tidak pernah muncul, dan statusnya tidak bisa diubah
   dari mana pun. Sekarang tabel membaca langsung dari Spreadsheet.

   Status diubah oleh Pak Tora / Kepala Lab lewat tombol di email —
   lihat apps-script/Code.gs.
================================================================ */

/** Mengubah nama tab Sheet menjadi label kegiatan di tabel. */
const LABEL_KEGIATAN = {
  'Pengajuan':          'RAB & Biaya',
  'Portal - Booking':   'Booking',
  'Portal - Progres':   'Progress',
  'Portal - Mentoring': 'Bimbingan'
};

/** Warna label kegiatan, disamakan dengan tampilan sebelumnya. */
const GAYA_KEGIATAN = {
  'Bimbingan':   'text-[#0096d7] bg-[#0096d7]/10',
  'Progress':    'text-emerald-600 bg-emerald-50',
  'RAB & Biaya': 'text-slate-600 bg-slate-100',
  'Booking':     'text-[#d97706] bg-[#FFAD26]/15'
};

const GAYA_STATUS = {
  APPROVED: 'badge-green',
  PENDING:  'badge-orange',
  REJECTED: 'badge-red'
};

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatTanggal(iso) {
  if (!iso) return { rawDate: '', displayDate: '—', time: '—' };
  const d = new Date(iso);
  if (isNaN(d)) return { rawDate: '', displayDate: String(iso), time: '—' };
  const pad = (n) => String(n).padStart(2, '0');
  return {
    rawDate: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    displayDate: `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())} WIB`
  };
}

/**
 * Ambil seluruh pengajuan dari Apps Script.
 * @returns {Promise<{ok: boolean, data?: array, message?: string}>}
 */
export async function ambilPengajuan() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${WEBAPI_URL}?list=1`, {
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
      // Apps Script membalas HTML — biasanya tanda deploy belum "Anyone"
      return { ok: false, message: 'Server membalas format tak terduga. Periksa pengaturan akses Apps Script.' };
    }
    if (json.status !== 'success') {
      return { ok: false, message: json.message || 'Server tidak dapat memuat data.' };
    }

    const data = (json.data || []).map((r) => {
      const kegiatan = LABEL_KEGIATAN[r.sheet] || r.sheet || '—';
      const status = String(r.status || 'PENDING').toUpperCase();
      const { rawDate, displayDate, time } = formatTanggal(r.Waktu);
      return {
        id: r.id || '—',
        rawDate,
        displayDate,
        // Booking punya jam sendiri; jenis lain cukup tanggalnya
        time: kegiatan === 'Booking' ? time : '—',
        name: r.fullName || r.nama || r.name || '—',
        activity: kegiatan,
        details: r.details || r.keperluan || r.topik || r.catatan || '—',
        status,
        statusBadge: GAYA_STATUS[status] || 'badge-orange',
        activityStyle: GAYA_KEGIATAN[kegiatan] || 'text-slate-600 bg-slate-100'
      };
    });

    return { ok: true, data };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, message: 'Waktu tunggu habis. Periksa koneksi internet Anda.' };
    }
    return { ok: false, message: 'Gagal menghubungi server. Periksa koneksi internet Anda.' };
  } finally {
    clearTimeout(timer);
  }
}
