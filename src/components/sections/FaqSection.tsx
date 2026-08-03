import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { FaqItem } from '../../types';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  PackageCheck, 
  Truck, 
  Sparkles, 
  Footprints, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2,
  Filter
} from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { faqItems, contactData } = useAppImages();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('hepsi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Generate Schema.org FAQPage structured data dynamically for all active FAQ items
  const faqSchemaData = useMemo(() => {
    const activeItems = faqItems.filter(item => item.isActive !== false);
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.iremcomfort.com/#faq",
      "mainEntity": activeItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  }, [faqItems]);

  // Filter active FAQs and apply search/category
  const filteredFaqs = useMemo(() => {
    return faqItems
      .filter(item => item.isActive !== false)
      .filter(item => {
        if (selectedCategory !== 'hepsi' && item.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
        }
        return true;
      });
  }, [faqItems, selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const getCategoryLabel = (category: FaqItem['category']) => {
    switch (category) {
      case 'toptan': return 'Toptan & Üretim';
      case 'kargo': return 'Kargo & Teslimat';
      case 'bakim': return 'Hakiki Deri Bakımı';
      case 'kalip': return 'Numara & Kalıp';
      default: return 'Genel Bilgi';
    }
  };

  const getCategoryIcon = (category: FaqItem['category']) => {
    switch (category) {
      case 'toptan': return PackageCheck;
      case 'kargo': return Truck;
      case 'bakim': return Sparkles;
      case 'kalip': return Footprints;
      default: return HelpCircle;
    }
  };

  const categories = [
    { id: 'hepsi', label: 'Tüm Sorular', icon: Filter },
    { id: 'toptan', label: 'Toptan & Üretim', icon: PackageCheck },
    { id: 'kargo', label: 'Kargo & Teslimat', icon: Truck },
    { id: 'bakim', label: 'Hakiki Deri Bakımı', icon: Sparkles },
    { id: 'kalip', label: 'Numara & Kalıp', icon: Footprints },
  ];

  const handleWhatsappClick = () => {
    const cleanNumber = contactData.whatsapp ? contactData.whatsapp.replace(/\D/g, '') : '905330297125';
    const text = encodeURIComponent('Merhaba İrem Comfort, SSS bölümünden ulaşıyorum. Bir konu hakkında detaylı bilgi almak istiyorum.');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const handleContactClick = () => {
    const target = document.getElementById('contact');
    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#F8FAFC] relative overflow-hidden">
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />

      {/* Decorative ambient subtle gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0A2D6F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#0A2D6F] uppercase bg-[#0A2D6F]/5 px-3.5 py-1.5 rounded-full border border-[#0A2D6F]/10"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0A2D6F]" />
            <span>Sıkça Sorulan Sorular</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            Aklınıza Takılan <span className="font-serif-luxury font-bold text-[#0A2D6F]">Tüm Sorular</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base text-slate-600 font-light leading-relaxed"
          >
            Toptan sipariş süreçleri, kargo teslimatı, kalıp tavsiyeleri ve %100 hakiki deri terlik ile sandaletlerimizin bakımı hakkında merak ettiğiniz yanıtlar.
          </motion.p>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="space-y-6">
          
          {/* Search Input */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Soru veya kelime arayın... (ör. toptan, kargo, deri bakımı)"
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A2D6F]/30 focus:border-[#0A2D6F] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-all cursor-pointer"
              >
                Temizle
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-[#0A2D6F] text-white font-semibold shadow-md shadow-[#0A2D6F]/20 scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-base font-semibold text-slate-700">Aramanıza uygun soru bulunamadı.</p>
              <p className="text-xs text-slate-500">
                Farklı bir arama terimi deneyebilir veya kategorileri değiştirebilirsiniz.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('hepsi'); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition-all cursor-pointer mt-2"
              >
                Tüm Soruları Göster
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isOpen = openFaqId === item.id;
              const CategoryIcon = getCategoryIcon(item.category);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#0A2D6F]/30 shadow-lg ring-1 ring-[#0A2D6F]/10'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          <CategoryIcon className="w-3 h-3 text-[#0A2D6F]" />
                          {getCategoryLabel(item.category)}
                        </span>

                        {item.isPopular && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Popüler Soru
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? 'bg-[#0A2D6F] text-white rotate-180 shadow-sm' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Answer Expandable Area */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-slate-100/80">
                          <div className="pt-4 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2 font-normal">
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom Support CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#082C6C] to-[#0A2D6F] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* Subtle Background Accent */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 text-center sm:text-left z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Sorunuzu Bulamadınız Mı?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury">
              Müşteri Hizmetlerimizle Doğrudan Görüşün
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light max-w-lg">
              Toptan fiyat listesi, atölye randevusu veya özel sipariş detayları için uzman ekibimiz yanıtlamaya hazır.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
            <button
              onClick={handleWhatsappClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Destek Hatı</span>
            </button>

            <button
              onClick={handleContactClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>İletişime Geçin</span>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
