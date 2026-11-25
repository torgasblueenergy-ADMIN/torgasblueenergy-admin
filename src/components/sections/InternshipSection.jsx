import { SmartImage } from '../SmartImage';
import { pendaftaranDitutup } from '../../data/lowongan';

/* ================================================================
   KOMPONEN 9: INTERNSHIP, CAREER & PART-TIME SECTION
   Diperbarui: Tombol presisi ukuran sama & Ikon Two-Tone Profesional
================================================================ */
function InternshipSection({ onOpenInternshipForm, onOpenPartTimeForm, onOpenCareerForm }) {
  /* Dihitung sekali saat bagian ini dirender. Tidak perlu diperbarui
     berkala seperti di halaman formulir: pengunjung beranda yang
     menekan tombol ini akan dibawa ke halaman Career, dan halaman
     itulah yang memeriksa ulang serta menjelaskan penutupannya. */
  const careerDitutup = pendaftaranDitutup();

  return (
    <section id="internship" className="section-band bg-[#041b2e] py-20 md:py-28 relative overflow-hidden">
      
      {/* Ornamen Latar Belakang Geometris */}
      <div className="absolute top-0 right-0 w-2/3 lg:w-1/2 h-full bg-[#0096d7]/10 skew-x-12 transform origin-top-right"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-[#FFAD26]/10 rounded-full blur-3xl"></div>
      
      <div className="max-grid relative z-10">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* ────────────────────────────────────────────────────────────────
              DUA KOLOM LAGI — 19 Nov 2026

              Riwayat: 4 Agu 2026 poster magang diturunkan dan bagian ini
              dijadikan satu kolom. Sekarang kembali dua kolom atas
              permintaan Mahdan, tapi isinya FLYER LOWONGAN, bukan poster
              magang yang dulu — dan posisinya di KIRI teks, kebalikan
              dari tata letak lama.

              Di layar kecil flyer tampil DI ATAS teks (grid satu kolom,
              flyer lebih dulu). Itu disengaja: flyer inilah yang menarik
              perhatian, dan menaruhnya di bawah tombol berarti hampir
              tidak ada yang melihatnya di ponsel.

              Flyer memakai object-contain, bukan object-cover. Rasionya
              9:16 sedangkan kolom ini jauh lebih pendek — dengan cover,
              yang tersisa hanya potongan tengah dan tulisan "WE ARE
              HIRING" ikut terpotong.
          ──────────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">

            {/* KOLOM KIRI: Flyer Lowongan */}
            <div className="order-1 bg-[#02121f] flex items-center justify-center p-6 sm:p-8 lg:p-10">
              <SmartImage
                src="images/activities/hiring-2026-11-flyer.jpg"
                alt="We Are Hiring: 7 Junior Scientist positions and 1 project-based contract at Torgas Laboratory. Application deadline 25 November 2026."
                className="w-full max-w-sm lg:max-w-none max-h-[560px] lg:max-h-[640px] object-contain rounded-2xl shadow-2xl"
                /* Kalau berkasnya hilang, kolom ini dikosongkan saja —
                   lebih baik daripada ikon gambar rusak di samping teks. */
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* KOLOM KANAN: Teks & Tombol Pendaftaran */}
            <div className="order-2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center w-full">
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

                {/* ── Tombol 2: Career (19 Nov 2026) ──────────────────────
                    Diletakkan tepat setelah Internship atas permintaan
                    Mahdan. Dibuat PALING menonjol dari ketiganya (isi
                    penuh, bukan garis tepi) karena inilah yang sedang
                    dikampanyekan lewat flyer "We Are Hiring". */}
                <button
                  onClick={onOpenCareerForm}
                  className={careerDitutup
                    ? "w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/25 text-slate-300 font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm uppercase tracking-wider group"
                    : "w-full px-6 py-4 bg-[#FFAD26] hover:bg-white text-[#041b2e] font-extrabold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,173,38,0.35)] hover:shadow-lg flex items-center justify-center gap-3 text-sm uppercase tracking-wider group"}
                >
                  {/* Ikon Two-Tone: Lencana / Identitas Pegawai */}
                  <svg className="w-5 h-5 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V7Z" fill="currentColor" fillOpacity="0.25"/>
                    <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 2V5M15 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 16C6 14.8954 7.34315 14 9 14C10.6569 14 12 14.8954 12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15 11H18M15 15H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Career — We Are Hiring
                </button>

                {/* Tombol 3: Part-Time */}
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

          </div>

        </div>
      </div>
    </section>
  );
}

export { InternshipSection };
