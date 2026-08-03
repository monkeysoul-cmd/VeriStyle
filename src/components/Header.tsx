import React from 'react';
import { History, Code2, ArrowRight } from 'lucide-react';
import { VeriLensLogo } from './VeriLensLogo';
import { VeriLensIcon } from './VeriLensIcon';

interface HeaderProps {
  currentTab: 'landing' | 'dashboard' | 'history' | 'api-docs';
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'history' | 'api-docs') => void;
  onQuickStart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onQuickStart }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('landing')} 
          className="cursor-pointer group"
        >
          <VeriLensLogo size="md" showText={true} />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
          <button
            id="nav-landing-btn"
            onClick={() => setCurrentTab('landing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTab === 'landing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Overview
          </button>
          <button
            id="nav-dashboard-btn"
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <VeriLensIcon className="w-4 h-4 text-emerald-400" />
            AI Inspector
          </button>
          <button
            id="nav-history-btn"
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            Vault
          </button>
          <button
            id="nav-apidocs-btn"
            onClick={() => setCurrentTab('api-docs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTab === 'api-docs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-400" />
            FastAPI Spec
          </button>
        </nav>

        {/* Action Right CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Multimodal Engine Online
          </div>
          <button
            id="header-try-ai-btn"
            onClick={onQuickStart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-95"
          >
            <span>Try VeriLens AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 px-2 py-2 border-t border-slate-800 text-xs text-slate-400">
        <button 
          onClick={() => setCurrentTab('landing')}
          className={`px-3 py-1.5 rounded-lg ${currentTab === 'landing' ? 'bg-indigo-600 text-white' : ''}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setCurrentTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : ''}`}
        >
          <VeriLensIcon className="w-3.5 h-3.5 text-emerald-400" /> Dashboard
        </button>
        <button 
          onClick={() => setCurrentTab('history')}
          className={`px-3 py-1.5 rounded-lg ${currentTab === 'history' ? 'bg-indigo-600 text-white' : ''}`}
        >
          Vault
        </button>
        <button 
          onClick={() => setCurrentTab('api-docs')}
          className={`px-3 py-1.5 rounded-lg ${currentTab === 'api-docs' ? 'bg-indigo-600 text-white' : ''}`}
        >
          FastAPI
        </button>
      </div>
    </header>
  );
};
