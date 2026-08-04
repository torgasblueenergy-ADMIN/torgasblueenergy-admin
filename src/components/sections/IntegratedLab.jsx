import { useState } from 'react';
import { SmartImage } from '../SmartImage';
import { LAB_SERVICES } from '../../data/services';

/* ================================================================
   KOMPONEN 4: INTEGRATED LAB (BACKGROUND FOTO NATURAL)
   Diperbarui: Jarak garis pembatas bawah didekatkan dengan navigasi
================================================================ */
function IntegratedLab({ onOpenBooking }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalServices = LAB_SERVICES.length;

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % totalServices);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + totalServices) % totalServices);

  const currentServ = LAB_SERVICES[activeSlide] || LAB_SERVICES[0];

  // Daftar gambar ilustrasi untuk tiap brosur
  const slideImages = [
    'images/Brosur/Brosur-1.jpg',
    'images/Brosur/Brosur-2.jpeg',
    'images/Brosur/Brosur-3.jpg',
    'images/Brosur/Brosur-4.jpg',
    'images/Brosur/Brosur-5.jpg',
    'images/Brosur/Brosur-6.jpg'
  ];
  const currentImage = slideImages[activeSlide % slideImages.length];

  return (
    <section id="integrated-lab" className="relative py-20 md:py-28 overflow-hidden border-y border-slate-200">
      
      {/* Background Image Statis Utama */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('images/Homepage/Brosur_page.webp')" }}
      />
      {/* Bayangan netral tipis agar teks putih tetap terbaca */}
      <div className="absolute inset-0 bg-black/40 z-1" />

      <div className="max-grid relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* ------------------------------------------------------------ */}
          {/* KOLOM KIRI: Teks Penjelasan Utama                            */}
          {/* ------------------------------------------------------------ */}
          <div className="lg:col-span-5 text-white space-y-6 reveal">
            <span className="text-xs font-bold text-[#FFAD26] uppercase tracking-widest bg-[#FFAD26]/20 px-3.5 py-1.5 rounded-full border border-[#FFAD26]/30 inline-block backdrop-blur-sm">
              Laboratory Services
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
              Testing and Laboratory Services
            </h2>
            <p className="text-slate-100 text-base leading-relaxed text-justify drop-shadow-md">
              Integrated sample analysis and technical testing facilities dedicated to supporting the research needs of academics, researchers, and maritime industry partners.
            </p>
            
            {/* Tombol Utama */}
            <div className="pt-4">
              <button 
                onClick={onOpenBooking} 
                className="btn-orange text-sm font-bold py-4 px-8 shadow-2xl shadow-[#FFAD26]/30 flex items-center gap-3 w-full sm:w-auto justify-center hover:scale-105 transition-all cursor-pointer"
              >
                <span className="text-xl font-extrabold leading-none">+</span> Sample Test Request
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* KOLOM KANAN: BROSUR KACA (GLASSMORPHISM) + GAMBAR SLIDE      */}
          {/* ------------------------------------------------------------ */}
          <div className="lg:col-span-7 reveal">
            {/* Desain Kotak Transparan Kaca Buram dengan Padding Lebih Sedikit */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[2rem] p-5 md:p-7 shadow-2xl border border-white/50 relative flex flex-col justify-between transition-all duration-300">
              
              {/* ISI BROSUR (Gambar Diperbesar Maksimal) */}
              <div className="animate-fadeIn">
                
                {/* Gambar Brosur - Ketinggian lg:h-[420px] untuk efek sangat besar */}
                <div className="w-full h-72 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden mb-5 shadow-inner border border-slate-200/50 group">
                  <SmartImage
                    src={currentImage}
                    alt={currentServ.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Teks Brosur - Margin dikurangi agar rapat */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#041b2e] leading-snug mb-2">
                  {currentServ.title}
                </h3>
                <div className="w-10 h-1 bg-[#FFAD26] rounded-full mb-3"></div>
                <p className="text-slate-600 text-sm leading-relaxed text-justify font-medium">
                  {currentServ.desc}
                </p>
              </div>

              {/* FOOTER BROSUR (Mini, Padat, & Rapi dengan Jarak Diperketat) */}
              <div className="pt-2 mt-3 border-t border-slate-300/50 flex items-center justify-between">
                
                {/* Indikator Titik (Dots) - Ukuran lebih tipis & kecil */}
                <div className="flex items-center gap-1.5">
                  {LAB_SERVICES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeSlide ? 'w-6 bg-[#0096d7]' : 'w-1.5 bg-slate-300 hover:bg-[#FFAD26]'
                      }`}
                      title={`Ke Brosur ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Tombol Panah Kiri & Kanan - Diperkecil menjadi w-8 h-8 */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={prevSlide}
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#041b2e] hover:text-white text-slate-600 transition-colors flex items-center justify-center font-bold shadow-sm border border-slate-200 cursor-pointer text-sm"
                    title="Brosur Sebelumnya"
                  >
                    ←
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-8 h-8 rounded-full bg-white hover:bg-[#041b2e] hover:text-white text-slate-600 transition-colors flex items-center justify-center font-bold shadow-sm border border-slate-200 cursor-pointer text-sm"
                    title="Brosur Selanjutnya"
                  >
                    →
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export { IntegratedLab };
