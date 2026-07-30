import React from 'react';
import { motion } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { Sparkles, MapPin, Calendar, QrCode, ArrowRight } from 'lucide-react';

interface FairTopBannerProps {
  onOpenModal: () => void;
}

export const FairTopBanner: React.FC<FairTopBannerProps> = ({ onOpenModal }) => {
  const { fairConfig } = useAppImages();

  if (!fairConfig.enabled) return null;

  return (
    <div className="bg-gradient-to-r from-[#082C6C] via-[#103E91] to-[#082C6C] text-white py-2 px-4 shadow-md border-b border-amber-400/30 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left Side Info */}
        <div className="flex items-center gap-2 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-[#082C6C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 animate-pulse">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>FUAR DAVETİ</span>
          </span>

          <span className="font-bold text-amber-200 shrink-0">
            {fairConfig.name}
          </span>

          <span className="hidden md:inline text-white/40">|</span>

          <span className="hidden md:inline-flex items-center gap-1 text-white/90">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{fairConfig.standNumber}</span>
          </span>

          <span className="hidden lg:inline text-white/40">|</span>

          <span className="hidden lg:inline-flex items-center gap-1 text-white/80">
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>{fairConfig.startDate} - {fairConfig.endDate}</span>
          </span>
        </div>

        {/* Right Side Button */}
        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-[#082C6C] text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ml-auto"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Fuar Detayları & QR Kod</span>
          <ArrowRight className="w-3 h-3" />
        </button>

      </div>
    </div>
  );
};
