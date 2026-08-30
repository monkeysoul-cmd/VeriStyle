import React from 'react';

interface VeriLensIconProps {
  className?: string;
  size?: number | string;
  animated?: boolean;
}

export const VeriLensIcon: React.FC<VeriLensIconProps> = ({ 
  className = 'w-5 h-5',
  size,
  animated = false
}) => {
  const uniqueId = React.useId().replace(/:/g, '');
  
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 inline-block ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id={`iris-grad-${uniqueId}`} x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6">
            {animated && (
              <animate attributeName="stop-opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
            )}
          </stop>
          <stop offset="100%" stopColor="currentColor" stopOpacity="1">
            {animated && (
              <animate attributeName="stop-opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
            )}
          </stop>
        </linearGradient>
      </defs>

      {/* Outer Optical Scan Bracket Corners */}
      <path d="M3 8V5A2 2 0 0 1 5 3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M16 3H19A2 2 0 0 1 21 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M21 16V19A2 2 0 0 1 19 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M8 21H5A2 2 0 0 1 3 19V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
      
      {/* Center Lens Iris Aperture with Gradient */}
      <circle 
        cx="12" 
        cy="12" 
        r="5" 
        stroke={`url(#iris-grad-${uniqueId})`} 
        strokeWidth="1.5" 
        strokeDasharray="3 2"
      >
        {animated && (
          <animateTransform 
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="8s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      
      {/* Verification Checkmark */}
      <path 
        d="M9.5 12L11.2 13.7L14.8 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {animated && (
          <animate attributeName="stroke-opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
        )}
      </path>
    </svg>
  );
};
