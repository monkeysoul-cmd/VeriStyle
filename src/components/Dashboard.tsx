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
    <div className="w-full bg-[var(--page-light)] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--green-primary)]/10 text-[var(--green-primary)] text-xs font-bold uppercase tracking-wider mb-3">
              <VeriLensIcon className="w-3.5 h-3.5" />
              LIVE AI FORENSIC DASHBOARD
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Apparel & Review Authenticator.
            </h1>
            <p className="text-[var(--text-muted)] text-sm sm:text-base mt-2 max-w-xl">
              Upload product imagery and paste reseller review text for deep multimodal evaluation.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
            <span className="text-xs text-gray-500 shrink-0 font-bold uppercase tracking-wider">Quick Presets:</span>
            {SAMPLE_PRESETS.slice(0, 3).map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
                  itemName === preset.title
                    ? 'bg-[var(--green-primary)] text-white border-[var(--green-primary)] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--green-primary)]'
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
            <div className="p-6 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <label className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[var(--green-primary)]" />
                  1. Upload Product Image
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[var(--green-primary)] hover:text-green-700 font-bold flex items-center gap-1 bg-[var(--green-primary)]/10 px-2 py-1 rounded-full"
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
                className="relative min-h-[240px] rounded-2xl border-2 border-dashed border-gray-200 hover:border-[var(--green-primary)] bg-gray-50 hover:bg-[var(--green-primary)]/5 p-4 transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
              >
                {imageUrl ? (
                  <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden flex items-center justify-center bg-white p-2 border border-gray-100">
                    <img
                      src={imageUrl}
                      alt="Apparel upload preview"
                      className="max-h-[220px] w-auto object-contain rounded-lg group-hover:scale-[1.02] transition-transform mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Replace Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 py-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--green-primary)]/10 flex items-center justify-center text-[var(--green-primary)] mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[var(--text-primary)]">Drag & drop product image here</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Supports PNG, JPG, WEBP</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Item details input */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Item Title</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Chanel Flap Bag"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--green-primary)] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Chanel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--green-primary)] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: E-Commerce Review Text Area */}
            <div className="p-6 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <label className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  2. Paste E-Commerce Review
                </label>
                <button
                  type="button"
                  onClick={() => setReviewText('')}
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-700 uppercase tracking-wider transition-colors"
                >
                  Clear Text
                </button>
              </div>

              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Paste the buyer or reseller review text here to test for synthetic bot manipulation and sentiment mismatch..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none font-medium leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>{reviewText.length} characters</span>
                <span className="text-purple-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> NLP Ready
                </span>
              </div>
            </div>

            {/* Action Button: Analyze Authenticity */}
            <button
              id="analyze-authenticity-btn"
              onClick={handleAnalyze}
              disabled={isLoading || (!imageUrl && !reviewText)}
              className={`w-full py-4.5 rounded-full font-bold text-[15px] shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 ${
                isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-[var(--text-primary)] hover:bg-gray-800 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                  <span>{scanStep}</span>
                </>
              ) : (
                <>
                  <VeriLensIcon className="w-5 h-5 text-[var(--green-primary)]" />
                  <span>Analyze Authenticity</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Results Area (XAI Heatmap, Trust Gauge, Analysis Details) */}
          <div className="lg:col-span-7 space-y-6">
            {isLoading ? (
              /* Loading State Animation Container */
              <div className="p-12 rounded-3xl bg-white border border-[var(--border-card)] flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] shadow-sm">
                <div className="relative w-28 h-28">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-[var(--green-primary)] animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-gray-50 border-b-purple-500 animate-spin [animation-duration:1.5s]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-[var(--green-primary)] animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{scanStep}</h3>
                  <p className="text-sm text-gray-500 max-w-sm font-medium">
                    VeriLens AI engine is cross-referencing stitching vectors and review text entropy against verified master databases.
                  </p>
                </div>
              </div>
            ) : analysisResult ? (
              /* Results Available View */
              <div className="space-y-6 animate-fade-in">
                
                {/* Header Result Summary Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>{analysisResult.itemName}</h2>
                        <span className="text-sm font-bold text-[var(--green-primary)] px-2 py-0.5 bg-[var(--green-primary)]/10 rounded-full">{analysisResult.brand}</span>
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Scan Hash: <span className="font-mono text-gray-600">{analysisResult.verificationHash}</span> • {analysisResult.timestamp}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="self-start sm:self-auto px-4 py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-[var(--text-primary)] text-xs font-bold flex items-center gap-2 border border-gray-200 transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-[var(--green-primary)]" />
                      <span>View Certificate</span>
                    </button>
                  </div>

                  {/* Score Circular Ring & AI Confidence Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                    
                    {/* Trust Gauge Ring */}
                    <div className="sm:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* SVG Circular Progress Bar */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            className="stroke-gray-200 fill-none stroke-[8]"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            className={`fill-none stroke-[8] transition-all duration-1000 ${
                              analysisResult.trustScore >= 80
                                ? 'stroke-[#059669]'
                                : analysisResult.trustScore >= 50
                                ? 'stroke-amber-400'
                                : 'stroke-red-500'
                            }`}
                            strokeDasharray="264"
                            strokeDashoffset={264 - (264 * analysisResult.trustScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-1">
                          <span className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">{analysisResult.trustScore}%</span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Trust Score</span>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          analysisResult.trustScore >= 80
                            ? 'bg-[#059669]/10 text-[#059669] border-[#059669]/20'
                            : analysisResult.trustScore >= 50
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {analysisResult.verdict}
                        </span>
                      </div>
                    </div>

                    {/* AI Metric Breakdown Gauges */}
                    <div className="sm:col-span-7 space-y-4">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-gray-600 font-bold">AI Multimodal Confidence</span>
                        <span className="text-[var(--green-primary)] font-black font-mono text-[15px]">{analysisResult.aiConfidence}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[var(--green-accent-from)] to-[var(--green-accent-to)] h-full transition-all duration-1000"
                          style={{ width: `${analysisResult.aiConfidence}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1 hover:border-[var(--green-primary)]/30 transition-colors">
                          <span>Stitching Pitch</span>
                          <span className="font-black text-[var(--text-primary)] text-[15px] font-mono">{analysisResult.detailedScores.stitchingQuality}%</span>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1 hover:border-[var(--green-primary)]/30 transition-colors">
                          <span>Hardware Engraving</span>
                          <span className="font-black text-[var(--text-primary)] text-[15px] font-mono">{analysisResult.detailedScores.hardwareAuthenticity}%</span>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1 hover:border-[var(--green-primary)]/30 transition-colors">
                          <span>Care Tag Font</span>
                          <span className="font-black text-[var(--text-primary)] text-[15px] font-mono">{analysisResult.detailedScores.typographyAccuracy}%</span>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1 hover:border-purple-400/30 transition-colors">
                          <span>Review NLP Naturalness</span>
                          <span className="font-black text-[var(--text-primary)] text-[15px] font-mono">{analysisResult.detailedScores.reviewPerplexity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cross-Modal XAI Heatmap Visual Inspector */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-[var(--green-primary)]" />
                      <h3 className="text-lg font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>XAI Heatmap & Visual Bounding Boxes</h3>
                    </div>

                    {/* Mode Toggles */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-full text-xs font-bold self-start">
                      <button
                        onClick={() => setViewMode('heatmap')}
                        className={`px-4 py-1.5 rounded-full transition-all ${
                          viewMode === 'heatmap' ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Heatmap
                      </button>
                      <button
                        onClick={() => setViewMode('bounding_boxes')}
                        className={`px-4 py-1.5 rounded-full transition-all ${
                          viewMode === 'bounding_boxes' ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Boxes
                      </button>
                      <button
                        onClick={() => setViewMode('raw')}
                        className={`px-4 py-1.5 rounded-full transition-all ${
                          viewMode === 'raw' ? 'bg-white text-[var(--text-primary)] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Raw
                      </button>
                    </div>
                  </div>

                  {/* Interactive Image Canvas Display */}
                  <div className="relative w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 min-h-[360px] flex items-center justify-center p-4">
                    <img
                      src={analysisResult.imageUrl}
                      alt={analysisResult.itemName}
                      className="max-h-[400px] w-auto object-contain rounded-lg mix-blend-multiply"
                    />

                    {/* Heatmap Overlay Simulation */}
                    {viewMode === 'heatmap' && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--green-primary)]/15 via-purple-500/10 to-amber-500/15 mix-blend-multiply pointer-events-none" />
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
                              ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20'
                              : 'border-[#059669] bg-[#059669]/10 hover:bg-[#059669]/20'
                          } ${isSelected ? 'ring-4 ring-white z-20 scale-105 shadow-xl' : 'hover:scale-105 z-10 shadow-sm'}`}
                        >
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider -mt-4 -ml-2 whitespace-nowrap shadow-sm ${
                            point.severity === 'critical' || point.severity === 'high' ? 'bg-red-500 text-white' : 'bg-[#059669] text-white'
                          }`}>
                            {point.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hotspot Detailed Explanation Box */}
                  {selectedHotspot && (
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                        selectedHotspot.severity === 'critical' || selectedHotspot.severity === 'high' ? 'bg-red-500' : 'bg-[#059669]'
                      }`} />
                      <div className="flex items-center justify-between pl-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[var(--text-primary)] text-[15px]">{selectedHotspot.label}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-white text-gray-500 uppercase border border-gray-200">
                            {selectedHotspot.category}
                          </span>
                        </div>
                        <span className="text-[var(--green-primary)] font-black font-mono bg-[var(--green-primary)]/10 px-2 py-0.5 rounded text-sm">
                          {selectedHotspot.confidence}% Conf.
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium pl-2">{selectedHotspot.description}</p>
                    </div>
                  )}
                </div>

                {/* Fake Review NLP Forensics & Reasoning */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[var(--border-card)] shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    <FileText className="w-5 h-5 text-purple-500" />
                    NLP Review Forensics & XAI Reasoning
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fake review score */}
                    <div className="p-5 rounded-2xl bg-[#F6EEFF] border border-[#E9D5FF] space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-900 font-bold">Bot / Synthetic Review Prob.</span>
                        <span className={`font-mono font-black text-xl ${
                          analysisResult.fakeReviewProbability > 50 ? 'text-red-500' : 'text-purple-600'
                        }`}>
                          {analysisResult.fakeReviewProbability}%
                        </span>
                      </div>
                      <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-purple-100">
                        <div
                          className={`h-full rounded-full ${
                            analysisResult.fakeReviewProbability > 50 ? 'bg-red-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${analysisResult.fakeReviewProbability}%` }}
                        />
                      </div>

                      <div className="pt-3 space-y-2 border-t border-purple-200">
                        {analysisResult.reviewFlags.map((flag, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                              flag.severity === 'high' ? 'text-red-500' : 'text-amber-500'
                            }`} />
                            <div>
                              <span className="font-bold text-purple-900">{flag.type}: </span>
                              <span className="text-purple-800/80 font-medium">{flag.explanation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reasoning list */}
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Key XAI Inspection Notes</span>
                      <ul className="space-y-2.5 text-sm text-[var(--text-primary)] font-medium">
                        {analysisResult.xaiReasoning.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-primary)] shrink-0 mt-2" />
                            <span className="leading-relaxed">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Empty State: Ready for analysis */
              <div className="p-12 rounded-3xl bg-white border border-[var(--border-card)] flex flex-col items-center justify-center text-center space-y-4 min-h-[460px] shadow-sm">
                <div className="w-20 h-20 rounded-full bg-[var(--green-primary)]/10 flex items-center justify-center text-[var(--green-primary)]">
                  <VeriLensIcon className="w-10 h-10" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Ready for AI Verification</h3>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    Select a preset or upload your own fashion item to run real-time multimodal visual & NLP inspection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Printable / View Digital Certificate Modal */}
        {showCertificateModal && analysisResult && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl animate-fade-in">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Header */}
              <div className="text-center space-y-3 border-b border-gray-100 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-[var(--green-primary)]/10 border border-[var(--green-primary)]/20 flex items-center justify-center text-[var(--green-primary)] mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-[var(--text-primary)] font-serif italic">VeriStyle Authenticity Certificate</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Digital Fashion Provenance & Forensics Seal</p>
              </div>

              {/* Certificate Body */}
              <div className="space-y-3 text-[13px] font-medium">
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Item Name:</span>
                  <span className="font-bold text-[var(--text-primary)]">{analysisResult.itemName}</span>
                </div>
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Brand / Manufacturer:</span>
                  <span className="font-bold text-[var(--text-primary)]">{analysisResult.brand}</span>
                </div>
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Verification Verdict:</span>
                  <span className={`font-black font-mono uppercase ${
                    analysisResult.trustScore >= 80 ? 'text-[#059669]' : 'text-red-500'
                  }`}>
                    {analysisResult.verdict} ({analysisResult.trustScore}%)
                  </span>
                </div>
                <div className="flex justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-500">Blockchain Hash:</span>
                  <span className="font-mono text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">{analysisResult.verificationHash}</span>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="p-5 rounded-2xl bg-[var(--text-primary)] border border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-bold text-white">Scan QR for Online Verification</p>
                  <p className="text-xs text-gray-400 mt-0.5">Immutable record stored in VeriStyle Vault</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-inner">
                  <QrCode className="w-full h-full text-black" />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3.5 rounded-full bg-[var(--green-primary)] hover:bg-green-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
