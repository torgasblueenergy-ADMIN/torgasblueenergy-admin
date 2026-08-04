import { SmartImage } from '../SmartImage';

/* ================================================================
   KOMPONEN 9: INTERNSHIP & PART-TIME SECTION
   Diperbarui: Tombol presisi ukuran sama & Ikon Two-Tone Profesional
================================================================ */
function InternshipSection({ onOpenInternshipForm, onOpenPartTimeForm }) {
  return (
    <section id="internship" className="section-band bg-[#041b2e] py-20 md:py-28 relative overflow-hidden">
      
      {/* Ornamen Latar Belakang Geometris */}
      <div className="absolute top-0 right-0 w-2/3 lg:w-1/2 h-full bg-[#0096d7]/10 skew-x-12 transform origin-top-right"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-[#FFAD26]/10 rounded-full blur-3xl"></div>
      
      <div className="max-grid relative z-10">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            
            {/* KOLOM KIRI: Teks & Tombol Pendaftaran */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <span className="text-[#FFAD26] font-extrabold text-xs uppercase tracking-widest mb-4 block flex items-center gap-2">
                <span className="w-6 h-px bg-[#FFAD26]"></span> JOIN OUR TEAM
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Internship & Careers at <br/>
                <span className="text-[#0096d7]">Torgas Blue Energy</span>
              </h2>
              
              <p className="text-slate-300 text-base sm:text-lg mb-10 leading-relaxed max-w-lg">
                An opportunity for students and young researchers to get directly involved in marine technology and clean energy research in Pangandaran and Jatinangor.
              </p>
              
              {/* Grup Tombol Aksi - Dibatasi max-width agar keduanya Punya Ukuran Persis Sama */}
              <div className="flex flex-col gap-4 w-full max-w-[360px]">
                
                {/* Tombol 1: Internship */}
                <button 
                  onClick={onOpenInternshipForm}
                  className="w-full px-6 py-4 bg-[#0096d7] hover:bg-white text-white hover:text-[#041b2e] font-extrabold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,150,215,0.3)] hover:shadow-lg flex items-center justify-center gap-3 text-sm uppercase tracking-wider group"
                >
                  {/* Ikon Two-Tone: Dokumen */}
                  <svg className="w-5 h-5 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="currentColor" fillOpacity="0.25"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 13H16M8 17H16M8 9H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Internship Application Form
                </button>
                
                {/* Tombol 2: Part-Time */}
                <button 
                  onClick={onOpenPartTimeForm}
                  className="w-full px-6 py-4 bg-transparent hover:bg-[#FFAD26] border-2 border-[#FFAD26] text-[#FFAD26] hover:text-[#041b2e] font-extrabold rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3 text-sm uppercase tracking-wider group"
                >
                  {/* Ikon Two-Tone: Koper Kerja */}
                  <svg className="w-5 h-5 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10Z" fill="currentColor" fillOpacity="0.25"/>
                    <path d="M3 10C3 8.89543 3.89543 8 5 8H19C20.1046 8 21 8.89543 21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 8V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Part-Time Application Form
                </button>

              </div>
            </div>

            {/* KOLOM KANAN: Gambar Pemberitahuan / Poster */}
            <div className="w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] order-1 lg:order-2 relative bg-black/20 p-6 sm:p-8 lg:p-10 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 group">
                <SmartImage
                  src="images/activities/poster-magang-terbaru.jpeg"
                  alt="Poster program Internship dan Part Time Torgas Blue Energy"
                  className="w-full h-full object-contain bg-[#0a2339] group-hover:scale-[1.03] transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23334155'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export { InternshipSection };
