import { useState } from 'react';
import { SmartImage } from '../SmartImage';
import { CvModal } from '../modals/CvModal';
import { LAB_SECTIONS } from '../../data/team';

/* ================================================================
   KOMPONEN 6: PROFILE ANGGOTA & TIM PENELITI LAB 
   Diperbarui: Tanpa kotak luar, jarak dirapatkan, tombol "LIHAT BIOGRAFI"
================================================================ */
function LabTeamSection() {
  // State untuk melacak kategori (tab) mana yang sedang diklik
  const [activeTeamTab, setActiveTeamTab] = useState(0);
  
  // State untuk membuka Pop-up CV / Biografi
  const [selectedMember, setSelectedMember] = useState(null);

  // Mengambil data seksi yang sedang aktif
  const activeSection = LAB_SECTIONS[activeTeamTab];

  return (
    <section id="team" className="section-band bg-slate-50 border-y border-slate-100 py-20 md:py-28">
      <div className="max-grid">
        
        {/* Header Seksi Utama */}
        <div className="text-center max-w-2xl mx-auto mb-10 reveal">
          <span className="text-xs font-bold text-[#0096d7] uppercase tracking-widest block mb-3">
            PEOPLE BEHIND TORGAS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#041b2e] mb-4 tracking-tight">
            Research Team 
          </h2>
          <p className="text-slate-500 text-base">
            Organizational structure, principal investigator, and operations team of the Torgas Blue Energy marine station.
          </p>
        </div>

        {/* MENU TAB KATEGORI (4 TOMBOL SEKSI) */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 reveal">
          {LAB_SECTIONS.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTeamTab(idx)}
              className={`px-6 sm:px-8 py-3.5 font-extrabold text-xs tracking-wider uppercase rounded-full transition-all duration-300 border-2 cursor-pointer ${
                activeTeamTab === idx
                  ? 'bg-[#041b2e] text-white border-[#041b2e] shadow-lg shadow-[#041b2e]/20'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-[#0096d7] hover:text-[#0096d7]'
              }`}
            >
              {sec.category}
            </button>
          ))}
        </div>

        {/* WADAH UTAMA KOTAK PUTIH */}
        <div className="bg-white rounded-[2rem] border border-slate-200/80 p-6 sm:p-10 md:p-12 shadow-xl reveal min-h-[450px]">
          
          {/* Header Sub-Seksi di dalam Kotak */}
          <div className="border-b border-slate-100 pb-5 mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#041b2e] tracking-wide">
                {activeSection.category}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {activeSection.subtitle}
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#0096d7] bg-[#0096d7]/10 px-4 py-2 rounded-lg whitespace-nowrap">
              {activeSection.members.length} PERSONNEL
            </span>
          </div>

          {/* Keadaan kosong — dipakai tab yang anggotanya belum diisi.
              ⚠️ Tanpa ini, tab kosong hanya menampilkan kotak putih besar
              tanpa apa pun di dalamnya, dan pengunjung mengiranya rusak. */}
          {activeSection.members.length === 0 && (
            <div className="py-16 flex flex-col items-center text-center gap-3 animate-fadeIn">
              <svg className="w-14 h-14 text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="text-sm font-extrabold text-[#041b2e]">
                {activeSection.kosongPesan || 'Profiles for this team are being prepared.'}
              </p>
            </div>
          )}

          {/* Grid Anggota: Tanpa Kotak Luar & Jarak Dirapatkan */}
          <div key={activeTeamTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
            {activeSection.members.map((member) => (
              <div 
                key={member.id}
                className="flex flex-col items-center text-center group"
              >
                {/* Foto Utama Profil (Tanpa kotak luar, sudut rounded rapi) */}
                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden mb-4 border border-slate-200 bg-slate-100 shadow-md relative">
                  <SmartImage
                    src={member.photo}
                    alt={member.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23041b2e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Nama & Jabatan (Jarak dirapatkan tanpa padding berlebih) */}
                <div className="mb-4 w-full">
                  <h4 className="font-extrabold text-[#041b2e] text-lg sm:text-xl leading-snug mb-1">
                    {member.name}
                  </h4>
                  <span className="text-xs font-extrabold text-[#0096d7] block uppercase tracking-wider mb-2">
                    {member.role}
                  </span>
                  <div className="w-10 h-0.5 bg-[#FFAD26] rounded-full mx-auto"></div>
                </div>

                {/* Tombol Lihat Biografi — hanya bila memang ADA yang bisa dilihat.
                    ⚠️ Anggota tanpa CV dan tanpa foto detail (mis. anak magang)
                    dulunya tetap menampilkan tombol ini, dan tombolnya membuka
                    jendela besar berisi "CV not available yet". Tombol yang
                    menjanjikan sesuatu lalu tidak memberi apa-apa lebih buruk
                    daripada tidak ada tombol sama sekali. */}
                {(member.cvPdf || member.detailPhoto) && (
                  <div className="w-full">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="w-full py-2.5 px-4 bg-white hover:bg-[#041b2e] text-[#041b2e] hover:text-white font-extrabold text-xs tracking-wider uppercase rounded-xl border border-slate-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-[#041b2e]"
                    >
                      👤 View Biography
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RENDER MODAL POP-UP CV / BIOGRAFI */}
      <CvModal 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />
    </section>
  );
}

export { LabTeamSection };
