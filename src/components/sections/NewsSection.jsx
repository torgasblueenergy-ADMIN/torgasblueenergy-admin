import { useState, useEffect, useMemo } from 'react';
import { SmartImage } from '../SmartImage';
import { ambilPublikasi } from '../../lib/publikasi';

/* ================================================================
   KOMPONEN 7: PUBLIKASI, BERITA & VIDEO
   ----------------------------------------------------------------
   ⚠️ 13 Agu 2026 — SATU-SATUNYA SUMBER ISI ADALAH SPREADSHEET.

   Berkas src/data/articles.js sudah DIHAPUS. Bagian ini tidak lagi
   menyimpan artikel, berita, atau video apa pun di dalam kode; semua
   dibaca dari tab "Publikasi" lewat src/lib/publikasi.js.

   ⚠️ Jangan menambahkan kembali daftar cadangan di kode. Dulu isinya
   memang ada di sini, dan akibatnya baris yang ditambahkan pengurus ke
   Spreadsheet tidak pernah muncul — tidak ada yang menyadarinya selama
   berbulan-bulan karena bagian ini tetap terlihat "penuh".

   Konsekuensi yang disengaja: kalau Spreadsheet gagal dibaca, bagian
   ini kosong dan berkata terus terang bahwa isinya gagal dimuat. Itu
   lebih baik daripada memajang isi lama yang menyamarkan kegagalan.
================================================================ */
function NewsSection({ onSelectArticle }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muat, setMuat] = useState({ status: 'memuat', data: [] });

  useEffect(() => {
    let dibatalkan = false;
    ambilPublikasi().then((hasil) => {
      if (dibatalkan) return;
      setMuat(hasil.siap
        ? { status: 'siap', data: hasil.data }
        : { status: 'gagal', data: [] });
    });
    return () => { dibatalkan = true; };
  }, []);

  const semuaArtikel = muat.data;

  /* Jumlah pada tombol dihitung dari data yang benar-benar tampil,
     bukan dari panjang larik di kode — supaya tombol tidak pernah
     menjanjikan jumlah yang berbeda dari kartu yang muncul. */
  const jumlah = useMemo(() => ({
    all: semuaArtikel.length,
    'artikel-ilmiah': semuaArtikel.filter((a) => a.category === 'artikel-ilmiah').length,
    news: semuaArtikel.filter((a) => a.category === 'news').length,
    video: semuaArtikel.filter((a) => a.category === 'video').length
  }), [semuaArtikel]);

  const filteredArticles = semuaArtikel.filter(art => activeCategory === 'all' || art.category === activeCategory);

  /* Data Spreadsheet datang setelah kartu pertama tampil. Kalau saat itu
     pengunjung sudah menggeser carousel, posisinya bisa menunjuk kartu yang
     tidak ada lagi — layar tampak kosong padahal datanya ada. Kembalikan ke
     kartu pertama bila posisinya melewati batas. */
  useEffect(() => {
    if (currentIndex > filteredArticles.length - 1) setCurrentIndex(0);
  }, [filteredArticles.length, currentIndex]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
  };

  const nextSlide = () => {
    if (currentIndex < filteredArticles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredArticles.length - 1);
    }
  };

  return (
    <section id="news" className="section-band bg-white border-y border-slate-100 py-20 md:py-28 overflow-hidden">
      <div className="max-grid">
        
        <div className="text-center max-w-2xl mx-auto mb-10 reveal">
          <span className="text-xs font-bold text-[#0096d7] uppercase tracking-widest block mb-3">INFORMATION & DOCUMENTATION</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#041b2e] mb-4 tracking-tight">Scientific Publications & News</h2>
          <p className="text-slate-500 text-base">A collection of scientific research articles, research reports, and documentation of Torgas Blue Energy’s latest activities.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 reveal">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <button onClick={() => handleCategoryChange('all')} className={`px-6 py-2.5 font-extrabold text-xs tracking-wider uppercase rounded-full border-2 transition-all cursor-pointer ${activeCategory === 'all' ? 'bg-[#041b2e] text-white border-[#041b2e] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0096d7] hover:text-[#0096d7]'}`}>All ({jumlah.all})</button>
            <button onClick={() => handleCategoryChange('artikel-ilmiah')} className={`px-6 py-2.5 font-extrabold text-xs tracking-wider uppercase rounded-full border-2 transition-all cursor-pointer ${activeCategory === 'artikel-ilmiah' ? 'bg-[#041b2e] text-white border-[#041b2e] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0096d7] hover:text-[#0096d7]'}`}>🔬 Scientific Articles ({jumlah['artikel-ilmiah']})</button>
            <button onClick={() => handleCategoryChange('news')} className={`px-6 py-2.5 font-extrabold text-xs tracking-wider uppercase rounded-full border-2 transition-all cursor-pointer ${activeCategory === 'news' ? 'bg-[#041b2e] text-white border-[#041b2e] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0096d7] hover:text-[#0096d7]'}`}>📰 News ({jumlah.news})</button>
            <button onClick={() => handleCategoryChange('video')} className={`px-6 py-2.5 font-extrabold text-xs tracking-wider uppercase rounded-full border-2 transition-all cursor-pointer ${activeCategory === 'video' ? 'bg-[#041b2e] text-white border-[#041b2e] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0096d7] hover:text-[#0096d7]'}`}>🎬 Video ({jumlah.video})</button>
          </div>

          {filteredArticles.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 mr-1 hidden md:inline">{currentIndex + 1} / {filteredArticles.length}</span>
              <button onClick={prevSlide} className="w-11 h-11 rounded-full bg-slate-100 hover:bg-[#041b2e] hover:text-white text-slate-700 transition-all font-bold text-lg border border-slate-200 cursor-pointer shadow-sm">←</button>
              <button onClick={nextSlide} className="w-11 h-11 rounded-full bg-[#0096d7] hover:bg-[#041b2e] text-white transition-all font-bold text-lg border border-[#0096d7] cursor-pointer shadow-sm">→</button>
            </div>
          )}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="relative overflow-hidden py-2">
            <div className="flex gap-6 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 320}px)` }}>
              {filteredArticles.map((item) => (
                <div key={item.id} className="w-[300px] sm:w-[350px] lg:w-[380px] flex-shrink-0 bg-slate-50/80 rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0096d7] hover:shadow-2xl transition-all duration-300 group">
                  <div>
                    <div className="w-full h-52 overflow-hidden bg-slate-200 relative flex items-center justify-center">
                      <span className="text-slate-400 text-xs font-bold absolute z-0">No image</span>
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-10"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.style.display = 'none'; 
                        }} 
                      />
                      {/* Tombol play di tengah thumbnail — penanda bahwa ini video */}
                      {item.youtubeId && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 rounded-full bg-[#041b2e]/70 backdrop-blur-sm flex items-center justify-center border-2 border-white/80 shadow-xl transition-transform duration-300 group-hover:scale-110">
                            <svg viewBox="0 0 24 24" fill="#ffffff" className="w-7 h-7 ml-1" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 z-20">
                        <span className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${
                          item.category === 'artikel-ilmiah' ? 'bg-[#0096d7]/90 text-white border-[#0096d7]'
                          : item.category === 'video'        ? 'bg-[#e74c3c]/90 text-white border-[#e74c3c]'
                          : 'bg-[#FFAD26]/90 text-[#041b2e] border-[#FFAD26]'}`}>
                          {item.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* KOREKSI: Hanya menampilkan Tanggal, bagian Penulis dihapus */}
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mb-3">
                        <span>📅 {item.date}</span>
                      </div>
                      <h3 className="font-extrabold text-[#041b2e] text-lg leading-snug group-hover:text-[#0096d7] transition-colors line-clamp-2">{item.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button onClick={() => onSelectArticle(item)} className="w-full py-3 px-4 bg-white hover:bg-[#041b2e] text-[#041b2e] hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:border-[#041b2e]">
                      Read More ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tiga keadaan dibedakan dengan sengaja. Sebelumnya semuanya
             memakai satu kalimat "belum ada publikasi", sehingga
             kegagalan memuat terlihat persis seperti daftar kosong —
             dan tidak ada yang tahu ada yang rusak. */
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            {muat.status === 'memuat' && (
              <p className="text-slate-400 font-bold text-sm">Loading publications…</p>
            )}
            {muat.status === 'gagal' && (
              <>
                <p className="text-slate-500 font-bold text-sm">Publications could not be loaded right now.</p>
                <p className="text-slate-400 text-xs mt-1.5">Please refresh the page in a moment.</p>
              </>
            )}
            {muat.status === 'siap' && (
              <p className="text-slate-400 font-bold text-sm">No publications in this category yet.</p>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

export { NewsSection };
