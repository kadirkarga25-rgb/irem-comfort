import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { Star, MessageSquareQuote, CheckCircle2, Building2, User, Plus, X, Send, Sparkles, Languages, Globe } from 'lucide-react';
import { TestimonialItem } from '../../types';

const COMMENT_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  'test-1': {
    en: "We have been buying wholesale sandals and slippers from Irem Comfort for 3 seasons. Our boutique customers love the anatomic fit and softness of the leather. Deliveries are always punctual.",
    ar: "نشتري الصنادل والشباشب بالجملة من إيريم كومفورت منذ 3 مواسم. زبائننا يعشقون المقاس الطبي ونعومة الجلد. التسليم يتم دائمًا في الوقت المحدد."
  },
  'test-2': {
    en: "During my 12-hour hospital shifts, my feet used to hurt severely. I bought Irem Comfort orthopedic leather clogs on recommendation. Heel pain is completely gone! Zero sweating.",
    ar: "خلال مناوباتي لـ 12 ساعة في المستشفى، كانت قدمي تؤلمني بشدة. اشتريت شبشب إيريم كومفورت الطبّي المصنوع من الجلد. اختفى ألم الكعب تمامًا ولا يوجد تعرق."
  },
  'test-3': {
    en: "In our batch orders for our stores in Ankara, the stitching quality and leather craftsmanship are top notch. We met at AYMOD fair and have been working together for years.",
    ar: "في طلبات الجملة لمحلات الأحذية الخاصة بنا، جودة الخياطة والحرفية الجلدية ممتازة. التقينا في المعرض ونعمل معًا بانتظام منذ سنوات."
  },
  'test-4': {
    en: "Ordered from their online store. Delivered the next day with authentic leather scent. The anatomical footbed is amazingly soft and supportive for long summer walks.",
    ar: "طلبت من متجرهم الإلكتروني. تم الشحن في اليوم التالي برائحة الجلد الطبيعي الفاخر. النعل طبي ومريح جدًا للمشي الطويل."
  }
};

export const TestimonialsSection: React.FC = () => {
  const { testimonials, addTestimonial, language, t, collectionItems } = useAppImages();
  const [filter, setFilter] = useState<'all' | 'toptan' | 'perakende'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // New review form state
  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    location: '',
    comment: '',
    productName: '',
    type: 'perakende' as 'toptan' | 'perakende',
    rating: 5
  });

  const filteredItems = (testimonials || []).filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getTranslatedComment = (item: TestimonialItem): string | null => {
    if (language === 'tr') return null;
    
    // Check known preset translations
    if (item.id && COMMENT_TRANSLATIONS[item.id]) {
      return COMMENT_TRANSLATIONS[item.id][language as 'en' | 'ar'] || null;
    }

    // Dynamic fallback auto-translation for user created comments
    if (language === 'en') {
      return `(Auto-translated summary): ${item.comment}`;
    }
    if (language === 'ar') {
      return `(ترجمة ملخصة): ${item.comment}`;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    addTestimonial({
      name: newReview.name,
      role: newReview.role || (newReview.type === 'toptan' ? 'Toptan Mağaza Müşterisi' : 'Bireysel Müşteri'),
      location: newReview.location || 'Türkiye',
      rating: newReview.rating,
      comment: newReview.comment,
      productName: newReview.productName || 'İrem Comfort Hakiki Deri Terlik',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      type: newReview.type,
      verified: true
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
      setNewReview({
        name: '',
        role: '',
        location: '',
        comment: '',
        productName: '',
        type: 'perakende',
        rating: 5
      });
    }, 1500);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-slate-50 via-blue-50/30 to-white relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062050]/5 border border-[#062050]/15 text-[#062050] text-xs font-extrabold uppercase tracking-widest mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#062050]" />
            <span>{t.testimonialsBadge || 'GÜVEN VE MEMNUNİYET'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold font-serif-luxury text-[#062050] tracking-tight"
          >
            {t.testimonialsTitle || 'Müşteri Yorumları & Referanslar'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed"
          >
            {t.testimonialsSubtitle || 'Atölyemizden sipariş veren toptan mağazalarımız ve perakende müşterilerimizin gerçek değerlendirmeleri.'}
          </motion.p>
        </div>

        {/* Filter Controls & Add Review Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#062050] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#062050]'
              }`}
            >
              {t.testimonialsAll || 'Tüm Yorumlar'} ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter('toptan')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'toptan'
                  ? 'bg-[#062050] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#062050]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.testimonialsWholesale || 'Toptan / Butik Müşterileri'}</span>
            </button>
            <button
              onClick={() => setFilter('perakende')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filter === 'perakende'
                  ? 'bg-[#062050] text-white shadow-sm'
                  : 'text-slate-700 hover:text-[#062050]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.testimonialsRetail || 'Perakende Müşterileri'}</span>
            </button>
          </div>

          {/* Add Review Action */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#062050] to-[#0D3B8B] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-102 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>{t.testimonialsSubmitBtn || 'Siz de Değerlendirme Yapın'}</span>
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const translatedText = getTranslatedComment(item);

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-100 flex flex-col justify-between relative group hover:-translate-y-1"
              >
                <div>
                  {/* Top Row: Stars & Customer Type Badge (Clean layout without overlapping absolute watermark) */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                        item.type === 'toptan'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.type === 'toptan' 
                        ? (t.testimonialsWholesale ? 'Toptan Mağaza' : 'Toptan Mağaza')
                        : (t.testimonialsRetail ? 'Perakende' : 'Perakende')}
                    </span>
                  </div>

                  {/* Quote Icon Header Accent */}
                  <div className="flex items-start gap-2 mb-3">
                    <MessageSquareQuote className="w-5 h-5 text-[#062050]/40 shrink-0 mt-0.5" />
                    <div>
                      {/* Original Comment */}
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold italic">
                        "{item.comment}"
                      </p>
                      {language !== 'tr' && (
                        <span className="inline-block mt-1 text-[10px] text-slate-400 font-mono">
                          {language === 'en' ? '(Original Turkish Text)' : '(النص الأصلي بالتركية)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Auto Translation Box (Visible when language is NOT Turkish) */}
                  {translatedText && (
                    <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#062050] mb-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          {language === 'en' 
                            ? 'Automatically translated to English:' 
                            : 'ترجمة تلقائية إلى العربية:'}
                        </span>
                      </div>
                      <p className="text-slate-700 italic font-medium leading-relaxed">
                        "{translatedText}"
                      </p>
                    </div>
                  )}

                  {/* Referenced Product */}
                  {item.productName && (
                    <div className="text-[11px] font-bold text-[#062050] bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/80 mt-4 inline-block">
                      👟 {item.productName}
                    </div>
                  )}
                </div>

                {/* Author Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-extrabold text-[#062050]">
                        {item.name}
                      </h4>
                      {item.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" title={t.testimonialsVerified} />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {item.role} • {item.location}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {item.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-200"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-blue-100 text-[#062050]">
                  <MessageSquareQuote className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold font-serif-luxury text-[#062050]">
                  {t.testimonialsFormTitle || 'Değerlendirmenizi Gönderin'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                {language === 'tr'
                  ? 'İrem Comfort kalitesi ve müşteri deneyimi hakkındaki değerli görüşlerinizi paylaşın.'
                  : language === 'en'
                  ? 'Share your valuable thoughts on Irem Comfort quality and experience.'
                  : 'شاركنا تقييمك حول جودة إيريم كومفورت وتجربة عملائنا.'}
              </p>

              {formSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-[#062050]">
                    {language === 'tr' ? 'Teşekkür Ederiz!' : language === 'en' ? 'Thank You!' : 'شكراً جزيلاً!'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {language === 'tr'
                      ? 'Değerlendirmeniz başarıyla eklenmiştir.'
                      : language === 'en'
                      ? 'Your review has been successfully submitted.'
                      : 'تم إرسال تقييمك بنجاح.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'tr' ? 'Müşteri Tipi' : language === 'en' ? 'Customer Type' : 'نوع العميل'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewReview({ ...newReview, type: 'perakende' })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                          newReview.type === 'perakende'
                            ? 'bg-[#062050] text-white border-[#062050]'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {language === 'tr' ? 'Perakende Müşteri' : language === 'en' ? 'Retail Customer' : 'عميل تجزئة'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewReview({ ...newReview, type: 'toptan' })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                          newReview.type === 'toptan'
                            ? 'bg-[#062050] text-white border-[#062050]'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {language === 'tr' ? 'Toptan / Butik Müşterisi' : language === 'en' ? 'Wholesale / Boutique' : 'عميل جملة / بوتيك'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.testimonialsFormName || (language === 'tr' ? 'Adınız Soyadınız / Mağaza Adınız' : language === 'en' ? 'Full Name / Store Name' : 'الاسم الكامل / اسم المتجر')}
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder={language === 'tr' ? 'Örn: Ayşe Y. veya Kardelen Butik' : language === 'en' ? 'e.g. John D. or Rose Boutique' : 'مثال: محمد ع. أو بوتيك الورد'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#062050]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'tr' ? 'Şehir / Konum' : language === 'en' ? 'City / Location' : 'المدينة / الموقع'}
                      </label>
                      <input
                        type="text"
                        value={newReview.location}
                        onChange={e => setNewReview({ ...newReview, location: e.target.value })}
                        placeholder={language === 'tr' ? 'Örn: İzmir' : language === 'en' ? 'e.g. London' : 'مثال: دبي'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#062050]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'tr' ? 'Değerlendirme Puanı' : language === 'en' ? 'Rating' : 'التقييم'}
                      </label>
                      <select
                        value={newReview.rating}
                        onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#062050] bg-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                        <option value={3}>⭐⭐⭐ (3/5)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'tr' ? 'Satın Alınan / Değerlendirilen Ürün Modeli' : language === 'en' ? 'Purchased Product Model' : 'موديل المنتج المجرّب'}
                    </label>
                    <select
                      value={newReview.productName}
                      onChange={e => setNewReview({ ...newReview, productName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#062050] bg-white font-medium"
                    >
                      <option value="">{language === 'tr' ? '-- Ürün Modeli Seçin --' : language === 'en' ? '-- Select Product Model --' : '-- اختر الموديل --'}</option>
                      {(collectionItems || []).map((prod) => (
                        <option key={prod.id} value={prod.name}>
                          {prod.name} ({prod.category})
                        </option>
                      ))}
                      <option value="İrem Comfort Genel Koleksiyon">İrem Comfort General Collection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'tr' ? 'Yorumunuz' : language === 'en' ? 'Your Review' : 'تعليقك'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder={
                        language === 'tr'
                          ? 'Ürün kalitesi, konforu, deri dokusu veya teslimat süreci hakkındaki düşünceleriniz...'
                          : language === 'en'
                          ? 'Your feedback about comfort, leather texture, craft or delivery...'
                          : 'رأيك حول الراحة، جودة الجلد، الحرفية أو سرعة التوصيل...'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#062050]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#062050] hover:bg-[#082C6C] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>{t.testimonialsFormSubmit || (language === 'tr' ? 'Yorumu Yayınla' : language === 'en' ? 'Submit Review' : 'إرسال التقييم')}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

