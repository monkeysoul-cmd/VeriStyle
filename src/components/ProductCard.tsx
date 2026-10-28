import React, { useState } from 'react';
import { Star, Heart, ArrowRight, ShieldCheck, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onView?: () => void;
}

const badgeStyles: Record<string, string> = {
  'Top Rated':    'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500 shadow-xs',
  'Budget Pick':  'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-500 shadow-xs',
  'Trending':     'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500 shadow-xs',
  'Premium Pick': 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-xs',
  'Best Value':   'bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-amber-500 shadow-xs',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [proxyTried, setProxyTried] = useState(false);

  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-amber-50 text-amber-950 border-amber-300',
        dot: 'bg-amber-600',
        label: 'VERIFIED GRADE A',
      };
    }
    if (score >= 75) {
      return {
        bg: 'bg-indigo-50 text-indigo-900 border-indigo-300',
        dot: 'bg-indigo-600',
        label: 'VERIFIED GRADE B',
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-900 border-rose-300',
      dot: 'bg-rose-600',
      label: 'COUNTERFEIT RISK',
    };
  };

  const scoreBadge = getScoreBadge(product.trustScore);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container with Clean Surface */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-b from-slate-50 to-indigo-50/20 border-b border-slate-100 p-5 flex items-center justify-center">
        {!imageError ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => {
              if (!proxyTried && imgSrc.startsWith('http') && !imgSrc.includes('/api/image-proxy')) {
                setProxyTried(true);
                setImgSrc(`/api/image-proxy?url=${encodeURIComponent(imgSrc)}`);
              } else {
                setImageError(true);
              }
            }}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108 mix-blend-multiply"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
            <Package className="w-10 h-10 text-slate-300" />
            <span className="text-[11px] font-mono font-medium text-slate-400">{product.brand} Specimen</span>
          </div>
        )}
        
        {/* Badge top-left */}
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
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center border transition-colors shadow-2xs cursor-pointer ${
            saved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white/90 border-slate-200 text-slate-400 hover:text-rose-600'
          }`}
          aria-label="Save to Vault"
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600' : ''}`} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5 flex-1 bg-white">
        {/* Brand + Name */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <p className="text-[10px] text-amber-800 font-mono font-bold uppercase tracking-wider">{product.brand}</p>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug group-hover:text-indigo-950 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
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
            <span className="text-[10px] text-amber-900 font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
              {product.savings}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-indigo-50/80 border border-indigo-100 text-indigo-800 text-[10px] font-semibold font-mono">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {onView && (
          <div className="mt-auto pt-3 border-t border-slate-100">
            <button
              onClick={onView}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-amber-50/80 hover:bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 hover:border-amber-400 transition-all cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Inspection Report</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
