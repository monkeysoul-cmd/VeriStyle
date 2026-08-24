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
import { ProductItem, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductDetailView } from './ProductDetailView';
import { ProductCard } from './ProductCard';

type SortOption = 'ai-score' | 'price-low' | 'price-high' | 'rating' | 'reviews';
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
  const [sortBy, setSortBy] = useState<SortOption>('ai-score');
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

    list.sort((a, b) => {
      if (sortBy === 'ai-score') return b.aiScore - a.aiScore;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
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
    <div className="w-full bg-[var(--page-light)] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED PRODUCT DISCOVERY
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Explore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--green-primary)] to-[var(--green-accent-from)] italic" style={{ fontFamily: 'var(--font-serif)' }}>
              All Products.
            </span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm sm:text-base">
            Smart AI-powered product discovery with real-time authenticity insights and truth analysis.
          </p>
        </div>

        {/* ── Search ─────────────────────────────────────────────── */}
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search brands, categories, or products..."
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--green-primary)] focus:ring-1 focus:ring-[var(--green-primary)] transition-all text-sm shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--text-primary)] hover:bg-gray-800 text-white font-bold text-sm shadow-lg transition-all active:scale-95 shrink-0">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Search AI</span>
          </button>
        </div>

        {/* ── Filters Row ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-bold w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4" />
            Filters:
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {/* Category Filter */}
            <div className="relative shrink-0">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as ProductCategory | 'All')}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium focus:outline-none focus:border-[var(--green-primary)] cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative shrink-0 sm:ml-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium focus:outline-none focus:border-[var(--green-primary)] cursor-pointer"
              >
                <option value="ai-score">Sort by: AI Score</option>
                <option value="rating">Sort by: Rating</option>
                <option value="reviews">Sort by: Most Reviewed</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Quick Tag Filters ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {([
            { label: 'Best Value', icon: <Award className="w-3.5 h-3.5" /> },
            { label: 'High Rated', icon: <Star className="w-3.5 h-3.5" /> },
            { label: 'Trending', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { label: 'High Trust Score', icon: <Shield className="w-3.5 h-3.5" /> },
            { label: 'Best Performance', icon: <Zap className="w-3.5 h-3.5" /> },
          ] as const).map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveTag(activeTag === label ? null : label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
                activeTag === label
                  ? 'bg-[var(--green-primary)] text-white border-[var(--green-primary)] shadow-md shadow-[var(--green-primary)]/20'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--green-primary)] hover:text-[var(--green-primary)]'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ── Product Grid ───────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onView={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-gray-200 mt-6 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-2">
               <Search className="w-8 h-8" />
            </div>
            <p className="text-[var(--text-primary)] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>No products found</p>
            <p className="text-[var(--text-muted)] text-sm max-w-sm mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setActiveTag(null); }}
              className="mt-4 px-6 py-2.5 rounded-full bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-sm font-bold hover:bg-[var(--green-primary)]/20 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
