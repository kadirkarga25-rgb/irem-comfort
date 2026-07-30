import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Feather, Compass } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

export const AboutSection: React.FC = () => {
  const { images } = useAppImages();
  const pillars = [
    {
      icon: Shield,
      title: '%100 Hakiki Deri',
      desc: 'Sadece nefes alabilen, terleme yapmayan yumuşak hakiki dana ve kuzu saya derileri kullanıyoruz.'
    },
    {
      icon: Sparkles,
      title: 'Manisa İmalat Zanaatı',
      desc: 'Her bir terlik ve sandalet, Manisa Ayakkabıcılar Sitesindeki atölyemizde tecrübeli ustalarımızca özenle dikilir.'
    },
    {
      icon: Feather,
      title: 'Anatomik Konfor Taban',
      desc: 'Ayak kavislerini tam destekleyen, topuk yükünü emen özel ortopedik kavisli taban mimarisi.'
    },
    {
      icon: Compass,
      title: 'Şık & Fonksiyonel',
      desc: 'Çift tokalı klasiklerden ortopedik sabolara, hem işte hem günlük yaşamda zarif adımlar.'
    }
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#F8F8F8] relative overflow-hidden">
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
            <span>Mirasımız & Atölyemiz</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            Her Adımda <span className="font-serif-luxury font-bold text-[#0A2D6F]">Hakiki Deri</span> ve Esnek <span className="italic font-serif-luxury text-[#163E87]">Konfor</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-[#111111]/70 font-light leading-relaxed"
          >
            İrem Comfort olarak Manisa Ayakkabıcılar Sitesindeki imalathanemizde kadınların ayak sağlığı ve konforu için çalışıyoruz. %100 hakiki deri saya, yumuşatılmış iç taban ve ortopedik kavislerle ürettiğimiz bayan comfort terlik ve sandaletlerimiz, günün her saatinde hafif ve rahat adımlar atmanızı sağlar.
          </motion.p>
        </div>

        {/* Grid Showcase: Image + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl group"
          >
            <img
              src={images.aboutImage}
              alt="İrem Comfort Manisa Atölye Deri İmalatı"
              className="w-full h-[450px] sm:h-[520px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="text-xs uppercase tracking-widest text-white/80 font-medium">Manisa Ayakkabıcılar Sitesi</span>
              <h3 className="text-2xl font-bold font-serif-luxury">Titiz El İşçiliği ve Yerli İmalat Güvencesi</h3>
            </div>
          </motion.div>

          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-[#111111] font-serif-luxury">
                  Nefes Alan Hakiki Saya
                </h3>
                <p className="text-sm sm:text-base text-[#111111]/70 font-light leading-relaxed">
                  İmalatımızda kullanılan tüm deriler doğal yöntemlerle işlenmiş, terleme ve koku yapmayan yumuşak hakiki dana derileridir. Ayaklarınızı tahriş etmeden gün boyu nefes almasını sağlar.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#0A2D6F]/10">
                <h3 className="text-2xl font-semibold text-[#111111] font-serif-luxury">
                  Anatomik Taban Mimarisi
                </h3>
                <p className="text-sm sm:text-base text-[#111111]/70 font-light leading-relaxed">
                  Ayak taban kavisini ve topuğu mükemmel destekleyen poliüretan ve mantar taban yapımız, vücut ağırlığını dengeli dağıtarak bacak ve bel yorgunluğunu en aza indirir.
                </p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* 4 Pillars Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#0A2D6F]/10 shadow-sm hover:shadow-xl hover:border-[#0A2D6F]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0A2D6F]/5 flex items-center justify-center text-[#0A2D6F] mb-6 group-hover:bg-[#0A2D6F] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] font-serif-luxury mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#111111]/70 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
