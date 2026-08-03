import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoFull } from '../brand/LogoFull';
import { Menu, X, PhoneCall, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { CONTACT_DATA } from '../../constants/data';
import { AnnouncementTicker } from './AnnouncementTicker';
import { FairInvitationStrip } from './FairInvitationStrip';
import { useAppImages } from '../../context/ImageContext';

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
  const { setIsManagerOpen } = useAppImages();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Header is always visible so navigation links and Ana Sayfa never disappear
  const isHeaderVisible = true;

  // Logo text "İrem Comfort" is shown clearly
  const showFullLogoText = true;

  const navLinks = [
    { id: 'hero', label: 'Ana Sayfa' },
    { id: 'about', label: 'Hakkımızda' },
    { id: 'collection', label: 'Koleksiyon' },
    { id: 'craftsmanship', label: 'Zanaat' },
    { id: 'why-us', label: 'Neden Biz' },
    { id: 'contact', label: 'İletişim' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            
            {/* Top Left Logo (Morphs smoothly between IC and IC + iremcomfort) */}
            <div 
              onClick={() => handleNavClick('hero')}
              className="flex items-center cursor-pointer group py-2"
            >
              <LogoFull 
                iconSize={40} 
                color="#0A2D6F" 
                showText={showFullLogoText} 
              />
            </div>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-3.5 py-2 text-xs lg:text-sm font-semibold tracking-wide uppercase transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'text-[#0A2D6F] font-bold'
                        : 'text-[#111111]/70 hover:text-[#0A2D6F]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] bg-[#0A2D6F] rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.5 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side: Trendyol & Contact Buttons & Mobile Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {CONTACT_DATA.trendyolUrl && (
                <a
                  href={CONTACT_DATA.trendyolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F27A1A] text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#d9660c] hover:shadow-lg hover:shadow-[#F27A1A]/30 cursor-pointer active:scale-95"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Trendyol</span>
                </a>
              )}

              <button
                onClick={() => handleNavClick('contact')}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#082C6C] text-white text-xs lg:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[#163E87] hover:shadow-lg hover:shadow-[#082C6C]/20 cursor-pointer active:scale-95"
              >
                <span>İletişim</span>
                <ChevronRight className="w-4 h-4 text-white/80" />
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
            className="fixed inset-x-0 top-20 z-30 bg-white/95 backdrop-blur-xl border-b border-[#0A2D6F]/10 shadow-2xl md:hidden px-6 py-8"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl text-left text-base font-medium transition-all ${
                      isActive
                        ? 'bg-[#0A2D6F] text-white font-semibold'
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
