import { useState } from 'react';
import { submitForm } from '../../lib/api';

/* ================================================================
   MODAL FORM: BOOKING LAB & EQUIPMENT (Student Portal)
   Diperbarui: Fix tombol terpotong (Scrollable Form Body)
================================================================ */
function PortalBookingModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', date: '', startTime: '', endTime: '', 
    equipment: '', purpose: '', notes: ''
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Submitting booking request...');

    const payload = { action: 'portal_booking', ...formData };

    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      // Kegagalan kini BENAR-BENAR terdeteksi, bukan disembunyikan seperti sebelumnya
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Booking request submitted successfully!');

    // Tutup modal setelah pengguna sempat membaca pesan sukses

    setTimeout(() => { onClose(); setStatusMsg(''); }, 2500);
  };

  return (
    <div className="modal-overlay">
      {/* 
        KOREKSI: 
        Ditambahkan 'flex flex-col max-h-[90vh]' agar kontainer menyesuaikan tinggi layar,
        serta membiarkan isinya (body) bisa di-scroll.
      */}
      <div className="modal-box !max-w-2xl !p-0 flex flex-col bg-[#f8fafc] max-h-[95vh] sm:max-h-[90vh]">
        
        {/* Header Modal (Dibuat flex-shrink-0 agar tidak ikut ter-scroll) */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#0096d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <h3 className="font-bold text-lg text-[#041b2e]">Booking Lab & Equipment</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 tracking-widest hidden sm:inline-block">SCHEDULED</span>
            <button onClick={onClose} className="text-slate-400 hover:text-[#041b2e] font-bold text-2xl leading-none transition-colors">&times;</button>
          </div>
        </div>

        {/* Form Body (Dibuat overflow-y-auto agar bisa di-scroll dengan aman) */}
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
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">WhatsApp Number <span className="text-[#0096d7]">*</span></label>
              <input type="tel" name="phone" required placeholder="08xx-xxxx-xxxx" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.phone} onChange={handleChange} />
              <p className="text-[11px] text-slate-400 mt-1">We will send a confirmation to this number.</p>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Booking Date <span className="text-[#0096d7]">*</span></label>
              <input type="date" name="date" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.date} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Start Time <span className="text-[#0096d7]">*</span></label>
                <input type="time" name="startTime" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.startTime} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">End Time <span className="text-[#0096d7]">*</span></label>
                <input type="time" name="endTime" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.endTime} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Room / Equipment <span className="text-[#0096d7]">*</span></label>
              <select name="equipment" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors text-slate-700" value={formData.equipment} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Lab Jatinangor - Main Room">Lab Jatinangor - Main Room</option>
                <option value="Lab Pangandaran - Wet Lab">Lab Pangandaran - Wet Lab</option>
                <option value="Biosentor USV Unit">Biosentor USV Unit</option>
                <option value="Water Quality Spectrometer">Water Quality Spectrometer</option>
                <option value="Microscope & Centrifuge Set">Microscope & Centrifuge Set</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Purpose / Research Activity <span className="text-[#0096d7]">*</span></label>
              <textarea name="purpose" required rows="3" placeholder="Describe what you will be doing..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.purpose} onChange={handleChange}></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Additional Notes</label>
              <textarea name="notes" rows="2" placeholder="Any specific requirements (optional)..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-[#0096d7] text-sm transition-colors" value={formData.notes} onChange={handleChange}></textarea>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-lg text-sm font-bold text-center ${statusMsg.includes('✅') ? 'bg-emerald-50 text-emerald-600' : statusMsg.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0096d7]'}`}>
                {statusMsg}
              </div>
            )}

            {/* Area Tombol dengan jarak aman di bawahnya */}
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white font-bold text-xs hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary text-xs py-2.5 px-6 rounded-lg">
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export { PortalBookingModal };
