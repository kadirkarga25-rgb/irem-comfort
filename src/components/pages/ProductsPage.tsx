import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { CollectionItem } from '../../types';
import { COLLECTION_ITEMS } from '../../constants/data';
import { ProductModal } from '../ui/ProductModal';
import { ProductCard } from '../ui/ProductCard';
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
  const [selectedColorForModal, setSelectedColorForModal] = useState<string | undefined>(undefined);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const categories = [
    { id: 'Tümü', label: language === 'tr' ? 'Tümü' : language === 'en' ? 'All' : 'الكل' },
    { id: 'Bayan Comfort Terlik', label: language === 'tr' ? 'Bayan Comfort Terlik' : language === 'en' ? "Women's Comfort Slippers" : 'نعال طبية نسائية' },
    { id: 'Bayan Comfort Sandalet', label: language === 'tr' ? 'Bayan Comfort Sandalet' : language === 'en' ? "Women's Comfort Sandals" : 'صنادل طبية نسائية' },
    { id: 'Sabo & Ortopedik Terlik', label: language === 'tr' ? 'Sabo & Ortopedik Terlik' : language === 'en' ? 'Clogs & Orthopedic' : 'قباقيب ونعال طبية' },
    { id: 'Mantar Taban Terlik', label: language === 'tr' ? 'Mantar Taban Terlik' : language === 'en' ? 'Cork Sole Slippers' : 'نعال نعل فلين' }
  ];

  const itemsToDisplay = collectionItems && collectionItems.length > 0 ? collectionItems : COLLECTION_ITEMS;

  const filteredItems = useMemo(() => {
    return itemsToDisplay.filter(item => {
      const matchesCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;
      const q = (searchQuery || '').toLowerCase().trim();
      const matchesSearch = !q || (
        (item.name && item.name.toLowerCase().includes(q)) ||
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
              <span>{language === 'tr' ? 'Beden Rehberi' : language === 'en' ? 'Size Guide' : 'دليل المقاسات'}</span>
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
                placeholder={t.searchPlaceholder || (language === 'tr' ? "Model adı veya kategori ara..." : language === 'en' ? "Search model name or category..." : "ابحث عن موديل أو فئة...")}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062050] focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
                >
                  {language === 'tr' ? 'Temizle' : language === 'en' ? 'Clear' : 'مسح'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#062050]" />
              <span>{language === 'tr' ? 'Filtrele:' : language === 'en' ? 'Filter:' : 'تصفية:'}</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#062050] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
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
              {language === 'tr'
                ? 'Filtrelerinizi sıfırlayarak tüm koleksiyonumuzu inceleyebilirsiniz.'
                : language === 'en'
                ? 'Reset your filters to explore our full collection.'
                : 'يمكنكم إعادة ضبط خيارات البحث لمشاهدة كافة الموديلات.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('Tümü'); setSearchQuery(''); }}
              className="px-6 py-2.5 rounded-full bg-[#062050] text-white text-xs font-bold tracking-wider uppercase shadow-md hover:bg-[#163E87]"
            >
              {language === 'tr' ? 'Filtreleri Temizle' : language === 'en' ? 'Reset Filters' : 'إعادة ضبط الفلاتر'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                images={images}
                t={t}
                onSelect={(selectedItem, initialColor) => {
                  setSelectedColorForModal(initialColor);
                  setActiveModalItem(selectedItem);
                }}
                onInquire={onInquireProduct}
                onShare={handleShareProduct}
              />
            ))}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      <ProductModal
        item={activeModalItem}
        initialColor={selectedColorForModal}
        onClose={() => {
          setActiveModalItem(null);
          setSelectedColorForModal(undefined);
        }}
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
