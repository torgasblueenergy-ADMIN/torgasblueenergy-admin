import { useState, useEffect, useMemo } from 'react';
import { ambilKetersediaan } from '../../lib/ketersediaan';

/* ================================================================
   KALENDER KEGIATAN & KETERSEDIAAN — STUDENT PORTAL
   ----------------------------------------------------------------
   Menjawab dua pertanyaan mahasiswa sebelum mengajukan apa pun:
     1. Kapan Pak Tora punya waktu?
     2. Slot mana yang sudah terpakai?

   ── PRIVASI (keputusan Mahdan, 5 Agu 2026) ──
   Kalender ini dilihat SEMUA pemegang kode akses, bukan hanya pemilik
   pengajuan. Karena itu nama pemohon dan judul risetnya TIDAK
   ditampilkan — cukup "Booked · Mentoring". Yang perlu diketahui
   mahasiswa lain hanyalah kapan waktunya sudah terisi, bukan siapa
   yang mengisi atau sedang meneliti apa.

   Jangan menambahkan `row.name` atau `row.details` ke tampilan ini
   tanpa membicarakannya lebih dulu.
================================================================ */

const NAMA_HARI = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const NAMA_BULAN = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];

/** YYYY-MM-DD dalam waktu setempat — bukan UTC.
 *  toISOString() memakai UTC, sehingga di WIB (UTC+7) tanggal bisa
 *  mundur sehari untuk jam-jam dini hari. Itu pernah membuat kegiatan
 *  tampil di kotak yang salah. */
function kunciTanggal(d) {
  const bln = String(d.getMonth() + 1).padStart(2, '0');
  const tgl = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${bln}-${tgl}`;
}

function ActivityCalendar({ pengajuan = [], onPilihTanggal }) {
  const hariIni = useMemo(() => new Date(), []);
  const [bulan, setBulan] = useState(() => new Date(hariIni.getFullYear(), hariIni.getMonth(), 1));
  const [dipilih, setDipilih] = useState(kunciTanggal(hariIni));

  const [slot, setSlot] = useState([]);
  const [slotSiap, setSlotSiap] = useState(false);
  const [memuatSlot, setMemuatSlot] = useState(true);

  /* Ambil ketersediaan sebulan penuh sekali jalan, bukan per tanggal —
     satu permintaan untuk 30 hari jauh lebih hemat daripada 30 permintaan. */
  useEffect(() => {
    const awal = new Date(bulan.getFullYear(), bulan.getMonth(), 1);
    const akhir = new Date(bulan.getFullYear(), bulan.getMonth() + 1, 0);
    let batal = false;

    setMemuatSlot(true);
    ambilKetersediaan(kunciTanggal(awal), kunciTanggal(akhir)).then((h) => {
      if (batal) return;
      setSlot(h.data || []);
      setSlotSiap(h.siap);
      setMemuatSlot(false);
    });

    return () => { batal = true; };
  }, [bulan]);

  /* Kelompokkan sekali saja, bukan disaring ulang di dalam 42 kotak tanggal. */
  const perTanggal = useMemo(() => {
    const peta = {};
    for (const row of pengajuan) {
      if (!row.rawDate) continue;
      (peta[row.rawDate] ||= { kegiatan: [], slot: [] }).kegiatan.push(row);
    }
    for (const s of slot) {
      if (!s.date) continue;
      (peta[s.date] ||= { kegiatan: [], slot: [] }).slot.push(s);
    }
    return peta;
  }, [pengajuan, slot]);

  /* 42 kotak = 6 baris penuh. Jumlahnya sengaja tetap supaya tinggi
     kalender tidak melompat saat berganti bulan. */
  const kotak = useMemo(() => {
    const awalGrid = new Date(bulan.getFullYear(), bulan.getMonth(), 1);
    awalGrid.setDate(1 - awalGrid.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(awalGrid);
      d.setDate(awalGrid.getDate() + i);
      return d;
    });
  }, [bulan]);

  const gantiBulan = (arah) =>
    setBulan(new Date(bulan.getFullYear(), bulan.getMonth() + arah, 1));

  const isiHariIni = perTanggal[dipilih] || { kegiatan: [], slot: [] };
  const kunciHariIni = kunciTanggal(hariIni);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mb-10 overflow-hidden animate-fadeIn">

      {/* ── Kepala ──────────────────────────────────────────────── */}
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
        <h4 className="text-xl font-extrabold text-[#041b2e] mb-1">Availability Calendar</h4>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Check open slots before submitting a request
        </p>
      </div>

      <div className="grid lg:grid-cols-5">

        {/* ── Sisi kiri: grid tanggal ───────────────────────────── */}
        {/* Lebarnya dibatasi dengan sengaja. Kotak tanggal memakai
            aspect-square, jadi kalau kolomnya dibiarkan melar mengikuti
            layar lebar, tiap kotak ikut membesar dan enam barisnya bisa
            lebih tinggi dari layar — kalender jadi harus digulir. */}
        <div className="lg:col-span-3 p-5 sm:p-6 lg:border-r border-slate-100">
          <div className="w-full max-w-[440px] mx-auto">

          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => gantiBulan(-1)}
              className="w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:bg-[#041b2e] hover:text-white hover:border-[#041b2e] transition-colors font-bold cursor-pointer"
              title="Previous month"
            >
              ←
            </button>
            <div className="text-center">
              <div className="font-extrabold text-[#041b2e] text-lg">
                {NAMA_BULAN[bulan.getMonth()]} {bulan.getFullYear()}
              </div>
            </div>
            <button
              onClick={() => gantiBulan(1)}
              className="w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:bg-[#041b2e] hover:text-white hover:border-[#041b2e] transition-colors font-bold cursor-pointer"
              title="Next month"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {NAMA_HARI.map((h) => (
              <div key={h} className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-1">
                {h}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {kotak.map((d) => {
              const kunci = kunciTanggal(d);
              const bulanIni = d.getMonth() === bulan.getMonth();
              const isi = perTanggal[kunci];
              const adaSlot = isi?.slot.length > 0;
              const adaKegiatan = isi?.kegiatan.length > 0;
              const terpilih = kunci === dipilih;
              const ini = kunci === kunciHariIni;

              return (
                <button
                  key={kunci}
                  onClick={() => setDipilih(kunci)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                    terpilih
                      ? 'bg-[#041b2e] text-white border-[#041b2e] shadow-md'
                      : bulanIni
                        ? 'bg-white text-slate-700 border-slate-200 hover:border-[#0096d7] hover:bg-blue-50/40'
                        : 'bg-slate-50/60 text-slate-300 border-transparent'
                  }`}
                >
                  <span className={`text-sm ${ini && !terpilih ? 'font-black text-[#0096d7]' : 'font-bold'}`}>
                    {d.getDate()}
                  </span>

                  {/* Titik penanda — hijau: ada slot, biru: sudah ada kegiatan */}
                  <span className="flex gap-0.5 h-1.5">
                    {adaSlot && (
                      <span className={`w-1.5 h-1.5 rounded-full ${terpilih ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                    )}
                    {adaKegiatan && (
                      <span className={`w-1.5 h-1.5 rounded-full ${terpilih ? 'bg-sky-300' : 'bg-[#0096d7]'}`} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Supervisor available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0096d7]" /> Already scheduled
            </span>
          </div>

          </div>
        </div>

        {/* ── Sisi kanan: rincian tanggal terpilih ──────────────── */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-slate-50/40">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            Selected date
          </div>
          <div className="font-extrabold text-[#041b2e] text-lg mb-5">
            {(() => {
              const [y, m, t] = dipilih.split('-');
              return `${Number(t)} ${NAMA_BULAN[Number(m) - 1]} ${y}`;
            })()}
          </div>

          {/* Slot tersedia */}
          <div className="mb-6">
            <div className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest mb-2">
              Open slots
            </div>

            {memuatSlot ? (
              <p className="text-sm text-slate-400 font-semibold">Loading…</p>
            ) : !slotSiap ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                  The supervisor’s schedule has not been connected yet. Please contact the
                  admin to confirm a time before submitting a request.
                </p>
              </div>
            ) : isiHariIni.slot.length === 0 ? (
              <p className="text-sm text-slate-400 font-semibold">No open slots on this date.</p>
            ) : (
              <div className="space-y-2">
                {isiHariIni.slot.map((s, i) => (
                  <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-extrabold text-emerald-800">
                        {/* Acara sehari penuh tidak punya jam. Menampilkan
                            "– " kosong akan terlihat seperti data rusak. */}
                        {s.allDay || !s.start ? 'All day' : `${s.start} – ${s.end}`}
                      </div>
                      {s.note && <div className="text-[11px] text-emerald-700 font-semibold">{s.note}</div>}
                    </div>
                    {onPilihTanggal && (
                      <button
                        onClick={() => onPilihTanggal(dipilih, s.start)}
                        className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer flex-shrink-0"
                      >
                        Request
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kegiatan yang sudah terjadwal — sengaja tanpa nama & topik */}
          <div>
            <div className="text-[11px] font-extrabold text-[#0096d7] uppercase tracking-widest mb-2">
              Already scheduled
            </div>
            {isiHariIni.kegiatan.length === 0 ? (
              <p className="text-sm text-slate-400 font-semibold">Nothing scheduled on this date.</p>
            ) : (
              <div className="space-y-2">
                {isiHariIni.kegiatan.map((k, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-600">
                      {k.time && k.time !== '—' ? k.time : 'All day'} · {k.activity}
                    </span>
                    <span className={`pill-badge ${k.statusBadge} text-[10px]`}>{k.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export { ActivityCalendar };
