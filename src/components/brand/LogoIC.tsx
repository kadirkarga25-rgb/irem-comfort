import React from 'react';

interface LogoICProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Precision SVG vector component for İrem Comfort circular IC icon logo
 */
export const LogoIC: React.FC<LogoICProps> = ({
  className = '',
  size = 48,
  color = '#082C6C'
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
      {/* Outer Circle Ring with Top-Right Slit/Gap */}
      <path
        d="M 124 22 A 80 80 0 1 1 142 32"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />

      {/* Letter 'i' - Round Dot */}
      <circle cx="80" cy="73" r="9.5" fill={color} />

      {/* Letter 'i' - Vertical Bar */}
      <rect x="73" y="91" width="14" height="44" rx="2" fill={color} />

      {/* Letter 'c' - Lowercase Arc */}
      <path
        d="M 132 96 C 121 89 107 90 99 98 C 90 107 90 121 99 130 C 108 139 122 139 132 131"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
