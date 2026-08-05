import { useState } from 'react';

/* ================================================================
   KOMPONEN 3: PROFIL & LEGALITAS (CLEAN 2-COLOR VECTOR ICONS)
================================================================ */
function AboutLegal() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <section id="about" className="section-band bg-white border-y border-slate-100">
      <div className="max-grid">
        
        {/* Header Judul Seksi */}
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="text-xs font-bold text-[#0096d7] uppercase tracking-widest block mb-3">
            ABOUT TORGAS BLUE ENERGY
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#041b2e] mb-4 tracking-tight">
            Company Profile & Legal Status
          </h2>
          <p className="text-slate-500 text-base">
            A marine research and technology company legally registered with the Ministry of Law and Human Rights of the Republic of Indonesia.
          </p>
        </div>

        {/* Tombol Tab Interaktif */}
        <div className="flex justify-center gap-4 mb-12 reveal">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-8 py-3.5 font-bold text-sm transition-all duration-300 border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#0096d7] text-[#041b2e]'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('legalitas')}
            className={`px-8 py-3.5 font-bold text-sm transition-all duration-300 border-b-2 cursor-pointer ${
              activeTab === 'legalitas'
                ? 'border-[#FFAD26] text-[#041b2e]'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
             Official Legal Status
          </button>
        </div>

        {/* Wadah Utama */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-6 md:p-10 reveal">
          
          {/* ======================================================== */}
          {/* TAB 1: PROFILE PERUSAHAAN                                */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              {/* KOTAK 1: Deskripsi Utama */}
              <div className="p-6 sm:p-8 bg-white border border-slate-200 border-l-4 border-l-[#0096d7]">
                <h3 className="text-xl font-extrabold text-[#041b2e] mb-3 uppercase tracking-wide">
                  Profile Torgas Blue Energy
                </h3>
                <p className="text-slate-600 leading-relaxed text-justify text-base">
                  Torgas Blue Energy operates an integrated marine research laboratory located in Jatinangor, Sumedang, West Java. We focus on developing autonomous marine monitoring technologies and clean energy solutions based on marine biomass to support the sustainable use of marine resources.
                </p>
              </div>

              {/* KOTAK 2: Lokasi & Komitmen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-slate-200 hover:border-[#0096d7] transition-colors">
                  <div className="text-[#0096d7] font-bold text-xs tracking-widest mb-3">01 / OPERATIONAL LOCATIONS</div>
                  <h4 className="font-bold text-[#041b2e] text-lg mb-3">Integrated Laboratory & Research Station</h4>
                  <p className="text-sm text-slate-500 leading-relaxed text-justify">
                    Based in Jatinangor, Sumedang, and supported by the Coastal Marine Research Station in Pangandaran, West Java, for field surveys and hands-on laboratory testing.
                  </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 hover:border-[#FFAD26] transition-colors">
                  <div className="text-[#FFAD26] font-bold text-xs tracking-widest mb-3">02 /  COMMITMENT TO SUSTAINABILITY</div>
                  <h4 className="font-bold text-[#041b2e] text-lg mb-3">Conservation of Ecosystems & Blue Carbon</h4>
                  <p className="text-sm text-slate-500 leading-relaxed text-justify">
                    Supporting sustainable marine resource management, coastal ecosystem preservation, and research on blue carbon sequestration in marine vegetation ecosystems.
                  </p>
                </div>
              </div>

              {/* KOTAK 4: Marine, Energy, Data, Carbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white border border-slate-200 hover:border-[#0096d7] transition-colors flex flex-col">
                  <div className="text-slate-400 font-bold text-xs tracking-widest mb-3">03 / MARINE RESEARCH</div>
                  <h4 className="font-bold text-[#041b2e] text-base mb-2">Advancing Ocean Science & Innovation</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mt-auto">
                    Field expeditions, biodiversity surveys, and ecosystem health monitoring across Indonesian coastal waters.
                  </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 hover:border-[#FFAD26] transition-colors flex flex-col">
                  <div className="text-slate-400 font-bold text-xs tracking-widest mb-3">04 / CLEAN ENERGY</div>
                  <h4 className="font-bold text-[#041b2e] text-base mb-2">Developing Sustainable Energy Solutions</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mt-auto">
                    Portable biogas systems and biofuel research converting marine biomass into deployable energy solutions.
                  </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 hover:border-[#0096d7] transition-colors flex flex-col">
                  <div className="text-slate-400 font-bold text-xs tracking-widest mb-3">05 / OCEAN INTELLIGENCE</div>
                  <h4 className="font-bold text-[#041b2e] text-base mb-2">Transforming Ocean Data into Insights</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mt-auto">
                    Autonomous surface vessels and IoT sensor arrays delivering continuous real-time data from the sea.
                  </p>
                </div>
                <div className="p-6 bg-white border border-slate-200 hover:border-[#FFAD26] transition-colors flex flex-col">
                  <div className="text-slate-400 font-bold text-xs tracking-widest mb-3">06 / BLUE CARBON</div>
                  <h4 className="font-bold text-[#041b2e] text-base mb-2">Measuring & Tracking Coastal Carbon</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mt-auto">
                    Quantifying mangrove carbon sequestration to support Indonesia's national climate commitment frameworks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: LEGALITAS RESMI (IKON FLAT 2 WARNA, NO NUMBERS)   */}
          {/* ======================================================== */}
          {activeTab === 'legalitas' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* KOTAK ATAS BESAR (Legally Established) */}
              <div className="p-8 sm:p-10 bg-[#041b2e] rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center gap-8">
                {/* Ikon Timbangan 2 Warna (Flat Vector) */}
                <div className="w-16 h-16 rounded-xl bg-[#0096d7]/15 flex items-center justify-center flex-shrink-0 border border-[#0096d7]/30">
                  <svg className="w-8 h-8 text-[#FFAD26]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5 5 0 006 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5 5 0 006 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                    Legally established
                  </h3>
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                    A registered Indonesian corporation with all required government permits, operating under international laboratory standards.
                  </p>
                </div>
              </div>

              {/* GRID 4 KOTAK LEGALITAS (IKON 2 WARNA FLAT & RAPI) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Deed of Establishment */}
                <div className="p-8 bg-white border border-slate-200 rounded-xl hover:border-[#FFAD26] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#041b2e]/5 flex items-center justify-center flex-shrink-0 border border-[#041b2e]/10">
                      <svg className="w-6 h-6 text-[#041b2e]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#041b2e] text-lg leading-tight">
                        Deed of Establishment
                      </h4>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed text-justify">
                    Corporate charter establishing Torgas Blue Energy as a legal entity under Indonesian law.
                  </p>
                </div>

                {/* 2. Ministry of Law & Human Rights Decree */}
                <div className="p-8 bg-white border border-slate-200 rounded-xl hover:border-[#FFAD26] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0096d7]/10 flex items-center justify-center flex-shrink-0 border border-[#0096d7]/20">
                      <svg className="w-6 h-6 text-[#0096d7]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#041b2e] text-lg leading-tight">
                        Ministry of Law & Human Rights Decree
                      </h4>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed text-justify">
                    Official decree recognizing the company's legal status from the Ministry of Law and Human Rights.
                  </p>
                </div>

                {/* 3. NIB: Business Registration Number */}
                <div className="p-8 bg-white border border-slate-200 rounded-xl hover:border-[#FFAD26] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0096d7]/10 flex items-center justify-center flex-shrink-0 border border-[#0096d7]/20">
                      <svg className="w-6 h-6 text-[#0096d7]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#041b2e] text-lg leading-tight">
                        NIB: Business Registration Number
                      </h4>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed text-justify">
                    National business identification number under the risk-based licensing system (OSS-RBA).
                  </p>
                </div>

                {/* 4. Risk-Based Business Operating Permit */}
                <div className="p-8 bg-white border border-slate-200 rounded-xl hover:border-[#FFAD26] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#041b2e]/5 flex items-center justify-center flex-shrink-0 border border-[#041b2e]/10">
                      <svg className="w-6 h-6 text-[#041b2e]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h2m-6 4h.01M6 16h.01M6 12h.01" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#041b2e] text-lg leading-tight">
                        Risk-Based Business Operating Permit
                      </h4>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed text-justify">
                    Comprehensive risk-based business operating permit from the Indonesian government.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export { AboutLegal };
