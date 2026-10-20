import React, { useState } from 'react';
import { UrlAnalyzer } from './UrlAnalyzer';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Shield, CheckCircle2, ChevronDown, HelpCircle,
  FileText, ScanLine, ArrowRight, Eye, Lock, Globe, Server, Check,
  Sparkles, Diamond, Crown, Fingerprint, Layers
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
    <div className="w-full flex flex-col min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* 1. HERO SECTION: Premium Dark Aurora */}
      <section className="relative w-full flex flex-col items-center justify-center px-4 pt-28 sm:pt-36 pb-20 overflow-hidden">
        
        {/* Rich ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(212, 168, 83, 0.06) 0%, transparent 70%)' }} />
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(129, 140, 248, 0.04) 0%, transparent 60%)' }} />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 60%)' }} />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 dot-grid-bg opacity-30 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1680px] 2xl:max-w-[1780px] mx-auto text-center flex flex-col items-center">

          {/* Telemetry Status Capsule */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7"
            style={{
              background: 'rgba(212, 168, 83, 0.06)',
              border: '1px solid rgba(212, 168, 83, 0.18)',
              boxShadow: '0 0 24px rgba(212, 168, 83, 0.06)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#D4A853' }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#D4A853' }}></span>
            </span>
            <span className="text-xs font-mono font-medium" style={{ color: '#D4A853' }}>
              Inspection Engine Active: <strong className="font-extrabold">veristyle.io</strong>
            </span>
            <span style={{ color: 'rgba(212, 168, 83, 0.3)' }}>|</span>
            <span className="text-xs font-semibold" style={{ color: '#34D88A' }}>Multi-Vector AI</span>
          </motion.div>

          {/* Premium Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.08] mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}
          >
            Automated Authenticity & Counterfeit Inspection for{' '}
            <span className="gold-shimmer-text">
              Luxury Fashion
            </span>
          </motion.h1>

          {/* Factual Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-sm sm:text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-normal"
            style={{ color: '#6B7394' }}
          >
            Analyze e-commerce product listings and high-resolution imagery in real time. Inspect stitch tension, hardware debossing, serial matrices, and review text anomalies across Amazon, Flipkart, Myntra, and luxury resellers.
          </motion.p>

          {/* URL Analyzer Cockpit */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto mb-6 text-left"
          >
            <UrlAnalyzer standalone={false} initialUrl={sampleUrl} onAnalyzeComplete={onSaveToVault} />
          </motion.div>

          {/* Reference Test Benchmarks */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mt-3" style={{ color: 'var(--text-dim)' }}>
            <span className="font-semibold font-mono" style={{ color: '#D4A853' }}>Reference URL Tests:</span>
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
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#B8C0D0',
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Concrete Technical Standards */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium" style={{ color: '#6B7394' }}>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.10)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Check className="w-3 h-3" style={{ color: '#10B981' }} />
              </span>
              Optical Seam & Hardware Edge Detection
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(129, 140, 248, 0.10)', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                <Check className="w-3 h-3" style={{ color: '#818CF8' }} />
              </span>
              NLP Buyer Review Perplexity Scoring
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(212, 168, 83, 0.10)', border: '1px solid rgba(212, 168, 83, 0.2)' }}>
                <Check className="w-3 h-3" style={{ color: '#D4A853' }} />
              </span>
              Serial Checksum & Factory Matrix Matching
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(244, 63, 94, 0.10)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <Lock className="w-3 h-3" style={{ color: '#FB7185' }} />
              </span>
              Zero Data Retention Architecture
            </span>
          </div>

        </div>
      </section>

      {/* 2. SUPPORTED PLATFORMS: Premium Dark Ticker */}
      <section
        className="w-full py-6 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(12, 12, 22, 0.5) 0%, rgba(8, 8, 15, 0.8) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: '#6B7394' }}>
            Supported E-Commerce Platforms & Connectors
          </span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#D4A853' }} />
        </div>
        <div className="animate-marquee flex items-center gap-8 w-max opacity-90">
          {[...stores, ...stores].map((store, i) => (
            <div
              key={`${store.name}-${i}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#B8C0D0',
              }}
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

      {/* 3. FOUR-PHASE INSPECTION METHODOLOGY */}
      <section
        className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, var(--bg-base) 0%, #0C0C16 100%)',
        }}
      >
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(212, 168, 83, 0.03) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="section-badge mx-auto">
              <Layers className="w-3 h-3" />
              System Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}>
              Four-Phase Inspection Methodology
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#6B7394' }}>
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
                accentColor: '#818CF8',
                accentBg: 'rgba(129, 140, 248, 0.08)',
                accentBorder: 'rgba(129, 140, 248, 0.15)',
                glowClass: 'card-glow-indigo',
              },
              {
                step: '02',
                title: 'Specimen Extraction',
                desc: 'Our scraper extracts product images, seller credentials, pricing tiers, and buyer review text.',
                icon: ScanLine,
                accentColor: '#38BDF8',
                accentBg: 'rgba(56, 189, 248, 0.08)',
                accentBorder: 'rgba(56, 189, 248, 0.15)',
                glowClass: 'card-glow-sky',
              },
              {
                step: '03',
                title: 'Multi-Vector Analysis',
                desc: 'Computer vision evaluates stitch pitch and debossing; NLP evaluates review entropy and bot patterns.',
                icon: FileText,
                accentColor: '#A855F7',
                accentBg: 'rgba(168, 85, 247, 0.08)',
                accentBorder: 'rgba(168, 85, 247, 0.15)',
                glowClass: 'card-glow-purple',
              },
              {
                step: '04',
                title: 'Report Generation',
                desc: 'A structured forensic report is rendered with anomaly points and saved to your local vault.',
                icon: CheckCircle2,
                accentColor: '#D4A853',
                accentBg: 'rgba(212, 168, 83, 0.08)',
                accentBorder: 'rgba(212, 168, 83, 0.15)',
                glowClass: 'card-glow-gold',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`p-6 rounded-xl flex flex-col justify-between transition-all duration-300 ${item.glowClass}`}
                style={{
                  background: `linear-gradient(180deg, ${item.accentBg} 0%, rgba(14, 14, 26, 0.6) 100%)`,
                  border: `1px solid ${item.accentBorder}`,
                  boxShadow: `0 4px 24px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)`,
                }}
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
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${item.accentColor}30, ${item.accentColor}10)`,
                        border: `1px solid ${item.accentBorder}`,
                        boxShadow: `0 0 12px ${item.accentColor}15`,
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: item.accentColor }} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7394' }}>
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
        className="w-full py-24 px-4 sm:px-6 lg:px-8 relative"
        style={{
          background: 'linear-gradient(180deg, #0C0C16 0%, var(--bg-base) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div className="max-w-6xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="section-badge mx-auto">
              <Fingerprint className="w-3 h-3" />
              Engineering Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}>
              Dual-Engine Forensic Verification
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#6B7394' }}>
              Combining visual micro-inspection of hardware and seams with natural language review entropy analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Vector 1: NLP */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-8 rounded-xl transition-all flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(129, 140, 248, 0.06) 0%, rgba(14, 14, 26, 0.5) 100%)',
                border: '1px solid rgba(129, 140, 248, 0.15)',
                boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.15), rgba(99, 102, 241, 0.08))',
                    border: '1px solid rgba(129, 140, 248, 0.25)',
                    boxShadow: '0 0 16px rgba(129, 140, 248, 0.10)',
                  }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#A5B4FC' }} />
                </div>
                <div className="mono-label mb-2" style={{ color: '#818CF8' }}>Natural Language Processing</div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}>
                  Synthetic Review & Seller Anomaly Screening
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: '#6B7394' }}>
                  Online counterfeit listings often rely on coordinated review manipulation to mask low-grade merchandise. Our NLP module analyzes lexical dispersion, syntax perplexity, and rating-sentiment coherence to detect manufactured reviews.
                </p>
                
                <div className="space-y-2.5 text-xs font-medium" style={{ color: '#B8C0D0' }}>
                  {[
                    { title: 'Perplexity Entropy:', desc: 'Measures vocabulary variation against human baseline standards.' },
                    { title: 'Template Repetition:', desc: 'Detects identical copy-paste strings across disparate seller accounts.' },
                    { title: 'Sentiment Discordance:', desc: 'Flags 5-star ratings coupled with contradictory complaint text.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg" style={{ background: 'rgba(129, 140, 248, 0.05)', border: '1px solid rgba(129, 140, 248, 0.10)' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#818CF8' }} />
                      <span><strong style={{ color: '#A5B4FC' }}>{item.title}</strong> {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vector 2: Computer Vision */}
            <motion.div
              whileHover={{ y: -3 }}
              className="p-8 rounded-xl transition-all flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.06) 0%, rgba(14, 14, 26, 0.5) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.08))',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.10)',
                  }}
                >
                  <ScanLine className="w-5 h-5" style={{ color: '#34D88A' }} />
                </div>
                <div className="mono-label mb-2" style={{ color: '#10B981' }}>Computer Vision Engine</div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}>
                  Sub-Pixel Seam Pitch & Hardware Forensics
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: '#6B7394' }}>
                  Authentic luxury manufacture adheres to rigorous tolerances in stitch pitch, hardware debossing, and textile grain. High-resolution specimen imagery is inspected across critical craftsmanship markers.
                </p>
                
                <div className="space-y-2.5 text-xs font-medium" style={{ color: '#B8C0D0' }}>
                  {[
                    { title: 'Thread Gauge & Pitch:', desc: 'Evaluates stitches per inch against master factory benchmarks.' },
                    { title: 'Engraving & Deboss Depth:', desc: 'Inspects font serifs, stroke width, and stamp sharpness.' },
                    { title: 'Serial Syntax Validation:', desc: 'Cross-checks date code formats against brand production eras.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.10)' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#10B981' }} />
                      <span><strong style={{ color: '#34D88A' }}>{item.title}</strong> {item.desc}</span>
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
        className="w-full py-24 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'var(--bg-base)',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="section-badge mx-auto">
              <HelpCircle className="w-3 h-3" />
              Documentation
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm" style={{ color: '#6B7394' }}>
              Technical details regarding authenticity scoring, privacy, and verification scope.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  border: openFaq === i
                    ? '1px solid rgba(212, 168, 83, 0.20)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  background: openFaq === i
                    ? 'rgba(212, 168, 83, 0.04)'
                    : 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center transition-colors cursor-pointer"
                  style={{ background: 'transparent' }}
                >
                  <span
                    className="font-bold text-sm pr-4 transition-colors"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: openFaq === i ? '#D4A853' : '#F0EDE6',
                    }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    style={{ color: openFaq === i ? '#D4A853' : '#6B7394' }}
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
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed"
                        style={{
                          color: '#6B7394',
                          borderTop: '1px solid rgba(212, 168, 83, 0.10)',
                        }}
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

      {/* 6. CALL TO ACTION SECTION: Premium Gold Dark */}
      <section className="relative w-full py-20 px-4 text-center overflow-hidden" style={{ borderTop: '1px solid rgba(212, 168, 83, 0.08)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0C0C16 0%, #0A0A14 40%, #08080F 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(212, 168, 83, 0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto space-y-7">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono"
            style={{
              background: 'rgba(212, 168, 83, 0.06)',
              border: '1px solid rgba(212, 168, 83, 0.18)',
              color: '#D4A853',
            }}
          >
            <Crown className="w-3.5 h-3.5" style={{ color: '#D4A853' }} />
            Zero Data Stored: Ephemeral Processing
          </div>
          
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: '#F0EDE6' }}
          >
            Start Verifying Marketplace Listings
          </h2>
          
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: '#6B7394' }}>
            Paste any supported product link into the analyzer bar or upload inspection photography to generate an immediate multi-signal report.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-wide btn-neon cursor-pointer"
            >
              <span>Open Inspector Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onViewProducts}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-wide btn-gradient-indigo cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Browse Benchmark Catalog</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
