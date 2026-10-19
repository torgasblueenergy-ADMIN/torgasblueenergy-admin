import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ambilTimeline } from '../../lib/timelineBimbingan';

/* ================================================================
   PAPAN TIMELINE BIMBINGAN — STUDENT PORTAL
   ----------------------------------------------------------------
   Satu papan untuk SEMUA mahasiswa: satu baris satu orang, satu kolom
   satu tahapan. Dipilih begini (bukan satu timeline per mahasiswa)
   karena pertanyaan yang paling sering muncul bukan "sejauh mana si A",
   melainkan "siapa yang tertinggal". Bentuk papan menjawab keduanya;
   bentuk per-orang hanya menjawab yang pertama.

   ── BACA-SAJA, DAN MEMANG TIDAK BISA LAIN ──
   Tidak ada tombol simpan di sini, dan tidak boleh ditambahkan.
   Sumbernya alamat CSV hasil "Publish to web" — alamat itu secara
   teknis hanya melayani permintaan baca. Mengubah data dilakukan di
   Google Sheet, lalu halaman ini di-muat ulang.

   ⚠️ Jangan menambahkan kolom nilai, IPK, atau catatan penilaian ke
   tab yang di-publish. Papan ini dilihat semua pemegang kode akses
   portal, bukan hanya pembimbing — pertimbangan yang sama dengan
   ActivityCalendar.jsx.

   Nama tahapan TIDAK ada di berkas ini. Semuanya datang dari baris
   judul di Sheet (lihat lib/timelineBimbingan.js). Menambah tahap =
   menambah kolom di Sheet, tanpa menyentuh kode.
================================================================ */

const GAYA = {
  selesai:    { titik: 'bg-emerald-500',          bar: 'bg-emerald-500',  teks: 'text-emerald-700',  label: 'Selesai' },
  berjalan:   { titik: 'bg-[#0096d7]',            bar: 'bg-[#0096d7]',    teks: 'text-[#0a6c9b]',    label: 'Berjalan' },
  terkendala: { titik: 'bg-[#FFAD26]',            bar: 'bg-[#FFAD26]',    teks: 'text-[#b45309]',    label: 'Terkendala' },
  belum:      { titik: 'bg-slate-300',            bar: 'bg-slate-200',    teks: 'text-slate-400',    label: 'Belum mulai' },
};

const LEBAR_TAHAP = 150;   // px per kolom tahapan
const LEBAR_NAMA  = 230;   // px kolom nama yang menempel di kiri

/* ================================================================
   PENYEGARAN OTOMATIS
   ----------------------------------------------------------------
   Lima menit, bukan lebih cepat. Alamat "publish to web" disajikan
   Google dari salinan yang baru diperbarui dalam hitungan menit,
   jadi menarik data tiap 30 detik hanya menghasilkan jawaban yang
   sama persis berulang kali — membebani jaringan tanpa menampilkan
   apa pun yang baru.

   Dua aturan yang membuatnya tidak boros:

     1. Berhenti saat tab tidak terlihat. Portal ini sering
        ditinggal terbuka semalaman; tanpa aturan ini ia akan
        menghubungi Google ratusan kali untuk layar yang tidak
        ada yang melihat.

     2. Menyegarkan saat tab dibuka kembali, kalau datanya sudah
        lewat dua menit. Inilah saat orang benar-benar melihat
        papannya, dan saat angka basi paling terasa mengganggu.
================================================================ */
const JEDA_SEGARKAN = 5 * 60 * 1000;
const UMUR_BASI     = 2 * 60 * 1000;

function jamSingkat(waktu) {
  if (!waktu) return '';
  const d = new Date(waktu);
  return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`;
}

function BimbinganTimeline() {
  const [tahapan, setTahapan] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');
  const [siap, setSiap] = useState(true);

  const [cari, setCari] = useState('');
  const [pembimbing, setPembimbing] = useState('Semua');
  const [hanyaKendala, setHanyaKendala] = useState(false);

  const [terakhir, setTerakhir] = useState(null);

  /* hidup.current dipakai agar hasil permintaan yang datang terlambat
     tidak menulis ke state komponen yang sudah dilepas React. */
  const hidup = useRef(true);
  const terakhirRef = useRef(null);

  /**
   * @param {boolean} diam  true = penyegaran latar belakang.
   *   Tidak menampilkan "Memuat…" dan tidak mengosongkan papan, supaya
   *   isinya tidak berkedip tiap lima menit di depan orang yang sedang
   *   membacanya. Kegagalannya juga ditelan: data lama yang masih
   *   terpampang lebih berguna daripada pesan merah yang muncul
   *   sendiri karena sekejap jaringan goyah.
   */
  const muat = useCallback((diam = false) => {
    if (!diam) {
      setMemuat(true);
      setGalat('');
    }
    ambilTimeline().then((h) => {
      if (!hidup.current) return;
      setSiap(h.siap !== false);
      if (h.ok) {
        setTahapan(h.tahapan || []);
        setMahasiswa(h.mahasiswa || []);
        setGalat('');
        const kini = Date.now();
        setTerakhir(kini);
        terakhirRef.current = kini;
      } else if (!diam) {
        setGalat(h.message || 'Gagal memuat timeline.');
      }
      if (!diam) setMemuat(false);
    });
  }, []);

  useEffect(() => {
    hidup.current = true;
    muat();

    const bolehSegarkan = () =>
      typeof document === 'undefined' || document.visibilityState !== 'hidden';

    const jam = setInterval(() => { if (bolehSegarkan()) muat(true); }, JEDA_SEGARKAN);

    /* Tab dibuka kembali: segarkan hanya kalau datanya sudah basi.
       Tanpa pemeriksaan umur, berpindah-pindah tab sebentar akan
       memicu permintaan beruntun yang tidak ada gunanya. */
    const saatTerlihat = () => {
      if (document.visibilityState !== 'visible') return;
      const umur = Date.now() - (terakhirRef.current || 0);
      if (umur > UMUR_BASI) muat(true);
    };
    document.addEventListener('visibilitychange', saatTerlihat);

    return () => {
      hidup.current = false;
      clearInterval(jam);
      document.removeEventListener('visibilitychange', saatTerlihat);
    };
  }, [muat]);

  /* Daftar pembimbing dibuat dari datanya sendiri, bukan ditulis di kode —
     supaya pembimbing baru langsung muncul di penyaring tanpa build ulang. */
  const daftarPembimbing = useMemo(() => {
    const set = new Set(mahasiswa.map((m) => m.pembimbing).filter(Boolean));
    return ['Semua', ...Array.from(set).sort()];
  }, [mahasiswa]);

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return mahasiswa.filter((m) => {
      if (hanyaKendala && !m.adaKendala) return false;
      if (pembimbing !== 'Semua' && m.pembimbing !== pembimbing) return false;
      if (!q) return true;
      return [m.nama, m.nim, m.topik].some((v) => String(v).toLowerCase().includes(q));
    });
  }, [mahasiswa, cari, pembimbing, hanyaKendala]);

  const ringkas = useMemo(() => ({
    total:   mahasiswa.length,
    kendala: mahasiswa.filter((m) => m.adaKendala).length,
    rampung: mahasiswa.filter((m) => m.persen >= 100).length,
  }), [mahasiswa]);

  const lebarPapan = LEBAR_NAMA + tahapan.length * LEBAR_TAHAP;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mb-16 overflow-hidden animate-fadeIn">

      {/* ── KEPALA ───────────────────────────────────────────── */}
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-start">
        <div>
          <h4 className="text-xl font-extrabold text-[#041b2e] mb-1">Supervision Progress Timeline</h4>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Tahapan Bimbingan &amp; Pengolahan Data
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
            Papan ini <strong className="font-bold text-slate-500">hanya menampilkan</strong> data.
            Perubahan dan penambahan dilakukan di Google Sheet.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={() => muat()}
            disabled={memuat}
            className="btn-outline text-xs py-2 px-5 whitespace-nowrap disabled:opacity-50"
          >
            {memuat ? 'Memuat…' : '↻ Refresh'}
          </button>

          {/* Jam pembaruan terakhir. Dipasang karena papan ini menyegarkan
              diri diam-diam — tanpa penanda apa pun, pembacanya tidak punya
              cara tahu apakah angka di depannya baru atau sisa sejam lalu.

              Kalimat kedua sengaja menyebut jeda Google. Lebih baik orang
              tahu sejak awal bahwa perubahan butuh beberapa menit, daripada
              menekan Refresh berkali-kali dan mengira papannya rusak. */}
          {terakhir && (
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
              Diperbarui {jamSingkat(terakhir)} · otomatis tiap 5 menit
            </span>
          )}
        </div>
      </div>

      {/* ── BELUM DIPASANG ───────────────────────────────────── */}
      {!siap ? (
        <div className="px-6 md:px-8 py-14 text-center">
          <p className="text-slate-500 font-bold mb-2">Timeline belum terhubung ke Google Sheet.</p>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Isi <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">TIMELINE_CSV_URL</code> di
            berkas <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">src/config.js</code>.
            Langkahnya ada di <strong>PANDUAN-TIMELINE-BIMBINGAN.md</strong>.
          </p>
        </div>

      ) : galat ? (
        <div className="px-6 md:px-8 py-14 text-center">
          <p className="text-red-600 font-bold mb-4">❌ {galat}</p>
          {/* ⚠️ Harus dibungkus panah. onClick={muat} akan meneruskan objek
              klik sebagai argumen pertama, dan argumen itu adalah `diam` —
              sehingga percobaan ulang berjalan senyap: tidak menampilkan
              "Memuat…" dan, kalau gagal lagi, tidak memperbarui pesan
              galatnya. Tombol yang ditekan tapi tampak tidak melakukan
              apa-apa. */}
          <button onClick={() => muat()} className="btn-primary text-xs py-2 px-6">Coba Lagi</button>
        </div>

      ) : memuat ? (
        <div className="px-6 md:px-8 py-16 text-center text-slate-400 font-bold">Memuat timeline…</div>

      ) : mahasiswa.length === 0 ? (
        <div className="px-6 md:px-8 py-16 text-center text-slate-400 font-bold">
          Belum ada baris mahasiswa di tab Timeline.
        </div>

      ) : (
        <>
          {/* ── RINGKASAN + PENYARING ──────────────────────────── */}
          <div className="px-6 md:px-8 py-5 flex flex-wrap items-center gap-3 border-b border-slate-100">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-64 focus-within:border-[#0096d7] transition-colors">
              <span className="text-slate-400 mr-2">🔍</span>
              <input
                type="text"
                placeholder="Cari nama, NIM, atau topik…"
                className="bg-transparent outline-none w-full text-sm font-semibold text-slate-700"
                value={cari}
                onChange={(e) => setCari(e.target.value)}
              />
            </div>

            <select
              value={pembimbing}
              onChange={(e) => setPembimbing(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-[#0096d7] transition-colors"
            >
              {daftarPembimbing.map((p) => (
                <option key={p} value={p}>{p === 'Semua' ? 'Semua pembimbing' : p}</option>
              ))}
            </select>

            <button
              onClick={() => setHanyaKendala((v) => !v)}
              className={`text-xs font-extrabold py-2.5 px-5 rounded-xl border transition-colors ${
                hanyaKendala
                  ? 'bg-[#FFAD26] border-[#FFAD26] text-white'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-[#FFAD26] hover:text-[#b45309]'
              }`}
            >
              ⚠ Terkendala ({ringkas.kendala})
            </button>

            <div className="ml-auto text-xs font-bold text-slate-400 whitespace-nowrap">
              {ringkas.total} mahasiswa · {ringkas.rampung} rampung
            </div>
          </div>

          {/* ── PAPAN ──────────────────────────────────────────── */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: lebarPapan }}>

              {/* Baris judul tahapan. Kolom nama dibuat menempel (sticky)
                  supaya saat papan digeser ke kanan, pengguna tidak
                  kehilangan jejak baris itu milik siapa. */}
              <div className="flex border-b border-slate-200 bg-slate-50/80">
                <div
                  className="sticky left-0 z-10 bg-slate-50 border-r border-slate-200 px-6 md:px-8 py-4 text-[10px] uppercase font-extrabold tracking-widest text-slate-400"
                  style={{ width: LEBAR_NAMA, minWidth: LEBAR_NAMA }}
                >
                  Mahasiswa
                </div>
                {tahapan.map((t) => (
                  <div
                    key={t}
                    className="px-3 py-4 text-[10px] uppercase font-extrabold tracking-widest text-slate-400 leading-tight"
                    style={{ width: LEBAR_TAHAP, minWidth: LEBAR_TAHAP }}
                    title={t}
                  >
                    {t}
                  </div>
                ))}
              </div>

              {/* Baris per mahasiswa */}
              {tersaring.length === 0 ? (
                <div className="px-6 md:px-8 py-14 text-center text-slate-400 font-bold">
                  Tidak ada mahasiswa yang cocok dengan penyaring.
                </div>
              ) : tersaring.map((m) => (
                <div key={m.kunci} className="flex border-b border-slate-100 hover:bg-blue-50/40 transition-colors group">

                  {/* Kolom kiri: identitas + progres keseluruhan */}
                  <div
                    className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/60 border-r border-slate-200 px-6 md:px-8 py-5 transition-colors"
                    style={{ width: LEBAR_NAMA, minWidth: LEBAR_NAMA }}
                  >
                    <div className="font-extrabold text-[#041b2e] text-sm leading-tight truncate" title={m.nama}>
                      {m.nama}
                    </div>
                    {m.nim && <div className="text-[11px] font-bold text-slate-400 mt-0.5">{m.nim}</div>}
                    {m.topik && (
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug" title={m.topik}>
                        {m.topik}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${m.adaKendala ? 'bg-[#FFAD26]' : m.persen >= 100 ? 'bg-emerald-500' : 'bg-[#0096d7]'}`}
                          style={{ width: `${m.persen}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400 tabular-nums">{m.persen}%</span>
                    </div>
                  </div>

                  {/* Kolom tahapan */}
                  {m.langkah.map((l, i) => {
                    const g = GAYA[l.keadaan] || GAYA.belum;
                    const keterangan = [l.judul, g.label, l.teks && l.teks !== g.label ? `“${l.teks}”` : '']
                      .filter(Boolean).join(' · ');

                    return (
                      <div
                        key={i}
                        className="px-3 py-5 flex flex-col justify-center"
                        style={{ width: LEBAR_TAHAP, minWidth: LEBAR_TAHAP }}
                        title={keterangan}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${g.titik}`} />
                          <span className={`text-[11px] font-extrabold ${g.teks}`}>
                            {l.keadaan === 'belum' ? '—' : `${l.persen}%`}
                          </span>
                        </div>

                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${g.bar}`} style={{ width: `${l.persen}%` }} />
                        </div>

                        {/* Tanggal hanya muncul kalau memang ditulis di Sheet.
                            Tidak ada tanggal karangan di sini. */}
                        {l.tanggal && (
                          <div className="text-[10px] font-semibold text-slate-400 mt-1.5">{l.tanggal}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── KAKI: KETERANGAN WARNA ─────────────────────────── */}
          <div className="px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-x-6 gap-y-2 items-center">
            {Object.keys(GAYA).map((k) => (
              <div key={k} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${GAYA[k].titik}`} />
                <span className="text-[11px] font-bold text-slate-500">{GAYA[k].label}</span>
              </div>
            ))}
            <span className="ml-auto text-[11px] font-bold text-slate-400">
              {tersaring.length} dari {mahasiswa.length} baris · geser ke kanan untuk tahap berikutnya
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export { BimbinganTimeline };
