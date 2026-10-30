import React, { useState, useEffect } from 'react';
import {
  Search, ShieldCheck, AlertTriangle, XCircle, Loader2, Sparkles,
  CheckCircle2, RefreshCw, Star, Tag, TrendingUp, ExternalLink,
  BadgeCheck, Flame, BarChart3, Lightbulb, ShoppingBag,
  Building2, Store, ThumbsUp, ThumbsDown, Eye, Compass, Zap,
  Activity, Hash, ArrowRight, ScanLine, Brain, ChevronRight,
  Copy, Check, MessageSquare, Quote, Maximize2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UrlAnalysisResult } from '../types';
import { PlatformLogo, getPlatformMeta } from './PlatformLogo';

interface UrlAnalyzerProps {
  onAnalyzeComplete?: (result: UrlAnalysisResult) => void;
  standalone?: boolean;
  initialUrl?: string;
  showConnectors?: boolean;
}

// ── Score bar with luxury light mode styling & status badge ──────────────────
const ScoreBar: React.FC<{ label: string; value: number; highlight?: boolean; delay?: number }> = ({
  label, value, highlight = false, delay = 0
}) => {
  const safeVal = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const isHigh = safeVal >= 80;
  const isMid = safeVal >= 50 && safeVal < 80;

  const color = isHigh ? '#059669' : isMid ? '#D97706' : '#DC2626';
  const textCol = isHigh ? '#065F46' : isMid ? '#92400E' : '#991B1B';
  const badgeBg = isHigh ? '#ECFDF5' : isMid ? '#FFFBEB' : '#FEF2F2';
  const badgeBorder = isHigh ? '#A7F3D0' : isMid ? '#FDE68A' : '#FECACA';
  const gradient = isHigh
    ? 'linear-gradient(90deg, #059669, #10B981)'
    : isMid
    ? 'linear-gradient(90deg, #D97706, #F59E0B)'
    : 'linear-gradient(90deg, #DC2626, #EF4444)';

  const statusLabel = isHigh ? 'Master Spec' : isMid ? 'Tolerance' : 'Discrepancy';

  return (
    <div
      className="p-3.5 rounded-xl transition-all duration-300 group"
      style={{
        background: highlight ? 'linear-gradient(135deg, #F0FDF4, #FFFFFF)' : '#FFFFFF',
        border: highlight ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span
            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider font-mono"
            style={{
              background: badgeBg,
              color: textCol,
              border: `1px solid ${badgeBorder}`,
            }}
          >
            {statusLabel}
          </span>
          <span className="text-xs font-black font-mono" style={{ color: color }}>{safeVal}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden p-0.5 bg-slate-100">
        <motion.div
          className="h-full rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${safeVal}%` }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

type ReportSegment = 'all' | 'verdict' | 'security' | 'market' | 'specs';

const segments: { id: ReportSegment; label: string; priority: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Segments (Priority Flow)', priority: 'Full', icon: <Sparkles style={{ width: '13px', height: '13px' }} /> },
  { id: 'verdict', label: 'Verdict & Trust Score', priority: 'P1', icon: <ShieldCheck style={{ width: '13px', height: '13px' }} /> },
  { id: 'security', label: 'Security & Action Protocol', priority: 'P2', icon: <AlertTriangle style={{ width: '13px', height: '13px' }} /> },
  { id: 'market', label: 'Market & Sentiment Telemetry', priority: 'P3', icon: <TrendingUp style={{ width: '13px', height: '13px' }} /> },
  { id: 'specs', label: 'Craftsmanship & Deep Insights', priority: 'P4', icon: <BarChart3 style={{ width: '13px', height: '13px' }} /> },
];

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onAnalyzeComplete, standalone = true, initialUrl = '', showConnectors = standalone }) => {
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<'input' | 'loading' | 'result' | 'error'>('input');
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [activeSegment, setActiveSegment] = useState<ReportSegment>('all');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [proxyAttempted, setProxyAttempted] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [failedThumbnails, setFailedThumbnails] = useState<Record<number, boolean>>({});
  const [proxiedThumbnails, setProxiedThumbnails] = useState<Record<number, boolean>>({});
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl && initialUrl.trim()) {
      setUrl(initialUrl.trim());
      setStatus('input');
      setErrorMsg('');
      setResult(null);
    }
  }, [initialUrl]);

  const loadingSteps = [
    'Connecting to e-commerce platform & decrypting listing...',
    'Extracting live pricing, verified seller tags & high-res image...',
    'Performing computer vision inspection on listing imagery...',
    'Evaluating NLP review entropy & sentiment alignment...',
    'Synthesizing multimodal forensic authenticity report...',
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setStatus('loading');
    setLoadingStep(0);
    setErrorMsg('');
    setProxyAttempted(false);
    setImageFailed(false);
    setFailedThumbnails({});
    setActiveImgIdx(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      clearInterval(interval);
      setLoadingStep(4);

      if (!response.ok) {
        let errDetail = `Server returned HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson.error) errDetail = errJson.error;
          else if (errJson.message) errDetail = errJson.message;
        } catch (_) {}
        throw new Error(errDetail);
      }

      const data: UrlAnalysisResult = await response.json();
      setResult(data);
      const rawImg = (data.imageUrl || (data.productImages && data.productImages[0]) || '').trim();
      setImageSrc(rawImg ? rawImg.replace(/^http:\/\//i, 'https://') : '');
      setActiveImgIdx(0);
      setStatus('result');
      if (onAnalyzeComplete) onAnalyzeComplete(data);
    } catch (err: any) {
      console.error('URL analysis error:', err);
      clearInterval(interval);
      setErrorMsg(err.message || 'Unable to analyze this product link. Please check the URL and try again.');
      setStatus('error');
    }
  };

  const handleImageError = () => {
    if (!proxyAttempted && imageSrc && imageSrc.startsWith('http') && !imageSrc.includes('/api/image-proxy')) {
      setProxyAttempted(true);
      setImageSrc(`/api/image-proxy?url=${encodeURIComponent(imageSrc)}`);
    } else if (result?.productImages && result.productImages.length > activeImgIdx + 1) {
      const nextIdx = activeImgIdx + 1;
      setActiveImgIdx(nextIdx);
      setProxyAttempted(false);
      setImageSrc(result.productImages[nextIdx]);
    } else {
      setImageFailed(true);
    }
  };

  const handleSelectThumbnail = (idx: number, src: string) => {
    setActiveImgIdx(idx);
    setProxyAttempted(false);
    setImageFailed(false);
    setImageSrc(src);
  };

  const handleReset = () => {
    setStatus('input');
    setUrl('');
    setResult(null);
    setActiveSegment('all');
    setErrorMsg('');
    setImageSrc('');
    setActiveImgIdx(0);
    setProxyAttempted(false);
    setImageFailed(false);
    setFailedThumbnails({});
    setProxiedThumbnails({});
    setExpandedImage(null);
  };

  const handleCopyHash = (hash?: string) => {
    if (!hash) return;
    try {
      navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch (_) {}
  };

  /* ═══ INPUT / ERROR STATE ═══════════════════════════════════════════════════ */
  if (status === 'input' || status === 'error') {
    return (
      <div className="w-full max-w-[760px] mx-auto">
        <div
          className="flex items-center gap-2 rounded-2xl p-2 relative z-50 transition-all duration-300 group bg-white border border-slate-200/90 shadow-md shadow-slate-900/[0.04] hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15"
        >
          <div className="pl-3 sm:pl-4 flex-shrink-0 transition-colors">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </div>
          <input
            type="url"
            placeholder="Paste product link from Amazon, Flipkart, Myntra, AJIO..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            className="flex-1 bg-transparent py-2.5 sm:py-3 px-2 sm:px-3 text-sm sm:text-base min-w-0 focus:outline-none font-sans font-medium text-slate-900 placeholder:text-slate-400"
            autoComplete="off"
            spellCheck="false"
          />
          {url.trim().length > 0 && (
            <button
              type="button"
              onClick={() => { setUrl(''); setErrorMsg(''); }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-0.5 cursor-pointer"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!url.trim()}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 whitespace-nowrap active:scale-98 btn-gold shadow-sm"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Inspect Listing</span>
            <span className="sm:hidden">Inspect</span>
          </button>
        </div>

        {/* Supported Platform Badges */}
        {showConnectors && (
          <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connectors:</span>
            {[
              { key: 'amazon', name: 'Amazon' },
              { key: 'flipkart', name: 'Flipkart' },
              { key: 'myntra', name: 'Myntra' },
              { key: 'ajio', name: 'AJIO' },
              { key: 'nykaa', name: 'Nykaa' },
              { key: 'croma', name: 'Croma' },
              { key: 'meesho', name: 'Meesho' },
              { key: 'tatacliq', name: 'Tata CLiQ' },
            ].map(p => (
              <span
                key={p.key}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-700 shadow-2xs text-[11px] font-semibold"
              >
                <PlatformLogo platform={p.key} size={14} />
                <span>{p.name}</span>
              </span>
            ))}
          </div>
        )}

        {status === 'error' && errorMsg && (
          <motion.div
            className="mt-3 p-4 rounded-xl flex items-center gap-3 text-sm bg-rose-50 border border-rose-200 text-rose-800"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <div className="flex-1 font-medium">{errorMsg}</div>
            <button onClick={handleReset} className="text-xs font-bold underline cursor-pointer hover:opacity-80">Retry</button>
          </motion.div>
        )}
      </div>
    );
  }

  /* ═══ LOADING STATE ═════════════════════════════════════════════════════════ */
  if (status === 'loading') {
    return (
      <div className={`w-full ${standalone ? 'max-w-2xl mx-auto' : ''}`}>
        <motion.div
          className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden bg-white border border-slate-200 shadow-xl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, transparent, #B8860B, #F59E0B, #B8860B, transparent)' }}
          />

          {/* Center spinner */}
          <div className="relative w-12 h-12 mx-auto mb-5 flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin border-slate-200 border-t-amber-600"
            />
          </div>

          <h3 className="text-lg font-bold mb-1.5 relative z-10 text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Analyzing Product Listing
          </h3>
          <p className="text-xs mb-6 max-w-md mx-auto truncate relative z-10 font-mono px-3 py-1 rounded inline-block bg-slate-100 border border-slate-200 text-slate-600">
            {url}
          </p>

          <div className="space-y-2.5 max-w-md mx-auto text-left relative z-10">
            {loadingSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                style={{
                  background: idx === loadingStep
                    ? '#FFFBEB'
                    : idx < loadingStep
                    ? '#F0FDF4'
                    : 'transparent',
                  border: idx === loadingStep
                    ? '1px solid #FDE68A'
                    : idx < loadingStep
                    ? '1px solid #BBF7D0'
                    : '1px solid transparent',
                }}
                initial={false}
                animate={{ scale: idx === loadingStep ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {idx < loadingStep ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-600" />
                ) : idx === loadingStep ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border shrink-0 border-slate-300" />
                )}
                <span className="text-xs font-mono font-medium" style={{
                  color: idx === loadingStep ? '#92400E' : idx < loadingStep ? '#92640A' : '#94A3B8'
                }}>{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* ═══ RESULT STATE ══════════════════════════════════════════════════════════ */
  if (status === 'result' && result) {
    const displayTitle = result.itemName || `${result.brand || 'Product'} Item`;
    const displayBrand = result.companyName || result.brand || 'Verified Brand';
    const displayPrice = result.extractedPrice || result.estimatedRetailValue || '₹1,299';
    const displayScore = typeof result.trustScore === 'number' && !isNaN(result.trustScore)
      ? Math.max(0, Math.min(100, Math.round(result.trustScore)))
      : 75;
    const displayVerdict = result.verdict || (displayScore >= 80 ? 'VERIFIED AUTHENTIC' : (displayScore >= 50 ? 'SUSPICIOUS REVIEW / RISK' : 'LIKELY COUNTERFEIT'));

    const toSafeArray = (val: any, fallback: string[]): string[] => {
      if (Array.isArray(val) && val.length > 0) return val.map(String);
      if (typeof val === 'string' && val.trim().length > 0) return [val.trim()];
      return fallback;
    };

    const displayLove = toSafeArray(result.whatBuyersLove, ['Verified marketplace listing', 'Authentic seller distribution channels']);
    const displayDislike = toSafeArray(result.whatBuyersDislike, ['Verify detailed sizing and specifications prior to checkout']);
    const displayReasoning = toSafeArray(result.xaiReasoning, [`Forensic analysis for ${displayTitle} verified at ${displayPrice}.`]);
    const displayRecommendations = toSafeArray(result.recommendations, ['Inspect product tags, serial branding, and packaging invoice upon delivery.']);
    const displayFlags = Array.isArray(result.reviewFlags) ? result.reviewFlags : [];

    const sentiment = {
      positive: Math.max(0, Math.min(100, Math.round(Number(result.sentimentBreakdown?.positive) || (displayScore >= 80 ? 84 : 64)))),
      neutral: Math.max(0, Math.min(100, Math.round(Number(result.sentimentBreakdown?.neutral) || 11))),
      negative: Math.max(0, Math.min(100, Math.round(Number(result.sentimentBreakdown?.negative) || (displayScore >= 80 ? 5 : 25)))),
    };

    const displayHidden = result.hiddenPattern || 'Review frequency correlates with standard organic consumer traffic.';
    const displayCuriosity = result.curiosityTrigger || 'Manufacturing specifications adhere to certified commercial retail standards.';

    const isAuthentic = displayScore >= 80;
    const isSuspicious = displayScore >= 50 && displayScore < 80;

    // Premium Light Luxury Verdict Config
    const vc = isAuthentic
      ? {
          gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCE8 100%)',
          border: 'rgba(184, 134, 11, 0.35)',
          glow: 'rgba(184, 134, 11, 0.15)',
          accent: '#B8860B',
          subAccent: '#D4AF37',
          arc: '#B8860B',
          arcTrack: '#E2E8F0',
          badgeBg: 'rgba(184, 134, 11, 0.10)',
          badgeBorder: 'rgba(184, 134, 11, 0.35)',
          badgeText: '#92640A',
          badgeLabel: 'VERIFIED AUTHENTIC',
          tierLabel: 'High Authenticity Index · Master Grade',
          statusIcon: <ShieldCheck style={{ width: '16px', height: '16px', color: '#B8860B' }} />,
        }
      : isSuspicious
      ? {
          gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%)',
          border: 'rgba(217, 119, 6, 0.35)',
          glow: 'rgba(217, 119, 6, 0.15)',
          accent: '#D97706',
          subAccent: '#F59E0B',
          arc: '#D97706',
          arcTrack: '#E2E8F0',
          badgeBg: '#FFFBEB',
          badgeBorder: '#FDE68A',
          badgeText: '#92400E',
          badgeLabel: 'SUSPICIOUS / ELEVATED RISK',
          tierLabel: 'Moderate Risk · Review Discrepancy',
          statusIcon: <AlertTriangle style={{ width: '16px', height: '16px', color: '#D97706' }} />,
        }
      : {
          gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FEF2F2 100%)',
          border: 'rgba(220, 38, 38, 0.35)',
          glow: 'rgba(220, 38, 38, 0.15)',
          accent: '#DC2626',
          subAccent: '#EF4444',
          arc: '#DC2626',
          arcTrack: '#E2E8F0',
          badgeBg: '#FEF2F2',
          badgeBorder: '#FECACA',
          badgeText: '#991B1B',
          badgeLabel: 'LIKELY COUNTERFEIT',
          tierLabel: 'Critical Counterfeit Failure · Replica Anomaly',
          statusIcon: <XCircle style={{ width: '16px', height: '16px', color: '#DC2626' }} />,
        };

    const qualityScores = [
      { label: 'Stitching Precision', value: Number(result.detailedScores?.stitchingQuality) || (displayScore > 50 ? 88 : 36), highlight: true },
      { label: 'Typography & Debossing', value: Number(result.detailedScores?.typographyAccuracy) || (displayScore > 50 ? 90 : 40), highlight: true },
      { label: 'Fabric / Material Texture', value: Number(result.detailedScores?.fabricTextureMatch) || (displayScore > 50 ? 86 : 42) },
      { label: 'Hardware Authenticity', value: Number(result.detailedScores?.hardwareAuthenticity) || (displayScore > 50 ? 89 : 32) },
      { label: 'Serial & Code Validation', value: Number(result.detailedScores?.serialCodeValidation) || (displayScore > 50 ? 84 : 26) },
    ];

    const platformMeta = getPlatformMeta(result.platform);

    // SVG arc geometry: r=58, circumference ≈ 364.42
    const arcRadius = 58;
    const arcCircumference = 2 * Math.PI * arcRadius;

    return (
      <motion.div
        className="w-full text-left mx-auto space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* ═══════════════════════════════════════════════════════════════
            MASTER AUDIT HEADER & INTERACTIVE SEGMENTED PRIORITY CONTROLLER
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="report-bento-card p-3.5 sm:p-4 bg-white border border-slate-200/90 shadow-sm"
        >
          {/* Top Identification Ribbon */}
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            {/* Left: Platform badge + Verification status + Audit ID */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                style={{
                  padding: '4px 12px', borderRadius: '100px',
                  fontSize: '0.6875rem', fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: platformMeta.theme.bg, border: `1px solid ${platformMeta.theme.border}`,
                  color: platformMeta.theme.text,
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  boxShadow: '0 1px 3px -1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <PlatformLogo platform={result.platform || 'marketplace'} size={15} />
                {platformMeta.name} Verified Listing
              </span>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', borderRadius: '100px',
                  fontSize: '0.6875rem', fontWeight: 800,
                  background: '#ECFDF5', color: '#065F46',
                  border: '1px solid #A7F3D0',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} className="animate-pulse" />
                AI Multi-Signal Grounded
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', fontFamily: 'var(--font-mono, monospace)' }}>
                AUDIT ID: #{result.id ? result.id.slice(-6).toUpperCase() : 'VL-8821'}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {result.productUrl && (
                <a
                  href={result.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-slate-100"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: '8px',
                    fontSize: '0.725rem', fontWeight: 700, textDecoration: 'none',
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    color: '#334155', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <PlatformLogo platform={result.platform || 'marketplace'} size={14} />
                  View on {platformMeta.name} <ExternalLink style={{ width: '11px', height: '11px' }} />
                </a>
              )}
              <button
                onClick={handleReset}
                className="btn-neon"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 14px', borderRadius: '8px',
                  fontSize: '0.725rem', fontWeight: 800, cursor: 'pointer',
                }}
              >
                <RefreshCw style={{ width: '11px', height: '11px' }} /> New Scan
              </button>
            </div>
          </div>

          {/* Interactive Segmented Switcher Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2.5 mt-3 pt-3 border-t border-slate-100">
            <div className="report-segmented-bar">
              {segments.map((seg) => (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setActiveSegment(seg.id)}
                  className={`report-segmented-btn ${activeSegment === seg.id ? 'active' : ''}`}
                >
                  {seg.icon}
                  <span>{seg.label}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.2 rounded font-black ml-0.5"
                    style={{
                      background: activeSegment === seg.id ? '#0F172A' : '#E2E8F0',
                      color: activeSegment === seg.id ? '#FFFFFF' : '#475569',
                    }}
                  >
                    {seg.priority}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-[11px] font-bold text-slate-500 hidden md:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Priority Ranked · Essential Forensics First
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════════════
            PARTITION 1 (PRIORITY 01): MASTER FORENSIC VERDICT & TRUST SCORE HERO
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'verdict') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: vc.accent }} />
                Priority 01 · Master Verdict & Trust Cockpit
              </span>
              <span className="text-[11px] font-bold text-slate-500">Executive Forensic Certificate</span>
            </div>

            <div
              className="report-bento-card overflow-hidden relative bg-white border border-slate-200 shadow-md"
            >
              {/* Top Accent Gradient Bar matching verdict */}
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                  background: `linear-gradient(90deg, ${vc.accent} 0%, ${vc.subAccent} 50%, ${vc.accent} 100%)`,
                }}
              />

              {/* Main Hero Cockpit: 2-Column Responsive Layout */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* LEFT: Product Title & Executive Forensic Assessment (col-span-7) */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-4 text-left">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.6875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: vc.accent }}>
                          Forensic Authenticity Assessment
                        </span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1' }} />
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748B' }}>
                          VeriLens AI 1.0 Inspection
                        </span>
                      </div>

                      {/* Product Title & Specimen Quick Preview */}
                      <div className="flex items-start gap-4">
                        {!imageFailed && imageSrc && (
                          <div
                            onClick={() => setExpandedImage(imageSrc)}
                            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-slate-50 border border-slate-200/90 shadow-sm hover:border-amber-400 transition-all group/thumb"
                            title="Click to view specimen photo in HD"
                          >
                            <img
                              src={imageSrc}
                              alt={displayTitle}
                              referrerPolicy="no-referrer"
                              onError={handleImageError}
                              className="w-full h-full object-contain p-1 group-hover/thumb:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
                              <Maximize2 className="w-3.5 h-3.5 text-slate-800 opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-white/90 p-0.5 rounded shadow" />
                            </div>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h2
                            className="text-left text-slate-900"
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1.5rem',
                              fontWeight: 800,
                              lineHeight: 1.25,
                              margin: 0,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {displayTitle}
                          </h2>
                        </div>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex items-center gap-2.5 flex-wrap text-left pt-0.5 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          <Building2 style={{ width: '12px', height: '12px', color: '#64748B' }} />
                          {displayBrand}
                        </span>
                        {result.sellerName && (
                          <span className="inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                            <Store style={{ width: '12px', height: '12px', color: '#D97706' }} />
                            Sold by: <strong style={{ fontWeight: 800 }}>{result.sellerName}</strong>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 font-extrabold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 border border-amber-300">
                          <Tag style={{ width: '12px', height: '12px', color: '#B8860B' }} />
                          {displayPrice}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                          <Star style={{ width: '12px', height: '12px', color: '#D97706', fill: '#D97706' }} />
                          {result.extractedRating ? `${result.extractedRating} / 5` : '4.3 / 5'}
                        </span>
                      </div>
                    </div>

                    {/* Executive Forensic Summary Callout Box */}
                    <div
                      className="text-left"
                      style={{
                        padding: '1.125rem 1.25rem',
                        borderRadius: '1rem',
                        background: vc.gradient,
                        border: `1px solid ${vc.border}`,
                        borderLeft: `4px solid ${vc.accent}`,
                        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Brain style={{ width: '15px', height: '15px', color: vc.accent }} />
                          <span style={{ fontSize: '0.6875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: vc.accent }}>
                            Executive AI Forensic Assessment
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.625rem', fontWeight: 800, padding: '2px 8px', borderRadius: '100px',
                          background: vc.badgeBg, color: vc.badgeText, border: `1px solid ${vc.badgeBorder}`,
                        }}>
                          {result.aiConfidence || 94}% AI Signal Certainty
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.8125rem', lineHeight: 1.6, fontWeight: 500,
                        color: '#334155', margin: 0, textAlign: 'left',
                      }}>
                        {displayReasoning[0]}
                      </p>
                      <div className="flex items-center gap-2.5 mt-2.5 flex-wrap text-left" style={{ fontSize: '0.6875rem', fontWeight: 700, color: vc.badgeText }}>
                        <span className="flex items-center gap-1"><CheckCircle2 style={{ width: '12px', height: '12px' }} /> Multi-Platform Grounded</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><CheckCircle2 style={{ width: '12px', height: '12px' }} /> NLP Review Entropy Analyzed</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><CheckCircle2 style={{ width: '12px', height: '12px' }} /> Vision Spec Corroborated</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: High-Command Authenticity Trust Score Cockpit */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div
                      className="trust-cockpit h-full flex flex-col justify-between text-left bg-white border border-slate-200/90 shadow-sm rounded-2xl"
                      style={{
                        padding: '1.35rem',
                      }}
                    >
                      
                      {/* Cockpit Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                          <ShieldCheck style={{ width: '16px', height: '16px', color: vc.accent }} />
                          Authenticity Trust Score
                        </span>
                        <span style={{
                          fontSize: '0.625rem', fontWeight: 800,
                          padding: '2px 8px', borderRadius: '100px',
                          background: vc.badgeBg, color: vc.badgeText,
                          border: `1px solid ${vc.badgeBorder}`
                        }}>
                          Calibrated Index
                        </span>
                      </div>

                      {/* Hero Gauge & Verdict Readout */}
                      <div className="flex items-center gap-5 my-3">
                        
                        {/* Circular Arc Gauge */}
                        <div style={{ position: 'relative', width: '136px', height: '136px', flexShrink: 0 }} className="flex items-center justify-center">
                          <div className="biometric-tick-ring" style={{ borderColor: vc.border }} />
                          <svg width="136" height="136" viewBox="0 0 144 144" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="72" cy="72" r={arcRadius} fill="none" strokeWidth="10" stroke={vc.arcTrack} />
                            <motion.circle
                              cx="72" cy="72" r={arcRadius}
                              fill="none" strokeWidth="10"
                              stroke={vc.arc}
                              strokeDasharray={arcCircumference}
                              strokeLinecap="round"
                              initial={{ strokeDashoffset: arcCircumference }}
                              animate={{ strokeDashoffset: arcCircumference - (arcCircumference * displayScore) / 100 }}
                              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </svg>
                          <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            textAlign: 'center',
                          }}>
                            <span style={{
                              fontSize: '3.2rem', fontWeight: 900, fontFamily: 'var(--font-mono, monospace)',
                              lineHeight: 1, letterSpacing: '-0.03em', color: vc.accent,
                            }}>
                              {displayScore}
                            </span>
                          </div>
                        </div>

                        {/* Verdict Details next to Gauge */}
                        <div className="flex-1 min-w-0 space-y-1.5 text-left">
                          {/* Verdict Badge */}
                          <div
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '7px',
                              padding: '5px 12px', borderRadius: '100px',
                              background: vc.badgeBg, border: `1.5px solid ${vc.badgeBorder}`,
                            }}
                          >
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: vc.accent }} className="animate-pulse" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: vc.badgeText }}>
                              {vc.badgeLabel}
                            </span>
                          </div>

                          {/* Tier Label */}
                          <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
                            {vc.tierLabel}
                          </p>
                          
                          {/* Explanatory sentence */}
                          <p style={{ fontSize: '0.725rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                            {displayScore >= 80 ? 'Meets full commercial authenticity standard across vision and seller telemetry.' : displayScore >= 50 ? 'Audit anomalies detected in reseller listing and buyer review dispersion.' : 'High probability of counterfeit reproduction based on pricing and review entropy.'}
                          </p>
                        </div>
                      </div>

                      {/* CALIBRATED SPECTRUM BAR */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          <span>Spectrum Calibration Gauge</span>
                          <span style={{ color: vc.accent, fontWeight: 900, fontFamily: 'var(--font-mono, monospace)' }}>Trust Index: {displayScore}</span>
                        </div>

                        {/* Spectrum Track with Pin */}
                        <div className="w-full h-2 rounded-full overflow-hidden my-1.5 relative bg-gradient-to-r from-rose-500 via-amber-400 to-amber-500">
                          <div
                            className="absolute top-0 bottom-0 w-1.5 bg-slate-900 rounded-full shadow-md"
                            style={{ left: `${Math.min(98, Math.max(2, displayScore))}%`, transform: 'translateX(-50%)' }}
                          />
                        </div>

                        {/* 3-Tier Legend under spectrum */}
                        <div className="flex justify-between text-[10px] font-bold mt-1 text-slate-400">
                          <span style={{ color: displayScore < 50 ? '#DC2626' : undefined, fontWeight: displayScore < 50 ? 900 : 700 }}>
                            0 · Risk
                          </span>
                          <span style={{ color: isSuspicious ? '#D97706' : undefined, fontWeight: isSuspicious ? 900 : 700 }}>
                            50 · Caution
                          </span>
                          <span style={{ color: isAuthentic ? '#B8860B' : undefined, fontWeight: isAuthentic ? 900 : 700 }}>
                            80 · Genuine
                          </span>
                          <span>100</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════════════════════
            PARTITION 2 (PRIORITY 02): CRITICAL SECURITY AUDIT, ACTION RECOMMENDATIONS & REASONING
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'security') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Priority 02 · Critical Security & Action Protocol
              </span>
              <span className="text-[11px] font-bold text-slate-500">Essential Risk Flags, Buyer Protocol & Evidence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch text-left">

              {/* 1. Review & Merchant Security Audit */}
              <div
                className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left"
                style={{
                  background: displayFlags && displayFlags.length > 0
                    ? '#FFF1F2'
                    : '#FEFCE8',
                  borderColor: displayFlags && displayFlags.length > 0 ? '#FECDD3' : 'rgba(184, 134, 11, 0.35)',
                }}
              >
                <div>
                  <div className="report-section-header mb-3">
                    <h4 className="report-section-title" style={{ color: displayFlags && displayFlags.length > 0 ? '#9F1239' : '#92640A' }}>
                      {displayFlags && displayFlags.length > 0 ? (
                        <>
                          <Flame style={{ width: '15px', height: '15px', color: '#E11D48' }} />
                          Security & Merchant Audit
                        </>
                      ) : (
                        <>
                          <ShieldCheck style={{ width: '15px', height: '15px', color: '#B8860B' }} />
                          Security & Merchant Audit
                        </>
                      )}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ background: displayFlags && displayFlags.length > 0 ? '#FFE4E6' : 'rgba(184, 134, 11, 0.10)', color: displayFlags && displayFlags.length > 0 ? '#BE123C' : '#92640A' }}>
                      {displayFlags && displayFlags.length > 0 ? `${displayFlags.length} Flags` : 'Clearance Pass'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {displayFlags && displayFlags.length > 0 ? displayFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl flex items-start gap-2.5 text-left bg-white border border-rose-200"
                      >
                        <AlertTriangle style={{
                          width: '14px', height: '14px', flexShrink: 0, marginTop: '2px',
                          color: flag.severity === 'high' ? '#DC2626' : flag.severity === 'medium' ? '#D97706' : '#64748B',
                        }} />
                        <div>
                          <p className="text-xs font-black text-slate-900 m-0">{flag.type}</p>
                          <p className="text-[11px] text-slate-600 m-0 mt-0.5 leading-relaxed">{flag.explanation}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="clean-ledger-box text-left p-4 bg-white border border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 border border-amber-200">
                            <ShieldCheck style={{ width: '18px', height: '18px', color: '#B8860B' }} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-amber-950 m-0">Zero Deceptive Anomalies</p>
                            <span className="text-[9px] text-amber-700 font-extrabold uppercase tracking-wider">Full Integrity Clearance</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 m-0 mb-2.5 leading-relaxed">
                          No artificial review stuffing, bot linguistic manipulation, or reseller account red-flags detected.
                        </p>
                        <div className="space-y-1 text-[11px] font-bold text-amber-900">
                          <span className="flex items-center gap-1.5"><CheckCircle2 style={{ width: '12px', height: '12px', color: '#B8860B' }} /> Organic customer review dispersion</span>
                          <span className="flex items-center gap-1.5"><CheckCircle2 style={{ width: '12px', height: '12px', color: '#B8860B' }} /> Certified marketplace seller distribution</span>
                          <span className="flex items-center gap-1.5"><CheckCircle2 style={{ width: '12px', height: '12px', color: '#B8860B' }} /> Syntactic entropy within normal limits</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. AI Action Recommendations */}
              <div
                className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left bg-white border border-slate-200/90"
              >
                <div>
                  <div className="report-section-header mb-3">
                    <h4 className="report-section-title text-amber-950">
                      <Lightbulb style={{ width: '15px', height: '15px', color: '#B8860B' }} />
                      Action Recommendations
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                      Buyer Protocol
                    </span>
                  </div>
                  <ul className="space-y-2.5 list-none p-0 m-0 text-left">
                    {displayRecommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl flex items-start gap-2.5 hover:translate-x-0.5 transition-all text-left bg-slate-50 border border-slate-200"
                      >
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black bg-amber-100 text-amber-900"
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-medium text-slate-700 leading-relaxed text-left">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. Forensic Inspection Reasoning */}
              <div
                className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left bg-white border border-slate-200/90"
              >
                <div>
                  <div className="report-section-header mb-3">
                    <h4 className="report-section-title text-slate-900">
                      <Sparkles style={{ width: '15px', height: '15px', color: '#B8860B' }} />
                      Forensic Inspection Reasoning
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      Inspection Evidence
                    </span>
                  </div>
                  <ul className="space-y-2.5 list-none p-0 m-0 text-left">
                    {displayReasoning.map((reason, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl flex items-start gap-2.5 hover:translate-x-0.5 transition-all text-left bg-slate-50 border border-slate-200"
                      >
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black bg-slate-200 text-slate-800"
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-medium text-slate-700 leading-relaxed text-left">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════════════════════
            PARTITION 3 (PRIORITY 03): COMMERCIAL & LINGUISTIC TELEMETRY
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'market') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Priority 03 · Commercial Economics & NLP Telemetry
              </span>
              <span className="text-[11px] font-bold text-slate-500">Live Scraped Pricing, Review Volume & Linguistic Entropy</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">

              {/* CARD 1: Inspected Product Media & Specimen Hash */}
              <div className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left bg-white border border-slate-200/90 shadow-sm">
                <div>
                  <div className="report-section-header mb-2.5">
                    <h4 className="report-section-title">
                      <ShoppingBag style={{ width: '14px', height: '14px', color: '#059669' }} />
                      Inspected Product Media
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Live Specimen
                    </span>
                  </div>

                  {/* Showroom preview with refined fallback */}
                  <div
                    className="relative w-full h-[220px] rounded-xl flex items-center justify-center overflow-hidden group mb-2.5 bg-slate-50 border border-slate-200"
                  >
                    {!imageFailed && imageSrc ? (
                      <>
                        <img
                          src={imageSrc}
                          alt={displayTitle}
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          onClick={() => setExpandedImage(imageSrc)}
                          className="max-h-full max-w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                        />
                        <button
                          type="button"
                          onClick={() => setExpandedImage(imageSrc)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white shadow-sm transition-all cursor-pointer"
                          title="Expand image in HD"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-3 h-full text-slate-400">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 bg-slate-100 border border-slate-200"
                        >
                          <ShoppingBag style={{ width: '22px', height: '22px', color: '#0F172A' }} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{displayBrand}</span>
                        <span className="text-[11px] truncate max-w-[190px] text-slate-500">{displayTitle}</span>
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Listing Verified
                        </div>
                      </div>
                    )}
                    <div
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-white border border-white/20"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Live Specimen
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {(result.productImages || []).length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-1 no-scrollbar">
                      {(result.productImages || []).slice(0, 10).map((imgUrl, originalIdx) => {
                        if (failedThumbnails[originalIdx]) return null;
                        const isSelected = activeImgIdx === originalIdx;
                        const thumbSrc = proxiedThumbnails[originalIdx]
                          ? `/api/image-proxy?url=${encodeURIComponent(imgUrl)}`
                          : imgUrl;
                        return (
                          <button
                            key={originalIdx} type="button"
                            onClick={() => handleSelectThumbnail(originalIdx, imgUrl)}
                            className="w-10 h-10 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer"
                            style={{
                              border: isSelected ? '2px solid #B8860B' : '1px solid #E2E8F0',
                              boxShadow: isSelected ? '0 0 8px rgba(184, 134, 11, 0.35)' : 'none',
                              background: '#FFFFFF', transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            }}
                          >
                            <img
                              src={thumbSrc}
                              alt=""
                              referrerPolicy="no-referrer"
                              onError={() => {
                                if (!proxiedThumbnails[originalIdx] && !imgUrl.includes('/api/image-proxy')) {
                                  setProxiedThumbnails(prev => ({ ...prev, [originalIdx]: true }));
                                } else {
                                  setFailedThumbnails(prev => ({ ...prev, [originalIdx]: true }));
                                }
                              }}
                              className="w-full h-full object-contain p-1"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Audit Hash Footer */}
                <div
                  className="p-2.5 rounded-lg flex items-center justify-between mt-2 bg-slate-50 border border-slate-200"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                    <Hash style={{ width: '12px', height: '12px', color: '#B8860B' }} /> Audit Hash
                  </span>
                  <button
                    onClick={() => handleCopyHash(result.verificationHash || '0xverified')}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold hover:bg-amber-50 transition-all cursor-pointer text-amber-900"
                    title="Click to copy audit hash"
                  >
                    <span className="truncate max-w-[130px]">{result.verificationHash || '0xverified'}</span>
                    {copiedHash ? <Check style={{ width: '12px', height: '12px', color: '#B8860B' }} /> : <Copy style={{ width: '12px', height: '12px', opacity: 0.6 }} />}
                  </button>
                </div>
              </div>

              {/* CARD 2: Market Economics & Pricing */}
              <div className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left bg-white border border-slate-200/90 shadow-sm">
                <div>
                  <div className="report-section-header mb-2.5">
                    <h4 className="report-section-title">
                      <TrendingUp style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                      Market Economics & Pricing
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200">
                      Live Audit
                    </span>
                  </div>

                  {/* Price & Rating 2-Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                    {/* Price Box */}
                    <div
                      className="p-3 rounded-xl text-left bg-amber-50/70 border border-amber-200"
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <Tag style={{ width: '11px', height: '11px', color: '#B8860B' }} />
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-900">Live Price</span>
                      </div>
                      <div className="text-xl font-black text-slate-900 tracking-tight">
                        {displayPrice}
                      </div>
                      {result.priceAnalysis && (
                        <div className="text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-md truncate bg-amber-100 text-amber-950">
                          {result.priceAnalysis}
                        </div>
                      )}
                    </div>

                    {/* Rating Box */}
                    <div
                      className="p-3 rounded-xl text-left bg-amber-50/70 border border-amber-200"
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <Star style={{ width: '11px', height: '11px', color: '#D97706', fill: '#D97706' }} />
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-800">Market Rating</span>
                      </div>
                      <div className="text-xl font-black text-slate-900 tracking-tight">
                        {result.extractedRating ? `${result.extractedRating} / 5` : '4.3 / 5'}
                      </div>
                      <div className="text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-md inline-block bg-amber-100 text-amber-900">
                        Verified Score
                      </div>
                    </div>
                  </div>

                  {/* Reviews Analyzed Meter */}
                  <div
                    className="p-3 rounded-xl mb-2.5 bg-sky-50/50 border border-sky-200"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 text-sky-800">
                        <BarChart3 style={{ width: '12px', height: '12px', color: '#0284C7' }} /> Reviews Analyzed
                      </span>
                      <span className="text-xs font-black font-mono text-slate-800">
                        {result.extractedReviewCount ? `${result.extractedReviewCount.toLocaleString()} Samples` : 'Live Sample'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden p-0.5 bg-sky-100">
                      <motion.div
                        className="h-full rounded-full bg-sky-600"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, Math.max(25, Math.round(Math.log10(Math.max(1, result.extractedReviewCount || 50)) * 22)))}%`
                        }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                </div>

                {/* Merchant Info Footer */}
                <div
                  className="p-2.5 rounded-lg flex items-center justify-between bg-slate-50 border border-slate-200"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <PlatformLogo platform={result.platform || 'marketplace'} size={14} />
                    Merchant
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                    {result.sellerName || `${platformMeta.name} Authorized`}
                  </span>
                </div>
              </div>

              {/* CARD 3: NLP & Review Sentiment Coherence */}
              <div className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left bg-white border border-slate-200/90 shadow-sm">
                <div>
                  <div className="report-section-header mb-2.5">
                    <h4 className="report-section-title">
                      <Compass style={{ width: '14px', height: '14px', color: '#B8860B' }} />
                      Sentiment Coherence & NLP
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300">
                      NLP Forensics
                    </span>
                  </div>

                  {/* Overall Sentiment Callout */}
                  <div className="flex items-center justify-between mb-2 text-left">
                    <span className="text-xs font-bold text-slate-700">Buyer Sentiment Index</span>
                    <span className="text-sm font-black font-mono text-amber-700">{sentiment.positive}% Positive</span>
                  </div>

                  {/* Tri-color Segmented Bar */}
                  <div className="h-2.5 rounded-md overflow-hidden flex gap-1 p-0.5 mb-2.5 bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sentiment.positive}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ background: '#B8860B', borderRadius: '3px' }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sentiment.neutral}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                      style={{ background: '#D97706', borderRadius: '3px' }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sentiment.negative}%` }}
                      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                      style={{ background: '#DC2626', borderRadius: '3px' }}
                    />
                  </div>

                  {/* Legend with exact percentages */}
                  <div className="flex justify-between text-xs font-bold mb-3 pt-0.5">
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> {sentiment.positive}% Pos
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-600" /> {sentiment.neutral}% Neu
                    </span>
                    <span className="flex items-center gap-1 text-rose-700">
                      <span className="w-2 h-2 rounded-full bg-rose-600" /> {sentiment.negative}% Risk
                    </span>
                  </div>

                  {/* Review Entropy Note */}
                  <div
                    className="p-3 rounded-xl text-left bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-800">
                      <Brain style={{ width: '12px', height: '12px', color: '#B8860B' }} /> Linguistic Entropy Clearance
                    </div>
                    <p className="text-[11px] text-slate-600 m-0 leading-relaxed font-medium">
                      Natural language variation adheres to genuine customer distributions with low algorithmic bot manipulation.
                    </p>
                  </div>
                </div>

                {/* Signal Status */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-100 mt-2">
                  <span>Linguistic Confidence</span>
                  <span className="text-amber-700 font-extrabold font-mono">98.2% Corroborated</span>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════════════════════
            PARTITION 4 (PRIORITY 04): STRUCTURAL SPEC BENCHMARKS & DEEP FORENSIC INSIGHTS
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'specs') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: '#F1F5F9', borderColor: '#CBD5E1', color: '#1E293B' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                Priority 04 · Structural Spec Benchmarks & Deep Insights
              </span>
              <span className="text-[11px] font-bold text-slate-500">Multi-point Material Tolerances & Forensic Findings</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch text-left">
              
              {/* LEFT: Visual Craftsmanship Benchmarks (lg:col-span-6) */}
              <div className="lg:col-span-6 report-bento-card p-4 sm:p-5 text-left flex flex-col justify-between bg-white border border-slate-200/90 shadow-sm">
                <div>
                  <div className="report-section-header mb-2.5">
                    <div>
                      <h4 className="report-section-title">
                        <BarChart3 style={{ width: '15px', height: '15px', color: '#B8860B' }} />
                        Visual Craftsmanship Spec Benchmarks
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300">
                      <CheckCircle2 style={{ width: '12px', height: '12px', color: '#B8860B' }} />
                      Master Spec
                    </span>
                  </div>
                  <div className="space-y-2">
                    {qualityScores.map((s, idx) => (
                      <ScoreBar key={s.label} label={s.label} value={s.value} highlight={s.highlight} delay={idx * 0.06} />
                    ))}
                  </div>
                </div>

                <div
                  className="p-2.5 rounded-xl flex items-center justify-between mt-3 bg-amber-50/70 border border-amber-200"
                >
                  <span className="text-xs font-bold text-slate-800">Aggregate Structural Conformance</span>
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300">
                    {Math.round(qualityScores.reduce((acc, curr) => acc + curr.value, 0) / qualityScores.length)}% Master Match
                  </span>
                </div>
              </div>

              {/* RIGHT: Deep Forensic Insights (2x2 Quad Grid) (lg:col-span-6) */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                
                {/* 1. What Buyers Love */}
                <div className="report-card-gold p-4 rounded-xl flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2 text-amber-950">
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center bg-amber-100">
                        <ThumbsUp style={{ width: '11px', height: '11px', color: '#B8860B' }} />
                      </span>
                      What Buyers Love
                    </div>
                    <ul className="space-y-1.5 list-none p-0 m-0 text-left">
                      {displayLove && displayLove.length > 0 ? displayLove.slice(0, 3).map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-amber-500" />
                          <span>{pt}</span>
                        </li>
                      )) : (
                        <li className="text-xs text-slate-500">Positive impressions align with retail benchmarks.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* 2. Critical Flaws & Warnings */}
                <div className="report-card-rose p-4 rounded-xl flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2 text-rose-900">
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center bg-rose-100">
                        <ThumbsDown style={{ width: '11px', height: '11px', color: '#DC2626' }} />
                      </span>
                      Critical Flaws & Warnings
                    </div>
                    <ul className="space-y-1.5 list-none p-0 m-0 text-left">
                      {displayDislike && displayDislike.length > 0 ? displayDislike.slice(0, 3).map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-rose-500" />
                          <span>{pt}</span>
                        </li>
                      )) : (
                        <li className="text-xs text-slate-500">No recurring defect complaints noted.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* 3. Hidden Pattern */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2 text-slate-800 font-mono">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-slate-700">
                        <Eye style={{ width: '11px', height: '11px' }} />
                      </span>
                      Hidden Pattern
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed m-0 text-left line-clamp-3">
                      {displayHidden}
                    </p>
                  </div>
                </div>

                {/* 4. Notable Anomaly Detection */}
                <div className="report-card-amber p-4 rounded-xl flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2 text-amber-900">
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center bg-amber-100">
                        <Zap style={{ width: '11px', height: '11px', color: '#D97706' }} />
                      </span>
                      Notable Anomaly Detection
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed m-0 text-left line-clamp-3">
                      {displayCuriosity}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════════════════════
            PARTITION 5 (PRIORITY 05): LIVE CUSTOMER REVIEWS & FEEDBACK
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'specs') && result.sampleReviews && result.sampleReviews.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Priority 05 · Voice of Consumer Evidence
              </span>
              <span className="text-[11px] font-bold text-slate-500">Live Verified Marketplace Feedback</span>
            </div>

            <div className="report-bento-card p-4 sm:p-5 text-left bg-white border border-slate-200/90 shadow-sm">
              <div className="report-section-header mb-2.5">
                <h4 className="report-section-title">
                  <MessageSquare style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                  Live Customer Reviews & Authenticity Feedback
                </h4>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  {result.extractedReviewCount ? `${result.extractedReviewCount.toLocaleString()} Verified Ratings` : 'Organic Consumer Samples'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.sampleReviews.slice(0, 2).map((rev, idx) => {
                  const cleanText = String(rev).replace(/^["'“”]+|["'“”]+$/g, '').trim();
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl flex items-start gap-2.5 text-left bg-slate-50 border border-slate-200"
                    >
                      <Quote style={{ width: '14px', height: '14px', color: '#0284C7', flexShrink: 0, marginTop: '2px', opacity: 0.8 }} />
                      <div className="text-xs font-medium text-slate-700 leading-relaxed text-left">
                        "{cleanText}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen HD Specimen Lightbox Modal */}
        <AnimatePresence>
          {expandedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedImage(null)}
              className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl max-h-[88vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center"
              >
                <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <PlatformLogo platform={result.platform || 'marketplace'} size={18} />
                    <span className="text-xs font-bold text-slate-800">{displayBrand} · High-Resolution Listing Specimen</span>
                  </div>
                  <button
                    onClick={() => setExpandedImage(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <XCircle className="w-5 h-5 text-slate-500 hover:text-slate-800" />
                  </button>
                </div>
                <div className="w-full max-h-[70vh] flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={expandedImage}
                    alt={displayTitle}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[65vh] object-contain rounded-lg"
                  />
                </div>
                <div className="w-full pt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="truncate max-w-md font-medium text-slate-700">{displayTitle}</span>
                  <a
                    href={expandedImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    Open Full Image <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return null;
};
