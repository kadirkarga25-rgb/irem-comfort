import React, { useState } from 'react';
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

  if (!item) return null;

  const itemImages = storeImages.collectionImages[item.id] || { image: item.image, secondaryImage: item.secondaryImage };
  const modalImages = [itemImages.image, itemImages.secondaryImage || itemImages.image];
  const currentColor = selectedColor || (item.colors && item.colors[0]?.name);
  const targetTrendyolUrl = item.trendyolUrl || contactData?.trendyolUrl || CONTACT_DATA.trendyolUrl;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#0A2D6F]/10 z-10 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#111111] shadow-md flex items-center justify-center transition-all cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            
            {/* Left: Product Images & Gallery */}
            <div className="lg:col-span-6 bg-[#F8F8F8] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[420px] bg-white border border-[#0A2D6F]/10 shadow-inner">
                <img
                  src={modalImages[activeImageIndex]}
                  alt={item.name}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
                
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0A2D6F] text-white text-[10px] font-bold tracking-widest uppercase">
                  {item.category}
                </div>
              </div>

              {/* Thumbnail Selector */}
              <div className="flex items-center gap-3">
                {modalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#0A2D6F] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Küçük Görsel" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Specifications & Details */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-[#0A2D6F] uppercase tracking-widest">
                    {item.subtitle}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-light text-[#111111] font-serif-luxury mt-1">
                    {item.name}
                  </h2>
                  <p className="text-xs text-[#0A2D6F] font-medium italic mt-1">
                    "{item.tagline}"
                  </p>
                </div>

                <p className="text-sm text-[#111111]/70 leading-relaxed font-light">
                  {item.description}
                </p>

                {/* Color Palette Selector */}
                {item.colors && item.colors.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#0A2D6F]" />
                      <span>Deri Tonu: <strong className="text-[#0A2D6F]">{currentColor || 'Standart'}</strong></span>
                    </span>
                    <div className="flex items-center gap-3 pt-1 flex-wrap">
                      {item.colors.map((c, idx) => (
                        <button
                          key={c.name || idx}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative ${
                            currentColor === c.name ? 'border-[#0A2D6F] scale-110 shadow-md ring-2 ring-[#0A2D6F]/20' : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {currentColor === c.name && (
                            <Check className={`w-4 h-4 absolute inset-0 m-auto ${c.hex === '#EAE6DF' || c.hex === '#F0ECE1' || c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions & Materials Specs */}
                <div className="space-y-3 pt-4 border-t border-[#0A2D6F]/10 text-xs text-[#111111]/80">
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
                  <div className="space-y-2 bg-[#F8F8F8] p-4 rounded-xl border border-[#0A2D6F]/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0A2D6F]">
                      Ergonomik & Öne Çıkan Özellikler
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#111111]/80 pt-1">
                      {item.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A2D6F]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Inquiry & Trendyol Action Buttons */}
              <div className="pt-4 border-t border-[#0A2D6F]/10 flex flex-col sm:flex-row items-center gap-3">
                {targetTrendyolUrl && (
                  <a
                    href={targetTrendyolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#F27A1A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#d9660c] transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
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
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-full bg-[#082C6C] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#163E87] transition-all cursor-pointer shadow-lg active:scale-95"
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
