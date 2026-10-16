import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle2,
  Camera,
  Zap,
  Shield,
  DollarSign,
  Weight,
  Tag,
  Battery,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { ProductItem, InsightIconType } from '../types';

interface ProductDetailViewProps {
  product: ProductItem;
  onBack: () => void;
}

const InsightIcon: React.FC<{ type: InsightIconType; className?: string }> = ({ type, className = 'w-4 h-4' }) => {
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
  const radius = 54;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          stroke="#E2E8F0" strokeWidth={stroke} fill="none"
        />
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          stroke="#059669" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className="text-2xl font-black font-mono text-slate-900 leading-none">{score}</span>
      </div>
      <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase mt-1 font-mono">{label}</span>
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-xs font-semibold">
      <span className="text-slate-700">{label}</span>
      <span className="text-emerald-800 font-bold font-mono">{value}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded overflow-hidden">
      <div
        className="h-full bg-emerald-600 rounded transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const SentimentBar: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-xs font-semibold">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold font-mono text-slate-900">{value}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded overflow-hidden">
      <div 
        className={`h-full rounded ${colorClass} transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const badgeStyles: Record<string, string> = {
  'Top Rated':    'bg-amber-50 text-amber-800 border-amber-200',
  'Budget Pick':  'bg-slate-100 text-slate-700 border-slate-200',
  'Trending':     'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Premium Pick': 'bg-slate-900 text-white border-slate-900',
  'Best Value':   'bg-blue-50 text-blue-800 border-blue-200',
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
  const [saved, setSaved] = useState(false);

  const scoreLabel =
    product.trustScore >= 90 ? 'Verified Authentic' :
    product.trustScore >= 75 ? 'Authentic Standard' :
    product.trustScore >= 60 ? 'Inspection Caution' : 'High Replica Risk';

  const positiveInsights = product.reviewInsights.filter(i => i.sentiment === 'positive');
  const negativeInsights = product.reviewInsights.filter(i => i.sentiment === 'negative');

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-24 pb-20 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Benchmark Catalog
        </button>

        {/* Hero Specimen Container */}
        <div className="rounded-md bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Specimen Photography */}
            <div className="relative h-80 md:h-auto min-h-[380px] overflow-hidden bg-slate-50/70 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain mix-blend-multiply"
              />
              <span className={`absolute top-4 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border shadow-2xs ${badgeStyles[product.badge] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {product.badge}
              </span>
            </div>

            {/* Specimen Telemetry & Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                
                {/* Trust Score Header Capsule */}
                <div className="inline-flex items-center gap-4 px-4 py-2.5 rounded-md bg-slate-50 border border-slate-200">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold">Authenticity Score</p>
                    <p className="text-2xl font-extrabold text-emerald-800 font-mono leading-none">{product.trustScore}%</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {scoreLabel}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">Evaluated against verified brand standards</p>
                  </div>
                </div>

                {/* Brand + Title */}
                <div>
                  <p className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-800">{product.brand}</p>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                    {product.name}
                  </h1>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  {product.shortDescription}
                </p>

                {/* Consumer Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-amber-800 font-bold font-mono text-xs">{product.rating}</span>
                  <span className="text-slate-400 text-xs font-medium">({product.reviewCount.toLocaleString()} indexed reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl font-extrabold text-slate-950 font-mono">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-slate-400 line-through text-sm font-mono font-medium">{product.originalPrice}</span>
                  )}
                  {product.savings && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                      {product.savings}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Crisp Rectangular (No Pills) */}
              <div className="flex items-center gap-2.5 flex-wrap pt-4 border-t border-slate-100">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-2xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Listing
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" /> Share Report
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md font-semibold text-xs border transition-colors cursor-pointer ${saved ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-700' : ''}`} />
                  {saved ? 'Saved in Vault' : 'Save'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Score Breakdown Section */}
        <section className="rounded-md bg-white border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Inspection Score Breakdown
            </h2>
            <p className="text-slate-500 text-xs">Multi-vector analysis comparing physical craftsmanship and buyer consensus.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl">
            <div className="flex-shrink-0">
              <ScoreDonut score={product.trustScore} label={scoreLabel} />
            </div>

            <div className="flex-1 w-full space-y-3">
              <ScoreBar label="Stitching Pitch Uniformity" value={product.features.buildQuality} />
              <ScoreBar label="Typography & Logo Debossing" value={product.features.performance} />
              <ScoreBar label="Hardware Finish & Electroplating" value={product.features.batteryLife} />
              <ScoreBar label="Serial Matrix Validation" value={product.features.design} />
              <ScoreBar label="Review Text Authenticity" value={product.features.valueForMoney} />
            </div>
          </div>
        </section>

        {/* Sentiment Analysis & NLP Verification */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sentiment Distribution */}
          <div className="rounded-md bg-white border border-slate-200 p-6 space-y-5 shadow-2xs">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Review Sentiment Analysis
              </h3>
              <p className="text-xs text-slate-500">Natural language classification of buyer consensus across indexed reviews.</p>
            </div>

            <div className="space-y-3">
              <SentimentBar label="Positive Sentiment" value={product.sentimentBreakdown.positive} colorClass="bg-emerald-600" />
              <SentimentBar label="Neutral Assessment" value={product.sentimentBreakdown.neutral} colorClass="bg-slate-400" />
              <SentimentBar label="Negative / Counterfeit Flags" value={product.sentimentBreakdown.negative} colorClass="bg-rose-600" />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Most Discussed Attribute:</span>
              <span className="font-bold text-emerald-800 font-mono">{product.mostDiscussedFeature}</span>
            </div>
          </div>

          {/* Forensic Diagnostic Notes */}
          <div className="rounded-md bg-white border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Forensic Pattern Analysis
              </h3>
              <p className="text-xs text-slate-500">Documented anomalies and manufacturing cues identified in this listing.</p>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                Physical Craftsmanship Pattern
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "{product.hiddenPattern}"
              </p>
            </div>

            <div className="p-3.5 rounded bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Counterfeit Risk Vector
              </div>
              <p className="text-amber-900 leading-relaxed">
                {product.curiosityTrigger}
              </p>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};
