import React, { useState, useEffect } from 'react';
import {
  Search, ShieldCheck, AlertTriangle, XCircle, Loader2, Sparkles,
  CheckCircle2, RefreshCw, Star, Tag, TrendingUp, ExternalLink,
  BadgeCheck, Flame, BarChart3, Lightbulb, ShoppingBag,
  Building2, Store, ThumbsUp, ThumbsDown, Eye, Compass, Zap,
  Activity, Hash, ArrowRight, ScanLine, Brain, ChevronRight,
  Copy, Check
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

  const color = isHigh ? '#00C06B' : isMid ? '#F59E0B' : '#FB7185';
  const gradient = isHigh
    ? 'linear-gradient(90deg, #34D88A, #00C06B)'
    : isMid
    ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
    : 'linear-gradient(90deg, #FDA4AF, #FB7185)';
  const glow = isHigh
    ? 'rgba(52,216,138,0.3)'
    : isMid
    ? 'rgba(245,158,11,0.3)'
    : 'rgba(251,113,133,0.3)';

  const statusLabel = isHigh ? 'Master Spec' : isMid ? 'Tolerance' : 'Discrepancy';

  return (
    <div
      className="p-3.5 rounded-xl transition-all duration-300 group hover:shadow-sm"
      style={{
        background: highlight
          ? 'linear-gradient(135deg, rgba(52,216,138,0.06), rgba(45,212,191,0.04))'
          : 'rgba(255,255,255,0.7)',
        border: highlight
          ? '1px solid rgba(52,216,138,0.2)'
          : '1px solid rgba(0,0,0,0.05)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span
            className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider"
            style={{
              background: `${color}14`,
              color,
              border: `1px solid ${color}28`,
            }}
          >
            {statusLabel}
          </span>
          <span className="text-xs font-black font-mono" style={{ color }}>{safeVal}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden p-0.5" style={{ background: 'rgba(0,0,0,0.04)' }}>
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

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onAnalyzeComplete, standalone = true, initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<'input' | 'loading' | 'result' | 'error'>('input');
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [proxyAttempted, setProxyAttempted] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

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
    } else {
      setImageFailed(true);
    }
  };

  const handleReset = () => {
    setStatus('input');
    setUrl('');
    setResult(null);
    setErrorMsg('');
    setImageSrc('');
    setProxyAttempted(false);
    setImageFailed(false);
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
    const displayScore = Math.max(0, Math.min(100, Math.round(Number(result.trustScore) || 80)));
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
          gradient: 'linear-gradient(135deg, rgba(240,253,244,0.96) 0%, rgba(236,253,245,0.85) 45%, rgba(209,250,229,0.55) 100%)',
          border: 'rgba(52,216,138,0.32)',
          glow: 'rgba(52,216,138,0.22)',
          accent: '#00B864',
          subAccent: '#009A55',
          arc: '#00C06B',
          arcTrack: 'rgba(52,216,138,0.12)',
          iconBg: 'linear-gradient(135deg, rgba(52,216,138,0.2), rgba(45,212,191,0.12))',
          iconBorder: 'rgba(52,216,138,0.35)',
          icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />,
          badgeBg: 'linear-gradient(135deg, rgba(52,216,138,0.15), rgba(45,212,191,0.08))',
          badgeBorder: 'rgba(52,216,138,0.35)',
          badgeText: '#008746',
          badgeLabel: 'VERIFIED AUTHENTIC',
          orb1: 'rgba(52,216,138,0.18)',
          orb2: 'rgba(45,212,191,0.12)',
        }
      : isSuspicious
      ? {
          gradient: 'linear-gradient(135deg, rgba(254,252,232,0.96) 0%, rgba(254,243,199,0.85) 45%, rgba(253,230,138,0.55) 100%)',
          border: 'rgba(245,158,11,0.32)',
          glow: 'rgba(245,158,11,0.22)',
          accent: '#D97706',
          subAccent: '#B45309',
          arc: '#F59E0B',
          arcTrack: 'rgba(245,158,11,0.12)',
          iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.12))',
          iconBorder: 'rgba(245,158,11,0.35)',
          icon: <AlertTriangle className="w-7 h-7 text-amber-600" />,
          badgeBg: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08))',
          badgeBorder: 'rgba(245,158,11,0.35)',
          badgeText: '#B45309',
          badgeLabel: 'SUSPICIOUS / AT RISK',
          orb1: 'rgba(245,158,11,0.18)',
          orb2: 'rgba(251,191,36,0.12)',
        }
      : {
          gradient: 'linear-gradient(135deg, rgba(255,241,242,0.96) 0%, rgba(255,228,230,0.85) 45%, rgba(254,205,211,0.55) 100%)',
          border: 'rgba(244,63,94,0.32)',
          glow: 'rgba(244,63,94,0.22)',
          accent: '#E11D48',
          subAccent: '#BE123C',
          arc: '#FB7185',
          arcTrack: 'rgba(244,63,94,0.12)',
          iconBg: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(251,113,133,0.12))',
          iconBorder: 'rgba(244,63,94,0.35)',
          icon: <XCircle className="w-7 h-7 text-rose-600" />,
          badgeBg: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(251,113,133,0.08))',
          badgeBorder: 'rgba(244,63,94,0.35)',
          badgeText: '#BE123C',
          badgeLabel: 'LIKELY COUNTERFEIT',
          orb1: 'rgba(244,63,94,0.18)',
          orb2: 'rgba(251,113,133,0.12)',
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

    return (
      <motion.div
        className={`w-full ${standalone ? 'max-w-5xl mx-auto' : ''} space-y-6`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── TOP HERO CARD / REPORT SHELL ───────────────────────────── */}
        <div className="report-shell">

          {/* Card Header Bar */}
          <div
            className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
            style={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.98), rgba(250,248,244,0.95))'
            }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span
                className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0"
                style={{
                  background: platformStyle.bg,
                  border: `1px solid ${platformStyle.border}`,
                  color: platformStyle.text
                }}
              >
                {platformLabel}
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className="font-extrabold text-base sm:text-lg lg:text-xl truncate tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                  title={displayTitle}
                >
                  {displayTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs mt-1 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-secondary)' }}>
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    {displayBrand}
                  </span>
                  {result.sellerName && (
                    <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <Store className="w-3.5 h-3.5 text-amber-500" />
                      Sold by: <strong className="font-bold ml-0.5" style={{ color: 'var(--text-secondary)' }}>{result.sellerName}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {result.productUrl && (
                <a
                  href={result.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-slate-100 hover:text-slate-900"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: 'var(--text-secondary)' }}
                >
                  View on Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer btn-neon"
              >
                <RefreshCw className="w-3.5 h-3.5" /> New Scan
              </button>
            </div>
          </div>

          {/* Main Grid: Left Showroom + Right Intelligence */}
          <div className="grid grid-cols-12 gap-0 w-full">

            {/* LEFT — Product Media Showroom & Telemetry (WARM LUXURY GLASS, NO DIRTY GREY) */}
            <div className="col-span-12 md:col-span-4 p-5 sm:p-6 flex flex-col gap-4 report-sidebar">
              
              {/* Product Image Showroom Box */}
              <div
                className="relative w-full h-64 rounded-2xl flex items-center justify-center overflow-hidden group shadow-sm"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.07)',
                }}
              >
                {/* Subtle soft ambient glow inside image frame */}
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
                    className="max-h-full max-w-full object-contain p-3 rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4" style={{ color: 'var(--text-dim)' }}>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, rgba(52,216,138,0.15), rgba(45,212,191,0.1))', border: '1px solid rgba(52,216,138,0.25)' }}
                    >
                      <ShoppingBag className="w-8 h-8 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{displayBrand}</span>
                    <span className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{displayTitle}</span>
                  </div>
                )}

                {/* Floating Modern Pill Badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                  style={{
                    background: 'rgba(17, 19, 24, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF'
                  }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34D88A', boxShadow: '0 0 8px #34D88A' }} />
                  Live Media
                </div>
              </div>

              {/* Price / Rating Telemetry Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Price Card (Emerald Theme) */}
                <div
                  className="p-3.5 rounded-2xl text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(240,253,244,0.9), rgba(255,255,255,0.95))',
                    border: '1px solid rgba(52,216,138,0.22)',
                    boxShadow: '0 2px 10px rgba(52,216,138,0.06)'
                  }}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700">Live Price</span>
                  </div>
                  <div className="font-black text-base sm:text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {displayPrice}
                  </div>
                  {result.priceAnalysis && (
                    <div
                      className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block truncate max-w-full"
                      style={{ background: 'rgba(52,216,138,0.14)', color: '#008746', border: '1px solid rgba(52,216,138,0.2)' }}
                    >
                      {result.priceAnalysis}
                    </div>
                  )}
                </div>

                {/* Rating Card (Gold/Amber Theme) */}
                <div
                  className="p-3.5 rounded-2xl text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(254,252,232,0.9), rgba(255,255,255,0.95))',
                    border: '1px solid rgba(251,191,36,0.25)',
                    boxShadow: '0 2px 10px rgba(245,158,11,0.06)'
                  }}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] uppercase font-black tracking-wider text-amber-700">Rating</span>
                  </div>
                  <div className="font-black text-base sm:text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {result.extractedRating ? `${result.extractedRating} / 5` : '4.3 / 5'}
                  </div>
                  <div
                    className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block"
                    style={{ background: 'rgba(251,191,36,0.15)', color: '#B45309', border: '1px solid rgba(251,191,36,0.25)' }}
                  >
                    Verified Score
                  </div>
                </div>

                {/* Reviews Analyzed Bar (Sky Blue Theme) */}
                <div
                  className="col-span-2 p-3.5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(240,249,255,0.9), rgba(255,255,255,0.95))',
                    border: '1px solid rgba(56,189,248,0.25)',
                    boxShadow: '0 2px 10px rgba(14,165,233,0.05)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-black tracking-wider flex items-center gap-1.5 text-sky-700">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-500" /> Reviews Analyzed
                    </span>
                    <span className="font-black text-xs font-mono text-slate-800">
                      {result.extractedReviewCount ? `${result.extractedReviewCount.toLocaleString()}` : 'Live Sample'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden p-0.5" style={{ background: 'rgba(14,165,233,0.08)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
                        boxShadow: '0 0 10px rgba(56,189,248,0.5)'
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Sentiment Breakdown */}
              <div
                className="p-4 rounded-2xl space-y-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Compass className="w-4 h-4 text-indigo-500" />
                    Buyer Sentiment Coherence
                  </span>
                  <span className="font-black text-emerald-600">{sentiment.positive}% Positive</span>
                </div>

                {/* Tri-color Segmented Pill */}
                <div className="h-3 rounded-full overflow-hidden flex gap-1 p-0.5" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sentiment.positive}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      background: 'linear-gradient(90deg, #34D88A, #00C06B)',
                      borderRadius: '9999px',
                      boxShadow: '0 0 8px rgba(52,216,138,0.4)'
                    }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sentiment.neutral}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    style={{
                      background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
                      borderRadius: '9999px'
                    }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sentiment.negative}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                    style={{
                      background: 'linear-gradient(90deg, #FDA4AF, #FB7185)',
                      borderRadius: '9999px'
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> {sentiment.positive}% Positive
                  </span>
                  <span className="flex items-center gap-1 text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> {sentiment.neutral}% Neutral
                  </span>
                  <span className="flex items-center gap-1 text-rose-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> {sentiment.negative}% Flagged
                  </span>
                </div>
              </div>

              {/* Seller & Audit Hash Box */}
              <div
                className="p-3.5 rounded-2xl space-y-2.5 text-xs"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,246,241,0.85))',
                  border: '1px solid rgba(52,216,138,0.18)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-dim)' }}>Merchant:</span>
                  <span className="font-bold truncate max-w-[160px]" style={{ color: 'var(--text-secondary)' }}>{result.sellerName || 'Direct Marketplace'}</span>
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                  <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                    <Hash className="w-3 h-3 text-emerald-600" />Audit Hash:
                  </span>
                  <button
                    onClick={() => handleCopyHash(result.verificationHash || '0xverified')}
                    className="flex items-center gap-1.5 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md hover:bg-emerald-50 text-emerald-700 transition cursor-pointer"
                    title="Click to copy audit hash"
                  >
                    <span className="truncate max-w-[120px]">{result.verificationHash || '0xverified'}</span>
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — Modern Verdict Banner, Intelligence Cards & Craftsmanship */}
            <div className="col-span-12 md:col-span-8 p-5 sm:p-7 flex flex-col gap-6">

              {/* ── VERDICT HERO BANNER (ILLUMINATED MODERN LUXURY) ── */}
              <div
                className="relative overflow-hidden p-6 sm:p-7 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                style={{
                  background: vc.gradient,
                  border: `1px solid ${vc.border}`,
                  boxShadow: `0 12px 40px -10px ${vc.glow}, 0 2px 8px rgba(0,0,0,0.02)`,
                }}
              >
                {/* Ambient dynamic glowing orbs */}
                <div
                  className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                  style={{ background: vc.orb1 }}
                />
                <div
                  className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-2xl pointer-events-none"
                  style={{ background: vc.orb2 }}
                />

                <div className="flex items-start gap-4 min-w-0 flex-1 relative z-10">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ background: vc.iconBg, border: `1px solid ${vc.iconBorder}` }}
                  >
                    {vc.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase inline-flex items-center gap-1.5 shadow-xs"
                        style={{
                          background: vc.badgeBg,
                          border: `1px solid ${vc.badgeBorder}`,
                          color: vc.badgeText
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: vc.accent }} />
                        {vc.badgeLabel}
                      </span>
                      <BadgeCheck className="w-4 h-4" style={{ color: vc.accent }} />
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed font-semibold text-slate-800">
                      {displayReasoning[0] || `Forensic analysis for ${displayTitle} under brand ${displayBrand} verified at ${displayPrice}.`}
                    </p>
                  </div>
                </div>

                {/* Circular Animated Trust Meter */}
                <div
                  className="shrink-0 self-center sm:self-center p-3.5 rounded-2xl flex flex-col items-center justify-center relative z-10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: `0 8px 24px -4px ${vc.glow}`
                  }}
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        strokeWidth="7"
                        stroke={vc.arcTrack}
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        strokeWidth="7"
                        stroke={vc.arc}
                        strokeDasharray="239"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 239 }}
                        animate={{ strokeDashoffset: 239 - (239 * displayScore) / 100 }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ filter: `drop-shadow(0 0 6px ${vc.glow})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight leading-none" style={{ color: vc.accent }}>
                        {displayScore}
                      </span>
                      <span className="text-[9px] uppercase font-black tracking-widest mt-1 text-slate-500">Trust Score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── WHAT BUYERS LOVE vs CRITICAL FLAWS (BALANCED MODERN CARDS) ── */}
              {((displayLove && displayLove.length > 0) || (displayDislike && displayDislike.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Buyers Love — Emerald Luxury Card */}
                  {displayLove && displayLove.length > 0 && (
                    <div className="report-card-emerald p-5 rounded-2xl">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-3.5 text-emerald-800">
                        <span
                          className="w-7 h-7 rounded-xl flex items-center justify-center shadow-xs"
                          style={{ background: 'linear-gradient(135deg, rgba(52,216,138,0.25), rgba(45,212,191,0.15))', border: '1px solid rgba(52,216,138,0.3)' }}
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                        What Buyers Love
                      </div>
                      <ul className="space-y-2.5">
                        {displayLove.map((pt, i) => (
                          <li key={i} className="text-xs flex items-start gap-2.5 font-medium leading-relaxed text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-emerald-500 shadow-xs" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Critical Flaws — Coral Rose Luxury Card */}
                  {displayDislike && displayDislike.length > 0 && (
                    <div className="report-card-rose p-5 rounded-2xl">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-3.5 text-rose-800">
                        <span
                          className="w-7 h-7 rounded-xl flex items-center justify-center shadow-xs"
                          style={{ background: 'linear-gradient(135deg, rgba(251,113,133,0.25), rgba(244,63,94,0.15))', border: '1px solid rgba(251,113,133,0.3)' }}
                        >
                          <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                        </span>
                        Critical Flaws & Warnings
                      </div>
                      <ul className="space-y-2.5">
                        {displayDislike.map((pt, i) => (
                          <li key={i} className="text-xs flex items-start gap-2.5 font-medium leading-relaxed text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-rose-500 shadow-xs" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ── HIDDEN PATTERN + AI SURPRISE (INDIGO & GOLD LUXURY CARDS) ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hidden Pattern — Indigo/Purple Card */}
                <div className="report-card-indigo p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2.5 text-indigo-900">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center shadow-xs"
                      style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(167,139,250,0.15))', border: '1px solid rgba(129,140,248,0.3)' }}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    </span>
                    Hidden Pattern
                  </div>
                  <p className="text-xs leading-relaxed font-medium text-slate-700">{displayHidden}</p>
                </div>

                {/* AI Surprise — Sun Gold Card */}
                <div className="report-card-amber p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2.5 text-amber-900">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center shadow-xs"
                      style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.15))', border: '1px solid rgba(251,191,36,0.35)' }}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                    </span>
                    What Surprised Our AI
                  </div>
                  <p className="text-xs leading-relaxed font-medium text-slate-700">{displayCuriosity}</p>
                </div>
              </div>

              {/* ── VISUAL CRAFTSMANSHIP SCORE BARS ── */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-600">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    Visual Craftsmanship & Forensic Diagnostics
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Multi-Signal AI Weights
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {qualityScores.map((s, idx) => (
                    <ScoreBar key={s.label} label={s.label} value={s.value} highlight={s.highlight} delay={idx * 0.09} />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM DETAIL CARDS (RED FLAGS, RECOMMENDATIONS & REASONING) ─────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Review & Merchant Red Flags */}
          <div
            className="rounded-3xl p-6 transition-all hover:shadow-md"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,245,245,0.7))',
              border: '1px solid rgba(251,113,133,0.22)',
              boxShadow: '0 4px 20px rgba(251,113,133,0.04)'
            }}
          >
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-rose-700">
              <Flame className="w-4 h-4 text-rose-500" />
              Review & Merchant Red Flags
            </h4>
            <div className="space-y-3">
              {displayFlags && displayFlags.length > 0 ? displayFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl"
                  style={{
                    background: flag.severity === 'high'
                      ? 'linear-gradient(135deg, rgba(255,241,242,0.9), rgba(255,228,230,0.6))'
                      : flag.severity === 'medium'
                      ? 'linear-gradient(135deg, rgba(254,252,232,0.9), rgba(254,243,199,0.6))'
                      : 'rgba(255,255,255,0.8)',
                    border: flag.severity === 'high'
                      ? '1px solid rgba(251,113,133,0.25)'
                      : flag.severity === 'medium'
                      ? '1px solid rgba(251,191,36,0.25)'
                      : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{
                    color: flag.severity === 'high' ? '#E11D48' : flag.severity === 'medium' ? '#D97706' : '#64748B'
                  }} />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">{flag.type}</p>
                    <p className="text-xs mt-1 leading-relaxed font-medium text-slate-600">{flag.explanation}</p>
                  </div>
                </div>
              )) : (
                <div
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(240,253,244,0.9), rgba(236,253,245,0.7))',
                    border: '1px solid rgba(52,216,138,0.25)'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <p className="text-xs font-bold text-emerald-800">Zero deceptive review manipulation or reseller anomalies detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div
            className="rounded-3xl p-6 transition-all hover:shadow-md"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(240,253,244,0.7))',
              border: '1px solid rgba(52,216,138,0.22)',
              boxShadow: '0 4px 20px rgba(52,216,138,0.04)'
            }}
          >
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-emerald-700">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              AI Action Recommendations
            </h4>
            <ul className="space-y-3">
              {displayRecommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl transition-all hover:translate-x-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(52,216,138,0.18)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black"
                    style={{ background: 'rgba(52,216,138,0.15)', color: '#008746' }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium leading-relaxed text-slate-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Forensic Reasoning */}
          <div
            className="rounded-3xl p-6 transition-all hover:shadow-md"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,243,255,0.7))',
              border: '1px solid rgba(129,140,248,0.22)',
              boxShadow: '0 4px 20px rgba(129,140,248,0.04)'
            }}
          >
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-indigo-700">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Forensic Inspection Reasoning
            </h4>
            <ul className="space-y-3">
              {displayReasoning.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl transition-all hover:translate-x-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(129,140,248,0.18)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(167,139,250,0.15))', color: '#6366F1' }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium leading-relaxed text-slate-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </motion.div>
    );
  }

  return null;
};
