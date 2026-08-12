import { useState, useEffect, useRef } from 'react';
import { Footer } from './components/Footer';
import { HeaderNav } from './components/HeaderNav';
import { ArticleModal } from './components/modals/ArticleModal';
import { BookingModal } from './components/modals/BookingModal';
import { AboutLegal } from './components/sections/AboutLegal';
import { Hero } from './components/sections/Hero';
import { IntegratedLab } from './components/sections/IntegratedLab';
import { InternshipSection } from './components/sections/InternshipSection';
import { LabTeamSection } from './components/sections/LabTeamSection';
import { NewsSection } from './components/sections/NewsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { useReveal } from './lib/useReveal';
import { CollaboratorPage } from './pages/CollaboratorPage';
import { InternshipFormPage } from './pages/InternshipFormPage';
import { LegalPage } from './pages/LegalPage';
import { PartTimeFormPage } from './pages/PartTimeFormPage';
import { StudentPortalPage } from './pages/StudentPortalPage';

/* ================================================================
   ALAMAT HALAMAN — AGAR REFRESH TIDAK MELEMPAR KE BERANDA
   ----------------------------------------------------------------
   ⚠️ RIWAYAT 13 Agu 2026:
   Student Portal, Collaborator, formulir Magang/Part-time, dan halaman
   legal dulunya hanya disimpan sebagai status di memori (lima buah
   useState boolean). Alamat di bilah browser tidak pernah berubah —
   tetap torgasblueenergy.com apa pun yang sedang dibuka.

   Akibatnya, menekan Refresh saat berada di Student Portal membuang
   pengguna kembali ke beranda: status di memori hilang, dan semuanya
   kembali bernilai false. Tombol Back browser juga tidak berfungsi,
   dan halaman-halaman itu mustahil dikirim lewat tautan.

   Sekarang halaman yang sedang dibuka dicatat pada bagian hash alamat:

       torgasblueenergy.com/#/student-portal
       torgasblueenergy.com/#/collaborator

   ⚠️ KENAPA HASH, BUKAN ALAMAT BIASA seperti /student-portal:
   Situs ini dilayani GitHub Pages sebagai berkas statis. Alamat biasa
   akan meminta berkas /student-portal.html ke server — yang tidak ada,
   sehingga Refresh justru berakhir di halaman 404. Bagian hash tidak
   pernah dikirim ke server, jadi Refresh selalu aman.

   ⚠️ Awalan "#/" WAJIB dipertahankan. Situs ini juga memakai hash biasa
   untuk lompat antar-bagian di beranda (#news, #home, #konten-utama).
   Awalan garis miring itulah yang memisahkan "pindah halaman" dari
   "lompat ke bagian" — tanpanya keduanya akan saling tabrakan.
================================================================ */
const RUTE = {
  '#/student-portal': 'portal',
  '#/collaborator':   'collaborator',
  '#/internship':     'internship',
  '#/part-time':      'part-time',
  '#/privacy':        'privacy',
  '#/terms':          'terms',
};

function bacaRute() {
  if (typeof window === 'undefined') return 'beranda';
  return RUTE[window.location.hash] || 'beranda';
}

function hashUntuk(kunci) {
  return Object.keys(RUTE).find((h) => RUTE[h] === kunci) || '';
}

/* ================================================================
   MAIN APP (PENGATURAN HALAMAN & MODAL)
================================================================ */
function App() {
  useReveal();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  /* Halaman aktif dibaca dari alamat sejak render pertama, sehingga
     membuka tautan langsung ke #/student-portal tidak pernah sempat
     menampilkan beranda lebih dulu. */
  const [halaman, setHalaman] = useState(bacaRute);

  /* Alamat adalah satu-satunya sumber kebenaran: berpindah halaman
     dilakukan dengan mengubah hash, dan pendengar inilah yang menyetel
     statusnya. Karena itu tombol Back/Forward browser ikut berfungsi
     tanpa kode tambahan. */
  useEffect(() => {
    const saatHashBerubah = () => setHalaman(bacaRute());
    window.addEventListener('hashchange', saatHashBerubah);
    return () => window.removeEventListener('hashchange', saatHashBerubah);
  }, []);

  /* Gulir ke atas HANYA ketika benar-benar berpindah halaman.
     ⚠️ Jangan pindahkan ini ke pendengar hashchange: menekan menu
     "News" di beranda juga mengubah hash (#news), dan menggulir ke atas
     di situ akan membatalkan lompatan ke bagian yang dituju. */
  const halamanSebelumnya = useRef(halaman);
  useEffect(() => {
    if (halamanSebelumnya.current !== halaman) {
      halamanSebelumnya.current = halaman;
      window.scrollTo(0, 0);
    }
  }, [halaman]);

  const bukaHalaman = (kunci) => {
    const hash = hashUntuk(kunci);
    if (window.location.hash === hash) setHalaman(kunci); // sudah di sana
    else window.location.hash = hash;
  };

  // Kembali ke beranda — hash dibuang agar alamatnya kembali bersih
  const backToMain = () => {
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    setHalaman('beranda');
  };

  // RENDER HALAMAN 1: Student Portal
  if (halaman === 'portal') return <StudentPortalPage onBackToMain={backToMain} />;

  // RENDER HALAMAN 2: Internship Form
  if (halaman === 'internship') return <InternshipFormPage onBackToMain={backToMain} />;

  // RENDER HALAMAN 3: Collaborator
  if (halaman === 'collaborator') return <CollaboratorPage onBackToMain={backToMain} />;

  // RENDER HALAMAN 4: Part-Time Form
  if (halaman === 'part-time') return <PartTimeFormPage onBackToMain={backToMain} />;

  // RENDER HALAMAN 5: Kebijakan Privasi / Ketentuan Layanan
  if (halaman === 'privacy' || halaman === 'terms') {
    return <LegalPage type={halaman} onBackToMain={backToMain} />;
  }

  // RENDER HALAMAN UTAMA (LANDING PAGE)
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link: pembaca layar & pengguna keyboard bisa lompat ke konten utama */}
      <a href="#konten-utama" className="skip-link">Lompat ke konten utama</a>

      <HeaderNav
        onOpenStudentPortal={() => bukaHalaman('portal')}
        onOpenCollaborator={() => bukaHalaman('collaborator')}
      />

      {/* <main> menandai konten utama halaman untuk mesin pencari & pembaca layar */}
      <main id="konten-utama">
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <AboutLegal />
        <IntegratedLab onOpenBooking={() => setIsBookingOpen(true)} />
        <ProjectsSection />
        <LabTeamSection />
        <NewsSection onSelectArticle={(art) => setSelectedArticle(art)} />

        {/* Melempar dua fungsi untuk masing-masing formulir kerja */}
        <InternshipSection
          onOpenInternshipForm={() => bukaHalaman('internship')}
          onOpenPartTimeForm={() => bukaHalaman('part-time')}
        />
      </main>

      <Footer onOpenLegal={(which) => bukaHalaman(which)} />

      {/* Modals */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}

export { App };
