import { useState } from 'react';
import { STUDENT_PORTAL_CODE } from '../../config';

/* ================================================================
   MODAL VERIFIKASI KODE STUDENT PORTAL
================================================================ */
function StudentCodeModal({ isOpen, onClose, onSuccessAccess }) {
  if (!isOpen) return null;
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    /* ⚠️ CATATAN KEAMANAN
       Kode ini tersimpan di sisi klien, jadi siapa pun bisa membacanya lewat
       "View Source". Ini hanya cocok sebagai pembatas ringan untuk konten yang
       TIDAK sensitif. Jika portal berisi data pribadi mahasiswa, pindahkan
       verifikasi ke sisi server (Google Apps Script).
       Kode lemah "1234" sudah dihapus karena bisa ditebak sekali coba. */
    if (code.trim().toUpperCase() === STUDENT_PORTAL_CODE) {
      setErrorMsg('');
      setCode('');
      onSuccessAccess();
    } else {
      // Jangan bocorkan kode yang benar di pesan error
      setErrorMsg('❌ Incorrect access code. Please check it again or contact the admin.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-md">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#0096d7]/10 text-[#0096d7] rounded-full flex items-center justify-center text-2xl mx-auto mb-3 font-bold">
            🎓
          </div>
          <h3 className="font-bold text-xl text-[#041b2e]">Student Portal Access</h3>
          <p className="text-xs text-slate-500 mt-1">Enter the access code issued to Torgas thesis and research students.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student Access Code *</label>
            <input 
              type="password" 
              required 
              placeholder="Enter your code..." 
              className="w-full p-3 border border-slate-200 rounded-lg text-center font-mono font-bold tracking-widest text-lg focus:outline-[#0096d7]"
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
            />
            {/* Petunjuk kode dihapus — sebelumnya menampilkan kode akses langsung di layar,
                sehingga gerbang verifikasi jadi tidak ada gunanya. */}
            <p className="text-[11px] text-slate-400 mt-1 text-center">Don't have an access code? Contact the TORGAS admin.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-slate-300 font-bold text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2.5 px-6">
              Masuk Portal &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { StudentCodeModal };
