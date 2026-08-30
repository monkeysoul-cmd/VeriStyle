import React, { useState } from 'react';
import { Star, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onView?: () => void;
}

const badgeStyles: Record<string, string> = {
  'Top Rated':    'bg-amber-100 text-amber-700 border-amber-200',
  'Budget Pick':  'bg-blue-100 text-blue-700 border-blue-200',
  'Trending':     'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Premium Pick': 'bg-[var(--green-primary)]/10 text-[var(--green-primary)] border-[var(--green-primary)]/20',
  'Best Value':   'bg-teal-100 text-teal-700 border-teal-200',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div 
      className="group rounded-3xl bg-white border border-[var(--border-card)] hover:border-[var(--green-primary)]/40 transition-all duration-400 overflow-hidden shadow-sm hover:shadow-xl flex flex-col"
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-[var(--page-light)] p-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="w-full h-full object-contain group-hover:scale-110 group-hover:brightness-105 transition-all duration-500 mix-blend-multiply"
        />
        
        {/* Badge top-left */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeStyles[product.badge] || 'bg-gray-100 text-gray-700'}`}>
          {product.badge}
        </span>

        {/* Trust Score top-right */}
        <div className="absolute top-3 right-12">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--text-primary)] text-white border border-gray-800 shadow-sm">
            {product.trustScore}/100
          </span>
        </div>

        {/* Save button */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border transition-all shadow-sm cursor-pointer ${
            saved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
          }`}
          whileTap={{ scale: 0.75 }}
          animate={saved ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-red-500' : ''}`} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1 bg-white">
        {/* Brand + Name */}
        <div>
          <p className="text-[11px] text-[var(--green-primary)] font-bold uppercase tracking-widest">{product.brand}</p>
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] mt-1 line-clamp-2 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
          </div>
          <span className="text-xs text-amber-500 font-bold">{product.rating}</span>
          <span className="text-xs text-[var(--text-muted)]">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-black text-[var(--text-primary)]">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-[var(--text-muted)] line-through">{product.originalPrice}</span>
          )}
          {product.savings && (
            <span className="text-[10px] text-[var(--green-primary)] font-bold bg-[var(--green-primary)]/10 px-1.5 py-0.5 rounded">{product.savings}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-[var(--text-muted)] text-[10px] font-bold">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {onView && (
          <div className="mt-auto pt-4 border-t border-[var(--border-subtle)]">
            <button
              onClick={onView}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-[var(--green-primary)]/5 text-[var(--text-primary)] text-sm font-bold border border-gray-200 hover:border-[var(--green-primary)]/30 transition-all group/btn cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--green-primary)]" />
              View authenticity check
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
