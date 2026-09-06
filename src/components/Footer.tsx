import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';
import { ShieldCheck, Cpu, Globe, Lock, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden noise-overlay" style={{ background: '#020604', borderTop: '1px solid rgba(0,255,122,0.08)' }}>
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,122,0.5), transparent)' }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,255,122,0.06)' }} />

      {/* Bottom ambient */}
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none animate-breathe" style={{ background: 'rgba(0,255,122,0.03)' }} />
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none animate-breathe" style={{ background: 'rgba(129,140,248,0.03)', animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Top section: Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #00FF7A, #00D668)',
                  boxShadow: '0 0 20px rgba(0,255,122,0.35), 0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                <VeriLensIcon className="w-5 h-5 text-[#040907]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  VeriStyle
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--green-accent-from)', opacity: 0.7 }}>AI Authenticator</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Real-time multimodal authenticity inspection powered by Google Gemini Vision. Detecting counterfeit fashion and manufactured reviews across major e-commerce platforms.
            </p>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,255,122,0.07)', border: '1px solid rgba(0,255,122,0.18)' }}>
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full animate-ping opacity-70" style={{ background: 'var(--green-accent-from)' }} />
                <span className="relative rounded-full w-2 h-2" style={{ background: 'var(--green-accent-from)' }} />
              </span>
              <span className="text-xs font-bold" style={{ color: 'var(--green-accent-from)' }}>Gemini Vision Active</span>
            </div>

            {/* Trust marks */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { icon: Lock, label: '256-bit SSL' },
                { icon: ShieldCheck, label: 'SOC 2 Ready' },
                { icon: Cpu, label: 'Gemini 2.5 Flash' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Forensics Col */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--green-accent-from)' }}>Forensics</h4>
            <ul className="space-y-2.5">
              {['Micro-Stitching Analysis', 'Hardware & Debossing', 'Review Perplexity Entropy', 'Clone Detection', 'Price Sanity Check'].map(item => (
                <li key={item}>
                  <span
                    className="text-sm group flex items-center gap-1.5 cursor-default transition-all duration-300 hover:translate-x-1"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms Col */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--green-accent-from)' }}>Platforms</h4>
            <ul className="space-y-2.5">
              {['Amazon India', 'Flipkart', 'Myntra Luxury', 'AJIO Luxe', 'Nykaa Fashion'].map(item => (
                <li key={item}>
                  <span
                    className="text-sm flex items-center gap-1 cursor-default transition-all duration-300 hover:translate-x-1"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <Globe className="w-3 h-3 shrink-0 opacity-50" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Security Col */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--green-accent-from)' }}>Resources</h4>
            <ul className="space-y-2.5">
              {['API Documentation', 'Privacy Policy', 'Terms of Service', 'Accuracy Reports', 'Status Page'].map(item => (
                <li key={item}>
                  <span
                    className="text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-300 hover:translate-x-1"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-50 shrink-0" />
                  </span>
                </li>
              ))}
            </ul>

            {/* Security card */}
            <div className="mt-4 p-4 rounded-xl space-y-2" style={{ background: 'rgba(0,255,122,0.05)', border: '1px solid rgba(0,255,122,0.1)' }}>
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                Cryptographic Provenance
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Verifications are hashed and immutably recorded for resale provenance tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'var(--text-dim)' }}>
          <p>© {new Date().getFullYear()} VeriStyle AI Authenticator. Engineered with Google DeepMind technologies.</p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'API Docs'].map(link => (
              <span key={link} className="relative group cursor-pointer transition-colors duration-300 hover:text-[var(--text-secondary)]">
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: 'rgba(0,255,122,0.5)' }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
