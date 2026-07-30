import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoIC } from '../brand/LogoIC';

interface OpeningExperienceProps {
  onIntroComplete?: () => void;
  scrollY: number;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ scrollY }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // When user scrolls down even 15px, start collapsing the opening screen
  useEffect(() => {
    if (scrollY > 20 && !isDismissed) {
      setIsDismissed(true);
    }
  }, [scrollY, isDismissed]);

  // Handle manual trigger click/touch to explore
  const handleStartExplore = () => {
    setIsDismissed(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Unmount overlay after animation finishes
  useEffect(() => {
    if (isDismissed) {
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  if (!isMounted) return null;

  // Calculate morph progress (0 = centered full, 1 = moved to top left)
  const morphProgress = Math.min(1, Math.max(0, scrollY / 180));

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isDismissed ? 0 : 1 - morphProgress }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleStartExplore}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white cursor-pointer select-none overflow-hidden"
          style={{
            pointerEvents: isDismissed ? 'none' : 'auto'
          }}
        >
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute w-[500px] h-[500px] bg-[#0A2D6F]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Center Logo with Apple-level entrance animation */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center text-center px-4"
          >
            <div className="relative">
              <LogoIC size={180} color="#082C6C" className="drop-shadow-lg" />
              
              {/* Subtle pulsing ring glow */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-[#082C6C]/30 -m-4 pointer-events-none"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-8 text-[#082C6C] tracking-[0.35em] text-xs font-bold uppercase"
            >
              İrem Comfort
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="mt-2 text-[#111111]/80 text-sm font-light tracking-wide max-w-sm"
            >
              %100 Hakiki Deri Bayan Comfort Sandalet & Terlik
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="mt-1 text-xs text-[#082C6C] font-medium tracking-widest uppercase"
            >
              Manisa Ayakkabıcılar Sitesi İmalatı
            </motion.p>
          </motion.div>

          {/* Interactive Scroll Down Cue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#082C6C] font-semibold">
              Aşağı Kaydırın veya Tıklayın
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-8 rounded-full border-2 border-[#082C6C]/40 flex justify-center p-1"
            >
              <div className="w-1 h-2 bg-[#082C6C] rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
