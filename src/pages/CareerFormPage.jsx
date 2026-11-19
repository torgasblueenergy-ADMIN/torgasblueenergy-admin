import { useState } from 'react';
import { SmartImage } from '../components/SmartImage';
import { CvUploadField } from '../components/CvUploadField';
import { submitForm } from '../lib/api';
import { POSISI_LOWONGAN, POSISI_PER_KODE, namaPosisiLengkap, TENGGAT_LOWONGAN } from '../data/lowongan';

/* ================================================================
   HALAMAN FORM LAMARAN KERJA (CAREER)
   ----------------------------------------------------------------
   Dibuat 19 Nov 2026 untuk lowongan Junior Scientist + kontrak
   proyek. Tata letaknya sengaja dibuat sama persis dengan
   PartTimeFormPage supaya pelamar tidak merasa pindah situs.

   Bedanya: ada pilihan posisi yang dilamar, dan kolom Keahlian
   Teknis yang petunjuknya berubah mengikuti posisi terpilih.
================================================================ */
function CareerFormPage({ onBackToMain, posisiAwal = '' }) {
  const [formData, setFormData] = useState({
    positionCode: posisiAwal, fullName: '', email: '', phone: '',
    degree: '', university: '', major: '', graduationYear: '',
    technicalSkills: '', experience: '', expectedSalary: '',
    availableFrom: '', motivation: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState(null); // {name, mimeType, base64} | null

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  /* Posisi terpilih dipakai dua kali: untuk petunjuk keahlian teknis,
     dan untuk mengirim nama posisi lengkap ke backend. */
  const posisiDipilih = POSISI_PER_KODE[formData.positionCode] || null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* CV diwajibkan. Backend tetap menyimpan lamaran tanpa CV supaya
       tidak ada yang hilang diam-diam, tapi dari formulir ini CV
       selalu ikut — lamaran tanpa CV praktis tidak bisa dinilai. */
    if (!cvFile) {
      setStatusMsg('❌ A CV is required. Please choose a PDF file first.');
      return;
    }

    setIsSubmitting(true);
    setStatusMsg('Sending your application...');

    const payload = {
      action: 'career_app',
      ...formData,
      // Nama posisi lengkap ikut dikirim sebagai cadangan, kalau-kalau
      // kode posisi belum dikenali backend (lihat catatan di lowongan.js)
      position: namaPosisiLengkap(formData.positionCode),
      cvFile: { name: cvFile.name, mimeType: cvFile.mimeType, data: cvFile.base64 }
    };

    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Application submitted! Our selection team will review and contact you soon.');
    setTimeout(() => { onBackToMain(); }, 3500);
  };

  const kelasInput = "w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm";
  const kelasLabel = "block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5";

  return (
    <div className="w-full min-h-screen bg-[#f2f7fb] text-[#041b2e] pb-16 relative">

      {/* WATERMARK BACKGROUND (TETAP DIAM DI TEMPAT WALAUPUN DI-SCROLL) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden bg-[#f2f7fb]">
        <SmartImage
          src="images/logo/logo.jpeg"
          alt=""
          aria-hidden="true"
          className="w-[150%] md:w-[90%] max-w-[1000px] object-contain opacity-[0.15] mix-blend-multiply"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* HEADER NAVIGASI KHUSUS */}
      <div className="bg-[#041b2e] text-white py-5 px-6 shadow-md border-b-4 border-[#0096d7] mb-10 sticky top-0 z-50">
        <div className="max-grid flex justify-center items-center">
          <div className="flex items-center gap-3">
            <SmartImage
              src="images/logo/logo.jpeg"
              alt="Logo Torgas Blue Energy"
              eager
              className="h-8 sm:h-10 w-auto object-contain rounded-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-wide text-[#0096d7]">Career Portal</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold text-[#0096d7] uppercase tracking-widest block mb-2 drop-shadow-sm">JOIN THE TORGAS LABORATORY RESEARCH TEAM</span>
          <h1 className="text-3xl font-extrabold text-[#041b2e] mb-2 drop-shadow-sm">Career Application Form</h1>
          <p className="text-slate-600 text-sm font-semibold drop-shadow-sm">
            Apply for one of our Junior Scientist positions or the project-based contract. Application deadline: {TENGGAT_LOWONGAN}.
          </p>
        </div>

        {/* KOTAK FORM: Glassmorphism, aksen biru untuk membedakan dari Part-Time */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10 border-t-4 border-t-[#0096d7]">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── POSISI YANG DILAMAR ─────────────────────────────────── */}
            <div>
              <label className={kelasLabel}>Position Applied For <span className="text-[#0096d7]">*</span></label>
              <select
                name="positionCode" required className={kelasInput + ' text-slate-700'}
                value={formData.positionCode} onChange={handleChange}
              >
                <option value="">Select a position...</option>
                {POSISI_LOWONGAN.map((grup) => (
                  <optgroup key={grup.kelompok} label={grup.kelompok}>
                    {grup.daftar.map((p) => (
                      <option key={p.kode} value={p.kode}>{p.nama} ({p.kode})</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {posisiDipilih && (
                <p className="mt-2 text-xs text-slate-600 bg-[#0096d7]/10 border border-[#0096d7]/25 rounded-lg px-3 py-2">
                  <span className="font-extrabold text-[#041b2e]">{posisiDipilih.kelompok}</span>
                  {' — specific requirement: '}
                  <span className="font-bold">{posisiDipilih.syarat}</span>
                </p>
              )}
            </div>

            {/* ── IDENTITAS ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={kelasLabel}>Full Name <span className="text-[#0096d7]">*</span></label>
                <input type="text" name="fullName" required placeholder="Full legal name, with academic title" className={kelasInput} value={formData.fullName} onChange={handleChange} />
              </div>
              <div>
                <label className={kelasLabel}>Email Address <span className="text-[#0096d7]">*</span></label>
                <input type="email" name="email" required placeholder="email@example.com" className={kelasInput} value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={kelasLabel}>Phone / WhatsApp <span className="text-[#0096d7]">*</span></label>
                <input type="tel" name="phone" required placeholder="+62 8xx-xxxx-xxxx" className={kelasInput} value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <label className={kelasLabel}>Highest Degree <span className="text-[#0096d7]">*</span></label>
                <select name="degree" required className={kelasInput + ' text-slate-700'} value={formData.degree} onChange={handleChange}>
                  <option value="">Select degree...</option>
                  <option value="S1 / Bachelor">S1 / Bachelor</option>
                  <option value="S2 / Master">S2 / Master</option>
                  <option value="S3 / Doctorate">S3 / Doctorate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={kelasLabel}>University <span className="text-[#0096d7]">*</span></label>
                <input type="text" name="university" required placeholder="e.g. Universitas Padjadjaran" className={kelasInput} value={formData.university} onChange={handleChange} />
              </div>
              <div>
                <label className={kelasLabel}>Graduation Year <span className="text-[#0096d7]">*</span></label>
                <input type="text" name="graduationYear" required inputMode="numeric" placeholder="e.g. 2025" className={kelasInput} value={formData.graduationYear} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className={kelasLabel}>Study Programme / Major <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="major" required placeholder="e.g. Marine Science, Chemistry, Environmental Engineering" className={kelasInput} value={formData.major} onChange={handleChange} />
            </div>

            {/* ── KEAHLIAN & PENGALAMAN ───────────────────────────────── */}
            <div>
              <label className={kelasLabel}>Technical Skills <span className="text-[#0096d7]">*</span></label>
              <textarea
                name="technicalSkills" required rows="3"
                placeholder={posisiDipilih
                  ? `Describe your experience with ${posisiDipilih.syarat}, plus any other relevant instruments or software.`
                  : 'Instruments, software, and laboratory or field techniques you have actually used.'}
                className={kelasInput} value={formData.technicalSkills} onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className={kelasLabel}>Research & Work Experience <span className="text-[#0096d7]">*</span></label>
              <textarea name="experience" required rows="4" placeholder="Previous research, publications, internships, or employment relevant to this position..." className={kelasInput} value={formData.experience} onChange={handleChange}></textarea>
            </div>

            <div>
              <label className={kelasLabel}>Why do you want to join Torgas? <span className="text-[#0096d7]">*</span></label>
              <textarea name="motivation" required rows="3" placeholder="Briefly tell us your motivation for applying to this position." className={kelasInput} value={formData.motivation} onChange={handleChange}></textarea>
            </div>

            {/* ── KETERSEDIAAN & GAJI ─────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={kelasLabel}>Available to Start <span className="text-[#0096d7]">*</span></label>
                <input type="date" name="availableFrom" required className={kelasInput + ' text-slate-700'} value={formData.availableFrom} onChange={handleChange} />
              </div>
              <div>
                <label className={kelasLabel}>Expected Salary (IDR / month)</label>
                <input type="text" name="expectedSalary" placeholder="e.g. 6.000.000 — or leave blank" className={kelasInput} value={formData.expectedSalary} onChange={handleChange} />
                {/* Flyer menyebut gaji negotiable, jadi kolom ini sengaja
                    TIDAK diwajibkan — memaksanya akan menyaring pelamar
                    yang belum tahu harus menulis angka berapa. */}
                <p className="mt-1.5 text-[11px] text-slate-500">Optional. Salary is negotiable based on qualifications and experience.</p>
              </div>
            </div>

            <CvUploadField
              label="Upload CV / Resume"
              hint="PDF"
              accept={['.pdf']}
              required
              accentClass="hover:border-[#0096d7]"
              onFileChange={setCvFile}
            />

            {statusMsg && (
              <div className={`p-4 rounded-xl text-sm font-bold text-center ${statusMsg.includes('✅') ? 'bg-emerald-50/90 text-emerald-700 border border-emerald-200' : statusMsg.includes('❌') ? 'bg-red-50/90 text-red-700 border border-red-200' : 'bg-sky-50/90 text-[#0a6fa0] border border-sky-200'}`}>
                {statusMsg}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/60">
              <button type="button" onClick={onBackToMain} className="px-6 py-3 bg-white/90 border border-slate-300 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#0096d7] text-white font-extrabold text-sm rounded-xl hover:bg-[#041b2e] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                {isSubmitting ? 'Sending...' : 'Submit Application →'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export { CareerFormPage };
