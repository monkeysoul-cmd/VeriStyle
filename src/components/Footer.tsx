import React from 'react';
import { Cpu, GitBranch, Heart } from 'lucide-react';
import { VeriLensLogo } from './VeriLensLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand info */}
        <div className="space-y-4 md:col-span-1">
          <VeriLensLogo size="sm" showText={true} />
          <p className="text-xs text-slate-400 leading-relaxed">
            Forensic apparel authenticity verification platform powered by Cross-Modal Vision Transformers, NLP Perplexity analysis, and the VeriLens AI Engine.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> FastAPI Ready
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> Final Year Project
            </span>
          </div>
        </div>

        {/* Column 1: Core AI Capabilities */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Core Technology</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="hover:text-indigo-400 transition-colors">Micro-Stitching Density Analysis</li>
            <li className="hover:text-indigo-400 transition-colors">Hardware Electroplating Spectral Profiling</li>
            <li className="hover:text-indigo-400 transition-colors">Care Tag Typography & Kerning Check</li>
            <li className="hover:text-indigo-400 transition-colors">Review NLP Perplexity & Bot Flags</li>
            <li className="hover:text-indigo-400 transition-colors">Cross-Modal XAI Heatmap Overlays</li>
          </ul>
        </div>

        {/* Column 2: Supported Brands */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Apparel Categories</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>Luxury Leather Handbags (Gucci, Chanel, LV)</li>
            <li>Limited Edition Sneakers (Jordan, Yeezy, Nike)</li>
            <li>Streetwear Apparel (Supreme, Off-White)</li>
            <li>Designer Outerwear & Denim</li>
            <li>Serial Number & QR Microchip Validation</li>
          </ul>
        </div>

        {/* Column 3: Engineering Context */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Backend Integration</h4>
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-[10px]">
              <span>REST API ENDPOINT</span>
              <span className="text-emerald-400">200 OK</span>
            </div>
            <p className="text-emerald-400 font-semibold truncate">POST /api/analyze-authenticity</p>
            <p className="text-[11px] text-slate-400">Accepts image base64 + review string. Returns Trust Score & XAI bbox heatmap array.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 VeriStyle AI SaaS • Engineering Capstone Project</p>
        <p className="flex items-center gap-1.5">
          Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for luxury apparel authenticators
        </p>
      </div>
    </footer>
  );
};
