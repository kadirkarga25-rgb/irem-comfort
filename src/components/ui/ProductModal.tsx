import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CollectionItem } from '../../types';
import { CONTACT_DATA } from '../../constants/data';
import { X, Check, ShieldCheck, Layers, Palette, ArrowRight } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface ProductModalProps {
  item: CollectionItem | null;
  onClose: () => void;
  onInquire: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  item,
  onClose,
  onInquire
}) => {
  const { images: storeImages, contactData } = useAppImages();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lock background body & html scroll strictly when modal is open
  useEffect(() => {
    if (item) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      return () => {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
      };
    }
  }, [item]);

  // Non-passive wheel event handler on overlay to prevent main page scrolling 100%
  useEffect(() => {
    if (!item) return;

    const overlayEl = modalOverlayRef.current;
    if (!overlayEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Always prevent background window/body from scrolling
      e.preventDefault();

      // Directly scroll the description box
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
    };

    overlayEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      overlayEl.removeEventListener('wheel', handleWheel);
    };
  }, [item]);

  if (!item) return null;

  const itemImages = storeImages.collectionImages[item.id] || { image: item.image, secondaryImage: item.secondaryImage };
  const modalImages = [itemImages.image, itemImages.secondaryImage || itemImages.image];
  const currentColor = selectedColor || (item.colors && item.colors[0]?.name);
  const targetTrendyolUrl = item.trendyolUrl || contactData?.trendyolUrl || CONTACT_DATA.trendyolUrl;

  return (
    <AnimatePresence>
      <div
        ref={modalOverlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-hidden select-none"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#0A2D6F]/10 z-10 h-[92vh] sm:h-[90vh] max-h-[780px] flex flex-col select-text"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#111111] shadow-md flex items-center justify-center transition-all cursor-pointer border border-slate-200 active:scale-90"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 grid-rows-[auto_1fr] lg:grid-rows-none overflow-hidden h-full min-h-0">
            
            {/* Left Column: Fixed Product Main Image & Thumbnails directly below */}
            <div className="lg:col-span-5 bg-[#F8F8F8] p-3 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#0A2D6F]/10 overflow-hidden shrink-0 max-h-[32vh] sm:max-h-[38vh] lg:max-h-none h-auto lg:h-full">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden flex-1 min-h-[140px] sm:min-h-[220px] bg-white border border-[#0A2D6F]/10 shadow-inner">
                <img
                  src={modalImages[activeImageIndex]}
                  alt={item.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('/public/uploads/')) {
                      const parts = target.src.split('/public/uploads/');
                      if (parts[1]) {
                        target.src = '/uploads/' + parts[1];
                        return;
                      }
                    }
                    if (!target.src.includes('irem-comfort-logo')) {
                      target.src = '/uploads/logo/irem-comfort-logo.jpg';
                    }
                  }}
                />
                
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0A2D6F] text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase shadow-sm">
                  {item.category}
                </div>
              </div>

              {/* Thumbnails Directly Under Main Image */}
              <div className="flex items-center gap-2 pt-2 sm:pt-3 overflow-x-auto shrink-0 scrollbar-none">
                {modalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-12 h-12 sm:w-18 sm:h-18 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-[#0A2D6F] scale-102 shadow-md ring-2 ring-[#0A2D6F]/20' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="Küçük Görsel" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('/public/uploads/')) {
                          const parts = target.src.split('/public/uploads/');
                          if (parts[1]) {
                            target.src = '/uploads/' + parts[1];
                            return;
                          }
                        }
                        if (!target.src.includes('irem-comfort-logo')) {
                          target.src = '/uploads/logo/irem-comfort-logo.jpg';
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Independently Scrollable Text Details & Pinned Bottom Action Buttons */}
            <div className="lg:col-span-7 p-4 sm:p-8 flex flex-col justify-between overflow-hidden h-full min-h-0 flex-1">
              
              {/* Scrollable Text & Specs Container (Touch & Mouse Wheel Friendly) */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4 sm:space-y-5 min-h-0 touch-pan-y overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#0A2D6F] uppercase tracking-widest">
                    {item.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#111111] font-serif-luxury mt-0.5 sm:mt-1">
                    {item.name}
                  </h2>
                  {item.tagline && (
                    <p className="text-xs text-[#0A2D6F] font-medium italic mt-0.5">
                      "{item.tagline}"
                    </p>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs sm:text-sm text-[#111111]/85 leading-relaxed font-light whitespace-pre-line">
                    {item.description}
                  </p>
                )}

                {/* Color Palette Selector */}
                {item.colors && item.colors.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#0A2D6F]" />
                      <span>Deri Tonu: <strong className="text-[#0A2D6F]">{currentColor || 'Standart'}</strong></span>
                    </span>
                    <div className="flex items-center gap-2.5 pt-0.5 flex-wrap">
                      {item.colors.map((c, idx) => (
                        <button
                          key={c.name || idx}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative active:scale-110 ${
                            currentColor === c.name ? 'border-[#0A2D6F] scale-110 shadow-md ring-2 ring-[#0A2D6F]/20' : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {currentColor === c.name && (
                            <Check className={`w-4 h-4 absolute inset-0 m-auto ${c.hex === '#EAE6DF' || c.hex === '#F0ECE1' || c.hex === '#FFFFFF' ? 'text-black' : 'text-[#0A2D6F]'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions & Materials Specs */}
                <div className="space-y-2.5 pt-3.5 border-t border-[#0A2D6F]/10 text-xs text-[#111111]/80">
                  {item.materials && item.materials.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Layers className="w-4 h-4 text-[#0A2D6F] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-[#111111]">Kullanılan Malzemeler: </strong>
                        <span>{Array.isArray(item.materials) ? item.materials.join(', ') : item.materials}</span>
                      </div>
                    </div>
                  )}

                  {item.dimensions && (
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0A2D6F] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-[#111111]">Ölçüler: </strong>
                        <span>{item.dimensions}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                {item.features && item.features.length > 0 && (
                  <div className="space-y-2 bg-[#F8F8F8] p-3 sm:p-4 rounded-xl border border-[#0A2D6F]/10">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0A2D6F]">
                      Ergonomik & Öne Çıkan Özellikler
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#111111]/80 pt-0.5">
                      {item.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A2D6F] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pinned Action Buttons Row (Always Fixed at Bottom) */}
              <div className="pt-3 sm:pt-4 mt-2 sm:mt-3 border-t border-[#0A2D6F]/10 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 shrink-0 bg-white z-10">
                {targetTrendyolUrl && (
                  <a
                    href={targetTrendyolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 sm:py-3.5 px-5 rounded-full bg-[#F27A1A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#d9660c] transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                  >
                    <span>Trendyol'dan Satın Al</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => {
                    onInquire(item.name);
                    onClose();
                  }}
                  className="w-full sm:w-auto flex-1 py-3 sm:py-3.5 px-5 rounded-full bg-[#082C6C] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#163E87] transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <span>Fiyat & Toptan Bilgi Al</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

