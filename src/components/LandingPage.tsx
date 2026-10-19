import React, { useState } from 'react';
import { UrlAnalyzer } from './UrlAnalyzer';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Shield, CheckCircle2, ChevronDown, HelpCircle,
  FileText, ScanLine, ArrowRight, Eye, Lock, Globe, Server, Check
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis?: () => void;
  onViewProducts?: () => void;
  onSaveToVault?: (result: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onViewProducts, onSaveToVault }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sampleUrl, setSampleUrl] = useState<string>('');

  const faqs = [
    {
      q: "How does the authenticity inspection engine operate?",
      a: "Our inspection pipeline combines optical computer vision heuristics with natural language text analysis. It analyzes seam stitch interval, typography debossing fidelity, and hardware finish against verified brand specifications, while evaluating customer review entropy to isolate synthetic or paid rating clusters."
    },
    {
      q: "Which e-commerce marketplaces and stores are supported?",
      a: "VeriStyle supports product listing URLs from Amazon India, Flipkart, Myntra Luxe, Nykaa Fashion, and AJIO. You can paste any live product link directly into the inspection bar for automated scraping and verification."
    },
    {
      q: "How does the review forensics engine identify manufactured reviews?",
      a: "The natural language processing module computes lexical diversity and entropy across buyer feedback. It detects repetitive phrasing templates, artificial sentiment-rating imbalances, and coordinated submission timing typically associated with seller review manipulation."
    },
    {
      q: "What luxury categories are supported?",
      a: "The image verification models support designer handbags and leather goods, limited-release sneakers and footwear, luxury streetwear, and premium timepieces with documented serial syntax."
    },
    {
      q: "What is your data retention and privacy standard?",
      a: "VeriStyle enforces a strict zero-retention architecture. Uploaded product photos and fetched reviews are processed in-memory (RAM) and purged immediately after report generation. Cryptographic hashes are stored locally in your browser's private vault."
    },
  ];

  const stores = [
    { name: 'Amazon', domain: 'amazon.in' },
    { name: 'Flipkart', domain: 'flipkart.com' },
    { name: 'Myntra', domain: 'myntra.com' },
    { name: 'AJIO', domain: 'ajio.com' },
    { name: 'Nykaa', domain: 'nykaa.com' },
    { name: 'Croma', domain: 'croma.com' },
    { name: 'Meesho', domain: 'meesho.com' },
    { name: 'Tata CLiQ', domain: 'tatacliq.com' },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-50 text-slate-900">

      {/* 1. HERO SECTION: Luminous Aurora Gradient with Vibrant Highlights */}
      <section className="relative w-full flex flex-col items-center justify-center px-4 pt-28 sm:pt-32 pb-16 aurora-hero border-b border-indigo-100/60 overflow-hidden">
        
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1680px] 2xl:max-w-[1780px] mx-auto text-center flex flex-col items-center">

          {/* Telemetry Status Capsule */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-mono font-medium shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Inspection Engine Active: <strong className="text-emerald-900">veristyle.io</strong></span>
            <span className="text-emerald-300">|</span>
            <span className="text-teal-700 font-sans font-semibold">Multi-Vector AI</span>
          </div>

          {/* Direct, Concrete Headline with Radiant Gradient Accent */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl leading-[1.12] mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Automated Authenticity & Counterfeit Inspection for{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Luxury Fashion
            </span>
          </h1>

          {/* Factual Sub-headline */}
          <p className="text-base sm:text-lg max-w-2xl mb-8 leading-relaxed text-slate-600 font-normal">
            Analyze e-commerce product listings and high-resolution imagery in real time. Inspect stitch tension, hardware debossing, serial matrices, and review text anomalies across Amazon, Flipkart, Myntra, and luxury resellers.
          </p>

          {/* URL Analyzer Cockpit */}
          <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto mb-6 text-left">
            <UrlAnalyzer standalone={false} initialUrl={sampleUrl} onAnalyzeComplete={onSaveToVault} />
          </div>

          {/* Reference Test Benchmarks with subtle color tint */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 mt-2">
            <span className="font-semibold text-indigo-900 font-mono">Reference URL Tests:</span>
            {[
              { label: 'amazon.in/nike-jordan', url: 'https://www.amazon.in/Nike-Air-Jordan-Retro-Sneakers/dp/B0CKW79YQ4' },
              { label: 'flipkart.com/gucci-bag', url: 'https://www.flipkart.com/gucci-leather-handbag-dionysus/p/itm2894721' },
              { label: 'myntra.com/yeezy', url: 'https://www.myntra.com/casual-shoes/adidas/yeezy-boost-350-v2-sneakers/19482910/buy' }
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSampleUrl(item.url)}
                className="px-3 py-1 rounded-md text-xs font-mono font-medium transition-all bg-white/90 border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50/70 text-indigo-900 hover:text-indigo-950 shadow-2xs hover:shadow-xs cursor-pointer"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Concrete Technical Standards with Colorful Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-700 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Optical Seam & Hardware Edge Detection
            </span>
            <span className="hidden sm:inline text-indigo-200">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-indigo-600" />
              NLP Buyer Review Perplexity Scoring
            </span>
            <span className="hidden sm:inline text-indigo-200">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-600" />
              Serial Checksum & Factory Matrix Matching
            </span>
            <span className="hidden sm:inline text-indigo-200">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-600" />
              Zero Data Retention Architecture
            </span>
          </div>

        </div>
      </section>

      {/* 2. SUPPORTED PLATFORMS: Vibrant Ticker */}
      <section className="w-full py-6 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-emerald-50/40 border-b border-indigo-100/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            Supported E-Commerce Platforms & Connectors
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="animate-marquee flex items-center gap-8 w-max opacity-90">
          {[...stores, ...stores].map((store, i) => (
            <div
              key={`${store.name}-${i}`}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 shadow-2xs hover:shadow-xs transition-all shrink-0"
            >
              <img
                src={`https://icon.horse/icon/${store.domain}`}
                alt={store.name}
                className="w-4 h-4 rounded-sm object-contain"
              />
              <span>{store.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR-PHASE INSPECTION METHODOLOGY: Distinct Color-Coded Phases */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 aurora-mesh">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="section-badge mx-auto">
              System Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Four-Phase Inspection Methodology
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Cross-referencing physical craftsmanship forensics with linguistic buyer consensus in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Listing Ingestion',
                desc: 'The user submits an e-commerce URL or uploads high-resolution photography of the item.',
                icon: Search,
                cardTheme: 'from-blue-50/60 to-white border-blue-200/80 hover:border-blue-400 card-glow-indigo',
                badgeTheme: 'text-blue-700 bg-blue-100/80',
                iconTheme: 'bg-blue-600 text-white shadow-xs',
              },
              {
                step: '02',
                title: 'Specimen Extraction',
                desc: 'Our scraper extracts product images, seller credentials, pricing tiers, and buyer review text.',
                icon: ScanLine,
                cardTheme: 'from-cyan-50/60 to-white border-cyan-200/80 hover:border-cyan-400 card-glow-sky',
                badgeTheme: 'text-cyan-700 bg-cyan-100/80',
                iconTheme: 'bg-cyan-600 text-white shadow-xs',
              },
              {
                step: '03',
                title: 'Multi-Vector Analysis',
                desc: 'Computer vision evaluates stitch pitch and debossing; NLP evaluates review entropy and bot patterns.',
                icon: FileText,
                cardTheme: 'from-purple-50/60 to-white border-purple-200/80 hover:border-purple-400 card-glow-purple',
                badgeTheme: 'text-purple-700 bg-purple-100/80',
                iconTheme: 'bg-purple-600 text-white shadow-xs',
              },
              {
                step: '04',
                title: 'Report Generation',
                desc: 'A structured forensic report is rendered with anomaly points and saved to your local vault.',
                icon: CheckCircle2,
                cardTheme: 'from-emerald-50/60 to-white border-emerald-200/80 hover:border-emerald-400 card-glow-emerald',
                badgeTheme: 'text-emerald-700 bg-emerald-100/80',
                iconTheme: 'bg-emerald-600 text-white shadow-xs',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-6 rounded-xl bg-gradient-to-b ${item.cardTheme} border transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${item.badgeTheme}`}>
                      PHASE {item.step}
                    </span>
                    <div className={`w-8 h-8 rounded-lg ${item.iconTheme} flex items-center justify-center`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. TECHNICAL ARCHITECTURE & INSPECTION VECTORS: Distinct Vector Identities */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="section-badge mx-auto">
              Engineering Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Dual-Engine Forensic Verification
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Combining visual micro-inspection of hardware and seams with natural language review entropy analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Vector 1: Natural Language Review Diagnostics (Indigo/Purple Theme) */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 border border-indigo-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/25">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="mono-label text-indigo-600 mb-2">Natural Language Processing</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  Synthetic Review & Seller Anomaly Screening
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Online counterfeit listings often rely on coordinated review manipulation to mask low-grade merchandise. Our NLP module analyzes lexical dispersion, syntax perplexity, and rating-sentiment coherence to detect manufactured reviews.
                </p>
                
                <div className="space-y-2.5 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200/60">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span><strong>Perplexity Entropy:</strong> Measures vocabulary variation against human baseline standards.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200/60">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span><strong>Template Repetition:</strong> Detects identical copy-paste strings across disparate seller accounts.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200/60">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span><strong>Sentiment Discordance:</strong> Flags 5-star ratings coupled with contradictory complaint text.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vector 2: Computer Vision Craftsmanship Inspection (Emerald/Teal Theme) */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 border border-emerald-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/25">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div className="mono-label text-emerald-600 mb-2">Computer Vision Engine</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  Sub-Pixel Seam Pitch & Hardware Forensics
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Authentic luxury manufacture adheres to rigorous tolerances in stitch pitch, hardware debossing, and textile grain. High-resolution specimen imagery is inspected across critical craftsmanship markers.
                </p>
                
                <div className="space-y-2.5 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Thread Gauge & Pitch:</strong> Evaluates stitches per inch against master factory benchmarks.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Engraving & Deboss Depth:</strong> Inspects font serifs, stroke width, and stamp sharpness.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Serial Syntax Validation:</strong> Cross-checks date code formats against brand production eras.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <div className="section-badge mx-auto">
              Documentation
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Technical details regarding authenticity scoring, privacy, and verification scope.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-lg border transition-all duration-200 overflow-hidden ${openFaq === i ? 'border-indigo-300 bg-indigo-50/20 shadow-2xs' : 'border-slate-200 bg-slate-50/50'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center transition-colors hover:bg-slate-100/70 cursor-pointer"
                >
                  <span className={`font-bold text-sm pr-4 transition-colors ${openFaq === i ? 'text-indigo-950' : 'text-slate-900'}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-indigo-600' : 'text-slate-500'}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-indigo-100 bg-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION: Radiant Ambient Dark Mode */}
      <section className="relative w-full py-16 px-4 text-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden border-t border-indigo-900/40">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-xs font-mono text-emerald-300 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Zero Data Stored: Ephemeral Processing
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Start Verifying Marketplace Listings
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Paste any supported product link into the analyzer bar or upload inspection photography to generate an immediate multi-signal report.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold tracking-wide btn-neon cursor-pointer"
            >
              <span>Open Inspector Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onViewProducts}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold tracking-wide btn-gradient-indigo cursor-pointer"
            >
              <Eye className="w-4 h-4 text-white" />
              <span>Browse Benchmark Catalog</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
