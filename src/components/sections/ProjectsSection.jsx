import { toWebp } from '../../lib/images';
import { useState } from 'react';
import { SmartImage } from '../SmartImage';
import { PROJECTS } from '../../data/projects';

/* ================================================================
   KOMPONEN 5: PROGRAM KERJA & PROYEK (INSTANT BACKGROUND CROSSFADE)
   Diperbarui: Desain ultra-compact, badge status (In-Field Testing, dll) dihapus
================================================================ */
function ProjectsSection() {
  const [activeProject, setActiveProject] = useState(0);
  const totalProjects = PROJECTS.length;

  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % totalProjects);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + totalProjects) % totalProjects);
  };

  const currentProj = PROJECTS[activeProject] || PROJECTS[0];

  return (
    <section id="projects" className="relative py-20 md:py-28 overflow-hidden border-y border-slate-800 bg-[#041b2e]">
      
      {/* 1. DYNAMIC BACKGROUND IMAGE (Sistem Preload & Opacity Tanpa Delay) */}
      {PROJECTS.map((proj, idx) => (
        <div 
          key={`bg-${proj.id}`}
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out scale-105 ${
            idx === activeProject ? 'opacity-100' : 'opacity-0'
          }`}
          /* Pakai WebP yang sama dengan <SmartImage> di atasnya supaya browser
             hanya mengunduh SATU file, bukan dua versi gambar yang sama. */
          style={{ backgroundImage: `url('${toWebp(proj.image) || proj.image}')` }}
        />
      ))}
      
      {/* 2. OVERLAY GRADIENT GELAP */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#041b2e]/90 via-[#041b2e]/80 to-[#041b2e]/70 z-1 backdrop-blur-[2px]" />

      <div className="max-grid relative z-10">
        
        {/* Header Judul Seksi */}
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="text-xs font-bold text-[#FFAD26] uppercase tracking-widest bg-[#FFAD26]/20 px-3.5 py-1.5 rounded-full border border-[#FFAD26]/30 inline-block backdrop-blur-sm mb-3">
            WORK PROGRAM & INNOVATIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
            Research Projects
          </h2>
          <p className="text-slate-200 text-base drop-shadow-md">
            Development of maritime and renewable energy technologies, from the laboratory scale to direct field testing.
          </p>
        </div>

        {/* ============================================================ */}
        {/* KOTAK BESAR SLIDE PROYEK (GLASSMORPHISM SHOWCASE)            */}
        {/* ============================================================ */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white/60 p-5 md:p-8 shadow-2xl reveal relative transition-all duration-500 flex flex-col justify-between">
          
          {/* Konten Utama Kotak Besar (Split Gambar & Detail) */}
          <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-center animate-fadeIn">
            
            {/* Sisi Kiri: Gambar Proyek (Lebih Besar, Tanpa Badge Apapun) */}
            <div className="lg:col-span-7">
              {/* Sebagian proyek memakai diagram tegak, bukan foto lanskap.
                  Diagram tidak boleh dipotong — isinya jadi hilang. Data
                  proyek bisa meminta `fit: 'contain'` untuk kasus seperti itu,
                  dengan latar putih supaya sisa ruangnya tidak terlihat kosong. */}
              <div className={`w-full h-72 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden border border-slate-200/50 shadow-inner relative group ${
                currentProj.fit === 'contain' ? 'bg-white' : ''
              }`}>
                <SmartImage
                  key={currentProj.id}
                  src={currentProj.image}
                  alt={currentProj.title}
                  className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
                    currentProj.fit === 'contain' ? 'object-contain p-3' : 'object-cover'
                  }`}
                />
              </div>
            </div>

            {/* Sisi Kanan: Detail Informasi Proyek (Dinaikkan ke Atas) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Panjang judul antar proyek jauh berbeda — ada yang satu kata
                  ('Microplastics'), ada judul riset penuh sembilan kata. Ukuran
                  huruf tetap akan membuat judul panjang memenuhi kartu dan
                  menenggelamkan deskripsinya, jadi ukurannya menyesuaikan. */}
              <h3 className={`font-extrabold text-[#041b2e] leading-snug ${
                currentProj.title.length > 40
                  ? 'text-xl sm:text-2xl lg:text-[1.75rem]'
                  : 'text-2xl sm:text-3xl lg:text-4xl'
              }`}>
                {currentProj.title}
              </h3>

              <div className="w-12 h-1 bg-[#FFAD26] rounded-full my-4"></div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify font-medium">
                {currentProj.desc}
              </p>
            </div>

          </div>

          {/* Bottom Bar: Dots Navigasi (Kiri) & Tombol Panah (Kanan) */}
          <div className="mt-6 pt-4 border-t border-slate-300/50 flex items-center justify-between">
            
            {/* Dots Navigasi (Kecil & Tipis) */}
            <div className="flex items-center gap-1.5">
              {PROJECTS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveProject(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeProject ? 'w-6 bg-[#0096d7]' : 'w-1.5 bg-slate-300 hover:bg-[#FFAD26]'
                  }`}
                  title={`Go to project ${idx + 1}`}
                />
              ))}
            </div>

            {/* Tombol Panah Kiri & Kanan (Mini) */}
            <div className="flex items-center gap-2">
              <button 
                onClick={prevProject}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#041b2e] hover:text-white text-slate-600 transition-colors flex items-center justify-center font-bold shadow-sm border border-slate-200 cursor-pointer text-sm"
                title="Previous project"
              >
                ←
              </button>
              <button 
                onClick={nextProject}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#041b2e] hover:text-white text-slate-600 transition-colors flex items-center justify-center font-bold shadow-sm border border-slate-200 cursor-pointer text-sm"
                title="Next project"
              >
                →
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export { ProjectsSection };
