import { SmartImage } from '../components/SmartImage';
import { LEGAL_CONTENT, LEGAL_UPDATED } from '../data/legal';

function LegalPage({ type, onBackToMain }) {
  const data = LEGAL_CONTENT[type];
  if (!data) return null;

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
            <span className="text-lg sm:text-xl font-extrabold tracking-wide hidden sm:inline-block">{data.title}</span>
          </div>
          <button
            onClick={onBackToMain}
            className="btn-outline border-white text-white hover:bg-white hover:text-[#041b2e] text-xs py-2 px-5 flex items-center gap-2"
          >
            ← Back to the Home Page
          </button>
        </div>
      </div>

      <main className="max-grid px-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#041b2e] mb-3">{data.title}</h1>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#0096d7] mb-6">
            Terakhir diperbarui: {LEGAL_UPDATED}
          </p>

          {/* Peringatan draft — hapus setelah ditinjau penasihat hukum */}
          <div className="bg-[#FFAD26]/10 border-l-4 border-[#FFAD26] rounded-r-xl p-4 mb-8">
            <p className="text-sm text-[#041b2e]">
              <b>Draft document.</b> This text still needs review by legal counsel before it can be treated as official.
            </p>
          </div>

          <p className="text-base text-slate-600 leading-relaxed mb-10">{data.intro}</p>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
            {data.sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#041b2e] mb-3">{s.h}</h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{s.p}</p>
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((item, j) => (
                      <li key={j} className="flex gap-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                        <span className="text-[#0096d7] font-bold flex-shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.after && <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">{s.after}</p>}
              </section>
            ))}

            <section className="border-t border-slate-200 pt-8">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#041b2e] mb-3">Contact Us</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Questions about this page can be sent to{' '}
                <a href="mailto:torgasblueenergy@gmail.com" className="text-[#0096d7] font-bold hover:underline">
                  torgasblueenergy@gmail.com
                </a>{' '}
                or WhatsApp{' '}
                <a href="https://wa.me/6285111044226" target="_blank" rel="noopener noreferrer" className="text-[#0096d7] font-bold hover:underline">
                  +62 851-1104-4226
                </a>.
              </p>
              <p className="text-sm text-slate-500 mt-3">
                Torgas Blue Energy Integrated Laboratory — Jatinangor, Sumedang, West Java.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export { LegalPage };
