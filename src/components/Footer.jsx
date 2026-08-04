import { SmartImage } from './SmartImage';

/* ================================================================
   KOMPONEN 8: FOOTER PERUSAHAAN
   Diperbarui: Hapus Navigasi, Tambah Ikon Sosmed/Kontak interaktif, Alamat Jatinangor
================================================================ */
function Footer({ onOpenLegal }) {
  return (
    <footer className="bg-[#041b2e] text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-grid">
        <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Kolom 1 & 2: Deskripsi Torgas */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <SmartImage src="images/logo/logo.jpeg" alt="Logo Torgas Blue Energy" className="h-10 w-auto rounded-sm" onError={(e)=>{e.target.style.display='none'}}/>
              <span className="font-extrabold text-xl tracking-wider">TORGAS BLUE ENERGY</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed" style={{ textAlign: 'justify' }}>
              Torgas Blue Energy operates an integrated marine research laboratory located in Jatinangor, Sumedang, West Java. We focus on developing autonomous marine monitoring technologies and clean energy solutions based on marine biomass to support the sustainable use of marine resources.
            </p>
          </div>

          {/* Kolom 3: Hubungi Kami (Sosial Media & Kontak) */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-slate-200 mb-5">Hubungi Kami</h4>
            <div className="space-y-4">
              {/* WhatsApp */}
              <a href="https://wa.me/6281776536085" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825.001 6.938 3.113 6.939 6.938-.001 3.825-3.114 6.938-6.939 6.942z"/></svg>
                </div>
                <span className="text-sm font-medium">+62 817-7653-6085</span>
              </a>

              {/* Email */}
              <a href="mailto:torgasblueenergy@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-[#ea4335] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <span className="text-sm font-medium">torgasblueenergy@gmail.com</span>
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/torgas-blue-energy-8400473b8" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-[#0077b5] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <span className="text-sm font-medium">Torgas Blue Energy</span>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/torgasblueenergy?igsh=MWIzc3A2Y2RqNG8zdQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
                <span className="text-sm font-medium">@torgasblueenergy</span>
              </a>
            </div>
          </div>

          {/* Kolom 4: Kontak & Alamat (Fokus Jatinangor) */}
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase text-slate-200 mb-5">Kontak & Alamat</h4>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <p className="font-bold text-sm text-slate-300 mb-1">Laboratorium Terpadu Torgas</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Jatinangor, Kabupaten Sumedang, <br/>Jawa Barat, Indonesia.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Hak Cipta & Links */}
        <div className="pt-8 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-4">
          <div>&copy; 2026 TORGAS BLUE ENERGY. Hak Cipta Dilindungi Undang-Undang.</div>
          <div className="flex gap-6">
            {/* Sebelumnya href="#" (link mati) — kini mengarah ke halaman legal sungguhan */}
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Ketentuan Layanan
            </button>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Kebijakan Privasi
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
