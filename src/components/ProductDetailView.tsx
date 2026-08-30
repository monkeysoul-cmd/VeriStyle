import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Camera,
  Zap,
  Shield,
  DollarSign,
  Weight,
  Tag,
  Battery,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProductItem, InsightIconType } from '../types';

interface ProductDetailViewProps {
  product: ProductItem;
  onBack: () => void;
}

const InsightIcon: React.FC<{ type: InsightIconType; className?: string }> = ({ type, className = 'w-5 h-5' }) => {
  const map: Record<InsightIconType, React.ReactNode> = {
    camera: <Camera className={className} />,
    star: <Star className={className} />,
    battery: <Battery className={className} />,
    build: <Shield className={className} />,
    dollar: <DollarSign className={className} />,
    weight: <Weight className={className} />,
    shield: <Shield className={className} />,
    zap: <Zap className={className} />,
    tag: <Tag className={className} />,
    heart: <Heart className={className} />,
  };
  return <>{map[type]}</>;
};

const ScoreDonut: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const radius = 56;
  const stroke = 9;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          stroke="#f1f5f9" strokeWidth={stroke} fill="none"
        />
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          stroke="url(#scoreGradDetail)" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <defs>
          <linearGradient id="scoreGradDetail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--green-accent-from)" />
            <stop offset="100%" stopColor="var(--green-accent-to)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-[var(--text-primary)] leading-none">{score}</span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">/ 100</span>
      </div>
      <span className="text-xs font-bold text-[var(--green-primary)] tracking-wide uppercase mt-2">{label}</span>
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; value: number; delay?: number }> = ({ label, value, delay = 0 }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-700 font-bold">{label}</span>
      <span className="text-[var(--green-primary)] font-black font-mono">{value}%</span>
    </div>
    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[var(--green-accent-from)] to-[var(--green-accent-to)]"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  </div>
);

const SentimentBar: React.FC<{ label: string; value: number; color: string; delay?: number }> = ({ label, value, color, delay = 0 }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600 font-bold">{label}</span>
      <span className="font-black font-mono text-[var(--text-primary)]">{value}%</span>
    </div>
    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div 
        className={`h-full rounded-full ${color}`} 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  </div>
);

const badgeStyles: Record<string, string> = {
  'Top Rated':    'bg-amber-100 text-amber-700 border-amber-200',
  'Budget Pick':  'bg-blue-100 text-blue-700 border-blue-200',
  'Trending':     'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Premium Pick': 'bg-[var(--green-primary)]/10 text-[var(--green-primary)] border-[var(--green-primary)]/20',
  'Best Value':   'bg-teal-100 text-teal-700 border-teal-200',
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
  const [saved, setSaved] = useState(false);

  const scoreLabel =
    product.trustScore >= 90 ? 'Highly Recommended' :
    product.trustScore >= 75 ? 'Recommended' :
    product.trustScore >= 60 ? 'Proceed with Caution' : 'High Risk';

  const positiveInsights = product.reviewInsights.filter(i => i.sentiment === 'positive');
  const negativeInsights = product.reviewInsights.filter(i => i.sentiment === 'negative');

  return (
    <motion.div 
      className="w-full bg-[var(--page-light)] min-h-screen pt-24 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--text-primary)] transition-colors text-sm font-bold group cursor-pointer"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </motion.button>

        {/* ── Hero Block ─────────────────────────────────────────── */}
        <div className="rounded-3xl bg-white border border-[var(--border-card)] shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Image */}
            <div className="relative h-80 md:h-auto min-h-[400px] overflow-hidden bg-gray-50/50 p-8 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-xl transition-transform duration-500 hover:scale-105"
              />
              <span className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold border ${badgeStyles[product.badge] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {product.badge}
              </span>
            </div>

            {/* Info */}
            <div className="p-8 sm:p-10 flex flex-col justify-between gap-6 border-l border-gray-100">
              <div className="space-y-5">
                {/* Trust Score Badge */}
                <div className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl bg-[var(--green-primary)]/5 border border-[var(--green-primary)]/20">
                  <div className="text-center">
                    <p className="text-[10px] text-[var(--green-primary)] uppercase tracking-widest font-bold mb-1">Trust Score</p>
                    <p className="text-3xl font-extrabold text-[var(--green-primary)] leading-none">{product.trustScore}<span className="text-sm text-gray-500 font-bold">/100</span></p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[var(--green-primary)]" /> {scoreLabel}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Verified by 95k+ data points</p>
                  </div>
                </div>

                {/* Brand + Name */}
                <div>
                  <span className="text-xs font-bold text-[var(--green-primary)] uppercase tracking-widest">{product.brand}</span>
                  <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mt-1.5 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>{product.name}</h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4.5 h-4.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-amber-500 font-bold text-[15px]">{product.rating}</span>
                  <span className="text-gray-500 text-sm font-medium">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)]">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-lg font-bold">{product.originalPrice}</span>
                  )}
                  {product.savings && (
                    <span className="px-2 py-1 rounded bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-xs font-bold">
                      {product.savings}
                    </span>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 flex-wrap mt-4 pt-6 border-t border-gray-100">
                <button className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--text-primary)] hover:bg-gray-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer">
                  <ExternalLink className="w-4 h-4" />
                  Buy Product
                </button>
                <button className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm border border-gray-200 shadow-sm transition-all cursor-pointer">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-sm border transition-all shadow-sm cursor-pointer ${saved ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-red-500' : ''}`} />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Score Breakdown ────────────────────────────────────── */}
        <section className="rounded-3xl bg-white border border-[var(--border-card)] shadow-sm p-8 sm:p-10">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Score <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-accent-from)] italic" style={{ fontFamily: 'var(--font-serif)' }}>Breakdown.</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm">AI analyzes key factors to reveal the product's true performance score.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-4xl mx-auto">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <ScoreDonut score={product.trustScore} label={scoreLabel} />
            </div>

            {/* Dimension Bars */}
            <div className="flex-1 w-full space-y-6">
              <ScoreBar label="Build Quality" value={product.scoreDimensions.buildQuality} delay={0.1} />
              <ScoreBar label="Performance" value={product.scoreDimensions.performance} delay={0.2} />
              <ScoreBar label="Value for Money" value={product.scoreDimensions.valueForMoney} delay={0.3} />
              <ScoreBar label="User Satisfaction" value={product.scoreDimensions.userSatisfaction} delay={0.4} />
            </div>
          </div>
        </section>

        {/* ── Detailed Review Insights (Pros / Cons) ────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Review <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-accent-from)] italic" style={{ fontFamily: 'var(--font-serif)' }}>Insights.</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm">Deep dive into user sentiment and common feedback patterns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positives */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--green-primary)] font-bold text-lg mb-2">
                <CheckCircle2 className="w-6 h-6" />
                What Buyers Love
              </div>
              {positiveInsights.map((insight, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-[var(--border-card)] shadow-sm hover:shadow-md hover:border-[var(--green-primary)]/30 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--green-primary)]/10 border border-[var(--green-primary)]/20 flex items-center justify-center text-[var(--green-primary)] flex-shrink-0 group-hover:scale-110 transition-transform">
                      <InsightIcon type={insight.iconType} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[var(--text-primary)]">{insight.title}</h4>
                      <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed font-medium">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Negatives */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-500 font-bold text-lg mb-2">
                <XCircle className="w-6 h-6" />
                What Could Be Better
              </div>
              {negativeInsights.map((insight, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-[var(--border-card)] shadow-sm hover:shadow-md hover:border-red-200 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <InsightIcon type={insight.iconType} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[var(--text-primary)]">{insight.title}</h4>
                      <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed font-medium">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Verdict Banner ─────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-[var(--text-primary)] border border-gray-800 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--green-primary)]/15 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[var(--green-primary)]/20 border border-[var(--green-primary)]/30 flex items-center justify-center text-[var(--green-primary)] flex-shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>The AI Verdict</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base font-medium">{product.aiVerdict}</p>
            </div>
          </div>
        </section>

        {/* ── Sentiment + Hidden Patterns ───────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Sentiment Breakdown */}
          <div className="rounded-3xl bg-white border border-[var(--border-card)] shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Sentiment Breakdown</h3>

            <div className="space-y-5">
              <SentimentBar label="Positive Feedback" value={product.sentimentBreakdown.positive} color="bg-[var(--green-primary)]" delay={0.1} />
              <SentimentBar label="Neutral Feedback" value={product.sentimentBreakdown.neutral} color="bg-gray-400" delay={0.2} />
              <SentimentBar label="Negative Feedback" value={product.sentimentBreakdown.negative} color="bg-red-400" delay={0.3} />
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed p-3 rounded-xl bg-gray-50 border border-gray-100 font-medium">
              Sentiment is generated from buyer-review snippets VeriLens analyzed. Review total includes available counts from verified resale platforms.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--text-primary)]">{product.sentimentBreakdown.reviewsAnalyzed.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">Reviews Analyzed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--text-primary)]">{product.sentimentBreakdown.storesChecked}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">Platforms Checked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--text-primary)]">{product.sentimentBreakdown.accuracyRate}%</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">Accuracy Rate</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5">Most Discussed Feature</h4>
              <p className="text-sm text-[var(--green-primary)] font-bold">{product.mostDiscussedFeature}</p>
            </div>
          </div>

          {/* Hidden Patterns + Curiosity */}
          <div className="space-y-6 flex flex-col">
            {/* Hidden Pattern */}
            <div className="rounded-3xl bg-[#F4F1FB] border border-[#E3D9F6] p-6 sm:p-8 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider">
                  Premium AI Insight
                </span>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-purple-900" style={{ fontFamily: 'var(--font-heading)' }}>Hidden Buyer Patterns Discovered</h3>
              <p className="text-purple-800/80 text-sm leading-relaxed italic font-medium">"{product.hiddenPattern}"</p>
              <div className="flex items-center gap-3 pt-4 mt-auto border-t border-purple-200/50">
                <div className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-900">AI Intelligence Engine</p>
                  <p className="text-[10px] text-purple-700 uppercase tracking-wide font-semibold mt-0.5">Pattern Recognition Active</p>
                </div>
              </div>
            </div>

            {/* Curiosity Trigger */}
            <div className="rounded-3xl bg-[#FEF6E1] border border-[#FDE6A4] p-6 sm:p-8 space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider inline-block mb-1">
                Curiosity Trigger
              </span>
              <h4 className="text-lg font-bold text-amber-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                What surprised our AI?
              </h4>
              <p className="text-amber-800/80 text-sm leading-relaxed font-medium">{product.curiosityTrigger}</p>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
};
