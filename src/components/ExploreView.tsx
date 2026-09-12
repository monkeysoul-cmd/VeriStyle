import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Award,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductItem, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductDetailView } from './ProductDetailView';
import { ProductCard } from './ProductCard';

type SortOption = 'trust-score' | 'price-low' | 'price-high' | 'rating' | 'reviews';
type FilterTag = 'Best Value' | 'High Rated' | 'Trending' | 'High Trust Score' | 'Best Performance' | null;

const tagFilterMap: Record<Exclude<FilterTag, null>, string> = {
  'Best Value':        'Best Value',
  'High Rated':        'High Rated',
  'Trending':          'Trending',
  'High Trust Score':  'High Trust Score',
  'Best Performance':  'Best Performance',
};

export const ExploreView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('trust-score');
  const [activeTag, setActiveTag] = useState<FilterTag>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const categories: (ProductCategory | 'All')[] = ['All', 'Handbags', 'Sneakers', 'Streetwear', 'Accessories', 'Watches'];

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (activeTag) {
      list = list.filter(p => p.tags.includes(tagFilterMap[activeTag]));
    }
    const parsePrice = (val: string) => parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
    list.sort((a, b) => {
      if (sortBy === 'trust-score') return b.trustScore - a.trustScore;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'price-low') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'price-high') return parsePrice(b.price) - parsePrice(a.price);
      return 0;
    });
    return list;
  }, [search, selectedCategory, sortBy, activeTag]);

  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <motion.div
          className="text-center space-y-4 pb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-badge mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Product Discovery
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Explore{' '}
            <span
              className="italic text-gradient-brand"
              style={{
                fontFamily: 'var(--font-serif)',
              }}
            >
              All Products.
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            Smart fashion discovery with real-time authenticity insights and craftsmanship metrics.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="flex gap-3 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search brands, categories, or products..."
              className="input-dark w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm"
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shrink-0 cursor-pointer btn-neon"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </motion.div>

        {/* Filters Row */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-sm font-bold w-full sm:w-auto" style={{ color: 'var(--text-muted)' }}>
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            Filters:
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {/* Category Filter */}
            <div className="relative shrink-0">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as ProductCategory | 'All')}
                className="input-dark appearance-none pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
            </div>

            {/* Sort */}
            <div className="relative shrink-0 sm:ml-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="input-dark appearance-none pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              >
                <option value="trust-score">Sort by: Trust Score</option>
                <option value="rating">Sort by: Rating</option>
                <option value="reviews">Sort by: Most Reviewed</option>
                <option value="price-low">Sort by: Price: Low to High</option>
                <option value="price-high">Sort by: Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
            </div>
          </div>
        </motion.div>

        {/* Quick Tag Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {([
            { label: 'Best Value', icon: <Award className="w-3.5 h-3.5" /> },
            { label: 'High Rated', icon: <Star className="w-3.5 h-3.5" /> },
            { label: 'Trending', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { label: 'High Trust Score', icon: <Shield className="w-3.5 h-3.5" /> },
            { label: 'Best Performance', icon: <Zap className="w-3.5 h-3.5" /> },
          ] as const).map(({ label, icon }) => (
            <motion.button
              key={label}
              onClick={() => setActiveTag(activeTag === label ? null : label)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold border transition-all cursor-pointer"
              style={
                activeTag === label
                  ? {
                      background: 'linear-gradient(135deg, #059669, #34D88A)',
                      color: '#FFFFFF',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(52,216,138,0.3)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      color: 'var(--text-secondary)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                    }
              }
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {icon} {label}
            </motion.button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--green-accent-from)' }}>{filtered.length}</span>
          {' '}product{filtered.length !== 1 ? 's' : ''} found
          {(search || selectedCategory !== 'All' || activeTag) && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setActiveTag(null); }}
              className="ml-2 px-2.5 py-0.5 rounded-full text-[11px] cursor-pointer transition-all"
              style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(244,63,94,0.15)', color: '#F43F5E' }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={() => setSelectedProduct(product)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="text-center py-20 space-y-4 rounded-2xl"
              style={{ background: 'var(--bg-surface-1)', border: '1px solid rgba(0,80,40,0.06)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2"
                style={{ background: 'rgba(0,80,40,0.06)', border: '1px solid rgba(0,80,40,0.08)' }}
              >
                <Search className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>No products found</p>
              <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                Try adjusting your filters or search query to find what you're looking for.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('All'); setActiveTag(null); }}
                className="mt-4 px-6 py-2.5 rounded-full text-sm font-bold cursor-pointer btn-ghost"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
