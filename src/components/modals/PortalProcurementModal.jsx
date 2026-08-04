import { useState } from 'react';
import { submitForm } from '../../lib/api';

/* ================================================================
   MODAL FORM: PROCUREMENT / RAB (Student Portal)
   Diperbarui: Menghapus kolom "Department / Unit" agar lebih simpel
================================================================ */
function PortalProcurementModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  // State "department" sudah dihapus dari formData
  const [formData, setFormData] = useState({
    requesterName: '', email: '', role: '', submissionDate: '', requiredBy: '', purpose: '', items: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Submitting procurement request...');
    const payload = { action: 'portal_procurement', ...formData };
    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      // Kegagalan kini BENAR-BENAR terdeteksi, bukan disembunyikan seperti sebelumnya
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Procurement request submitted successfully!');

    // Tutup modal setelah pengguna sempat membaca pesan sukses

    setTimeout(() => { onClose(); setStatusMsg(''); }, 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box !max-w-2xl !p-0 flex flex-col bg-[#f8fafc] max-h-[95vh] sm:max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
            <h3 className="font-bold text-lg text-[#041b2e]">Procurement Request: Materials & Supplies</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 tracking-widest hidden sm:inline-block">WEEKLY</span>
            <button onClick={onClose} className="text-slate-400 hover:text-[#041b2e] font-bold text-2xl leading-none transition-colors">&times;</button>
          </div>
        </div>

        {/* Isi Form */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-5 pb-2">
            
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Requester Name <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="requesterName" required placeholder="Your full name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.requesterName} onChange={handleChange} />
            </div>
            
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Email Address <span className="text-[#0096d7]">*</span></label>
              <input type="email" name="email" required placeholder="email@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.email} onChange={handleChange} />
            </div>
            
            {/* Position/Role sekarang melebar penuh karena Department dihapus */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Position / Role <span className="text-[#0096d7]">*</span></label>
              <input type="text" name="role" required placeholder="e.g. Research Intern, Lab Technician" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.role} onChange={handleChange} />
            </div>
            
            {/* Tanggal (Tetap 2 Kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Submission Date <span className="text-[#0096d7]">*</span></label>
                <input type="date" name="submissionDate" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.submissionDate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Required By (Latest) <span className="text-[#0096d7]">*</span></label>
                <input type="date" name="requiredBy" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.requiredBy} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Purpose / Brief Description <span className="text-[#0096d7]">*</span></label>
              <textarea name="purpose" required rows="3" placeholder="Describe the purpose of this procurement request..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.purpose} onChange={handleChange}></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">List of Items / Materials Requested <span className="text-[#0096d7]">*</span></label>
              <textarea name="items" required rows="4" placeholder="1. Item name - Quantity - Estimated Price&#10;2. Item name - Quantity - Estimated Price" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors font-mono" value={formData.items} onChange={handleChange}></textarea>
            </div>

            {statusMsg && <div className={`p-3 rounded-lg text-sm font-bold text-center ${statusMsg.includes('✅') ? 'bg-emerald-50 text-emerald-600' : statusMsg.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0096d7]'}`}>{statusMsg}</div>}
            
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white font-bold text-xs hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-orange text-xs py-2.5 px-6 rounded-lg">{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export { PortalProcurementModal };
