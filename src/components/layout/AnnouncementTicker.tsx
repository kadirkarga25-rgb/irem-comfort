import React from 'react';
import { Phone, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface AnnouncementTickerProps {
  onContactClick?: () => void;
  className?: string;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  onContactClick,
  className = ''
}) => {
  const { announcements, contactData } = useAppImages();

  const tickerItems = (announcements && announcements.length > 0 ? announcements : [
    "YENİ SEZON HAKİKİ DERİ BAYAN COMFORT SANDALET VE TERLİK KOLEKSİYONU",
    `YENİ SEZON KATALOĞU VE BİLGİ HATTI: ${contactData?.phoneDisplay || '0533 029 71 25'}`,
    "MANİSA AYAKKABICILAR SİTESİ ÜRETİM ATÖLYEMİZDEN DOĞRUDAN DANIŞMA"
  ]).map(text => ({ text, tag: "Duyuru" }));

  // Repeat items for seamless smooth infinite looping
  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className={`w-full bg-[#0A2D6F] text-white overflow-hidden py-2.5 sm:py-3 border-b border-white/10 shadow-md ${className}`}>
      <div className="relative flex overflow-x-hidden select-none">
        <div className="animate-marquee flex whitespace-nowrap items-center shrink-0">
          {repeatedItems.map((item, idx) => (
            <div
              key={idx}
              onClick={onContactClick}
              className="inline-flex items-center gap-2 mx-6 text-xs sm:text-sm font-semibold tracking-wider text-white/90 hover:text-amber-300 transition-colors cursor-pointer group"
            >
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {item.tag}
              </span>
              <span>{item.text}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              <span className="mx-4 text-white/30">•</span>
            </div>
          ))}
        </div>

        <div className="animate-marquee2 flex whitespace-nowrap items-center shrink-0 absolute top-0 left-0">
          {repeatedItems.map((item, idx) => (
            <div
              key={`dup-${idx}`}
              onClick={onContactClick}
              className="inline-flex items-center gap-2 mx-6 text-xs sm:text-sm font-semibold tracking-wider text-white/90 hover:text-amber-300 transition-colors cursor-pointer group"
            >
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {item.tag}
              </span>
              <span>{item.text}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              <span className="mx-4 text-white/30">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
