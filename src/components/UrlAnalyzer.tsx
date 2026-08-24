import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertTriangle, ArrowRight, XCircle, Loader2, Sparkles, Box, CheckCircle2, RefreshCw } from 'lucide-react';
import { UrlAnalysisResult } from '../types';

interface UrlAnalyzerProps {
  onAnalyzeComplete?: (result: UrlAnalysisResult) => void;
  standalone?: boolean;
}

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onAnalyzeComplete, standalone = true }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'input' | 'loading' | 'result' | 'error'>('input');
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  const loadingSteps = [
    'Detecting platform...',
    'Fetching product page...',
    'Extracting product data...',
    'Running AI analysis...',
    'Generating verdict...'
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setStatus('loading');
    setLoadingStep(0);
    setErrorMsg('');

    // Simulate progress steps for UX
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      clearInterval(interval);
      setLoadingStep(4);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Unable to fetch this page. Try pasting the product name/review manually instead.');
      }

      const data: UrlAnalysisResult = await response.json();
      setResult(data);
      setStatus('result');
      if (onAnalyzeComplete) {
        onAnalyzeComplete(data);
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err.message || 'An error occurred during analysis.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setStatus('input');
    setErrorMsg('');
  };

  if (status === 'input' || status === 'error') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-full border border-gray-200 p-2 shadow-xl shadow-black/5 relative z-50">
          <div className="pl-4 flex-shrink-0 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="url"
            placeholder="Paste a product link from Amazon, Flipkart, Myntra..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 py-3 px-2 text-sm sm:text-base min-w-0 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={handleAnalyze}
            disabled={!url.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3 rounded-full bg-[var(--green-primary)] text-white text-sm font-bold hover:bg-[#146D2F] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Analyse with AI
          </button>
        </div>
        
        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800">Analysis Failed</h4>
              <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-xl shadow-black/5">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[var(--green-primary)]/10 flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 text-[var(--green-primary)] animate-spin" />
            </div>
          </div>
          
          <div className="space-y-4 w-full max-w-md">
            {loadingSteps.map((step, idx) => {
              const isActive = idx === loadingStep;
              const isPast = idx < loadingStep;
              
              return (
                <div key={idx} className={`flex items-center gap-3 transition-opacity duration-300 ${isPast || isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {isPast ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--green-primary)] shrink-0" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'result' && result) {
    const isAuthentic = result.trustScore >= 80;
    const isSuspicious = result.trustScore >= 50 && result.trustScore < 80;
    
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-700">
                {result.platform}
              </span>
              <span className="text-sm font-medium text-gray-500">
                Extracted Data Analysis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {result.itemName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Brand: <span className="font-semibold text-gray-700">{result.brand}</span></p>
          </div>
          <button 
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Analyze Another
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Left Col: Image & basic stats */}
          <div className="p-6 md:col-span-1 bg-white">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-6 border border-gray-100 relative group">
              <img 
                src={result.imageUrl} 
                alt={result.itemName}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-sm text-gray-500">Listed Price</span>
                <span className="font-bold text-gray-900">{result.extractedPrice || 'Not found'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-sm text-gray-500">Rating</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900">{result.extractedRating || 'N/A'}</span>
                  <span className="text-xs text-gray-400">({result.extractedReviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: AI Analysis */}
          <div className="p-6 md:col-span-2 bg-white">
            <div className={`p-5 rounded-2xl mb-8 flex items-start gap-4 border ${
              isAuthentic ? 'bg-[#D0FAE5]/30 border-[#009966]/20' : 
              isSuspicious ? 'bg-[#FEF3C6]/30 border-[#E17100]/20' : 
              'bg-red-50 border-red-100'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                isAuthentic ? 'bg-[#D0FAE5] text-[#009966]' : 
                isSuspicious ? 'bg-[#FEF3C6] text-[#E17100]' : 
                'bg-red-100 text-red-600'
              }`}>
                {isAuthentic ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${
                  isAuthentic ? 'text-[#009966]' : 
                  isSuspicious ? 'text-[#E17100]' : 
                  'text-red-700'
                }`}>
                  {result.verdict}
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {result.xaiReasoning[0]}
                </p>
              </div>
              <div className="ml-auto text-center shrink-0">
                <div className={`text-3xl font-black ${
                  isAuthentic ? 'text-[#009966]' : 
                  isSuspicious ? 'text-[#E17100]' : 
                  'text-red-600'
                }`}>
                  {result.trustScore}
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Score</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Box className="w-4 h-4 text-gray-400" />
                  Quality Analysis
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Stitching & Build', val: result.detailedScores.stitchingQuality },
                    { label: 'Hardware & Finish', val: result.detailedScores.hardwareAuthenticity },
                    { label: 'Brand Typography', val: result.detailedScores.typographyAccuracy }
                  ].map(score => (
                    <div key={score.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-600">{score.label}</span>
                        <span className="font-bold text-gray-900">{score.val}/100</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 bg-[var(--green-primary)]" 
                          style={{ width: `${score.val}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  Review & Text Forensics
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600">Fake Review Probability</span>
                      <span className={`text-xs font-bold ${result.fakeReviewProbability > 30 ? 'text-red-500' : 'text-[#009966]'}`}>
                        {result.fakeReviewProbability}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${result.fakeReviewProbability > 30 ? 'bg-red-500' : 'bg-[#009966]'}`} 
                        style={{ width: `${result.fakeReviewProbability}%` }} 
                      />
                    </div>
                  </div>
                  
                  {result.reviewFlags.slice(0,2).map((flag, idx) => (
                    <div key={idx} className="flex gap-2 text-xs">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${flag.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                      <span className="text-gray-600">{flag.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-3">AI Recommendations</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[var(--green-primary)] shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
