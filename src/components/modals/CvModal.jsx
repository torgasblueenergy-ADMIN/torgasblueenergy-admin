import { SmartImage } from '../SmartImage';

/* ================================================================
   KOMPONEN MODAL POP-UP CV PDF / BIOGRAFI
   Diperbarui: Menambahkan Kotak Expertise (Keahlian) di bawah foto
================================================================ */
function CvModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-[#041b2e]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 flex-shrink-0">
          <div>
            <span className="text-[10px] font-extrabold text-[#0096d7] uppercase tracking-widest block mb-0.5">
              CURRICULUM VITAE & PROFILE
            </span>
            <h3 className="text-xl font-extrabold text-[#041b2e] flex items-center gap-2 leading-tight">
              {member.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{member.role}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-[#041b2e] hover:text-white text-slate-700 transition-colors flex items-center justify-center font-bold text-lg cursor-pointer"
            title="Tutup Modal"
          >
            ✕
          </button>
        </div>

        {/* Isi Modal: 2 Kolom (Kiri PDF DOMINAN 8 Kolom, Kanan Foto+Keahlian 4 Kolom) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Kolom Kiri: Tampilan PDF CV (Jauh Lebih Besar - 8 Kolom) */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                {member.cvPdf && (
                  <a
                    href={member.cvPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0096d7] hover:underline"
                  >
                    Buka Fullscreen / Tab Baru ↗
                  </a>
                )}
              </div>

              {/* Box PDF Viewer (Tinggi Tetap 520px/620px) */}
              <div className="w-full h-[520px] sm:h-[620px] rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 shadow-inner">
                {member.cvPdf ? (
                  <iframe
                    src={member.cvPdf}
                    title={`CV ${member.name}`}
                    className="w-full h-full border-0"
                  />
                ) : (
                  /* Fallback: CV belum tersedia — tampilkan pesan, bukan iframe kosong */
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-8 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 013.5 7.125v-1.5A3.375 3.375 0 0010.625 2.25H8.25A2.25 2.25 0 006 4.5v15a2.25 2.25 0 002.25 2.25h9A2.25 2.25 0 0019.5 19.5v-5.25z"/>
                    </svg>
                    <p className="text-sm font-extrabold text-[#041b2e]">CV belum tersedia</p>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Dokumen CV {member.name} sedang dalam proses pengunggahan. Silakan hubungi kami untuk informasi lebih lanjut.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Foto Profil & Kotak Expertise (4 Kolom) */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
              </div>
              
              {/* Wrapper Flex: Membagi tinggi 520/620px untuk Gambar & Kotak Keahlian */}
              <div className="flex flex-col gap-4 h-[520px] sm:h-[620px] w-full">
                
                {/* 1. Gambar Profil (Otomatis mengisi sisa ruang - flex-1) */}
                <div className="flex-1 min-h-0 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md relative group">
                  <SmartImage
                    src={member.detailPhoto}
                    alt={`Detail ${member.name}`}
                    onError={(e) => {
                      // Fallback jika foto detail belum diunggah
                      e.target.onerror = null;
                      e.target.src = member.photo;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay Nama & Jabatan di atas gambar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#041b2e]/95 via-[#041b2e]/60 to-transparent p-5 text-white">
                    <p className="text-sm font-extrabold">{member.name}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{member.role}</p>
                  </div>
                </div>

                {/* 2. Kotak Area of Expertise (Tinggi menyesuaikan isi - flex-none) */}
                <div className="flex-none bg-[#f2f7fb] border-l-4 border-l-[#FFAD26] border-y border-r border-slate-200 rounded-2xl p-5 shadow-sm group hover:border-r-[#FFAD26] hover:border-y-[#FFAD26] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-extrabold text-[#041b2e] text-[11px] uppercase tracking-widest">
                      Area of Expertise
                    </h4>
                  </div>
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                    {member.focus || "Marine Science & Technology Research"}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 flex-shrink-0">
          <span className="font-semibold hidden sm:inline">PT TORGAS BLUE ENERGY • EXECUTIVE PERSONNEL</span>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#041b2e] hover:bg-[#0096d7] text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-sm ml-auto uppercase tracking-wider text-xs"
          >
            Tutup Biografi
          </button>
        </div>

      </div>
    </div>
  );
}

export { CvModal };
