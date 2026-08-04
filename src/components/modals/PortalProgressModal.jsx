import { useState } from 'react';
import { submitForm } from '../../lib/api';

/* ================================================================
   MODAL FORM: PROGRESS REPORT (Student Portal)
================================================================ */
function PortalProgressModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    fullName: '', email: '', supervisor: '', reportDate: '', accomplishments: '', plan: '', obstacles: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Submitting progress report...');
    const payload = { action: 'portal_progress', ...formData };
    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      // Kegagalan kini BENAR-BENAR terdeteksi, bukan disembunyikan seperti sebelumnya
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Progress report submitted successfully!');

    // Tutup modal setelah pengguna sempat membaca pesan sukses

    setTimeout(() => { onClose(); setStatusMsg(''); }, 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box !max-w-2xl !p-0 flex flex-col bg-[#f8fafc] max-h-[95vh] sm:max-h-[90vh]">
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <h3 className="font-bold text-lg text-[#041b2e]">Weekly Progress Report</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 tracking-widest hidden sm:inline-block">WEEKLY</span>
            <button onClick={onClose} className="text-slate-400 hover:text-[#041b2e] font-bold text-2xl leading-none transition-colors">&times;</button>
          </div>
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-5 pb-2">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Full Name <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="fullName" required placeholder="Your full name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.fullName} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Email Address <span className="text-[#0096d7]">*</span></label>
              <input type="email" name="email" required placeholder="email@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Supervisor / Advisor <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="supervisor" required placeholder="Dr. / Prof. name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.supervisor} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Report Week (Friday Date) <span className="text-[#0096d7]">*</span></label>
              <input type="date" name="reportDate" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.reportDate} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Accomplishments This Week <span className="text-[#0096d7]">*</span></label>
              <textarea name="accomplishments" required rows="3" placeholder="What did you accomplish this week?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.accomplishments} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Plan For Next Week <span className="text-[#0096d7]">*</span></label>
              <textarea name="plan" required rows="3" placeholder="What are your plans for next week?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.plan} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Obstacles / Issues</label>
              <textarea name="obstacles" rows="2" placeholder="Any problems or blockers?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.obstacles} onChange={handleChange}></textarea>
            </div>
            {statusMsg && <div className={`p-3 rounded-lg text-sm font-bold text-center ${statusMsg.includes('✅') ? 'bg-emerald-50 text-emerald-600' : statusMsg.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0096d7]'}`}>{statusMsg}</div>}
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white font-bold text-xs hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-colors">{isSubmitting ? 'Submitting...' : 'Submit Report'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { PortalProgressModal };
