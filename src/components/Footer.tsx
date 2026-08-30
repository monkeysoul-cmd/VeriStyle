import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#081912] text-white border-t border-emerald-900/40 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-breathe" />
      
      {/* Top gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-accent-from)] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-900/30">
                <VeriLensIcon className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                VeriStyle
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Real-time multimodal authenticity inspection powered by Google Gemini 3.6 Flash. Detecting counterfeit fashion and manufactured reviews across major e-commerce platforms.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="relative rounded-full w-2 h-2 bg-emerald-400" />
              </span>
              Gemini Vision 3.6 Multimodal Active
            </div>
          </div>

          {/* Col 3: Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Forensics</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Micro-Stitching Analysis', 'Hardware & Debossing', 'Review Perplexity Entropy', 'White-Label Clone Detection', 'Price Sanity Calibration'].map(item => (
                <li key={item} className="group hover:text-white transition-colors duration-300 cursor-default">
                  <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Supported Stores */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Platforms</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Amazon India (IN)', 'Flipkart', 'Myntra Luxury', 'AJIO Luxe', 'Nykaa Fashion'].map(item => (
                <li key={item} className="group hover:text-white transition-colors duration-300 cursor-default">
                  <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Trust & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Trust & Safety</h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:bg-white/8 transition-colors duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL Encrypted
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                Verifications are cryptographically hashed and immutably recorded for resale provenance.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} VeriStyle AI Authenticator. Engineered with Google DeepMind technologies.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'API Documentation'].map(link => (
              <span key={link} className="relative group hover:text-gray-300 transition-colors cursor-pointer">
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-emerald-400/60 group-hover:w-full transition-all duration-300" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
