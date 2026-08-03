import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Download, 
  QrCode, 
  Info, 
  Layers, 
  Maximize2, 
  RotateCcw,
  Camera,
  Search,
  Lock,
  X,
  Share2
} from 'lucide-react';
import { AnalysisResult, SamplePreset, HeatmapPoint } from '../types';
import { SAMPLE_PRESETS } from '../data/presets';
import { VeriLensIcon } from './VeriLensIcon';

interface DashboardProps {
  onRunAnalysis: (data: { imageUrl: string; reviewText: string; brand?: string; category?: string; itemName?: string }) => Promise<AnalysisResult>;
  initialPreset?: SamplePreset | null;
  onSaveToVault?: (result: AnalysisResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onRunAnalysis, initialPreset, onSaveToVault }) => {
  // Input State
  const [imageUrl, setImageUrl] = useState<string>(initialPreset?.imageUrl || SAMPLE_PRESETS[0].imageUrl);
  const [reviewText, setReviewText] = useState<string>(initialPreset?.defaultReview || SAMPLE_PRESETS[0].defaultReview);
  const [itemName, setItemName] = useState<string>(initialPreset?.title || SAMPLE_PRESETS[0].title);
  const [brand, setBrand] = useState<string>(initialPreset?.brand || SAMPLE_PRESETS[0].brand);
  const [category, setCategory] = useState<string>(initialPreset?.category || SAMPLE_PRESETS[0].category);

  // Analysis Lifecycle State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('Initializing...');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Interactive Heatmap UI State
  const [selectedHotspot, setSelectedHotspot] = useState<HeatmapPoint | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'bounding_boxes' | 'raw'>('heatmap');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load Preset
  const handleSelectPreset = (preset: SamplePreset) => {
    setImageUrl(preset.imageUrl);
    setReviewText(preset.defaultReview);
    setItemName(preset.title);
    setBrand(preset.brand);
    setCategory(preset.category);
    setAnalysisResult(null);
  };

  // Trigger Analysis
  const handleAnalyze = async () => {
    if (!imageUrl && !reviewText) return;

    setIsLoading(true);
    setAnalysisResult(null);

    // Scanning progress steps for high precision feel
    const steps = [
      'Initializing Multimodal Inspection...',
      'Extracting Visual Micro-Stitch Patterns...',
      'Analyzing Hardware Electroplating & Debossing...',
      'Evaluating Review Text Perplexity & Bot Entropy...',
      'Generating Cross-Modal XAI Heatmap & Trust Score...'
    ];

    let stepIdx = 0;
    setScanStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setScanStep(steps[stepIdx]);
      }
    }, 450);

    try {
      const result = await onRunAnalysis({
        imageUrl,
        reviewText,
        brand,
        category,
        itemName
      });

      clearInterval(interval);
      setAnalysisResult(result);
      if (result.heatmapPoints && result.heatmapPoints.length > 0) {
        setSelectedHotspot(result.heatmapPoints[0]);
      }
      if (onSaveToVault) {
        onSaveToVault(result);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      clearInterval(interval);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
            <VeriLensIcon className="w-3.5 h-3.5 text-emerald-400" />
            LIVE AI FORENSIC DASHBOARD
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Apparel & Review Authenticator</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload product imagery and paste reseller review text for deep multimodal evaluation.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Quick Presets:</span>
          {SAMPLE_PRESETS.slice(0, 3).map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
                itemName === preset.title
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {preset.title.split(' ')[0]} {preset.brand}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Area vs Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Area (Image + Review Text) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Product Image Upload Zone */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                1. Upload Product Image
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" /> Browse Files
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Drag and drop zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !imageUrl && fileInputRef.current?.click()}
              className="relative min-h-[240px] rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 bg-slate-950/70 p-4 transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
            >
              {imageUrl ? (
                <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden flex items-center justify-center bg-black/40">
                  <img
                    src={imageUrl}
                    alt="Apparel upload preview"
                    className="max-h-[220px] w-auto object-contain rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Replace Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 py-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Drag & drop product image here</p>
                    <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, WEBP (Luxury Bags, Sneakers, Streetwear)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Basic Item details input */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">Item Title</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Chanel Flap Bag"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Chanel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: E-Commerce Review Text Area */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                2. Paste E-Commerce Review
              </label>
              <button
                type="button"
                onClick={() => setReviewText('')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Clear Text
              </button>
            </div>

            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste the buyer or reseller review text here to test for synthetic bot manipulation and sentiment mismatch..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-sans leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{reviewText.length} characters</span>
              <span className="text-indigo-400 font-mono">NLP Perplexity Forensics Ready</span>
            </div>
          </div>

          {/* Action Button: Analyze Authenticity */}
          <button
            id="analyze-authenticity-btn"
            onClick={handleAnalyze}
            disabled={isLoading || (!imageUrl && !reviewText)}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-3 active:scale-98 ${
              isLoading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-indigo-600/25 hover:shadow-indigo-600/40'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                <span>{scanStep}</span>
              </>
            ) : (
              <>
                <VeriLensIcon className="w-5 h-5 text-emerald-300" />
                <span>Analyze Authenticity</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Results Area (XAI Heatmap, Trust Gauge, Analysis Details) */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            /* Loading State Animation Container */
            <div className="p-12 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-emerald-400 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-emerald-500/20 border-b-indigo-400 animate-spin [animation-duration:1.5s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{scanStep}</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  VeriLens AI engine is cross-referencing stitching vectors and review text entropy against verified master databases.
                </p>
              </div>
            </div>
          ) : analysisResult ? (
            /* Results Available View */
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Result Summary Card */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{analysisResult.itemName}</h2>
                      <span className="text-xs text-slate-400">({analysisResult.brand})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Scan Hash: <span className="font-mono text-indigo-400">{analysisResult.verificationHash}</span> • {analysisResult.timestamp}</p>
                  </div>

                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>View Digital Certificate</span>
                  </button>
                </div>

                {/* Score Circular Ring & AI Confidence Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  {/* Trust Gauge Ring */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      {/* SVG Circular Progress Bar */}
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          className="stroke-slate-800 fill-none stroke-[8]"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          className={`fill-none stroke-[8] transition-all duration-1000 ${
                            analysisResult.trustScore >= 80
                              ? 'stroke-emerald-400'
                              : analysisResult.trustScore >= 50
                              ? 'stroke-amber-400'
                              : 'stroke-red-500'
                          }`}
                          strokeDasharray="264"
                          strokeDashoffset={264 - (264 * analysisResult.trustScore) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-extrabold text-white tracking-tight">{analysisResult.trustScore}%</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trust Score</span>
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        analysisResult.trustScore >= 80
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : analysisResult.trustScore >= 50
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {analysisResult.verdict}
                      </span>
                    </div>
                  </div>

                  {/* AI Metric Breakdown Gauges */}
                  <div className="sm:col-span-7 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">AI Multimodal Confidence</span>
                      <span className="text-emerald-400 font-bold font-mono">{analysisResult.aiConfidence}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-1000"
                        style={{ width: `${analysisResult.aiConfidence}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between">
                        <span className="text-slate-400">Stitching Pitch</span>
                        <span className="font-bold text-white font-mono">{analysisResult.detailedScores.stitchingQuality}%</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between">
                        <span className="text-slate-400">Hardware Engraving</span>
                        <span className="font-bold text-white font-mono">{analysisResult.detailedScores.hardwareAuthenticity}%</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between">
                        <span className="text-slate-400">Care Tag Font</span>
                        <span className="font-bold text-white font-mono">{analysisResult.detailedScores.typographyAccuracy}%</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between">
                        <span className="text-slate-400">Review NLP Naturalness</span>
                        <span className="font-bold text-white font-mono">{analysisResult.detailedScores.reviewPerplexity}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cross-Modal XAI Heatmap Visual Inspector */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">XAI Heatmap & Visual Bounding Boxes</h3>
                  </div>

                  {/* Mode Toggles */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setViewMode('heatmap')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        viewMode === 'heatmap' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Heatmap
                    </button>
                    <button
                      onClick={() => setViewMode('bounding_boxes')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        viewMode === 'bounding_boxes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Bounding Boxes
                    </button>
                    <button
                      onClick={() => setViewMode('raw')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        viewMode === 'raw' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Original
                    </button>
                  </div>
                </div>

                {/* Interactive Image Canvas Display */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[320px] flex items-center justify-center">
                  <img
                    src={analysisResult.imageUrl}
                    alt={analysisResult.itemName}
                    className="max-h-[360px] w-auto object-contain rounded-lg"
                  />

                  {/* Heatmap Overlay Simulation */}
                  {viewMode === 'heatmap' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/15 via-indigo-500/10 to-red-500/15 mix-blend-color-dodge pointer-events-none" />
                  )}

                  {/* Bounding Box Hotspot Overlays */}
                  {viewMode !== 'raw' && analysisResult.heatmapPoints.map(point => {
                    const isSelected = selectedHotspot?.id === point.id;
                    return (
                      <div
                        key={point.id}
                        onClick={() => setSelectedHotspot(point)}
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          width: `${point.width}%`,
                          height: `${point.height}%`
                        }}
                        className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-start justify-start p-1 ${
                          point.severity === 'critical' || point.severity === 'high'
                            ? 'border-red-500 bg-red-500/20 shadow-lg shadow-red-500/30'
                            : 'border-emerald-400 bg-emerald-400/20 shadow-lg shadow-emerald-400/30'
                        } ${isSelected ? 'ring-4 ring-white z-20 scale-105' : 'hover:scale-102 z-10'}`}
                      >
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-950 uppercase ${
                          point.severity === 'critical' || point.severity === 'high' ? 'bg-red-400' : 'bg-emerald-400'
                        }`}>
                          {point.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Hotspot Detailed Explanation Box */}
                {selectedHotspot && (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{selectedHotspot.label}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 uppercase">
                          {selectedHotspot.category}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold font-mono">
                        {selectedHotspot.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{selectedHotspot.description}</p>
                  </div>
                )}
              </div>

              {/* Fake Review NLP Forensics & Reasoning */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  NLP Review Forensics & XAI Reasoning
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fake review score */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Bot / Synthetic Review Probability</span>
                      <span className={`font-mono font-bold ${
                        analysisResult.fakeReviewProbability > 50 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {analysisResult.fakeReviewProbability}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          analysisResult.fakeReviewProbability > 50 ? 'bg-red-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${analysisResult.fakeReviewProbability}%` }}
                      />
                    </div>

                    <div className="pt-2 space-y-1">
                      {analysisResult.reviewFlags.map((flag, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            flag.severity === 'high' ? 'text-red-400' : 'text-amber-400'
                          }`} />
                          <div>
                            <span className="font-semibold text-white">{flag.type}: </span>
                            <span className="text-slate-400">{flag.explanation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reasoning list */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-white block">Key XAI Inspection Notes</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {analysisResult.xaiReasoning.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Empty State: Ready for analysis */
            <div className="p-12 rounded-3xl bg-slate-900/90 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-4 min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <VeriLensIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Ready for AI Verification</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Select a preset on the left or upload your own fashion item to run real-time multimodal visual & NLP inspection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable / View Digital Certificate Modal */}
      {showCertificateModal && analysisResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-8 space-y-6 shadow-2xl text-slate-200">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-slate-800 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white font-sans">VeriStyle Authenticity Certificate</h2>
              <p className="text-xs text-slate-400">Digital Fashion Provenance & Forensics Seal</p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Item Name:</span>
                <span className="font-bold text-white">{analysisResult.itemName}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Brand / Manufacturer:</span>
                <span className="font-bold text-white">{analysisResult.brand}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Verification Verdict:</span>
                <span className={`font-extrabold font-mono ${
                  analysisResult.trustScore >= 80 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {analysisResult.verdict} ({analysisResult.trustScore}%)
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Blockchain Hash:</span>
                <span className="font-mono text-indigo-400">{analysisResult.verificationHash}</span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Scan QR for Online Verification</p>
                <p className="text-[11px] text-slate-400">Immutable record stored in VeriStyle Vault</p>
              </div>
              <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
