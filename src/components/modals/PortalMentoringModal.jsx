import { useState } from 'react';
import { submitForm } from '../../lib/api';

/* ================================================================
   MODAL FORM: MENTORING REQUEST (Student Portal)
================================================================ */
function PortalMentoringModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    studentName: '', email: '', phone: '', supervisor: '', preferredDate: '', preferredTime: '', topic: '', notes: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Submitting mentoring request...');
    const payload = { action: 'portal_mentoring', ...formData };
    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      // Kegagalan kini BENAR-BENAR terdeteksi, bukan disembunyikan seperti sebelumnya
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Mentoring request submitted successfully!');

    // Tutup modal setelah pengguna sempat membaca pesan sukses

    setTimeout(() => { onClose(); setStatusMsg(''); }, 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box !max-w-2xl !p-0 flex flex-col bg-[#f8fafc] max-h-[95vh] sm:max-h-[90vh]">
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#0096d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <h3 className="font-bold text-lg text-[#041b2e]">Mentoring Request</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 tracking-widest hidden sm:inline-block">SCHEDULED</span>
            <button onClick={onClose} className="text-slate-400 hover:text-[#041b2e] font-bold text-2xl leading-none transition-colors">&times;</button>
          </div>
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-5 pb-2">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Student Name <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="studentName" required placeholder="Your full name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.studentName} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Email Address <span className="text-[#0096d7]">*</span></label>
              <input type="email" name="email" required placeholder="email@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">WhatsApp Number <span className="text-[#0096d7]">*</span></label>
              <input type="tel" name="phone" required placeholder="08xx-xxxx-xxxx" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.phone} onChange={handleChange} />
              <p className="text-[11px] text-slate-400 mt-1">We will send a confirmation to this number.</p>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Supervisor <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="supervisor" required placeholder="Supervisor full name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.supervisor} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Preferred Date <span className="text-[#0096d7]">*</span></label>
                <input type="date" name="preferredDate" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.preferredDate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Preferred Time <span className="text-[#0096d7]">*</span></label>
                <input type="time" name="preferredTime" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.preferredTime} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Topic / Agenda <span className="text-[#0096d7]">*</span></label>
              <textarea name="topic" required rows="3" placeholder="What topics do you want to discuss?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.topic} onChange={handleChange}></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Additional Notes</label>
              <textarea name="notes" rows="2" placeholder="Any preparation required?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.notes} onChange={handleChange}></textarea>
            </div>
            {statusMsg && <div className={`p-3 rounded-lg text-sm font-bold text-center ${statusMsg.includes('✅') ? 'bg-emerald-50 text-emerald-600' : statusMsg.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0096d7]'}`}>{statusMsg}</div>}
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white font-bold text-xs hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary text-xs py-2.5 px-6 rounded-lg">{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { PortalMentoringModal };
