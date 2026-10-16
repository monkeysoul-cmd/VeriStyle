import React, { useState } from 'react';
import { Star, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onView?: () => void;
}

const badgeStyles: Record<string, string> = {
  'Top Rated':    'bg-amber-50 text-amber-800 border-amber-200',
  'Budget Pick':  'bg-slate-100 text-slate-700 border-slate-200',
  'Trending':     'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Premium Pick': 'bg-slate-900 text-white border-slate-900',
  'Best Value':   'bg-blue-50 text-blue-800 border-blue-200',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  const [saved, setSaved] = useState(false);

  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        dot: 'bg-emerald-600',
        label: 'VERIFIED GRADE A',
      };
    }
    if (score >= 75) {
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-600',
        label: 'VERIFIED GRADE B',
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      dot: 'bg-amber-600',
      label: 'COUNTERFEIT RISK',
    };
  };

  const scoreBadge = getScoreBadge(product.trustScore);

  return (
    <div className="group rounded-md bg-white border border-slate-200 hover:border-slate-400 transition-all duration-200 overflow-hidden shadow-2xs flex flex-col">
      {/* Image Container with Clean Surface */}
      <div className="relative h-52 overflow-hidden bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-103 mix-blend-multiply"
        />
        
        {/* Badge top-left (Clean rectangular badge, no pill) */}
        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-2xs font-mono ${badgeStyles[product.badge] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
          {product.badge}
        </span>

        {/* Trust Score top-right */}
        <div className="absolute top-3 right-11">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border shadow-2xs flex items-center gap-1.5 ${scoreBadge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${scoreBadge.dot}`} />
            {product.trustScore}%
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center border transition-colors shadow-2xs cursor-pointer ${
            saved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
          }`}
          aria-label="Save to Vault"
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5 flex-1 bg-white">
        {/* Brand + Name */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <p className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider">{product.brand}</p>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`} />
            ))}
          </div>
          <span className="text-xs text-amber-800 font-bold font-mono">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-slate-900 font-mono">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-mono">{product.originalPrice}</span>
          )}
          {product.savings && (
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded font-mono">
              {product.savings}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium font-mono">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {onView && (
          <div className="mt-auto pt-3 border-t border-slate-100">
            <button
              onClick={onView}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Inspection Report</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
