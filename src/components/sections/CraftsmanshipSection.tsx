import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CRAFTSMANSHIP_STEPS } from '../../constants/data';
import { ShieldCheck, Cpu, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

export const CraftsmanshipSection: React.FC = () => {
  const { images, craftsmanshipSteps } = useAppImages();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const stepsToDisplay = craftsmanshipSteps && craftsmanshipSteps.length > 0 ? craftsmanshipSteps : CRAFTSMANSHIP_STEPS;
  const activeStep = stepsToDisplay[activeStepIndex] || stepsToDisplay[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Cpu': return Cpu;
      case 'Sparkles': return Sparkles;
      case 'Award': return Award;
      default: return ShieldCheck;
    }
  };

  return (
    <section id="craftsmanship" className="py-24 sm:py-32 bg-[#F8F8F8] relative overflow-hidden">
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
            <span>Dikişlerin Arkasındaki Sanat</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-light tracking-tight text-[#111111]"
          >
            Tavizsiz Zanaat ve <span className="font-serif-luxury font-bold text-[#0A2D6F]">Aşamaları</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base text-[#111111]/70 font-light"
          >
            İlk deri seçiminden son cila dokunuşuna kadar her bir İrem Comfort tasarımı dört hassas zanaat aşamasından geçer.
          </motion.p>
        </div>

        {/* Step Selector Tabs (Desktop Timeline / Mobile Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Timeline Step Selector */}
          <div className="lg:col-span-5 space-y-4">
            {stepsToDisplay.map((step, idx) => {
              const isActive = activeStepIndex === idx;

              return (
                <motion.div
                  key={step.number}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#0A2D6F] shadow-xl shadow-[#0A2D6F]/10 scale-[1.02]'
                      : 'bg-white/60 border-transparent hover:bg-white hover:border-[#0A2D6F]/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${
                      isActive ? 'bg-[#0A2D6F] text-white' : 'bg-[#0A2D6F]/10 text-[#0A2D6F]'
                    }`}>
                      {step.number}
                    </div>

                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-[#0A2D6F] uppercase tracking-wider block">
                        {step.subtitle}
                      </span>
                      <h3 className="text-lg font-bold text-[#111111] font-serif-luxury">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Active Step Detailed View */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.number}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0A2D6F]/10 shadow-2xl space-y-8"
              >
                {/* Step Image */}
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-[#062050] to-[#0A2D6F] flex items-center justify-center">
                  {(images.craftsmanshipImages[activeStep.number] || activeStep.image) ? (
                    <img
                      src={images.craftsmanshipImages[activeStep.number] || activeStep.image}
                      alt={activeStep.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('/public/uploads/')) {
                          const parts = target.src.split('/public/uploads/');
                          if (parts[1]) {
                            target.src = '/uploads/' + parts[1];
                            return;
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="p-6 text-center text-white space-y-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block">
                        Manisa Atölye Üretimi
                      </span>
                      <h4 className="text-lg font-serif font-bold">{activeStep.title}</h4>
                      <p className="text-xs text-slate-300">Görsel Bekleniyor</p>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-[#0A2D6F] text-white text-xs font-bold tracking-widest uppercase">
                    Aşama {activeStep.number} / 04
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-[#0A2D6F] uppercase tracking-widest">
                      {activeStep.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] font-serif-luxury mt-1">
                      {activeStep.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-[#111111]/70 font-light leading-relaxed">
                    {activeStep.description}
                  </p>
                </div>

                {/* Detail Points Checklist */}
                <div className="pt-6 border-t border-[#0A2D6F]/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2D6F] mb-4">
                    Kalite Kriterleri
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeStep.detailPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#111111]/80">
                        <CheckCircle2 className="w-4 h-4 text-[#0A2D6F] shrink-0 mt-0.5" />
                        <span className="font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
