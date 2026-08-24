import React from 'react';
import { VeriLensIcon } from './VeriLensIcon';
import { Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#163027] text-white">
      {/* Pre-footer CTA */}
      <div className="border-b border-white/10 px-5 py-12 sm:py-16">
        <div className="max-w-[1280px] mx-auto text-center space-y-6">
          <h2 className="text-[32px] sm:text-[42px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Start Verifying Fashion <span className="text-[var(--green-accent-from)] italic" style={{ fontFamily: 'var(--font-serif)' }}>Today.</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Join thousands of shoppers and authenticators using AI to uncover the truth behind luxury apparel and reviews.
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--green-primary)] text-white text-[15px] font-bold hover:bg-[#146D2F] active:scale-95 transition-all shadow-lg"
            >
              Start Free Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Brand info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="inline-flex items-center gap-3">
            <div className="w-[34px] h-[34px] bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
              <VeriLensIcon className="w-5 h-5" />
            </div>
            <span className="text-[22px] font-semibold tracking-[-0.5px]" style={{ fontFamily: 'var(--font-heading)' }}>
              VeriStyle
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-white/60 max-w-[280px]">
            AI-powered product analysis and authenticity verification for luxury shoppers.
          </p>
          <div className="flex gap-4 text-white/40">
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Column 1: Product */}
        <div>
          <h4 className="text-[15px] font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Product</h4>
          <ul className="space-y-4 text-[14px] text-white/60">
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">AI Authenticator</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">URL Analysis</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Supported Brands</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">API Access</a></li>
          </ul>
        </div>

        {/* Column 2: Company */}
        <div>
          <h4 className="text-[15px] font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Company</h4>
          <ul className="space-y-4 text-[14px] text-white/60">
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h4 className="text-[15px] font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Legal</h4>
          <ul className="space-y-4 text-[14px] text-white/60">
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[var(--green-accent-from)] transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-[13px] text-white/40 gap-4 max-w-[1280px] mx-auto">
        <p>© {new Date().getFullYear()} VeriStyle. All rights reserved.</p>
        <p>Built with precision & AI.</p>
      </div>
    </footer>
  );
};
