import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoIC } from '../brand/LogoIC';

interface OpeningExperienceProps {
  onIntroComplete?: () => void;
  scrollY: number;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onIntroComplete, scrollY }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const touchStartY = useRef<number>(0);

  const dismiss = () => {
    if (!isDismissed) {
      setIsDismissed(true);
      if (onIntroComplete) onIntroComplete();
    }
  };

  // If window scrolled past 10px, dismiss
  useEffect(() => {
    if (scrollY > 10 && !isDismissed) {
      dismiss();
    }
  }, [scrollY, isDismissed]);

  // Window event listeners for global scroll / keys / touch
  useEffect(() => {
    if (isDismissed) return;

    const handleGlobalWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2 || Math.abs(e.deltaX) > 2) {
        dismiss();
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'Space', ' ', 'Enter'].includes(e.key)) {
        dismiss();
      }
    };

    const handleGlobalScroll = () => {
      if (window.scrollY > 5) {
        dismiss();
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('scroll', handleGlobalScroll);
    };
  }, [isDismissed]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0]?.clientY || 0;
    if (Math.abs(touchStartY.current - currentY) > 5) {
      dismiss();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 2 || Math.abs(e.deltaX) > 2) {
      dismiss();
    }
  };

  const handleContainerClick = () => {
    dismiss();
  };

  // Unmount overlay after animation finishes
  useEffect(() => {
    if (isDismissed) {
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isDismissed ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onClick={handleContainerClick}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
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
