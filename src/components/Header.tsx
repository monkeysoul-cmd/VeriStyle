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
                ? 'rgba(4, 9, 7, 0.92)'
                : 'rgba(4, 9, 7, 0.78)',
              boxShadow: scrolled
                ? '0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,122,0.1), 0 0 20px rgba(0,255,122,0.04)'
                : '0 2px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,255,122,0.06)',
              backdropFilter: 'blur(40px) saturate(160%)',
              border: '1px solid rgba(0, 255, 122, 0.08)',
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
                  background: 'linear-gradient(135deg, #00FF7A, #00D668)',
                  boxShadow: '0 0 16px rgba(0,255,122,0.4), 0 4px 12px rgba(0,0,0,0.4)',
                }}
                whileHover={{ rotate: 6, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <VeriLensIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#040907]" />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-lg sm:text-xl font-bold tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                >
                  VeriStyle
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--green-accent-from)] opacity-70">
                  AI Authenticator
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,122,0.07)' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer"
                  style={{ color: currentTab === item.id ? 'var(--green-accent-from)' : 'var(--text-muted)' }}
                >
                  {currentTab === item.id && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(0,255,122,0.08)', border: '1px solid rgba(0,255,122,0.15)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {currentTab === item.id && (
                    <motion.div
                      layoutId="active-tab-dot"
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--green-accent-from)', boxShadow: '0 0 6px rgba(0,255,122,0.8)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Status badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,255,122,0.06)', border: '1px solid rgba(0,255,122,0.12)' }}>
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-[var(--green-accent-from)] animate-ping opacity-75" />
                  <span className="relative rounded-full w-1.5 h-1.5 bg-[var(--green-accent-from)]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--green-accent-from)' }}>Live</span>
              </div>

              <motion.button
                onClick={() => { onQuickStart(); handleNav('dashboard'); }}
                className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer btn-neon"
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
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,122,0.1)', color: 'var(--text-primary)' }}
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
                  background: 'rgba(4, 9, 7, 0.96)',
                  border: '1px solid rgba(0,255,122,0.12)',
                  backdropFilter: 'blur(40px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,122,0.08)',
                }}
              >
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all text-left cursor-pointer"
                    style={{
                      color: currentTab === item.id ? 'var(--green-accent-from)' : 'var(--text-secondary)',
                      background: currentTab === item.id ? 'rgba(0,255,122,0.08)' : 'transparent',
                      border: currentTab === item.id ? '1px solid rgba(0,255,122,0.14)' : '1px solid transparent',
                    }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <div className="h-px mx-2 my-1" style={{ background: 'rgba(0,255,122,0.08)' }} />
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
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
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
