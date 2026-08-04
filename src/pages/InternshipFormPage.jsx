import { useState } from 'react';
import { SmartImage } from '../components/SmartImage';
import { CvUploadField } from '../components/CvUploadField';
import { submitForm } from '../lib/api';

/* ================================================================
   HALAMAN KHUSUS FORM PENDAFTARAN MAGANG (INTERNSHIP)
   Diperbarui: Logo Watermark Jelas & Form Kaca Tembus Pandang
================================================================ */
function InternshipFormPage({ onBackToMain }) {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', nim: '', university: '', 
    studyProgram: '', supervisor: '', researchTopic: '', 
    startDate: '', duration: '', motivation: '', gpa: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState(null); // {name, mimeType, base64} | null

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Mengirim data pendaftaran...');

    /* CV ikut dikirim sebagai base64. Apps Script yang menyimpannya
       ke folder Drive. Kalau pelamar tidak melampirkan, ketiga field
       ini dikirim kosong dan Apps Script cukup melewatinya. */
    const payload = {
      action: 'internship',
      ...formData,
      cvFileName: cvFile?.name || '',
      cvMimeType: cvFile?.mimeType || '',
      cvBase64: cvFile?.base64 || ''
    };

    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      // Kegagalan kini BENAR-BENAR terdeteksi, bukan disembunyikan seperti sebelumnya
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Pendaftaran berhasil dikirim! Tim Torgas akan memproses dan menghubungi Anda segera.');
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
            <span className="text-lg sm:text-xl font-extrabold tracking-wide">Internship Admission Portal</span>
          </div>
        </div>
      </div>

      {/* AREA FORMULIR UTAMA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-[#041b2e] mb-2 drop-shadow-sm">Internship Application Form</h1>
          <p className="text-slate-600 text-sm font-semibold drop-shadow-sm">Please fill out this form to apply for our internship program at Torgas Blue Energy.</p>
        </div>

        {/* KOTAK FORM: Glassmorphism (bg-white/60 & backdrop-blur-xl) */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input fields tetap dibuat bg-white/90 agar teks yang diketik tidak ikut transparan */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Full Name <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="fullName" required placeholder="Full name as on student ID" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.fullName} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Email Address <span className="text-[#0096d7]">*</span></label>
              <input type="email" name="email" required placeholder="email@example.com" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.email} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Phone / WhatsApp <span className="text-[#0096d7]">*</span></label>
              <input type="tel" name="phone" required placeholder="+62 8xx-xxxx-xxxx" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Student ID (NIM) <span className="text-[#0096d7]">*</span></label>
                <input type="text" name="nim" required placeholder="e.g. 140310200001" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.nim} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">University / Institution <span className="text-[#0096d7]">*</span></label>
                <input type="text" name="university" required placeholder="e.g. Universitas Padjadjaran" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.university} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Study Program <span className="text-[#0096d7]">*</span></label>
                <input type="text" name="studyProgram" required placeholder="e.g. Marine Science, Geophysics" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.studyProgram} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Academic Supervisor (Optional)</label>
                <input type="text" name="supervisor" placeholder="Supervisor from your university" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.supervisor} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Research Topic / Area of Interest <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="researchTopic" required placeholder="Proposed thesis or internship topic" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.researchTopic} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Planned Start Date <span className="text-[#0096d7]">*</span></label>
                <input type="date" name="startDate" required className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm text-slate-700" value={formData.startDate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Duration <span className="text-[#0096d7]">*</span></label>
                <select name="duration" required className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm text-slate-700" value={formData.duration} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="1 Bulan">1 Month</option>
                  <option value="2 Bulan">2 Months</option>
                  <option value="3 Bulan">3 Months</option>
                  <option value="6 Bulan">6 Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Motivation & Background <span className="text-[#0096d7]">*</span></label>
              <textarea name="motivation" required rows="4" placeholder="Tell us your motivation for joining and how it relates to Torgas Blue Energy research..." className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.motivation} onChange={handleChange}></textarea>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">Latest GPA (Optional)</label>
              <input type="text" name="gpa" placeholder="e.g. 3.75 / 4.00" className="w-full p-3 bg-white/90 border border-slate-200/80 rounded-xl focus:border-[#0096d7] focus:ring-1 focus:ring-[#0096d7] outline-none text-sm transition-all shadow-sm" value={formData.gpa} onChange={handleChange} />
            </div>

            <CvUploadField
              label="Upload Your Resume"
              hint="PDF / DOC / DOCX"
              accept={['.pdf', '.doc', '.docx']}
              accentClass="hover:border-[#0096d7]"
              onFileChange={setCvFile}
            />

            {statusMsg && (
              <div className={`p-4 rounded-xl text-sm font-bold text-center ${statusMsg.includes('✅') ? 'bg-emerald-50/90 text-emerald-700 border border-emerald-200' : statusMsg.includes('❌') ? 'bg-red-50/90 text-red-700 border border-red-200' : 'bg-blue-50/90 text-[#0096d7] border border-blue-200'}`}>
                {statusMsg}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/60">
              <button type="button" onClick={onBackToMain} className="px-6 py-3 bg-white/90 border border-[#0096d7] text-[#0096d7] font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#0096d7] text-white font-extrabold text-sm rounded-xl hover:bg-[#041b2e] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                {isSubmitting ? 'Submitting...' : 'Submit →'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export { InternshipFormPage };
