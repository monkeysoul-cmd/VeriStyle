import React, { useState } from 'react';
import {
  Search, ShieldCheck, AlertTriangle, XCircle, Loader2, Sparkles,
  CheckCircle2, RefreshCw, Star, Tag, TrendingUp, ExternalLink,
  BadgeCheck, Flame, BarChart3, MessageSquareWarning, Lightbulb, ShoppingBag,
  Building2, Store, ThumbsUp, ThumbsDown, Eye, Compass, Zap
} from 'lucide-react';
import { UrlAnalysisResult } from '../types';

interface UrlAnalyzerProps {
  onAnalyzeComplete?: (result: UrlAnalysisResult) => void;
  standalone?: boolean;
}

const platformColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
  amazon: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Amazon' },
  flipkart: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Flipkart' },
  myntra: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', label: 'Myntra' },
  unknown: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', label: 'Website' },
};

const ScoreBar: React.FC<{ label: string; value: number; highlight?: boolean }> = ({ label, value, highlight = false }) => {
  const color = value >= 80 ? '#059669' : value >= 50 ? '#d97706' : '#dc2626';
  return (
    <div className={`p-3 rounded-xl border ${highlight ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-semibold ${highlight ? 'text-gray-800' : 'text-gray-600'}`}>{label}</span>
        <span className="text-xs font-black font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: color }}
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
  const [imageError, setImageError] = useState(false);

  const loadingSteps = [
    'Connecting to shopping platform...',
    'Fetching live product metadata & pricing...',
    'Extracting genuine product imagery...',
    'Running forensic AI review & craftsmanship check...',
    'Generating verified authenticity report...',
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setStatus('loading');
    setLoadingStep(0);
    setErrorMsg('');
    setImageError(false);

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1400);

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      clearInterval(interval);
      setLoadingStep(4);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Unable to fetch this page. Try pasting the product name/review manually instead.');
      }

      const data: UrlAnalysisResult = await response.json();
      setResult(data);
      setStatus('result');
      if (onAnalyzeComplete) {
        onAnalyzeComplete(data);
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err.message || 'An error occurred while analyzing the product URL.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('input');
    setUrl('');
    setResult(null);
    setErrorMsg('');
    setImageError(false);
  };

  if (status === 'input' || status === 'error') {
    return (
      <div className="w-full max-w-[850px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-white rounded-full border border-gray-200 p-2.5 sm:p-3 shadow-xl shadow-black/5 relative z-50">
          <div className="pl-4 sm:pl-5 flex-shrink-0 text-gray-400">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <input
            type="url"
            placeholder="Paste a product link from Amazon, Flipkart, Myntra..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 py-3.5 sm:py-4 px-3 sm:px-4 text-sm sm:text-base min-w-0 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={handleAnalyze}
            disabled={!url.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-[var(--green-primary)] text-white text-sm sm:text-base font-bold hover:bg-[#146D2F] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Analyse with AI
          </button>
        </div>

        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800">Scan Failed</h4>
              <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className={`w-full ${standalone ? 'max-w-2xl mx-auto' : ''}`}>
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-25" />
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[var(--green-primary)] animate-spin" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Product with AI</h3>
          <p className="text-xs text-gray-500 mb-8 max-w-sm mx-auto truncate font-mono">{url}</p>

          <div className="space-y-3 max-w-md mx-auto text-left">
            {loadingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  idx === loadingStep
                    ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-900 font-semibold'
                    : idx < loadingStep
                    ? 'text-gray-400 opacity-60'
                    : 'text-gray-300'
                }`}
              >
                {idx < loadingStep ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--green-primary)] shrink-0" />
                ) : idx === loadingStep ? (
                  <Loader2 className="w-4 h-4 text-[var(--green-primary)] animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                )}
                <span className="text-xs">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'result' && result) {
    const isAuthentic = result.verdict === 'VERIFIED AUTHENTIC';
    const isSuspicious = result.verdict === 'SUSPICIOUS REVIEW / RISK';
    const hasValidImage = Boolean(result.imageUrl && !imageError);

    const verdictConfig = isAuthentic
      ? {
          gradient: 'from-emerald-950/90 via-emerald-900/90 to-teal-950/90',
          border: 'border-emerald-500/40',
          glow: 'shadow-emerald-950/30',
          text: 'text-emerald-300',
          subtext: 'text-emerald-100/90',
          icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
          iconBg: 'bg-emerald-500/20 border border-emerald-400/40',
          scoreColor: '#34d399',
          badgeText: 'VERIFIED AUTHENTIC',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
        }
      : isSuspicious
      ? {
          gradient: 'from-amber-950/90 via-amber-900/90 to-yellow-950/90',
          border: 'border-amber-500/40',
          glow: 'shadow-amber-950/30',
          text: 'text-amber-300',
          subtext: 'text-amber-100/90',
          icon: <AlertTriangle className="w-7 h-7 text-amber-400" />,
          iconBg: 'bg-amber-500/20 border border-amber-400/40',
          scoreColor: '#fbbf24',
          badgeText: 'SUSPICIOUS REVIEW / RISK',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
        }
      : {
          gradient: 'from-rose-950/90 via-red-900/90 to-red-950/90',
          border: 'border-rose-500/40',
          glow: 'shadow-rose-950/30',
          text: 'text-rose-300',
          subtext: 'text-rose-100/90',
          icon: <XCircle className="w-7 h-7 text-rose-400" />,
          iconBg: 'bg-rose-500/20 border border-rose-400/40',
          scoreColor: '#f87171',
          badgeText: 'LIKELY COUNTERFEIT',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30'
        };

    const qualityScores = [
      { label: 'Stitching Precision', value: result.detailedScores?.stitchingQuality ?? 85, highlight: true },
      { label: 'Typography / Debossing', value: result.detailedScores?.typographyAccuracy ?? 88, highlight: true },
      { label: 'Fabric / Material Texture', value: result.detailedScores?.fabricTextureMatch ?? 82 },
      { label: 'Hardware Authenticity', value: result.detailedScores?.hardwareAuthenticity ?? 86 },
      { label: 'Serial & Code Validation', value: result.detailedScores?.serialCodeValidation ?? 90 },
    ];

    const nlpScores = [
      { label: 'Review NLP Perplexity', value: result.detailedScores?.reviewPerplexity ?? 85 },
      { label: 'Rating-Sentiment Coherence', value: result.detailedScores?.reviewSentimentAlignment ?? 88 },
    ];

    return (
      <div className={`w-full ${standalone ? 'max-w-5xl mx-auto' : ''} space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500`}>

        {/* ── TOP HERO SHOWCASE CARD ─────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xl shadow-black/8 overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-xs shrink-0 ${platformColors[result.platform]?.bg} ${platformColors[result.platform]?.text} ${platformColors[result.platform]?.border}`}>
                {platformColors[result.platform]?.label || 'Product'}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base lg:text-lg truncate tracking-tight" title={result.itemName}>{result.itemName}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 flex-wrap font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-gray-800">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    {result.companyName || result.brand}
                  </span>
                  {result.sellerName && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <Store className="w-3.5 h-3.5 text-amber-500" />
                      Sold by: <strong className="text-gray-900 font-bold">{result.sellerName}</strong>
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
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1.5 transition shadow-xs hover:shadow-sm"
              >
                View on Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-[var(--green-primary)]/20 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> New Analysis
              </button>
            </div>
          </div>

          {/* Main Grid: Left Media & Metrics vs Right Verdict & Intelligence */}
          <div className="grid grid-cols-12 gap-0 w-full">

            {/* LEFT — Genuine Product Image + Quick Stats */}
            <div className="col-span-12 md:col-span-4 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col gap-4 bg-gray-50/40">

              {/* Exact Genuine Product Image */}
              {hasValidImage && (
                <div className="relative w-full h-60 rounded-2xl bg-white border border-gray-200/80 p-3.5 flex items-center justify-center overflow-hidden group shadow-inner">
                  <img
                    src={result.imageUrl}
                    alt={result.itemName}
                    onError={() => setImageError(true)}
                    className="max-h-full max-w-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105 mix-blend-multiply drop-shadow-md"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Listing Image
                  </div>
                </div>
              )}

              {/* Price / Rating / Reviews quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/80 to-green-50 border border-emerald-200/80 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider">Live Price</span>
                  </div>
                  <div className="font-black text-gray-900 text-base sm:text-lg">{result.extractedPrice || '—'}</div>
                  {result.priceAnalysis && (
                    <div className="text-[10px] font-bold text-emerald-800 mt-1 bg-emerald-200/60 px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                      {result.priceAnalysis}
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50 border border-amber-200/80 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider">Rating</span>
                  </div>
                  <div className="font-black text-gray-900 text-base sm:text-lg">{result.extractedRating ? `${result.extractedRating} / 5` : '—'}</div>
                  <div className="text-[10px] font-bold text-amber-800 mt-1 bg-amber-200/60 px-2 py-0.5 rounded-full inline-block">
                    Verified Score
                  </div>
                </div>

                <div className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/80 to-sky-50 border border-blue-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-black text-blue-800 tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Total Reviews Analyzed
                    </span>
                    <span className="font-black text-blue-900 text-xs">{result.extractedReviewCount ? `${result.extractedReviewCount.toLocaleString()} reviews` : 'Live Sample'}</span>
                  </div>
                  <div className="h-1.5 bg-blue-200/60 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full w-4/5" />
                  </div>
                </div>
              </div>

              {/* Buyer Sentiment Meter (Tapju-Grade) */}
              {result.sentimentBreakdown && (
                <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-sm text-left">
                  <div className="flex items-center justify-between text-xs font-extrabold text-gray-800 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-indigo-600" />
                      Buyer Reality Sentiment
                    </span>
                    <span className="text-emerald-700 font-black">{result.sentimentBreakdown.positive}% Positive</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden flex bg-gray-100 p-0.5 gap-0.5 border border-gray-200">
                    <div style={{ width: `${result.sentimentBreakdown.positive}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-1000" title={`Positive: ${result.sentimentBreakdown.positive}%`} />
                    <div style={{ width: `${result.sentimentBreakdown.neutral}%` }} className="bg-amber-400 h-full rounded-full transition-all duration-1000" title={`Neutral: ${result.sentimentBreakdown.neutral}%`} />
                    <div style={{ width: `${result.sentimentBreakdown.negative}%` }} className="bg-rose-500 h-full rounded-full transition-all duration-1000" title={`Negative: ${result.sentimentBreakdown.negative}%`} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 mt-2">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">👍 {result.sentimentBreakdown.positive}% Love it</span>
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">😐 {result.sentimentBreakdown.neutral}% Neutral</span>
                    <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">👎 {result.sentimentBreakdown.negative}% Dislike</span>
                  </div>
                </div>
              )}

              {/* Seller & Verification hash info */}
              <div className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-1.5 text-left text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Seller:</span>
                  <span className="font-bold text-gray-900 truncate max-w-[150px]">{result.sellerName || 'Direct'}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Audit Hash:</span>
                  <span className="font-mono text-[11px] font-bold text-[var(--green-primary)] truncate max-w-[130px]">{result.verificationHash}</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Verdict + Highlighted Intelligence Dossier */}
            <div className="col-span-12 md:col-span-8 p-5 sm:p-7 flex flex-col gap-6">

              {/* 🌟 VERDICT HERO BANNER 🌟 */}
              <div className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r ${verdictConfig.gradient} border ${verdictConfig.border} shadow-xl ${verdictConfig.glow} text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}>
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${verdictConfig.iconBg}`}>
                    {verdictConfig.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wider uppercase border ${verdictConfig.badgeBg}`}>
                        {verdictConfig.badgeText}
                      </span>
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className={`text-xs sm:text-sm ${verdictConfig.subtext} leading-relaxed line-clamp-2 mt-1 font-medium`}>
                      {result.xaiReasoning && result.xaiReasoning[0] ? result.xaiReasoning[0] : 'Forensic multimodal authenticity verification complete.'}
                    </p>
                  </div>
                </div>

                <div className="text-center shrink-0 self-end sm:self-center p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 min-w-[100px]">
                  <div className="text-4xl font-black font-mono tracking-tight" style={{ color: verdictConfig.scoreColor }}>
                    {result.trustScore}
                  </div>
                  <div className="text-[10px] uppercase font-black text-gray-300 tracking-widest mt-0.5">Trust Score</div>
                </div>
              </div>

              {/* 🔍 TAPJU-STYLE HIGHLIGHTS: WHAT BUYERS LOVE VS CRITICAL FLAWS */}
              {((result.whatBuyersLove && result.whatBuyersLove.length > 0) || (result.whatBuyersDislike && result.whatBuyersDislike.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Positive Highlights */}
                  {result.whatBuyersLove && result.whatBuyersLove.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-white border-2 border-emerald-200/90 shadow-sm hover:border-emerald-300 transition-colors">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-900 mb-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </span>
                        What Buyers Love
                      </div>
                      <ul className="space-y-2">
                        {result.whatBuyersLove.map((pt, i) => (
                          <li key={i} className="text-xs text-emerald-950 flex items-start gap-2.5 font-medium leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Critical Flaws & Warnings */}
                  {result.whatBuyersDislike && result.whatBuyersDislike.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/90 via-red-50/60 to-white border-2 border-rose-200/90 shadow-sm hover:border-rose-300 transition-colors">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-900 mb-3">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </span>
                        Critical Flaws & Warnings
                      </div>
                      <ul className="space-y-2">
                        {result.whatBuyersDislike.map((flaw, i) => (
                          <li key={i} className="text-xs text-rose-950 flex items-start gap-2.5 font-medium leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                            <span>{flaw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 💡 RADAR INSIGHT & CURIOSITY TRIGGER */}
              {(result.hiddenPattern || result.curiosityTrigger) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.hiddenPattern && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50/70 to-white border border-indigo-200/80 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-900 mb-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                          <Eye className="w-3 h-3" />
                        </span>
                        Hidden Pattern Discovered
                      </div>
                      <p className="text-xs text-indigo-950 font-medium leading-relaxed">{result.hiddenPattern}</p>
                    </div>
                  )}

                  {result.curiosityTrigger && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-white border border-amber-200/80 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900 mb-2">
                        <span className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center">
                          <Zap className="w-3 h-3" />
                        </span>
                        What Surprised Our AI
                      </div>
                      <p className="text-xs text-amber-950 font-medium leading-relaxed">{result.curiosityTrigger}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 📊 VISUAL CRAFTSMANSHIP & SCORE BARS */}
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[var(--green-primary)]" />
                  Visual Craftsmanship & Material Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {qualityScores.map(s => (
                    <ScoreBar key={s.label} label={s.label} value={s.value} highlight={s.highlight} />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM DETAILS CARDS ROW ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Review Flags */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-5 sm:p-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Review & Merchant Red Flags
            </h4>
            <div className="space-y-2.5">
              {result.reviewFlags && result.reviewFlags.length > 0 ? result.reviewFlags.map((flag, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                  flag.severity === 'high' ? 'bg-red-50 border-red-200' :
                  flag.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                    flag.severity === 'high' ? 'text-red-600' :
                    flag.severity === 'medium' ? 'text-amber-600' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-gray-900">{flag.type}</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed font-medium">{flag.explanation}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-800 font-bold">No suspicious review manipulation patterns detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-5 sm:p-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              AI Action Recommendations
            </h4>
            <ul className="space-y-2.5">
              {result.recommendations && result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-[var(--green-primary)] shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-800 font-medium leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Forensic Reasoning */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-5 sm:p-6 md:col-span-2 xl:col-span-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Forensic Inspection Reasoning
            </h4>
            <ul className="space-y-2.5">
              {result.xaiReasoning && result.xaiReasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{idx + 1}</span>
                  <span className="text-xs text-gray-800 font-medium leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    );
  }

  return null;
};

