import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';
import { PlatformLogo } from './PlatformLogo';
import { ShieldCheck, Lock, Globe, ArrowUpRight, Cpu, Crown, Diamond } from 'lucide-react';
import { NavTab } from './Header';

interface FooterProps {
  onNavigateTab?: (tab: NavTab) => void;
  onOpenDomainModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenDomainModal }) => {
  return (
    <footer className="relative overflow-hidden bg-slate-50 border-t border-slate-200/90 text-slate-700">
      {/* Top delicate gold hairline accent */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.4), rgba(79, 70, 229, 0.2), transparent)' }} />
      
      {/* Soft light ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(184, 134, 11, 0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #C59B27 50%, #B8860B 100%)',
                  boxShadow: '0 4px 14px rgba(184, 134, 11, 0.25)',
                }}
              >
                <VeriLensIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  VeriStyle
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5 font-mono text-amber-800">
                  Authenticity Verification
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-slate-600">
              Automated multi-signal authenticity inspection for luxury apparel, limited sneakers, and designer accessories. Inspect stitching pitch, typography engraving, and consumer review entropy in real time.
            </p>

            {/* Custom Domain & Network Status */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenDomainModal}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">veristyle.io</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300"
                >
                  SSL Active
                </span>
              </button>

              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-white border border-slate-200 text-slate-500"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>TLS 1.3 Strict</span>
              </div>
            </div>
          </div>

          {/* Forensics Vectors Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
              Inspection Vectors
            </h4>
            <ul className="space-y-2.5 text-xs">
              {['Micro-Stitching Pitch', 'Hardware & Debossing', 'Review Text Entropy', 'Serial Code Validation', 'Listing Sanity Check'].map(item => (
                <li key={item}>
                  <span className="text-slate-600 hover:text-slate-900 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Platforms Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
              Platforms
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: 'Amazon Marketplace', platform: 'amazon' },
                { name: 'Flipkart Assured', platform: 'flipkart' },
                { name: 'Myntra Luxe', platform: 'myntra' },
                { name: 'AJIO Luxury', platform: 'ajio' },
                { name: 'Nykaa Fashion', platform: 'nykaa' },
                { name: 'Croma Electronics', platform: 'croma' },
                { name: 'Meesho Commerce', platform: 'meesho' },
                { name: 'Tata CLiQ Luxury', platform: 'tatacliq' },
              ].map(item => (
                <li key={item.name} className="flex items-center gap-2">
                  <PlatformLogo platform={item.platform} size={15} />
                  <span className="text-slate-600 hover:text-slate-900 transition-colors cursor-default">
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Governance Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">
              Governance & Policies
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('privacy')}
                  className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Privacy Policy
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('terms')}
                  className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Terms and Conditions
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDomainModal}
                  className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Domain & DNS Status
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <span className="text-slate-400 text-[11px] cursor-default">
                  Zero Data Retention Certified
                </span>
              </li>
            </ul>

            <div
              className="mt-4 p-3.5 rounded-xl text-[11px] leading-relaxed space-y-1.5 bg-amber-50/60 border border-amber-200/70 text-slate-600"
            >
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Diamond className="w-3.5 h-3.5 text-amber-600" />
                Independent Authenticator
              </div>
              <p>
                Not affiliated with or sponsored by any referenced luxury brands. All brand names are registered trademarks of their respective owners.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VeriStyle Technologies Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigateTab && onNavigateTab('privacy')}
              className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('terms')}
              className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={onOpenDomainModal}
              className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Domain Settings
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
