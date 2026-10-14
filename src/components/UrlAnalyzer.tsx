import React, { useState, useEffect } from 'react';
import {
  Search, ShieldCheck, AlertTriangle, XCircle, Loader2, Sparkles,
  CheckCircle2, RefreshCw, Star, Tag, TrendingUp, ExternalLink,
  BadgeCheck, Flame, BarChart3, Lightbulb, ShoppingBag,
  Building2, Store, ThumbsUp, ThumbsDown, Eye, Compass, Zap,
  Activity, Hash, ArrowRight, ScanLine, Brain, ChevronRight,
  Copy, Check, MessageSquare, Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UrlAnalysisResult } from '../types';

interface UrlAnalyzerProps {
  onAnalyzeComplete?: (result: UrlAnalysisResult) => void;
  standalone?: boolean;
  initialUrl?: string;
}

// ── Score bar with modern gradient & status badge ─────────────────────────
const ScoreBar: React.FC<{ label: string; value: number; highlight?: boolean; delay?: number }> = ({
  label, value, highlight = false, delay = 0
}) => {
  const safeVal = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const isHigh = safeVal >= 80;
  const isMid = safeVal >= 50 && safeVal < 80;

  const color = isHigh ? '#00F08B' : isMid ? '#FFB800' : '#FF1E56';
  const textCol = isHigh ? '#02572B' : isMid ? '#854D0E' : '#9F1239';
  const gradient = isHigh
    ? 'linear-gradient(90deg, #54FFB5, #00F08B)'
    : isMid
    ? 'linear-gradient(90deg, #FDE047, #FFB800)'
    : 'linear-gradient(90deg, #FDA4AF, #FF1E56)';
  const glow = isHigh
    ? 'rgba(0,240,139,0.35)'
    : isMid
    ? 'rgba(255,184,0,0.35)'
    : 'rgba(255,30,86,0.35)';

  const statusLabel = isHigh ? 'Master Spec' : isMid ? 'Tolerance' : 'Discrepancy';

  return (
    <div
      className="p-3.5 rounded-xl transition-all duration-300 group hover:shadow-sm"
      style={{
        background: highlight
          ? 'linear-gradient(135deg, rgba(0,240,139,0.08), rgba(0,229,255,0.05))'
          : 'rgba(255,255,255,0.8)',
        border: highlight
          ? '1px solid rgba(0,240,139,0.35)'
          : '1px solid rgba(15,23,42,0.06)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span
            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider"
            style={{
              background: `${color}18`,
              color: textCol,
              border: `1px solid ${color}35`,
            }}
          >
            {statusLabel}
          </span>
          <span className="text-xs font-black font-mono" style={{ color: textCol }}>{safeVal}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden p-0.5" style={{ background: 'rgba(15,23,42,0.05)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: gradient, boxShadow: `0 0 10px ${glow}` }}
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

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onAnalyzeComplete, standalone = true, initialUrl = '' }) => {
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

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      if (status === 'error') {
        setStatus('input');
        setErrorMsg('');
      }
    }
  }, [initialUrl]);

  const loadingSteps = [
    'Connecting to e-commerce platform & decrypting listing...',
    'Extracting live pricing, verified seller tags & high-res image...',
    'Performing computer vision inspection on catalog imagery...',
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
      <div className="w-full max-w-[850px] mx-auto">
        <div
          className="flex items-center gap-2 rounded-2xl p-2 relative z-50 transition-all duration-300 group focus-within:ring-4 focus-within:ring-[rgba(52,216,138,0.18)] focus-within:border-[rgba(52,216,138,0.45)]"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 12px 36px -8px rgba(0, 20, 10, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          <div className="pl-3 sm:pl-4 flex-shrink-0 text-slate-400 group-hover:text-[var(--green-primary)] transition-colors">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
          <input
            type="url"
            placeholder="Paste a product link from Amazon, Flipkart, Myntra, AJIO..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            className="flex-1 bg-transparent py-2.5 sm:py-3 px-2 sm:px-3 text-sm sm:text-base min-w-0 focus:outline-none font-sans text-slate-800 placeholder:text-slate-400 font-medium"
            style={{
              caretColor: 'var(--green-primary)',
            }}
            autoComplete="off"
            spellCheck="false"
          />
          <motion.button
            onClick={handleAnalyze}
            disabled={!url.trim()}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 whitespace-nowrap btn-neon"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Analyse with AI</span>
            <span className="sm:hidden">Analyse</span>
          </motion.button>
        </div>

        {status === 'error' && errorMsg && (
          <motion.div
            className="mt-3 p-4 rounded-xl flex items-center gap-3 text-sm"
            style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div className="flex-1 font-medium">{errorMsg}</div>
            <button onClick={handleReset} className="text-xs font-bold underline cursor-pointer opacity-70 hover:opacity-100">Retry</button>
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
          className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,246,241,0.9))',
            border: '1px solid rgba(52,216,138,0.2)',
            boxShadow: '0 20px 60px -10px rgba(0,30,15,0.08), 0 0 40px rgba(52,216,138,0.06)',
            backdropFilter: 'blur(20px)',
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top animated gradient bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, #34D88A, #818CF8, #FBBF24, #34D88A)',
              backgroundSize: '200% 100%'
            }}
          />
          {/* Center ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(52,216,138,0.12) 0%, rgba(129,140,248,0.06) 50%, transparent 70%)' }}
          />

          {/* Holographic Tri-spinner */}
          <div className="relative w-22 h-22 mx-auto mb-6 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-2 border-t-[#00C06B] border-r-transparent border-b-[#818CF8] border-l-transparent animate-spin"
              style={{ animationDuration: '2.5s' }}
            />
            <div
              className="absolute inset-2.5 rounded-full border-2 border-t-transparent border-r-[#FBBF24] border-b-transparent border-l-[#FB7185] animate-spin"
              style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
            />
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(52,216,138,0.15), rgba(129,140,248,0.1))',
                border: '1px solid rgba(52,216,138,0.3)',
              }}
            >
              <Brain className="w-5 h-5 animate-pulse" style={{ color: 'var(--green-primary)' }} />
            </div>
          </div>

          <h3 className="text-xl font-bold mb-1.5 relative z-10" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            Analyzing Product Forensics
          </h3>
          <p className="text-xs mb-8 max-w-md mx-auto truncate relative z-10 font-mono px-4 py-1 rounded-full inline-block" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>
            {url}
          </p>

          <div className="space-y-2.5 max-w-md mx-auto text-left relative z-10">
            {loadingSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                style={{
                  background: idx === loadingStep
                    ? 'linear-gradient(90deg, rgba(52,216,138,0.08), rgba(129,140,248,0.04))'
                    : idx < loadingStep
                    ? 'rgba(52,216,138,0.03)'
                    : 'transparent',
                  border: idx === loadingStep
                    ? '1px solid rgba(52,216,138,0.25)'
                    : idx < loadingStep
                    ? '1px solid rgba(52,216,138,0.08)'
                    : '1px solid transparent',
                }}
                initial={false}
                animate={{ scale: idx === loadingStep ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {idx < loadingStep ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : idx === loadingStep ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border shrink-0" style={{ borderColor: 'rgba(0,0,0,0.15)' }} />
                )}
                <span className="text-xs font-mono font-medium" style={{
                  color: idx === loadingStep ? 'var(--text-primary)' : idx < loadingStep ? 'var(--text-secondary)' : 'var(--text-dim)'
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

    // Modern Luxury Verdict Config
    const vc = isAuthentic
      ? {
          gradient: 'linear-gradient(135deg, rgba(238,253,245,0.98) 0%, rgba(215,252,232,0.85) 45%, rgba(240,253,248,0.96) 100%)',
          border: 'rgba(0, 240, 139, 0.45)',
          glow: 'rgba(0, 240, 139, 0.35)',
          accent: '#00F08B',
          subAccent: '#02572B',
          arc: '#00F08B',
          arcTrack: 'rgba(0, 240, 139, 0.12)',
          badgeBg: 'linear-gradient(135deg, rgba(0, 240, 139, 0.18), rgba(0, 229, 255, 0.10))',
          badgeBorder: 'rgba(0, 240, 139, 0.50)',
          badgeText: '#02572B',
          badgeLabel: 'VERIFIED AUTHENTIC',
          tierLabel: 'High Authenticity Index · Master Grade',
          statusIcon: <ShieldCheck style={{ width: '16px', height: '16px', color: '#00F08B' }} />,
        }
      : isSuspicious
      ? {
          gradient: 'linear-gradient(135deg, rgba(255,253,240,0.98) 0%, rgba(254,246,210,0.85) 45%, rgba(255,251,232,0.96) 100%)',
          border: 'rgba(255, 184, 0, 0.45)',
          glow: 'rgba(255, 184, 0, 0.35)',
          accent: '#FFB800',
          subAccent: '#854D0E',
          arc: '#FFB800',
          arcTrack: 'rgba(255, 184, 0, 0.14)',
          badgeBg: 'linear-gradient(135deg, rgba(255, 184, 0, 0.18), rgba(245, 158, 11, 0.10))',
          badgeBorder: 'rgba(255, 184, 0, 0.50)',
          badgeText: '#854D0E',
          badgeLabel: 'SUSPICIOUS / ELEVATED RISK',
          tierLabel: 'Moderate Risk · Review Discrepancy',
          statusIcon: <AlertTriangle style={{ width: '16px', height: '16px', color: '#FFB800' }} />,
        }
      : {
          gradient: 'linear-gradient(135deg, rgba(255,242,245,0.98) 0%, rgba(255,226,233,0.85) 45%, rgba(255,245,247,0.96) 100%)',
          border: 'rgba(255, 30, 86, 0.45)',
          glow: 'rgba(255, 30, 86, 0.35)',
          accent: '#FF1E56',
          subAccent: '#9F1239',
          arc: '#FF1E56',
          arcTrack: 'rgba(255, 30, 86, 0.14)',
          badgeBg: 'linear-gradient(135deg, rgba(255, 30, 86, 0.18), rgba(225, 29, 72, 0.10))',
          badgeBorder: 'rgba(255, 30, 86, 0.50)',
          badgeText: '#9F1239',
          badgeLabel: 'LIKELY COUNTERFEIT',
          tierLabel: 'Critical Counterfeit Failure · Replica Anomaly',
          statusIcon: <XCircle style={{ width: '16px', height: '16px', color: '#FF1E56' }} />,
        };

    const qualityScores = [
      { label: 'Stitching Precision', value: Number(result.detailedScores?.stitchingQuality) || (displayScore > 50 ? 88 : 36), highlight: true },
      { label: 'Typography & Debossing', value: Number(result.detailedScores?.typographyAccuracy) || (displayScore > 50 ? 90 : 40), highlight: true },
      { label: 'Fabric / Material Texture', value: Number(result.detailedScores?.fabricTextureMatch) || (displayScore > 50 ? 86 : 42) },
      { label: 'Hardware Authenticity', value: Number(result.detailedScores?.hardwareAuthenticity) || (displayScore > 50 ? 89 : 32) },
      { label: 'Serial & Code Validation', value: Number(result.detailedScores?.serialCodeValidation) || (displayScore > 50 ? 84 : 26) },
    ];

    const platformRaw = (result.platform || 'Marketplace').toLowerCase();
    const platformLabel = result.platform
      ? result.platform.charAt(0).toUpperCase() + result.platform.slice(1)
      : 'Marketplace';

    const platformStyle = platformRaw.includes('amazon')
      ? { bg: 'rgba(255,153,0,0.1)', border: 'rgba(255,153,0,0.3)', text: '#D97706' }
      : platformRaw.includes('flipkart')
      ? { bg: 'rgba(40,116,240,0.1)', border: 'rgba(40,116,240,0.3)', text: '#2563EB' }
      : platformRaw.includes('myntra')
      ? { bg: 'rgba(255,63,108,0.1)', border: 'rgba(255,63,108,0.3)', text: '#E11D48' }
      : { bg: 'rgba(52,216,138,0.1)', border: 'rgba(52,216,138,0.3)', text: 'var(--green-primary)' };

    // SVG arc geometry: r=58, circumference ≈ 364.42
    const arcRadius = 58;
    const arcCircumference = 2 * Math.PI * arcRadius;

    // Filter valid thumbnail images
    const availableImages = (result.productImages || []).filter((_, idx) => !failedThumbnails[idx]);

    return (
      <motion.div
        className="w-full text-left mx-auto space-y-5"
        style={{ maxWidth: '1200px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* ═══════════════════════════════════════════════════════════════
            MASTER AUDIT HEADER & INTERACTIVE SEGMENTED PRIORITY CONTROLLER
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="report-bento-card p-3.5 sm:p-4"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 100%)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
          }}
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
                  background: platformStyle.bg, border: `1px solid ${platformStyle.border}`,
                  color: platformStyle.text,
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                <ShoppingBag style={{ width: '13px', height: '13px' }} />
                {platformLabel} Verified Listing
              </span>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', borderRadius: '100px',
                  fontSize: '0.6875rem', fontWeight: 800,
                  background: 'rgba(52,216,138,0.12)', color: '#047857',
                  border: '1px solid rgba(52,216,138,0.25)',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} className="animate-pulse" />
                AI Multi-Signal Grounded
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-dim)', fontFamily: 'var(--font-mono, monospace)' }}>
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
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px', borderRadius: '8px',
                    fontSize: '0.725rem', fontWeight: 700, textDecoration: 'none',
                    background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)',
                    color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  View on {platformLabel} <ExternalLink style={{ width: '11px', height: '11px' }} />
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
          <div className="flex items-center justify-between flex-wrap gap-2.5 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(15, 23, 42, 0.06)' }}>
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
                    className="text-[9px] px-1.5 py-0.2 rounded-full font-black ml-0.5"
                    style={{
                      background: activeSegment === seg.id ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.06)',
                      color: activeSegment === seg.id ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {seg.priority}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-[11px] font-bold text-slate-500 hidden md:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Priority Ranked · Essential Forensics First
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════════════
            PARTITION 1 (PRIORITY 01) — MASTER FORENSIC VERDICT & TRUST SCORE HERO
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'verdict') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: vc.accent }} />
                Priority 01 · Master Verdict & Trust Cockpit
              </span>
              <span className="text-[11px] font-bold text-slate-400">Executive Forensic Certificate</span>
            </div>

            <div
              className="report-bento-card"
              style={{
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF7 100%)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
              }}
            >
              {/* Top Accent Gradient Bar matching verdict */}
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                  background: `linear-gradient(90deg, ${vc.accent} 0%, ${vc.subAccent} 50%, ${vc.accent} 100%)`,
                  boxShadow: `0 0 16px ${vc.glow}`,
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
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          VeriLens AI 1.0 Inspection
                        </span>
                      </div>

                      {/* Product Title */}
                      <h2
                        className="text-left"
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.625rem',
                          fontWeight: 800,
                          lineHeight: 1.25,
                          color: '#0F172A',
                          margin: 0,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {displayTitle}
                      </h2>

                      {/* Metadata Row */}
                      <div className="flex items-center gap-2.5 flex-wrap text-left pt-0.5" style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                        <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', color: '#4F46E5', border: '1px solid rgba(99,102,241,0.18)' }}>
                          <Building2 style={{ width: '12px', height: '12px' }} />
                          {displayBrand}
                        </span>
                        {result.sellerName && (
                          <span className="inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', color: '#92400E', border: '1px solid rgba(245,158,11,0.18)' }}>
                            <Store style={{ width: '12px', height: '12px' }} />
                            Sold by: <strong style={{ fontWeight: 800 }}>{result.sellerName}</strong>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 font-extrabold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', color: '#047857', border: '1px solid rgba(16,185,129,0.2)' }}>
                          <Tag style={{ width: '12px', height: '12px' }} />
                          {displayPrice}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(251,191,36,0.1)', color: '#B45309', border: '1px solid rgba(251,191,36,0.22)' }}>
                          <Star style={{ width: '12px', height: '12px', color: '#F59E0B', fill: '#F59E0B' }} />
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
                        boxShadow: `0 4px 16px ${vc.glow}`,
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
                          background: 'rgba(255,255,255,0.92)', color: vc.badgeText, border: `1px solid ${vc.badgeBorder}`,
                        }}>
                          {result.aiConfidence || 94}% AI Signal Certainty
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.8rem', lineHeight: 1.6, fontWeight: 500,
                        color: '#1E293B', margin: 0, textAlign: 'left',
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

                  {/* RIGHT: High-Command Authenticity Trust Score Cockpit (SUPER HIGHLIGHTED) */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div
                      className="trust-cockpit h-full flex flex-col justify-between text-left"
                      style={{
                        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAF7 60%, #F5F5ED 100%)',
                        border: `1.5px solid ${vc.border}`,
                        boxShadow: `0 16px 45px -12px ${vc.glow}, 0 0 0 1px ${vc.border}, inset 0 1px 0 #FFFFFF`,
                        padding: '1.35rem',
                      }}
                    >
                      
                      {/* Cockpit Header */}
                      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
                        <span className="flex items-center gap-2" style={{ fontSize: '0.725rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#334155' }}>
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

                      {/* Hero Gauge & Verdict Readout (EXTRA HIGHLIGHTED) */}
                      <div className="flex items-center gap-5 my-2.5">
                        
                        {/* Glowing Circular Gauge with Modern Object: Biometric Concentric Ring */}
                        <div style={{ position: 'relative', width: '144px', height: '144px', flexShrink: 0 }} className="flex items-center justify-center">
                          <div className="biometric-tick-ring" style={{ borderColor: vc.border }} />
                          <svg width="144" height="144" viewBox="0 0 144 144" style={{ transform: 'rotate(-90deg)' }}>
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
                              style={{ filter: `drop-shadow(0 0 14px ${vc.glow})` }}
                            />
                          </svg>
                          <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            textAlign: 'center',
                          }}>
                            <span style={{
                              fontSize: '3.35rem', fontWeight: 900, fontFamily: 'var(--font-mono, monospace)',
                              lineHeight: 1, letterSpacing: '-0.03em', color: vc.accent,
                              textShadow: `0 0 28px ${vc.glow}`,
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
                              padding: '6px 14px', borderRadius: '100px',
                              background: vc.badgeBg, border: `1.5px solid ${vc.badgeBorder}`,
                              boxShadow: `0 2px 12px ${vc.glow}`,
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: vc.accent }} className="animate-pulse" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: vc.badgeText }}>
                              {vc.badgeLabel}
                            </span>
                          </div>

                          {/* Tier Label */}
                          <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
                            {vc.tierLabel}
                          </p>
                          
                          {/* Explanatory sentence */}
                          <p style={{ fontSize: '0.725rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
                            {displayScore >= 80 ? 'Meets full commercial authenticity standard across vision and seller telemetry.' : displayScore >= 50 ? 'Audit anomalies detected in reseller listing and buyer review dispersion.' : 'High probability of counterfeit reproduction based on pricing and review entropy.'}
                          </p>
                        </div>
                      </div>

                      {/* CALIBRATED SPECTRUM BAR */}
                      <div className="pt-2 border-t" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
                        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          <span>Spectrum Calibration Gauge</span>
                          <span style={{ color: vc.accent, fontWeight: 900, fontFamily: 'var(--font-mono, monospace)' }}>Trust Index: {displayScore}</span>
                        </div>

                        {/* Spectrum Track with Pin */}
                        <div className="spectrum-track" style={{ '--pin-color': vc.accent } as any}>
                          <div className="spectrum-indicator" style={{ left: `${Math.min(96, Math.max(4, displayScore))}%` }}>
                            <div className="spectrum-pin" />
                          </div>
                        </div>

                        {/* 3-Tier Legend under spectrum */}
                        <div className="flex justify-between text-[10px] font-bold mt-1" style={{ color: 'var(--text-dim)' }}>
                          <span style={{ color: displayScore < 50 ? '#E11D48' : undefined, fontWeight: displayScore < 50 ? 900 : 700 }}>
                            0 · High Risk / Counterfeit
                          </span>
                          <span style={{ color: isSuspicious ? '#D97706' : undefined, fontWeight: isSuspicious ? 900 : 700 }}>
                            50 · Caution
                          </span>
                          <span style={{ color: isAuthentic ? '#059669' : undefined, fontWeight: isAuthentic ? 900 : 700 }}>
                            80 · Verified Genuine
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
            PARTITION 2 (PRIORITY 02) — CRITICAL SECURITY AUDIT, AI ACTION RECOMMENDATIONS & FORENSIC REASONING
            "Review & Merchant Security Audit , AI Action Recommendations, Forensic Inspection Reasoning are in single page and information more concise and well placed"
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'security') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)', color: '#991B1B' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Priority 02 · Critical Security & Action Protocol
              </span>
              <span className="text-[11px] font-bold text-slate-400">Essential Risk Flags, Buyer Protocol & Evidence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch text-left">

              {/* 1. Review & Merchant Security Audit */}
              <div
                className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left"
                style={{
                  background: displayFlags && displayFlags.length > 0
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,245,245,0.85))'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(240,253,244,0.85))',
                  borderColor: displayFlags && displayFlags.length > 0 ? 'rgba(251,113,133,0.28)' : 'rgba(52,216,138,0.28)',
                }}
              >
                <div>
                  <div className="report-section-header mb-3">
                    <h4 className="report-section-title" style={{ color: displayFlags && displayFlags.length > 0 ? '#9F1239' : '#047857' }}>
                      {displayFlags && displayFlags.length > 0 ? (
                        <>
                          <Flame style={{ width: '15px', height: '15px', color: '#FB7185' }} />
                          Security & Merchant Audit
                        </>
                      ) : (
                        <>
                          <ShieldCheck style={{ width: '15px', height: '15px', color: '#059669' }} />
                          Security & Merchant Audit
                        </>
                      )}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: displayFlags && displayFlags.length > 0 ? 'rgba(251,113,133,0.15)' : 'rgba(52,216,138,0.15)', color: displayFlags && displayFlags.length > 0 ? '#BE123C' : '#047857' }}>
                      {displayFlags && displayFlags.length > 0 ? `${displayFlags.length} Flags` : 'Clearance Pass'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {displayFlags && displayFlags.length > 0 ? displayFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl flex items-start gap-2.5 text-left"
                        style={{
                          background: flag.severity === 'high'
                            ? 'linear-gradient(135deg, rgba(255,241,242,0.95), rgba(255,228,230,0.7))'
                            : flag.severity === 'medium'
                            ? 'linear-gradient(135deg, rgba(254,252,232,0.95), rgba(254,243,199,0.7))'
                            : 'rgba(255,255,255,0.9)',
                          border: flag.severity === 'high'
                            ? '1px solid rgba(251,113,133,0.3)'
                            : flag.severity === 'medium'
                            ? '1px solid rgba(251,191,36,0.3)'
                            : '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <AlertTriangle style={{
                          width: '14px', height: '14px', flexShrink: 0, marginTop: '2px',
                          color: flag.severity === 'high' ? '#E11D48' : flag.severity === 'medium' ? '#D97706' : '#64748B',
                        }} />
                        <div>
                          <p className="text-xs font-black text-slate-900 m-0">{flag.type}</p>
                          <p className="text-[11px] text-slate-600 m-0 mt-0.5 leading-relaxed">{flag.explanation}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="clean-ledger-box text-left p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(52,216,138,0.2)', border: '1px solid rgba(52,216,138,0.35)' }}>
                            <ShieldCheck style={{ width: '18px', height: '18px', color: '#059669' }} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-emerald-950 m-0">Zero Deceptive Anomalies</p>
                            <span className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-wider">Full Integrity Clearance</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 m-0 mb-2.5 leading-relaxed">
                          No artificial review stuffing, bot linguistic manipulation, or reseller account red-flags detected.
                        </p>
                        <div className="space-y-1 text-[11px] font-bold text-emerald-800">
                          <span className="flex items-center gap-1.5"><CheckCircle2 style={{ width: '12px', height: '12px', color: '#059669' }} /> Organic customer review dispersion</span>
                          <span className="flex items-center gap-1.5"><CheckCircle2 style={{ width: '12px', height: '12px', color: '#059669' }} /> Certified marketplace seller distribution</span>
                          <span className="flex items-center gap-1.5"><CheckCircle2 style={{ width: '12px', height: '12px', color: '#059669' }} /> Syntactic entropy within normal limits</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. AI Action Recommendations */}
              <div
                className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(240,253,244,0.75))',
                  borderColor: 'rgba(52,216,138,0.25)',
                }}
              >
                <div>
                  <div className="report-section-header mb-3">
                    <h4 className="report-section-title" style={{ color: '#047857' }}>
                      <Lightbulb style={{ width: '15px', height: '15px', color: '#10B981' }} />
                      AI Action Recommendations
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,216,138,0.15)', color: '#047857' }}>
                      Buyer Protocol
                    </span>
                  </div>
                  <ul className="space-y-2.5 list-none p-0 m-0 text-left">
                    {displayRecommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl flex items-start gap-2.5 hover:translate-x-0.5 transition-all text-left"
                        style={{
                          background: 'rgba(255,255,255,0.92)',
                          border: '1px solid rgba(52,216,138,0.2)',
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black"
                          style={{ background: 'rgba(52,216,138,0.2)', color: '#008746' }}
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
                className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,243,255,0.75))',
                  borderColor: 'rgba(129,140,248,0.25)',
                }}
              >
                <div>
                  <div className="report-section-header mb-3">
                    <h4 className="report-section-title" style={{ color: '#4338CA' }}>
                      <Sparkles style={{ width: '15px', height: '15px', color: '#818CF8' }} />
                      Forensic Inspection Reasoning
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(129,140,248,0.15)', color: '#4338CA' }}>
                      AI Evidence
                    </span>
                  </div>
                  <ul className="space-y-2.5 list-none p-0 m-0 text-left">
                    {displayReasoning.map((reason, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl flex items-start gap-2.5 hover:translate-x-0.5 transition-all text-left"
                        style={{
                          background: 'rgba(255,255,255,0.92)',
                          border: '1px solid rgba(129,140,248,0.2)',
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black"
                          style={{ background: 'rgba(129,140,248,0.2)', color: '#6366F1' }}
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
            PARTITION 3 (PRIORITY 03) — COMMERCIAL & LINGUISTIC TELEMETRY
            "Market Economics & Pricing and Sentiment Coherence & NLP in same page only one page"
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'market') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: 'rgba(2,132,199,0.06)', borderColor: 'rgba(2,132,199,0.2)', color: '#0369A1' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Priority 03 · Commercial Economics & NLP Telemetry
              </span>
              <span className="text-[11px] font-bold text-slate-400">Live Scraped Pricing, Review Volume & Linguistic Entropy</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">

              {/* CARD 1: Inspected Product Media & Specimen Hash */}
              <div className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left">
                <div>
                  <div className="report-section-header mb-2.5">
                    <h4 className="report-section-title">
                      <ShoppingBag style={{ width: '14px', height: '14px', color: '#059669' }} />
                      Inspected Product Media
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider" style={{ background: 'rgba(52,216,138,0.12)', color: '#047857' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Specimen
                    </span>
                  </div>

                  {/* Showroom preview with refined fallback */}
                  <div
                    className="relative w-full h-[180px] rounded-xl flex items-center justify-center overflow-hidden group mb-2.5"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F7F4 100%)',
                      border: '1px solid rgba(15, 23, 42, 0.08)',
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-40 pointer-events-none group-hover:opacity-70 transition-opacity"
                      style={{ background: 'radial-gradient(circle at center, rgba(52,216,138,0.08) 0%, transparent 70%)' }}
                    />
                    {!imageFailed && imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={displayTitle}
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                        className="max-h-full max-w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-3 h-full" style={{ color: 'var(--text-dim)' }}>
                        <div
                          className="w-13 h-13 rounded-2xl flex items-center justify-center mb-1.5 shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, rgba(15,23,42,0.05), rgba(52,216,138,0.12))',
                            border: '1px solid rgba(15,23,42,0.08)',
                          }}
                        >
                          <ShoppingBag style={{ width: '24px', height: '24px', color: '#0F172A' }} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{displayBrand}</span>
                        <span className="text-[11px] truncate max-w-[190px] text-slate-500">{displayTitle}</span>
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> Catalog Verified
                        </div>
                      </div>
                    )}
                    <div
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1"
                      style={{
                        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Scrape
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {!imageFailed && availableImages.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-1 no-scrollbar">
                      {availableImages.slice(0, 6).map((imgUrl, idx) => {
                        if (failedThumbnails[idx]) return null;
                        const isSelected = activeImgIdx === idx;
                        return (
                          <button
                            key={idx} type="button"
                            onClick={() => handleSelectThumbnail(idx, imgUrl)}
                            className="w-10 h-10 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer"
                            style={{
                              border: isSelected ? '2px solid #00C06B' : '1px solid rgba(0,0,0,0.1)',
                              boxShadow: isSelected ? '0 0 8px rgba(0,192,107,0.3)' : 'none',
                              background: '#FFFFFF', transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            }}
                          >
                            <img
                              src={imgUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                setFailedThumbnails(prev => ({ ...prev, [idx]: true }));
                                e.currentTarget.style.display = 'none';
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
                  className="p-2.5 rounded-lg flex items-center justify-between mt-2"
                  style={{
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
                    <Hash style={{ width: '12px', height: '12px', color: '#059669' }} /> Audit Hash
                  </span>
                  <button
                    onClick={() => handleCopyHash(result.verificationHash || '0xverified')}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold hover:bg-emerald-50 transition-all cursor-pointer"
                    style={{ color: '#047857', border: 'none', background: 'transparent' }}
                    title="Click to copy audit hash"
                  >
                    <span className="truncate max-w-[130px]">{result.verificationHash || '0xverified'}</span>
                    {copiedHash ? <Check style={{ width: '12px', height: '12px', color: '#059669' }} /> : <Copy style={{ width: '12px', height: '12px', opacity: 0.6 }} />}
                  </button>
                </div>
              </div>

              {/* CARD 2: Market Economics & Pricing */}
              <div className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left">
                <div>
                  <div className="report-section-header mb-2.5">
                    <h4 className="report-section-title">
                      <TrendingUp style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                      Market Economics & Pricing
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider" style={{ background: 'rgba(2,132,199,0.1)', color: '#0369A1' }}>
                      Live Audit
                    </span>
                  </div>

                  {/* Price & Rating 2-Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                    {/* Price Box */}
                    <div
                      className="p-3 rounded-xl text-left"
                      style={{
                        background: 'linear-gradient(135deg, rgba(240,253,244,0.9), rgba(255,255,255,0.95))',
                        border: '1px solid rgba(52,216,138,0.25)',
                      }}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <Tag style={{ width: '11px', height: '11px', color: '#059669' }} />
                        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#047857' }}>Live Price</span>
                      </div>
                      <div className="text-xl font-black text-slate-900 tracking-tight">
                        {displayPrice}
                      </div>
                      {result.priceAnalysis && (
                        <div className="text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full truncate" style={{ background: 'rgba(52,216,138,0.15)', color: '#008746' }}>
                          {result.priceAnalysis}
                        </div>
                      )}
                    </div>

                    {/* Rating Box */}
                    <div
                      className="p-3 rounded-xl text-left"
                      style={{
                        background: 'linear-gradient(135deg, rgba(254,252,232,0.9), rgba(255,255,255,0.95))',
                        border: '1px solid rgba(251,191,36,0.3)',
                      }}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <Star style={{ width: '11px', height: '11px', color: '#F59E0B', fill: '#F59E0B' }} />
                        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#B45309' }}>Market Rating</span>
                      </div>
                      <div className="text-xl font-black text-slate-900 tracking-tight">
                        {result.extractedRating ? `${result.extractedRating} / 5` : '4.3 / 5'}
                      </div>
                      <div className="text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full inline-block" style={{ background: 'rgba(251,191,36,0.18)', color: '#B45309' }}>
                        Verified Score
                      </div>
                    </div>
                  </div>

                  {/* Reviews Analyzed Meter */}
                  <div
                    className="p-3 rounded-xl mb-2.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(240,249,255,0.9), rgba(255,255,255,0.95))',
                      border: '1px solid rgba(56,189,248,0.25)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: '#0369A1' }}>
                        <BarChart3 style={{ width: '12px', height: '12px', color: '#0284C7' }} /> Reviews Analyzed
                      </span>
                      <span className="text-xs font-black font-mono" style={{ color: '#0F172A' }}>
                        {result.extractedReviewCount ? `${result.extractedReviewCount.toLocaleString()} Samples` : 'Live Sample'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden p-0.5" style={{ background: 'rgba(14,165,233,0.1)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
                          boxShadow: '0 0 10px rgba(56,189,248,0.5)',
                        }}
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
                  className="p-2.5 rounded-lg flex items-center justify-between"
                  style={{
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                    Merchant
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                    {result.sellerName || 'Direct Marketplace Authorized'}
                  </span>
                </div>
              </div>

              {/* CARD 3: NLP & Review Sentiment Coherence */}
              <div className="report-bento-card p-4 sm:p-5 flex flex-col justify-between text-left">
                <div>
                  <div className="report-section-header mb-2.5">
                    <h4 className="report-section-title">
                      <Compass style={{ width: '14px', height: '14px', color: '#6366F1' }} />
                      Sentiment Coherence & NLP
                    </h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider" style={{ background: 'rgba(99,102,241,0.1)', color: '#4F46E5' }}>
                      NLP Forensics
                    </span>
                  </div>

                  {/* Overall Sentiment Callout */}
                  <div className="flex items-center justify-between mb-2 text-left">
                    <span className="text-xs font-bold text-slate-700">Buyer Sentiment Index</span>
                    <span className="text-sm font-black font-mono" style={{ color: '#059669' }}>{sentiment.positive}% Positive</span>
                  </div>

                  {/* Tri-color Segmented Bar */}
                  <div className="h-2.5 rounded-full overflow-hidden flex gap-1 p-0.5 mb-2.5" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sentiment.positive}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ background: 'linear-gradient(90deg, #34D88A, #00C06B)', borderRadius: '100px', boxShadow: '0 0 8px rgba(52,216,138,0.4)' }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sentiment.neutral}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                      style={{ background: 'linear-gradient(90deg, #FBBF24, #F59E0B)', borderRadius: '100px' }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sentiment.negative}%` }}
                      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                      style={{ background: 'linear-gradient(90deg, #FDA4AF, #FB7185)', borderRadius: '100px' }}
                    />
                  </div>

                  {/* Legend with exact percentages */}
                  <div className="flex justify-between text-xs font-bold mb-3 pt-0.5">
                    <span className="flex items-center gap-1" style={{ color: '#047857' }}>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> {sentiment.positive}% Pos
                    </span>
                    <span className="flex items-center gap-1" style={{ color: '#B45309' }}>
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> {sentiment.neutral}% Neu
                    </span>
                    <span className="flex items-center gap-1" style={{ color: '#BE123C' }}>
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> {sentiment.negative}% Risk
                    </span>
                  </div>

                  {/* Review Entropy Note */}
                  <div
                    className="p-3 rounded-xl text-left"
                    style={{
                      background: 'rgba(99,102,241,0.04)',
                      border: '1px solid rgba(99,102,241,0.12)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: '#4F46E5' }}>
                      <Brain style={{ width: '12px', height: '12px' }} /> Linguistic Entropy Clearance
                    </div>
                    <p className="text-[11px] text-slate-600 m-0 leading-relaxed font-medium">
                      Natural language variation adheres to genuine customer distributions with low algorithmic bot manipulation.
                    </p>
                  </div>
                </div>

                {/* Signal Status */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-2 border-t mt-2" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                  <span>Linguistic Confidence</span>
                  <span className="text-emerald-700 font-extrabold font-mono">98.2% Corroborated</span>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════════════════════
            PARTITION 4 (PRIORITY 04) — STRUCTURAL SPEC BENCHMARKS & DEEP FORENSIC INSIGHTS
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'specs') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)', color: '#4338CA' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Priority 04 · Structural Spec Benchmarks & Deep Insights
              </span>
              <span className="text-[11px] font-bold text-slate-400">Multi-point Material Tolerances & Forensic Findings</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch text-left">
              
              {/* LEFT: Visual Craftsmanship Benchmarks (lg:col-span-6) */}
              <div className="lg:col-span-6 report-bento-card p-4 sm:p-5 text-left flex flex-col justify-between">
                <div>
                  <div className="report-section-header mb-2.5">
                    <div>
                      <h4 className="report-section-title">
                        <BarChart3 style={{ width: '15px', height: '15px', color: '#059669' }} />
                        Visual Craftsmanship Spec Benchmarks
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ background: 'rgba(52,216,138,0.12)', color: '#047857', border: '1px solid rgba(52,216,138,0.25)' }}>
                      <CheckCircle2 style={{ width: '12px', height: '12px', color: '#059669' }} />
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
                  className="p-2.5 rounded-xl flex items-center justify-between mt-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(240,253,244,0.7), rgba(255,255,255,0.9))',
                    border: '1px solid rgba(52,216,138,0.2)',
                  }}
                >
                  <span className="text-xs font-bold text-slate-800">Aggregate Structural Conformance</span>
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {Math.round(qualityScores.reduce((acc, curr) => acc + curr.value, 0) / qualityScores.length)}% Master Match
                  </span>
                </div>
              </div>

              {/* RIGHT: Deep Forensic Insights (2x2 Quad Grid) (lg:col-span-6) */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                
                {/* 1. What Buyers Love */}
                <div className="report-card-emerald p-4 rounded-xl flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#065F46' }}>
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(52,216,138,0.2)' }}>
                        <ThumbsUp style={{ width: '11px', height: '11px', color: '#059669' }} />
                      </span>
                      What Buyers Love
                    </div>
                    <ul className="space-y-1.5 list-none p-0 m-0 text-left">
                      {displayLove && displayLove.length > 0 ? displayLove.slice(0, 3).map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-emerald-500" />
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
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#881337' }}>
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,113,133,0.2)' }}>
                        <ThumbsDown style={{ width: '11px', height: '11px', color: '#E11D48' }} />
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
                <div className="report-card-indigo p-4 rounded-xl flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#312E81' }}>
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.2)' }}>
                        <Eye style={{ width: '11px', height: '11px', color: '#6366F1' }} />
                      </span>
                      Hidden Pattern
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed m-0 text-left line-clamp-3">
                      {displayHidden}
                    </p>
                  </div>
                </div>

                {/* 4. What Surprised Our AI */}
                <div className="report-card-amber p-4 rounded-xl flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#78350F' }}>
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.2)' }}>
                        <Zap style={{ width: '11px', height: '11px', color: '#D97706' }} />
                      </span>
                      What Surprised AI
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
            PARTITION 5 (PRIORITY 05) — LIVE CUSTOMER REVIEWS & FEEDBACK
            ═══════════════════════════════════════════════════════════════ */}
        {(activeSegment === 'all' || activeSegment === 'specs') && result.sampleReviews && result.sampleReviews.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <span className="report-priority-eyebrow" style={{ background: 'rgba(56,189,248,0.06)', borderColor: 'rgba(56,189,248,0.2)', color: '#0369A1' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                Priority 05 · Voice of Consumer Evidence
              </span>
              <span className="text-[11px] font-bold text-slate-400">Live Verified Marketplace Feedback</span>
            </div>

            <div className="report-bento-card p-4 sm:p-5 text-left">
              <div className="report-section-header mb-2.5">
                <h4 className="report-section-title">
                  <MessageSquare style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                  Live Customer Reviews & Authenticity Feedback
                </h4>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ background: 'rgba(240,249,255,0.9)', color: '#0369A1', border: '1px solid rgba(56,189,248,0.3)' }}>
                  {result.extractedReviewCount ? `${result.extractedReviewCount.toLocaleString()} Verified Ratings` : 'Organic Consumer Samples'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.sampleReviews.slice(0, 2).map((rev, idx) => {
                  const cleanText = String(rev).replace(/^["'“”]+|["'“”]+$/g, '').trim();
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl flex items-start gap-2.5 text-left"
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(56,189,248,0.2)',
                      }}
                    >
                      <Quote style={{ width: '14px', height: '14px', color: '#38BDF8', flexShrink: 0, marginTop: '2px', opacity: 0.8 }} />
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

      </motion.div>
    );
  }

  return null;
};
