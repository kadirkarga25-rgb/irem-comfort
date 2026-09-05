import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Share2, MessageCircle, Sparkles, ArrowUpRight, Check } from 'lucide-react';
import { CollectionItem } from '../../types';
import { useAppImages } from '../../context/ImageContext';

interface ProductCardProps {
  item: CollectionItem;
  images: { collectionImages: Record<string, { image: string; secondaryImage: string }> };
  t: Record<string, string>;
  onSelect: (item: CollectionItem, initialColor?: string) => void;
  onInquire: (productName: string) => void;
  onShare: (e: React.MouseEvent, item: CollectionItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  images,
  t,
  onSelect,
  onInquire,
  onShare
}) => {
  const { language } = useAppImages();
  const defaultImage = images.collectionImages[item.id]?.image || item.image;
  const [activeImage, setActiveImage] = useState<string>(defaultImage);
  const [activeColorName, setActiveColorName] = useState<string | undefined>(item.colors?.[0]?.name);

  const getTranslatedCategory = (cat?: string) => {
    if (!cat) return '';
    if (language === 'tr') return cat;
    if (cat.includes('Sandalet')) return language === 'en' ? "Women's Sandals" : 'صنادل نسائية';
    if (cat.includes('Sabo')) return language === 'en' ? 'Clogs & Orthopedic' : 'قباقيب ونعال طبية';
    if (cat.includes('Mantar')) return language === 'en' ? 'Cork Footbed' : 'نعل فلين';
    if (cat.includes('Terlik')) return language === 'en' ? "Women's Slippers" : 'نعال نسائية';
    return cat;
  };

  const getTranslatedMaterial = (mat?: string) => {
    if (!mat || typeof mat !== 'string') return language === 'tr' ? 'Hakiki Deri' : language === 'en' ? 'Genuine Leather' : 'جلد طبيعي';
    if (language === 'tr') return mat;
    const mLower = mat.toLowerCase();
    if (mLower.includes('hakiki deri')) return language === 'en' ? '100% Genuine Leather' : 'جلد طبيعي 100%';
    if (mLower.includes('deri')) return language === 'en' ? 'Genuine Leather' : 'جلد طبيعي';
    return mat;
  };

  const handleColorHoverOrClick = (e: React.MouseEvent, c: { name: string; hex: string; image?: string }) => {
    e.stopPropagation();
    setActiveColorName(c.name);
    if (c.image) {
      setActiveImage(c.image);
    } else {
      setActiveImage(defaultImage);
    }
  };

  const handleCardClick = () => {
    onSelect(item, activeColorName);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#062050]/40 transition-all duration-300 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gradient-to-br from-[#062050] to-[#0A2D6F] flex items-center justify-center">
        {activeImage ? (
          <img
            src={activeImage}
            alt={`${item.name} - ${activeColorName || ''}`}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="p-6 text-center text-white space-y-2">
            <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <span className="text-xs font-bold text-[#D4AF37] block">Hakiki Deri</span>
          </div>
        )}

        {/* Top Badge: Category & Active Color Label */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#062050] text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
            {getTranslatedCategory(item.category)}
          </span>
          {activeColorName && activeImage !== defaultImage && (
            <span className="px-2.5 py-1 rounded-full bg-[#062050] text-amber-300 text-[10px] font-extrabold tracking-wider uppercase shadow-md animate-fade-in border border-white/20">
              {activeColorName}
            </span>
          )}
        </div>

        {/* Share Button (Top Right) */}
        <button
          onClick={(e) => onShare(e, item)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#062050] shadow-md flex items-center justify-center transition-all cursor-pointer border border-slate-200 hover:scale-110 active:scale-90"
          title={language === 'tr' ? 'Ürünü Paylaş' : language === 'en' ? 'Share Product' : 'مشاركة المنتج'}
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Hover Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-black/20">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#062050] font-extrabold text-xs uppercase tracking-wider shadow-xl">
            <Eye className="w-4 h-4" />
            <span>{t.productsDetailsBtn || (language === 'tr' ? 'Detayları İncele' : language === 'en' ? 'View Details' : 'تفاصيل المنتج')}</span>
          </span>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 font-serif-luxury group-hover:text-[#062050] transition-colors">
              {item.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#062050] transition-all" />
          </div>
          <p className="text-xs font-bold text-blue-700">
            {item.subtitle}
          </p>
        </div>

        <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Color Swatches Selector */}
        {item.colors && item.colors.length > 0 && (
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                {language === 'tr' ? 'Renkler:' : language === 'en' ? 'Colors:' : 'الألوان:'}
              </span>
              {item.colors.map((c, idx) => {
                const isSelected = activeColorName === c.name;
                return (
                  <button
                    key={c.name || idx}
                    onClick={(e) => handleColorHoverOrClick(e, c)}
                    onMouseEnter={(e) => handleColorHoverOrClick(e, c)}
                    className={`relative w-5 h-5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'border-[#062050] scale-125 ring-2 ring-[#062050]/20 shadow-xs'
                        : 'border-slate-300 hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.image ? `${c.name} (${language === 'tr' ? 'Özel Fotoğraflı Model' : language === 'en' ? 'Model with photo' : 'صورة متوفرة'})` : c.name}
                  >
                    {isSelected && (
                      <Check className={`w-3 h-3 ${c.hex === '#EAE6DF' || c.hex === '#F0ECE1' || c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                    )}
                    {c.image && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {activeColorName && (
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                {activeColorName}
              </span>
            )}
          </div>
        )}

        {/* Footer & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {getTranslatedMaterial(item.materials[0])}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onInquire(item.name);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#062050] text-[11px] font-extrabold uppercase transition-all cursor-pointer"
            title={language === 'tr' ? 'Sipariş / Bilgi Al' : language === 'en' ? 'Inquire / Order' : 'استفسار / طلب'}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Sipariş' : language === 'en' ? 'Inquire' : 'طلب'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
