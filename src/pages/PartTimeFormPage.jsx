import { useState } from 'react';
import { SmartImage } from '../components/SmartImage';
import { CvUploadField } from '../components/CvUploadField';
import { submitForm } from '../lib/api';

/* ================================================================
   HALAMAN KHUSUS FORM PENDAFTARAN PART-TIME
   Diperbarui: Logo Watermark Jelas & Form Kaca Tembus Pandang
================================================================ */
function PartTimeFormPage({ onBackToMain }) {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', currentInstitution: '', 
    major: '', availableHours: '', experience: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState(null); // {name, mimeType, base64} | null

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Di formulir ini CV ditandai WAJIB (*). Sebelumnya tanda itu hanya
       hiasan — tidak divalidasi dan filenya pun tidak pernah dikirim. */
    if (!cvFile) {
      setStatusMsg('❌ CV wajib dilampirkan. Silakan pilih berkas PDF terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    setStatusMsg('Sending your application...');

    const payload = {
      action: 'part_time_app',
      ...formData,
      cvFileName: cvFile.name,
      cvMimeType: cvFile.mimeType,
      cvBase64: cvFile.base64
    };

    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      // Kegagalan kini BENAR-BENAR terdeteksi, bukan disembunyikan seperti sebelumnya
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Application submitted! Our HR team will review and contact you soon.');
      setTimeout(() => { onBackToMain(); }, 3500); 
  };

  return (
    <div className="w-full min-h-screen bg-[#f2f7fb] text-[#041b2e] pb-16 relative">
      
      {/* WATERMARK BACKGROUND (TETAP DIAM DI TEMPAT WALAUPUN DI-SCROLL) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden bg-[#f2f7fb]">
        <SmartImage
          src="images/logo/logo.jpeg"
          alt=""
          aria-hidden="true"
          /* Ukuran raksasa & opacity 15% agar jelas terlihat */
          className="w-[150%] md:w-[90%] max-w-[1000px] object-contain opacity-[0.15] mix-blend-multiply" 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* HEADER NAVIGASI KHUSUS */}
      <div className="bg-[#041b2e] text-white py-5 px-6 shadow-md border-b-4 border-[#FFAD26] mb-10 sticky top-0 z-50">
        <div className="max-grid flex justify-center items-center">
          <div className="flex items-center gap-3">
            <SmartImage
              src="images/logo/logo.jpeg"
              alt="Logo Torgas Blue Energy"
              eager
              className="h-8 sm:h-10 w-auto object-contain rounded-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-wide text-[#FFAD26]">Part-Time Job Portal</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold text-[#FFAD26] uppercase tracking-widest block mb-2 drop-shadow-sm">JOIN AS A RESEARCH ASSISTANT / STAFF</span>
          <h1 className="text-3xl font-extrabold text-[#041b2e] mb-2 drop-shadow-sm">Part-Time Application Form</h1>
          <p className="text-slate-600 text-sm font-semibold drop-shadow-sm">Apply to join Torgas Blue Energy as a part-time laboratory assistant, data analyst, or field surveyor.</p>
        </div>

        {/* KOTAK FORM: Glassmorphism (bg-white/60 & backdrop-blur-xl) */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10 border-t-4 border-t-[#FFAD26]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Full Name <span className="text-[#d97706]">*</span></label>
                <input type="text" name="fullName" required placeholder="Full legal name" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#FFAD26] focus:ring-1 focus:ring-[#FFAD26] outline-none text-sm transition-all shadow-sm" value={formData.fullName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Email Address <span className="text-[#d97706]">*</span></label>
                <input type="email" name="email" required placeholder="email@example.com" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#FFAD26] focus:ring-1 focus:ring-[#FFAD26] outline-none text-sm transition-all shadow-sm" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Phone / WhatsApp <span className="text-[#d97706]">*</span></label>
                <input type="tel" name="phone" required placeholder="+62 8xx-xxxx-xxxx" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#FFAD26] focus:ring-1 focus:ring-[#FFAD26] outline-none text-sm transition-all shadow-sm" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Current Institution / Univ.</label>
                <input type="text" name="currentInstitution" placeholder="e.g. Universitas Padjadjaran" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#FFAD26] focus:ring-1 focus:ring-[#FFAD26] outline-none text-sm transition-all shadow-sm" value={formData.currentInstitution} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Available Hours / Week <span className="text-[#d97706]">*</span></label>
                <select name="availableHours" required className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#FFAD26] focus:ring-1 focus:ring-[#FFAD26] outline-none text-sm transition-all shadow-sm text-slate-700" value={formData.availableHours} onChange={handleChange}>
                  <option value="">Select availability...</option>
                  <option value="10-15 Hours">10 - 15 Hours / Week</option>
                  <option value="15-20 Hours">15 - 20 Hours / Week</option>
                  <option value="20+ Hours">More than 20 Hours / Week</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Major / Area of Expertise <span className="text-[#d97706]">*</span></label>
                <input type="text" name="major" required placeholder="e.g. Marine Science, Chemistry, GIS" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#FFAD26] focus:ring-1 focus:ring-[#FFAD26] outline-none text-sm transition-all shadow-sm" value={formData.major} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Relevant Experience & Skills <span className="text-[#d97706]">*</span></label>
              <textarea name="experience" required rows="4" placeholder="Briefly describe your lab skills, software skills (e.g., ArcGIS, Python), or field experience..." className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#FFAD26] focus:ring-1 focus:ring-[#FFAD26] outline-none text-sm transition-all shadow-sm" value={formData.experience} onChange={handleChange}></textarea>
            </div>

            <CvUploadField
              label="Upload CV / Resume"
              hint="PDF"
              accept={['.pdf']}
              required
              accentClass="hover:border-[#FFAD26]"
              onFileChange={setCvFile}
            />

            {statusMsg && (
              <div className={`p-4 rounded-xl text-sm font-bold text-center ${statusMsg.includes('✅') ? 'bg-emerald-50/90 text-emerald-700 border border-emerald-200' : statusMsg.includes('❌') ? 'bg-red-50/90 text-red-700 border border-red-200' : 'bg-orange-50/90 text-[#d97706] border border-orange-200'}`}>
                {statusMsg}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/60">
              <button type="button" onClick={onBackToMain} className="px-6 py-3 bg-white/90 border border-slate-300 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#FFAD26] text-[#041b2e] font-extrabold text-sm rounded-xl hover:bg-[#e69500] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                {isSubmitting ? 'Sending...' : 'Apply Now →'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export { PartTimeFormPage };
