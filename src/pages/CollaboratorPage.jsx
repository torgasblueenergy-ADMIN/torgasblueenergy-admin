import { SmartImage } from '../components/SmartImage';
import { LSM_COLLABORATORS, UNIV_COLLABORATORS } from '../data/collaborators';

function CollaboratorPage({ onBackToMain }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#041b2e] pb-16">
      
      {/* HEADER NAVIGASI KHUSUS */}
      <div className="bg-[#041b2e] text-white py-5 px-6 shadow-md border-b-4 border-[#0096d7] mb-12 sticky top-0 z-50">
        <div className="max-grid flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <SmartImage
              src="images/logo/logo.jpeg"
              alt="Logo Torgas Blue Energy"
              eager
              className="h-8 sm:h-10 w-auto object-contain rounded-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-wide hidden sm:inline-block">Torgas Collaborators</span>
          </div>
          <button 
            onClick={onBackToMain} 
            className="btn-outline border-white text-white hover:bg-white hover:text-[#041b2e] text-xs py-2 px-5 flex items-center gap-2"
          >
            ← Kembali ke Halaman Utama
          </button>
        </div>
      </div>

      <div className="max-grid">
        {/* Judul Halaman */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeIn">
          <span className="pill-badge badge-blue mb-3">OUR PARTNERS</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#041b2e] mb-4">Mitra & Kolaborator Riset</h1>
          <p className="text-slate-500 text-base">Sinergi antara akademisi dan komunitas masyarakat pesisir dalam mewujudkan riset kelautan yang berdampak nyata dan berkelanjutan.</p>
        </div>

        {/* SEKSI 1: UNIVERSITAS (Warna Asli Langsung Tampil) */}
        <div className="mb-24 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-1 bg-[#0096d7]"></div>
            <h2 className="text-2xl font-extrabold text-[#041b2e] uppercase tracking-wider">Academic Partners</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          
          {/* 4 logo per baris di layar besar; menyusut jadi 3 lalu 2 di layar kecil */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {UNIV_COLLABORATORS.map((univ) => (
              <div key={univ.id} className="flex items-center justify-center group p-2">

                {/* Revisi Pak Tora 4/8/2026: logo diperbesar (112/160px),
                    tetap 4 per baris agar susunannya rapi. */}
                <div className="w-28 h-28 md:w-40 md:h-40 flex items-center justify-center relative">
                   <SmartImage
                      src={univ.logo}
                      alt={`Logo ${univ.name}`}
                      /* KOREKSI: Efek grayscale dihapus. Sisa animasi scale (membesar) saat di-hover. */
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        /* ⚠️ Versi lama menebak-nebak ekstensi: .png gagal → coba .jpg
                           → coba .jpeg. Itu berbahaya sekarang, karena file .jpg lama
                           masih berlatar PUTIH. Sekali .png tersendat, logo langsung
                           berganti ke versi berkotak putih dan menetap seperti itu.

                           Kini langsung ke placeholder netral. Semua logo dipastikan
                           ada sebagai .png + .webp transparan, jadi tidak perlu ditebak. */
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23cbd5e1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'/%3E%3C/svg%3E";
                      }}
                   />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* SEKSI 2: LSM NELAYAN */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-[#FFAD26]"></div>
            <h2 className="text-2xl font-extrabold text-[#041b2e] uppercase tracking-wider">Community Partners</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LSM_COLLABORATORS.map((lsm) => (
              <div key={lsm.id} className="bg-gradient-to-br from-[#041b2e] to-[#0a2f4c] rounded-3xl p-8 sm:p-12 relative overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center min-h-[200px]">
                {/* Efek Ornamen Lingkaran Gelap di Background */}
                <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-[#0096d7] rounded-full mix-blend-overlay opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-[#FFAD26] rounded-full mix-blend-overlay opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Teks Tipografi LSM (Gradient Fill) */}
                <h3 className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-black text-center tracking-tight leading-tight uppercase">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0096d7] via-cyan-300 to-[#2ecc71] drop-shadow-lg">
                    {lsm.name}
                  </span>
                </h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export { CollaboratorPage };
