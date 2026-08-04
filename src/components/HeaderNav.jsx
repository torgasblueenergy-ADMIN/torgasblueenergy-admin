import { useState } from 'react';
import { SmartImage } from './SmartImage';

/* ================================================================
   KOMPONEN 1: HEADER NAVIGASI (DINAMIS UNTUK DESKTOP & MOBILE)
   Diperbarui: Mengganti emoji dengan gambar kustom untuk Student Portal
================================================================ */
function HeaderNav({ onOpenStudentPortal, onOpenCollaborator }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-100">
      <nav className="top-nav flex items-center relative bg-white h-20">
        <div className="max-grid w-full flex items-center justify-between">
          
          {/* Bagian Logo Torgas */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 z-50 group">
            <SmartImage
              src="images/logo/logo.jpeg"
              alt="Logo Torgas Blue Energy"
              eager
              className="h-9 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-extrabold text-[#041b2e] block leading-none">TORGAS</span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#0096d7] block mt-0.5">BLUE ENERGY</span>
            </div>
          </a>

          {/* Menu Navigasi Desktop */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            <a href="#about" className="text-sm font-bold text-[#041b2e] hover:text-[#0096d7] transition">Profile & Legal Status</a>
            <a href="#projects" className="text-sm font-bold text-[#041b2e] hover:text-[#0096d7] transition">Research Project </a>
            <a href="#integrated-lab" className="text-sm font-bold text-[#041b2e] hover:text-[#0096d7] transition">Laboratory Services</a>
            <a href="#team" className="text-sm font-bold text-[#041b2e] hover:text-[#0096d7] transition">Research Team</a>
            <a href="#news" className="text-sm font-bold text-[#041b2e] hover:text-[#0096d7] transition">Publications and News</a>
            
            {/* Tombol Halaman Collaborator */}
            <button onClick={onOpenCollaborator} className="text-sm font-bold text-[#041b2e] hover:text-[#0096d7] transition cursor-pointer">Collaborator</button>
            
            <a href="#internship" className="text-sm font-bold text-[#0096d7] hover:text-[#007bb5] transition">Internship</a>
          </div>

          {/* Tombol Aksi Utama Desktop (DENGAN GAMBAR KUSTOM) */}
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={onOpenStudentPortal} className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
              <SmartImage
                src="images/logo/Logo student Portal.jpeg"
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain rounded-sm mix-blend-multiply"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              Student Portal
            </button>
          </div>

          {/* Tombol Hamburger HP */}
          <button 
            className="lg:hidden z-50 text-3xl font-bold text-[#041b2e] p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Dropdown Menu Khusus HP */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl flex flex-col p-6 gap-4 border-t border-slate-100 z-40 mobile-menu-open">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#041b2e] border-b border-slate-50 pb-2">Profile & Legal Status</a>
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#041b2e] border-b border-slate-50 pb-2">Research Project</a>
            <a href="#integrated-lab" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#041b2e] border-b border-slate-50 pb-2">Laboratory Services</a>
            <a href="#team" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#041b2e] border-b border-slate-50 pb-2">Research Team</a>
            <a href="#news" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#041b2e] border-b border-slate-50 pb-2">Publications and News</a>
            <button onClick={() => { setIsMobileMenuOpen(false); onOpenCollaborator(); }} className="text-base font-bold text-[#041b2e] border-b border-slate-50 pb-2 text-left">Collaborator</button>
            <a href="#internship" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[#0096d7] border-b border-slate-50 pb-2">Internship</a>
            
            {/* Tombol Mobile (DENGAN GAMBAR KUSTOM) */}
            <button onClick={() => { setIsMobileMenuOpen(false); onOpenStudentPortal(); }} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              <SmartImage
                src="images/logo/Logo student Portal.jpeg"
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain rounded-sm mix-blend-multiply"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              Student Portal
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export { HeaderNav };
