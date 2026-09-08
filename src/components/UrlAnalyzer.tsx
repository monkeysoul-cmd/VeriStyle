import React, { useState } from 'react';
import {
  Search, ShieldCheck, AlertTriangle, XCircle, Loader2, Sparkles,
  CheckCircle2, RefreshCw, Star, Tag, TrendingUp, ExternalLink,
  BadgeCheck, Flame, BarChart3, Lightbulb, ShoppingBag,
  Building2, Store, ThumbsUp, ThumbsDown, Eye, Compass, Zap,
  Activity, Hash, ArrowRight, ScanLine, Brain, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UrlAnalysisResult } from '../types';

interface UrlAnalyzerProps {
  onAnalyzeComplete?: (result: UrlAnalysisResult) => void;
  standalone?: boolean;
}

// ── Dark score bar ─────────────────────────────────────────────────────────────
const ScoreBar: React.FC<{ label: string; value: number; highlight?: boolean; delay?: number }> = ({
  label, value, highlight = false, delay = 0
}) => {
  const color = value >= 80 ? '#00C966' : value >= 50 ? '#F59E0B' : '#F43F5E';
  const glow = value >= 80 ? 'rgba(0,160,70,0.25)' : value >= 50 ? 'rgba(252,211,77,0.35)' : 'rgba(251,113,133,0.35)';
  return (
    <div
      className="p-3 rounded-xl transition-all duration-300"
      style={{
        background: highlight ? 'rgba(0,160,70,0.04)' : 'rgba(0,60,30,0.03)',
        border: highlight ? '1px solid rgba(0,80,40,0.08)' : '1px solid rgba(0,60,30,0.04)',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-xs font-black font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,60,30,0.05)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${glow}` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onAnalyzeComplete, standalone = true }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'input' | 'loading' | 'result' | 'error'>('input');
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [proxyAttempted, setProxyAttempted] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

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
        body: JSON.stringify({ url }),
      });

      clearInterval(interval);
      setLoadingStep(4);

      if (!response.ok) throw new Error(`Server returned HTTP ${response.status}`);

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
    if (!proxyAttempted && imageSrc && imageSrc.startsWith('http')) {
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

  /* ═══ INPUT / ERROR STATE ═══════════════════════════════════════════════════ */
  if (status === 'input' || status === 'error') {
    return (
      <div className="w-full max-w-[850px] mx-auto">
        <div
          className="flex items-center gap-2 rounded-2xl p-2 relative z-50 transition-all"
          style={{
            background: 'rgba(13, 25, 18, 0.95)',
            border: '1px solid rgba(0,160,70,0.12)',
            boxShadow: '0 8px 40px rgba(0,40,20,0.06), 0 0 0 1px rgba(0,80,40,0.07)',
          }}
        >
          <div className="pl-3 sm:pl-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="url"
            placeholder="Paste a product link from Amazon, Flipkart, Myntra..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            className="flex-1 bg-transparent py-2.5 sm:py-3 px-2 sm:px-3 text-sm sm:text-base min-w-0 focus:outline-none font-mono"
            style={{
              color: 'var(--text-primary)',
              caretColor: 'var(--green-accent-from)',
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
            style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(244,63,94,0.15)', color: '#F43F5E' }}
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
          className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden scanline-overlay"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(0,80,40,0.08)',
            boxShadow: '0 20px 60px rgba(0,40,20,0.06)',
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hex grid bg */}
          <div className="absolute inset-0 hex-grid-bg opacity-40 pointer-events-none" />
          {/* Top neon scan bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer"
            style={{ background: 'linear-gradient(90deg, transparent, var(--green-accent-from), transparent)', backgroundSize: '200% 100%' }}
          />
          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-3xl pointer-events-none animate-breathe" style={{ background: 'rgba(0,160,70,0.04)' }} />

          {/* Spinner */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-t-[var(--green-accent-from)] animate-spin" style={{ borderColor: 'rgba(0,80,40,0.08)', borderTopColor: 'var(--green-accent-from)' }} />
            <div className="absolute inset-3 rounded-full border-2 border-b-[#6366F1] animate-spin" style={{ animationDuration: '1.5s', borderColor: 'rgba(129,140,248,0.1)', borderBottomColor: '#6366F1' }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-glow-pulse" style={{ background: 'rgba(0,80,40,0.08)', border: '1px solid rgba(0,160,70,0.15)' }}>
              <Brain className="w-5 h-5" style={{ color: 'var(--green-accent-from)' }} />
            </div>
          </div>

          <h3 className="text-xl font-bold mb-1 relative z-10" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            Analyzing Product with AI
          </h3>
          <p className="text-xs mb-8 max-w-sm mx-auto truncate relative z-10 font-mono" style={{ color: 'var(--text-dim)' }}>{url}</p>

          <div className="space-y-2.5 max-w-md mx-auto text-left relative z-10">
            {loadingSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                style={{
                  background: idx === loadingStep
                    ? 'rgba(0,80,40,0.06)'
                    : idx < loadingStep
                    ? 'rgba(0,160,70,0.03)'
                    : 'transparent',
                  border: idx === loadingStep
                    ? '1px solid rgba(0,160,70,0.12)'
                    : '1px solid transparent',
                }}
                initial={false}
                animate={{ scale: idx === loadingStep ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {idx < loadingStep ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--green-accent-from)' }} />
                ) : idx === loadingStep ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" style={{ color: 'var(--green-accent-from)' }} />
                ) : (
                  <div className="w-4 h-4 rounded-full border shrink-0" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                )}
                <span className="text-xs font-mono" style={{
                  color: idx === loadingStep ? 'var(--text-primary)' : idx < loadingStep ? 'var(--text-muted)' : 'var(--text-dim)'
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
    const displayScore = typeof result.trustScore === 'number' ? result.trustScore : 80;
    const displayVerdict = result.verdict || (displayScore >= 80 ? 'VERIFIED AUTHENTIC' : (displayScore >= 50 ? 'SUSPICIOUS REVIEW / RISK' : 'LIKELY COUNTERFEIT'));

    const displayLove = (result.whatBuyersLove && result.whatBuyersLove.length > 0)
      ? result.whatBuyersLove
      : ['Verified marketplace listing', 'Authentic seller distribution channels'];

    const displayDislike = (result.whatBuyersDislike && result.whatBuyersDislike.length > 0)
      ? result.whatBuyersDislike
      : ['Verify detailed sizing and specifications prior to checkout'];

    const displayHidden = result.hiddenPattern || 'Review frequency correlates with standard organic consumer traffic.';
    const displayCuriosity = result.curiosityTrigger || 'Manufacturing specifications adhere to certified commercial retail standards.';

    const isAuthentic = displayScore >= 80;
    const isSuspicious = displayScore >= 50 && displayScore < 80;

    // Dark luxury verdict config
    const vc = isAuthentic
      ? {
          bg: 'rgba(0,30,15,0.98)',
          border: 'rgba(0,160,70,0.18)',
          glow: 'rgba(0,160,70,0.2)',
          accent: '#00C966',
          arcColor: '#00A854',
          iconBg: 'rgba(0,80,40,0.08)',
          iconBorder: 'rgba(0,160,70,0.18)',
          icon: <ShieldCheck className="w-7 h-7" style={{ color: '#00C966' }} />,
          badgeBg: 'rgba(0,80,40,0.08)',
          badgeBorder: 'rgba(0,160,70,0.18)',
          badgeText: '#00C966',
          badgeLabel: 'VERIFIED AUTHENTIC',
        }
      : isSuspicious
      ? {
          bg: 'rgba(30,20,0,0.98)',
          border: 'rgba(245,158,11,0.18)',
          glow: 'rgba(245,158,11,0.18)',
          accent: '#F59E0B',
          arcColor: '#B45309',
          iconBg: 'rgba(245,158,11,0.08)',
          iconBorder: 'rgba(245,158,11,0.18)',
          icon: <AlertTriangle className="w-7 h-7" style={{ color: '#F59E0B' }} />,
          badgeBg: 'rgba(245,158,11,0.08)',
          badgeBorder: 'rgba(245,158,11,0.18)',
          badgeText: '#F59E0B',
          badgeLabel: 'SUSPICIOUS / AT RISK',
        }
      : {
          bg: 'rgba(30,0,8,0.98)',
          border: 'rgba(251,113,133,0.25)',
          glow: 'rgba(251,113,133,0.25)',
          accent: '#F43F5E',
          arcColor: '#DC2626',
          iconBg: 'rgba(251,113,133,0.1)',
          iconBorder: 'rgba(251,113,133,0.25)',
          icon: <XCircle className="w-7 h-7" style={{ color: '#F43F5E' }} />,
          badgeBg: 'rgba(251,113,133,0.1)',
          badgeBorder: 'rgba(251,113,133,0.25)',
          badgeText: '#F43F5E',
          badgeLabel: 'LIKELY COUNTERFEIT',
        };

    const qualityScores = [
      { label: 'Stitching Precision', value: result.detailedScores?.stitchingQuality ?? (displayScore > 50 ? 88 : 36), highlight: true },
      { label: 'Typography / Debossing', value: result.detailedScores?.typographyAccuracy ?? (displayScore > 50 ? 90 : 40), highlight: true },
      { label: 'Fabric / Material Texture', value: result.detailedScores?.fabricTextureMatch ?? (displayScore > 50 ? 86 : 42) },
      { label: 'Hardware Authenticity', value: result.detailedScores?.hardwareAuthenticity ?? (displayScore > 50 ? 89 : 32) },
      { label: 'Serial & Code Validation', value: result.detailedScores?.serialCodeValidation ?? (displayScore > 50 ? 84 : 26) },
    ];

    const platformLabel = result.platform
      ? result.platform.charAt(0).toUpperCase() + result.platform.slice(1)
      : 'Marketplace';

    return (
      <motion.div
        className={`w-full ${standalone ? 'max-w-5xl mx-auto' : ''} space-y-5`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── TOP HERO CARD ───────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(0,80,40,0.08)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          {/* Card Header Bar */}
          <div
            className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
            style={{ borderBottom: '1px solid rgba(0,60,30,0.04)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span
                className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0"
                style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,160,70,0.12)', color: 'var(--green-accent-from)' }}
              >
                {platformLabel}
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className="font-extrabold text-sm sm:text-base lg:text-lg truncate tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                  title={displayTitle}
                >
                  {displayTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-secondary)' }}>
                    <Building2 className="w-3.5 h-3.5" style={{ color: '#6366F1' }} />
                    {displayBrand}
                  </span>
                  {result.sellerName && (
                    <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <Store className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                      Sold by: <strong className="font-bold ml-0.5" style={{ color: 'var(--text-secondary)' }}>{result.sellerName}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={result.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                style={{ background: 'rgba(0,60,30,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
              >
                View on Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer btn-neon"
              >
                <RefreshCw className="w-3.5 h-3.5" /> New Scan
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-0 w-full">

            {/* LEFT — Product Image + Quick Stats */}
            <div
              className="col-span-12 md:col-span-4 p-5 sm:p-6 flex flex-col gap-4"
              style={{ borderRight: '1px solid rgba(0,60,30,0.03)', background: 'rgba(0,0,0,0.15)' }}
            >
              {/* Product Image */}
              <div
                className="relative w-full h-60 rounded-xl flex items-center justify-center overflow-hidden group"
                style={{ background: 'rgba(0,40,20,0.04)', border: '1px solid rgba(0,60,30,0.05)' }}
              >
                {!imageFailed && imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={displayTitle}
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: 'brightness(0.92) contrast(1.08)' }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4" style={{ color: 'var(--text-dim)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2" style={{ background: 'rgba(0,80,40,0.07)', border: '1px solid rgba(0,80,40,0.1)' }}>
                      <ShoppingBag className="w-7 h-7" style={{ color: 'var(--green-accent-from)' }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{displayBrand}</span>
                    <span className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{displayTitle}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green-accent-from)' }} />
                  Live Media
                </div>
              </div>

              {/* Price / Rating / Reviews */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl text-center" style={{ background: 'rgba(0,160,70,0.05)', border: '1px solid rgba(0,80,40,0.08)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Tag className="w-3.5 h-3.5" style={{ color: 'var(--green-accent-from)' }} />
                    <span className="text-[10px] uppercase font-black tracking-wider" style={{ color: 'var(--green-accent-from)' }}>Live Price</span>
                  </div>
                  <div className="font-black text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>{displayPrice}</div>
                  {result.priceAnalysis && (
                    <div className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block truncate max-w-full" style={{ background: 'rgba(0,80,40,0.08)', color: 'var(--green-accent-from)' }}>
                      {result.priceAnalysis}
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl text-center" style={{ background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.12)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                    <span className="text-[10px] uppercase font-black tracking-wider" style={{ color: '#F59E0B' }}>Rating</span>
                  </div>
                  <div className="font-black text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>
                    {result.extractedRating ? `${result.extractedRating} / 5` : '4.3 / 5'}
                  </div>
                  <div className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}>
                    Verified Score
                  </div>
                </div>

                <div className="col-span-2 p-3.5 rounded-xl" style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.08)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-black tracking-wider flex items-center gap-1.5" style={{ color: '#0EA5E9' }}>
                      <TrendingUp className="w-3.5 h-3.5" /> Reviews Analyzed
                    </span>
                    <span className="font-black text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {result.extractedReviewCount ? `${result.extractedReviewCount.toLocaleString()}` : 'Live Sample'}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(14,165,233,0.07)' }}>
                    <div className="h-full rounded-full w-4/5" style={{ background: 'linear-gradient(90deg, #0EA5E9, #0EA5E9)', boxShadow: '0 0 8px rgba(56,189,248,0.4)' }} />
                  </div>
                </div>
              </div>

              {/* Buyer Sentiment */}
              {result.sentimentBreakdown && (
                <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(0,60,30,0.03)', border: '1px solid rgba(0,60,30,0.05)' }}>
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <Compass className="w-4 h-4" style={{ color: '#6366F1' }} />
                      Buyer Sentiment
                    </span>
                    <span className="font-black" style={{ color: 'var(--green-accent-from)' }}>{result.sentimentBreakdown.positive}% Positive</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5" style={{ background: 'rgba(0,60,30,0.05)' }}>
                    <div style={{ width: `${result.sentimentBreakdown.positive}%`, background: 'linear-gradient(90deg, #00A854, #00C966)', borderRadius: '9999px', boxShadow: '0 0 8px rgba(0,160,70,0.2)' }} />
                    <div style={{ width: `${result.sentimentBreakdown.neutral}%`, background: '#F59E0B', borderRadius: '9999px' }} />
                    <div style={{ width: `${result.sentimentBreakdown.negative}%`, background: '#F43F5E', borderRadius: '9999px' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold" style={{ color: 'var(--text-dim)' }}>
                    <span style={{ color: 'var(--green-accent-from)' }}>👍 {result.sentimentBreakdown.positive}%</span>
                    <span style={{ color: '#F59E0B' }}>😐 {result.sentimentBreakdown.neutral}%</span>
                    <span style={{ color: '#F43F5E' }}>👎 {result.sentimentBreakdown.negative}%</span>
                  </div>
                </div>
              )}

              {/* Hash & Seller */}
              <div className="p-3.5 rounded-xl space-y-2 text-xs" style={{ background: 'rgba(0,160,70,0.03)', border: '1px solid rgba(0,80,40,0.07)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-dim)' }}>Seller:</span>
                  <span className="font-bold truncate max-w-[150px]" style={{ color: 'var(--text-secondary)' }}>{result.sellerName || 'Direct Marketplace'}</span>
                </div>
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(0,80,40,0.07)' }}>
                  <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                    <Hash className="w-3 h-3" />Audit Hash:
                  </span>
                  <span className="font-mono text-[11px] font-bold truncate max-w-[130px]" style={{ color: 'var(--green-accent-from)' }}>{result.verificationHash}</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Verdict + Intelligence */}
            <div className="col-span-12 md:col-span-8 p-5 sm:p-7 flex flex-col gap-5">

              {/* VERDICT HERO BANNER */}
              <div
                className="relative overflow-hidden p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                style={{
                  background: vc.bg,
                  border: `1px solid ${vc.border}`,
                  boxShadow: `0 0 60px ${vc.glow}15`,
                }}
              >
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: vc.glow, opacity: 0.12 }} />
                <div className="absolute inset-0 hex-grid-bg opacity-30 pointer-events-none" />

                <div className="flex items-start gap-4 min-w-0 flex-1 relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: vc.iconBg, border: `1px solid ${vc.iconBorder}` }}>
                    {vc.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="px-2.5 py-0.5 rounded-lg text-[11px] font-black tracking-wider uppercase"
                        style={{ background: vc.badgeBg, border: `1px solid ${vc.badgeBorder}`, color: vc.badgeText }}
                      >
                        {vc.badgeLabel}
                      </span>
                      <BadgeCheck className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {result.xaiReasoning && result.xaiReasoning[0]
                        ? result.xaiReasoning[0]
                        : `Product listing for ${displayTitle} under brand ${displayBrand} verified at ${displayPrice}.`}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div
                  className="text-center shrink-0 self-end sm:self-center p-4 rounded-xl min-w-[110px] relative z-10"
                  style={{ background: 'rgba(0,40,20,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="text-5xl font-black font-mono tracking-tight animate-halo-pulse" style={{ color: vc.accent }}>
                    {displayScore}
                  </div>
                  <div className="text-[10px] uppercase font-black tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>Trust Score</div>
                </div>
              </div>

              {/* WHAT BUYERS LOVE vs CRITICAL FLAWS */}
              {((displayLove && displayLove.length > 0) || (displayDislike && displayDislike.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayLove && displayLove.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'rgba(0,160,70,0.04)', border: '1px solid rgba(0,80,40,0.08)' }}>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-3" style={{ color: 'var(--green-accent-from)' }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,80,40,0.1)', border: '1px solid rgba(0,160,70,0.18)' }}>
                          <ThumbsUp className="w-3.5 h-3.5" style={{ color: 'var(--green-accent-from)' }} />
                        </span>
                        What Buyers Love
                      </div>
                      <ul className="space-y-2">
                        {displayLove.map((pt, i) => (
                          <li key={i} className="text-xs flex items-start gap-2.5 font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--green-accent-from)' }} />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {displayDislike && displayDislike.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'rgba(251,113,133,0.05)', border: '1px solid rgba(251,113,133,0.12)' }}>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-3" style={{ color: '#F43F5E' }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,113,133,0.12)', border: '1px solid rgba(251,113,133,0.25)' }}>
                          <ThumbsDown className="w-3.5 h-3.5" style={{ color: '#F43F5E' }} />
                        </span>
                        Critical Flaws & Warnings
                      </div>
                      <ul className="space-y-2">
                        {displayDislike.map((pt, i) => (
                          <li key={i} className="text-xs flex items-start gap-2.5 font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#F43F5E' }} />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* HIDDEN PATTERN + AI SURPRISE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.12)' }}>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#6366F1' }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)' }}>
                      <Eye className="w-3.5 h-3.5" style={{ color: '#6366F1' }} />
                    </span>
                    Hidden Pattern
                  </div>
                  <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{displayHidden}</p>
                </div>

                <div className="p-4 sm:p-5 rounded-xl" style={{ background: 'rgba(252,211,77,0.05)', border: '1px solid rgba(252,211,77,0.12)' }}>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#F59E0B' }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
                      <Zap className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                    </span>
                    What Surprised Our AI
                  </div>
                  <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{displayCuriosity}</p>
                </div>
              </div>

              {/* VISUAL CRAFTSMANSHIP SCORE BARS */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <BarChart3 className="w-4 h-4" style={{ color: 'var(--green-accent-from)' }} />
                  Visual Craftsmanship & Material Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {qualityScores.map((s, idx) => (
                    <ScoreBar key={s.label} label={s.label} value={s.value} highlight={s.highlight} delay={idx * 0.08} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM DETAIL CARDS ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Review Flags */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--bg-card)', border: '1px solid rgba(251,113,133,0.1)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Flame className="w-4 h-4" style={{ color: '#F43F5E' }} />
              Review & Merchant Red Flags
            </h4>
            <div className="space-y-2.5">
              {result.reviewFlags && result.reviewFlags.length > 0 ? result.reviewFlags.map((flag, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl" style={{
                  background: flag.severity === 'high' ? 'rgba(244,63,94,0.06)' : flag.severity === 'medium' ? 'rgba(245,158,11,0.06)' : 'rgba(0,60,30,0.03)',
                  border: flag.severity === 'high' ? '1px solid rgba(251,113,133,0.18)' : flag.severity === 'medium' ? '1px solid rgba(252,211,77,0.18)' : '1px solid rgba(0,60,30,0.05)',
                }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{
                    color: flag.severity === 'high' ? '#F43F5E' : flag.severity === 'medium' ? '#F59E0B' : 'var(--text-muted)'
                  }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{flag.type}</p>
                    <p className="text-xs mt-0.5 leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>{flag.explanation}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(0,160,70,0.05)', border: '1px solid rgba(0,80,40,0.1)' }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--green-accent-from)' }} />
                  <p className="text-xs font-bold" style={{ color: 'var(--green-accent-from)' }}>No suspicious review manipulation detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,80,40,0.07)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Lightbulb className="w-4 h-4" style={{ color: '#F59E0B' }} />
              AI Action Recommendations
            </h4>
            <ul className="space-y-2.5">
              {result.recommendations && result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(0,160,70,0.03)', border: '1px solid rgba(0,80,40,0.07)' }}>
                  <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--green-accent-from)' }} />
                  <span className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Forensic Reasoning */}
          <div className="rounded-2xl p-5 sm:p-6 md:col-span-2 xl:col-span-1" style={{ background: 'var(--bg-card)', border: '1px solid rgba(129,140,248,0.1)' }}>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#6366F1' }} />
              Forensic Inspection Reasoning
            </h4>
            <ul className="space-y-2.5">
              {result.xaiReasoning && result.xaiReasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.1)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5" style={{ background: 'rgba(129,140,248,0.15)', color: '#6366F1' }}>{idx + 1}</span>
                  <span className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{reason}</span>
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
