import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';

interface VeriLensLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const VeriLensLogo: React.FC<VeriLensLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = ''
}) => {
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl'
  };

  const svgDimensions = {
    sm: 18,
    md: 22,
    lg: 30
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${containerSizes[size]} bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all duration-300`}>
        <div className="w-full h-full bg-slate-950 rounded-[inherit] flex items-center justify-center relative overflow-hidden">
          {/* Glowing Lens Ambient Aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-emerald-500/10 to-transparent blur-[2px]" />
          
          {/* Precision VeriLens Optical SVG Emblem */}
          <svg 
            width={svgDimensions[size]} 
            height={svgDimensions[size]} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Outer Scanning Bracket Corners (Lens Reticle) */}
            <path d="M3 8V5A2 2 0 0 1 5 3H8" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 3H19A2 2 0 0 1 21 5V8" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M21 16V19A2 2 0 0 1 19 21H16" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 21H5A2 2 0 0 1 3 19V16" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Center Lens Iris Circle */}
            <circle cx="12" cy="12" r="5" stroke="url(#verilens-grad)" strokeWidth="1.5" className="animate-pulse" />
            
            {/* Authenticity Verification Checkmark inside Lens */}
            <path d="M9.5 12L11.2 13.7L14.8 10" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            <defs>
              <linearGradient id="verilens-grad" x1="7" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>

          {/* Micro Sparkle Indicator */}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-white font-sans">
              Veri<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Style</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <VeriLensIcon className="w-2.5 h-2.5 text-emerald-400" />
              VeriLens AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Fashion Authenticity & Review Forensics</p>
        </div>
      )}
    </div>
  );
};
