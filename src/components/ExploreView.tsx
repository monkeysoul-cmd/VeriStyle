import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
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
    <div className="w-full min-h-screen pt-24 pb-20 bg-slate-50 text-slate-900 aurora-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3 pb-2 max-w-3xl mx-auto">
          <div className="section-badge mx-auto">
            Benchmark Reference Catalog
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="text-slate-950">Verified Product </span>
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Benchmarks
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Reference catalog of authenticated luxury models, sneakers, and timepieces with documented craftsmanship metrics and serial syntax.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search brands, models, or categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 text-slate-900 placeholder:text-slate-400 shadow-2xs font-normal"
            />
          </div>
          <button
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg font-bold text-xs tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all cursor-pointer shrink-0 shadow-sm shadow-emerald-600/20"
          >
            Search
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 w-full sm:w-auto font-mono uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            Filters:
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {/* Category Filter */}
            <div className="relative shrink-0">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as ProductCategory | 'All')}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-md text-xs font-semibold cursor-pointer bg-slate-50 border border-slate-200 text-slate-700 hover:border-indigo-400 focus:outline-none focus:border-indigo-600 transition-colors"
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-slate-400" />
            </div>

            {/* Sort */}
            <div className="relative shrink-0 sm:ml-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-md text-xs font-semibold cursor-pointer bg-slate-50 border border-slate-200 text-slate-700 hover:border-indigo-400 focus:outline-none focus:border-indigo-600 transition-colors"
              >
                <option value="trust-score">Sort: Trust Score</option>
                <option value="rating">Sort: Consumer Rating</option>
                <option value="reviews">Sort: Review Volume</option>
                <option value="price-low">Sort: Price Low to High</option>
                <option value="price-high">Sort: Price High to Low</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-slate-400" />
            </div>
          </div>
        </div>

        {/* Quick Tag Filters: Colorful Gradient Active States */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {([
            { label: 'Best Value', icon: <Award className="w-3.5 h-3.5" />, activeBg: 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-teal-500' },
            { label: 'High Rated', icon: <Star className="w-3.5 h-3.5" />, activeBg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500' },
            { label: 'Trending', icon: <TrendingUp className="w-3.5 h-3.5" />, activeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-500' },
            { label: 'High Trust Score', icon: <Shield className="w-3.5 h-3.5" />, activeBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600' },
            { label: 'Best Performance', icon: <Zap className="w-3.5 h-3.5" />, activeBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-600' },
          ] as const).map(({ label, icon, activeBg }) => {
            const isActive = activeTag === label;
            return (
              <button
                key={label}
                onClick={() => setActiveTag(activeTag === label ? null : label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? `${activeBg} shadow-sm font-bold`
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-950'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 font-mono">
          <span className="font-bold text-slate-800">{filtered.length}</span>
          <span>benchmark item{filtered.length !== 1 ? 's' : ''} indexed</span>
          {(search || selectedCategory !== 'All' || activeTag) && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setActiveTag(null); }}
              className="ml-2 px-2 py-0.5 rounded-md text-xs font-sans text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onView={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4 rounded-lg bg-white border border-slate-200">
            <div className="w-12 h-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
              No reference products found
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or filter selections.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); setActiveTag(null); }}
              className="mt-3 px-4 py-2 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
