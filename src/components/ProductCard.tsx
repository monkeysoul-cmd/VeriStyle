import React, { useState } from 'react';
import { Star, Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onView?: () => void;
}

const badgeStyles: Record<string, string> = {
  'Top Rated':    'bg-amber-500/10 text-amber-700 border-amber-500/25',
  'Budget Pick':  'bg-sky-500/10 text-sky-700 border-sky-500/25',
  'Trending':     'bg-indigo-500/10 text-indigo-700 border-indigo-500/25',
  'Premium Pick': 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25',
  'Best Value':   'bg-violet-500/10 text-violet-700 border-violet-500/25',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  const [saved, setSaved] = useState(false);

  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-[0_0_10px_rgba(0,240,139,0.25)]',
        dot: 'bg-[#00F08B] shadow-[0_0_6px_#00F08B]',
        label: 'SPEC A',
      };
    }
    if (score >= 75) {
      return {
        bg: 'bg-indigo-50 text-indigo-900 border-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]',
        dot: 'bg-[#6366F1] shadow-[0_0_6px_#6366F1]',
        label: 'SPEC B',
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-900 border-amber-300 shadow-[0_0_10px_rgba(255,184,0,0.25)]',
      dot: 'bg-[#FFB800] shadow-[0_0_6px_#FFB800]',
      label: 'RISK',
    };
  };

  const scoreBadge = getScoreBadge(product.trustScore);

  return (
    <motion.div 
      className="group rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-xl flex flex-col"
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      {/* Image Container with Titanium Surface */}
      <div className="relative h-56 overflow-hidden bg-slate-50/80 border-b border-slate-100 p-6 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-108 group-hover:brightness-105 transition-all duration-500 mix-blend-multiply"
        />
        
        {/* Badge top-left */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-xs ${badgeStyles[product.badge] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
          {product.badge}
        </span>

        {/* High-Precision Trust Score top-right */}
        <div className="absolute top-3 right-12">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black font-mono border shadow-xs flex items-center gap-1.5 ${scoreBadge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${scoreBadge.dot}`} />
            {product.trustScore}%
          </span>
        </div>

        {/* Save button */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border transition-all shadow-xs cursor-pointer ${
            saved ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white/90 border-slate-200 text-slate-400 hover:text-slate-600'
          }`}
          whileTap={{ scale: 0.75 }}
          animate={saved ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-500' : ''}`} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1 bg-white">
        {/* Brand + Name */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <p className="text-[11px] text-[#00A854] font-black uppercase tracking-widest">{product.brand}</p>
          </div>
          <h3 className="text-[15px] font-bold text-slate-900 mt-1 line-clamp-2 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
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
          <span className="text-xs text-amber-600 font-black">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-black text-slate-900 font-mono">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-mono">{product.originalPrice}</span>
          )}
          {product.savings && (
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
              {product.savings}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {onView && (
          <div className="mt-auto pt-4 border-t border-slate-100">
            <button
              onClick={onView}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 text-xs font-bold border border-slate-200 hover:border-emerald-300 transition-all group/btn cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              View Authenticity Report
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
