import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VeriLensIcon } from './VeriLensIcon';

interface HeaderProps {
  currentTab: 'landing' | 'dashboard' | 'history' | 'products';
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'history' | 'products') => void;
  onQuickStart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onQuickStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (tab: 'landing' | 'dashboard' | 'history' | 'products') => {
    setCurrentTab(tab);
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Inspector' },
    { id: 'history', label: 'Vault' },
    { id: 'products', label: 'Explore' },
  ] as const;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}
        style={{ position: 'fixed' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-2xl transition-all duration-500"
            style={{
              background: scrolled
                ? 'rgba(255, 255, 255, 0.88)'
                : 'rgba(255, 255, 255, 0.65)',
              boxShadow: scrolled
                ? '0 2px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)'
                : '0 1px 12px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.4)',
              backdropFilter: 'blur(40px) saturate(160%)',
              border: '1px solid rgba(0, 0, 0, 0.04)',
            }}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo */}
            <button
              onClick={() => handleNav('landing')}
              className="inline-flex items-center gap-2.5 group shrink-0"
            >
              <motion.div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 relative"
                style={{
                  background: 'linear-gradient(135deg, #05DF72, #00C865)',
                  boxShadow: '0 4px 18px rgba(0, 200, 101, 0.35), 0 2px 6px rgba(0,0,0,0.06)',
                }}
                whileHover={{ rotate: 6, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <VeriLensIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.div>
              <div className="flex flex-col leading-none text-left">
                <span
                  className="text-lg sm:text-xl font-extrabold tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                >
                  VeriStyle
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.16em] mt-0.5" style={{ color: 'var(--green-primary)' }}>
                  AI Authenticator
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(15,23,42,0.03)', border: '1px solid rgba(15,23,42,0.06)' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="relative px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  style={{ color: currentTab === item.id ? '#0A0F1D' : 'var(--text-muted)' }}
                >
                  {currentTab === item.id && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.05)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    {currentTab === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-primary)] shadow-[0_0_6px_var(--green-primary)]" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Status badge — premium multi-glow */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,200,101,0.06)', border: '1px solid rgba(0,200,101,0.2)' }}>
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ background: '#05DF72' }} />
                  <span className="relative rounded-full w-2 h-2" style={{ background: '#00C865' }} />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--green-primary)' }}>VeriLens AI 1.0 Active</span>
              </div>

              <motion.button
                onClick={() => { onQuickStart(); handleNav('dashboard'); }}
                className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer btn-neon"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Zap className="w-4 h-4" />
                Start Scan
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl transition-colors cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: 'var(--text-primary)' }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-x-4 top-[76px] z-40 md:hidden"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <div
                className="rounded-2xl p-3 flex flex-col gap-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.94)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(40px) saturate(160%)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)',
                }}
              >
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all text-left cursor-pointer"
                    style={{
                      color: currentTab === item.id ? 'var(--green-primary)' : 'var(--text-secondary)',
                      background: currentTab === item.id ? 'rgba(52,216,138,0.06)' : 'transparent',
                      border: currentTab === item.id ? '1px solid rgba(52,216,138,0.1)' : '1px solid transparent',
                    }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <div className="premium-divider mx-2 my-1" />
                <motion.button
                  onClick={() => { onQuickStart(); handleNav('dashboard'); }}
                  className="flex justify-center items-center gap-2 px-4 py-3.5 rounded-xl text-base font-bold active:scale-95 transition-all cursor-pointer btn-neon"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Zap className="w-5 h-5" />
                  Start Verification
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};
