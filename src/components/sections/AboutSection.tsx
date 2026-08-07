import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Feather, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

export const AboutSection: React.FC = () => {
  const { aboutSlides } = useAppImages();

  const slides = aboutSlides && aboutSlides.length > 0 ? aboutSlides : [
    {
      id: 'slide-1',
      image: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200',
      badge: 'İREM COMFORT • MANİSA',
      title: 'Hakiki Deri.',
      subtitle: 'Doğal Konfor.',
      alt: 'İrem Comfort Hakiki Deri Bayan Sandalet Model'
    }
  ];

  // Slider State & Slide Items
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const safeIndex = currentIndex >= slides.length ? 0 : currentIndex;

  // Autoplay every 5 seconds (5000ms), pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Drag / Touch Swipe Handling
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (_: any, { offset, velocity }: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold || offset.x < -50) {
      goToNext();
    } else if (swipe > swipeConfidenceThreshold || offset.x > 50) {
      goToPrev();
    }
  };

  // Keyboard navigation when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
    }
  };

  const pillars = [
    {
      icon: Shield,
      title: '%100 Hakiki Deri',
      desc: 'Sadece nefes alabilen, terleme yapmayan yumuşak hakiki dana ve kuzu saya derileri kullanıyoruz.'
    },
    {
      icon: Sparkles,
      title: 'Manisa İmalat Zanaatı',
      desc: 'Her bir terlik ve sandalet, Manisa Ayakkabıcılar Sitesindeki atölyemizde tecrübeli ustalarımızca özenle dikilir.'
    },
    {
      icon: Feather,
      title: 'Anatomik Konfor Taban',
      desc: 'Ayak kavislerini tam destekleyen, topuk yükünü emen özel ortopedik kavisli taban mimarisi.'
    },
    {
      icon: Compass,
      title: 'Şık & Fonksiyonel',
      desc: 'Çift tokalı klasiklerden ortopedik sabolara, hem işte hem günlük yaşamda zarif adımlar.'
    }
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#F8F8F8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#0A2D6F] uppercase"
          >
            <span className="w-8 h-[1px] bg-[#0A2D6F]" />
            <span>Mirasımız & Atölyemiz</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            Her Adımda <span className="font-serif-luxury font-bold text-[#0A2D6F]">Hakiki Deri</span> ve Esnek <span className="italic font-serif-luxury text-[#163E87]">Konfor</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-[#111111]/70 font-light leading-relaxed"
          >
            İrem Comfort olarak Manisa Ayakkabıcılar Sitesindeki imalathanemizde kadınların ayak sağlığı ve konforu için çalışıyoruz. %100 hakiki deri saya, yumuşatılmış iç taban ve ortopedik kavislerle ürettiğimiz bayan comfort terlik ve sandaletlerimiz, günün her saatinde hafif ve rahat adımlar atmanızı sağlar.
          </motion.p>
        </div>

        {/* Grid Showcase: Premium Image Slider + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Column 1: Premium Image Slider Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Slider Outer Box */}
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              role="region"
              aria-roledescription="carousel"
              aria-label="Manisa Atölye ve Hakiki Deri Görsel Galerisi"
              className="relative w-full h-[290px] sm:h-[400px] lg:h-[430px] rounded-3xl overflow-hidden shadow-2xl group select-none bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2D6F]/40"
            >
              {/* Fade & Zoom Image Slide with AnimatePresence */}
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={slides[safeIndex]?.id || 'slide-fallback'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  {/* Ken Burns Scale Effect (1.0 to 1.08 over 5s) */}
                  {slides[safeIndex]?.image ? (
                    <motion.img
                      src={slides[safeIndex]?.image}
                      alt={slides[safeIndex]?.alt || ''}
                      loading={safeIndex === 0 ? "eager" : "lazy"}
                      initial={{ scale: 1.0 }}
                      animate={{ scale: 1.08 }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('/public/uploads/')) {
                          const parts = target.src.split('/public/uploads/');
                          if (parts[1]) {
                            target.src = '/uploads/' + parts[1];
                            return;
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#062050] via-[#0A2D6F] to-[#030F26] flex items-center justify-center p-6 text-center text-white">
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                          {slides[safeIndex]?.badge || 'İrem Comfort'}
                        </span>
                        <h4 className="text-lg font-serif font-bold">{slides[safeIndex]?.title}</h4>
                      </div>
                    </div>
                  )}
                  
                  {/* Bottom Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />

                  {/* Top-Left Small Logo / Badge */}
                  <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10 pointer-events-none">
                    <motion.div
                      key={`badge-${safeIndex}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-[10px] sm:text-xs font-semibold tracking-widest text-white/95 uppercase shadow-md"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>{slides[safeIndex]?.badge}</span>
                    </motion.div>
                  </div>

                  {/* Bottom-Left Overlay Text */}
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-10 text-white space-y-1 sm:space-y-1.5 pointer-events-none">
                    <motion.h3
                      key={`title-${safeIndex}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-luxury leading-tight drop-shadow-md"
                    >
                      {slides[safeIndex]?.title}
                    </motion.h3>

                    {slides[safeIndex]?.subtitle && (
                      <motion.p
                        key={`sub-${safeIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-xs sm:text-sm font-light text-white/90 tracking-wide drop-shadow-sm"
                      >
                        {slides[safeIndex]?.subtitle}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows (Desktop Only - Visible on Hover) */}
              <div className="hidden sm:block">
                <button
                  onClick={goToPrev}
                  type="button"
                  aria-label="Önceki Slayt"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 cursor-pointer shadow-lg hover:border-white/40"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={goToNext}
                  type="button"
                  aria-label="Sonraki Slayt"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 cursor-pointer shadow-lg hover:border-white/40"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Pagination Dots (Centered Below Slider) */}
            <div className="flex items-center justify-center gap-2.5 mt-4">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  type="button"
                  aria-label={`Slayt ${idx + 1}: ${slide.title}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A2D6F]/40 ${
                    safeIndex === idx
                      ? 'w-8 h-2.5 bg-[#0A2D6F]'
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Column 2: Narrative Text */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-[#111111] font-serif-luxury">
                  Nefes Alan Hakiki Saya
                </h3>
                <p className="text-sm sm:text-base text-[#111111]/70 font-light leading-relaxed">
                  İmalatımızda kullanılan tüm deriler doğal yöntemlerle işlenmiş, terleme ve koku yapmayan yumuşak hakiki dana derileridir. Ayaklarınızı tahriş etmeden gün boyu nefes almasını sağlar.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#0A2D6F]/10">
                <h3 className="text-2xl font-semibold text-[#111111] font-serif-luxury">
                  Anatomik Taban Mimarisi
                </h3>
                <p className="text-sm sm:text-base text-[#111111]/70 font-light leading-relaxed">
                  Ayak taban kavisini ve topuğu mükemmel destekleyen poliüretan ve mantar taban yapımız, vücut ağırlığını dengeli dağıtarak bacak ve bel yorgunluğunu en aza indirir.
                </p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* 4 Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#0A2D6F]/10 shadow-sm hover:shadow-xl hover:border-[#0A2D6F]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0A2D6F]/5 flex items-center justify-center text-[#0A2D6F] mb-6 group-hover:bg-[#0A2D6F] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] font-serif-luxury mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#111111]/70 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

