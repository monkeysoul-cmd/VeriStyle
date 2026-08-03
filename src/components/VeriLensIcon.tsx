import React from 'react';

interface VeriLensIconProps {
  className?: string;
  size?: number | string;
}

export const VeriLensIcon: React.FC<VeriLensIconProps> = ({ 
  className = 'w-5 h-5',
  size
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 inline-block ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Outer Optical Scan Bracket Corners */}
      <path d="M3 8V5A2 2 0 0 1 5 3H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 3H19A2 2 0 0 1 21 5V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 16V19A2 2 0 0 1 19 21H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 21H5A2 2 0 0 1 3 19V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Center Lens Iris Aperture */}
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      
      {/* Verification Checkmark */}
      <path d="M9.5 12L11.2 13.7L14.8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
