import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';
import { ShieldCheck, Cpu, Globe, Lock, ArrowUpRight, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden dark-section" style={{ background: 'var(--bg-dark)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Ambient top glowing line */}
      <div className="premium-divider-dark absolute top-0 left-0 right-0" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[80px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(52,216,138,0.08)' }}
      />

      {/* Floating Ambient Orbs */}
      <div className="ambient-orb ambient-orb-green w-96 h-96 -top-20 -left-20" style={{ opacity: 0.35 }} />
      <div className="ambient-orb ambient-orb-indigo w-80 h-80 -bottom-20 -right-20" style={{ opacity: 0.3 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Top section: Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #059669, #34D88A)',
                  boxShadow: '0 4px 20px rgba(52,216,138,0.35), 0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <VeriLensIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  VeriStyle
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#34D88A] opacity-90">AI Authenticator</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-xs text-slate-400">
              Real-time multimodal authenticity inspection powered by Google Gemini Vision. Detecting counterfeit fashion and manufactured reviews across major e-commerce platforms.
            </p>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(52,216,138,0.08)', border: '1px solid rgba(52,216,138,0.2)' }}>
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full animate-ping opacity-70 bg-[#34D88A]" />
                <span className="relative rounded-full w-2 h-2 bg-[#34D88A]" />
              </span>
              <span className="text-xs font-bold text-[#34D88A]">Gemini Vision Active</span>
            </div>

            {/* Trust marks */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { icon: Lock, label: '256-bit SSL' },
                { icon: ShieldCheck, label: 'SOC 2 Ready' },
                { icon: Cpu, label: 'Gemini 2.5 Flash' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400">
                  <Icon className="w-3 h-3 text-[#34D88A]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Forensics Col */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#34D88A]">Forensics</h4>
            <ul className="space-y-2.5">
              {['Micro-Stitching Analysis', 'Hardware & Debossing', 'Review Perplexity Entropy', 'Clone Detection', 'Price Sanity Check'].map(item => (
                <li key={item}>
                  <span
                    className="text-sm group flex items-center gap-1.5 cursor-default transition-all duration-300 text-slate-400 hover:text-white hover:translate-x-1"
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms Col */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#818CF8]">Platforms</h4>
            <ul className="space-y-2.5">
              {['Amazon India', 'Flipkart', 'Myntra Luxury', 'AJIO Luxe', 'Nykaa Fashion'].map(item => (
                <li key={item}>
                  <span
                    className="text-sm flex items-center gap-1 cursor-default transition-all duration-300 text-slate-400 hover:text-white hover:translate-x-1"
                  >
                    <Globe className="w-3 h-3 shrink-0 opacity-60 text-[#818CF8]" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Security Col */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#FBBF24]">Resources</h4>
            <ul className="space-y-2.5">
              {['API Documentation', 'Privacy Policy', 'Terms of Service', 'Accuracy Reports', 'Status Page'].map(item => (
                <li key={item}>
                  <span
                    className="text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-300 text-slate-400 hover:text-white hover:translate-x-1"
                  >
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-50 shrink-0 group-hover:opacity-100" />
                  </span>
                </li>
              ))}
            </ul>

            {/* Security card */}
            <div className="mt-4 p-4 rounded-xl space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(52,216,138,0.15)' }}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                <ShieldCheck className="w-4 h-4 text-[#34D88A]" />
                Cryptographic Provenance
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Verifications are hashed and immutably recorded for resale provenance tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VeriStyle AI Authenticator. Engineered with Google DeepMind technologies.</p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'API Docs'].map(link => (
              <span key={link} className="relative group cursor-pointer transition-colors duration-300 hover:text-slate-300">
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'rgba(52,216,138,0.5)' }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
