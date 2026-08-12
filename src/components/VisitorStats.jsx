import { useState, useEffect, useRef } from 'react';
import { ambilStatistik } from '../lib/statistik';
import { STATISTIK_AMBANG_MINIMUM } from '../config';

/* ================================================================
   STATISTIK PENGUNJUNG — KARTU DI FOOTER
   ----------------------------------------------------------------
   Ditampilkan HANYA bila:
     1. UMAMI_SHARE_ID di src/config.js sudah diisi, DAN
     2. seluruh angkanya terbaca, DAN
     3. totalnya melewati STATISTIK_AMBANG_MINIMUM.

   Selain itu bagian ini tidak merender apa pun — bukan menampilkan
   nol, garis strip, atau pesan galat. Angka pengunjung yang kosong
   atau sangat kecil di situs resmi lebih merugikan daripada tidak
   ada sama sekali.
================================================================ */

/* Angka naik dari nol saat pertama terlihat. Bukan sekadar hiasan:
   pergerakannya menarik mata ke bagian yang mudah terlewat di footer.
   Menghormati "kurangi gerakan" di pengaturan sistem — sebagian orang
   pusing atau mual melihat animasi. */
function useAngkaNaik(target, jalan) {
  const [nilai, setNilai] = useState(0);
  const rafRef = useRef(0);
  const jagaRef = useRef(0);

  useEffect(() => {
    if (!jalan) return;

    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (kurangiGerak) { setNilai(target); return; }

    const DURASI = 1100;
    const mulai = performance.now();

    const langkah = (waktu) => {
      const t = Math.min((waktu - mulai) / DURASI, 1);
      const halus = 1 - Math.pow(1 - t, 3); // melambat di ujung
      setNilai(Math.round(target * halus));
      if (t < 1) rafRef.current = requestAnimationFrame(langkah);
    };

    rafRef.current = requestAnimationFrame(langkah);

    /* ⚠️ PENGAMAN — JANGAN DIHAPUS (dipasang 13 Agu 2026 setelah diuji)
       requestAnimationFrame BERHENTI TOTAL di tab yang tidak terlihat.
       Tanpa pengaman ini, situs yang dibuka di tab latar belakang
       memajang angka 0 pada keempat kartunya — bukan sekadar animasi
       yang tidak jalan, melainkan ANGKA YANG SALAH. Terbukti terjadi
       saat pengujian: data sudah benar (1/17/17/17) tetapi yang
       tertulis di layar 0/0/0/0.

       setTimeout ikut diperlambat di tab latar belakang, tetapi tetap
       DIJALANKAN — jadi angkanya selalu mendarat di nilai yang benar,
       cepat atau lambat. */
    jagaRef.current = setTimeout(() => setNilai(target), DURASI + 400);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(jagaRef.current);
    };
  }, [target, jalan]);

  return nilai;
}

const IKON = {
  harian: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  mingguan: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  ),
  bulanan: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  ),
  total: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  ),
};

function KartuAngka({ jenis, label, nilai, jalan, sorot }) {
  const tampil = useAngkaNaik(nilai, jalan);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-4 py-3.5 transition-colors duration-300 ${
        sorot
          ? 'bg-[#0096d7]/12 border-[#0096d7]/40 hover:border-[#0096d7]/70'
          : 'bg-white/[0.04] border-white/10 hover:border-white/25'
      }`}
    >
      {/* Kilau lembut di sudut — memberi kesan modern tanpa mengalihkan perhatian */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl ${
          sorot ? 'bg-[#0096d7]/40' : 'bg-white/10'
        }`}
      />

      <div className="relative flex items-center gap-2 mb-2">
        <svg
          className={`h-3.5 w-3.5 flex-shrink-0 ${sorot ? 'text-[#0096d7]' : 'text-slate-500'}`}
          fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"
        >
          {IKON[jenis]}
        </svg>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>

      <div className={`relative text-2xl font-extrabold tabular-nums leading-none ${
        sorot ? 'text-white' : 'text-slate-200'
      }`}>
        {tampil.toLocaleString('en-US')}
      </div>
    </div>
  );
}

function VisitorStats() {
  const [data, setData] = useState(null);
  const [terlihat, setTerlihat] = useState(false);
  const wadahRef = useRef(null);

  useEffect(() => {
    let dibatalkan = false;
    ambilStatistik().then((hasil) => {
      if (dibatalkan) return;
      if (hasil.siap) setData(hasil.data);
    });
    return () => { dibatalkan = true; };
  }, []);

  /* Animasi angka baru dimulai ketika bagian ini benar-benar masuk layar.
     Kalau dijalankan saat pemuatan, di footer ia sudah selesai jauh
     sebelum pengunjung menggulir ke bawah — geraknya tidak pernah
     terlihat, dan hanya membuang tenaga. */
  useEffect(() => {
    const el = wadahRef.current;
    if (!el || !data) return;

    if (!('IntersectionObserver' in window)) { setTerlihat(true); return; }

    const pengamat = new IntersectionObserver(
      (entri) => {
        if (entri[0].isIntersecting) { setTerlihat(true); pengamat.disconnect(); }
      },
      { threshold: 0.25 }
    );
    pengamat.observe(el);
    return () => pengamat.disconnect();
  }, [data]);

  if (!data) return null;
  if (data.total < STATISTIK_AMBANG_MINIMUM) return null;

  return (
    <div ref={wadahRef} className="pt-2">
      <div className="flex items-center gap-2.5 mb-3.5">
        {/* Titik berdenyut — penanda bahwa angkanya hidup, bukan tulisan tetap */}
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0096d7] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0096d7]" />
        </span>
        <h4 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
          Website Visitors
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-w-md">
        <KartuAngka jenis="harian"   label="Today"      nilai={data.harian}   jalan={terlihat} />
        <KartuAngka jenis="mingguan" label="This Week"  nilai={data.mingguan} jalan={terlihat} />
        <KartuAngka jenis="bulanan"  label="This Month" nilai={data.bulanan}  jalan={terlihat} />
        <KartuAngka jenis="total"    label="All Time"   nilai={data.total}    jalan={terlihat} sorot />
      </div>

      <p className="mt-2.5 text-[10px] text-slate-500">
        Unique visitors, measured privately without cookies.
      </p>
    </div>
  );
}

export { VisitorStats };
