import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { 
  Calendar, MapPin, QrCode, X, Clock, Send, ExternalLink, 
  Sparkles, CheckCircle2, ChevronRight, Navigation
} from 'lucide-react';

interface FairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairModal: React.FC<FairModalProps> = ({ isOpen, onClose }) => {
  const { fairConfig } = useAppImages();

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isStarted: boolean;
    isEnded: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, isEnded: false });

  useEffect(() => {
    if (!fairConfig.startDate) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const start = new Date(fairConfig.startDate + 'T09:00:00').getTime();
      const end = new Date((fairConfig.endDate || fairConfig.startDate) + 'T19:00:00').getTime();

      if (now > end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, isEnded: true });
        return;
      }

      if (now >= start && now <= end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true, isEnded: false });
        return;
      }

      const diff = start - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isStarted: false, isEnded: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [fairConfig.startDate, fairConfig.endDate]);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen && fairConfig.enabled) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, fairConfig.enabled]);

  if (!isOpen || !fairConfig.enabled) return null;

  const handleWhatsappAppointment = () => {
    const text = encodeURIComponent(
      `Merhaba İrem Comfort, ${fairConfig.name} fuarı için standınızı (${fairConfig.standNumber}) ziyaret etmek ve ürün koleksiyonunuz hakkında bilgi almak istiyorum.`
    );
    const phone = fairConfig.whatsappContact || '905336688329';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${fairConfig.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // QR Code URL: fallback to dynamic qr generator if empty
  const qrSrc = fairConfig.qrCodeUrl || 
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://wa.me/' + (fairConfig.whatsappContact || '905336688329'))}`;

  return (
    <AnimatePresence>
      <div 
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
        className="lenis-prevent fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-hidden"
      >
        
        {/* Backdrop click to close */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} 
          className="fixed inset-0" 
        />

        {/* Modal Window */}
        <motion.div
          data-lenis-prevent="true"
          data-lenis-prevent-touch="true"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="lenis-prevent relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-500/20 z-10 my-auto max-h-[85vh] flex flex-col"
        >
          {/* Top Banner Gradient Header (Fixed/Shrink-0) */}
          <div className="bg-gradient-to-r from-[#082C6C] via-[#0A2D6F] to-[#163E87] text-white p-5 sm:p-6 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-[#082C6C] text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>{fairConfig.badgeText || 'ÖZEL FUAR DAVETİ'}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-wide text-white">
              {fairConfig.name}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 flex items-center gap-1.5 font-light">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{fairConfig.location}</span>
            </p>
          </div>

          {/* Body Content (Scrollable Container) */}
          <div 
            data-lenis-prevent="true"
            data-lenis-prevent-touch="true"
            className="lenis-prevent p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1 touch-pan-y"
          >

            {/* Countdown / Status Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-orange-50 border border-amber-300/60 shadow-sm text-center">
              {timeLeft.isStarted ? (
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    FUARIMIZ BAŞLADI!
                  </span>
                  <p className="text-sm font-bold text-[#082C6C] mt-2">
                    Standımıza Davetlisiniz: <span className="bg-[#082C6C] text-amber-300 px-2 py-0.5 rounded ml-1 font-mono">{fairConfig.standNumber}</span>
                  </p>
                </div>
              ) : timeLeft.isEnded ? (
                <p className="text-xs font-bold text-slate-600">
                  Bu fuar etkinliği tamamlanmıştır. Gelecek fuarlarımız için bizi takip edin!
                </p>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Fuara Kalan Süre — Yerinizi Hemen Alın!</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto text-center">
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <span className="block text-lg font-extrabold text-[#082C6C] font-mono">{timeLeft.days}</span>
                      <span className="text-[10px] text-slate-500 font-medium">GÜN</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <span className="block text-lg font-extrabold text-[#082C6C] font-mono">{timeLeft.hours}</span>
                      <span className="text-[10px] text-slate-500 font-medium">SAAT</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <span className="block text-lg font-extrabold text-[#082C6C] font-mono">{timeLeft.minutes}</span>
                      <span className="text-[10px] text-slate-500 font-medium">DAKİKA</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <span className="block text-lg font-extrabold text-[#082C6C] font-mono">{timeLeft.seconds}</span>
                      <span className="text-[10px] text-slate-500 font-medium">SANİYE</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Poster & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              
              {/* Poster Image */}
              {fairConfig.posterUrl && (
                <div className="sm:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md h-48 sm:h-56 bg-slate-100 group">
                  <img
                    src={fairConfig.posterUrl}
                    alt={fairConfig.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      {fairConfig.startDate} — {fairConfig.endDate}
                    </span>
                  </div>
                </div>
              )}

              {/* Information & Stand Number */}
              <div className={`${fairConfig.posterUrl ? 'sm:col-span-7' : 'sm:col-span-12'} space-y-3`}>
                
                {/* Stand Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stand & Konum Bilgisi</span>
                  <div className="text-sm font-extrabold text-[#082C6C] flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{fairConfig.standNumber}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {fairConfig.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 pt-1">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-[#082C6C] px-2.5 py-1 rounded-lg border border-blue-100">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Tarih: {fairConfig.startDate} - {fairConfig.endDate}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-4 justify-between border border-slate-800">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <QrCode className="w-4 h-4" />
                  <span>Katılım & Stand Ziyareti QR Kodu</span>
                </div>
                <p className="text-xs text-slate-300 max-w-xs leading-snug">
                  Kameranızla QR kodunu okutarak stand konumumuzu kaydedin ve WhatsApp üzerinden doğrudan randevu alın.
                </p>
              </div>

              <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
                <img src={qrSrc} alt="Fuar QR Kodu" className="w-24 h-24 object-contain" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleWhatsappAppointment}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp'tan Randevu Al</span>
              </button>

              <button
                onClick={handleOpenMaps}
                className="py-3 px-4 rounded-xl bg-[#082C6C] hover:bg-[#163E87] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Haritada Konumu Aç</span>
              </button>
            </div>

          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <span>İrem Comfort Manisa Ayakkabıcılar Sitesi</span>
            <button
              onClick={onClose}
              className="text-[#082C6C] font-bold hover:underline cursor-pointer"
            >
              Siteye Devam Et
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
