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
  Layers,
  Maximize2,
  Camera,
  X,
  Share2,
  Zap,
  Brain,
  ScanLine,
  Lock,
  Activity,
  Hash,
  ChevronRight,
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
  const [imageUrl, setImageUrl] = useState<string>(initialPreset?.imageUrl || '');
  const [reviewText, setReviewText] = useState<string>(initialPreset?.defaultReview || '');
  const [itemName, setItemName] = useState<string>(initialPreset?.title || '');
  const [brand, setBrand] = useState<string>(initialPreset?.brand || '');
  const [category, setCategory] = useState<string>(initialPreset?.category || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('Initializing...');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<HeatmapPoint | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'bounding_boxes' | 'raw'>('heatmap');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => { if (ev.target?.result) setImageUrl(ev.target.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => { if (ev.target?.result) setImageUrl(ev.target.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    setImageUrl(preset.imageUrl);
    setReviewText(preset.defaultReview);
    setItemName(preset.title);
    setBrand(preset.brand);
    setCategory(preset.category);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!imageUrl && !reviewText) return;
    setIsLoading(true);
    setAnalysisResult(null);
    const steps = [
      'Initializing AI Engines...',
      'Scanning Stitching & Material...',
      'Analyzing Hardware Electroplating...',
      'Processing Review NLP Forensics...',
      'Generating Trust Score & Heatmap...',
    ];
    let stepIdx = 0;
    setScanStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) setScanStep(steps[stepIdx]);
    }, 450);
    try {
      const result = await onRunAnalysis({ imageUrl, reviewText, brand, category, itemName });
      clearInterval(interval);
      setAnalysisResult(result);
      if (result.heatmapPoints?.length > 0) setSelectedHotspot(result.heatmapPoints[0]);
      if (onSaveToVault) onSaveToVault(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      clearInterval(interval);
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictColors = (score: number) => {
    if (score >= 80) return { bg: 'rgba(0,80,40,0.06)', border: 'rgba(0,160,70,0.15)', accent: '#00C966', glow: 'rgba(0,160,70,0.2)', arc: '#00A854', label: 'VERIFIED AUTHENTIC' };
    if (score >= 50) return { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', accent: '#F59E0B', glow: 'rgba(245,158,11,0.2)', arc: '#D97706', label: 'SUSPICIOUS' };
    return { bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.15)', accent: '#F43F5E', glow: 'rgba(244,63,94,0.2)', arc: '#DC2626', label: 'LIKELY COUNTERFEIT' };
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6" style={{ borderBottom: '1px solid rgba(0,80,40,0.06)' }}>
          <div>
            <div className="section-badge mb-4">
              <Activity className="w-3.5 h-3.5" />
              Live Verification Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Apparel & Review Authenticator.
            </h1>
            <p className="text-sm sm:text-base mt-2 max-w-xl" style={{ color: 'var(--text-muted)' }}>
              Upload product imagery and paste reseller review text for deep multimodal evaluation.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
            <span className="text-[10px] uppercase tracking-widest font-bold shrink-0" style={{ color: 'var(--text-dim)' }}>Quick Presets:</span>
            {SAMPLE_PRESETS.slice(0, 3).map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all cursor-pointer"
                style={
                  itemName === preset.title
                    ? { background: 'linear-gradient(135deg, #00C966, #00A854)', color: '#FFFFFF', border: 'none', boxShadow: '0 0 16px rgba(0,160,70,0.2)' }
                    : { background: 'rgba(0,160,70,0.04)', border: '1px solid rgba(0,80,40,0.08)', color: 'var(--text-muted)' }
                }
              >
                {preset.title.split(' ')[0]} {preset.brand}
              </button>
            ))}
          </div>
        </div>

        {/* URL Analyzer */}
        <div className="w-full max-w-[860px] mx-auto">
          <UrlAnalyzer standalone={false} onAnalyzeComplete={onSaveToVault} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-4 space-y-5">

            {/* Image Upload */}
            <div className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.07)' }}>
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <ImageIcon className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                  1. Upload Product Image
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                  style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,80,40,0.1)', color: 'var(--green-accent-from)' }}
                >
                  <Camera className="w-3.5 h-3.5" /> Browse
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !imageUrl && fileInputRef.current?.click()}
                className="relative min-h-[220px] rounded-xl border-2 border-dashed p-4 transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden scanline-overlay"
                style={{ borderColor: 'rgba(0,80,40,0.1)', background: 'rgba(0,160,70,0.02)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,160,70,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,80,40,0.1)')}
              >
                {imageUrl ? (
                  <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      referrerPolicy="no-referrer"
                      className="max-h-[200px] w-auto object-contain rounded-lg group-hover:scale-[1.02] transition-transform"
                      style={{ filter: 'brightness(0.95) contrast(1.05)' }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.85)' }}
                    >
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 btn-neon"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Replace Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 py-8">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"
                      style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,80,40,0.1)' }}
                    >
                      <Upload className="w-6 h-6" style={{ color: 'var(--green-accent-from)' }} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>Drag & drop product image</p>
                      <p className="text-xs mt-1 font-medium font-mono" style={{ color: 'var(--text-dim)' }}>PNG · JPG · WEBP</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Item Title', value: itemName, setter: setItemName, ph: 'e.g. Chanel Flap Bag' },
                  { label: 'Brand Name', value: brand, setter: setBrand, ph: 'e.g. Chanel' },
                ].map(({ label, value, setter, ph }) => (
                  <div key={label}>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>{label}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={ph}
                      className="input-dark w-full px-3 py-2.5 text-sm rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.07)' }}>
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-4 h-4" style={{ color: '#6366F1' }} />
                  2. Paste Review Text
                </label>
                <button
                  type="button"
                  onClick={() => setReviewText('')}
                  className="text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  style={{ color: 'var(--text-dim)' }}
                >
                  Clear
                </button>
              </div>

              <textarea
                rows={5}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste the buyer or reseller review text here to test for synthetic bot manipulation and sentiment mismatch..."
                className="input-dark w-full p-4 text-sm rounded-xl resize-none leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              />

              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{reviewText.length} chars</span>
                <span className="flex items-center gap-1" style={{ color: '#6366F1' }}>
                  <Sparkles className="w-3.5 h-3.5" /> NLP Ready
                </span>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              id="analyze-authenticity-btn"
              onClick={handleAnalyze}
              disabled={isLoading || (!imageUrl && !reviewText)}
              className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-2.5 ${
                isLoading || (!imageUrl && !reviewText)
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer btn-neon'
              }`}
              style={
                isLoading || (!imageUrl && !reviewText)
                  ? { background: 'rgba(0,60,30,0.03)', border: '1px solid rgba(0,60,30,0.05)', color: 'var(--text-dim)' }
                  : {}
              }
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{scanStep}</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Analyze Authenticity</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-8 space-y-5">
            {isLoading ? (
              /* Loading State */
              <div
                className="p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] scanline-overlay relative overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.08)' }}
              >
                <div className="absolute inset-0 hex-grid-bg opacity-50 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none animate-breathe" style={{ background: 'rgba(0,160,70,0.04)' }} />

                <div className="relative w-28 h-28">
                  <div className="absolute inset-0 rounded-full border-2 border-t-[var(--green-accent-from)] animate-spin" style={{ borderColor: 'rgba(0,80,40,0.1)', borderTopColor: 'var(--green-accent-from)' }} />
                  <div className="absolute inset-3 rounded-full border-2 border-b-[#6366F1] animate-spin" style={{ animationDuration: '1.5s', borderColor: 'rgba(129,140,248,0.1)', borderBottomColor: '#6366F1' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center animate-glow-pulse"
                      style={{ background: 'rgba(0,80,40,0.08)', border: '1px solid rgba(0,160,70,0.15)' }}
                    >
                      <Brain className="w-6 h-6" style={{ color: 'var(--green-accent-from)' }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    {scanStep}
                  </h3>
                  <p className="text-sm max-w-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                    VeriLens AI engine is cross-referencing stitching vectors and review text entropy against verified master databases.
                  </p>
                </div>
              </div>

            ) : analysisResult ? (
              /* ═══════════════════════════════════════════════════════════
                 ANALYSIS REPORT — Premium Dark Redesign
                 ═══════════════════════════════════════════════════════════ */
              <div className="space-y-5 animate-fade-in-up">
                {(() => {
                  const vc = getVerdictColors(analysisResult.trustScore);
                  return (
                    <>
                      {/* ── VERDICT HERO ─────────────────────────────── */}
                      <div
                        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
                        style={{ background: vc.bg, border: `1px solid ${vc.border}`, boxShadow: `0 0 60px ${vc.glow}20` }}
                      >
                        {/* Background glow */}
                        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: vc.glow, opacity: 0.15 }} />
                        <div className="absolute inset-0 hex-grid-bg opacity-30 pointer-events-none" />

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          {/* Left: Item info */}
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest"
                                style={{ background: `${vc.accent}15`, border: `1px solid ${vc.accent}35`, color: vc.accent }}
                              >
                                <ShieldCheck className="w-3 h-3" />
                                {analysisResult.verdict}
                              </span>
                              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
                                Verification Complete
                              </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                              {analysisResult.itemName}
                              <span className="ml-3 text-lg font-bold" style={{ color: 'var(--text-muted)' }}>{analysisResult.brand}</span>
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--text-dim)' }}>
                              {analysisResult.verificationHash} · {analysisResult.timestamp}
                            </p>
                          </div>

                          {/* Right: Trust Ring + Actions */}
                          <div className="flex items-center gap-5 shrink-0">
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 animate-halo-pulse">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" stroke="rgba(0,60,30,0.05)" />
                                <circle cx="50" cy="50" r="44" fill="none" strokeWidth="1.5" stroke="rgba(0,60,30,0.03)" />
                                <circle
                                  cx="50" cy="50" r="40"
                                  fill="none"
                                  strokeWidth="8"
                                  className="animate-draw-arc"
                                  stroke={vc.arc}
                                  strokeDasharray="251"
                                  strokeDashoffset={251 - (251 * analysisResult.trustScore) / 100}
                                  strokeLinecap="round"
                                  style={{ filter: `drop-shadow(0 0 8px ${vc.glow})` }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none" style={{ color: vc.accent }}>
                                  {analysisResult.trustScore}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-dim)' }}>Trust %</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => setShowCertificateModal(true)}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                                style={{ background: 'rgba(0,60,30,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,60,30,0.05)')}
                              >
                                <QrCode className="w-4 h-4" />
                                Certificate
                              </button>
                              <button
                                className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                                style={{ background: 'rgba(0,60,30,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,60,30,0.05)')}
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── AI CONFIDENCE + METRIC BREAKDOWN ────────── */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                        {/* Confidence */}
                        <div className="sm:col-span-5 p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.07)' }}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>AI System Confidence</span>
                            <span className="font-black font-mono text-xl" style={{ color: 'var(--green-accent-from)' }}>{analysisResult.aiConfidence}%</span>
                          </div>
                          <div className="metric-track">
                            <div
                              className="metric-fill animate-fill-bar"
                              style={{ width: `${analysisResult.aiConfidence}%` }}
                            />
                          </div>
                          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            The AI model cross-referenced {analysisResult.aiConfidence >= 85 ? 'high-fidelity' : 'baseline'} pattern libraries with {analysisResult.aiConfidence >= 85 ? 'strong' : 'moderate'} signal convergence.
                          </p>
                        </div>

                        {/* Detailed Metrics */}
                        <div className="sm:col-span-7 p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.07)' }}>
                          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
                            {analysisResult.imageUrl ? 'Visual Craftsmanship Scores' : 'NLP Signal Metrics'}
                          </span>

                          {analysisResult.imageUrl ? (
                            <div className="space-y-3.5">
                              {[
                                { label: 'Stitching Pitch', value: analysisResult.detailedScores.stitchingQuality, color: 'var(--green-accent-from)', glow: 'rgba(0,160,70,0.2)' },
                                { label: 'Hardware Engraving', value: analysisResult.detailedScores.hardwareAuthenticity, color: '#6366F1', glow: 'rgba(129,140,248,0.4)' },
                                { label: 'Care Tag Typography', value: analysisResult.detailedScores.typographyAccuracy, color: '#38BDF8', glow: 'rgba(56,189,248,0.4)' },
                                { label: 'Material Texture', value: analysisResult.detailedScores.fabricTextureMatch, color: '#A78BFA', glow: 'rgba(167,139,250,0.4)' },
                              ].map((metric, i) => (
                                <div key={i} className="space-y-1.5">
                                  <div className="flex items-center justify-between text-[12px]">
                                    <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>{metric.label}</span>
                                    <span className="font-black font-mono" style={{ color: metric.color }}>{metric.value}%</span>
                                  </div>
                                  <div className="metric-track">
                                    <div
                                      className="metric-fill"
                                      style={{
                                        width: `${metric.value}%`,
                                        background: `linear-gradient(90deg, ${metric.color}66, ${metric.color})`,
                                        boxShadow: `0 0 8px ${metric.glow}`,
                                        transitionDelay: `${i * 100}ms`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4 pt-1">
                              {[
                                { label: 'Linguistic Perplexity', value: analysisResult.detailedScores.reviewPerplexity, sub: 'Organic syntactic entropy', color: '#6366F1', bg: 'rgba(99,102,241,0.04)', border: 'rgba(129,140,248,0.12)' },
                                { label: 'Sentiment Coherence', value: analysisResult.detailedScores.reviewSentimentAlignment, sub: 'Authentic buyer tone', color: 'var(--green-accent-from)', bg: 'rgba(0,160,70,0.05)', border: 'rgba(0,80,40,0.08)' },
                              ].map(({ label, value, sub, color, bg, border }) => (
                                <div key={label} className="p-4 rounded-xl space-y-1" style={{ background: bg, border: `1px solid ${border}` }}>
                                  <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color }}>{label}</span>
                                  <span className="text-2xl font-black font-mono" style={{ color }}>{value}%</span>
                                  <span className="text-[11px] font-medium block" style={{ color: 'var(--text-muted)' }}>{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── VISUAL IMAGE INSPECTOR ───────────────────── */}
                      {analysisResult.imageUrl && (
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.07)' }}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,80,40,0.1)' }}>
                                <Eye className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                              </div>
                              <div>
                                <h3 className="text-[14px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Image Inspection Map</h3>
                                <p className="text-[11px] font-bold font-mono" style={{ color: 'var(--text-dim)' }}>{analysisResult.heatmapPoints.length} hotspots detected</p>
                              </div>
                            </div>
                            {/* Mode toggles */}
                            <div className="flex items-center p-1 rounded-xl gap-0.5 text-[11px] font-black" style={{ background: 'rgba(0,60,30,0.03)', border: '1px solid rgba(0,60,30,0.05)' }}>
                              {(['heatmap', 'bounding_boxes', 'raw'] as const).map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => setViewMode(mode)}
                                  className="px-3.5 py-1.5 rounded-lg transition-all uppercase tracking-wide cursor-pointer"
                                  style={viewMode === mode
                                    ? { background: 'rgba(0,80,40,0.08)', color: 'var(--green-accent-from)', border: '1px solid rgba(0,160,70,0.15)' }
                                    : { color: 'var(--text-dim)' }
                                  }
                                >
                                  {mode === 'bounding_boxes' ? 'Boxes' : mode}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Canvas */}
                          <div className="relative w-full min-h-[360px] flex items-center justify-center p-6" style={{ background: 'rgba(0,40,20,0.04)', borderBottom: '1px solid rgba(0,60,30,0.03)' }}>
                            <img
                              src={analysisResult.imageUrl}
                              alt={analysisResult.itemName}
                              referrerPolicy="no-referrer"
                              className="max-h-[420px] w-auto object-contain rounded-xl"
                              style={{ filter: 'brightness(0.9) contrast(1.1)' }}
                            />
                            {viewMode === 'heatmap' && (
                              <div className="absolute inset-0 rounded-b-none pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(0,80,40,0.07), rgba(99,102,241,0.04), rgba(252,211,77,0.04))', mixBlendMode: 'multiply' }} />
                            )}
                            {viewMode !== 'raw' && analysisResult.heatmapPoints.map(point => {
                              const isSelected = selectedHotspot?.id === point.id;
                              const isCritical = point.severity === 'critical' || point.severity === 'high';
                              const col = isCritical ? '#F43F5E' : '#00C966';
                              return (
                                <div
                                  key={point.id}
                                  onClick={() => setSelectedHotspot(point)}
                                  style={{
                                    left: `${point.x}%`, top: `${point.y}%`,
                                    width: `${point.width}%`, height: `${point.height}%`,
                                    position: 'absolute',
                                    border: `1.5px solid ${col}`,
                                    background: `${col}12`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isSelected ? `0 0 16px ${col}50` : 'none',
                                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                                    zIndex: isSelected ? 20 : 10,
                                  }}
                                  className="flex items-start justify-start p-1"
                                >
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded whitespace-nowrap" style={{ background: col, color: '#FFFFFF', marginTop: '-14px', marginLeft: '-4px' }}>
                                    {point.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Hotspot detail */}
                          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-5">
                            <div className="sm:col-span-5 space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Select Hotspot</span>
                              <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                                {analysisResult.heatmapPoints.map(point => {
                                  const isSelected = selectedHotspot?.id === point.id;
                                  const isCritical = point.severity === 'critical' || point.severity === 'high';
                                  const col = isCritical ? '#F43F5E' : '#00C966';
                                  return (
                                    <button
                                      key={point.id}
                                      onClick={() => setSelectedHotspot(point)}
                                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-[12px] font-bold cursor-pointer transition-all"
                                      style={isSelected
                                        ? { background: `${col}0F`, border: `1px solid ${col}30`, color: col }
                                        : { background: 'rgba(0,60,30,0.03)', border: '1px solid rgba(0,60,30,0.05)', color: 'var(--text-muted)' }
                                      }
                                    >
                                      <span className="truncate">{point.label}</span>
                                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ background: `${col}15`, color: col }}>
                                        {point.confidence}%
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="sm:col-span-7">
                              {selectedHotspot ? (() => {
                                const isCritical = selectedHotspot.severity === 'critical' || selectedHotspot.severity === 'high';
                                const col = isCritical ? '#F43F5E' : '#00C966';
                                return (
                                  <div className="h-full rounded-xl p-5 space-y-3 relative overflow-hidden" style={{ background: `${col}08`, border: `1px solid ${col}20` }}>
                                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, ${col}, transparent)` }} />
                                    <div className="flex items-start justify-between gap-3 pt-1">
                                      <div>
                                        <span className="font-extrabold text-[14px] block" style={{ color: 'var(--text-primary)' }}>{selectedHotspot.label}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>{selectedHotspot.category}</span>
                                      </div>
                                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0" style={{ background: `${col}15`, color: col }}>
                                        {selectedHotspot.confidence}% conf.
                                      </span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{selectedHotspot.description}</p>
                                  </div>
                                );
                              })() : (
                                <div className="h-full rounded-xl p-5 flex items-center justify-center text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}>
                                  <div className="space-y-1">
                                    <Maximize2 className="w-6 h-6 mx-auto" style={{ color: 'var(--text-dim)' }} />
                                    <p className="text-[12px] font-bold" style={{ color: 'var(--text-dim)' }}>Click a hotspot to inspect</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── NLP REVIEW FORENSICS ─────────────────────── */}
                      {analysisResult.reviewText && (
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid rgba(129,140,248,0.12)' }}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5" style={{ borderBottom: '1px solid rgba(129,140,248,0.08)' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)' }}>
                                <FileText className="w-4 h-4" style={{ color: '#6366F1' }} />
                              </div>
                              <div>
                                <h3 className="text-[14px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>NLP Linguistic Forensics</h3>
                                <p className="text-[11px] font-bold font-mono" style={{ color: 'var(--text-dim)' }}>{analysisResult.reviewText.length} chars · review authenticity analysis</p>
                              </div>
                            </div>
                            <span
                              className="self-start sm:self-auto text-[11px] font-black px-3 py-1.5 rounded-full"
                              style={
                                analysisResult.fakeReviewProbability > 50
                                  ? { background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.25)', color: '#F43F5E' }
                                  : { background: 'rgba(0,80,40,0.08)', border: '1px solid rgba(0,160,70,0.18)', color: 'var(--green-accent-from)' }
                              }
                            >
                              {analysisResult.fakeReviewProbability > 50 ? '⚠ High Synthetic Risk' : '✓ Likely Organic'}
                            </span>
                          </div>

                          <div className="p-6 sm:p-8 space-y-6">
                            {/* Review Quote */}
                            <div className="relative rounded-xl p-5" style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.1)' }}>
                              <div className="absolute top-4 left-5 text-4xl font-serif leading-none select-none" style={{ color: 'rgba(129,140,248,0.3)' }}>"</div>
                              <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#6366F1' }}>Analyzed Review</div>
                              <p className="text-[13px] italic leading-relaxed pl-1 pr-4" style={{ color: 'var(--text-secondary)' }}>
                                {analysisResult.reviewText}
                              </p>
                            </div>

                            {/* Synthetic probability */}
                            <div className="p-5 rounded-xl space-y-4" style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.1)' }}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[13px] font-black" style={{ color: 'var(--text-primary)' }}>Bot / Synthetic Probability</span>
                                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>How likely this review was AI- or bot-generated</p>
                                </div>
                                <span className="text-3xl font-black font-mono" style={{ color: analysisResult.fakeReviewProbability > 50 ? '#F43F5E' : '#6366F1' }}>
                                  {analysisResult.fakeReviewProbability}%
                                </span>
                              </div>
                              <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,60,30,0.05)' }}>
                                <div
                                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                                  style={{
                                    width: `${analysisResult.fakeReviewProbability}%`,
                                    background: analysisResult.fakeReviewProbability > 50
                                      ? 'linear-gradient(90deg, #DC2626, #F43F5E)'
                                      : 'linear-gradient(90deg, #6366F1, #6366F1)',
                                    boxShadow: `0 0 10px ${analysisResult.fakeReviewProbability > 50 ? 'rgba(251,113,133,0.5)' : 'rgba(129,140,248,0.5)'}`,
                                  }}
                                />
                                <div className="absolute top-0 left-1/2 w-px h-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                              </div>
                              <div className="flex justify-between text-[10px] font-bold" style={{ color: 'var(--text-dim)' }}>
                                <span>Organic</span>
                                <span>50% threshold</span>
                                <span>Synthetic</span>
                              </div>

                              {analysisResult.reviewFlags && analysisResult.reviewFlags.length > 0 && (
                                <div className="pt-3 space-y-2" style={{ borderTop: '1px solid rgba(129,140,248,0.1)' }}>
                                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Detected Flags</span>
                                  {analysisResult.reviewFlags.map((flag, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl text-[12px]" style={
                                      flag.severity === 'high'
                                        ? { background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(251,113,133,0.15)' }
                                        : { background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(252,211,77,0.15)' }
                                    }>
                                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: flag.severity === 'high' ? '#F43F5E' : '#F59E0B' }} />
                                      <div>
                                        <span className="font-black" style={{ color: 'var(--text-primary)' }}>{flag.type}: </span>
                                        <span style={{ color: 'var(--text-muted)' }}>{flag.explanation}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {(!analysisResult.reviewFlags || analysisResult.reviewFlags.length === 0) && (
                                <div className="pt-3" style={{ borderTop: '1px solid rgba(0,80,40,0.07)' }}>
                                  <div className="flex items-center gap-2 text-[12px] font-bold p-3 rounded-xl" style={{ background: 'rgba(0,80,40,0.06)', border: '1px solid rgba(0,80,40,0.1)', color: 'var(--green-accent-from)' }}>
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>No synthetic patterns detected — organic human phrasing verified</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Notes + Recommendations */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,60,30,0.05)' }}>
                                <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                  <Layers className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>AI Linguistic Notes</span>
                                </div>
                                <ul className="p-5 space-y-3">
                                  {analysisResult.xaiReasoning.map((reason, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5" style={{ background: 'rgba(0,60,30,0.05)', color: 'var(--text-dim)' }}>{idx + 1}</span>
                                      <span className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,80,40,0.08)' }}>
                                <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,80,40,0.07)', background: 'rgba(0,160,70,0.03)' }}>
                                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--green-accent-from)' }}>AI Recommendations</span>
                                </div>
                                <ul className="p-5 space-y-3">
                                  {analysisResult.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--green-accent-from)' }} />
                                      <span className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── IMAGE-ONLY findings ──────────────────────── */}
                      {analysisResult.imageUrl && !analysisResult.reviewText && (
                        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.07)' }}>
                          <div className="flex items-center gap-3 px-6 sm:px-8 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,80,40,0.1)' }}>
                              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                            </div>
                            <div>
                              <h3 className="text-[14px] font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Visual Craftsmanship & Next Steps</h3>
                              <p className="text-[11px] font-bold font-mono" style={{ color: 'var(--text-dim)' }}>Key inspection findings</p>
                            </div>
                          </div>
                          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,60,30,0.05)' }}>
                              <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                <Layers className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Key Inspection Findings</span>
                              </div>
                              <ul className="p-5 space-y-3">
                                {analysisResult.xaiReasoning.map((reason, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5" style={{ background: 'rgba(0,60,30,0.05)', color: 'var(--text-dim)' }}>{idx + 1}</span>
                                    <span className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,80,40,0.08)' }}>
                              <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,80,40,0.07)', background: 'rgba(0,160,70,0.03)' }}>
                                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--green-accent-from)' }}>Recommended Next Steps</span>
                              </div>
                              <ul className="p-5 space-y-3">
                                {analysisResult.recommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--green-accent-from)' }} />
                                    <span className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

            ) : (
              /* Empty State */
              <div
                className="p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-5 min-h-[460px] relative overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.06)' }}
              >
                <div className="absolute inset-0 hex-grid-bg opacity-40 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none animate-breathe" style={{ background: 'rgba(0,160,70,0.03)' }} />
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center animate-glow-pulse"
                  style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,160,70,0.15)' }}
                >
                  <VeriLensIcon className="w-10 h-10" style={{ color: 'var(--green-accent-from)' }} />
                </div>
                <div className="space-y-2 max-w-sm relative z-10">
                  <h3 className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Ready for AI Verification</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Select a preset or upload your own fashion item to run real-time multimodal visual & NLP inspection.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 relative z-10 mt-2">
                  {[
                    { icon: ScanLine, label: 'Visual Analysis' },
                    { icon: Brain, label: 'NLP Forensics' },
                    { icon: Lock, label: 'Encrypted Hash' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,160,70,0.05)', border: '1px solid rgba(0,80,40,0.08)', color: 'var(--text-muted)' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: 'var(--green-accent-from)' }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && analysisResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(0,40,20,0.08)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl p-8 sm:p-10 space-y-7 animate-fade-in"
            style={{ background: 'var(--bg-surface-2)', border: '1px solid rgba(0,80,40,0.1)', boxShadow: '0 40px 100px rgba(0,40,20,0.08), 0 0 60px rgba(0,80,40,0.07)' }}
          >
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 pb-6" style={{ borderBottom: '1px solid rgba(0,80,40,0.07)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto animate-glow-pulse" style={{ background: 'rgba(0,80,40,0.08)', border: '1px solid rgba(0,160,70,0.18)' }}>
                <ShieldCheck className="w-8 h-8" style={{ color: 'var(--green-accent-from)' }} />
              </div>
              <h2 className="text-3xl font-extrabold italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>VeriStyle Certificate</h2>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Digital Fashion Provenance Seal</p>
            </div>

            <div className="space-y-3 text-[13px]">
              {[
                { label: 'Item Name', value: analysisResult.itemName },
                { label: 'Brand / Manufacturer', value: analysisResult.brand },
                { label: 'Verification Verdict', value: `${analysisResult.verdict} (${analysisResult.trustScore}%)`, highlight: true, score: analysisResult.trustScore },
                { label: 'Blockchain Hash', value: analysisResult.verificationHash, mono: true },
              ].map(({ label, value, highlight, score, mono }) => (
                <div key={label} className="flex justify-between items-center p-4 rounded-xl" style={{ background: 'rgba(0,60,30,0.03)', border: '1px solid rgba(0,60,30,0.05)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}:</span>
                  <span
                    className={mono ? 'font-mono' : 'font-bold'}
                    style={{
                      color: highlight
                        ? (score && score >= 80 ? 'var(--green-accent-from)' : '#F43F5E')
                        : mono ? '#6366F1' : 'var(--text-primary)',
                      fontWeight: highlight || mono ? 800 : 600,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl flex items-center justify-between" style={{ background: 'rgba(0,160,70,0.05)', border: '1px solid rgba(0,80,40,0.1)' }}>
              <div>
                <p className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>Scan QR for Online Verification</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Immutable record stored in VeriStyle Vault</p>
              </div>
              <div className="w-14 h-14 rounded-xl p-1.5 flex items-center justify-center" style={{ background: 'white' }}>
                <QrCode className="w-full h-full text-black" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer btn-neon"
              >
                <Download className="w-4 h-4" />
                Print / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
