import { useEffect, useRef, useState } from 'react';
import { TITIK_KOLABORATOR, TITIK_PENELITIAN } from '../data/peta';

/* ================================================================
   PETA KOLABORATOR & LOKASI PENELITIAN
   ----------------------------------------------------------------
   REVISI PAK TORA 4/8/2026 poin #19 + #22, diperjelas Galuh 5/8/2026:
   satu peta, dua tombol lapisan yang bisa dinyalakan bergantian.

   ── KENAPA LEAFLET DARI CDN, BUKAN npm ──
   GitHub Actions membangun situs dengan `npm ci`, yang menolak jalan
   bila package.json dan package-lock.json tidak cocok persis. Menambah
   dependensi berarti kedua berkas itu harus diperbarui bersama, dan
   sekali meleset seluruh deploy gagal. Leaflet berjalan baik sebagai
   skrip biasa, jadi tidak ada alasan mengambil risiko itu.

   Skripnya dimuat SAAT KOMPONEN INI DIPAKAI, bukan di index.html —
   pengunjung yang tidak pernah membuka halaman Collaborator tidak
   perlu ikut mengunduhnya.

   ── PETA DASAR ──
   Ubin peta dari OpenStreetMap: gratis, tanpa kunci API, tanpa
   penagihan. Google Maps butuh kunci API dan kartu kredit terdaftar.
================================================================ */

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

/** Muat Leaflet sekali saja, sekalipun komponen ini dipasang berkali-kali. */
let janjiLeaflet = null;
function muatLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (janjiLeaflet) return janjiLeaflet;

  janjiLeaflet = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = LEAFLET_CSS;
      document.head.appendChild(css);
    }
    const js = document.createElement('script');
    js.src = LEAFLET_JS;
    js.async = true;
    js.onload = () => resolve(window.L);
    js.onerror = () => reject(new Error('Leaflet gagal dimuat'));
    document.body.appendChild(js);
  });
  return janjiLeaflet;
}

/** Penanda bulat sederhana — tidak memakai berkas gambar,
 *  jadi tidak ada ikon rusak kalau aset Leaflet gagal diunduh. */
function ikonBulat(L, warna, besar) {
  const d = besar ? 22 : 15;
  return L.divIcon({
    className: '',
    iconSize: [d, d],
    iconAnchor: [d / 2, d / 2],
    html: `<span style="
      display:block;width:${d}px;height:${d}px;border-radius:50%;
      background:${warna};border:2.5px solid #fff;
      box-shadow:0 1px 5px rgba(0,0,0,.4)"></span>`
  });
}

const BIRU   = '#0096d7';   // kolaborator
const JINGGA = '#FFAD26';   // lokasi penelitian
const GELAP  = '#041b2e';   // markas Torgas

function CollaborationMap() {
  const wadah = useRef(null);
  const peta = useRef(null);
  const lapisan = useRef({ kolaborator: null, penelitian: null });

  const [tampil, setTampil] = useState('kolaborator'); // 'kolaborator' | 'penelitian'
  const [siap, setSiap] = useState(false);
  const [galat, setGalat] = useState(false);

  /* ── Bangun peta sekali ─────────────────────────────────────── */
  useEffect(() => {
    let batal = false;

    muatLeaflet().then((L) => {
      if (batal || !wadah.current || peta.current) return;

      const p = L.map(wadah.current, {
        scrollWheelZoom: false,   // supaya gulir halaman tidak "tertangkap" peta
        zoomControl: true
      });
      peta.current = p;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
      }).addTo(p);

      const bungkus = (teks) =>
        `<div style="font-family:inherit;min-width:170px">${teks}</div>`;

      lapisan.current.kolaborator = L.layerGroup(
        TITIK_KOLABORATOR.map((t) =>
          L.marker([t.lat, t.lng], { icon: ikonBulat(L, t.komunitas ? JINGGA : BIRU, false) })
            .bindPopup(bungkus(
              `<strong style="color:#041b2e">${t.nama}</strong><br>
               <span style="color:#64748b;font-size:12px">${t.kota}</span>`
            ))
        )
      );

      lapisan.current.penelitian = L.layerGroup(
        TITIK_PENELITIAN.map((t) =>
          L.marker([t.lat, t.lng], { icon: ikonBulat(L, t.markas ? GELAP : JINGGA, !!t.markas) })
            .bindPopup(bungkus(
              `<strong style="color:#041b2e">${t.nama}</strong><br>
               <span style="color:#64748b;font-size:12px">${t.kota}</span><br>
               <span style="color:#0096d7;font-size:12px;font-weight:700">${t.jenis}</span>`
            ))
        )
      );

      setSiap(true);
    }).catch(() => { if (!batal) setGalat(true); });

    return () => {
      batal = true;
      if (peta.current) { peta.current.remove(); peta.current = null; }
    };
  }, []);

  /* ── Ganti lapisan & sesuaikan bingkai tampilan ─────────────── */
  useEffect(() => {
    if (!siap || !peta.current || !window.L) return;
    const L = window.L;
    const p = peta.current;

    Object.values(lapisan.current).forEach((l) => l && p.removeLayer(l));

    const aktif = lapisan.current[tampil];
    if (!aktif) return;
    aktif.addTo(p);

    /* Sebaran kolaborator melintasi tiga benua, lokasi penelitian
       hanya Jawa. Bingkainya dihitung dari titiknya sendiri supaya
       keduanya sama-sama pas — bukan satu zoom tetap yang membuat
       salah satunya terlalu jauh atau terlalu dekat. */
    const titik = tampil === 'kolaborator' ? TITIK_KOLABORATOR : TITIK_PENELITIAN;
    if (titik.length) {
      p.fitBounds(L.latLngBounds(titik.map((t) => [t.lat, t.lng])), {
        padding: [45, 45], maxZoom: tampil === 'penelitian' ? 8 : 5
      });
    }
  }, [tampil, siap]);

  const tombol = (nilai, label, warna) => (
    <button
      onClick={() => setTampil(nilai)}
      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer border-2 ${
        tampil === nilai
          ? 'bg-[#041b2e] text-white border-[#041b2e] shadow-md'
          : 'bg-white text-slate-500 border-slate-200 hover:border-[#0096d7] hover:text-[#041b2e]'
      }`}
    >
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: warna }} />
      {label}
    </button>
  );

  return (
    <div className="mb-20 animate-fadeIn">

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-1 bg-[#0096d7]"></div>
        <h2 className="text-2xl font-extrabold text-[#041b2e] uppercase tracking-wider">Where We Work</h2>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        {tombol('kolaborator', 'Collaborators', BIRU)}
        {tombol('penelitian', 'Research Locations', JINGGA)}
      </div>

      {/* ⚠️ `isolate` WAJIB ADA — jangan dihapus.
          Leaflet menaruh lapisan dalamnya pada z-index 400 (petak peta) dan
          800 (tombol zoom). Angka itu jauh di atas header situs yang z-50,
          dan karena pembungkus peta tidak membentuk stacking context sendiri,
          angka-angka itu ikut bersaing di tingkat halaman — peta jadi
          menimpa header yang seharusnya melayang di atas segalanya.

          `isolate` (isolation: isolate) mengurung seluruh z-index Leaflet di
          dalam kotak ini, sehingga dari luar peta hanya satu lapisan biasa. */}
      <div className="isolate rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative">
        {galat ? (
          <div className="h-[380px] flex items-center justify-center text-center px-6">
            <p className="text-sm font-bold text-slate-500">
              The map could not be loaded.<br />
              <span className="font-semibold text-slate-400">Please check your internet connection.</span>
            </p>
          </div>
        ) : (
          <>
            <div ref={wadah} className="h-[380px] sm:h-[460px] w-full" />
            {!siap && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <p className="text-sm font-bold text-slate-400">Loading map…</p>
              </div>
            )}
          </>
        )}
      </div>

      <p className="text-xs text-slate-400 font-semibold mt-3">
        {tampil === 'kolaborator'
          ? `${TITIK_KOLABORATOR.length} partner institutions across Indonesia, Asia, and the United States.`
          : `${TITIK_PENELITIAN.length} research sites. Dark markers are Torgas' own facilities.`}
      </p>
    </div>
  );
}

export { CollaborationMap };
