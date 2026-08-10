import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, CheckCircle2, Info, Sparkles, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(38);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);

  // Strictly lock background body & html scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      return () => {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
      };
    }
  }, [isOpen]);

  // Non-passive wheel event handler on overlay / scroll container to prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const overlayEl = modalOverlayRef.current;
    if (!overlayEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent background page from scrolling
      e.stopPropagation();
      
      // Directly scroll the modal content container
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
      e.preventDefault();
    };

    overlayEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      overlayEl.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  const sizeChart = [
    { eu: 36, cm: '22.5', us: '5.5', uk: '3.0', note: 'Dar / Küçük Ayak' },
    { eu: 37, cm: '23.2', us: '6.5', uk: '4.0', note: 'Standart / İnce Ayak' },
    { eu: 38, cm: '24.0', us: '7.5', uk: '5.0', note: 'En Çok Tercih Edilen' },
    { eu: 39, cm: '24.7', us: '8.5', uk: '6.0', note: 'Standart Ayak' },
    { eu: 40, cm: '25.5', us: '9.0', uk: '6.5', note: 'Geniş / Taraklı Ayak' },
    { eu: 41, cm: '26.2', us: '10.0', uk: '7.5', note: 'Büyük Numara' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        ref={modalOverlayRef}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl h-[88vh] max-h-[750px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10 flex flex-col select-text"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#062050] via-[#0A2D6F] to-[#163E87] p-5 sm:p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-[#D4AF37] text-[10px] font-extrabold tracking-wider uppercase">
                  <Sparkles className="w-3 h-3" />
                  İrem Comfort Kalıp Standartları
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold font-serif-luxury text-white mt-0.5">
                  Bayan Ayakkabı & Terlik Beden Rehberi
                </h3>
              </div>
            </div>
          </div>

          {/* Body Content (Scrollable Container) */}
          <div 
            ref={scrollContainerRef}
            className="p-5 sm:p-8 space-y-6 overflow-y-auto overscroll-contain flex-1 touch-pan-y"
          >
            
            {/* Kalıp Uyarısı / Fit Recommendation */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-900 leading-relaxed font-medium">
                <span className="font-extrabold text-amber-950 block text-sm">
                  💡 Kalıp Tavsiyesi & Doğru Numara Seçimi
                </span>
                <p>
                  İrem Comfort ortopedik sabo, terlik ve sandalet modellerimizin tamamı <strong className="font-bold">tam kalıptır (True to Size)</strong>. Günlük giydiğiniz ayakkabı numaranızı güvenle tercih edebilirsiniz.
                </p>
                <p className="text-amber-800 font-semibold">
                  * İki numara arasında kararsız kalıyorsanız veya taraklı/yüksek kavisli ayak yapısına sahipseniz, ekstra rahatlık için <strong>bir numara büyük</strong> seçmenizi tavsiye ederiz.
                </p>
              </div>
            </div>

            {/* Interactive Size Selector & Conversion Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 font-serif-luxury">
                  Numara & Santimetre Karşılıkları Tablosu
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  Tıklayarak inceleyin
                </span>
              </div>

              {/* Size Buttons Header Bar */}
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {sizeChart.map((item) => (
                  <button
                    key={item.eu}
                    onClick={() => setSelectedSize(item.eu)}
                    className={`py-2.5 sm:py-3 px-1 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border flex flex-col items-center gap-0.5 ${
                      selectedSize === item.eu
                        ? 'bg-[#062050] text-[#D4AF37] border-[#062050] shadow-lg shadow-[#062050]/20 scale-105 ring-2 ring-[#D4AF37]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{item.eu}</span>
                    <span className="text-[10px] font-mono font-medium opacity-80">{item.cm} cm</span>
                  </button>
                ))}
              </div>

              {/* Size Chart Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">TR / EU Numara</th>
                      <th className="p-3">Ayak Uzunluğu (cm)</th>
                      <th className="p-3">US Numarası</th>
                      <th className="p-3">UK Numarası</th>
                      <th className="p-3">Kullanım Notu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sizeChart.map((row) => (
                      <tr
                        key={row.eu}
                        onClick={() => setSelectedSize(row.eu)}
                        className={`transition-colors cursor-pointer ${
                          selectedSize === row.eu
                            ? 'bg-blue-50/80 font-bold text-[#062050]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="p-3 font-extrabold flex items-center gap-1.5">
                          {selectedSize === row.eu && (
                            <CheckCircle2 className="w-4 h-4 text-[#062050]" />
                          )}
                          <span>{row.eu} Numara</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">{row.cm} cm</td>
                        <td className="p-3 font-mono text-slate-600">{row.us}</td>
                        <td className="p-3 font-mono text-slate-600">{row.uk}</td>
                        <td className="p-3 text-[11px] font-medium text-slate-500">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to measure feet section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#062050]" />
                <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Ayak Ölçüsü Nasıl Alınır? (3 Kolay Adım)
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="w-6 h-6 rounded-full bg-[#062050] text-[#D4AF37] font-bold text-[11px] flex items-center justify-center">
                    1
                  </span>
                  <p className="font-bold text-slate-800">Kağıda Basın</p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Düz bir zeminde A4 kağıdın üzerine çoraplı ayağınızı basın.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="w-6 h-6 rounded-full bg-[#062050] text-[#D4AF37] font-bold text-[11px] flex items-center justify-center">
                    2
                  </span>
                  <p className="font-bold text-slate-800">Uçları Çizin</p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Topuk hizanız ile en uzun parmağınızın ucunu bir kalemle işaretleyin.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="w-6 h-6 rounded-full bg-[#062050] text-[#D4AF37] font-bold text-[11px] flex items-center justify-center">
                    3
                  </span>
                  <p className="font-bold text-slate-800">Cetvelle Ölçün</p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    İki çizgi arasındaki mesafeyi cetvelle ölçüp tablodan numaranızı bulun.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500">
              Manisa Hakiki Deri İmalat • Beden Danışma Destek Hattı
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#062050] hover:bg-[#163E87] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
