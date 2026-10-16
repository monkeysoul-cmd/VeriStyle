import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VeriLensIcon } from './VeriLensIcon';

export type NavTab = 'landing' | 'dashboard' | 'history' | 'products' | 'privacy' | 'terms';

interface HeaderProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  onQuickStart: () => void;
  onOpenDomainModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onQuickStart, onOpenDomainModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (tab: NavTab) => {
    setCurrentTab(tab);
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Inspector' },
    { id: 'history', label: 'Vault' },
    { id: 'products', label: 'Catalog' },
  ] as const;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${scrolled ? 'py-2 bg-white/95 border-b border-slate-200/90 shadow-xs backdrop-blur-md' : 'py-3.5 bg-white/80 border-b border-slate-100 backdrop-blur-sm'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <button
              onClick={() => handleNav('landing')}
              className="inline-flex items-center gap-3 group shrink-0 cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center shrink-0 text-white shadow-xs">
                <VeriLensIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-base sm:text-lg font-black tracking-tight text-slate-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  VeriStyle
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-0.5 font-mono">
                  Authenticity Verification
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-md bg-slate-100/90 border border-slate-200/80">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`px-3.5 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Custom Domain Connected Indicator */}
              {onOpenDomainModal && (
                <button
                  onClick={onOpenDomainModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors cursor-pointer"
                  title="Configure Custom Domain"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>veristyle.io</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
                </button>
              )}

              {/* Start Inspection Action */}
              <button
                onClick={() => { onQuickStart(); handleNav('dashboard'); }}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wide cursor-pointer btn-neon"
              >
                <span>Inspect Item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-x-4 top-[64px] z-50 md:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="rounded-lg p-3 bg-white border border-slate-200 shadow-xl flex flex-col gap-1 text-slate-800">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors text-left cursor-pointer ${
                      currentTab === item.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="h-px bg-slate-100 my-1.5" />

                {onOpenDomainModal && (
                  <button
                    onClick={() => { onOpenDomainModal(); setIsMenuOpen(false); }}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      Domain: veristyle.io
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Active</span>
                  </button>
                )}

                <button
                  onClick={() => { onQuickStart(); handleNav('dashboard'); }}
                  className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold tracking-wide cursor-pointer btn-neon mt-1"
                >
                  Start Inspection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Mobile Overlay */}
            <div
              className="fixed inset-0 z-40 bg-slate-950/20 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};
