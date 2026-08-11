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
      {/* Outer Circle Ring with top-right gap */}
      <path
        d="M 164 63 A 74 74 0 1 0 137 36"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inside Glyph Group - 'i' and 'c' */}
      <g>
        {/* Letter 'i' - Top Dot */}
        <circle cx="72" cy="71" r="8.5" fill={color} />

        {/* Letter 'i' - Vertical Stem */}
        <rect x="63.5" y="87" width="17" height="48" rx="4" fill={color} />

        {/* Letter 'c' - Lowercase Arc */}
        <path
          d="M 137 93 A 22 22 0 1 0 137 129"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
