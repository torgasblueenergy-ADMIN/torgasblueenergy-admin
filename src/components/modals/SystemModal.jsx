import { useState } from 'react';
import { submitForm } from '../../lib/api';

function SystemModal({ system, onClose }) {
  if (!system) return null;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Mengirim...');
    const payload = { action: system.id, type: system.id, name, email, details };

    const result = await submitForm(payload);
    if (!result.ok) {
      // Versi lama tidak punya .catch sama sekali — kegagalan lolos tanpa jejak
      setStatus('❌ ' + result.message);
      return;
    }
    setStatus('✅ Formulir tersimpan ke database Google Sheet.');
    setTimeout(onClose, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 font-bold text-xl">&times;</button>
        <span className="pill-badge badge-blue mb-2">{system.badge}</span>
        <h3 className="font-bold text-xl text-[#041b2e] mb-4">{system.title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input type="text" required className="w-full p-3 border border-slate-200 rounded-lg" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
            <input type="email" required className="w-full p-3 border border-slate-200 rounded-lg" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Details / Description *</label>
            <textarea rows="4" required className="w-full p-3 border border-slate-200 rounded-lg" value={details} onChange={e=>setDetails(e.target.value)}></textarea>
          </div>
          {status && <div className="text-xs font-bold text-emerald-600">{status}</div>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-slate-300 font-bold text-xs">Cancel</button>
            <button type="submit" className="btn-primary text-xs py-2 px-6">Submit Data</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { SystemModal };
