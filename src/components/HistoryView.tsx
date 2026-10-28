import React, { useState } from 'react';
import {
  History,
  Search,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  Filter,
  ArrowRight,
  Clock,
  Hash,
  Package,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PlatformLogo, PlatformBadge } from './PlatformLogo';

interface HistoryViewProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectResult, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');

  const filteredHistory = history.filter(item => {
    const searchLower = (searchTerm || '').toLowerCase().trim();
    const itemName = (item?.itemName || '').toLowerCase();
    const brand = (item?.brand || '').toLowerCase();
    const hash = (item?.verificationHash || '').toLowerCase();
    const matchesSearch = !searchLower || itemName.includes(searchLower) || brand.includes(searchLower) || hash.includes(searchLower);
    if (filterVerdict === 'ALL') return matchesSearch;
    if (filterVerdict === 'AUTHENTIC') return matchesSearch && (item.trustScore ?? 0) >= 80;
    if (filterVerdict === 'COUNTERFEIT') return matchesSearch && (item.trustScore ?? 0) < 50;
    if (filterVerdict === 'SUSPICIOUS') return matchesSearch && (item.trustScore ?? 0) >= 50 && (item.trustScore ?? 0) < 80;
    return matchesSearch;
  });

  const getVerdictStyle = (score: number) => {
    if (score >= 80) return {
      badge: 'bg-amber-50 text-amber-900 border-amber-300',
      bar: '#B8860B',
      dot: '#B8860B',
      label: 'VERIFIED AUTHENTIC',
      icon: ShieldCheck,
    };
    if (score >= 50) return {
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      bar: '#D97706',
      dot: '#D97706',
      label: 'SUSPICIOUS SPECIMEN',
      icon: AlertTriangle,
    };
    return {
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      bar: '#DC2626',
      dot: '#DC2626',
      label: 'COUNTERFEIT ALERT',
      icon: XCircle,
    };
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 bg-slate-50 text-slate-900 aurora-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/60">
          <div>
            <div className="section-badge mb-2">
              Private Device Storage
            </div>
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="text-slate-950">Inspection Vault & </span>
              <span className="hero-gold-glow font-black inline-block">
                Provenance History
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cryptographically signed inspection logs saved locally in your browser. Zero cloud retention.
            </p>
          </div>

          {history.length > 0 && onClearHistory && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors self-start md:self-auto cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Vault History
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by apparel name, brand, or cryptographic hash..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 focus:outline-none text-slate-900 placeholder:text-slate-400 font-normal shadow-2xs"
            />
          </div>

          {/* Filter: No Emojis in Options */}
          <div className="md:col-span-4 relative">
            <Filter className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600" />
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs rounded-lg cursor-pointer appearance-none bg-white border border-slate-300 hover:border-amber-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-400/20 focus:outline-none text-slate-800 font-semibold shadow-2xs transition-colors"
            >
              <option value="ALL">All Verdicts</option>
              <option value="AUTHENTIC">Verified Authentic (80% or higher)</option>
              <option value="SUSPICIOUS">Suspicious (50-79%)</option>
              <option value="COUNTERFEIT">Likely Counterfeit (Under 50%)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* History Grid */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHistory.map((item) => {
              const vs = getVerdictStyle(item.trustScore);
              const VerdictIcon = vs.icon;
              const borderAccent = item.trustScore >= 80 ? 'border-l-amber-500' : item.trustScore >= 50 ? 'border-l-amber-400' : 'border-l-rose-500';

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  onClick={() => onSelectResult(item)}
                  className={`group cursor-pointer p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300 bg-white border border-slate-200/90 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/10 shadow-2xs border-l-4 ${borderAccent}`}
                >
                  {/* Top: Hash + Platform + Verdict badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50/80 border border-amber-200/80 text-amber-900">
                        <Hash className="w-3 h-3 text-amber-600" />
                        {(item.verificationHash || '0xverified').slice(0, 14)}
                      </div>
                      {(item.platform || item.productUrl) && (
                        <PlatformBadge platform={item.platform || item.productUrl!} size="sm" />
                      )}
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border ${vs.badge}`}>
                      <VerdictIcon className="w-3 h-3" />
                      {vs.label}
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-50 border border-slate-200 p-1">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('/api/image-proxy') && target.src.startsWith('http')) {
                              target.src = `/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}`;
                            } else {
                              target.style.display = 'none';
                            }
                          }}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-bold text-xs truncate mb-0.5 text-slate-900 group-hover:text-amber-700 transition-colors"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {item.itemName}
                      </h3>
                      <p className="text-[11px] font-medium truncate text-slate-500">
                        {item.brand} | {item.category}
                      </p>
                      <p className="flex items-center gap-1 text-[10px] mt-1 text-slate-400 font-mono">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-600 font-mono text-[10px] uppercase">Authenticity Score</span>
                      <span className="font-bold font-mono text-sm text-slate-900">
                        {item.trustScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${item.trustScore}%`,
                          backgroundColor: vs.bar,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="flex items-center justify-between text-xs font-semibold pt-3 border-t border-slate-100 text-slate-600 group-hover:text-slate-950 transition-colors">
                    <span>Inspect Full Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 rounded-md text-center space-y-3 bg-white border border-slate-200">
            <div className="w-12 h-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800" style={{ fontFamily: 'var(--font-heading)' }}>
              {searchTerm || filterVerdict !== 'ALL' ? 'No records match your filter criteria' : 'Your inspection vault is empty'}
            </p>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              {searchTerm || filterVerdict !== 'ALL'
                ? 'Try adjusting your search query or verdict filters.'
                : 'Run an authenticity inspection on the Inspector dashboard to log provenance records.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
