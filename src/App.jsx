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
   MAIN APP (PENGATURAN HALAMAN & MODAL)
================================================================ */
function App() {
  useReveal();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // State Navigasi Halaman
  const [isStudentPortalActive, setIsStudentPortalActive] = useState(false);
  const [isInternshipFormActive, setIsInternshipFormActive] = useState(false);
  const [isCollaboratorActive, setIsCollaboratorActive] = useState(false); 
  const [isPartTimeFormActive, setIsPartTimeFormActive] = useState(false); // <--- State Baru untuk Part Time
  const [legalPage, setLegalPage] = useState(null); // 'privacy' | 'terms' | null

  // Fungsi Helper untuk mereset semua halaman ke Landing Page
  const backToMain = () => {
    setIsStudentPortalActive(false);
    setIsInternshipFormActive(false);
    setIsCollaboratorActive(false);
    setIsPartTimeFormActive(false); // <--- Reset State
    setLegalPage(null);
    window.scrollTo(0, 0);
  };

  // Buka halaman legal dari footer, selalu mulai dari atas halaman
  const openLegal = (which) => {
    setLegalPage(which);
    window.scrollTo(0, 0);
  };

  // RENDER HALAMAN 1: Student Portal
  if (isStudentPortalActive) return <StudentPortalPage onBackToMain={backToMain} />;

  // RENDER HALAMAN 2: Internship Form
  if (isInternshipFormActive) return <InternshipFormPage onBackToMain={backToMain} />;

  // RENDER HALAMAN 3: Collaborator
  if (isCollaboratorActive) return <CollaboratorPage onBackToMain={backToMain} />;
  
  // RENDER HALAMAN 4: Part-Time Form (HALAMAN BARU)
  if (isPartTimeFormActive) return <PartTimeFormPage onBackToMain={backToMain} />;

  // RENDER HALAMAN 5: Kebijakan Privasi / Ketentuan Layanan
  if (legalPage) return <LegalPage type={legalPage} onBackToMain={backToMain} />;

  // RENDER HALAMAN UTAMA (LANDING PAGE)
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link: pembaca layar & pengguna keyboard bisa lompat ke konten utama */}
      <a href="#konten-utama" className="skip-link">Lompat ke konten utama</a>

      <HeaderNav
        onOpenStudentPortal={() => setIsStudentPortalActive(true)}
        onOpenCollaborator={() => setIsCollaboratorActive(true)}
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
          onOpenInternshipForm={() => setIsInternshipFormActive(true)}
          onOpenPartTimeForm={() => setIsPartTimeFormActive(true)}
        />
      </main>

      <Footer onOpenLegal={openLegal} />

      {/* Modals */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}

export { App };
