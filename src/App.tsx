import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { OpeningExperience } from './components/opening/OpeningExperience';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { CollectionSection } from './components/sections/CollectionSection';
import { CraftsmanshipSection } from './components/sections/CraftsmanshipSection';
import { WhyIremComfortSection } from './components/sections/WhyIremComfortSection';
import { FaqSection } from './components/sections/FaqSection';
import { ContactSection } from './components/sections/ContactSection';

import { NewsletterSection } from './components/sections/NewsletterSection';
import { Footer } from './components/layout/Footer';
import { ImageProvider } from './context/ImageContext';
import { AdminPage } from './components/admin/AdminPage';
import { FairTopBanner } from './components/ui/FairTopBanner';
import { FairModal } from './components/ui/FairModal';
import { PasswordResetPage } from './components/secret/PasswordResetPage';
import { RemoteManagementPage } from './components/secret/RemoteManagementPage';
import { SurveyPage } from './components/secret/SurveyPage';
import { NotFoundPage } from './components/ui/NotFoundPage';
import { LegalModal, LegalDocType } from './components/ui/LegalModal';
import { CookieConsent } from './components/ui/CookieConsent';
import { MaintenanceView } from './components/ui/MaintenanceView';
import { DeployingView } from './components/ui/DeployingView';
import { useAppImages } from './context/ImageContext';

function MainAppContent() {
  const { systemConfig } = useAppImages();

  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [contactPrefill, setContactPrefill] = useState('');
  const [isFairModalOpen, setIsFairModalOpen] = useState(false);
  const [legalModalDoc, setLegalModalDoc] = useState<LegalDocType | null>(null);
  
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

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isAdminView || isResetView || isRemoteView || isSurveyView || isNotFoundView || systemConfig.isMaintenanceMode || systemConfig.isDeploying) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node) => node.classList?.contains('lenis-prevent') || node.hasAttribute('data-lenis-prevent'),
    });

    lenisRef.current = lenis;

    if (isFairModalOpen || Boolean(legalModalDoc)) {
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

    const sectionIds = ['hero', 'about', 'collection', 'craftsmanship', 'why-us', 'faq', 'contact'];

    const updateActiveSection = () => {
      const currentScroll = window.scrollY + 140;

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      let foundSection = 'hero';
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          if (currentScroll >= el.offsetTop - 20) {
            foundSection = id;
            break;
          }
        }
      }
      setActiveSection((prev) => (prev !== foundSection ? foundSection : prev));
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      updateActiveSection();
    };

    lenis.on('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });

    updateActiveSection();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdminView, isResetView, isRemoteView, isSurveyView, isNotFoundView, systemConfig.isMaintenanceMode, systemConfig.isDeploying, isFairModalOpen, legalModalDoc]);

  // Secondary Intersection Observer backup for static positions
  useEffect(() => {
    if (isAdminView || isNotFoundView || systemConfig.isMaintenanceMode || systemConfig.isDeploying) return;

    const sectionIds = ['hero', 'about', 'collection', 'craftsmanship', 'why-us', 'faq', 'contact'];
    
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isAdminView, isNotFoundView, systemConfig.isMaintenanceMode, systemConfig.isDeploying]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const offset = window.innerWidth < 768 ? -150 : -90;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset });
    } else {
      const y = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
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

  // 1. Admin view always takes precedence so admin is never locked out
  if (isAdminView) {
    return <AdminPage onReturnToSite={returnToPublicSite} />;
  }

  // 2. Maintenance Mode view for public site
  if (systemConfig.isMaintenanceMode) {
    return <MaintenanceView />;
  }

  // 3. Deployment updating view for public site
  if (systemConfig.isDeploying) {
    return <DeployingView />;
  }

  if (isResetView) {
    return <PasswordResetPage onReturnToSite={returnToPublicSite} />;
  }

  if (isRemoteView) {
    return <RemoteManagementPage onReturnToSite={returnToPublicSite} />;
  }

  if (isSurveyView) {
    return <SurveyPage onReturnToSite={returnToPublicSite} />;
  }

  if (isNotFoundView) {
    return <NotFoundPage onReturnToSite={returnToPublicSite} />;
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] relative selection:bg-[#0A2D6F] selection:text-white">
      {/* Fair Modal (When activated from Admin) */}
      <FairModal isOpen={isFairModalOpen} onClose={() => setIsFairModalOpen(false)} />

      {/* 1. Opening Experience Overlay */}
      <OpeningExperience scrollY={scrollY} />

      {/* 2. Glassmorphic Header Navigation */}
      <Header
        scrollY={scrollY}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenFairModal={() => setIsFairModalOpen(true)}
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

        <FaqSection />

        <ContactSection prefilledSubject={contactPrefill} />

        <NewsletterSection />
      </main>

      {/* 4. Footer */}
      <Footer
        onNavigate={scrollToSection}
        onAdminClick={() => setIsAdminView(true)}
        onOpenLegalDoc={(doc) => setLegalModalDoc(doc)}
      />

      {/* Legal Modal (Privacy, KVKK, Cookies) */}
      <LegalModal
        isOpen={Boolean(legalModalDoc)}
        initialType={legalModalDoc || 'privacy'}
        onClose={() => setLegalModalDoc(null)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent
        onOpenLegalDoc={(doc) => setLegalModalDoc(doc)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ImageProvider>
      <MainAppContent />
    </ImageProvider>
  );
}


