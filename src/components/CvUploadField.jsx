import { useRef, useState } from 'react';

/* ================================================================
   FIELD UNGGAH CV — versi yang BENAR-BENAR MENGIRIM FILE
   ----------------------------------------------------------------
   ⚠️ RIWAYAT BUG — jangan diulang:
   Versi lama hanya menulis <input type="file" className="hidden" />
   tanpa onChange, tanpa state, dan payload form TIDAK memuat file
   sama sekali. Pelamar memilih CV, tampilan terlihat normal, tekan
   Kirim — dan filenya tidak pernah sampai ke mana pun. Folder Drive
   penampung CV selalu kosong tanpa ada yang menyadari.

   Sekarang: file dibaca jadi base64 lalu ikut dikirim ke Apps Script
   bersama data formulir, dengan validasi ukuran & tipe di sisi
   pengguna supaya kegagalan ketahuan sejak awal.
================================================================ */

const MAX_MB = 2;

/** Ubah File menjadi string base64 (tanpa awalan "data:...;base64,") */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('Gagal membaca berkas.'));
    reader.readAsDataURL(file);
  });
}

/**
 * @param {object}   props
 * @param {function} props.onFileChange  dipanggil dengan {name, mimeType, base64} atau null
 * @param {string[]} props.accept        daftar ekstensi, contoh ['.pdf', '.docx']
 * @param {boolean}  props.required      tandai wajib diisi
 * @param {string}   props.label         judul field
 * @param {string}   props.hint          keterangan kecil di bawah judul
 * @param {string}   props.accentClass   kelas warna aksen saat hover
 */
export function CvUploadField({
  onFileChange,
  accept = ['.pdf'],
  required = false,
  label = 'Upload CV / Resume',
  hint = 'PDF',
  accentClass = 'hover:border-[#0096d7]'
}) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);

  const reset = () => {
    setFileName('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    onFileChange?.(null);
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return reset();

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!accept.includes(ext)) {
      setError(`Format ${ext} tidak diterima. Gunakan: ${accept.join(', ')}`);
      setFileName('');
      onFileChange?.(null);
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Ukuran berkas ${(file.size / 1048576).toFixed(1)} MB — maksimal ${MAX_MB} MB.`);
      setFileName('');
      onFileChange?.(null);
      return;
    }

    try {
      setReading(true);
      setError('');
      const base64 = await toBase64(file);
      setFileName(file.name);
      onFileChange?.({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64
      });
    } catch (err) {
      setError(err.message);
      onFileChange?.(null);
    } finally {
      setReading(false);
    }
  };

  return (
    <div className="pt-2">
      <label className="block text-[11px] font-extrabold text-[#041b2e] uppercase tracking-widest mb-1.5">
        {label} {required && <span className="text-[#d97706]">*</span>}
      </label>

      {!fileName ? (
        <label
          className={`border-2 border-dashed border-slate-300 bg-white/60 rounded-xl p-8 text-center hover:bg-white ${accentClass} transition-all cursor-pointer flex flex-col items-center justify-center group shadow-sm`}
        >
          <svg className="w-10 h-10 text-slate-400 transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="font-bold text-sm text-[#041b2e] mb-1">
            {reading ? 'Membaca berkas…' : 'Pilih berkas'}
          </span>
          <span className="text-xs text-slate-500">{hint} · maksimal {MAX_MB} MB</span>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept.join(',')}
            onChange={handleChange}
          />
        </label>
      ) : (
        /* Konfirmasi visual bahwa berkas SUDAH terbaca dan siap ikut terkirim */
        <div className="border-2 border-emerald-300 bg-emerald-50/80 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <svg className="w-6 h-6 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-emerald-800 truncate flex-1">{fileName}</span>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-extrabold text-emerald-700 hover:text-red-600 transition-colors flex-shrink-0 cursor-pointer"
          >
            Ganti
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-bold text-red-600">❌ {error}</p>
      )}
    </div>
  );
}
