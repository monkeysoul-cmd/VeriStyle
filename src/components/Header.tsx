import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
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
      <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`} style={{ position: 'fixed' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-full transition-all duration-300"
            style={{
              background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)',
              boxShadow: scrolled ? '0px 4px 24px rgba(0, 0, 0, 0.06)' : '0px 2px 12px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Logo */}
            <button 
              onClick={() => handleNav('landing')} 
              className="inline-flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-accent-from)] rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                <VeriLensIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
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
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    currentTab === item.id 
                      ? 'bg-white text-[var(--text-primary)] shadow-sm' 
                      : 'text-gray-500 hover:text-[var(--text-primary)] hover:bg-white/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  onQuickStart();
                  handleNav('dashboard');
                }}
                className="hidden md:flex items-center gap-1.5 bg-[var(--text-primary)] hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-md"
              >
                Start Verification <ArrowRight className="w-4 h-4" />
              </button>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed inset-x-4 top-[84px] z-40 md:hidden transition-all duration-300 origin-top ${
          isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                currentTab === item.id 
                  ? 'bg-[var(--green-primary)]/10 text-[var(--green-primary)]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="h-px bg-gray-100 my-2" />
          <button 
            onClick={() => {
              onQuickStart();
              handleNav('dashboard');
            }}
            className="flex justify-center items-center gap-2 bg-[var(--text-primary)] text-white px-4 py-3.5 rounded-2xl text-base font-bold active:scale-95 transition-all"
          >
            Start Verification <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};
