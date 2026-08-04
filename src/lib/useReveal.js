import { useEffect } from 'react';

/* ================================================================
   HOOK REVEAL ON SCROLL
   ----------------------------------------------------------------
   Elemen ber-class `.reveal` punya `opacity: 0` di CSS, dan baru
   muncul setelah IntersectionObserver menambahkan class `.in`.

   ⚠️ RIWAYAT BUG — jangan ulangi:
   Versi awal memanggil useEffect TANPA dependency array, sehingga
   observer dibuat ulang setiap render. Boros, tapi ada gunanya:
   elemen yang baru muncul ikut teramati.

   Sempat "dioptimalkan" jadi `[]` — dan itu merusak situs. Saat
   pengguna pindah ke halaman lain lalu kembali, komponen landing
   page di-mount ulang dengan elemen DOM yang BARU. Observer lama
   tidak mengenalinya, sehingga seluruh konten tetap `opacity: 0`
   alias hilang sama sekali.

   Solusi sekarang: observer dibuat SEKALI (hemat), lalu
   MutationObserver mendaftarkan elemen `.reveal` yang muncul
   belakangan. Benar sekaligus efisien.
================================================================ */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Daftarkan semua elemen .reveal yang belum tampil
    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    };

    observeAll();

    /* Awasi elemen yang muncul belakangan — misalnya saat pengguna
       kembali dari halaman lain dan section di-mount ulang.
       Dibungkus requestAnimationFrame supaya tidak dijalankan
       berkali-kali dalam satu frame saat DOM banyak berubah. */
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        observeAll();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

export { useReveal };
