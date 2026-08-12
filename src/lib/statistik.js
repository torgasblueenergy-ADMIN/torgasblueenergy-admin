import { UMAMI_SHARE_ID } from '../config';

/* ================================================================
   STATISTIK PENGUNJUNG DARI UMAMI
   ----------------------------------------------------------------
   Alurnya dua langkah, sesuai cara Umami menyajikan dasbor publiknya:

     1. GET /api/share/{shareId}
          → { token, websiteId }
     2. GET /api/websites/{websiteId}/stats?startAt=..&endAt=..
          dengan header  x-umami-share-token: {token}
          → { pageviews:{value}, visitors:{value}, ... }

   ⚠️ KENAPA TIDAK MEMAKAI API KEY:
   API key Umami memberi akses PENUH ke seluruh akun — termasuk mengubah
   dan menghapus. Menaruhnya di kode situs sama saja menyerahkannya ke
   siapa pun yang membuka Developer Tools. Kode berbagi (shareId) hanya
   memberi akses BACA ke satu situs, dan memang dirancang untuk terbuka.

   ⚠️ Endpoint share ini bagian dari cara kerja halaman berbagi Umami,
   bukan API resmi yang dijanjikan stabil. Kalau suatu saat Umami
   mengubahnya, angka berhenti muncul — dan bagian statistiknya
   menyembunyikan diri, bukan menampilkan galat ke pengunjung.
================================================================ */

const ASAL = 'https://cloud.umami.is';
const TIMEOUT_MS = 12000;

/* Simpan sebentar di sessionStorage supaya berpindah halaman tidak
   memanggil Umami lima kali lagi. Sepuluh menit sudah cukup — ini
   angka pajangan, bukan pemantauan waktu nyata. */
const KUNCI_SIMPAN = 'torgas_statistik_v1';
const UMUR_SIMPAN_MS = 10 * 60 * 1000;

async function ambilJson(url, opsi) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opsi, signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* Umami pernah membalas angka dalam dua bentuk: { visitors: 12 } pada
   versi lama, dan { visitors: { value: 12 } } pada versi sekarang.
   Keduanya diterima supaya pembaruan di sisi Umami tidak mematikan
   bagian ini tanpa peringatan. */
function angka(bidang) {
  if (typeof bidang === 'number') return bidang;
  if (bidang && typeof bidang.value === 'number') return bidang.value;
  return null;
}

function awalHariIni() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function bacaSimpanan() {
  try {
    const mentah = sessionStorage.getItem(KUNCI_SIMPAN);
    if (!mentah) return null;
    const { waktu, data } = JSON.parse(mentah);
    if (Date.now() - waktu > UMUR_SIMPAN_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function tulisSimpanan(data) {
  try {
    sessionStorage.setItem(KUNCI_SIMPAN, JSON.stringify({ waktu: Date.now(), data }));
  } catch {
    /* Mode penyamaran atau penyimpanan penuh — abaikan, bukan galat. */
  }
}

/**
 * Ambil jumlah pengunjung: hari ini, 7 hari, 30 hari, dan sejak awal.
 * @returns {Promise<{siap: boolean, data?: {harian:number, mingguan:number, bulanan:number, total:number}}>}
 *          `siap: false` berarti bagian statistik sebaiknya tidak ditampilkan.
 */
export async function ambilStatistik() {
  if (!UMAMI_SHARE_ID) return { siap: false, alasan: 'belum-diatur' };

  const tersimpan = bacaSimpanan();
  if (tersimpan) return { siap: true, data: tersimpan };

  const berbagi = await ambilJson(`${ASAL}/api/share/${UMAMI_SHARE_ID}`);
  const token = berbagi && berbagi.token;
  const websiteId = berbagi && (berbagi.websiteId || berbagi.id);
  if (!token || !websiteId) return { siap: false, alasan: 'kode-berbagi-ditolak' };

  const sekarang = Date.now();
  const HARI = 24 * 60 * 60 * 1000;

  /* startAt 0 berarti "sejak kapan pun". Kalau Umami menolaknya, dicoba
     ulang dengan rentang lima tahun — cukup panjang untuk situs ini. */
  const jendela = {
    harian:   [awalHariIni(), sekarang],
    mingguan: [sekarang - 7 * HARI, sekarang],
    bulanan:  [sekarang - 30 * HARI, sekarang],
    total:    [0, sekarang],
  };

  const opsi = { headers: { 'x-umami-share-token': token } };

  async function statistik(mulai, akhir) {
    const url = `${ASAL}/api/websites/${websiteId}/stats?startAt=${mulai}&endAt=${akhir}`;
    const j = await ambilJson(url, opsi);
    if (!j) return null;
    // Yang ditampilkan adalah PENGUNJUNG unik, bukan jumlah halaman dibuka
    return angka(j.visitors) ?? angka(j.pageviews);
  }

  const kunci = Object.keys(jendela);
  const hasil = await Promise.all(kunci.map((k) => statistik(jendela[k][0], jendela[k][1])));

  const data = {};
  kunci.forEach((k, i) => { data[k] = hasil[i]; });

  if (data.total === null) {
    const LIMA_TAHUN = 5 * 365 * HARI;
    data.total = await statistik(sekarang - LIMA_TAHUN, sekarang);
  }

  /* Kalau satu pun angka tidak terbaca, seluruh bagian disembunyikan.
     Menampilkan sebagian — misalnya "hari ini 12, total —" — terlihat
     seperti situs yang rusak, dan itu lebih buruk daripada tidak ada. */
  if (kunci.some((k) => typeof data[k] !== 'number')) {
    return { siap: false, alasan: 'angka-tidak-lengkap' };
  }

  tulisSimpanan(data);
  return { siap: true, data };
}
