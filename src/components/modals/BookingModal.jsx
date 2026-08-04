import { useState } from 'react';
import { submitForm } from '../../lib/api';
import { LAB_SERVICES } from '../../data/services';

/* ================================================================
   MODALS (BOOKING UJI LAB, INTERNAL FORMS, ADMIN, ARTICLE DETAIL)
================================================================ */
function BookingModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', institution:'', tests:'Field Survey Services', samples:'1', notes:'' });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Mengirim permohonan ke server Torgas...');

    const payload = { action: 'labbook', ...formData };

    const result = await submitForm(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      // Kegagalan kini BENAR-BENAR terdeteksi, bukan disembunyikan seperti sebelumnya
      setStatusMsg('❌ ' + result.message);
      return;
    }

    setStatusMsg('✅ Permohonan berhasil dikirim! Tim Torgas akan menghubungi email/WA Anda.');

    // Tutup modal setelah pengguna sempat membaca pesan sukses

    setTimeout(() => { onClose(); setStatusMsg(''); }, 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
        <h3 className="font-bold text-xl text-[#041b2e] mb-1">Request for Laboratory Sample Testing</h3>
        <p className="text-xs text-slate-500 mb-6">Please fill out the sample testing form below. An official service of Torgas Blue Energy.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input type="text" required className="w-full p-3 border border-slate-200 rounded-lg focus:outline-[#0096d7]" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
              <input type="email" required className="w-full p-3 border border-slate-200 rounded-lg focus:outline-[#0096d7]" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp *</label>
              <input type="tel" required className="w-full p-3 border border-slate-200 rounded-lg focus:outline-[#0096d7]" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institution / University *</label>
              <input type="text" required className="w-full p-3 border border-slate-200 rounded-lg focus:outline-[#0096d7]" value={formData.institution} onChange={e=>setFormData({...formData, institution:e.target.value})}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Test Type *</label>
              <select 
                name="test_type" 
                className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0096d7]"
                required
              >
                <option value="">-- Select the Type of Testing Service --</option>
                {LAB_SERVICES.map((serv) => (
                  <option key={serv.id} value={serv.title}>
                    {serv.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes / Sample Details</label>
            <textarea rows="3" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-[#0096d7]" value={formData.notes} onChange={e=>setFormData({...formData, notes:e.target.value})}></textarea>
          </div>

          {statusMsg && <div className="p-3 bg-blue-50 text-[#0096d7] text-xs font-bold rounded-lg">{statusMsg}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-300 font-bold text-xs">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-orange text-xs py-2.5 px-6">
              {isSubmitting ? 'Sending...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { BookingModal };
