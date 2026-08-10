import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { CollectionItem } from '../../types';
import { COLLECTION_ITEMS } from '../../constants/data';
import { ProductModal } from '../ui/ProductModal';
import { SizeGuideModal } from '../ui/SizeGuideModal';
import { 
  Search, 
  Share2, 
  Eye, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  PhoneCall, 
  SlidersHorizontal,
  ArrowUpRight,
  Ruler
} from 'lucide-react';

interface ProductsPageProps {
  onBackToHome: () => void;
  onInquireProduct: (productName: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onBackToHome,
  onInquireProduct
}) => {
  const { images, collectionItems, t, language } = useAppImages();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<CollectionItem | null>(null);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const categories = [
    'Tümü', 
    'Bayan Comfort Terlik', 
    'Bayan Comfort Sandalet', 
    'Sabo & Ortopedik Terlik', 
    'Mantar Taban Terlik'
  ];

  const itemsToDisplay = collectionItems && collectionItems.length > 0 ? collectionItems : COLLECTION_ITEMS;

  const filteredItems = useMemo(() => {
    return itemsToDisplay.filter(item => {
      const matchesCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
      return matchesCategory && matchesSearch;
    });
  }, [itemsToDisplay, selectedCategory, searchQuery]);

  const handleShareProduct = (e: React.MouseEvent, item: CollectionItem) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(item.id)}`;
    const shareData = {
      title: `${item.name} | İrem Comfort`,
      text: `${item.name} - %100 Hakiki Deri Bayan Comfort Terlik & Sandalet`,
      url: shareUrl
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        copyToClipboard(shareUrl, item.id);
      });
    } else {
      copyToClipboard(shareUrl, item.id);
    }
  };

  const copyToClipboard = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItemId(itemId);
      setTimeout(() => setCopiedItemId(null), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#111111] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedItemId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 sm:right-8 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-emerald-500"
          >
            <Check className="w-5 h-5 text-emerald-300" />
            <span>
              {language === 'tr' ? 'Ürün bağlantısı kopyalandı!' : language === 'en' ? 'Product link copied!' : 'تم نسخ رابط المنتج!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Row with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#062050] text-xs font-bold transition-all mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.productsBackToHome || 'Ana Sayfaya Dön'}</span>
            </button>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#062050] font-serif-luxury tracking-tight">
              {t.productsTitle || 'Tüm Ürünlerimiz & Sezon Kataloğu'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {t.productsSub || 'Manisa imalatımız hakiki deri bayan terlik, sandalet ve ortopedik sabo koleksiyonumuz.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#062050] font-extrabold text-xs border border-amber-200 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Ruler className="w-4 h-4 text-[#D4AF37]" />
              <span>Beden Rehberi</span>
            </button>

            <span className="px-4 py-2.5 rounded-2xl bg-blue-50 text-[#062050] text-xs font-bold border border-blue-100">
              🛍️ {filteredItems.length} {language === 'tr' ? 'Model Bulundu' : language === 'en' ? 'Models Found' : 'موديل'}
            </span>
          </div>
        </div>

        {/* Filter Controls & Search Bar Box */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder || "Model adı veya kategori ara..."}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062050] focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
                >
                  Temizle
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#062050]" />
              <span>Filtrele:</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#062050] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'Tümü' ? (t.productsCategoryAll || 'Tümü') : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-slate-200 space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#062050] rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'tr' ? 'Aramanıza Uygun Ürün Bulunamadı' : language === 'en' ? 'No Products Found' : 'لم يتم العثور على منتجات'}
            </h3>
            <p className="text-xs text-slate-500">
              Filtrelerinizi sıfırlayarak tüm koleksiyonumuzu inceleyebilirsiniz.
            </p>
            <button
              onClick={() => { setSelectedCategory('Tümü'); setSearchQuery(''); }}
              className="px-6 py-2.5 rounded-full bg-[#062050] text-white text-xs font-bold tracking-wider uppercase shadow-md hover:bg-[#163E87]"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setActiveModalItem(item)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#062050]/40 transition-all duration-300 hover:shadow-2xl cursor-pointer flex flex-col justify-between"
              >
                {/* Product Image Container */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gradient-to-br from-[#062050] to-[#0A2D6F] flex items-center justify-center">
                  {(images.collectionImages[item.id]?.image || item.image) ? (
                    <img
                      src={images.collectionImages[item.id]?.image || item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="p-6 text-center text-white space-y-2">
                      <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto" />
                      <span className="text-xs font-bold text-[#D4AF37] block">Hakiki Deri</span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 z-10 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#062050] text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
                    {item.category}
                  </div>

                  {/* Share Button (Top Right) */}
                  <button
                    onClick={(e) => handleShareProduct(e, item)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#062050] shadow-md flex items-center justify-center transition-all cursor-pointer border border-slate-200 hover:scale-110 active:scale-90"
                    title="Ürünü Paylaş"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Hover Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-black/20">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#062050] font-extrabold text-xs uppercase tracking-wider shadow-xl">
                      <Eye className="w-4 h-4" />
                      <span>{t.productsDetailsBtn || 'Detayları İncele'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 font-serif-luxury group-hover:text-[#062050] transition-colors">
                        {item.name}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#062050] transition-all" />
                    </div>
                    <p className="text-xs font-bold text-blue-700 mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {item.materials[0] || 'Hakiki Deri'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInquireProduct(item.name);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#062050] text-[11px] font-extrabold uppercase transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
                      <span>Fiyat Al</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      <ProductModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onInquire={onInquireProduct}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
};
