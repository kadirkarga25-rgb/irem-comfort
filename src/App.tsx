import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { OpeningExperience } from './components/opening/OpeningExperience';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { CollectionSection } from './components/sections/CollectionSection';
import { CraftsmanshipSection } from './components/sections/CraftsmanshipSection';
import { WhyIremComfortSection } from './components/sections/WhyIremComfortSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { ImageProvider } from './context/ImageContext';
import { AdminPage } from './components/admin/AdminPage';
import { FairTopBanner } from './components/ui/FairTopBanner';
import { FairModal } from './components/ui/FairModal';
import { PasswordResetPage } from './components/secret/PasswordResetPage';
import { RemoteManagementPage } from './components/secret/RemoteManagementPage';
import { SurveyPage } from './components/secret/SurveyPage';
import { NotFoundPage } from './components/ui/NotFoundPage';

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [contactPrefill, setContactPrefill] = useState('');
  const [isFairModalOpen, setIsFairModalOpen] = useState(true);
  
  // Route state: check if URL contains /admin, #admin, or ?admin
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path === '/admin' || hash === '#admin' || search.includes('admin');
  });

  // Password reset route state: check if URL contains /sifre-sifirla, /sifre-sifirla-html, #sifre-sifirla, etc.
  const [isResetView, setIsResetView] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.includes('sifre-sifirla') || 
      path.includes('sifre_sifirla') || 
      hash.includes('sifre-sifirla') || 
      search.includes('sifre-sifirla')
    );
  });

  // Remote Management route state: check if URL contains /uzak-yonetim, #uzak-yonetim, etc.
  const [isRemoteView, setIsRemoteView] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.includes('uzak-yonetim') || 
      path.includes('uzak_yonetim') || 
      hash.includes('uzak-yonetim') || 
      search.includes('uzak-yonetim')
    );
  });

  // Survey route state: check if URL contains /anket, /anket-html, #anket, etc.
  const [isSurveyView, setIsSurveyView] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.includes('anket') || 
      hash.includes('anket') || 
      search.includes('anket')
    );
  });

  // 404 Not Found route state: check if pathname is not root and not matching any known route
  const [isNotFoundView, setIsNotFoundView] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path === '/' || path === '' || path === '/index.html') return false;
    const isKnown = (
      path.includes('admin') || hash.includes('admin') || search.includes('admin') ||
      path.includes('sifre-sifirla') || hash.includes('sifre-sifirla') || search.includes('sifre-sifirla') ||
      path.includes('uzak-yonetim') || hash.includes('uzak-yonetim') || search.includes('uzak-yonetim') ||
      path.includes('anket') || hash.includes('anket') || search.includes('anket')
    );
    return !isKnown;
  });

  // Listen for hash and popstate changes
  useEffect(() => {
    const checkRoutes = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      const admin = path === '/admin' || hash === '#admin' || search.includes('admin');
      const reset = (
        path.includes('sifre-sifirla') || 
        path.includes('sifre_sifirla') || 
        hash.includes('sifre-sifirla') || 
        search.includes('sifre-sifirla')
      );
      const remote = (
        path.includes('uzak-yonetim') || 
        path.includes('uzak_yonetim') || 
        hash.includes('uzak-yonetim') || 
        search.includes('uzak-yonetim')
      );
      const survey = (
        path.includes('anket') || 
        hash.includes('anket') || 
        search.includes('anket')
      );

      setIsAdminView(admin);
      setIsResetView(reset);
      setIsRemoteView(remote);
      setIsSurveyView(survey);

      if (path === '/' || path === '' || path === '/index.html') {
        setIsNotFoundView(false);
      } else {
        setIsNotFoundView(!admin && !reset && !remote && !survey);
      }
    };

    window.addEventListener('hashchange', checkRoutes);
    window.addEventListener('popstate', checkRoutes);
    return () => {
      window.removeEventListener('hashchange', checkRoutes);
      window.removeEventListener('popstate', checkRoutes);
    };
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isAdminView || isResetView || isRemoteView || isSurveyView || isNotFoundView) return; // Don't run lenis inside special/404 pages

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node) => node.classList?.contains('lenis-prevent') || node.hasAttribute('data-lenis-prevent'),
    });

    if (isFairModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, [isAdminView, isResetView, isRemoteView, isSurveyView, isNotFoundView, isFairModalOpen]);

  // Track active section for navigation highlighting
  useEffect(() => {
    if (isAdminView || isNotFoundView) return;

    const sectionIds = ['hero', 'about', 'collection', 'craftsmanship', 'why-us', 'contact'];
    
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isAdminView, isNotFoundView]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquireProduct = (productName: string) => {
    setContactPrefill(productName);
    scrollToSection('contact');
  };

  const returnToPublicSite = () => {
    setIsAdminView(false);
    setIsResetView(false);
    setIsRemoteView(false);
    setIsSurveyView(false);
    setIsNotFoundView(false);
    
    if (window.location.pathname !== '/' || window.location.hash || window.location.search) {
      window.history.pushState('', document.title, '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ImageProvider>
      {isAdminView ? (
        <AdminPage onReturnToSite={returnToPublicSite} />
      ) : isResetView ? (
        <PasswordResetPage onReturnToSite={returnToPublicSite} />
      ) : isRemoteView ? (
        <RemoteManagementPage onReturnToSite={returnToPublicSite} />
      ) : isSurveyView ? (
        <SurveyPage onReturnToSite={returnToPublicSite} />
      ) : isNotFoundView ? (
        <NotFoundPage onReturnToSite={returnToPublicSite} />
      ) : (
        <div className="min-h-screen bg-white text-[#111111] relative selection:bg-[#0A2D6F] selection:text-white">
          {/* Active Fair Popup & Top Banner */}
          <FairTopBanner onOpenModal={() => setIsFairModalOpen(true)} />
          <FairModal isOpen={isFairModalOpen} onClose={() => setIsFairModalOpen(false)} />

          {/* 1. Opening Experience Overlay */}
          <OpeningExperience scrollY={scrollY} />

          {/* 2. Glassmorphic Header Navigation */}
          <Header
            scrollY={scrollY}
            activeSection={activeSection}
            onNavigate={scrollToSection}
          />

          {/* 3. Main Sections */}
          <main>
            <HeroSection
              onDiscoverClick={() => scrollToSection('collection')}
              onCraftsmanshipClick={() => scrollToSection('craftsmanship')}
            />

            <AboutSection />

            <CollectionSection onInquireProduct={handleInquireProduct} />

            <CraftsmanshipSection />

            <WhyIremComfortSection />

            <ContactSection prefilledSubject={contactPrefill} />
          </main>

          {/* 4. Footer */}
          <Footer
            onNavigate={scrollToSection}
            onAdminClick={() => setIsAdminView(true)}
          />
        </div>
      )}
    </ImageProvider>
  );
}


