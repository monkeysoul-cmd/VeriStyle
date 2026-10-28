import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2, ShieldCheck, X, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({ isOpen, onClose }) => {
  const [domain, setDomain] = useState('veristyle.io');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(true);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(key);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleTestDns = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden text-slate-900"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Globe className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Production Custom Domain Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Manage custom domain routing, DNS records, and SSL certificates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Domain Status Banner */}
          <div className="p-4 rounded-md bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex w-2.5 h-2.5">
                <span className="relative rounded-full w-2.5 h-2.5 bg-amber-600" />
              </span>
              <div>
                <div className="text-xs font-mono font-bold text-amber-900 flex items-center gap-1.5">
                  <span>{domain}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-sans font-semibold">Primary</span>
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  Status: Connected, DNS Validated, Automatic TLS 1.3 Active
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-white px-2.5 py-1 rounded border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              SSL Provisioned
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
              Custom Domain Name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => { setDomain(e.target.value); setVerified(false); }}
                  placeholder="veristyle.io"
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-slate-800 focus:bg-white"
                />
              </div>
              <button
                onClick={handleTestDns}
                disabled={isVerifying}
                className="px-4 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wide transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                {isVerifying ? 'Validating...' : 'Verify DNS'}
              </button>
            </div>
          </div>

          {/* DNS Configuration Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono">
                Required DNS Records
              </span>
              <span className="text-[11px] text-slate-500">
                TTL: Automatic (300s)
              </span>
            </div>

            <div className="rounded-md border border-slate-200 overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 font-mono font-bold text-slate-600 border-b border-slate-200 text-[11px]">
                <div className="col-span-2">Type</div>
                <div className="col-span-3">Name / Host</div>
                <div className="col-span-5">Value / Target</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {/* Record 1: A Record */}
              <div className="grid grid-cols-12 items-center px-3 py-2.5 border-b border-slate-100 font-mono">
                <div className="col-span-2 font-bold text-slate-800">A</div>
                <div className="col-span-3 text-slate-600">@</div>
                <div className="col-span-5 text-slate-800 flex items-center gap-1.5">
                  <span>76.76.21.21</span>
                  <button
                    onClick={() => handleCopy('a-rec', '76.76.21.21')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedRecord === 'a-rec' ? <Check className="w-3 h-3 text-amber-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="col-span-2 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                    <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    Valid
                  </span>
                </div>
              </div>

              {/* Record 2: CNAME Record */}
              <div className="grid grid-cols-12 items-center px-3 py-2.5 font-mono">
                <div className="col-span-2 font-bold text-slate-800">CNAME</div>
                <div className="col-span-3 text-slate-600">www</div>
                <div className="col-span-5 text-slate-800 flex items-center gap-1.5 truncate">
                  <span className="truncate">cname.vercel-dns.com</span>
                  <button
                    onClick={() => handleCopy('cname-rec', 'cname.vercel-dns.com')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedRecord === 'cname-rec' ? <Check className="w-3 h-3 text-amber-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="col-span-2 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                    <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    Valid
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SSL Information */}
          <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Automated SSL / TLS Certificate:</div>
            <p className="leading-relaxed">
              Let's Encrypt Wildcard certificate is automatically managed and renewed 30 days prior to expiration. HTTP requests are permanently redirected to HTTPS.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            Domain verified and operational
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Save & Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};
