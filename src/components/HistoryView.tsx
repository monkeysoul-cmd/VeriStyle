import React, { useState } from 'react';
import { 
  History, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Trash2, 
  Filter,
  ArrowRight,
  Download
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

  return (
    <div className="w-full bg-[var(--page-light)] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-xs font-semibold mb-2 border border-[var(--green-primary)]/20">
              <History className="w-3.5 h-3.5" />
              SAVED VERIFICATION HISTORY
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Saved History</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Browse and export previously executed authenticity scans and inspection records.
            </p>
          </div>

          {onClearHistory && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="self-start md:self-auto px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Controls: Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by apparel name, brand, or hash..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:border-[var(--green-primary)] focus:ring-1 focus:ring-[var(--green-primary)] transition-colors shadow-sm"
            />
          </div>

          {/* Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--green-primary)] focus:ring-1 focus:ring-[var(--green-primary)] cursor-pointer transition-colors shadow-sm"
            >
              <option value="ALL">All Verdicts</option>
              <option value="AUTHENTIC">Verified Authentic (≥80%)</option>
              <option value="SUSPICIOUS">Suspicious Review / Risk (50-79%)</option>
              <option value="COUNTERFEIT">Likely Counterfeit (&lt;50%)</option>
            </select>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map(item => {
              const isAuthentic = item.trustScore >= 80;
              const isSuspicious = item.trustScore >= 50 && item.trustScore < 80;
              const scoreColor = isAuthentic ? '#059669' : isSuspicious ? '#d97706' : '#dc2626';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectResult(item)}
                  className="group cursor-pointer p-6 rounded-3xl bg-white border border-[var(--border-card)] hover:border-[var(--green-primary)] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[var(--green-primary)] font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                        {item.verificationHash}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${
                        isAuthentic
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isSuspicious
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {item.verdict}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 p-1 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          className="max-h-full max-w-full object-contain rounded-xl mix-blend-multiply group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-[var(--text-primary)] text-sm group-hover:text-[var(--green-primary)] transition-colors truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                          {item.itemName}
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold truncate mt-0.5">{item.brand} • {item.category}</p>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">{item.timestamp}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Trust Score:</span>
                      <span className="font-black font-mono text-base" style={{ color: scoreColor }}>
                        {item.trustScore}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-[var(--green-primary)] transition-colors">
                    <span>Inspect Visual Heatmap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[var(--green-primary)]" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-[var(--border-card)] text-center space-y-3 shadow-sm">
            <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>No scans found matching your filter</p>
            <p className="text-xs text-[var(--text-muted)] font-medium">Run an AI inspection on the dashboard to store provenance records in your vault.</p>
          </div>
        )}
      </div>
    </div>
  );
};

