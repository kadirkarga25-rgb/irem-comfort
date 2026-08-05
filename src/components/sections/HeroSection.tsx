import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { BRAND_ESTABLISHED, CONTACT_DATA } from '../../constants/data';
import { useAppImages } from '../../context/ImageContext';

interface HeroSectionProps {
  onDiscoverClick: () => void;
  onCraftsmanshipClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onDiscoverClick,
  onCraftsmanshipClick
}) => {
  const { images, heroConfig } = useAppImages();

  return (
    <section id="hero" className="relative min-h-screen pt-44 sm:pt-48 md:pt-44 lg:pt-36 pb-16 sm:pb-20 flex flex-col justify-between overflow-hidden bg-white">
      {/* Background Subtle Gradient & Mesh Accent */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-gradient-to-l from-[#F8F8F8] via-[#F8F8F8]/50 to-transparent -z-10 pointer-events-none" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-[#0A2D6F]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-8 z-10">
            
            {/* Top Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0A2D6F]/5 border border-[#0A2D6F]/15"
            >
              <Sparkles className="w-4 h-4 text-[#0A2D6F]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#0A2D6F]">
                {heroConfig?.badgeText || `Kuruluş ${BRAND_ESTABLISHED} • Manisa Ayakkabıcılar Sitesi İmalatı`}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-light tracking-tight text-[#111111] leading-[1.15]">
                {heroConfig?.title || 'Bayan Comfort Deri Sandalet & Terlik.'}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-[#111111]/70 font-light max-w-2xl leading-relaxed">
                {heroConfig?.description || '%100 Hakiki deri saya, ortopedik kavisli anatomik taban ve Manisa atölyemizin usta el işçiliği.'}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <button
                onClick={onDiscoverClick}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#082C6C] text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#163E87] hover:shadow-xl hover:shadow-[#082C6C]/25 active:scale-95 cursor-pointer"
              >
                <span>{heroConfig?.primaryBtnText || 'Koleksiyonu Keşfet'}</span>
                <ArrowDownRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </button>

              {CONTACT_DATA.trendyolUrl && (
                <a
                  href={CONTACT_DATA.trendyolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#F27A1A] text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#d9660c] hover:shadow-xl hover:shadow-[#F27A1A]/30 active:scale-95 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>Trendyol'da Satın Al</span>
                </a>
              )}

              <button
                onClick={onCraftsmanshipClick}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-[#082C6C]/20 text-[#082C6C] font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#082C6C]/5 hover:border-[#082C6C] cursor-pointer"
              >
                <span>{heroConfig?.secondaryBtnText || 'Atölyemiz'}</span>
              </button>
            </motion.div>

            {/* Key Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="pt-8 border-t border-[#0A2D6F]/10 grid grid-cols-3 gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#0A2D6F] font-bold text-base sm:text-xl font-serif-luxury">
                  <ShieldCheck className="w-4 h-4" />
                  <span>%100</span>
                </div>
                <p className="text-xs text-[#111111]/60 uppercase tracking-wider font-medium">Hakiki Deri</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#0A2D6F] font-bold text-base sm:text-xl font-serif-luxury">
                  <Award className="w-4 h-4" />
                  <span>Anatomik</span>
                </div>
                <p className="text-xs text-[#111111]/60 uppercase tracking-wider font-medium">Konfor Taban</p>
              </div>

              <div className="space-y-1">
                <div className="text-[#0A2D6F] font-bold text-base sm:text-xl font-serif-luxury">
                  Yerli
                </div>
                <p className="text-xs text-[#111111]/60 uppercase tracking-wider font-medium">Manisa İmalatı</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#0A2D6F]/15 border border-[#0A2D6F]/10 group"
            >
              <img
                src={images.heroImage}
                alt="İrem Comfort Çift Tokalı Hakiki Deri Bayan Terlik"
                className="w-full h-[480px] sm:h-[580px] object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('irem-comfort-logo')) {
                    target.src = '/uploads/logo/irem-comfort-logo.jpg';
                  }
                }}
              />

              {/* Glassmorphic Overlay Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-card border border-white/40 shadow-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-[#0A2D6F] uppercase">
                    İmza Modelimiz
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#0A2D6F] animate-ping" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] font-serif-luxury">
                  {heroConfig?.signatureModelTitle || 'Çift Tokalı Hakiki Deri Terlik'}
                </h3>
                <p className="text-xs text-[#111111]/70 line-clamp-1">
                  {heroConfig?.signatureModelSub || 'Yumuşak Dana Derisi Saya • Anatomik Yumuşak Konfor Taban'}
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
