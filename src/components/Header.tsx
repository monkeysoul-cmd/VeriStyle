import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
  ] as const;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${scrolled ? 'py-2.5' : 'py-4'}`} style={{ position: 'fixed' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-full transition-all duration-500"
            style={{
              background: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.95)',
              boxShadow: scrolled 
                ? '0px 4px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)' 
                : '0px 2px 12px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(0, 0, 0, 0.04)'
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo */}
            <button 
              onClick={() => handleNav('landing')} 
              className="inline-flex items-center gap-2.5 group"
            >
              <motion.div 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-accent-from)] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-900/10"
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <VeriLensIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span 
                className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                VeriStyle
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1 rounded-full border border-gray-100">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${
                    currentTab === item.id 
                      ? 'text-[var(--text-primary)]' 
                      : 'text-gray-500 hover:text-[var(--text-primary)]'
                  }`}
                >
                  {currentTab === item.id && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <motion.button 
                onClick={() => {
                  onQuickStart();
                  handleNav('dashboard');
                }}
                className="hidden md:flex items-center gap-1.5 bg-[var(--text-primary)] hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-gray-900/10 btn-shimmer cursor-pointer"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                Start Verification <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              {/* Mobile Menu Toggle */}
              <motion.button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
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
              className="fixed inset-x-4 top-[84px] z-40 md:hidden"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-4 flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.button 
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                      currentTab === item.id 
                        ? 'bg-[var(--green-primary)]/10 text-[var(--green-primary)]' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <div className="h-px bg-gray-100 my-2" />
                <motion.button 
                  onClick={() => {
                    onQuickStart();
                    handleNav('dashboard');
                  }}
                  className="flex justify-center items-center gap-2 bg-[var(--text-primary)] text-white px-4 py-3.5 rounded-2xl text-base font-bold active:scale-95 transition-all"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
                >
                  Start Verification <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Overlay for mobile menu */}
            <motion.div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
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
