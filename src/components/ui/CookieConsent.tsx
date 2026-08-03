import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldCheck, Check, X } from 'lucide-react';
import { LegalDocType } from './LegalModal';

interface CookieConsentProps {
  onOpenLegalDoc: (docType: LegalDocType) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenLegalDoc }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('irem_cookie_consent');
    if (!consent) {
      // Small delay for smooth entry after load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('irem_cookie_consent', 'all');
    localStorage.setItem('irem_cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('irem_cookie_consent', 'necessary');
    localStorage.setItem('irem_cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-white/10"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-serif-luxury">
                <span>Çerez Deneyimi & Veri İzni</span>
              </h4>
              <button
                onClick={handleAcceptNecessary}
                className="text-white/40 hover:text-white p-1 transition-colors cursor-pointer"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Size daha iyi bir deneyim sunabilmek, site fonksiyonlarını çalıştırmak ve tercihinizi hatırlamak amacıyla çerezler (cookies) kullanıyoruz. Ayrıntılar için{' '}
              <button
                type="button"
                onClick={() => onOpenLegalDoc('kvkk')}
                className="text-amber-300 underline hover:text-amber-200 transition-colors cursor-pointer inline-block"
              >
                KVKK Metni
              </button>{' '}
              veya{' '}
              <button
                type="button"
                onClick={() => onOpenLegalDoc('privacy')}
                className="text-amber-300 underline hover:text-amber-200 transition-colors cursor-pointer inline-block"
              >
                Gizlilik Politikası
              </button>
              'mızı inceleyebilirsiniz.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tümünü Kabul Et</span>
              </button>

              <button
                onClick={handleAcceptNecessary}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Sadece Zorunlu
              </button>

              <button
                onClick={() => onOpenLegalDoc('cookies')}
                className="px-2.5 py-2 text-xs text-white/60 hover:text-white underline cursor-pointer flex items-center gap-1 ml-auto"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Çerez Detayları</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
