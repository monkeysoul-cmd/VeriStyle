import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  FileText, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Eye, 
  Search, 
  Zap, 
  Layers, 
  Lock, 
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/presets';
import { SamplePreset } from '../types';

interface LandingPageProps {
  onStartAnalysis: (preset?: SamplePreset) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'handbags' | 'sneakers' | 'streetwear'>('all');

  const filteredPresets = activeTab === 'all' 
    ? SAMPLE_PRESETS 
    : SAMPLE_PRESETS.filter(p => p.category.toLowerCase().includes(activeTab));

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-md animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-medium">Multimodal Cross-Modal Engine</span>
            <span className="text-slate-500">|</span>
            <span className="text-indigo-400 font-mono">VeriLens AI Powered</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-sans">
            Verify Fashion Authenticity <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400">
              in Seconds with VeriLens AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            VeriStyle empowers fashion reviewers, e-commerce platforms, and luxury buyers to instantly expose counterfeit apparel and fake bot reviews using cross-modal computer vision and NLP forensics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-try-ai-btn"
              onClick={() => onStartAnalysis()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
            >
              <Sparkles className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
              <span>Try VeriLens Inspector</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Eye className="w-5 h-5 text-indigo-400" />
              <span>How It Works</span>
            </a>
          </div>

          {/* Live Metric Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">99.4%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Detection Accuracy</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">14,890+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Apparel Items Scanned</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">3,420+</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Synthetic Reviews Exposed</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">&lt; 2.4s</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Real-Time Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Bento Box Grid */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            3-STEP MULTIMODAL VERIFICATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
            How VeriStyle Detects Counterfeits & Fake Reviews
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Combining visual micro-pattern inspection with review text linguistic forensics for bulletproof authenticity scoring.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Upload Product Image */}
          <div className="group relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">Step 01</span>
              <h3 className="text-xl font-bold text-white">1. Upload Product Image</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drag and drop high-res apparel photos. Our vision pipeline inspects micro-stitching pitch, leather grain, typography debossing, and metal hardware reflectivity.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Stitch Pitch Analysis</span>
                <span className="text-emerald-400 font-mono">98% Match</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hardware Engraving</span>
                <span className="text-emerald-400 font-mono">Authentic</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[94%]" />
              </div>
            </div>
          </div>

          {/* Bento Card 2: Paste Review Text */}
          <div className="group relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all pointer-events-none" />

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Step 02</span>
              <h3 className="text-xl font-bold text-white">2. Paste Review Text</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Paste the reseller's review or listing description. Our NLP forensic model measures text perplexity, phrase repetition, and sentiment-versus-image discrepancy.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Bot Template Detect</span>
                <span className="text-amber-400 font-mono">Low Risk</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Language Entropy</span>
                <span className="text-emerald-400 font-mono">Organic</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-indigo-400 h-full w-[88%]" />
              </div>
            </div>
          </div>

          {/* Bento Card 3: XAI Heatmap & Trust Score */}
          <div className="group relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider">Step 03</span>
              <h3 className="text-xl font-bold text-white">3. Get XAI Heatmap & Trust Score</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive an interactive bounding box Heatmap highlighting anomalous or authentic features, a composite Trust Gauge (0-100%), and a downloadable provenance certificate.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">VeriStyle Trust Index</p>
                <p className="text-2xl font-extrabold text-emerald-400">82% Verified</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                AUTH GRADE A
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick-Preset Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              1-CLICK SAMPLE TEST DRIVE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Test AI Authenticator on Preset Fashion Items
            </h2>
            <p className="text-sm text-slate-400">
              Select any item below to load its image, review text, and visual heatmap analysis directly into the AI Inspector.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(['all', 'handbags', 'sneakers', 'streetwear'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresets.map(preset => (
            <div
              key={preset.id}
              onClick={() => onStartAnalysis(preset)}
              className="group cursor-pointer rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={preset.imageUrl}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border backdrop-blur-md ${
                  preset.expectedVerdict === 'VERIFIED AUTHENTIC'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {preset.expectedVerdict}
                </span>
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-slate-300 bg-slate-950/70 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                  {preset.brand}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    "{preset.defaultReview}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-indigo-400 group-hover:text-emerald-400 transition-colors">
                  <span>Run VeriLens Inspection</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Breakdown Table / Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase">
              Engine Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Why Single-Modal Detection Fails Counterfeiters Today
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Super-clone counterfeit factories easily replicate serial numbers and superficial logos. Meanwhile, bot review networks flood online marketplaces with natural-sounding reviews. VeriStyle bridges both domains simultaneously:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Stitching & Thread Pitch</h4>
                  <p className="text-xs text-slate-400">Measures stitch count per inch against official brand factory masters.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">NLP Perplexity Forensics</h4>
                  <p className="text-xs text-slate-400">Detects LLM-generated fake buyer feedback and automated review spammers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">XAI Visual Bounding Boxes</h4>
                  <p className="text-xs text-slate-400">Interactive visual overlays explaining exact reasoning behind trust score.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Verification Vault Hash</h4>
                  <p className="text-xs text-slate-400">Generates immutable digital certificates with QR code verification.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onStartAnalysis()}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>Launch Interactive Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
