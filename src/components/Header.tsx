import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { VeriLensIcon } from './VeriLensIcon';

interface HeaderProps {
  currentTab: 'landing' | 'dashboard' | 'history' | 'products';
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'history' | 'products') => void;
  onQuickStart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onQuickStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (tab: 'landing' | 'dashboard' | 'history' | 'products') => {
    setCurrentTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div 
          className="flex h-[72px] w-full items-center justify-between px-4 sm:h-[82px] sm:px-8 lg:h-[93px] lg:px-12"
          style={{
            background: '#E7F3F2',
            boxShadow: '0px 2.86853px 28.6853px rgba(26, 43, 109, 0.08)',
            backdropFilter: 'blur(17.2112px)'
          }}
        >
          {/* Logo */}
          <button 
            onClick={() => handleNav('landing')} 
            className="inline-flex items-center gap-3"
          >
            <div className="w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
              <VeriLensIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span 
              className="text-[20px] sm:text-[22px] font-semibold text-black tracking-[-0.5px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              VeriStyle
            </span>
          </button>

          {/* Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex h-[42px] items-center gap-2 rounded-full bg-[#163027] px-[10px] text-[14px] font-medium text-white transition-colors sm:h-[48px] sm:px-[12px] sm:text-[15px] border border-[rgba(5,28,20,0.15)] hover:bg-[#0c1d17]"
          >
            <span className="hidden md:flex">Menu</span>
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#163027] text-white flex flex-col">
          <div className="flex h-[72px] sm:h-[82px] lg:h-[93px] items-center justify-between px-4 sm:px-8 lg:px-12 border-b border-white/10">
            <div className="inline-flex items-center gap-3">
              <div className="w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] bg-white/10 rounded-xl flex items-center justify-center text-white">
                <VeriLensIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.5px]" style={{ fontFamily: 'var(--font-heading)' }}>
                VeriStyle
              </span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            <button 
              onClick={() => handleNav('landing')}
              className={`hover:text-[var(--green-accent-from)] transition-colors ${currentTab === 'landing' ? 'text-[var(--green-accent-from)]' : ''}`}
            >
              Overview
            </button>
            <button 
              onClick={() => handleNav('dashboard')}
              className={`hover:text-[var(--green-accent-from)] transition-colors ${currentTab === 'dashboard' ? 'text-[var(--green-accent-from)]' : ''}`}
            >
              AI Inspector
            </button>
            <button 
              onClick={() => handleNav('products')}
              className={`hover:text-[var(--green-accent-from)] transition-colors ${currentTab === 'products' ? 'text-[var(--green-accent-from)]' : ''}`}
            >
              Products
            </button>
            <button 
              onClick={() => handleNav('history')}
              className={`hover:text-[var(--green-accent-from)] transition-colors ${currentTab === 'history' ? 'text-[var(--green-accent-from)]' : ''}`}
            >
              Vault
            </button>
          </div>
        </div>
      )}
    </>
  );
};
