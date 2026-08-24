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
      {/* Outer Circle Ring with subtle gap at top-right above the 'c' */}
      <path
        d="M 168 68 A 76 76 0 1 0 138 34"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inside Glyph Group - 'i' and 'c' perfectly centered inside the ring */}
      <g>
        {/* Letter 'i' - Top Dot */}
        <circle cx="69" cy="68" r="7.5" fill={color} />

        {/* Letter 'i' - Vertical Stem */}
        <rect x="61.5" y="84" width="15" height="46" rx="3" fill={color} />

        {/* Letter 'c' - Lowercase Arc */}
        <path
          d="M 132 94 A 20 20 0 1 0 132 122"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
