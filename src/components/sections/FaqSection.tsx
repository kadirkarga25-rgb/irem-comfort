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
  const { faqItems, contactData, language } = useAppImages();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('hepsi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const getCategoryLabel = (category: FaqItem['category']) => {
    switch (category) {
      case 'toptan':
        return language === 'tr' ? 'Toptan & Üretim' : language === 'en' ? 'Wholesale & Production' : 'الجملة والإنتاج';
      case 'kargo':
        return language === 'tr' ? 'Kargo & Teslimat' : language === 'en' ? 'Shipping & Delivery' : 'الشحن والتوصيل';
      case 'bakim':
        return language === 'tr' ? 'Hakiki Deri Bakımı' : language === 'en' ? 'Genuine Leather Care' : 'العناية بالجلد الطبيعي';
      case 'kalip':
        return language === 'tr' ? 'Numara & Kalıp' : language === 'en' ? 'Size & Fit' : 'المقاس والقالب';
      default:
        return language === 'tr' ? 'Genel Bilgi' : language === 'en' ? 'General Info' : 'معلومات عامة';
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
    { id: 'hepsi', label: language === 'tr' ? 'Tüm Sorular' : language === 'en' ? 'All Questions' : 'جميع الأسئلة', icon: Filter },
    { id: 'toptan', label: language === 'tr' ? 'Toptan & Üretim' : language === 'en' ? 'Wholesale & Production' : 'الجملة والإنتاج', icon: PackageCheck },
    { id: 'kargo', label: language === 'tr' ? 'Kargo & Teslimat' : language === 'en' ? 'Shipping & Delivery' : 'الشحن والتوصيل', icon: Truck },
    { id: 'bakim', label: language === 'tr' ? 'Hakiki Deri Bakımı' : language === 'en' ? 'Genuine Leather Care' : 'العناية بالجلد الطبيعي', icon: Sparkles },
    { id: 'kalip', label: language === 'tr' ? 'Numara & Kalıp' : language === 'en' ? 'Size & Fit' : 'المقاس والقالب', icon: Footprints },
  ];

  const translateFaq = (item?: FaqItem | null) => {
    if (!item) return { question: '', answer: '' };
    if (language === 'tr') return { question: item.question || '', answer: item.answer || '' };

    const qLower = (item.question || '').toLowerCase();
    if (qLower.includes('toptan') || qLower.includes('sipariş nasıl')) {
      return {
        question: language === 'en' ? 'How can I place a wholesale order?' : 'كيف يمكنني تقديم طلب بالجملة؟',
        answer: language === 'en'
          ? 'You can reach us via our WhatsApp hotline or contact form to request our wholesale catalog and price list. We offer custom production and volume discounts for boutique and store orders.'
          : 'يمكنك التواصل معنا عبر رقم الواتساب أو نموذج الاتصال لطلب كتالوج الجملة وقائمة الأسعار. نوفر خصومات مميزة للمحلات وطلبات الكميات.'
      };
    }
    if (qLower.includes('kargo') || qLower.includes('teslimat')) {
      return {
        question: language === 'en' ? 'What are your delivery times and shipping conditions?' : 'ما هي مدة التوصيل وشروط الشحن؟',
        answer: language === 'en'
          ? 'Wholesale orders are dispatched within 3-7 business days depending on production volume. Retail orders via Trendyol are shipped on the same or next business day.'
          : 'يتم شحن طلبات الجملة خلال 3-7 أيام عمل بحسب حجم الإنتاج. وتُشحن طلبات التجزئة عبر ترينديول خلال يوم العمل نفسه أو التالي.'
      };
    }
    if (qLower.includes('deri bakımı') || qLower.includes('bakım') || qLower.includes('temizlen')) {
      return {
        question: language === 'en' ? 'How should genuine leather slippers and sandals be cared for?' : 'كيف يجب الاعتناء بالنعال والصنادل المصنوعة من جلد طبيعي؟',
        answer: language === 'en'
          ? 'Clean with a soft, slightly damp cloth. Avoid submerging in water or direct harsh sunlight. Natural leather nourishing creams or neutral beeswax care products can be applied periodically to maintain suppleness.'
          : 'يُنظف بقطعة قماش ناعمة ومبللة قليلاً. تجنب الغمر بالماء أو التعرض للشمس المباشرة الحارة. يمكن استخدام كريم العناية بالجلد الطبيعي للحفاظ على مرونته.'
      };
    }
    if (qLower.includes('kalıp') || qLower.includes('numara')) {
      return {
        question: language === 'en' ? 'Are your sizes true to standard shoe sizes?' : 'هل مقاسات وقوالب الأحذية مطابقة للمقاسات القياسية؟',
        answer: language === 'en'
          ? 'Yes, all our models are crafted with anatomically tested standard Turkish/European shoe lasts. We recommend selecting your usual shoe size. For wider feet or sabots, our customer team is happy to advise.'
          : 'نعم، جميع موديلاتنا مصممة وفقاً للقوالب القياسية التركية/الأوروبية المختبرة طبياً. نوصي باختيار مقاسك المعتاد.'
      };
    }

    return { question: item.question || '', answer: item.answer || '' };
  };

  // Generate Schema.org FAQPage structured data dynamically for all active FAQ items
  const faqSchemaData = useMemo(() => {
    const activeItems = faqItems.filter(item => item.isActive !== false);
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.iremcomfort.com/#faq",
      "mainEntity": activeItems.map(item => {
        const tr = translateFaq(item);
        return {
          "@type": "Question",
          "name": tr.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": tr.answer
          }
        };
      })
    };
  }, [faqItems, language]);

  // Filter active FAQs and apply search/category
  const filteredFaqs = useMemo(() => {
    return faqItems
      .filter(item => item.isActive !== false)
      .filter(item => {
        if (selectedCategory !== 'hepsi' && item.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = (searchQuery || '').toLowerCase();
          const tr = translateFaq(item);
          const qText = (tr?.question || item?.question || '').toLowerCase();
          const aText = (tr?.answer || item?.answer || '').toLowerCase();
          return qText.includes(q) || aText.includes(q);
        }
        return true;
      });
  }, [faqItems, selectedCategory, searchQuery, language]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

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
            <span>{language === 'tr' ? 'Sıkça Sorulan Sorular' : language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            {language === 'tr' ? (
              <>Aklınıza Takılan <span className="font-serif-luxury font-bold text-[#0A2D6F]">Tüm Sorular</span></>
            ) : language === 'en' ? (
              <>Everything You Need to <span className="font-serif-luxury font-bold text-[#0A2D6F]">Know</span></>
            ) : (
              <>كل ما تود <span className="font-serif-luxury font-bold text-[#0A2D6F]">معرفته</span></>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base text-slate-600 font-light leading-relaxed"
          >
            {language === 'tr'
              ? 'Toptan sipariş süreçleri, kargo teslimatı, kalıp tavsiyeleri ve %100 hakiki deri terlik ile sandaletlerimizin bakımı hakkında merak ettiğiniz yanıtlar.'
              : language === 'en'
              ? 'Answers about wholesale ordering, delivery, sizing recommendations, and caring for our 100% genuine leather footwear.'
              : 'إجابات شاملة حول طلبات الجملة والتوصيل وإرشادات المقاسات والعناية بالأحذية والنعال المصنوعة من جلد طبيعي 100%.'}
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
              placeholder={
                language === 'tr'
                  ? 'Soru veya kelime arayın... (ör. toptan, kargo, deri bakımı)'
                  : language === 'en'
                  ? 'Search questions or keywords... (e.g. wholesale, shipping, leather)'
                  : 'ابحث عن سؤال أو كلمة مفتاحية... (مثل: جملة، شحن، عناية بالجلد)'
              }
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A2D6F]/30 focus:border-[#0A2D6F] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-all cursor-pointer"
              >
                {language === 'tr' ? 'Temizle' : language === 'en' ? 'Clear' : 'مسح'}
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={`faq-tab-${cat.id || idx}`}
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
              <p className="text-base font-semibold text-slate-700">
                {language === 'tr' ? 'Aramanıza uygun soru bulunamadı.' : language === 'en' ? 'No matching questions found.' : 'لم يتم العثور على أسئلة مطابقة.'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'tr'
                  ? 'Farklı bir arama terimi deneyebilir veya kategorileri değiştirebilirsiniz.'
                  : language === 'en'
                  ? 'Try a different search term or select another category.'
                  : 'جرب كلمة بحث أخرى أو حدد قسماً آخر.'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('hepsi'); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition-all cursor-pointer mt-2"
              >
                {language === 'tr' ? 'Tüm Soruları Göster' : language === 'en' ? 'Show All Questions' : 'عرض جميع الأسئلة'}
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const itemId = item.id || `faq-id-${index}`;
              const isOpen = openFaqId === itemId;
              const CategoryIcon = getCategoryIcon(item.category);
              const tr = translateFaq(item);
              const uniqueKey = `faq-card-${item.id || 'entry'}-${index}`;

              return (
                <motion.div
                  key={uniqueKey}
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
                    onClick={() => toggleFaq(itemId)}
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
                            {language === 'tr' ? 'Popüler Soru' : language === 'en' ? 'Popular Question' : 'سؤال شائع'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {tr.question}
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
                            <p>{tr.answer}</p>
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
              <span>{language === 'tr' ? 'Sorunuzu Bulamadınız Mı?' : language === 'en' ? "Can't Find Your Question?" : 'لم تجد إجابة لسؤالك؟'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury">
              {language === 'tr' ? 'Müşteri Hizmetlerimizle Doğrudan Görüşün' : language === 'en' ? 'Speak Directly with Customer Support' : 'تحدث مباشرة مع خدمة العملاء'}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light max-w-lg">
              {language === 'tr'
                ? 'Toptan fiyat listesi, atölye randevusu veya özel sipariş detayları için uzman ekibimiz yanıtlamaya hazır.'
                : language === 'en'
                ? 'Our experienced team is ready to assist with wholesale pricing, workshop appointments, or bespoke production orders.'
                : 'فريقنا المتخصص جاهز لمساعدتكم بقوائم أسعار الجملة، ومواعيد الورشة، والطلبات الخاصة.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
            <button
              onClick={handleWhatsappClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'tr' ? 'WhatsApp Destek Hattı' : language === 'en' ? 'WhatsApp Support Line' : 'خط دعم واتساب'}</span>
            </button>

            <button
              onClick={handleContactClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>{language === 'tr' ? 'İletişime Geçin' : language === 'en' ? 'Contact Us' : 'تواصل معنا'}</span>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
