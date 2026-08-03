import React from 'react';

interface LogoICProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Official precision vector SVG component for İrem Comfort circular IC icon logo
 * Renders the circular ring with a top-right gap and the 'i' and 'c' letters centered inside the ring.
 */
export const LogoIC: React.FC<LogoICProps> = ({
  className = '',
  size = 48,
  color = '#0A2D6F'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 transition-all duration-300 ${className}`}
      aria-label="İrem Comfort IC Logo"
    >
      {/* Outer Circle Ring with Top-Right Gap */}
      <path
        d="M 160 52 A 78 78 0 1 1 118 25"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inside Glyph Group - 'i' and 'c' perfectly centered inside the ring */}
      <g>
        {/* Letter 'i' - Top Dot */}
        <circle cx="68" cy="68" r="8" fill={color} />

        {/* Letter 'i' - Vertical Stem */}
        <rect x="61" y="88" width="14" height="48" rx="3" fill={color} />

        {/* Letter 'c' - Lowercase Arc */}
        <path
          d="M 131 92 A 23 23 0 1 0 131 132"
          stroke={color}
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
