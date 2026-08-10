import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLLECTION_ITEMS } from '../../constants/data';
import { CollectionItem } from '../../types';
import { ProductModal } from '../ui/ProductModal';
import { ProductCard } from '../ui/ProductCard';
import { Eye, ArrowRight, Sparkles, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface CollectionSectionProps {
  onInquireProduct: (productName: string) => void;
  onOpenProductsPage?: () => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  onInquireProduct,
  onOpenProductsPage
}) => {
  const { images, collectionItems, t, language } = useAppImages();
  const [activeModalItem, setActiveModalItem] = useState<CollectionItem | null>(null);
  const [selectedColorForModal, setSelectedColorForModal] = useState<string | undefined>(undefined);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const itemsToDisplay = collectionItems && collectionItems.length > 0 ? collectionItems : COLLECTION_ITEMS;

  // Auto-rotate the featured banner models every 5 seconds
  useEffect(() => {
    if (itemsToDisplay.length <= 3) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 3) % itemsToDisplay.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [itemsToDisplay]);

  // Pick 3 items based on featuredIndex
  const currentShowcaseItems = [
    itemsToDisplay[featuredIndex % itemsToDisplay.length],
    itemsToDisplay[(featuredIndex + 1) % itemsToDisplay.length],
    itemsToDisplay[(featuredIndex + 2) % itemsToDisplay.length],
  ].filter(Boolean);

  const handleNextShowcase = () => {
    setFeaturedIndex((prev) => (prev + 1) % itemsToDisplay.length);
  };

  const handlePrevShowcase = () => {
    setFeaturedIndex((prev) => (prev - 1 + itemsToDisplay.length) % itemsToDisplay.length);
  };

  return (
    <section id="collection" className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-extrabold tracking-widest text-[#0A2D6F] uppercase"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'tr' ? 'Öne Çıkan Sezon Modelleri' : language === 'en' ? 'Featured Seasonal Showcase' : 'تشكيلة الموسم المميزة'}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
            >
              Bayan Comfort <span className="font-serif-luxury font-bold text-[#0A2D6F]">Sandalet & Terlik</span>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xs sm:text-sm text-[#111111]/70 font-medium leading-relaxed"
            >
              Manisa atölyemizde imal edilen %100 hakiki deri bayan terlik, sandalet ve ortopedik sabo modellerimizden öne çıkanlar. Tüm kataloğumuzu detaylı filtrelerle incelemek için Ürünler Sayfamıza geçiş yapabilirsiniz.
            </motion.p>
          </div>

          {/* Carousel Controls & Products Page Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
              <button
                onClick={handlePrevShowcase}
                className="p-2 rounded-xl hover:bg-slate-100 text-[#062050] transition-colors cursor-pointer"
                title="Önceki Modeller"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-bold text-slate-500 px-2 font-mono">
                {Math.floor(featuredIndex / 3) + 1} / {Math.ceil(itemsToDisplay.length / 3)}
              </span>
              <button
                onClick={handleNextShowcase}
                className="p-2 rounded-xl hover:bg-slate-100 text-[#062050] transition-colors cursor-pointer"
                title="Sonraki Modeller"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {onOpenProductsPage && (
              <button
                onClick={onOpenProductsPage}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#062050] hover:bg-[#163E87] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#062050]/20 transition-all cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.navProductsPage || 'Tüm Ürünler Sayfası'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3-Model Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {currentShowcaseItems.map((item) => (
              <ProductCard
                key={`${item.id}-${featuredIndex}`}
                item={item}
                images={images}
                t={t}
                onSelect={(selectedItem, initialColor) => {
                  setSelectedColorForModal(initialColor);
                  setActiveModalItem(selectedItem);
                }}
                onInquire={onInquireProduct}
                onShare={(_e, selectedItem) => {
                  setActiveModalItem(selectedItem);
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Call to Action Banner to go to Products Page */}
        <div className="mt-12 bg-gradient-to-r from-[#062050] via-[#0A2D6F] to-[#163E87] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury">
              Tüm Bayan Comfort Koleksiyonumuzu & Kataloğumuzu İnceleyin
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/80 font-medium">
              Manisa imalatımız ortopedik sabo, mantar taban ve hakiki deri sandalet modellerimizin tamamı ayrı ürünler sayfamızda!
            </p>
          </div>

          {onOpenProductsPage && (
            <button
              onClick={onOpenProductsPage}
              className="px-8 py-4 rounded-full bg-[#D4AF37] hover:bg-amber-400 text-[#062050] font-black text-xs uppercase tracking-widest shadow-2xl transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 flex items-center gap-2"
            >
              <span>Ürünler Sayfasına Git</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Product Detail Specifications Modal */}
      <ProductModal
        item={activeModalItem}
        initialColor={selectedColorForModal}
        onClose={() => {
          setActiveModalItem(null);
          setSelectedColorForModal(undefined);
        }}
        onInquire={onInquireProduct}
      />
    </section>
  );
};
