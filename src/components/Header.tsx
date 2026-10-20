import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VeriLensIcon } from './VeriLensIcon';

export type NavTab = 'landing' | 'dashboard' | 'history' | 'products' | 'privacy' | 'terms' | 'api-docs';

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
    { id: 'api-docs', label: 'API Specs' },
  ] as const;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
          scrolled
            ? 'py-2 border-b shadow-lg'
            : 'py-3.5 border-b'
        }`}
        style={{
          background: scrolled
            ? 'rgba(8, 8, 15, 0.92)'
            : 'rgba(8, 8, 15, 0.75)',
          borderColor: scrolled
            ? 'rgba(212, 168, 83, 0.12)'
            : 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 168, 83, 0.06)'
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <button
              onClick={() => handleNav('landing')}
              className="inline-flex items-center gap-3 group shrink-0 cursor-pointer text-left"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #D4A853 0%, #C9973C 50%, #B8892F 100%)',
                  boxShadow: '0 4px 16px rgba(212, 168, 83, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <VeriLensIcon className="w-4 h-4 text-white" />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  VeriStyle
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] mt-0.5 font-mono" style={{ color: '#D4A853' }}>
                  Authenticity Verification
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div
              className="hidden md:flex items-center gap-1 p-1 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                      isActive
                        ? 'font-bold'
                        : 'hover:text-white'
                    }`}
                    style={{
                      color: isActive ? '#D4A853' : 'rgba(184, 192, 208, 0.7)',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-lg -z-0"
                        style={{
                          background: 'rgba(212, 168, 83, 0.10)',
                          border: '1px solid rgba(212, 168, 83, 0.25)',
                          boxShadow: '0 0 12px rgba(212, 168, 83, 0.08)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Custom Domain Connected Indicator */}
              {onOpenDomainModal && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenDomainModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
                  style={{
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.20)',
                    color: '#34D88A',
                  }}
                  title="Configure Custom Domain"
                >
                  <Globe className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
                  <span>veristyle.io</span>
                  <span className="relative flex h-2 w-2 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </motion.button>
              )}

              {/* Start Inspection Action */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onQuickStart(); handleNav('dashboard'); }}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide cursor-pointer btn-neon"
              >
                <span>Inspect Item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#B8C0D0',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
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
              <div
                className="rounded-xl p-3 flex flex-col gap-1"
                style={{
                  background: 'rgba(12, 12, 22, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left cursor-pointer ${
                      currentTab === item.id
                        ? 'text-amber-300'
                        : 'hover:text-white'
                    }`}
                    style={{
                      background: currentTab === item.id ? 'rgba(212, 168, 83, 0.08)' : 'transparent',
                      color: currentTab === item.id ? '#D4A853' : '#B8C0D0',
                    }}
                  >
                    {item.label}
                  </button>
                ))}

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '6px 0' }} />

                {onOpenDomainModal && (
                  <button
                    onClick={() => { onOpenDomainModal(); setIsMenuOpen(false); }}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono cursor-pointer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#B8C0D0',
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4" style={{ color: '#10B981' }} />
                      Domain: veristyle.io
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34D88A',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      Active
                    </span>
                  </button>
                )}

                <button
                  onClick={() => { onQuickStart(); handleNav('dashboard'); }}
                  className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide cursor-pointer btn-neon mt-1"
                >
                  Start Inspection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Mobile Overlay */}
            <div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};
