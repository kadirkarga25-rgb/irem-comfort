import React from 'react';
import { LogoIC } from './LogoIC';

interface LogoFullProps {
  className?: string;
  iconSize?: number;
  color?: string;
  showText?: boolean;
}

export const LogoFull: React.FC<LogoFullProps> = ({
  className = '',
  iconSize = 38,
  color = '#082C6C',
  showText = true
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer group ${className}`}>
      <LogoIC size={iconSize} color={color} className="group-hover:scale-105 transition-transform duration-300" />
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out flex items-center ${
          showText ? 'max-w-[240px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-4 pointer-events-none'
        }`}
      >
        <span 
          className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap select-none flex items-baseline"
          style={{ color }}
        >
          <span className="font-medium tracking-tight">irem</span>
          <span className="font-bold tracking-tight ml-[1px]">comfort</span>
          <sup className="text-[10px] sm:text-[11px] font-semibold ml-0.5 tracking-normal opacity-90">TM</sup>
        </span>
      </div>
    </div>
  );
};
