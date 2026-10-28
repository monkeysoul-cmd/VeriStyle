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
    sm: 'w-7 h-7 rounded',
    md: 'w-8 h-8 rounded-md',
    lg: 'w-10 h-10 rounded-md'
  };

  const svgDimensions = {
    sm: 14,
    md: 18,
    lg: 22
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${containerSizes[size]} bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0 text-white shadow-2xs`}>
        <VeriLensIcon className="text-amber-400" style={{ width: svgDimensions[size], height: svgDimensions[size] }} />
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className="font-extrabold text-base tracking-tight text-slate-900 font-sans" style={{ fontFamily: 'var(--font-heading)' }}>
            VeriStyle
          </span>
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mt-0.5">
            Verification Lab
          </span>
        </div>
      )}
    </div>
  );
};
