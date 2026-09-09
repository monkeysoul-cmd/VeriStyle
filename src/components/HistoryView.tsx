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
  Download,
  Clock,
  Hash,
  Package,
  XCircle,
  DatabaseZap,
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
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.verificationHash.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterVerdict === 'ALL') return matchesSearch;
    if (filterVerdict === 'AUTHENTIC') return matchesSearch && item.trustScore >= 80;
    if (filterVerdict === 'COUNTERFEIT') return matchesSearch && item.trustScore < 50;
    if (filterVerdict === 'SUSPICIOUS') return matchesSearch && item.trustScore >= 50 && item.trustScore < 80;
    return matchesSearch;
  });

  const getVerdictStyle = (score: number) => {
    if (score >= 80) return {
      badge: { background: 'rgba(52,216,138,0.1)', border: '1px solid rgba(52,216,138,0.25)', color: '#059669' },
      bar: '#059669',
      barGlow: 'rgba(52,216,138,0.3)',
      dot: '#059669',
      cardBorder: 'rgba(0,0,0,0.06)',
      cardBorderHover: 'rgba(52,216,138,0.35)',
      label: 'AUTHENTIC',
      icon: ShieldCheck,
    };
    if (score >= 50) return {
      badge: { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#D97706' },
      bar: '#D97706',
      barGlow: 'rgba(245,158,11,0.25)',
      dot: '#D97706',
      cardBorder: 'rgba(0,0,0,0.06)',
      cardBorderHover: 'rgba(245,158,11,0.35)',
      label: 'SUSPICIOUS',
      icon: AlertTriangle,
    };
    return {
      badge: { background: 'rgba(251,113,133,0.12)', border: '1px solid rgba(244,63,94,0.25)', color: '#E11D48' },
      bar: '#E11D48',
      barGlow: 'rgba(251,113,133,0.3)',
      dot: '#E11D48',
      cardBorder: 'rgba(0,0,0,0.06)',
      cardBorderHover: 'rgba(244,63,94,0.35)',
      label: 'COUNTERFEIT',
      icon: XCircle,
    };
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-8"
          style={{ borderBottom: '1px solid rgba(0,80,40,0.06)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="section-badge mb-4">
              <History className="w-3.5 h-3.5" />
              Verification Vault
            </div>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
            >
              Scan History
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Browse and export previously executed authenticity scans and inspection records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(0,80,40,0.06)', border: '1px solid rgba(0,80,40,0.08)', color: 'var(--text-muted)' }}
              >
                <DatabaseZap className="w-3.5 h-3.5" style={{ color: 'var(--green-accent-from)' }} />
                {history.length} record{history.length !== 1 ? 's' : ''}
              </div>
            )}
            {onClearHistory && history.length > 0 && (
              <motion.button
                onClick={onClearHistory}
                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                style={{
                  background: 'rgba(251,113,133,0.08)',
                  border: '1px solid rgba(244,63,94,0.15)',
                  color: '#F43F5E',
                }}
                whileHover={{ scale: 1.02, background: 'rgba(251,113,133,0.14)' }}
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
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by apparel name, brand, or hash..."
              className="input-dark w-full pl-11 pr-4 py-3 text-sm rounded-xl"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* Filter */}
          <div className="md:col-span-4 relative">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="input-dark w-full pl-11 pr-4 py-3 text-sm rounded-xl cursor-pointer appearance-none"
            >
              <option value="ALL">All Verdicts</option>
              <option value="AUTHENTIC">✓ Verified Authentic (≥80%)</option>
              <option value="SUSPICIOUS">⚠ Suspicious (50-79%)</option>
              <option value="COUNTERFEIT">✗ Likely Counterfeit (&lt;50%)</option>
            </select>
          </div>
        </motion.div>

        {/* History Grid */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHistory.map((item, idx) => {
              const vs = getVerdictStyle(item.trustScore);
              const VerdictIcon = vs.icon;

              return (
                <motion.div
                  key={item.id}
                  onClick={() => onSelectResult(item)}
                  className="group cursor-pointer p-6 rounded-2xl flex flex-col justify-between space-y-5 transition-all duration-300"
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${vs.cardBorder}`,
                    boxShadow: 'var(--card-shadow)',
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, borderColor: vs.cardBorderHover, boxShadow: 'var(--card-shadow-hover)' }}
                >
                  {/* Top: Hash + Verdict badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold"
                      style={{ background: 'rgba(0,160,70,0.05)', border: '1px solid rgba(0,80,40,0.08)', color: 'var(--text-muted)' }}
                    >
                      <Hash className="w-3 h-3" />
                      {item.verificationHash.slice(0, 14)}…
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={vs.badge}
                    >
                      <VerdictIcon className="w-3 h-3" />
                      {vs.label}
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(0,60,30,0.03)', border: '1px solid rgba(0,60,30,0.05)' }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                          style={{ mixBlendMode: 'luminosity', filter: 'brightness(0.9)' }}
                        />
                      ) : (
                        <Package className="w-7 h-7" style={{ color: 'var(--text-dim)' }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-bold text-sm truncate mb-0.5 transition-colors"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                      >
                        {item.itemName}
                      </h3>
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-muted)' }}>
                        {item.brand} · {item.category}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] mt-1.5" style={{ color: 'var(--text-dim)' }}>
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Trust Score</span>
                      <span className="font-black font-mono text-base" style={{ color: vs.dot }}>
                        {item.trustScore}%
                      </span>
                    </div>
                    <div className="metric-track">
                      <div
                        className="metric-fill"
                        style={{
                          width: `${item.trustScore}%`,
                          background: `linear-gradient(90deg, ${vs.bar}88, ${vs.bar})`,
                          boxShadow: `0 0 8px ${vs.barGlow}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div
                    className="flex items-center justify-between text-xs font-bold transition-colors pt-3"
                    style={{
                      borderTop: '1px solid rgba(0,60,30,0.04)',
                      color: 'var(--text-dim)',
                    }}
                  >
                    <span className="group-hover:text-[var(--green-accent-from)] transition-colors">View Analysis Report</span>
                    <ArrowRight
                      className="w-4 h-4 transition-all group-hover:translate-x-1.5 group-hover:text-[var(--green-accent-from)]"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="py-20 rounded-2xl text-center space-y-4"
            style={{ background: 'var(--bg-surface-1)', border: '1px solid rgba(0,80,40,0.06)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2"
              style={{ background: 'rgba(0,80,40,0.06)', border: '1px solid rgba(0,80,40,0.08)' }}
            >
              <History className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              {searchTerm || filterVerdict !== 'ALL' ? 'No scans match your filter' : 'Your vault is empty'}
            </p>
            <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
              {searchTerm || filterVerdict !== 'ALL'
                ? 'Try adjusting your search or filters to find records.'
                : 'Run an AI inspection on the dashboard to store provenance records here.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
