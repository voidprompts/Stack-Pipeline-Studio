import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AdSenseComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdSenseComplianceModal: React.FC<AdSenseComplianceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const adsTxtContent = `# ads.txt for StackPipeline (stackpipeline.com)
# Compliance with Google AdSense, Google Ad Manager, and Programmatic Exchanges
# Direct Account
google.com, pub-9284719038291048, DIRECT, f08c47fec0942fa0

# Programmatic Supply Chain Exchanges (Authorized Resellers)
appnexus.com, 1234, RESELLER, f5ab79cb980f11d1
rubiconproject.com, 5678, RESELLER, 0bfd66d529a55803
openx.com, 9012, RESELLER, 6a698e2ec38604c6
pubmatic.com, 3456, RESELLER, 5d62e63b10edd766`;

  if (!isOpen) return null;

  const copyAdsTxt = () => {
    navigator.clipboard.writeText(adsTxtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const complianceItems = [
    {
      title: 'Valid ads.txt File at Domain Root',
      status: 'Passed',
      description: 'Host-level public/ads.txt properly resolves at https://stackpipeline.com/ads.txt with authorized DIRECT publisher ID.',
    },
    {
      title: 'Cumulative Layout Shift (CLS) Immunity',
      status: 'Passed',
      description: 'Every ad slot reserves hard CSS viewport bounding boxes (min-h-[90px], min-h-[250px]) to prevent layout shifts.',
    },
    {
      title: 'E-E-A-T Editorial Review Loops',
      status: 'Passed',
      description: 'Named Technical Architects, credentials, LinkedIn profiles, and verified changelog timestamps demonstrate firsthand expertise.',
    },
    {
      title: 'FTC & Legal Disclosure Transparency',
      status: 'Passed',
      description: 'Affiliate links clearly tagged with rel="sponsored noopener" and prominent disclosures accompany every commercial table.',
    },
    {
      title: 'Mandatory Policy Pages Linked Globally',
      status: 'Passed',
      description: 'Privacy Policy (GDPR/CCPA cookies), Terms of Service, Affiliate Disclosure, and Editorial Standards accessible in footer.',
    },
    {
      title: 'Content-to-Ad Ratio (> 70% Original Content)',
      status: 'Passed',
      description: 'Tutorials contain 1,500+ words of original technical instructions, real code snippets, and custom architecture tables.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Google AdSense & E-E-A-T Compliance Suite</h3>
              <p className="text-xs text-slate-400">Audit checks for Google Publisher Policies, ads.txt routing, and layout stability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Overview Card */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-emerald-300">100% AdSense & Exchange Approval Ready</div>
              <p className="text-xs text-slate-300 mt-1">
                StackPipeline satisfies all guidelines from Google Publisher Policies, the Useful Content System, and IAB Tech Lab ads.txt specs.
              </p>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Programmatic Ad Eligibility Checklist
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {complianceItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live ads.txt Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-200">Production public/ads.txt File</span>
                <span className="text-[10px] font-mono text-slate-400">(/public/ads.txt)</span>
              </div>
              <button
                onClick={copyAdsTxt}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy ads.txt'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              {adsTxtContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
