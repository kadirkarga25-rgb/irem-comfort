import React from 'react';
import { LogoIC } from './LogoIC';

interface LogoFullProps {
  className?: string;
  iconSize?: number;
  color?: string; // Optional accent / icon color
  iremColor?: string; // Optional custom color for "irem"
  comfortColor?: string; // Optional custom color for "comfort"
  showText?: boolean;
}

export const LogoFull: React.FC<LogoFullProps> = ({
  className = '',
  iconSize = 40,
  color,
  iremColor,
  comfortColor,
  showText = true
}) => {
  // Check if logo is being rendered on a dark background (e.g., footer where color="#FFFFFF" or "white")
  const isDarkBg = color === '#FFFFFF' || color === 'white' || color === '#fff';

  const iconColor = color || '#0A2D6F';
  const defaultIremColor = iremColor || (isDarkBg ? '#FFFFFF' : '#111827');
  const defaultComfortColor = comfortColor || (isDarkBg ? '#FFFFFF' : '#0A2D6F');

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none ${className}`}>
      {/* IC Icon Badge */}
      <LogoIC size={iconSize} color={iconColor} className="group-hover:scale-105 transition-transform duration-300" />
      
      {/* Brand Name Text: "irem comfort™" */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out flex items-center ${
          showText ? 'max-w-[300px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-4 pointer-events-none'
        }`}
      >
        <span className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap flex items-baseline">
          {/* "irem" in charcoal / dark grey */}
          <span 
            className="font-normal tracking-tight transition-colors duration-200"
            style={{ color: defaultIremColor }}
          >
            irem
          </span>

          {/* "comfort" in brand navy blue */}
          <span 
            className="font-bold tracking-tight ml-[1px] transition-colors duration-200"
            style={{ color: defaultComfortColor }}
          >
            comfort
          </span>

          {/* (TM) Trademark badge inside circle as in official brand identity */}
          <span 
            className="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 border border-current rounded-full text-[7px] sm:text-[8px] font-bold ml-1 -translate-y-1.5 opacity-80 shrink-0"
            style={{ color: defaultComfortColor }}
            title="Registered Trademark"
          >
            TM
          </span>
        </span>
      </div>
    </div>
  );
};
