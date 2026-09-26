import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ShieldCheck, Zap, Sparkles, Send } from 'lucide-react';
import { NewsletterSubscription } from '../types';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<string[]>([
    'webhook-architecture',
    'api-benchmarks',
    'security-advisories',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const togglePref = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const sub: NewsletterSubscription = {
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
        preferences,
      };
      try {
        const stored = localStorage.getItem('stackpipeline_subscribers') || '[]';
        const list = JSON.parse(stored);
        list.push(sub);
        localStorage.setItem('stackpipeline_subscribers', JSON.stringify(list));
      } catch {
        // ignore
      }
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Welcome to The Pipeline Dispatch!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              You're all set. Next Tuesday's briefing on high-throughput webhook engineering and zero-latency ETL will land in your inbox.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">The Pipeline Dispatch</h3>
                <p className="text-xs text-slate-400">
                  Weekly technical briefing for SaaS platform engineers and automation architects
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Every Tuesday, 4,200+ engineers receive our curated teardowns of B2B API breaking changes, rate-limit audits, and battle-tested webhook retry architectures. Zero marketing fluff.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-2">
                  Select Your Technical Interests
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={preferences.includes('webhook-architecture')}
                      onChange={() => togglePref('webhook-architecture')}
                      className="accent-emerald-500 rounded"
                    />
                    <span>High-throughput Webhook & Queue Architectures (Redis, Kafka, BullMQ)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={preferences.includes('api-benchmarks')}
                      onChange={() => togglePref('api-benchmarks')}
                      className="accent-emerald-500 rounded"
                    />
                    <span>B2B SaaS API Rate-Limit Audits & Cost/TCO Benchmarks</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={preferences.includes('security-advisories')}
                      onChange={() => togglePref('security-advisories')}
                      className="accent-emerald-500 rounded"
                    />
                    <span>HMAC-SHA256 Signature Security Advisories & Deprecation Notices</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Subscribing...' : 'Subscribe Free to Dispatch'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>No spam. 1-click unsubscribe anytime. Read by engineers at Series B to Enterprise.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
