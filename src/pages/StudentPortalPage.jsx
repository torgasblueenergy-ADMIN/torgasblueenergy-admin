import { useState, useEffect } from 'react';
import { ambilPengajuan } from '../lib/pengajuan';
import { SmartImage } from '../components/SmartImage';
import { PortalBookingModal } from '../components/modals/PortalBookingModal';
import { PortalMentoringModal } from '../components/modals/PortalMentoringModal';
import { PortalProcurementModal } from '../components/modals/PortalProcurementModal';
import { PortalProgressModal } from '../components/modals/PortalProgressModal';

/* ================================================================
   HALAMAN KHUSUS STUDENT PORTAL (DASBOR BIMBINGAN & LAB)
   Diperbarui: Tabel menjadi Dinamis (Tab Filter, Date Picker, dan Search berfungsi penuh)
================================================================ */
function StudentPortalPage({ onBackToMain }) {
  // State untuk mengontrol 4 Modal Form
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isProgressModalOpen, setProgressModalOpen] = useState(false);
  const [isMentoringModalOpen, setMentoringModalOpen] = useState(false);
  const [isProcurementModalOpen, setProcurementModalOpen] = useState(false);
  
  // ==========================================
  // LOGIKA TABEL DINAMIS (PENCARIAN & FILTER)
  // ==========================================
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  /* 1. Data pengajuan — dibaca dari Google Sheet lewat Apps Script.
        Sebelumnya bagian ini berisi 3 baris CONTOH yang ditulis di kode,
        sehingga pengajuan sungguhan tidak pernah muncul di tabel. */
  const [tableData, setTableData] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');

  /* Angka pada empat kartu di atas tabel.
     ⚠️ RIWAYAT: dulu keempatnya ditulis langsung di kode (0 / 0 / 3 / 2),
     jadi selalu salah berapa pun isi Sheet. Sekarang dibaca dari
     ?action=submissions yang memang sudah mengirimkan statistiknya. */
  const [stats, setStats] = useState({
    bookingsToday: 0, mentoringToday: 0, pendingApproval: 0, approved: 0
  });

  const muatData = () => {
    setMemuat(true);
    setGalat('');
    ambilPengajuan().then((hasil) => {
      if (hasil.ok) {
        setTableData(hasil.data);
        const s = hasil.stats || {};
        setStats({
          bookingsToday: s.bookingsToday || 0,
          mentoringToday: s.mentoringToday || 0,
          pendingApproval: s.pendingApproval || 0,
          // Apps Script mengirim "upcoming", bukan jumlah yang disetujui —
          // sedangkan label kartunya "APPROVED". Jadi dihitung dari datanya.
          approved: (hasil.data || []).filter((r) => r.status === 'APPROVED').length
        });
      } else {
        setGalat(hasil.message);
      }
      setMemuat(false);
    });
  };

  useEffect(() => { muatData(); }, []);

  // 2. Fungsi Penyaring Data (Filter Logic)
  const filteredData = tableData.filter(item => {
    // Filter berdasarkan Tab Navigasi
    let matchTab = false;
    if (activeTab === 'All') matchTab = true;
    else if (activeTab === 'Mentoring' && item.activity === 'Bimbingan') matchTab = true;
    else if (activeTab === 'Progress' && item.activity === 'Progress') matchTab = true;
    else if (activeTab === 'RAB' && item.activity === 'RAB & Biaya') matchTab = true;
    else if (activeTab === 'Booking' && item.activity === 'Booking') matchTab = true;

    // Filter berdasarkan Kolom Pencarian (Mencari Nama atau ID)
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.id.toLowerCase().includes(searchQuery.toLowerCase());
                        
    // Filter berdasarkan Kalender
    const matchDate = filterDate === '' || item.rawDate === filterDate;

    return matchTab && matchSearch && matchDate;
  });

  return (
    <div className="min-h-screen bg-[#f2f7fb] text-[#041b2e] pb-16">
      
      {/* HEADER NAVIGASI KHUSUS */}
      <div className="bg-[#041b2e] text-white py-5 px-6 shadow-md border-b-4 border-[#0096d7] sticky top-0 z-50">
        <div className="max-grid flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <SmartImage src="images/logo/logo.jpeg" alt="Logo Torgas Blue Energy" eager className="h-8 sm:h-10 w-auto object-contain rounded-sm" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-lg sm:text-xl font-extrabold tracking-wide hidden sm:inline-block">Torgas Student Portal</span>
          </div>
          <button onClick={onBackToMain} className="btn-outline border-white text-white hover:bg-white hover:text-[#041b2e] text-xs py-2 px-5">
            ← Back to the Home Page
          </button>
        </div>
      </div>

      <div className="max-grid pt-12">
        {/* PAGE HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fadeIn">
          <span className="pill-badge badge-blue mb-3">Thesis Advising</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#041b2e] mb-4">TORGAS Thesis Advising</h1>
          <p className="text-slate-500 text-base">An integrated, one-stop system for all laboratory operations: equipment orders, mentoring schedules, research reports, and budget proposal submissions.</p>
        </div>

        {/* TRACKER STATUS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0096d7] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0096d7]/10 text-[#0096d7] flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
            </div>
            <div className="text-4xl font-extrabold text-[#041b2e] mb-1 group-hover:text-[#0096d7] transition-colors">{memuat ? '–' : stats.bookingsToday}</div>
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Bookings Today</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0096d7] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0096d7]/10 text-[#0096d7] flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
            </div>
            <div className="text-4xl font-extrabold text-[#041b2e] mb-1 group-hover:text-[#0096d7] transition-colors">{memuat ? '–' : stats.mentoringToday}</div>
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Mentoring Today</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#FFAD26] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFAD26]/15 text-[#d97706] flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
            </div>
            <div className="text-4xl font-extrabold text-[#041b2e] mb-1 group-hover:text-[#d97706] transition-colors">{memuat ? '–' : stats.pendingApproval}</div>
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Pending Approval</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0096d7] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg></div>
            </div>
            <div className="text-4xl font-extrabold text-[#041b2e] mb-1 group-hover:text-emerald-600 transition-colors">{memuat ? '–' : stats.approved}</div>
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">APPROVED</div>
          </div>
        </div>

        {/* MENU KARTU AKSI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {/* Kartu 1: Booking Lab */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#0096d7] transition-all group">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-[#0096d7]/10 text-[#0096d7] flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>
                <span className="pill-badge badge-blue">All</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#041b2e] mb-3">Booking Lab & Equipment</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">Schedule laboratory and research equipment usage in a structured and organised way.</p>
              <div className="space-y-3 mb-8">
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Deadline</span><span className="col-span-2 text-slate-700 font-semibold">At least 2 days before use</span></div>
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Approval</span><span className="col-span-2 text-slate-700 font-semibold">Head Tech Dept / Secretariat</span></div>
                <div className="grid grid-cols-3 text-xs"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Users</span><span className="col-span-2 text-slate-700 font-semibold">All lab users</span></div>
              </div>
            </div>
            <div className="mt-auto pt-4 flex"><button onClick={() => setBookingModalOpen(true)} className="btn-primary w-full justify-center">Submit Form &rarr;</button></div>
          </div>

          {/* Kartu 2: Progress Report */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500 transition-all group">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>
                <span className="pill-badge badge-green">Internship</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#041b2e] mb-3">Progress Report</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">Mandatory weekly progress report for thesis and internship students. Due every Friday.</p>
              <div className="space-y-3 mb-8">
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Deadline</span><span className="col-span-2 text-slate-700 font-semibold">Every Friday before 12:00 noon</span></div>
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Approval</span><span className="col-span-2 text-slate-700 font-semibold">Supervisor / Advisor</span></div>
                <div className="grid grid-cols-3 text-xs"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Users</span><span className="col-span-2 text-slate-700 font-semibold">Internship Students</span></div>
              </div>
            </div>
            <div className="mt-auto pt-4 flex"><button onClick={() => setProgressModalOpen(true)} className="w-full justify-center bg-emerald-500 text-white font-bold text-sm py-3 px-8 rounded-full border border-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm">Submit Form &rarr;</button></div>
          </div>

          {/* Kartu 3: Mentoring */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#0096d7] transition-all group">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-[#0096d7]/10 text-[#0096d7] flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
                <span className="pill-badge badge-blue">College Student</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#041b2e] mb-3">Mentoring Request</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">Submit a structured and documented mentoring session request with your supervisor.</p>
              <div className="space-y-3 mb-8">
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Deadline</span><span className="col-span-2 text-slate-700 font-semibold">At least 2 days before schedule</span></div>
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Approval</span><span className="col-span-2 text-slate-700 font-semibold">Supervisor</span></div>
                <div className="grid grid-cols-3 text-xs"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Users</span><span className="col-span-2 text-slate-700 font-semibold">Thesis Students</span></div>
              </div>
            </div>
            <div className="mt-auto pt-4 flex"><button onClick={() => setMentoringModalOpen(true)} className="btn-primary w-full justify-center">Submit Form &rarr;</button></div>
          </div>

          {/* Kartu 4: Procurement / RAB */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#FFAD26] transition-all group">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-[#FFAD26]/15 text-[#d97706] flex items-center justify-center group-hover:scale-110 transition-transform"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg></div>
                <span className="pill-badge badge-orange">All</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#041b2e] mb-3">Budget Proposal (RAB)</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">Submit your weekly lab materials and supplies procurement request in a structured format.</p>
              <div className="space-y-3 mb-8">
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Deadline</span><span className="col-span-2 text-slate-700 font-semibold">Every Thursday before Lab Meeting</span></div>
                <div className="grid grid-cols-3 text-xs border-b border-slate-100 pb-2"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Approval</span><span className="col-span-2 text-slate-700 font-semibold">Head Dept &rarr; Lab Head</span></div>
                <div className="grid grid-cols-3 text-xs"><span className="text-slate-400 font-extrabold uppercase tracking-wider">Users</span><span className="col-span-2 text-slate-700 font-semibold">All lab users</span></div>
              </div>
            </div>
            <div className="mt-auto pt-4 flex"><button onClick={() => setProcurementModalOpen(true)} className="btn-orange w-full justify-center">Submit Form &rarr;</button></div>
          </div>
        </div>

        {/* TABEL REKAPITULASI DINAMIS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mb-10 overflow-hidden animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col gap-2 bg-slate-50/50">
            <h4 className="text-xl font-extrabold text-[#041b2e] mb-1">Mentoring & Activity Request</h4>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Counseling • Lab Calendar</p>
          </div>

          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 px-6 md:px-8">
            <div className="flex space-x-6 text-sm font-bold overflow-x-auto">
              {['All', 'Booking', 'Mentoring', 'Progress', 'RAB'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab 
                      ? 'text-[#041b2e] border-[#041b2e]' 
                      : 'text-slate-400 border-transparent hover:text-[#0096d7]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 md:px-8 py-5 flex flex-wrap gap-4 bg-white">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-64 focus-within:border-[#0096d7] transition-colors">
              <span className="text-slate-400 mr-2">📅</span>
              <input 
                type="date" 
                className="bg-transparent outline-none w-full text-sm font-semibold text-slate-700" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-80 focus-within:border-[#0096d7] transition-colors">
              <span className="text-slate-400 mr-2">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                className="bg-transparent outline-none w-full text-sm font-semibold text-slate-700" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[250px]">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/80 text-[10px] uppercase font-extrabold tracking-widest text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="px-6 md:px-8 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                
                {/* Tiga keadaan: sedang memuat, gagal memuat, dan data kosong —
                    supaya pengguna tahu bedanya "belum ada data" dengan "gagal". */}
                {memuat ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold">
                      Memuat data pengajuan…
                    </td>
                  </tr>
                ) : galat ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-red-600 font-bold mb-3">❌ {galat}</p>
                      <button
                        onClick={muatData}
                        className="btn-primary text-xs py-2 px-6"
                      >
                        Coba Lagi
                      </button>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={index} className="hover:bg-blue-50/50 transition-colors group cursor-default">
                      <td className="px-6 md:px-8 py-5 text-xs font-bold text-slate-400 group-hover:text-[#0096d7]">{row.id}</td>
                      <td className="px-6 py-5">
                        <div className="font-extrabold text-[#041b2e]">{row.displayDate}</div>
                        <div className={`text-xs font-semibold ${row.time === '—' ? 'text-slate-400' : 'text-[#0096d7]'}`}>{row.time}</div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-700">{row.name}</td>
                      <td className="px-6 py-5"><span className={`${row.activityStyle} px-3 py-1.5 rounded-lg text-xs font-extrabold`}>{row.activity}</span></td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-500 max-w-xs truncate" title={row.details}>{row.details.length > 40 ? row.details.substring(0, 40) + '...' : row.details}</td>
                      <td className="px-6 py-5"><span className={`pill-badge ${row.statusBadge}`}>{row.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-bold">
                      No activity records found matching your filters.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
          
          <div className="px-6 md:px-8 py-4 border-t border-slate-100 text-xs font-bold text-slate-400 bg-slate-50 flex justify-between items-center">
            <span>{filteredData.length} ENTRIES FOUND</span>
            {filteredData.length > 0 && (
              <div className="flex gap-2">
                 <button className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center hover:bg-[#041b2e] hover:text-white transition-colors">&lt;</button>
                 <button className="w-8 h-8 rounded bg-[#041b2e] text-white flex items-center justify-center font-bold">1</button>
                 <button className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center hover:bg-[#041b2e] hover:text-white transition-colors">&gt;</button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RENDER SEMUA MODAL DI BAWAH SINI */}
      <PortalBookingModal isOpen={isBookingModalOpen} onClose={() => setBookingModalOpen(false)} />
      <PortalProgressModal isOpen={isProgressModalOpen} onClose={() => setProgressModalOpen(false)} />
      <PortalMentoringModal isOpen={isMentoringModalOpen} onClose={() => setMentoringModalOpen(false)} />
      <PortalProcurementModal isOpen={isProcurementModalOpen} onClose={() => setProcurementModalOpen(false)} />

    </div>
  );
}

export { StudentPortalPage };
