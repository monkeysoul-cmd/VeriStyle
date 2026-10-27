import React, { useState } from 'react';
import { UrlAnalyzer } from './UrlAnalyzer';
import { PlatformLogo } from './PlatformLogo';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Shield, ShieldCheck, CheckCircle2, ChevronDown, HelpCircle,
  FileText, ScanLine, ArrowRight, Lock, Globe, Server, Check,
  Sparkles, Diamond, Crown, Fingerprint, Layers
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis?: () => void;
  onSaveToVault?: (result: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onSaveToVault }) => {
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
    <div className="w-full flex flex-col min-h-screen aurora-mesh" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* 1. HERO SECTION: Luxury Editorial Aurora */}
      <section className="relative w-full flex flex-col items-center justify-center pt-24 sm:pt-28 pb-12 overflow-hidden">
        
        {/* Soft, radiant light ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(5, 150, 105, 0.08) 0%, transparent 65%)' }} />
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 60%)' }} />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, transparent 60%)' }} />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

          {/* Minimal Telemetry Capsule */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 bg-emerald-50/80 border border-emerald-200/80 shadow-2xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-emerald-900 uppercase font-mono">
              AI Luxury Verification
            </span>
          </motion.div>

          {/* Catchy, Minimal Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight max-w-4xl leading-[1.08] mb-3 text-slate-900 text-balance"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Know it’s real.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent font-black inline-block">
              Instantly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto mb-7 font-medium leading-relaxed"
          >
            Paste any product link to inspect counterfeits, hallmarks, and fake reviews in seconds.
          </motion.p>

          {/* URL Analyzer Cockpit */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="w-full mx-auto mb-5 text-left"
          >
            <UrlAnalyzer standalone={false} initialUrl={sampleUrl} onAnalyzeComplete={onSaveToVault} />
          </motion.div>

          {/* Reference Test Benchmarks */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mt-2 text-slate-500">
            <span className="font-bold font-mono text-emerald-800">Quick Test URLs:</span>
            {[
              { label: 'amazon.in/nike-jordan', platform: 'amazon', url: 'https://www.amazon.in/Nike-Air-Jordan-Retro-Sneakers/dp/B0CKW79YQ4' },
              { label: 'flipkart.com/gucci-bag', platform: 'flipkart', url: 'https://www.flipkart.com/gucci-leather-handbag-dionysus/p/itm2894721' },
              { label: 'myntra.com/yeezy', platform: 'myntra', url: 'https://www.myntra.com/casual-shoes/adidas/yeezy-boost-350-v2-sneakers/19482910/buy' },
              { label: 'ajio.com/armani-watch', platform: 'ajio', url: 'https://www.ajio.com/emporio-armani-analog-watch/p/460789234' },
              { label: 'nykaa.com/dior-perfume', platform: 'nykaa', url: 'https://www.nykaa.com/dior-sauvage-eau-de-parfum/p/354789' }
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSampleUrl(item.url)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer bg-white border border-slate-200 text-slate-700 hover:text-emerald-900 hover:border-emerald-300 shadow-xs"
              >
                <PlatformLogo platform={item.platform} size={15} />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Technical Standards Micro-Badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700">
                <Check className="w-2.5 h-2.5" />
              </span>
              Optical Edge Forensics
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700">
                <Check className="w-2.5 h-2.5" />
              </span>
              NLP Review Entropy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full flex items-center justify-center bg-teal-100 text-teal-700">
                <Check className="w-2.5 h-2.5" />
              </span>
              Serial & Hallmark Check
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full flex items-center justify-center bg-slate-100 text-slate-700">
                <Lock className="w-2.5 h-2.5" />
              </span>
              Zero Data Retention
            </span>
          </div>

        </div>
      </section>

      {/* 2. SUPPORTED PLATFORMS: Universal Connector Ticker */}
      <section
        className="w-full py-6 overflow-hidden bg-white border-y border-slate-200/80 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">
            Supported E-Commerce Platforms & Connectors
          </span>
          <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
        </div>
        <div className="animate-marquee flex items-center gap-8 w-max opacity-90">
          {[...stores, ...stores].map((store, i) => (
            <div
              key={`${store.name}-${i}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all bg-white border border-slate-200/90 text-slate-800 hover:text-slate-950 hover:border-emerald-300 hover:shadow-xs shadow-2xs"
            >
              <PlatformLogo platform={store.name} size={18} />
              <span>{store.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR-PHASE INSPECTION METHODOLOGY */}
      <section
        className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50/60"
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="section-badge mx-auto">
              <Layers className="w-3 h-3" />
              System Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Four-Phase Inspection Methodology
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
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
                accentColor: '#4F46E5',
                accentBg: '#EEF2FF',
                accentBorder: '#C7D2FE',
                glowClass: 'card-glow-indigo',
              },
              {
                step: '02',
                title: 'Specimen Extraction',
                desc: 'Our scraper extracts product images, seller credentials, pricing tiers, and buyer review text.',
                icon: ScanLine,
                accentColor: '#0284C7',
                accentBg: '#F0F9FF',
                accentBorder: '#BAE6FD',
                glowClass: 'card-glow-sky',
              },
              {
                step: '03',
                title: 'Multi-Vector Analysis',
                desc: 'Computer vision evaluates stitch pitch and debossing; NLP evaluates review entropy and bot patterns.',
                icon: FileText,
                accentColor: '#7C3AED',
                accentBg: '#F5F3FF',
                accentBorder: '#DDD6FE',
                glowClass: 'card-glow-purple',
              },
              {
                step: '04',
                title: 'Report Generation',
                desc: 'A structured forensic report is rendered with anomaly points and saved to your local vault.',
                icon: CheckCircle2,
                accentColor: '#059669',
                accentBg: '#ECFDF5',
                accentBorder: '#A7F3D0',
                glowClass: 'card-glow-emerald',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 bg-white border border-slate-200/90 shadow-sm ${item.glowClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-md"
                      style={{
                        background: item.accentBg,
                        color: item.accentColor,
                        border: `1px solid ${item.accentBorder}`,
                      }}
                    >
                      PHASE {item.step}
                    </span>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: item.accentBg,
                        border: `1px solid ${item.accentBorder}`,
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: item.accentColor }} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold mb-2 text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. TECHNICAL ARCHITECTURE & INSPECTION VECTORS */}
      <section
        className="w-full py-24 px-4 sm:px-6 lg:px-8 relative bg-white border-t border-slate-200/80"
      >
        <div className="max-w-6xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="section-badge mx-auto">
              <Fingerprint className="w-3 h-3" />
              Engineering Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Dual-Engine Forensic Verification
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Combining visual micro-inspection of hardware and seams with natural language review entropy analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Vector 1: NLP */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-8 rounded-2xl transition-all flex flex-col justify-between bg-white border border-indigo-100 shadow-sm"
              style={{
                boxShadow: '0 8px 30px -4px rgba(79, 70, 229, 0.06)',
              }}
            >
              <div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-indigo-50 border border-indigo-200"
                >
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="mono-label mb-2 text-indigo-600">Natural Language Processing</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  Synthetic Review & Seller Anomaly Screening
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-6 text-slate-600">
                  Online counterfeit listings often rely on coordinated review manipulation to mask low-grade merchandise. Our NLP module analyzes lexical dispersion, syntax perplexity, and rating-sentiment coherence to detect manufactured reviews.
                </p>
                
                <div className="space-y-2.5 text-xs font-medium text-slate-700">
                  {[
                    { title: 'Perplexity Entropy:', desc: 'Measures vocabulary variation against human baseline standards.' },
                    { title: 'Template Repetition:', desc: 'Detects identical copy-paste strings across disparate seller accounts.' },
                    { title: 'Sentiment Discordance:', desc: 'Flags 5-star ratings coupled with contradictory complaint text.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-600" />
                      <span><strong className="text-indigo-900">{item.title}</strong> {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vector 2: Computer Vision */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-8 rounded-2xl transition-all flex flex-col justify-between bg-white border border-emerald-100 shadow-sm"
              style={{
                boxShadow: '0 8px 30px -4px rgba(5, 150, 105, 0.06)',
              }}
            >
              <div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-emerald-50 border border-emerald-200"
                >
                  <ScanLine className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="mono-label mb-2 text-emerald-600">Computer Vision Engine</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  Sub-Pixel Seam Pitch & Hardware Forensics
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-6 text-slate-600">
                  Authentic luxury manufacture adheres to rigorous tolerances in stitch pitch, hardware debossing, and textile grain. High-resolution specimen imagery is inspected across critical craftsmanship markers.
                </p>
                
                <div className="space-y-2.5 text-xs font-medium text-slate-700">
                  {[
                    { title: 'Thread Gauge & Pitch:', desc: 'Evaluates stitches per inch against master factory benchmarks.' },
                    { title: 'Engraving & Deboss Depth:', desc: 'Inspects font serifs, stroke width, and stamp sharpness.' },
                    { title: 'Serial Syntax Validation:', desc: 'Cross-checks date code formats against brand production eras.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span><strong className="text-emerald-900">{item.title}</strong> {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section
        className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-200/80"
      >
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="section-badge mx-auto">
              <HelpCircle className="w-3 h-3" />
              Documentation
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
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
                className="rounded-xl overflow-hidden transition-all duration-300 bg-white border border-slate-200 shadow-xs"
                style={{
                  borderColor: openFaq === i ? 'rgba(5, 150, 105, 0.4)' : undefined,
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center transition-colors cursor-pointer bg-white"
                >
                  <span
                    className="font-bold text-sm pr-4 transition-colors"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: openFaq === i ? '#047857' : '#0F172A',
                    }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`}
                  />
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
                      <div
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-emerald-100"
                      >
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

      {/* 6. CALL TO ACTION SECTION: Universal Verified Palette */}
      <section className="relative w-full py-20 px-4 text-center overflow-hidden bg-white border-t border-slate-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(5, 150, 105, 0.08) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto space-y-7">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-50 border border-emerald-200 text-emerald-800"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero Data Stored: Ephemeral Processing
          </div>
          
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Start Verifying{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Marketplace Listings
            </span>
          </h2>
          
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-slate-600">
            Paste any supported product link into the analyzer bar or upload inspection photography to generate an immediate multi-signal report.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wide cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-md shadow-emerald-600/25 transition-all active:scale-98"
            >
              <span>Open Inspector Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
