import React from 'react';
import { Calendar, Sparkles, ChevronRight, Ticket, MapPin } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface FairInvitationStripProps {
  onOpenFairModal: () => void;
  className?: string;
}

export const FairInvitationStrip: React.FC<FairInvitationStripProps> = ({
  onOpenFairModal,
  className = ''
}) => {
  const { fairConfig, language } = useAppImages();

  if (!fairConfig || !fairConfig.enabled) {
    return null;
  }

  return (
    <div className={`w-full bg-gradient-to-r from-[#062050] via-[#082C6C] to-[#0A3888] text-white py-1.5 sm:py-2 px-3 sm:px-4 border-b border-amber-400/30 shadow-sm relative z-30 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
        
        {/* Left Info Badge */}
        <div 
          onClick={onOpenFairModal}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-sm shrink-0">
            <Ticket className="w-3 h-3" />
            <span>{language === 'tr' ? 'Fuar Davetiyesi' : language === 'en' ? 'Fair Invitation' : 'دعوة المعرض'}</span>
          </span>

          <span className="font-semibold text-white/95 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <span>
              🎪 <strong>{fairConfig.name}</strong> {language === 'tr' ? 'Standımıza Davetlisiniz!' : language === 'en' ? 'Visit Our Stand!' : 'أنتم مدعوون لزيارة جناحنا!'}
            </span>
            <span className="hidden sm:inline text-amber-300/80">•</span>
            <span className="hidden sm:inline text-slate-200 font-normal">({fairConfig.standNumber})</span>
          </span>
        </div>

        {/* Right CTA Button */}
        <button
          onClick={onOpenFairModal}
          type="button"
          className="px-3.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 ml-auto"
        >
          <span>{language === 'tr' ? 'Kayıt & Davetiye Al' : language === 'en' ? 'Register & Get Ticket' : 'التسجيل والحصول على الدعوة'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
