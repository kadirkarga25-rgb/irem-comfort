import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useAppImages } from '../../context/ImageContext';
import { 
  Calendar, MapPin, QrCode, X, Clock, Send, ExternalLink, 
  Sparkles, ChevronRight, Navigation, Mail, Scissors, Building2
} from 'lucide-react';

interface FairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairModal: React.FC<FairModalProps> = ({ isOpen, onClose }) => {
  const { fairConfig, heroConfig, trackEvent, t, language } = useAppImages();
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [cutProgress, setCutProgress] = useState(0); // 0 to 100%
  const cutTrackRef = useRef<HTMLDivElement>(null);

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isStarted: boolean;
    isEnded: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, isEnded: false });

  // Fire blue/white confetti upon modal open & track metric
  useEffect(() => {
    if (isOpen && fairConfig.enabled) {
      setIsEnvelopeOpened(false);
      setCutProgress(0);
      if (trackEvent) trackEvent('fairModalOpens');
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#062050', '#082C6C', '#2563EB', '#3B82F6', '#FFFFFF', '#10B981']
        });
      } catch (err) {
        console.warn('Confetti launch skipped:', err);
      }
    }
  }, [isOpen, fairConfig.enabled, trackEvent]);

  useEffect(() => {
    if (!fairConfig.startDate) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const start = new Date(fairConfig.startDate).getTime();
      const end = new Date(fairConfig.endDate || fairConfig.startDate).getTime() + (24 * 60 * 60 * 1000);

      if (now >= start && now <= end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true, isEnded: false });
        return;
      }

      if (now > end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: false, isEnded: true });
        return;
      }

      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isStarted: false, isEnded: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [fairConfig.startDate, fairConfig.endDate]);

  if (!isOpen || !fairConfig.enabled) return null;

  const triggerOpenAnimation = () => {
    setCutProgress(100);
    if (trackEvent) trackEvent('fairCuts');
    setTimeout(() => {
      setIsEnvelopeOpened(true);
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#062050', '#082C6C', '#2563EB', '#3B82F6', '#FFFFFF', '#10B981']
        });
      } catch {
        // Confetti fallback
      }
    }, 250);
  };

  const handleCutDrag = (_: any, info: any) => {
    if (!cutTrackRef.current) return;
    const trackWidth = cutTrackRef.current.getBoundingClientRect().width;
    if (trackWidth <= 0) return;

    const newProgress = Math.min(100, Math.max(0, (info.point.x - cutTrackRef.current.getBoundingClientRect().left) / trackWidth * 100));
    setCutProgress(newProgress);

    if (newProgress >= 80) {
      triggerOpenAnimation();
    }
  };

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

  const qrSrc = fairConfig.qrCodeUrl || 
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://wa.me/' + (fairConfig.whatsappContact || '905336688329'))}`;

  const logoUrl = heroConfig?.logoUrl || '/logo.png';

  return (
    <AnimatePresence>
      <div 
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
        className="lenis-prevent fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
      >
        {/* Backdrop click to close */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} 
          className="fixed inset-0" 
        />

        {/* Modal Envelope Window */}
        <motion.div
          data-lenis-prevent="true"
          data-lenis-prevent-touch="true"
          initial={{ opacity: 0, scale: 0.88, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="lenis-prevent relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-200 z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* STEP 1: Sealed Interactive Scissors Cut Envelope in Blue & White */}
          {!isEnvelopeOpened ? (
            <div className="p-6 sm:p-8 bg-gradient-to-br from-[#041638] via-[#062050] to-[#0D3B8B] text-white text-center flex flex-col items-center justify-between relative min-h-[480px] overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-20"
                aria-label={language === 'tr' ? 'Kapat' : language === 'en' ? 'Close' : 'إغلاق'}
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Crisp white/blue inner border frame */}
              <div className="absolute inset-3 border border-white/20 rounded-2xl pointer-events-none" />

              {/* Top Scissors Cut Line */}
              <div className="w-full max-w-lg mt-1 relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-white uppercase tracking-widest px-1">
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-blue-300 rotate-90" />
                    <span>{language === 'tr' ? 'Üstünü Çizgiden Kesin' : language === 'en' ? 'Cut Along The Line' : 'قص الخط لفتح البطاقة'}</span>
                  </span>
                  <span className="text-blue-200 font-mono">
                    {Math.round(cutProgress)}% {language === 'tr' ? 'KESİLDİ' : language === 'en' ? 'CUT' : 'تم القص'}
                  </span>
                </div>

                {/* Dotted Cut Track */}
                <div 
                  ref={cutTrackRef}
                  className="relative w-full h-12 bg-[#020d24]/90 rounded-2xl border-2 border-dashed border-white/60 p-1 flex items-center overflow-hidden cursor-pointer shadow-inner"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickPct = Math.min(100, Math.max(0, (e.clientX - rect.left) / rect.width * 100));
                    setCutProgress(clickPct);
                    if (clickPct >= 70) triggerOpenAnimation();
                  }}
                >
                  {/* Sliced cut bar */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600/40 to-blue-400/60 border-r-2 border-white transition-all duration-150"
                    style={{ width: `${cutProgress}%` }}
                  />

                  {/* Watermark text */}
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white/50 tracking-widest uppercase pointer-events-none">
                    {language === 'tr'
                      ? '─── ✂️ MAKASI SAĞA KAYDIRIN VEYA TIKLAYIN ───'
                      : language === 'en'
                      ? '─── ✂️ SLIDE SCISSORS OR TAP TO OPEN ───'
                      : '─── ✂️ اسحب المقص أو اضغط للفتح ───'}
                  </div>

                  {/* Draggable Scissors Knob */}
                  <motion.div
                    drag="x"
                    dragConstraints={cutTrackRef}
                    dragElastic={0}
                    onDrag={handleCutDrag}
                    style={{ left: `${Math.min(92, Math.max(0, cutProgress))}%` }}
                    className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white text-[#062050] flex items-center justify-center shadow-lg border border-blue-200 cursor-grab active:cursor-grabbing z-20"
                  >
                    <Scissors className="w-5 h-5 fill-[#062050] animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Envelope Center: Official Company Logo Card */}
              <div className="my-5 flex flex-col items-center justify-center relative z-10 w-full">
                
                {/* Logo Frame Box */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/95 backdrop-blur-md px-8 py-5 rounded-2xl shadow-xl border border-white/60 flex flex-col items-center gap-2 max-w-sm w-full"
                >
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="İrem Comfort Logo" 
                      className="h-12 sm:h-16 object-contain filter drop-shadow-sm" 
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-[#062050]">
                      <Building2 className="w-6 h-6 text-[#062050]" />
                      <span className="text-xl font-extrabold font-serif-luxury tracking-wider">
                        İREM COMFORT
                      </span>
                    </div>
                  )}

                  <div className="w-12 h-0.5 bg-[#062050]/20 rounded-full my-0.5" />

                  <span className="text-[10px] text-[#062050] font-extrabold uppercase tracking-widest">
                    {language === 'tr' ? 'Hakiki Deri & Atölye Üretimi' : language === 'en' ? 'Genuine Leather & Handcrafted' : 'صناعة يدوية من الجلد الطبيعي'}
                  </span>
                </motion.div>
              </div>

              {/* Title & Invitation Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2 max-w-lg mb-1 z-10"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/15 border border-white/30 text-white text-xs font-extrabold uppercase tracking-widest shadow-sm">
                  <Mail className="w-4 h-4 text-white" />
                  <span>
                    {language === 'tr' ? 'SAYIN ZİYARETÇİMİZ, DAVETLİSİNİZ!' : language === 'en' ? 'DEAR VISITOR, YOU ARE INVITED!' : 'زائرنا الكريم، أنتم مدعوون!'}
                  </span>
                </span>

                <h2 className="text-xl sm:text-2xl font-extrabold font-serif-luxury tracking-wide text-white pt-1">
                  {fairConfig.name}
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 font-medium flex items-center justify-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-200 shrink-0" />
                  <span>
                    {fairConfig.location} — {language === 'tr' ? 'Stand:' : language === 'en' ? 'Booth:' : 'الجناح:'}{' '}
                    <strong className="text-[#062050] bg-white px-2 py-0.5 rounded font-mono font-bold">{fairConfig.standNumber}</strong>
                  </span>
                </p>
              </motion.div>

              {/* Open Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={triggerOpenAnimation}
                className="py-3.5 px-8 rounded-full bg-white hover:bg-blue-50 text-[#062050] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-2xl transition-all flex items-center gap-2.5 cursor-pointer border border-white z-10"
              >
                <Scissors className="w-4 h-4 text-[#062050]" />
                <span>
                  {language === 'tr' ? '✂️ DAVETİYEYİ KESİP AÇ & İNCELE' : language === 'en' ? '✂️ OPEN & VIEW INVITATION' : '✂️ فتح واستعراض بطاقة الدعوة'}
                </span>
                <ChevronRight className="w-4 h-4 text-[#062050]" />
              </motion.button>
            </div>
          ) : (
            /* STEP 2: Unfolded Full Fair Details Poster & Info in Blue & White */
            <motion.div
              initial={{ opacity: 0, rotateX: -15 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Top Banner Header in Navy Blue */}
              <div className="bg-gradient-to-r from-[#041638] via-[#062050] to-[#082C6C] text-white p-5 sm:p-6 relative shrink-0 border-b border-blue-200/20">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#062050] text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#062050]" />
                    <span>
                      {fairConfig.badgeText || (language === 'tr' ? 'ÖZEL FUAR DAVETİ' : language === 'en' ? 'SPECIAL FAIR INVITATION' : 'دعوة خاصة لمعرضنا')}
                    </span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-wide text-white">
                  {fairConfig.name}
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 mt-1 flex items-center gap-1.5 font-light">
                  <MapPin className="w-4 h-4 text-blue-200 shrink-0" />
                  <span>{fairConfig.location}</span>
                </p>
              </div>

              {/* Body Content */}
              <div 
                data-lenis-prevent="true"
                data-lenis-prevent-touch="true"
                className="lenis-prevent p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1 touch-pan-y text-slate-800"
              >
                {/* Countdown / Status Banner */}
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 shadow-sm text-center">
                  {timeLeft.isStarted ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        {language === 'tr' ? 'FUARIMIZ BAŞLADI!' : language === 'en' ? 'THE FAIR HAS STARTED!' : 'بدأ المعرض الآن!'}
                      </span>
                      <p className="text-sm font-bold text-[#062050] mt-2">
                        {language === 'tr' ? 'Standımıza Davetlisiniz:' : language === 'en' ? 'You are invited to our booth:' : 'أنتم مدعوون لجناحنا:'}{' '}
                        <span className="bg-[#062050] text-white px-2.5 py-0.5 rounded ml-1 font-mono">{fairConfig.standNumber}</span>
                      </p>
                    </div>
                  ) : timeLeft.isEnded ? (
                    <p className="text-xs font-bold text-slate-600">
                      {language === 'tr'
                        ? 'Bu fuar etkinliği tamamlanmıştır. Gelecek fuarlarımız için bizi takip edin!'
                        : language === 'en'
                        ? 'This fair has concluded. Follow us for upcoming exhibitions!'
                        : 'انتهت فعاليات هذا المعرض. تابعونا للمعارض القادمة!'}
                    </p>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#062050] uppercase tracking-wider mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>
                          {language === 'tr'
                            ? 'Fuara Kalan Süre — Yerinizi Hemen Alın!'
                            : language === 'en'
                            ? 'Countdown to Fair — Book Your Visit!'
                            : 'الوقت المتبقي للمعرض — احجز موعدك الآن!'}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto text-center">
                        <div className="bg-white p-2 rounded-xl border border-blue-200 shadow-xs">
                          <span className="block text-lg font-extrabold text-[#062050] font-mono">{timeLeft.days}</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {language === 'tr' ? 'GÜN' : language === 'en' ? 'DAYS' : 'يوم'}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-blue-200 shadow-xs">
                          <span className="block text-lg font-extrabold text-[#062050] font-mono">{timeLeft.hours}</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {language === 'tr' ? 'SAAT' : language === 'en' ? 'HOURS' : 'ساعة'}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-blue-200 shadow-xs">
                          <span className="block text-lg font-extrabold text-[#062050] font-mono">{timeLeft.minutes}</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {language === 'tr' ? 'DAKİKA' : language === 'en' ? 'MINUTES' : 'دقيقة'}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-blue-200 shadow-xs">
                          <span className="block text-lg font-extrabold text-[#062050] font-mono">{timeLeft.seconds}</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {language === 'tr' ? 'SANİYE' : language === 'en' ? 'SECONDS' : 'ثانية'}
                          </span>
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
                        <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                          {fairConfig.startDate} — {fairConfig.endDate}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Information & Stand Number */}
                  <div className={`${fairConfig.posterUrl ? 'sm:col-span-7' : 'sm:col-span-12'} space-y-3`}>
                    
                    {/* Stand Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {language === 'tr' ? 'Stand & Konum Bilgisi' : language === 'en' ? 'Booth & Location Info' : 'معلومات الجناح والموقع'}
                      </span>
                      <div className="text-sm font-extrabold text-[#062050] flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{fairConfig.standNumber}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {fairConfig.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 pt-1">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-[#062050] px-2.5 py-1 rounded-lg border border-blue-100">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {language === 'tr' ? 'Tarih:' : language === 'en' ? 'Date:' : 'التاريخ:'} {fairConfig.startDate} - {fairConfig.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="p-4 rounded-2xl bg-[#062050] text-white flex flex-col sm:flex-row items-center gap-4 justify-between border border-blue-200/20 shadow-md">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                      <QrCode className="w-4 h-4 text-blue-300" />
                      <span>
                        {language === 'tr'
                          ? 'Katılım & Stand Ziyareti QR Kodu'
                          : language === 'en'
                          ? 'Attendance & Booth Visit QR Code'
                          : 'رمز الاستجابة السريعة لزيارة الجناح'}
                      </span>
                    </div>
                    <p className="text-xs text-blue-100/90 max-w-xs leading-snug">
                      {language === 'tr'
                        ? 'Kameranızla QR kodunu okutarak stand konumumuzu kaydedin ve WhatsApp üzerinden doğrudan randevu alın.'
                        : language === 'en'
                        ? 'Scan the QR code with your camera to save our booth location and book an appointment directly via WhatsApp.'
                        : 'امسح الرمز بكاميرا هاتفك لحفظ موقع الجناح وحجز موعد مباشرة عبر واتساب.'}
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
                    <span>
                      {language === 'tr' ? "WhatsApp'tan Randevu Al" : language === 'en' ? 'Book via WhatsApp' : 'حجز موعد عبر واتساب'}
                    </span>
                  </button>

                  <button
                    onClick={handleOpenMaps}
                    className="py-3 px-4 rounded-xl bg-[#062050] hover:bg-[#082C6C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-white/20"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                    <span>
                      {language === 'tr' ? 'Haritada Konumu Aç' : language === 'en' ? 'Open in Maps' : 'فتح الموقع على الخريطة'}
                    </span>
                  </button>
                </div>

              </div>

              {/* Footer Note */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                <span>
                  {language === 'tr'
                    ? 'İrem Comfort Manisa Ayakkabıcılar Sitesi'
                    : language === 'en'
                    ? 'İrem Comfort Manisa Footwear Industry Park'
                    : 'إرم كومفورت - مجمع مصنعي الأحذية بمانيسا'}
                </span>
                <button
                  onClick={onClose}
                  className="text-[#062050] font-bold hover:underline cursor-pointer"
                >
                  {language === 'tr' ? 'Siteye Devam Et' : language === 'en' ? 'Continue to Website' : 'المتابعة إلى الموقع'}
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
