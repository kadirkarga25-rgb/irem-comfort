import React from 'react';
import { motion } from 'motion/react';
import { WHY_US_CARDS } from '../../constants/data';
import { Layers, Hammer, HeartPulse, Compass, ShieldCheck } from 'lucide-react';

export const WhyIremComfortSection: React.FC = () => {
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
            <span>İrem Comfort Farkı</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            Neden <span className="font-serif-luxury font-bold text-[#0A2D6F]">Biz</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base text-[#111111]/70 font-light"
          >
            Bayan comfort terlik ve sandalet imalatımızı öne çıkaran 5 temel değerimiz.
          </motion.p>
        </div>

        {/* 5 Core Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_US_CARDS.map((card, idx) => {
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
                    Ayrıcalık #{idx + 1}
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
