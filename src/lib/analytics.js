/* ================================================================
   ANALYTICS TANPA COOKIE
   ----------------------------------------------------------------
   Revisi Pak Tora 4/8/2026 — poin #16: "visitor website".

   ⚠️ BATAS YANG PERLU DIPAHAMI
   Analytics ini menghitung BERAPA BANYAK dan DARI MANA pengunjung
   datang — BUKAN SIAPA orangnya. Tidak ada nama, email, atau
   identitas perorangan. Yang bisa dilihat:

       • jumlah pengunjung & kunjungan per hari/minggu/bulan
       • halaman mana yang paling sering dibuka
       • negara/kota asal (perkiraan, dari alamat IP)
       • perangkat & browser yang dipakai
       • sumber rujukan (Google, Instagram, WhatsApp, dsb.)

   Mengetahui identitas pengunjung satu per satu HANYA mungkin bila
   mereka login. Melacak orang tanpa persetujuan melanggar UU No. 27
   Tahun 2022 tentang Pelindungan Data Pribadi, dan bertentangan
   dengan Kebijakan Privasi situs ini.

   ----------------------------------------------------------------
   MENGAPA TANPA COOKIE
   Umami dan Plausible tidak menyimpan cookie dan tidak melacak orang
   antar situs, sehingga Kebijakan Privasi kita tetap berlaku apa
   adanya dan tidak perlu banner cookie.

   PENGATURAN — lihat berkas .env.example
================================================================ */

const CONFIG = {
  provider: import.meta.env.VITE_ANALYTICS_PROVIDER || 'none',
  umamiWebsiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID || '',
  umamiSrc: import.meta.env.VITE_UMAMI_SRC || 'https://cloud.umami.is/script.js',
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || '',
  plausibleSrc: import.meta.env.VITE_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'
};

function injectScript(attrs) {
  const s = document.createElement('script');
  s.defer = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

export function initAnalytics() {
  // Jangan hitung kunjungan saat pengembangan — statistik harus bersih
  if (import.meta.env.DEV) return;

  // Hormati pengguna yang mengaktifkan "Do Not Track" di browsernya
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  switch (CONFIG.provider) {
    case 'umami':
      if (!CONFIG.umamiWebsiteId) {
        console.warn('[analytics] VITE_UMAMI_WEBSITE_ID belum diisi — analytics tidak aktif.');
        return;
      }
      injectScript({ src: CONFIG.umamiSrc, 'data-website-id': CONFIG.umamiWebsiteId });
      break;

    case 'plausible':
      if (!CONFIG.plausibleDomain) {
        console.warn('[analytics] VITE_PLAUSIBLE_DOMAIN belum diisi — analytics tidak aktif.');
        return;
      }
      injectScript({ src: CONFIG.plausibleSrc, 'data-domain': CONFIG.plausibleDomain });
      break;

    case 'none':
    default:
      break; // sengaja tidak melakukan apa-apa
  }
}

/**
 * Catat kejadian khusus, misalnya saat ada yang mengirim form magang.
 * Aman dipanggil walau analytics belum diaktifkan — tidak akan error.
 *
 * Contoh: trackEvent('daftar-magang')
 */
export function trackEvent(name, data = {}) {
  try {
    if (window.umami?.track) window.umami.track(name, data);
    else if (window.plausible) window.plausible(name, { props: data });
  } catch {
    // Statistik tidak boleh sampai merusak jalannya situs
  }
}
