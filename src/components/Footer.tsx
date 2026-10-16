import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';
import { ShieldCheck, Lock, Globe, ArrowUpRight, Cpu } from 'lucide-react';
import { NavTab } from './Header';

interface FooterProps {
  onNavigateTab?: (tab: NavTab) => void;
  onOpenDomainModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenDomainModal }) => {
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center shrink-0 text-slate-950 shadow-xs">
                <VeriLensIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  VeriStyle
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono mt-0.5">
                  Authenticity Verification
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-slate-400">
              Automated multi-signal authenticity inspection for luxury apparel, limited sneakers, and designer accessories. Inspect stitching pitch, typography engraving, and consumer review entropy in real time.
            </p>

            {/* Custom Domain & Network Status */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenDomainModal}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>veristyle.io</span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded">SSL Active</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>TLS 1.3 Strict</span>
              </div>
            </div>
          </div>

          {/* Forensics Vectors Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Inspection Vectors
            </h4>
            <ul className="space-y-2 text-xs">
              {['Micro-Stitching Pitch', 'Hardware & Debossing', 'Review Text Entropy', 'Serial Code Validation', 'Listing Sanity Check'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 hover:text-slate-200 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Platforms Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Platforms
            </h4>
            <ul className="space-y-2 text-xs">
              {['Amazon Marketplace', 'Flipkart Assured', 'Myntra Luxe', 'AJIO Luxury', 'Nykaa Fashion'].map(item => (
                <li key={item}>
                  <span className="text-slate-400 hover:text-slate-200 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Governance Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('privacy')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Privacy Policy
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('terms')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Terms and Conditions
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDomainModal}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Domain & DNS Status
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Zero Data Retention Certified
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-md bg-slate-900 border border-slate-800 text-[11px] leading-relaxed text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Independent Authenticator
              </div>
              <p>
                Not affiliated with or sponsored by any referenced luxury brands. All brand names are registered trademarks of their respective owners.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Clean corporate attribution without AI watermarks */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VeriStyle Technologies Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigateTab && onNavigateTab('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={onOpenDomainModal}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Domain Settings
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
