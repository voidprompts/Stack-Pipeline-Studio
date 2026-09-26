import React, { useState } from 'react';
import { X, ShieldAlert, FileText, Scale, Award } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'affiliate' | 'editorial';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [tab, setTab] = useState<'privacy' | 'terms' | 'affiliate' | 'editorial'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Legal & Governance Policies</h3>
            <p className="text-xs text-slate-400">StackPipeline (stackpipeline.com) Publisher Compliance</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2 pt-2">
          <button
            onClick={() => setTab('affiliate')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'affiliate'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            FTC Affiliate Disclosure
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'privacy'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Privacy & Cookie Policy
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'terms'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            Terms of Service
          </button>
          <button
            onClick={() => setTab('editorial')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'editorial'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            E-E-A-T Editorial Standards
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-300 space-y-4 leading-relaxed">
          {tab === 'affiliate' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-100">FTC 16 CFR § 255 Affiliate Disclosure Statement</h4>
              <p className="text-xs text-slate-400">Last updated: September 2026</p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <p>
                  StackPipeline (<strong>stackpipeline.com</strong>) participates in various B2B SaaS affiliate marketing programs. 
                  This means that when you click on outbound links to software platforms (including but not limited to Zapier, HubSpot, Make.com, Clay, Apollo, Snowflake, and Salesforce) and complete a purchase or initiate a paid subscription, StackPipeline may earn an affiliate commission.
                </p>
              </div>
              <h5 className="font-semibold text-slate-200 mt-4">Editorial Integrity & Independence</h5>
              <p>
                Affiliate partnerships do <strong>never</strong> influence our editorial evaluations, performance latency benchmarks, or negative architectural assessments. Our staff engineers and reviewers test workflows rigorously before publishing tutorials. All affiliate hyperlinks in our codebase and templates include explicit <code className="text-emerald-400 font-mono">rel="sponsored noopener"</code> attributes conforming to Google Webmaster Guidelines.
              </p>
              <p>
                All pricing quotes, feature specifications, and API limits mentioned are accurate at the date of publication but remain subject to change by respective SaaS vendors.
              </p>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-100">Privacy Policy (GDPR, CCPA & Google AdSense Compliance)</h4>
              <p className="text-xs text-slate-400">Effective Date: September 2026</p>
              <p>
                At StackPipeline (reachable at <strong>https://stackpipeline.com</strong>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information collected and recorded by StackPipeline and how we use it.
              </p>
              <h5 className="font-semibold text-slate-200">Google DoubleClick DART Cookie & AdSense</h5>
              <p>
                Google is one of our third-party vendors. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to stackpipeline.com and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at <span className="text-emerald-400 font-mono">https://policies.google.com/technologies/ads</span>.
              </p>
              <h5 className="font-semibold text-slate-200">Log Files & Edge Caching</h5>
              <p>
                StackPipeline follows standard log file protocols via Cloudflare Pages. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to personally identifiable information.
              </p>
              <h5 className="font-semibold text-slate-200">Publisher Identity & Inquiries</h5>
              <p>
                If you have questions regarding this Privacy Policy, your rights under GDPR/CCPA, or commercial advertising opportunities, contact our team directly at <a href="mailto:voidprompts26@gmail.com" className="text-emerald-400 underline font-mono">voidprompts26@gmail.com</a> or via our verified LinkedIn profile (<a href="https://www.linkedin.com/in/stack-pipeline" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">linkedin.com/in/stack-pipeline</a>) and open-source project repository (<a href="https://github.com/voidprompts/StackPipeline" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">github.com/voidprompts/StackPipeline</a>).
              </p>
            </div>
          )}

          {tab === 'terms' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-100">Terms of Service</h4>
              <p className="text-xs text-slate-400">Effective Date: September 2026</p>
              <p>
                By accessing <strong>stackpipeline.com</strong>, you agree to be bound by these website Terms and Conditions of Use, all applicable laws, and regulations, and agree that you are responsible for compliance with any applicable local laws.
              </p>
              <h5 className="font-semibold text-slate-200">Code Snippets & Architecture Blueprints</h5>
              <p>
                All webhook scripts, cURL snippets, Python steps, and JSON blueprint downloads published on StackPipeline are provided on an "as is" open basis under the Apache-2.0 / MIT license terms. While vetted by certified automation architects, users must test scripts within sandbox staging environments prior to production enterprise deployment.
              </p>
            </div>
          )}

          {tab === 'editorial' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-100">E-E-A-T Editorial Standards & Review Methodology</h4>
              <p className="text-xs text-slate-400">Adhering to Google's Helpful Content System (HCS)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-emerald-400 uppercase font-mono">Experience & Expertise</div>
                  <p className="text-xs text-slate-300 mt-1">
                    All guides are authored exclusively by practicing DevOps and Staff Automation Engineers with minimum 5+ years of live API experience.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-emerald-400 uppercase font-mono">Authoritativeness & Trust</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Every article undergoes a mandatory peer-review loop by an independent technical reviewer before deployment to production.
                  </p>
                </div>
              </div>
              <p>
                We execute all workflows in real SaaS sandbox environments, measure API latencies under load, and verify rate-limit boundaries directly against official vendor developer documentation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
