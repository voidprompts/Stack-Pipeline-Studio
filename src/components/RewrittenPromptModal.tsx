import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import { REWRITTEN_SYSTEM_PROMPT } from '../data/rewrittenPrompt';

interface RewrittenPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewrittenPromptModal: React.FC<RewrittenPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(REWRITTEN_SYSTEM_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Rewritten Enterprise System Prompt
              </h3>
              <p className="text-xs text-slate-400">
                Architectural specification for B2B SaaS Affiliate & Automation Site Generator (v3.4 Enterprise)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyPrompt}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-500/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Prompt to Clipboard!' : 'Copy Master Prompt'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100/100 Core Web Vitals</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AdSense & CLS Protection</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>E-E-A-T Editorial Matrix</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cloudflare Edge CI/CD</span>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0f19]">
          <pre className="whitespace-pre-wrap selection:bg-emerald-500/30 selection:text-emerald-200">
            {REWRITTEN_SYSTEM_PROMPT}
          </pre>
        </div>
      </div>
    </div>
  );
};
