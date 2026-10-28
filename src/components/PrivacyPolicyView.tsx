import React from 'react';
import { Shield, Lock, EyeOff, Server, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </button>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium mb-3 border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            Legal Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-500 font-mono">
            Effective Date: January 1, 2026 | Last Updated: October 16, 2026
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center mb-3">
              <EyeOff className="w-4 h-4 text-amber-700" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Zero Data Retention</h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Uploaded imagery and review text are processed ephemerally in RAM and purged immediately upon report generation.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
              <Server className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Local Browser Vault</h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Inspection records and cryptographic hashes are persisted strictly in your local device storage, never on centralized ad servers.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
              <Shield className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">256-bit TLS Encryption</h2>
            <p className="text-xs leading-relaxed text-slate-600">
              All communications between your client and our API gateway use TLS 1.3 encryption with strict transport security.
            </p>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">1. Scope and Architecture</h2>
            <p>
              VeriStyle Technologies Inc. ("VeriStyle", "we", "us", or "our") operates the veristyle.io web application, providing automated multi-signal authenticity inspection for consumer goods and fashion items. This Privacy Policy outlines our data handling protocols when you utilize our URL analyzer and forensic image inspection tools.
            </p>
            <p>
              We operate an ephemeral computational architecture. When you submit a product URL or upload a photograph for authenticity verification, our systems analyze the digital specimen in memory to detect manufacturing and textile markers. Neither the raw image pixels nor the parsed customer reviews are cataloged or sold.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">2. Information We Process</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>URL Parameters:</strong> When you provide a third-party marketplace link (e.g., Amazon, Flipkart, Myntra), we request publicly accessible HTML, images, and reviews to extract product attributes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Visual Inspection Data:</strong> High-resolution photos submitted for hardware, debossing, or seam pitch verification are converted into numerical matrix arrays for analysis and discarded immediately.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Technical Telemetry:</strong> Standard server access logs (IP address, browser user-agent, timestamp) are retained for 72 hours solely for rate-limiting and DDoS mitigation before automatic deletion.</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">3. Third-Party Marketplace Scraping</h2>
            <p>
              Our automated URL extraction service queries public e-commerce endpoints to retrieve listing titles, pricing data, and buyer review excerpts. We do not access, harvest, or request private account credentials, shopping cart details, or authenticated buyer profiles.
            </p>
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              {[
                { name: 'Amazon', key: 'amazon' },
                { name: 'Flipkart', key: 'flipkart' },
                { name: 'Myntra', key: 'myntra' },
                { name: 'AJIO', key: 'ajio' },
                { name: 'Nykaa', key: 'nykaa' },
                { name: 'Croma', key: 'croma' },
                { name: 'Meesho', key: 'meesho' },
                { name: 'Tata CLiQ', key: 'tatacliq' },
              ].map(p => (
                <span
                  key={p.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs text-xs font-semibold"
                >
                  <PlatformLogo platform={p.key} size={15} />
                  <span>{p.name}</span>
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">4. Cookies and Local Storage</h2>
            <p>
              VeriStyle does not deploy third-party advertising cookies, cross-site trackers, or marketing pixels. We utilize standard browser local storage (`localStorage`) solely to store your saved inspection reports in your local vault. You may clear this data at any time via your browser settings or using the "Clear Vault" action within the interface.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">5. User Rights Under GDPR and CCPA</h2>
            <p>
              Depending on your jurisdiction, you possess legal rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>The right to know what personal data is processed.</li>
              <li>The right to request the deletion of any identifiable technical logs.</li>
              <li>The right to non-discrimination for exercising privacy rights.</li>
            </ul>
            <p>
              Because we do not store customer profiles or link inspection reports to personal identities, we do not maintain identifiable databases of individual users.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">6. Data Security and Processing Nodes</h2>
            <p>
              Our infrastructure is hosted in secure, SOC 2 Type II certified cloud environments. All network ingress and egress points enforce modern cryptographic standards (TLS 1.3). Internal service communication occurs over private VPC networks without public internet exposure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">7. Contact the Data Protection Officer</h2>
            <p>
              If you have inquiries regarding this Privacy Policy or require verification of data handling protocols, contact our legal and privacy compliance team:
            </p>
            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800">
              VeriStyle Technologies Inc.<br />
              Attn: Data Privacy Officer<br />
              Email: privacy@veristyle.io<br />
              Domain: https://veristyle.io
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
