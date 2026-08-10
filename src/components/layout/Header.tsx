import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoFull } from '../brand/LogoFull';
import { Menu, X, PhoneCall, ChevronRight, Globe, ChevronDown } from 'lucide-react';
import { CONTACT_DATA } from '../../constants/data';
import { AnnouncementTicker } from './AnnouncementTicker';
import { FairInvitationStrip } from './FairInvitationStrip';
import { useAppImages } from '../../context/ImageContext';
import { Language } from '../../types';

interface HeaderProps {
  scrollY: number;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenFairModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scrollY,
  activeSection,
  onNavigate,
  onOpenFairModal
}) => {
  const { sectionOrder, language, setLanguage, t } = useAppImages();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Header is always visible
  const isHeaderVisible = true;
  const showFullLogoText = true;

  const SECTION_LABELS: Record<string, string> = {
    hero: 'Ana Sayfa',
    'products-page': t.navProductsPage || 'Ürünlerimiz',
    collection: t.navCollection || 'Koleksiyon',
    about: t.navAbout || 'Hakkımızda',
    contact: t.navContact || 'İletişim',
    craftsmanship: t.navCraftsmanship || 'Zanaat',
    'why-us': t.navWhyUs || 'Neden Biz',
    testimonials: t.navTestimonials || 'Referanslar',
    faq: t.navFaq || 'SSS',
  };

  // Primary links visible directly on the desktop navbar
  const primaryIds = ['hero', 'products-page', 'collection', 'about', 'contact'];

  const defaultNavLinks = [
    { id: 'hero', label: 'Ana Sayfa' },
    { id: 'products-page', label: t.navProductsPage || 'Ürünlerimiz' },
    { id: 'collection', label: t.navCollection || 'Koleksiyon' },
    { id: 'about', label: t.navAbout || 'Hakkımızda' },
    { id: 'contact', label: t.navContact || 'İletişim' },
    { id: 'craftsmanship', label: t.navCraftsmanship || 'Zanaat' },
    { id: 'why-us', label: t.navWhyUs || 'Neden Biz' },
    { id: 'testimonials', label: t.navTestimonials || 'Referanslar' },
    { id: 'faq', label: t.navFaq || 'SSS' }
  ];

  const primaryNavLinks = [
    { id: 'hero', label: language === 'tr' ? 'Ana Sayfa' : language === 'en' ? 'Home' : 'الرئيسية' },
    { id: 'collection', label: t.navCollection || (language === 'tr' ? 'Koleksiyon' : language === 'en' ? 'Collection' : 'المجموعة') },
    { id: 'about', label: t.navAbout || (language === 'tr' ? 'Hakkımızda' : language === 'en' ? 'About' : 'عن الشركة') },
    { id: 'contact', label: t.navContact || (language === 'tr' ? 'İletişim' : language === 'en' ? 'Contact' : 'اتصل بنا') },
    { id: 'products-page', label: t.navProductsPage || (language === 'tr' ? 'Ürünlerimiz' : language === 'en' ? 'Products' : 'منتجاتنا') },
  ];

  const secondaryNavLinks = [
    { id: 'craftsmanship', label: t.navCraftsmanship || (language === 'tr' ? 'Zanaat & Atölye' : language === 'en' ? 'Workshop' : 'الورشة') },
    { id: 'why-us', label: t.navWhyUs || (language === 'tr' ? 'Neden İrem Comfort?' : language === 'en' ? 'Why Us' : 'لماذا نحن') },
    { id: 'testimonials', label: t.navTestimonials || (language === 'tr' ? 'Müşteri Yorumları' : language === 'en' ? 'Reviews' : 'التقييمات') },
    { id: 'faq', label: t.navFaq || (language === 'tr' ? 'Sıkça Sorulan Sorular' : language === 'en' ? 'FAQ' : 'الأسئلة') },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isHeaderVisible ? 0 : -100,
          opacity: isHeaderVisible ? 1 : 0
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 shadow-sm"
      >
        <div className="glass-header">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
            
            {/* Top Left Logo */}
            <div 
              onClick={() => handleNavClick('hero')}
              className="flex items-center cursor-pointer group py-1.5 shrink-0"
            >
              <LogoFull 
                iconSize={32} 
                color="#0A2D6F" 
                showText={showFullLogoText} 
              />
            </div>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 shrink">
              {primaryNavLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-2 lg:px-3 py-1.5 text-[11px] xl:text-xs font-extrabold tracking-wider uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#0A2D6F]'
                        : 'text-[#111111]/70 hover:text-[#0A2D6F]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#0A2D6F] rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.5 }}
                      />
                    )}
                  </button>
                );
              })}

              {/* "Daha Fazla / More" Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] xl:text-xs font-bold tracking-wider uppercase text-[#111111]/70 hover:text-[#0A2D6F] transition-colors cursor-pointer whitespace-nowrap rounded-lg hover:bg-[#062050]/5"
                >
                  <span>{language === 'tr' ? 'Diğer' : language === 'en' ? 'More' : 'المزيد'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-[#0A2D6F]' : ''}`} />
                </button>

                {moreMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    {secondaryNavLinks.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => handleNavClick(sec.id)}
                        className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                          activeSection === sec.id ? 'text-[#0A2D6F] bg-blue-50/80 font-extrabold' : 'text-slate-700'
                        }`}
                      >
                        <span>{sec.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side: Language Selector, Trendyol & Contact Buttons & Mobile Toggle */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#062050]/5 hover:bg-[#062050]/10 text-[#062050] text-[11px] font-extrabold transition-all border border-[#062050]/15 cursor-pointer"
                  title="Language / Dil Seçimi"
                >
                  <Globe className="w-3 h-3 text-[#062050]" />
                  <span className="uppercase font-mono">{language}</span>
                  <span className="text-xs">
                    {language === 'tr' ? '🇹🇷' : language === 'en' ? '🇬🇧' : '🇸🇦'}
                  </span>
                </button>

                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <button
                      onClick={() => { setLanguage('tr'); setLangMenuOpen(false); }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        language === 'tr' ? 'text-[#062050] bg-blue-50/80 font-extrabold' : 'text-slate-700'
                      }`}
                    >
                      <span>Türkçe</span>
                      <span>🇹🇷</span>
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        language === 'en' ? 'text-[#062050] bg-blue-50/80 font-extrabold' : 'text-slate-700'
                      }`}
                    >
                      <span>English</span>
                      <span>🇬🇧</span>
                    </button>
                    <button
                      onClick={() => { setLanguage('ar'); setLangMenuOpen(false); }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        language === 'ar' ? 'text-[#062050] bg-blue-50/80 font-extrabold' : 'text-slate-700'
                      }`}
                    >
                      <span>العربية</span>
                      <span>🇸🇦</span>
                    </button>
                  </div>
                )}
              </div>

              {CONTACT_DATA.trendyolUrl && (
                <a
                  href={CONTACT_DATA.trendyolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F27A1A] text-white text-[11px] font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#d9660c] hover:shadow-md cursor-pointer active:scale-95"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Trendyol</span>
                </a>
              )}

              <button
                onClick={() => handleNavClick('contact')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#082C6C] text-white text-[11px] xl:text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#163E87] hover:shadow-md cursor-pointer active:scale-95"
              >
                <span>{t.navContact || 'İletişim'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/80" />
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#0A2D6F] hover:bg-[#0A2D6F]/5 transition-colors cursor-pointer"
                aria-label="Gezinme Menüsünü Aç"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Continuous Announcement Ticker Right Below Header Nav Bar */}
        <AnnouncementTicker onContactClick={() => handleNavClick('contact')} />

        {/* Fair Invitation Banner (If active) */}
        {onOpenFairModal && (
          <FairInvitationStrip onOpenFairModal={onOpenFairModal} />
        )}
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-30 bg-white/95 backdrop-blur-xl border-b border-[#0A2D6F]/10 shadow-2xl md:hidden px-6 py-8 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col space-y-3">
              {[...primaryNavLinks, ...secondaryNavLinks].map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl text-left text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#0A2D6F] text-white'
                        : 'text-[#111111] hover:bg-[#0A2D6F]/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0A2D6F]/40'}`} />
                  </button>
                );
              })}

              <div className="pt-4 border-t border-[#0A2D6F]/10 flex flex-col gap-3">
                {CONTACT_DATA.trendyolUrl && (
                  <a
                    href={CONTACT_DATA.trendyolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-[#F27A1A] text-white text-center text-sm font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>Trendyol Mağazamıza Git</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full py-3.5 rounded-xl bg-[#082C6C] text-white text-center text-sm font-semibold tracking-wider uppercase shadow-md active:scale-98"
                >
                  İletişim & Atölye
                </button>

                <a
                  href={`tel:${CONTACT_DATA.phone}`}
                  className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-[#0A2D6F] tracking-wide uppercase"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{CONTACT_DATA.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
