import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  DatabaseZap,
  ChevronDown,
} from 'lucide-react';
import { AnalysisResult } from '../types';

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
      badge: {
        background: 'linear-gradient(135deg, rgba(0,240,139,0.14) 0%, rgba(0,200,101,0.08) 100%)',
        border: '1px solid rgba(0,240,139,0.4)',
        color: '#027A3D',
        boxShadow: '0 0 10px rgba(0,240,139,0.15)',
      },
      bar: '#00F08B',
      barGlow: 'rgba(0,240,139,0.45)',
      dot: '#00F08B',
      cardBorder: 'rgba(15,23,42,0.08)',
      cardBorderHover: 'rgba(0,240,139,0.45)',
      label: 'VERIFIED AUTHENTIC',
      icon: ShieldCheck,
    };
    if (score >= 50) return {
      badge: {
        background: 'linear-gradient(135deg, rgba(255,184,0,0.14) 0%, rgba(245,158,11,0.08) 100%)',
        border: '1px solid rgba(255,184,0,0.4)',
        color: '#92400E',
        boxShadow: '0 0 10px rgba(255,184,0,0.15)',
      },
      bar: '#FFB800',
      barGlow: 'rgba(255,184,0,0.45)',
      dot: '#FFB800',
      cardBorder: 'rgba(15,23,42,0.08)',
      cardBorderHover: 'rgba(255,184,0,0.45)',
      label: 'SUSPICIOUS SPECIMEN',
      icon: AlertTriangle,
    };
    return {
      badge: {
        background: 'linear-gradient(135deg, rgba(255,30,86,0.14) 0%, rgba(244,63,94,0.08) 100%)',
        border: '1px solid rgba(255,30,86,0.4)',
        color: '#9F1239',
        boxShadow: '0 0 10px rgba(255,30,86,0.15)',
      },
      bar: '#FF1E56',
      barGlow: 'rgba(255,30,86,0.45)',
      dot: '#FF1E56',
      cardBorder: 'rgba(15,23,42,0.08)',
      cardBorderHover: 'rgba(255,30,86,0.45)',
      label: 'COUNTERFEIT ALERT',
      icon: XCircle,
    };
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-8 border-b border-slate-200/80"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="section-badge mb-4">
              <History className="w-3.5 h-3.5" />
              Cryptographic Records
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
            >
              Verification{' '}
              <span
                className="italic"
                style={{
                  fontFamily: 'var(--font-serif)',
                  background: 'linear-gradient(135deg, #00C865 0%, #05DF72 40%, #6366F1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Vault.
              </span>
            </h1>
            <p className="text-sm mt-2 text-slate-500">
              Browse, filter, and inspect immutably recorded AI luxury authenticity audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <div
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-800"
              >
                <DatabaseZap className="w-3.5 h-3.5 text-emerald-600" />
                {history.length} verified scan{history.length !== 1 ? 's' : ''}
              </div>
            )}
            {onClearHistory && history.length > 0 && (
              <motion.button
                onClick={onClearHistory}
                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Vault
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by apparel name, brand, or cryptographic hash..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white border border-slate-200/80 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs text-slate-800 placeholder:text-slate-400 font-medium transition-all"
            />
          </div>

          {/* Filter */}
          <div className="md:col-span-4 relative">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-sm rounded-2xl cursor-pointer appearance-none bg-white border border-slate-200/80 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs text-slate-800 font-semibold transition-all"
            >
              <option value="ALL">All Verdicts</option>
              <option value="AUTHENTIC">✓ Verified Authentic (≥80%)</option>
              <option value="SUSPICIOUS">⚠ Suspicious (50-79%)</option>
              <option value="COUNTERFEIT">✗ Likely Counterfeit (&lt;50%)</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </motion.div>

        {/* History Grid */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item, idx) => {
              const vs = getVerdictStyle(item.trustScore);
              const VerdictIcon = vs.icon;

              return (
                <motion.div
                  key={item.id}
                  onClick={() => onSelectResult(item)}
                  className="group cursor-pointer p-6 rounded-3xl flex flex-col justify-between space-y-5 transition-all duration-300 bg-white border border-slate-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5 }}
                >
                  {/* Top: Hash + Verdict badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-500"
                    >
                      <Hash className="w-3 h-3 text-slate-400" />
                      {(item.verificationHash || '0xverified').slice(0, 14)}…
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs"
                      style={vs.badge}
                    >
                      <VerdictIcon className="w-3.5 h-3.5" />
                      {vs.label}
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-slate-50 border border-slate-100 p-1.5"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                        />
                      ) : (
                        <Package className="w-7 h-7 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-bold text-sm truncate mb-0.5 text-slate-900 group-hover:text-emerald-700 transition-colors"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {item.itemName}
                      </h3>
                      <p className="text-xs font-semibold truncate text-slate-500">
                        {item.brand} · {item.category}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] mt-1.5 text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-400">Authenticity Trust Gauge</span>
                      <span className="font-black font-mono text-base" style={{ color: vs.dot }}>
                        {item.trustScore}%
                      </span>
                    </div>
                    <div className="metric-track">
                      <div
                        className="metric-fill transition-all duration-700"
                        style={{
                          width: `${item.trustScore}%`,
                          background: `linear-gradient(90deg, ${vs.bar}88, ${vs.bar})`,
                          boxShadow: `0 0 12px ${vs.barGlow}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div
                    className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-100 text-slate-500 group-hover:text-emerald-700 transition-colors"
                  >
                    <span>View Forensic Report</span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="py-20 rounded-3xl text-center space-y-4 bg-white border border-slate-200/80 shadow-xs"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 bg-slate-100 border border-slate-200"
            >
              <History className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-800" style={{ fontFamily: 'var(--font-heading)' }}>
              {searchTerm || filterVerdict !== 'ALL' ? 'No scans match your filter' : 'Your vault is empty'}
            </p>
            <p className="text-sm max-w-sm mx-auto text-slate-500">
              {searchTerm || filterVerdict !== 'ALL'
                ? 'Try adjusting your search query or verdict filters to find records.'
                : 'Run an AI authenticity inspection on the Inspector dashboard to log provenance records here.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
