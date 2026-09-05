import React from 'react';
import { motion } from 'motion/react';
import { Layers, Hammer, HeartPulse, Compass, ShieldCheck } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

export const WhyIremComfortSection: React.FC = () => {
  const { language } = useAppImages();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return Layers;
      case 'Hammer': return Hammer;
      case 'HeartPulse': return HeartPulse;
      case 'Compass': return Compass;
      case 'ShieldCheck': return ShieldCheck;
      default: return ShieldCheck;
    }
  };

  const cards = language === 'en' ? [
    {
      id: 'leather',
      title: '100% Genuine Leather',
      subtitle: 'Premium Uppers & Inner Linings',
      description: 'We strictly use 100% genuine leather in all women’s comfort slippers and sandals. Natural breathability prevents sweat and odor.',
      metric: '100%',
      metricLabel: 'Genuine Leather Guarantee',
      iconName: 'Layers'
    },
    {
      id: 'handcrafted',
      title: 'Manisa Workshop Craft',
      subtitle: 'Shoemakers Industrial Site',
      description: 'Directly crafted by seasoned master artisans in our Manisa workshop. We deliver genuine manufacturer quality with no intermediaries.',
      metric: 'Manisa',
      metricLabel: 'Local Production Workshop',
      iconName: 'Hammer'
    },
    {
      id: 'comfort',
      title: 'Anatomic Comfort',
      subtitle: 'Orthotic Footbed Support',
      description: 'Special footbeds tailored to your natural arch contours eliminate fatigue even during extended hours on your feet.',
      metric: 'Anatomic',
      metricLabel: 'Soft Comfort Sole',
      iconName: 'HeartPulse'
    },
    {
      id: 'design',
      title: 'Timeless Model Variety',
      subtitle: 'Sandals, Sabots & Slippers',
      description: 'From double-buckle classics to orthotic sabots and summer sandals, explore our rich catalog of colors and styles.',
      metric: 'Rich',
      metricLabel: 'Color & Model Variety',
      iconName: 'Compass'
    },
    {
      id: 'quality',
      title: 'Wholesale & Retail',
      subtitle: 'Customer Satisfaction Guarantee',
      description: 'Direct manufacturer pricing with store supply across Turkey, bulk wholesale, and retail order options.',
      metric: 'Direct',
      metricLabel: 'Manufacturer Orders',
      iconName: 'ShieldCheck'
    }
  ] : language === 'ar' ? [
    {
      id: 'leather',
      title: 'جلد طبيعي 100%',
      subtitle: 'جزء علوي وبطانة فاخرة',
      description: 'نستخدم جلدًا طبيعيًا 100% في جميع أحذية ونعال الراحة النسائية. يوفر تهوية طبيعية تمنع التعرق والرائحة.',
      metric: '100%',
      metricLabel: 'ضمان الجلد الطبيعي',
      iconName: 'Layers'
    },
    {
      id: 'handcrafted',
      title: 'صناعة ورشة مانيسا',
      subtitle: 'مجمع صناع الأحذية',
      description: 'تصنع مباشرة بأيدي حرفيين مهرة في ورشتنا في مانيسا. جودة المصنّع الأصلية بدون وسطاء.',
      metric: 'مانيسا',
      metricLabel: 'ورشة إنتاج محلي',
      iconName: 'Hammer'
    },
    {
      id: 'comfort',
      title: 'راحة تشريحية',
      subtitle: 'دعم النعل الطبي',
      description: 'فرشات خاصة تتكيف مع التجاويف الطبيعية للقدم لتمنع التعب حتى عند الوقوف لفترات طويلة.',
      metric: 'تشريحي',
      metricLabel: 'نعل طري ومريح',
      iconName: 'HeartPulse'
    },
    {
      id: 'design',
      title: 'موديلات خالدة ومتنوعة',
      subtitle: 'صنادل وقباقيب ونعال',
      description: 'من الموديلات الكلاسيكية ذات الإبزيمين إلى القباقيب الطبية وصنادل الصيف الأنيقة بمختلف الألوان.',
      metric: 'تنوع كبير',
      metricLabel: 'ألوان وموديلات متعددة',
      iconName: 'Compass'
    },
    {
      id: 'quality',
      title: 'جملة وتجزئة',
      subtitle: 'ضمان رضا العملاء',
      description: 'توريد للمحلات ومبيعات بالجملة وتجزئة مباشرة من المصنع بأفضل الأسعار التنافسية.',
      metric: 'مباشر',
      metricLabel: 'طلب من المصنع',
      iconName: 'ShieldCheck'
    }
  ] : [
    {
      id: 'leather',
      title: '%100 Hakiki Deri',
      subtitle: 'Kaliteli Saya & İç Astar',
      description: 'Tüm bayan comfort terlik ve sandaletlerimizde %100 hakiki deri kullanıyoruz. Nefes alan yapısıyla koku ve terlemeyi önler.',
      metric: '%100',
      metricLabel: 'Hakiki Deri Garantisi',
      iconName: 'Layers'
    },
    {
      id: 'handcrafted',
      title: 'Manisa İmalatı',
      subtitle: 'Ayakkabıcılar Sitesi Atölyesi',
      description: 'Manisa Ayakkabıcılar Sitesindeki atölyemizde tecrübeli ustalarımız tarafından doğrudan imal edilir. Aracı olmadan üretici kalitesi sunuyoruz.',
      metric: 'Manisa',
      metricLabel: 'Yerli İmalat Atölyesi',
      iconName: 'Hammer'
    },
    {
      id: 'comfort',
      title: 'Anatomik Konfor',
      subtitle: 'Ortopedik Taban Desteği',
      description: 'Ayağın doğal kavislerine uyum sağlayan özel tabanlıklar sayesinde gün boyu ayakta kalsanız dahi yorgunluk hissetmezsiniz.',
      metric: 'Anatomik',
      metricLabel: 'Yumuşak Taban',
      iconName: 'HeartPulse'
    },
    {
      id: 'design',
      title: 'Zamansız Model Seçenekleri',
      subtitle: 'Sandalet, Sabo & Terlik',
      description: 'Çift tokalı klasiklerden ortopedik sabo ve yazlık sandaletlere kadar zengin model ve renk çeşitliliği sunuyoruz.',
      metric: 'Zengin',
      metricLabel: 'Renk & Model Çeşitliliği',
      iconName: 'Compass'
    },
    {
      id: 'quality',
      title: 'Toptan & Perakende',
      subtitle: 'Müşteri Memnuniyeti Güvencesi',
      description: 'Türkiye genelinde mağaza tedariği, toptan satış ve perakende sipariş imkanı ile doğrudan imalatçı avantajı.',
      metric: 'İmalatçı',
      metricLabel: 'Doğrudan Sipariş',
      iconName: 'ShieldCheck'
    }
  ];

  return (
    <section id="why-us" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#0A2D6F] uppercase"
          >
            <span className="w-8 h-[1px] bg-[#0A2D6F]" />
            <span>
              {language === 'tr' ? 'İrem Comfort Farkı' : language === 'en' ? 'The İrem Comfort Edge' : 'ميزة إيرم كومفورت'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            {language === 'tr' ? (
              <>Neden <span className="font-serif-luxury font-bold text-[#0A2D6F]">Biz</span>?</>
            ) : language === 'en' ? (
              <>Why <span className="font-serif-luxury font-bold text-[#0A2D6F]">Choose Us</span>?</>
            ) : (
              <>لماذا <span className="font-serif-luxury font-bold text-[#0A2D6F]">تختارنا</span>؟</>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base text-[#111111]/70 font-light"
          >
            {language === 'tr'
              ? 'Bayan comfort terlik ve sandalet imalatımızı öne çıkaran 5 temel değerimiz.'
              : language === 'en'
              ? 'Our 5 core pillars distinguishing our women’s comfort footwear manufacturing.'
              : 'قيمنا الخمس الأساسية التي تميز صناعتنا لأحذية ونعال الراحة النسائية.'}
          </motion.p>
        </div>

        {/* 5 Core Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const CardIcon = getIcon(card.iconName);
            const isLarge = idx === 0 || idx === 3;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`group p-8 rounded-3xl bg-[#F8F8F8] border border-[#0A2D6F]/10 hover:border-[#0A2D6F]/30 hover:bg-white hover:shadow-2xl transition-all duration-500 flex flex-col justify-between ${
                  isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#0A2D6F]/5 flex items-center justify-center text-[#0A2D6F] group-hover:bg-[#0A2D6F] group-hover:text-white transition-all duration-300">
                      <CardIcon className="w-7 h-7" />
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold font-serif-luxury text-[#0A2D6F] block">
                        {card.metric}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#111111]/50 font-medium">
                        {card.metricLabel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#0A2D6F] uppercase tracking-widest">
                      {card.subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-[#111111] font-serif-luxury">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#111111]/70 font-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#0A2D6F]/10 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0A2D6F] uppercase tracking-widest">
                    {language === 'tr' ? `Ayrıcalık #${idx + 1}` : language === 'en' ? `Advantage #${idx + 1}` : `الميزة #${idx + 1}`}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#0A2D6F]/30 group-hover:bg-[#0A2D6F] transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
