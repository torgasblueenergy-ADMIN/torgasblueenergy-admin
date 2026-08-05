import { toWebp } from '../../lib/images';
import { useEffect, useState } from 'react';
import { HERO_VIDEO, HERO_VIDEO_POSTER } from '../../config';

/* ================================================================
   KOMPONEN 2: HERO SECTION
   ----------------------------------------------------------------
   Latar belakangnya bisa video ATAU empat foto bergantian, tergantung
   HERO_VIDEO di src/config.js. Kalau kosong, foto yang dipakai —
   jadi tidak ada kotak hitam atau ikon rusak saat videonya belum ada.

   REVISI PAK TORA 4/8/2026 poin #20: "video depan autoplay".
================================================================ */

/** Sebagian pengunjung sebaiknya TIDAK menerima video sama sekali:
 *
 *  • prefers-reduced-motion — pengaturan sistem yang dinyalakan orang
 *    dengan gangguan vestibular; gerakan besar bisa memicu pusing dan
 *    mual. Ini pengaturan aksesibilitas, bukan preferensi gaya.
 *
 *  • Save-Data — pengunjung yang memberi tahu browsernya bahwa kuotanya
 *    terbatas. Mengirimi mereka video belasan megabita untuk hiasan
 *    latar adalah hal yang tidak sopan.
 *
 *  Keduanya tetap melihat foto — tidak ada yang hilang selain geraknya. */
function bolehPutarVideo() {
  if (typeof window === 'undefined') return false;         // aman saat SSR
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (navigator.connection && navigator.connection.saveData) return false;
  } catch { /* browser lama: anggap boleh */ }
  return true;
}

function Hero({ onOpenBooking }) {
  const heroImages = [
    'images/Homepage/Homepage-1.jpg',
    'images/Homepage/Homepage-2.jpg',
    'images/Homepage/Homepage-3.jpg',
    'images/Homepage/Homepage-4.jpg'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoGagal, setVideoGagal] = useState(false);
  const [bolehVideo, setBolehVideo] = useState(false);

  /* Diperiksa setelah komponen terpasang, bukan saat render pertama —
     `window` tidak ada saat halaman dirender di sisi server. */
  useEffect(() => { setBolehVideo(bolehPutarVideo()); }, []);

  const pakaiVideo = Boolean(HERO_VIDEO) && bolehVideo && !videoGagal;

  /* Pergantian foto hanya berjalan bila fotonya memang yang tampil. */
  useEffect(() => {
    if (pakaiVideo) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length, pakaiVideo]);

  return (
    <section className="relative bg-[#041b2e] text-white py-24 md:py-32 overflow-hidden">
      {/* ── LATAR BELAKANG: video atau foto bergantian ───────────── */}
      <div className="absolute inset-0 z-0">
        {pakaiVideo ? (
          <video
            /* `muted` WAJIB — tanpa ini browser menolak memutar otomatis,
               dan hasilnya bukan video bisu tapi layar diam sama sekali.
               `playsInline` mencegah iOS membuka video layar penuh.
               `poster` menahan tampilan gambar sampai bingkai pertama siap,
               supaya tidak ada kedipan hitam. */
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={toWebp(HERO_VIDEO_POSTER) || HERO_VIDEO_POSTER}
            onError={() => setVideoGagal(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-65"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-65 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{
                backgroundImage: `url('${toWebp(img) || img}')`,
                transition: 'opacity 1s ease-in-out, transform 6s ease-out'
              }}
            />
          ))
        )}
      </div>

      {/* Overlay Gelap Tipis & Lembut agar Gambar Tetap Terlihat & Teks Tetap Jelas */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#041b2e]/90 via-[#041b2e]/60 to-[#041b2e]/30 z-1" />

      {/* Konten Teks Hero */}
      <div className="max-grid relative z-10 reveal">
        <div className="max-w-2xl">
          <span className="pill-badge badge-orange mb-4">MARINE SCIENCE • ENERGY • TECHNOLOGY</span>
          <h1 className="heading-lg text-white mb-6 drop-shadow-md">
            Innovations in Marine Science & <span className="text-[#0096d7]">Renewable Blue Energy.</span>
          </h1>
          <p className="text-slate-200 text-lg leading-relaxed mb-8 drop-shadow-sm font-medium" style={{ textAlign: 'justify' }}>
            Torgas Blue Energy operates an integrated marine research laboratory located in Jatinangor, Sumedang, West Java. We focus on developing autonomous marine monitoring technologies and clean energy solutions based on marine biomass to support the sustainable use of marine resources.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="btn-orange text-base px-8 py-3.5 shadow-lg">
              View Research Programs
            </a>
            <a href="#integrated-lab" className="btn-outline text-white border-white hover:bg-white hover:text-[#041b2e] text-base px-8 py-3.5 shadow-lg">
              Lab Services
            </a>
          </div>    
        </div>

        {/* Titik navigasi hanya berarti kalau ada beberapa foto untuk
            dipilih. Saat latar berupa video, tidak ada yang bisa dipilih —
            titik yang tetap ditampilkan justru mengundang klik yang tidak
            melakukan apa pun. */}
        {!pakaiVideo && (
          <div className="flex items-center gap-2 mt-10">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-[#FFAD26]' : 'w-2 bg-white/50 hover:bg-white'
                }`}
                title={`View slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Stats / Legal Cards Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-700/60">
          <div>
            <div className="text-3xl font-extrabold text-[#0096d7]">2 Base</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Jatinangor & Pangandaran</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#FFAD26]">5+</div>
            <div className="text-xs text-slate-300 font-medium mt-1">ACTIVE PROJECTS</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#2ecc71]">21+</div>
            <div className="text-xs text-slate-300 font-medium mt-1">RESEARCHERS</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">Integrated</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Lab Management System</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Hero };
