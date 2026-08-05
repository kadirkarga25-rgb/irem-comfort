import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLLECTION_ITEMS } from '../../constants/data';
import { CollectionItem } from '../../types';
import { ProductModal } from '../ui/ProductModal';
import { Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface CollectionSectionProps {
  onInquireProduct: (productName: string) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  onInquireProduct
}) => {
  const { images, collectionItems } = useAppImages();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [activeModalItem, setActiveModalItem] = useState<CollectionItem | null>(null);

  const categories = ['Tümü', 'Bayan Comfort Terlik', 'Bayan Comfort Sandalet', 'Sabo & Ortopedik Terlik', 'Mantar Taban Terlik'];

  const itemsToDisplay = collectionItems && collectionItems.length > 0 ? collectionItems : COLLECTION_ITEMS;

  const filteredItems = selectedCategory === 'Tümü'
    ? itemsToDisplay
    : itemsToDisplay.filter(item => item.category === selectedCategory);

  return (
    <section id="collection" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#0A2D6F] uppercase"
            >
              <Sparkles className="w-4 h-4 text-[#0A2D6F]" />
              <span>Manisa İmalatı Hakiki Deri Koleksiyonu</span>
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
              className="text-base text-[#111111]/70 font-light"
            >
              Her bir model Manisa Ayakkabıcılar Sitesindeki atölyemizde hakiki deri saya ve ortopedik kavisli tabanlarla üretilir. Detaylı ürün özelliklerini ve numara seçeneklerini görmek için tıklayın.
            </motion.p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b sm:border-none border-[#0A2D6F]/10 pb-4 sm:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A2D6F] text-white shadow-lg shadow-[#0A2D6F]/20'
                      : 'bg-[#F8F8F8] text-[#111111]/70 hover:bg-[#0A2D6F]/10 hover:text-[#0A2D6F]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => setActiveModalItem(item)}
                className="group relative bg-[#F8F8F8] rounded-3xl overflow-hidden border border-[#0A2D6F]/10 hover:border-[#0A2D6F]/30 transition-all duration-500 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
              >
                {/* Product Image Showcase */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-white">
                  <img
                    src={images.collectionImages[item.id]?.image || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
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
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-10 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0A2D6F] text-[10px] font-bold tracking-widest uppercase shadow-sm">
                    {item.category}
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95 z-10">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0A2D6F] font-semibold text-xs uppercase tracking-wider shadow-xl">
                      <Eye className="w-4 h-4" />
                      <span>Detayları İncele</span>
                    </span>
                  </div>
                </div>

                {/* Card Info Content */}
                <div className="p-6 space-y-3 bg-white flex-1 flex flex-col justify-between border-t border-[#0A2D6F]/5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-[#111111] font-serif-luxury group-hover:text-[#0A2D6F] transition-colors">
                        {item.name}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-[#0A2D6F]/40 group-hover:text-[#0A2D6F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-[#111111]/60 font-medium mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#111111]/70 font-light line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Materials Tag Strip */}
                  <div className="pt-3 border-t border-[#0A2D6F]/10 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#0A2D6F] tracking-wide">
                      {item.materials[0]}
                    </span>
                    <span className="text-[10px] text-[#111111]/50 uppercase tracking-wider font-mono">
                      Özel El İşçiliği
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Product Detail Specifications Modal */}
      <ProductModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onInquire={onInquireProduct}
      />
    </section>
  );
};
