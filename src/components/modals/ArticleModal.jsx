import { SmartImage } from '../SmartImage';

/* ================================================================
   MODAL POP-UP ARTIKEL & BERITA (LANGSUNG KONTEN LENGKAP)
   Diperbarui: Menghapus keterangan "Author / Penulis" di dalam Pop-up
================================================================ */
function ArticleModal({ article, onClose }) {
  if (!article) return null;

  const adaVideo = Boolean(article.youtubeId || article.driveId);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-[#041b2e]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative">
        
        {/* BAGIAN ATAS — pemutar video bila ada, selain itu gambar sampul biasa.
            Dua sumber didukung: YouTube dan berkas video di Google Drive. */}
        <div className={`relative w-full flex-shrink-0 overflow-hidden bg-slate-100 ${
          adaVideo ? 'aspect-video' : 'h-56 sm:h-72 md:h-80'
        }`}>
          {article.youtubeId ? (
            /* iframe hanya dibuat saat modal terbuka, jadi tidak membebani
               pemuatan halaman. youtube-nocookie = tanpa cookie pelacak. */
            <iframe
              className="w-full h-full border-0"
              src={`https://www.youtube-nocookie.com/embed/${article.youtubeId}?rel=0&modestbranding=1`}
              title={article.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : article.driveId ? (
            /* Pemutar bawaan Google Drive.
               ⚠️ Berkasnya HARUS dibagikan "Siapa saja yang memiliki link".
               Kalau masih terbatas, kotak ini muncul kosong bagi pengunjung
               walau pengurus melihatnya normal — sebab pengurus sudah login
               ke Drive yang bersangkutan. */
            <iframe
              className="w-full h-full border-0"
              src={`https://drive.google.com/file/d/${article.driveId}/preview`}
              title={article.title}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <SmartImage
                src={article.image}
                alt={article.title}
                onError={(e) => {
                  // Fallback ke gambar yang DIPASTIKAN ada (sebelumnya menunjuk file yang hilang)
                  e.target.onerror = null;
                  e.target.src = "images/Homepage/Homepage-1.jpg";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

              {/* Badge Kategori — disembunyikan pada video agar tidak menutupi kontrol pemutar */}
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-md border ${
                  article.category === 'artikel-ilmiah'
                    ? 'bg-[#0096d7]/90 text-white border-[#0096d7]'
                    : 'bg-[#FFAD26]/90 text-[#041b2e] border-[#FFAD26]'
                }`}>
                  {article.categoryLabel || (article.category === 'artikel-ilmiah' ? 'Scientific Articles' : 'News')}
                </span>
              </div>

              {/* Tombol Tutup (X) — pada video dipindah ke luar agar tidak menghalangi */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-[#041b2e] text-white transition-all duration-300 flex items-center justify-center font-bold text-lg cursor-pointer backdrop-blur-md border border-white/20 shadow-lg"
                title="Close"
              >
                ✕
              </button>
            </>
          )}
        </div>

        {/* Tombol tutup khusus mode video — di luar iframe supaya tetap bisa diklik */}
        {adaVideo && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-[#041b2e]/80 hover:bg-[#041b2e] text-white transition-all duration-300 flex items-center justify-center font-bold text-lg cursor-pointer border border-white/20 shadow-lg"
            title="Close"
          >
            ✕
          </button>
        )}

        {/* ISI BERITA & KONTEN LENGKAP */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-4">
          
          {/* Meta Tanggal (Keterangan Penulis Dihapus) */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            <span>📅 {article.date}</span>
          </div>

          {/* Judul Berita */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#041b2e] leading-snug">
            {article.title}
          </h2>

          {/* DOI — tautan resmi ke artikel aslinya, tepat di bawah judul.
              Hanya muncul bila kolomnya diisi; artikel tanpa DOI tidak
              menyisakan ruang kosong. */}
          {article.doi && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 max-w-full px-3 py-1.5 rounded-lg bg-[#0096d7]/10 hover:bg-[#0096d7]/20 border border-[#0096d7]/30 text-[#0096d7] transition-colors group/doi"
              title="Open the published article"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest flex-shrink-0">DOI</span>
              <span className="text-xs font-semibold break-all">{article.doi}</span>
              <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-60 group-hover/doi:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}

          {/* Garis Aksen Emas */}
          <div className="w-16 h-1 bg-[#FFAD26] rounded-full"></div>

          {/* Langsung Konten Lengkap Artikel */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify space-y-4 pt-2 whitespace-pre-line font-medium">
            {article.content || "Full content for this article is not available yet."}
          </div>

        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 flex-shrink-0">
          {/* "PT" dihapus atas permintaan Mahdan (13 Agu 2026) — nama yang
              dipakai di seluruh situs adalah "Torgas Blue Energy".
              "PUBLIKASI" diganti label kategori dalam bahasa Inggris, agar
              tidak ada lagi satu kata Indonesia tersisa di situs ini. */}
          <span className="font-semibold hidden sm:inline uppercase tracking-wider">
            TORGAS BLUE ENERGY • {article.categoryLabel || 'PUBLICATION'}
          </span>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#041b2e] hover:bg-[#0096d7] text-white font-extrabold rounded-xl transition-all duration-300 cursor-pointer shadow-sm text-xs uppercase tracking-wider ml-auto"
          >
            Close Article
          </button>
        </div>

      </div>
    </div>
  );
}

export { ArticleModal };
