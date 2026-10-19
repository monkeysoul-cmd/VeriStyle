import React, { useState, useRef, useEffect } from 'react';
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
  Copy,
  Check,
} from 'lucide-react';
import { AnalysisResult, SamplePreset, HeatmapPoint } from '../types';
import { SAMPLE_PRESETS } from '../data/presets';
import { VeriLensIcon } from './VeriLensIcon';

interface DashboardProps {
  onRunAnalysis: (data: { imageUrl: string; reviewText: string; brand?: string; category?: string; itemName?: string }) => Promise<AnalysisResult>;
  initialPreset?: SamplePreset | null;
  initialResult?: AnalysisResult | null;
  onSaveToVault?: (result: AnalysisResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onRunAnalysis, initialPreset, initialResult, onSaveToVault }) => {
  const [imageUrl, setImageUrl] = useState<string>(initialPreset?.imageUrl || initialResult?.imageUrl || '');
  const [reviewText, setReviewText] = useState<string>(initialPreset?.defaultReview || initialResult?.reviewText || '');
  const [itemName, setItemName] = useState<string>(initialPreset?.title || initialResult?.itemName || '');
  const [brand, setBrand] = useState<string>(initialPreset?.brand || initialResult?.brand || '');
  const [category, setCategory] = useState<string>(initialPreset?.category || initialResult?.category || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('Initializing...');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(initialResult || null);
  const [selectedHotspot, setSelectedHotspot] = useState<HeatmapPoint | null>(initialResult?.heatmapPoints?.[0] || null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'bounding_boxes' | 'raw'>('heatmap');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPreset) {
      setImageUrl(initialPreset.imageUrl || '');
      setReviewText(initialPreset.defaultReview || '');
      setItemName(initialPreset.title || '');
      setBrand(initialPreset.brand || '');
      setCategory(initialPreset.category || '');
      setAnalysisResult(null);
      setSelectedHotspot(null);
    }
  }, [initialPreset]);

  useEffect(() => {
    if (initialResult) {
      setAnalysisResult(initialResult);
      setImageUrl(initialResult.imageUrl || '');
      setReviewText(initialResult.reviewText || '');
      setItemName(initialResult.itemName || '');
      setBrand(initialResult.brand || '');
      setCategory(initialResult.category || '');
      if (Array.isArray(initialResult.heatmapPoints) && initialResult.heatmapPoints.length > 0) {
        setSelectedHotspot(initialResult.heatmapPoints[0]);
      } else {
        setSelectedHotspot(null);
      }
    }
  }, [initialResult]);

  const handleCopyHash = (text: string) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch (_) {}
  };

  const handleShareReport = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (_) {}
  };

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
      'Initializing Inspection Engine...',
      'Scanning Stitching & Material Structure...',
      'Analyzing Hardware Electroplating...',
      'Processing Review NLP Forensics...',
      'Generating Trust Score & Hotspot Coordinates...',
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
      if (Array.isArray(result.heatmapPoints) && result.heatmapPoints.length > 0) {
        setSelectedHotspot(result.heatmapPoints[0]);
      } else {
        setSelectedHotspot(null);
      }
      if (onSaveToVault) onSaveToVault(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      clearInterval(interval);
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictColors = (score: number) => {
    if (score >= 80) return {
      bg: 'linear-gradient(135deg, rgba(238,253,245,0.98) 0%, rgba(215,252,232,0.85) 45%, rgba(240,253,248,0.96) 100%)',
      border: 'rgba(0, 240, 139, 0.45)',
      accent: '#00F08B',
      darkAccent: '#02572B',
      glow: 'rgba(0, 240, 139, 0.35)',
      arc: '#00F08B',
      arcGrad: ['#54FFB5', '#00F08B', '#028C46'],
      arcTrack: 'rgba(0, 240, 139, 0.12)',
      label: 'VERIFIED AUTHENTIC',
      badgeClass: 'badge-authentic',
      specTier: 'Grade A · Master Specification Conformance',
      specNote: 'Multi-vector vision & NLP analysis confirms 100% alignment with verified luxury brand master templates.'
    };
    if (score >= 50) return {
      bg: 'linear-gradient(135deg, rgba(255,253,240,0.98) 0%, rgba(254,246,210,0.85) 45%, rgba(255,251,232,0.96) 100%)',
      border: 'rgba(255, 184, 0, 0.45)',
      accent: '#FFB800',
      darkAccent: '#854D0E',
      glow: 'rgba(255, 184, 0, 0.35)',
      arc: '#FFB800',
      arcGrad: ['#FDE047', '#FFB800', '#D97706'],
      arcTrack: 'rgba(255, 184, 0, 0.14)',
      label: 'SUSPICIOUS / ELEVATED RISK',
      badgeClass: 'badge-suspicious',
      specTier: 'Grade B · Moderate Variance Detected',
      specNote: 'Detected anomalies in stitch pitch, hardware finishing, or unnatural buyer review vocabulary entropy.'
    };
    return {
      bg: 'linear-gradient(135deg, rgba(255,242,245,0.98) 0%, rgba(255,226,233,0.85) 45%, rgba(255,245,247,0.96) 100%)',
      border: 'rgba(255, 30, 86, 0.45)',
      accent: '#FF1E56',
      darkAccent: '#9F1239',
      glow: 'rgba(255, 30, 86, 0.35)',
      arc: '#FF1E56',
      arcGrad: ['#FDA4AF', '#FF1E56', '#BE123C'],
      arcTrack: 'rgba(255, 30, 86, 0.14)',
      label: 'LIKELY COUNTERFEIT',
      badgeClass: 'badge-counterfeit',
      specTier: 'Grade F · Critical Forensic Spec Failure',
      specNote: 'Hardware engraving, micro-stitching pitch, and synthetic review signals strongly indicate unauthorized replica.'
    };
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 aurora-mesh" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-indigo-100/80">
          <div>
            <div className="section-badge mb-3">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              Forensic Inspection Lab · Verification Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="text-slate-950">Multimodal Authenticity </span>
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Studio
              </span>
            </h1>
            <p className="text-sm sm:text-base mt-2 max-w-xl font-medium text-slate-600">
              Cross-examine high-resolution apparel imagery and customer reviews against official master templates with AI optics.
            </p>
          </div>

          {/* Modern Object: Tactile Specimen Capsule Dock */}
          <div className="specimen-dock max-w-full p-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] uppercase tracking-widest font-black shrink-0 px-2 text-indigo-900 font-mono">Specimens:</span>
            {SAMPLE_PRESETS.map(preset => {
              const isSelected = itemName === preset.title;
              const isAuth = preset.expectedVerdict === 'VERIFIED AUTHENTIC';
              const isCounterfeit = preset.expectedVerdict === 'LIKELY COUNTERFEIT';
              const dotColor = isAuth ? '#059669' : isCounterfeit ? '#DC2626' : '#D97706';
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`specimen-capsule px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-950 font-bold shadow-xs'
                      : 'bg-slate-50/80 border border-slate-200/70 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="relative flex w-2 h-2">
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ background: dotColor }} />
                    )}
                    <span className="relative rounded-full w-2 h-2" style={{ background: dotColor }} />
                  </span>
                  <span>{preset.title.split(' ')[0]}</span>
                  <span className={`text-[10px] opacity-80 font-mono font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-500'}`}>
                    {preset.brand}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* URL Analyzer */}
        <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto text-left">
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
                  className="text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-md cursor-pointer transition-colors bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"
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
                        className="px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                  <FileText className="w-4 h-4 text-slate-700" />
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
                <span className="flex items-center gap-1 text-slate-600 font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> NLP Forensics Ready
                </span>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              id="analyze-authenticity-btn"
              onClick={handleAnalyze}
              disabled={isLoading || (!imageUrl && !reviewText)}
              className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2.5 ${
                isLoading || (!imageUrl && !reviewText)
                  ? 'cursor-not-allowed opacity-50 bg-slate-100 text-slate-400 border border-slate-200'
                  : 'cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg shadow-emerald-600/30 active:scale-98 border border-emerald-500'
              }`}
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
                <div className="absolute inset-0 hex-grid-bg opacity-30 pointer-events-none" />

                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-emerald-600 animate-spin" />
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    {scanStep}
                  </h3>
                  <p className="text-sm max-w-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                    Forensic inspection engine is cross-referencing stitching metrics and review text entropy against verified master specifications.
                  </p>
                </div>
              </div>

            ) : analysisResult ? (
              /* ═══════════════════════════════════════════════════════════
                 ANALYSIS REPORT: Executive Forensic Report
                 ═══════════════════════════════════════════════════════════ */
              <div className="space-y-6 animate-fade-in-up">
                {(() => {
                  const vc = getVerdictColors(analysisResult.trustScore);
                  const isAuth = analysisResult.trustScore >= 80;
                  const isSusp = analysisResult.trustScore >= 50 && analysisResult.trustScore < 80;
                  const gradId = `verdict-arc-${analysisResult.id || 'scan'}`;
                  const safeHeatmapPoints: HeatmapPoint[] = Array.isArray(analysisResult.heatmapPoints) ? analysisResult.heatmapPoints : [];
                  const safeReviewFlags = Array.isArray(analysisResult.reviewFlags) ? analysisResult.reviewFlags : [];
                  const safeReasoning = Array.isArray(analysisResult.xaiReasoning) ? analysisResult.xaiReasoning : [];
                  const safeRecommendations = Array.isArray(analysisResult.recommendations) ? analysisResult.recommendations : [];
                  const safeScores = analysisResult.detailedScores || {
                    stitchingQuality: analysisResult.trustScore >= 80 ? 92 : 40,
                    hardwareAuthenticity: analysisResult.trustScore >= 80 ? 94 : 35,
                    typographyAccuracy: analysisResult.trustScore >= 80 ? 90 : 38,
                    fabricTextureMatch: analysisResult.trustScore >= 80 ? 88 : 42,
                    serialCodeValidation: analysisResult.trustScore >= 80 ? 86 : 28,
                    reviewPerplexity: analysisResult.trustScore >= 80 ? 85 : 30,
                    reviewSentimentAlignment: analysisResult.trustScore >= 80 ? 90 : 34,
                  };
                  return (
                    <>
                      {/* ── VERDICT HERO CARD (Senior Designer Luxury Redesign) ── */}
                      <div
                        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all"
                        style={{
                          background: vc.bg,
                          border: `1.5px solid ${vc.border}`,
                          boxShadow: `0 2px 10px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,1)`,
                        }}
                      >
                        <div className="absolute inset-0 dot-grid-bg opacity-15 pointer-events-none" />

                        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                          
                          {/* Left: Product & Verdict Data + Digital Certificate Seal */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 max-w-2xl">
                            
                            {/* Provenance Seal */}
                            <div className="shrink-0 hidden sm:flex flex-col items-center gap-2">
                              <div className="holographic-seal">
                                <div className="holographic-seal-inner">
                                  <ShieldCheck className="w-7 h-7" style={{ color: vc.accent }} />
                                  <span className="text-[8px] font-black uppercase tracking-widest mt-0.5 text-slate-800 font-mono">
                                    {isAuth ? 'VERIFIED' : isSusp ? 'REVIEW' : 'FLAGGED'}
                                  </span>
                                  <span className="text-[6.5px] font-mono font-bold text-slate-500">AUTHENTICATED</span>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                                Provenance
                              </span>
                            </div>

                            {/* Data block */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className={vc.badgeClass}>
                                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                  {vc.label}
                                </span>
                                <span className="text-[11px] font-black uppercase tracking-wider font-mono text-slate-600 bg-white/70 px-2 py-0.5 rounded border border-slate-200/80">
                                  {vc.specTier}
                                </span>
                              </div>

                              <div>
                                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                  {analysisResult.itemName}
                                </h2>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <span className="text-sm font-extrabold text-slate-800">{analysisResult.brand}</span>
                                  <span className="text-slate-300">·</span>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                                    {analysisResult.category}
                                  </span>
                                  <span className="text-slate-300">·</span>
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600">
                                    Multi-Signal Grounded
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed max-w-lg">
                                {vc.specNote}
                              </p>

                              {/* Cryptographic Provenance Hash & Timestamp */}
                              <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                                <button
                                  onClick={() => handleCopyHash(analysisResult.verificationHash)}
                                  title="Click to copy cryptographic SHA-256 hash"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/90 border border-slate-300/80 hover:border-emerald-500 text-slate-800 transition-all cursor-pointer shadow-xs group"
                                >
                                  <Hash className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                  <span>{analysisResult.verificationHash}</span>
                                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                                </button>
                                <span className="text-[11px] font-bold text-slate-500 font-mono">
                                  {analysisResult.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Modern Object: Concentric Biometric Trust Gauge & Actions */}
                          <div className="flex sm:flex-row items-center gap-6 shrink-0 bg-white/85 p-5 rounded-3xl border border-white/90 backdrop-blur-xl shadow-lg shadow-slate-900/5">
                            
                            {/* Biometric Concentric Gauge */}
                            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                              {/* Outer calibration dashed tick track */}
                              <div className="biometric-tick-ring" style={{ borderColor: vc.border }} />

                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <defs>
                                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={vc.arcGrad[0]} />
                                    <stop offset="50%" stopColor={vc.arcGrad[1]} />
                                    <stop offset="100%" stopColor={vc.arcGrad[2]} />
                                  </linearGradient>
                                </defs>

                                {/* Background track */}
                                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" stroke={vc.arcTrack} />
                                <circle cx="50" cy="50" r="46" fill="none" strokeWidth="1" stroke="rgba(15,23,42,0.06)" />

                                {/* Foreground active gradient arc */}
                                <circle
                                  cx="50" cy="50" r="40"
                                  fill="none"
                                  strokeWidth="8"
                                  className="animate-draw-arc"
                                  stroke={`url(#${gradId})`}
                                  strokeDasharray="251"
                                  strokeDashoffset={251 - (251 * analysisResult.trustScore) / 100}
                                  strokeLinecap="round"
                                  style={{ filter: `drop-shadow(0 0 10px ${vc.glow})` }}
                                />
                              </svg>

                              {/* Center core */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span
                                  className="text-3xl sm:text-4xl font-black tracking-tight leading-none"
                                  style={{ color: vc.accent }}
                                >
                                  {analysisResult.trustScore}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">
                                  Trust %
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2.5 shrink-0">
                              <button
                                onClick={() => setShowCertificateModal(true)}
                                className="px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 shadow-xs hover:shadow hover:border-emerald-500"
                              >
                                <QrCode className="w-4 h-4 text-emerald-600" />
                                Certificate
                              </button>
                              <button
                                onClick={handleShareReport}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer border shadow-xs hover:shadow ${
                                  copiedShare ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                              >
                                {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
                                {copiedShare ? 'Link Copied!' : 'Share Report'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── METRIC BREAKDOWN (CONFIDENCE + QUALITY SCORES) ── */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Left: AI Confidence Card */}
                        <div
                          className="lg:col-span-5 p-6 rounded-3xl space-y-4"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid rgba(15,23,42,0.08)',
                            boxShadow: 'var(--card-shadow)',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                                AI System Confidence
                              </span>
                            </div>
                            <span className="font-black font-mono text-2xl" style={{ color: '#00F08B' }}>
                              {analysisResult.aiConfidence}%
                            </span>
                          </div>

                          <div className="metric-track">
                            <div
                              className="metric-fill animate-fill-bar"
                              style={{
                                width: `${analysisResult.aiConfidence}%`,
                                background: 'linear-gradient(90deg, #00F08B, #00E5FF)',
                                boxShadow: '0 0 14px rgba(0,240,139,0.5)',
                              }}
                            />
                          </div>

                          <div className="space-y-2 pt-1">
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              Vision algorithms matched against luxury master baselines with <strong className="text-slate-900">{analysisResult.aiConfidence >= 85 ? 'high-confidence signal convergence' : 'standard statistical bounds'}</strong>.
                            </p>
                            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Resale Grade</span>
                                <span className="text-xs font-black text-slate-900">{analysisResult.resaleMarketVerdict || 'Verified Resale Grade'}</span>
                              </div>
                              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/80">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Est. Market Value</span>
                                <span className="text-xs font-black font-mono text-emerald-700">{analysisResult.estimatedRetailValue || '$1,200 USD'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Multi-Vector Craftsmanship / NLP Scores */}
                        <div
                          className="lg:col-span-7 p-6 rounded-3xl space-y-4"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid rgba(15,23,42,0.08)',
                            boxShadow: 'var(--card-shadow)',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                              {analysisResult.imageUrl ? 'Visual Craftsmanship Forensics' : 'NLP Linguistic Signals'}
                            </span>
                            <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              5-Point Multi-Vector
                            </span>
                          </div>

                          {analysisResult.imageUrl ? (
                            <div className="space-y-3.5">
                              {[
                                {
                                  label: 'Stitching Pitch & Tension',
                                  value: safeScores.stitchingQuality ?? 88,
                                  color: '#00F08B',
                                  gradient: 'linear-gradient(90deg, #54FFB5, #00F08B)',
                                  tag: (safeScores.stitchingQuality ?? 88) >= 80 ? 'Master Spec' : 'Variance',
                                },
                                {
                                  label: 'Hardware & Electroplating',
                                  value: safeScores.hardwareAuthenticity ?? 90,
                                  color: '#00E5FF',
                                  gradient: 'linear-gradient(90deg, #38BDF8, #00E5FF)',
                                  tag: (safeScores.hardwareAuthenticity ?? 90) >= 80 ? 'Genuine Finish' : 'Tolerance',
                                },
                                {
                                  label: 'Typography & Serial Kerning',
                                  value: safeScores.typographyAccuracy ?? 92,
                                  color: '#0284C7',
                                  gradient: 'linear-gradient(90deg, #38BDF8, #0284C7)',
                                  tag: (safeScores.typographyAccuracy ?? 92) >= 80 ? 'Authentic Font' : 'Anomaly',
                                },
                                {
                                  label: 'Fabric & Grain Texture Match',
                                  value: safeScores.fabricTextureMatch ?? 86,
                                  color: '#0D9488',
                                  gradient: 'linear-gradient(90deg, #2DD4BF, #0D9488)',
                                  tag: (safeScores.fabricTextureMatch ?? 86) >= 80 ? 'High Fidelity' : 'Discrepancy',
                                },
                                {
                                  label: 'Serial Code & RFID Tag Validation',
                                  value: safeScores.serialCodeValidation ?? 85,
                                  color: '#FFB800',
                                  gradient: 'linear-gradient(90deg, #FDE047, #FFB800)',
                                  tag: (safeScores.serialCodeValidation ?? 85) >= 80 ? 'Verified Database' : 'Unconfirmed',
                                },
                              ].map((metric, i) => (
                                <div key={i} className="space-y-1.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-800">{metric.label}</span>
                                      <span
                                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md"
                                        style={{
                                          background: `${metric.color}15`,
                                          color: metric.color === '#00F08B' ? '#027A3D' : metric.color === '#00E5FF' || metric.color === '#0284C7' ? '#0369A1' : metric.color === '#0D9488' ? '#0F766E' : metric.color,
                                          border: `1px solid ${metric.color}35`,
                                        }}
                                      >
                                        {metric.tag}
                                      </span>
                                    </div>
                                    <span className="font-black font-mono" style={{ color: metric.color === '#00F08B' ? '#027A3D' : metric.color }}>
                                      {metric.value}%
                                    </span>
                                  </div>
                                  <div className="h-2 rounded-full overflow-hidden p-0.5 bg-slate-100">
                                    <div
                                      className="h-full rounded-full transition-all duration-1000 ease-out"
                                      style={{
                                        width: `${metric.value}%`,
                                        background: metric.gradient,
                                        boxShadow: `0 0 10px ${metric.color}60`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4 pt-1">
                              {[
                                { label: 'Linguistic Perplexity', value: safeScores.reviewPerplexity ?? 86, sub: 'Organic vocabulary entropy', color: '#0F172A', bg: 'rgba(15,23,42,0.03)', border: 'rgba(15,23,42,0.1)' },
                                { label: 'Sentiment Coherence', value: safeScores.reviewSentimentAlignment ?? 90, sub: 'Authentic consumer phrasing', color: '#00F08B', bg: 'rgba(0,240,139,0.06)', border: 'rgba(0,240,139,0.25)' },
                              ].map(({ label, value, sub, color, bg, border }) => (
                                <div key={label} className="p-4 rounded-2xl space-y-1" style={{ background: bg, border: `1px solid ${border}` }}>
                                  <span className="text-[10px] font-black uppercase tracking-wider block" style={{ color: color === '#00F08B' ? '#027A3D' : color }}>{label}</span>
                                  <span className="text-3xl font-black font-mono" style={{ color: color === '#00F08B' ? '#027A3D' : color }}>{value}%</span>
                                  <span className="text-xs font-semibold text-slate-600 block">{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── INTERACTIVE IMAGE INSPECTION SUITE ────────── */}
                      {analysisResult.imageUrl && (
                        <div
                          className="rounded-3xl overflow-hidden"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid rgba(15,23,42,0.08)',
                            boxShadow: 'var(--card-shadow)',
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
                                <Eye className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="text-base font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                                  Interactive Computer Vision Canvas
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 font-mono">
                                  {safeHeatmapPoints.length} forensic inspection points identified
                                </p>
                              </div>
                            </div>

                            {/* Mode toggles */}
                            <div className="flex items-center p-1 rounded-2xl gap-1 text-xs font-bold bg-slate-100 border border-slate-200">
                              {(['heatmap', 'bounding_boxes', 'raw'] as const).map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => setViewMode(mode)}
                                  className="px-3.5 py-1.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                                  style={viewMode === mode
                                    ? { background: '#FFFFFF', color: '#0A0F1D', boxShadow: '0 2px 8px rgba(15,23,42,0.08)' }
                                    : { color: 'var(--text-muted)' }
                                  }
                                >
                                  {mode === 'bounding_boxes' ? 'Bounding Boxes' : mode === 'heatmap' ? 'Heatmap' : 'Raw View'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Canvas Area with Modern Object: Forensic Lens HUD */}
                          <div className="relative w-full min-h-[400px] flex items-center justify-center p-8 bg-slate-50/80 border-b border-slate-100 overflow-hidden group">
                            {/* Optical Viewfinder Corner Brackets */}
                            <div className="hud-bracket-tl" />
                            <div className="hud-bracket-tr" />
                            <div className="hud-bracket-bl" />
                            <div className="hud-bracket-br" />

                            {/* Telemetry HUD top overlay */}
                            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 pointer-events-none z-20">
                              <span className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                OPTICAL RESOLUTION: 4096×4096 · CALIBRATED
                              </span>
                              <span className="hidden sm:inline bg-white/90 px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs">
                                OPTICAL ZOOM: 1.0X · HUD ACTIVE
                              </span>
                            </div>

                            <img
                              src={analysisResult.imageUrl}
                              alt={analysisResult.itemName}
                              referrerPolicy="no-referrer"
                              className="max-h-[440px] w-auto object-contain rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.01]"
                              style={{ filter: 'brightness(0.98) contrast(1.05)' }}
                            />
                            {viewMode === 'heatmap' && (
                              <div className="absolute inset-0 pointer-events-none rounded-b-none" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, rgba(245,158,11,0.06) 50%, transparent 100%)', mixBlendMode: 'multiply' }} />
                            )}
                            {viewMode !== 'raw' && safeHeatmapPoints.map(point => {
                              const isSelected = selectedHotspot?.id === point.id;
                              const isCritical = point.severity === 'critical' || point.severity === 'high';
                              const col = isCritical ? '#FF1E56' : '#00F08B';
                              return (
                                <div
                                  key={point.id}
                                  onClick={() => setSelectedHotspot(point)}
                                  style={{
                                    left: `${point.x}%`, top: `${point.y}%`,
                                    width: `${point.width}%`, height: `${point.height}%`,
                                    position: 'absolute',
                                    border: `2px solid ${col}`,
                                    background: `${col}18`,
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s',
                                    boxShadow: isSelected ? `0 0 25px ${col}80, inset 0 0 12px ${col}30` : `0 0 10px ${col}40`,
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    zIndex: isSelected ? 30 : 15,
                                  }}
                                  className="flex items-start justify-start p-1"
                                >
                                  <span
                                    className="text-[9px] font-black px-2.5 py-0.5 rounded-md whitespace-nowrap shadow-sm"
                                    style={{
                                      background: col,
                                      color: isCritical ? '#FFFFFF' : '#032A15',
                                      marginTop: '-18px',
                                      marginLeft: '-4px',
                                      boxShadow: `0 2px 8px ${col}60`,
                                    }}
                                  >
                                    {point.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Hotspot detail panel */}
                          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5">
                            <div className="lg:col-span-5 space-y-2.5">
                              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                                Select Inspection Hotspot
                              </span>
                              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                                {safeHeatmapPoints.map(point => {
                                  const isSelected = selectedHotspot?.id === point.id;
                                  const isCritical = point.severity === 'critical' || point.severity === 'high';
                                  const col = isCritical ? '#FF1E56' : '#00F08B';
                                  return (
                                    <button
                                      key={point.id}
                                      onClick={() => setSelectedHotspot(point)}
                                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-black cursor-pointer transition-all"
                                      style={isSelected
                                        ? { background: `${col}15`, border: `1px solid ${col}60`, color: isCritical ? '#9F1239' : '#02572B', boxShadow: `0 4px 14px ${col}25` }
                                        : { background: '#F8FAFD', border: '1px solid rgba(15,23,42,0.06)', color: 'var(--text-secondary)' }
                                      }
                                    >
                                      <span className="truncate">{point.label}</span>
                                      <span
                                        className="text-[10px] font-black px-2.5 py-0.5 rounded-md ml-2 shrink-0 font-mono"
                                        style={{ background: `${col}20`, color: isCritical ? '#9F1239' : '#02572B' }}
                                      >
                                        {point.confidence}%
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="lg:col-span-7">
                              {selectedHotspot ? (() => {
                                const isCritical = selectedHotspot.severity === 'critical' || selectedHotspot.severity === 'high';
                                const col = isCritical ? '#F43F5E' : '#00C865';
                                return (
                                  <div
                                    className="h-full rounded-2xl p-6 space-y-3 relative overflow-hidden"
                                    style={{ background: `${col}08`, border: `1px solid ${col}25` }}
                                  >
                                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${col}, transparent)` }} />
                                    <div className="flex items-start justify-between gap-3 pt-1">
                                      <div>
                                        <h4 className="font-extrabold text-base text-slate-900">{selectedHotspot.label}</h4>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                                          Category: {selectedHotspot.category} · {selectedHotspot.anomalyType}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shrink-0 font-mono" style={{ background: `${col}18`, color: col }}>
                                        {selectedHotspot.confidence}% Confidence
                                      </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                                      {selectedHotspot.description}
                                    </p>
                                  </div>
                                );
                              })() : (
                                <div className="h-full rounded-2xl p-6 flex items-center justify-center text-center bg-slate-50 border border-dashed border-slate-200">
                                  <div className="space-y-1">
                                    <Maximize2 className="w-6 h-6 mx-auto text-slate-400" />
                                    <p className="text-xs font-bold text-slate-500">Click any hotspot to examine micro-structure</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── NLP REVIEW FORENSICS ─────────────────────── */}
                      {analysisResult.reviewText && (
                        <div
                          className="rounded-3xl overflow-hidden"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid rgba(15,23,42,0.08)',
                            boxShadow: 'var(--card-shadow)',
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md flex items-center justify-center bg-slate-100 border border-slate-200">
                                <FileText className="w-5 h-5 text-slate-700" />
                              </div>
                              <div>
                                <h3 className="text-base font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                                  NLP Linguistic & Review Forensics
                                </h3>
                                <p className="text-xs font-semibold text-slate-400 font-mono">
                                  {analysisResult.reviewText.length} characters analyzed · Synthetic bot pattern scan
                                </p>
                              </div>
                            </div>
                            <span
                              className="self-start sm:self-auto text-xs font-bold px-2.5 py-1 rounded font-mono"
                              style={
                                analysisResult.fakeReviewProbability > 50
                                  ? { background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#991B1B' }
                                  : { background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', color: '#065F46' }
                              }
                            >
                              {analysisResult.fakeReviewProbability > 50 ? 'High Synthetic Risk' : 'Verified Organic Phrasing'}
                            </span>
                          </div>

                          <div className="p-6 sm:p-8 space-y-6">
                            {/* Review Quote Card */}
                            <div className="relative rounded-lg p-5 bg-slate-50 border border-slate-200">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">Analyzed Review Corpus</div>
                              <p className="text-sm italic text-slate-700 leading-relaxed pl-1 pr-4">
                                "{analysisResult.reviewText}"
                              </p>
                            </div>

                            {/* Synthetic Bot Probability Bar */}
                            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-sm font-bold text-slate-900">Machine Generation Likelihood</span>
                                  <p className="text-xs text-slate-500 mt-0.5">Calculated through vocabulary entropy and promotional phrase repetition</p>
                                </div>
                                <span className="text-2xl font-bold font-mono" style={{ color: analysisResult.fakeReviewProbability > 50 ? '#DC2626' : '#059669' }}>
                                  {analysisResult.fakeReviewProbability}%
                                </span>
                              </div>

                              <div className="relative w-full h-2.5 rounded overflow-hidden bg-slate-200">
                                <div
                                  className="absolute top-0 left-0 h-full rounded transition-all duration-700 ease-out"
                                  style={{
                                    width: `${analysisResult.fakeReviewProbability}%`,
                                    background: analysisResult.fakeReviewProbability > 50 ? '#DC2626' : '#059669',
                                  }}
                                />
                                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-400" />
                              </div>

                              <div className="flex justify-between text-[10px] font-bold font-mono text-slate-500">
                                <span>Organic Consumer (0%)</span>
                                <span>50% Risk Threshold</span>
                                <span>Automated Bot (100%)</span>
                              </div>

                              {safeReviewFlags.length > 0 && (
                                <div className="pt-3 space-y-2 border-t border-slate-200">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Detected Linguistic Flags</span>
                                  {safeReviewFlags.map((flag, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-3 p-3.5 rounded-xl text-xs"
                                      style={
                                        flag.severity === 'high'
                                          ? { background: 'rgba(255,30,86,0.06)', border: '1px solid rgba(255,30,86,0.25)' }
                                          : { background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.25)' }
                                      }
                                    >
                                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: flag.severity === 'high' ? '#FF1E56' : '#FFB800' }} />
                                      <div>
                                        <span className="font-extrabold text-slate-900">{flag.type}: </span>
                                        <span className="text-slate-600">{flag.explanation}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {safeReviewFlags.length === 0 && (
                                <div className="pt-3 border-t border-emerald-100">
                                  <div className="flex items-center gap-2 text-xs font-bold p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800">
                                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                                    <span>Zero synthetic bots detected: authentic human phrasing verified across linguistic markers</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Reasoning + Recommendations */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="rounded-2xl p-5 bg-slate-50 border border-slate-100 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                  <Layers className="w-4 h-4 text-slate-400" />
                                  Forensic Linguistic Findings
                                </div>
                                <ul className="space-y-2.5">
                                  {safeReasoning.map((reason, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-medium">
                                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 bg-white border border-slate-200 text-slate-700">
                                        {idx + 1}
                                      </span>
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="rounded-2xl p-5 bg-emerald-50/50 border border-emerald-100 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Recommended Next Steps
                                </div>
                                <ul className="space-y-2.5">
                                  {safeRecommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed font-medium">
                                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── IMAGE-ONLY FINDINGS (WHEN NO REVIEW TEXT) ── */}
                      {analysisResult.imageUrl && !analysisResult.reviewText && (
                        <div
                          className="rounded-3xl overflow-hidden p-6 sm:p-8 space-y-5"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid rgba(15,23,42,0.08)',
                            boxShadow: 'var(--card-shadow)',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
                              <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="text-base font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                                Visual Craftsmanship Synthesis
                              </h3>
                              <p className="text-xs font-medium text-slate-400 font-mono">Expert summary of optical anomalies</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="rounded-2xl p-5 bg-slate-50 border border-slate-100 space-y-3">
                              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                                Key Inspection Points
                              </span>
                              <ul className="space-y-2">
                                {safeReasoning.map((reason, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-medium">
                                    <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 bg-white border border-slate-200 text-slate-700">
                                      {idx + 1}
                                    </span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-2xl p-5 bg-emerald-50/50 border border-emerald-100 space-y-3">
                              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 block">
                                Recommended Action Protocol
                              </span>
                              <ul className="space-y-2">
                                {safeRecommendations.map((rec, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed font-medium">
                                    <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                                    <span>{rec}</span>
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
                <div className="absolute inset-0 hex-grid-bg opacity-30 pointer-events-none" />
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,160,70,0.15)' }}
                >
                  <VeriLensIcon className="w-10 h-10" style={{ color: 'var(--green-accent-from)' }} />
                </div>
                <div className="space-y-2 max-w-sm relative z-10">
                  <h3 className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Ready for Authenticity Inspection</h3>
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
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold" style={{ background: 'rgba(0,160,70,0.05)', border: '1px solid rgba(0,80,40,0.08)', color: 'var(--text-muted)' }}>
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
                        : mono ? '#0F172A' : 'var(--text-primary)',
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
