import React, { useState, useRef } from 'react';
import { UrlAnalyzer } from './UrlAnalyzer';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Download, 
  QrCode, 
  Info, 
  Layers, 
  Maximize2, 
  RotateCcw,
  Camera,
  Search,
  Lock,
  X,
  Share2
} from 'lucide-react';
import { AnalysisResult, SamplePreset, HeatmapPoint } from '../types';
import { SAMPLE_PRESETS } from '../data/presets';
import { VeriLensIcon } from './VeriLensIcon';

interface DashboardProps {
  onRunAnalysis: (data: { imageUrl: string; reviewText: string; brand?: string; category?: string; itemName?: string }) => Promise<AnalysisResult>;
  initialPreset?: SamplePreset | null;
  onSaveToVault?: (result: AnalysisResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onRunAnalysis, initialPreset, onSaveToVault }) => {
  // Input State
  const [imageUrl, setImageUrl] = useState<string>(initialPreset?.imageUrl || '');
  const [reviewText, setReviewText] = useState<string>(initialPreset?.defaultReview || '');
  const [itemName, setItemName] = useState<string>(initialPreset?.title || '');
  const [brand, setBrand] = useState<string>(initialPreset?.brand || '');
  const [category, setCategory] = useState<string>(initialPreset?.category || '');

  // Analysis Lifecycle State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('Initializing...');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Interactive Heatmap UI State
  const [selectedHotspot, setSelectedHotspot] = useState<HeatmapPoint | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'bounding_boxes' | 'raw'>('heatmap');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load Preset
  const handleSelectPreset = (preset: SamplePreset) => {
    setImageUrl(preset.imageUrl);
    setReviewText(preset.defaultReview);
    setItemName(preset.title);
    setBrand(preset.brand);
    setCategory(preset.category);
    setAnalysisResult(null);
  };

  // Trigger Analysis
  const handleAnalyze = async () => {
    if (!imageUrl && !reviewText) return;

    setIsLoading(true);
    setAnalysisResult(null);

    // Scanning progress steps for high precision feel
    const steps = [
      'Initializing Image Scanning...',
      'Checking Stitching Quality...',
      'Analyzing Hardware Electroplating & Debossing...',
      'Analyzing Review Text...',
      'Generating Trust Score & Heatmap...'
    ];

    let stepIdx = 0;
    setScanStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setScanStep(steps[stepIdx]);
      }
    }, 450);

    try {
      const result = await onRunAnalysis({
        imageUrl,
        reviewText,
        brand,
        category,
        itemName
      });

      clearInterval(interval);
      setAnalysisResult(result);
      if (result.heatmapPoints && result.heatmapPoints.length > 0) {
        setSelectedHotspot(result.heatmapPoints[0]);
      }
      if (onSaveToVault) {
        onSaveToVault(result);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      clearInterval(interval);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[var(--page-light)] min-h-screen pt-24 pb-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-10">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-xs font-bold uppercase tracking-wider mb-3">
              <VeriLensIcon className="w-3.5 h-3.5" />
              LIVE VERIFICATION DASHBOARD
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Apparel & Review Authenticator.
            </h1>
            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-2 max-w-xl">
              Upload product imagery and paste reseller review text for deep multimodal evaluation.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
            <span className="text-xs text-gray-500 shrink-0 font-bold uppercase tracking-wider">Quick Presets:</span>
            {SAMPLE_PRESETS.slice(0, 3).map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
                  itemName === preset.title
                    ? 'bg-[var(--green-primary)] text-white border-[var(--green-primary)] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--green-primary)]'
                }`}
              >
                {preset.title.split(' ')[0]} {preset.brand}
              </button>
            ))}
          </div>
        </div>

        {/* URL Link Analyzer */}
        <div className="w-full max-w-[850px] mx-auto">
          <UrlAnalyzer standalone={false} onAnalyzeComplete={onSaveToVault} />
        </div>

        {/* Main Grid: Input Area vs Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Area (Image + Review Text) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: Product Image Upload Zone */}
            <div className="p-6 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <label className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[var(--green-primary)]" />
                  1. Upload Product Image
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[var(--green-primary)] hover:text-green-700 font-bold flex items-center gap-1 bg-[var(--green-primary)]/10 px-2 py-1 rounded-full"
                >
                  <Camera className="w-3.5 h-3.5" /> Browse Files
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Drag and drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !imageUrl && fileInputRef.current?.click()}
                className="relative min-h-[240px] rounded-2xl border-2 border-dashed border-gray-200 hover:border-[var(--green-primary)] bg-gray-50 hover:bg-[var(--green-primary)]/5 p-4 transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
              >
                {imageUrl ? (
                  <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden flex items-center justify-center bg-white p-2 border border-gray-100">
                    <img
                      src={imageUrl}
                      alt="Apparel upload preview"
                      referrerPolicy="no-referrer"
                      className="max-h-[220px] w-auto object-contain rounded-lg group-hover:scale-[1.02] transition-transform mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Replace Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 py-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--green-primary)]/10 flex items-center justify-center text-[var(--green-primary)] mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[var(--text-primary)]">Drag & drop product image here</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Supports PNG, JPG, WEBP</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Item details input */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Item Title</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Chanel Flap Bag"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--green-primary)] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Chanel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--green-primary)] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: E-Commerce Review Text Area */}
            <div className="p-6 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <label className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  2. Paste E-Commerce Review
                </label>
                <button
                  type="button"
                  onClick={() => setReviewText('')}
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-700 uppercase tracking-wider transition-colors"
                >
                  Clear Text
                </button>
              </div>

              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste the buyer or reseller review text here to test for synthetic bot manipulation and sentiment mismatch..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none font-medium leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>{reviewText.length} characters</span>
                <span className="text-purple-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> NLP Ready
                </span>
              </div>
            </div>

            {/* Action Button: Analyze Authenticity */}
            <button
              id="analyze-authenticity-btn"
              onClick={handleAnalyze}
              disabled={isLoading || (!imageUrl && !reviewText)}
              className={`w-full py-4.5 rounded-full font-bold text-[15px] shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 ${
                isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-[var(--text-primary)] hover:bg-gray-800 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                  <span>{scanStep}</span>
                </>
              ) : (
                <>
                  <VeriLensIcon className="w-5 h-5 text-[var(--green-primary)]" />
                  <span>Analyze Authenticity</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Results Area (XAI Heatmap, Trust Gauge, Analysis Details) */}
          <div className="lg:col-span-8 space-y-6">
            {isLoading ? (
              /* Loading State Animation Container */
              <div className="p-12 rounded-3xl bg-white border border-[var(--border-card)] flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] shadow-sm">
                <div className="relative w-28 h-28">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-[var(--green-primary)] animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-gray-50 border-b-purple-500 animate-spin [animation-duration:1.5s]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-[var(--green-primary)] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{scanStep}</h3>
                  <p className="text-sm text-gray-500 max-w-sm font-medium">
                    VeriLens AI engine is cross-referencing stitching vectors and review text entropy against verified master databases.
                  </p>
                </div>
              </div>
            ) : analysisResult ? (
              /* ═══════════════════════════════════════════════════════════
                 ANALYSIS REPORT — Premium Redesign
                 ═══════════════════════════════════════════════════════════ */
              <div className="space-y-5 animate-fade-in-up">

                {/* ── VERDICT HERO BANNER ─────────────────────────────── */}
                <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border ${
                  analysisResult.trustScore >= 80
                    ? 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 border-emerald-700/40'
                    : analysisResult.trustScore >= 50
                    ? 'bg-gradient-to-br from-amber-950 via-amber-900 to-orange-900 border-amber-700/40'
                    : 'bg-gradient-to-br from-rose-950 via-red-900 to-rose-900 border-red-700/40'
                } shadow-xl`}>
                  {/* Subtle orb glow behind content */}
                  <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                    analysisResult.trustScore >= 80 ? 'bg-emerald-400' : analysisResult.trustScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <div className="absolute bottom-0 left-1/3 w-48 h-32 rounded-full blur-3xl opacity-10 bg-white" />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    {/* Left: Identity */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                          analysisResult.trustScore >= 80
                            ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                            : analysisResult.trustScore >= 50
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                            : 'bg-red-400/20 text-red-300 border-red-400/30'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {analysisResult.verdict}
                        </span>
                        <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Verification Complete</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {analysisResult.itemName}
                        <span className="ml-3 text-lg font-bold opacity-60">{analysisResult.brand}</span>
                      </h2>
                      <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest font-mono">
                        {analysisResult.verificationHash} · {analysisResult.timestamp}
                      </p>
                    </div>

                    {/* Right: Score Ring + Action */}
                    <div className="flex items-center gap-5 sm:gap-6 shrink-0">
                      {/* Animated Trust Ring */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          {/* Track */}
                          <circle cx="50" cy="50" r="40" className="fill-none stroke-[10]" stroke="rgba(255,255,255,0.08)" />
                          {/* Outer glow ring */}
                          <circle cx="50" cy="50" r="44" className="fill-none stroke-[2]" stroke="rgba(255,255,255,0.06)" />
                          {/* Score arc */}
                          <circle
                            cx="50" cy="50" r="40"
                            className="fill-none stroke-[10] animate-draw-arc"
                            stroke={analysisResult.trustScore >= 80 ? '#34d399' : analysisResult.trustScore >= 50 ? '#fbbf24' : '#f87171'}
                            strokeDasharray="251"
                            strokeDashoffset={251 - (251 * analysisResult.trustScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">{analysisResult.trustScore}</span>
                          <span className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-0.5">Trust %</span>
                        </div>
                      </div>

                      {/* Certificate button */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setShowCertificateModal(true)}
                          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition-all hover:border-white/40 backdrop-blur-sm"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Certificate</span>
                        </button>
                        <button className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition-all hover:border-white/40 backdrop-blur-sm">
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── AI CONFIDENCE + METRIC BREAKDOWN ────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">

                  {/* Confidence Card */}
                  <div className="sm:col-span-5 p-6 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">AI System Confidence</span>
                      <span className="text-[var(--green-primary)] font-black font-mono text-xl">{analysisResult.aiConfidence}%</span>
                    </div>
                    {/* Thick confidence bar */}
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-accent-from)] h-full rounded-full transition-all duration-1000 ease-out animate-fill-bar"
                        style={{ width: `${analysisResult.aiConfidence}%` }}
                      />
                    </div>
                    <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                      The AI model cross-referenced {analysisResult.aiConfidence >= 85 ? 'high-fidelity' : 'baseline'} pattern libraries with {analysisResult.aiConfidence >= 85 ? 'strong' : 'moderate'} signal convergence.
                    </p>
                  </div>

                  {/* Detailed Metric Scores */}
                  <div className="sm:col-span-7 p-6 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-4">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      {analysisResult.imageUrl ? 'Visual Craftsmanship Scores' : 'NLP Signal Metrics'}
                    </span>

                    {analysisResult.imageUrl ? (
                      <div className="space-y-3.5">
                        {[
                          { label: 'Stitching Pitch', value: analysisResult.detailedScores.stitchingQuality, color: 'var(--green-primary)' },
                          { label: 'Hardware Engraving', value: analysisResult.detailedScores.hardwareAuthenticity, color: '#6366f1' },
                          { label: 'Care Tag Typography', value: analysisResult.detailedScores.typographyAccuracy, color: '#0ea5e9' },
                          { label: 'Material Texture', value: analysisResult.detailedScores.fabricTextureMatch, color: '#a855f7' },
                        ].map((metric, i) => (
                          <div key={i} className="space-y-1.5">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="font-bold text-[var(--text-primary)]">{metric.label}</span>
                              <span className="font-black font-mono" style={{ color: metric.color }}>{metric.value}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${metric.value}%`, backgroundColor: metric.color, transitionDelay: `${i * 100}ms` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Linguistic Perplexity</span>
                          <span className="text-2xl font-black text-purple-700 font-mono">{analysisResult.detailedScores.reviewPerplexity}%</span>
                          <span className="text-[11px] text-purple-500 font-medium">Organic syntactic entropy</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Sentiment Coherence</span>
                          <span className="text-2xl font-black text-emerald-700 font-mono">{analysisResult.detailedScores.reviewSentimentAlignment}%</span>
                          <span className="text-[11px] text-emerald-500 font-medium">Authentic buyer tone</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── VISUAL IMAGE INSPECTOR ───────────────────────────── */}
                {analysisResult.imageUrl && (
                  <div className="rounded-3xl bg-white border border-[var(--border-card)] shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--green-primary)]/10 flex items-center justify-center">
                          <Eye className="w-4.5 h-4.5 text-[var(--green-primary)]" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                            Image Inspection Map
                          </h3>
                          <p className="text-[11px] text-gray-400 font-bold">{analysisResult.heatmapPoints.length} hotspots detected</p>
                        </div>
                      </div>
                      {/* Mode Toggles */}
                      <div className="flex items-center bg-gray-100 p-1 rounded-full text-[11px] font-black self-start gap-0.5">
                        {(['heatmap', 'bounding_boxes', 'raw'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3.5 py-1.5 rounded-full transition-all uppercase tracking-wide ${
                              viewMode === mode
                                ? 'bg-white text-[var(--text-primary)] shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {mode === 'bounding_boxes' ? 'Boxes' : mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Canvas */}
                    <div className="relative w-full bg-[#F8FAFC] min-h-[360px] flex items-center justify-center p-6 border-b border-gray-100">
                      <img
                        src={analysisResult.imageUrl}
                        alt={analysisResult.itemName}
                        referrerPolicy="no-referrer"
                        className="max-h-[420px] w-auto object-contain rounded-xl mix-blend-multiply drop-shadow-sm"
                      />
                      {viewMode === 'heatmap' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--green-primary)]/12 via-purple-500/8 to-amber-500/12 mix-blend-multiply pointer-events-none rounded-b-none" />
                      )}
                      {viewMode !== 'raw' && analysisResult.heatmapPoints.map(point => {
                        const isSelected = selectedHotspot?.id === point.id;
                        const isCritical = point.severity === 'critical' || point.severity === 'high';
                        return (
                          <div
                            key={point.id}
                            onClick={() => setSelectedHotspot(point)}
                            style={{ left: `${point.x}%`, top: `${point.y}%`, width: `${point.width}%`, height: `${point.height}%` }}
                            className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-start justify-start p-1 ${
                              isCritical
                                ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20'
                                : 'border-[#059669] bg-[#059669]/10 hover:bg-[#059669]/20'
                            } ${isSelected ? 'ring-2 ring-offset-1 ring-white z-20 scale-[1.04] shadow-xl' : 'hover:scale-[1.03] z-10 shadow-sm'}`}
                          >
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider -mt-4 -ml-2 whitespace-nowrap shadow-sm ${
                              isCritical ? 'bg-red-500 text-white' : 'bg-[#059669] text-white'
                            }`}>
                              {point.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Hotspot list + detail panel */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-5">
                      {/* Hotspot selector pills */}
                      <div className="sm:col-span-5 space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Hotspot</span>
                        <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                          {analysisResult.heatmapPoints.map(point => {
                            const isSelected = selectedHotspot?.id === point.id;
                            const isCritical = point.severity === 'critical' || point.severity === 'high';
                            return (
                              <button
                                key={point.id}
                                onClick={() => setSelectedHotspot(point)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all border text-[12px] font-bold ${
                                  isSelected
                                    ? isCritical
                                      ? 'bg-red-50 border-red-300 text-red-700'
                                      : 'bg-[var(--green-primary)]/8 border-[var(--green-primary)]/30 text-[var(--green-primary)]'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                <span className="truncate">{point.label}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                                  isCritical ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {point.confidence}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detail panel */}
                      <div className="sm:col-span-7">
                        {selectedHotspot ? (
                          <div className={`h-full rounded-2xl p-5 space-y-3 border relative overflow-hidden ${
                            selectedHotspot.severity === 'critical' || selectedHotspot.severity === 'high'
                              ? 'bg-red-50/60 border-red-200'
                              : 'bg-emerald-50/60 border-emerald-200'
                          }`}>
                            {/* Accent bar */}
                            <div className={`absolute top-0 left-0 w-full h-0.5 ${
                              selectedHotspot.severity === 'critical' || selectedHotspot.severity === 'high'
                                ? 'bg-gradient-to-r from-red-500 to-orange-400'
                                : 'bg-gradient-to-r from-[var(--green-primary)] to-emerald-400'
                            }`} />
                            <div className="flex items-start justify-between gap-3 pt-1">
                              <div>
                                <span className="font-extrabold text-[var(--text-primary)] text-[15px] block">{selectedHotspot.label}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedHotspot.category}</span>
                              </div>
                              <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg shrink-0 ${
                                selectedHotspot.severity === 'critical' || selectedHotspot.severity === 'high'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {selectedHotspot.confidence}% conf.
                              </span>
                            </div>
                            <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{selectedHotspot.description}</p>
                          </div>
                        ) : (
                          <div className="h-full rounded-2xl p-5 bg-gray-50 border border-gray-200 border-dashed flex items-center justify-center text-center">
                            <div className="space-y-1">
                              <Maximize2 className="w-6 h-6 text-gray-300 mx-auto" />
                              <p className="text-[12px] text-gray-400 font-bold">Click a hotspot or select one from the list</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── REVIEW NLP FORENSICS ─────────────────────────────── */}
                {analysisResult.reviewText && (
                  <div className="rounded-3xl bg-white border border-[var(--border-card)] shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                          <FileText className="w-4.5 h-4.5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                            NLP Linguistic Forensics
                          </h3>
                          <p className="text-[11px] text-gray-400 font-bold">{analysisResult.reviewText.length} characters · review authenticity analysis</p>
                        </div>
                      </div>
                      <span className={`self-start sm:self-auto text-[11px] font-black px-3 py-1.5 rounded-full border ${
                        analysisResult.fakeReviewProbability > 50
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {analysisResult.fakeReviewProbability > 50 ? '⚠ High Synthetic Risk' : '✓ Likely Organic'}
                      </span>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                      {/* Review Quote */}
                      <div className="relative rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-indigo-50/50 p-5">
                        <div className="absolute top-4 left-5 text-5xl text-purple-200 font-serif leading-none select-none">"</div>
                        <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2 pt-1">Analyzed Review Submission</div>
                        <p className="text-[13px] text-purple-950 font-medium italic leading-relaxed pl-1 pr-4">
                          {analysisResult.reviewText}
                        </p>
                      </div>

                      {/* Synthetic probability meter */}
                      <div className="p-5 rounded-2xl bg-[#F6EEFF] border border-[#E9D5FF] space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[13px] font-black text-purple-900">Bot / Synthetic Probability</span>
                            <p className="text-[11px] text-purple-500 font-medium mt-0.5">How likely this review was AI- or bot-generated</p>
                          </div>
                          <span className={`text-3xl font-black font-mono ${
                            analysisResult.fakeReviewProbability > 50 ? 'text-red-500' : 'text-purple-600'
                          }`}>
                            {analysisResult.fakeReviewProbability}%
                          </span>
                        </div>
                        {/* Segmented bar */}
                        <div className="relative w-full h-3 bg-white rounded-full overflow-hidden border border-purple-100">
                          <div className="absolute inset-0 flex">
                            <div className="h-full bg-emerald-400/30 flex-1" style={{ maxWidth: '50%' }} />
                            <div className="h-full bg-red-400/20 flex-1" />
                          </div>
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                              analysisResult.fakeReviewProbability > 50 ? 'bg-red-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${analysisResult.fakeReviewProbability}%` }}
                          />
                          {/* Midpoint marker */}
                          <div className="absolute top-0 left-1/2 w-px h-full bg-white/70" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-purple-400">
                          <span>Organic</span>
                          <span>50% threshold</span>
                          <span>Synthetic</span>
                        </div>

                        {/* Flags */}
                        {analysisResult.reviewFlags && analysisResult.reviewFlags.length > 0 && (
                          <div className="pt-3 border-t border-purple-200 space-y-2">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Detected Flags</span>
                            {analysisResult.reviewFlags.map((flag, idx) => (
                              <div key={idx} className={`flex items-start gap-2.5 p-3 rounded-xl text-[12px] ${
                                flag.severity === 'high' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'
                              }`}>
                                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${flag.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                                <div>
                                  <span className="font-black text-gray-800">{flag.type}: </span>
                                  <span className="text-gray-600 font-medium">{flag.explanation}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {(!analysisResult.reviewFlags || analysisResult.reviewFlags.length === 0) && (
                          <div className="pt-3 border-t border-purple-200">
                            <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>No synthetic patterns detected — organic human phrasing verified</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes + Recommendations two-col */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* AI Linguistic Notes */}
                        <div className="rounded-2xl border border-gray-200 overflow-hidden">
                          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-gray-400" />
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">AI Linguistic Notes</span>
                          </div>
                          <ul className="p-5 space-y-3">
                            {analysisResult.xaiReasoning.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500 shrink-0 mt-0.5">{idx + 1}</span>
                                <span className="text-[13px] text-gray-600 leading-relaxed font-medium">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* AI Recommendations */}
                        <div className="rounded-2xl border border-emerald-200 overflow-hidden">
                          <div className="px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/80 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">AI Recommendations</span>
                          </div>
                          <ul className="p-5 space-y-3">
                            {analysisResult.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </span>
                                <span className="text-[13px] text-gray-700 leading-relaxed font-medium">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── IMAGE-ONLY: Findings + Next Steps ───────────────── */}
                {analysisResult.imageUrl && !analysisResult.reviewText && (
                  <div className="rounded-3xl bg-white border border-[var(--border-card)] shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-6 sm:px-8 py-5 border-b border-gray-100">
                      <div className="w-9 h-9 rounded-xl bg-[var(--green-primary)]/10 flex items-center justify-center">
                        <ShieldCheck className="w-4.5 h-4.5 text-[var(--green-primary)]" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                          Visual Craftsmanship & Next Steps
                        </h3>
                        <p className="text-[11px] text-gray-400 font-bold">Key inspection findings from visual AI analysis</p>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-gray-400" />
                          <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Key Inspection Findings</span>
                        </div>
                        <ul className="p-5 space-y-3">
                          {analysisResult.xaiReasoning.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500 shrink-0 mt-0.5">{idx + 1}</span>
                              <span className="text-[13px] text-gray-600 leading-relaxed font-medium">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-emerald-200 overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/80 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Recommended Next Steps</span>
                        </div>
                        <ul className="p-5 space-y-3">
                          {analysisResult.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              </span>
                              <span className="text-[13px] text-gray-700 leading-relaxed font-medium">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* Empty State: Ready for analysis */
              <div className="p-12 rounded-3xl bg-white border border-[var(--border-card)] flex flex-col items-center justify-center text-center space-y-4 min-h-[460px] shadow-sm">
                <div className="w-20 h-20 rounded-full bg-[var(--green-primary)]/10 flex items-center justify-center text-[var(--green-primary)]">
                  <VeriLensIcon className="w-10 h-10" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Ready for AI Verification</h3>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    Select a preset or upload your own fashion item to run real-time multimodal visual & NLP inspection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Printable / View Digital Certificate Modal */}
        {showCertificateModal && analysisResult && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl animate-fade-in">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Header */}
              <div className="text-center space-y-3 border-b border-gray-100 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--green-primary)]/10 border border-[var(--green-primary)]/20 flex items-center justify-center text-[var(--green-primary)] mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-[var(--text-primary)] font-serif italic">VeriStyle Authenticity Certificate</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Digital Fashion Provenance & Forensics Seal</p>
              </div>

              {/* Certificate Body */}
              <div className="space-y-3 text-[13px] font-medium">
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Item Name:</span>
                  <span className="font-bold text-[var(--text-primary)]">{analysisResult.itemName}</span>
                </div>
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Brand / Manufacturer:</span>
                  <span className="font-bold text-[var(--text-primary)]">{analysisResult.brand}</span>
                </div>
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Verification Verdict:</span>
                  <span className={`font-black font-mono uppercase ${
                    analysisResult.trustScore >= 80 ? 'text-[#059669]' : 'text-red-500'
                  }`}>
                    {analysisResult.verdict} ({analysisResult.trustScore}%)
                  </span>
                </div>
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Blockchain Hash:</span>
                  <span className="font-mono text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">{analysisResult.verificationHash}</span>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="p-5 rounded-2xl bg-[var(--text-primary)] border border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-white">Scan QR for Online Verification</p>
                  <p className="text-xs text-gray-400 mt-0.5">Immutable record stored in VeriStyle History</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-inner">
                  <QrCode className="w-full h-full text-black" />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3.5 rounded-full bg-[var(--green-primary)] hover:bg-green-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
