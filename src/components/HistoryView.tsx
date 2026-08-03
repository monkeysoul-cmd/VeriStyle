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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
            <History className="w-3.5 h-3.5" />
            SAVED VERIFICATION VAULT
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Apparel Provenance Vault</h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse and export previously executed AI authenticity scans and cryptographic inspection records.
          </p>
        </div>

        {onClearHistory && history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Vault History</span>
          </button>
        )}
      </div>

      {/* Controls: Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by apparel name, brand, or hash..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterVerdict}
            onChange={(e) => setFilterVerdict(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
          {filteredHistory.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectResult(item)}
              className="group cursor-pointer p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-indigo-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    {item.verificationHash}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    item.trustScore >= 80
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : item.trustScore >= 50
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {item.verdict}
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-slate-400">{item.brand} • {item.category}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{item.timestamp}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Trust Score:</span>
                  <span className="font-bold font-mono text-white text-sm">{item.trustScore}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-emerald-400 transition-colors">
                <span>Inspect Visual Heatmap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
          <p className="text-base font-bold text-white">No scans found matching your filter</p>
          <p className="text-xs text-slate-400">Run an AI inspection on the dashboard to store provenance records in your vault.</p>
        </div>
      )}
    </div>
  );
};
