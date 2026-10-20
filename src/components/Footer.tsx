import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';
import { ShieldCheck, Lock, Globe, ArrowUpRight, Cpu, Crown, Diamond } from 'lucide-react';
import { NavTab } from './Header';

interface FooterProps {
  onNavigateTab?: (tab: NavTab) => void;
  onOpenDomainModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenDomainModal }) => {
  return (
    <footer className="relative overflow-hidden" style={{ background: '#06060C', borderTop: '1px solid rgba(212, 168, 83, 0.08)' }}>
      {/* Top radiant border accent */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3), rgba(129, 140, 248, 0.2), transparent)' }} />
      
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(212, 168, 83, 0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white"
                style={{
                  background: 'linear-gradient(135deg, #D4A853 0%, #C9973C 50%, #B8892F 100%)',
                  boxShadow: '0 4px 16px rgba(212, 168, 83, 0.30)',
                }}
              >
                <VeriLensIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  VeriStyle
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5 font-mono" style={{ color: '#D4A853' }}>
                  Authenticity Verification
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm" style={{ color: '#6B7394' }}>
              Automated multi-signal authenticity inspection for luxury apparel, limited sneakers, and designer accessories. Inspect stitching pitch, typography engraving, and consumer review entropy in real time.
            </p>

            {/* Custom Domain & Network Status */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenDomainModal}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  color: '#34D88A',
                }}
              >
                <Globe className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
                <span>veristyle.io</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#34D88A',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  SSL Active
                </span>
              </button>

              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#454B68',
                }}
              >
                <Lock className="w-3 h-3" />
                <span>TLS 1.3 Strict</span>
              </div>
            </div>
          </div>

          {/* Forensics Vectors Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: '#D4A853' }}>
              Inspection Vectors
            </h4>
            <ul className="space-y-2.5 text-xs">
              {['Micro-Stitching Pitch', 'Hardware & Debossing', 'Review Text Entropy', 'Serial Code Validation', 'Listing Sanity Check'].map(item => (
                <li key={item}>
                  <span className="transition-colors cursor-default hover:text-white" style={{ color: '#6B7394' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Platforms Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: '#D4A853' }}>
              Platforms
            </h4>
            <ul className="space-y-2.5 text-xs">
              {['Amazon Marketplace', 'Flipkart Assured', 'Myntra Luxe', 'AJIO Luxury', 'Nykaa Fashion'].map(item => (
                <li key={item}>
                  <span className="transition-colors cursor-default hover:text-white" style={{ color: '#6B7394' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Governance Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: '#D4A853' }}>
              Governance & Policies
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('privacy')}
                  className="transition-colors flex items-center gap-1 cursor-pointer hover:text-white"
                  style={{ color: '#6B7394' }}
                >
                  Privacy Policy
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('terms')}
                  className="transition-colors flex items-center gap-1 cursor-pointer hover:text-white"
                  style={{ color: '#6B7394' }}
                >
                  Terms and Conditions
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDomainModal}
                  className="transition-colors flex items-center gap-1 cursor-pointer hover:text-white"
                  style={{ color: '#6B7394' }}
                >
                  Domain & DNS Status
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('api-docs')}
                  className="transition-colors flex items-center gap-1 cursor-pointer hover:text-white"
                  style={{ color: '#6B7394' }}
                >
                  Developer API Specs
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <span className="cursor-default" style={{ color: '#454B68' }}>
                  Zero Data Retention Certified
                </span>
              </li>
            </ul>

            <div
              className="mt-4 p-3.5 rounded-lg text-[11px] leading-relaxed space-y-1.5"
              style={{
                background: 'rgba(212, 168, 83, 0.04)',
                border: '1px solid rgba(212, 168, 83, 0.10)',
                color: '#6B7394',
              }}
            >
              <div className="flex items-center gap-1.5 font-bold" style={{ color: '#D4A853' }}>
                <Diamond className="w-3.5 h-3.5" />
                Independent Authenticator
              </div>
              <p>
                Not affiliated with or sponsored by any referenced luxury brands. All brand names are registered trademarks of their respective owners.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: '#454B68' }}>
          <p>© {new Date().getFullYear()} VeriStyle Technologies Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigateTab && onNavigateTab('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
              style={{ color: '#454B68' }}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('terms')}
              className="hover:text-white transition-colors cursor-pointer"
              style={{ color: '#454B68' }}
            >
              Terms of Service
            </button>
            <button
              onClick={onOpenDomainModal}
              className="hover:text-white transition-colors cursor-pointer"
              style={{ color: '#454B68' }}
            >
              Domain Settings
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
