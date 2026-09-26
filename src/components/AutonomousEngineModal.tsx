import React, { useState, useEffect } from 'react';
import { AutomationEngineState, AutomationQueueItem, ToolComparison, ToolAlternativesHub } from '../types';
import {
  X,
  Play,
  Pause,
  RefreshCw,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  GitCompare,
  ArrowRight,
  TrendingUp,
  FileCode,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface AutonomousEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTutorial?: (id: string) => void;
  onOpenComparison?: (comp: ToolComparison) => void;
  onOpenAlternatives?: (alt: ToolAlternativesHub) => void;
}

export const AutonomousEngineModal: React.FC<AutonomousEngineModalProps> = ({
  isOpen,
  onClose,
  onSelectTutorial,
  onOpenComparison,
  onOpenAlternatives,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'matrix' | 'hubs' | 'audit'>('queue');
  const [engineState, setEngineState] = useState<AutomationEngineState | null>(null);
  const [contentStore, setContentStore] = useState<{
    tutorials: any[];
    comparisons: ToolComparison[];
    alternatives: ToolAlternativesHub[];
  }>({ tutorials: [], comparisons: [], alternatives: [] });
  const [matrixDomains, setMatrixDomains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [hubFilter, setHubFilter] = useState<'all' | 'integration' | 'comparison' | 'alternatives'>('all');

  // Form for adding custom targets
  const [customPrimary, setCustomPrimary] = useState('');
  const [customSecondary, setCustomSecondary] = useState('');
  const [customType, setCustomType] = useState<'integration' | 'comparison' | 'alternatives'>('integration');
  const [customCategory, setCustomCategory] = useState('Workflow Automation');
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  // Fetch engine state & content
  const fetchEngineData = async () => {
    try {
      const [engineRes, contentRes, matrixRes] = await Promise.all([
        fetch('/api/autonomous-engine'),
        fetch('/api/autonomous-engine/content'),
        fetch('/api/autonomous-engine/matrix'),
      ]);

      if (engineRes.ok) {
        const data = await engineRes.json();
        setEngineState(data);
      }
      if (contentRes.ok) {
        const cData = await contentRes.json();
        setContentStore(cData);
      }
      if (matrixRes.ok) {
        const mData = await matrixRes.json();
        setMatrixDomains(mData.domains || []);
      }
    } catch (err) {
      console.error('Failed to fetch autonomous engine data:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEngineData();
      const interval = setInterval(fetchEngineData, 6000); // Polling status
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleToggleEngine = async () => {
    if (!engineState) return;
    try {
      const newEnabled = !engineState.enabled;
      const res = await fetch('/api/autonomous-engine/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });
      if (res.ok) {
        setEngineState((prev) => (prev ? { ...prev, enabled: newEnabled } : null));
      }
    } catch (err) {
      console.error('Failed to toggle autonomous engine:', err);
    }
  };

  const handleTriggerCycle = async () => {
    setIsTriggering(true);
    try {
      const res = await fetch('/api/autonomous-engine/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        await fetchEngineData();
      }
    } catch (err) {
      console.error('Failed to trigger autonomous cycle:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleReplenishTargets = async (count: number = 5) => {
    try {
      const res = await fetch('/api/autonomous-engine/replenish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      if (res.ok) {
        await fetchEngineData();
      }
    } catch (err) {
      console.error('Failed to replenish targets:', err);
    }
  };

  const handleChangeSpeed = async (seconds: number) => {
    try {
      const res = await fetch('/api/autonomous-engine/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intervalSeconds: seconds }),
      });
      if (res.ok) {
        await fetchEngineData();
      }
    } catch (err) {
      console.error('Failed to change speed:', err);
    }
  };

  const handleToggleAutoReplenish = async () => {
    if (!engineState) return;
    try {
      const newAuto = !(engineState.autoReplenish ?? true);
      const res = await fetch('/api/autonomous-engine/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoReplenish: newAuto }),
      });
      if (res.ok) {
        setEngineState((prev) => (prev ? { ...prev, autoReplenish: newAuto } : null));
      }
    } catch (err) {
      console.error('Failed to toggle auto-replenish:', err);
    }
  };

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrimary.trim()) return;

    try {
      const res = await fetch('/api/autonomous-engine/add-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: customType,
          primaryToolName: customPrimary.trim(),
          secondaryToolName: customSecondary.trim() || undefined,
          category: customCategory,
        }),
      });

      if (res.ok) {
        setAddSuccessMsg(`Target [${customPrimary}] added to queue!`);
        setCustomPrimary('');
        setCustomSecondary('');
        fetchEngineData();
        setTimeout(() => setAddSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to add target:', err);
    }
  };

  const handleQueueMatrixTool = async (
    primary: string,
    secondary?: string,
    type: 'integration' | 'comparison' | 'alternatives' = 'integration',
    cat: string = 'Workflow Automation'
  ) => {
    try {
      const res = await fetch('/api/autonomous-engine/add-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: type,
          primaryToolName: primary,
          secondaryToolName: secondary,
          category: cat,
        }),
      });
      if (res.ok) {
        fetchEngineData();
        setActiveTab('queue');
      }
    } catch (err) {
      console.error('Failed to queue matrix tool:', err);
    }
  };

  const handleOpenQueueItem = (item: AutomationQueueItem) => {
    if (item.status !== 'published') return;

    if (item.targetType === 'comparison') {
      const comp = contentStore.comparisons.find(
        (c) =>
          c.slug === item.generatedSlug ||
          c.toolA.name.toLowerCase() === item.primaryToolName.toLowerCase() ||
          c.toolB.name.toLowerCase() === item.secondaryToolName?.toLowerCase()
      );
      if (comp && onOpenComparison) {
        onOpenComparison(comp);
        onClose();
        return;
      }
    } else if (item.targetType === 'alternatives') {
      const alt = contentStore.alternatives.find(
        (a) =>
          a.slug === item.generatedSlug ||
          a.primaryTool.name.toLowerCase() === item.primaryToolName.toLowerCase()
      );
      if (alt && onOpenAlternatives) {
        onOpenAlternatives(alt);
        onClose();
        return;
      }
    } else {
      const tut = contentStore.tutorials.find(
        (t) =>
          t.slug === item.generatedSlug ||
          t.softwareA.name.toLowerCase() === item.primaryToolName.toLowerCase()
      );
      if (tut && onSelectTutorial) {
        onSelectTutorial(tut.id);
        onClose();
        return;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="autonomous-engine-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="autonomous-engine-title" className="text-base sm:text-lg font-bold text-slate-100">
                  Autonomous B2B Content Engine
                </h2>
                {engineState?.enabled ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Auto-Pilot Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Pause className="w-2.5 h-2.5" />
                    Auto-Pilot Paused
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Automated Evaluation, Comparison &amp; Guide Generation Engine · No Manual Clicks Required
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Stats & Quick Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/50 border-b border-slate-800/80 text-xs">
          {/* Status & Toggle */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Engine Status</span>
              <button
                onClick={handleToggleAutoReplenish}
                title="Toggle automated target synthesis when queue is low"
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                  engineState?.autoReplenish !== false
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Auto-Replenish: {engineState?.autoReplenish !== false ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-slate-100">
                {engineState?.enabled ? 'Continuous Run' : 'Paused'}
              </span>
              <button
                onClick={handleToggleEngine}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                  engineState?.enabled
                    ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                }`}
              >
                {engineState?.enabled ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>

          {/* Published Count */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
            <span className="text-slate-400 font-mono text-[10px] uppercase">Generated &amp; Published</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold font-mono text-emerald-400">
                {engineState?.totalPublished || 0}
              </span>
              <span className="text-[10px] text-slate-400">articles online</span>
            </div>
            <div className="text-[10px] text-emerald-400/80 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>100% E-E-A-T Verified</span>
            </div>
          </div>

          {/* Pending Queue */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Target Queue Items</span>
              <button
                onClick={() => handleReplenishTargets(5)}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors cursor-pointer flex items-center gap-1"
                title="Synthesize 5 new high-intent B2B SaaS targets into queue"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>+5 Matrix</span>
              </button>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold font-mono text-cyan-400">
                {engineState?.queue.filter((q) => q.status === 'queued').length || 0}
              </span>
              <span className="text-[10px] text-slate-400">awaiting run</span>
            </div>
          </div>

          {/* Instant Trigger Action & Speed */}
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold">Autopilot Speed</span>
              <div className="flex items-center gap-1">
                {[
                  { label: '15s', sec: 15, title: 'Demo Turbo Mode (15 sec)' },
                  { label: '30s', sec: 30, title: 'Active Testing Mode (30 sec)' },
                  { label: '60s', sec: 60, title: 'Rapid Simulation (1 min)' },
                  { label: '12h', sec: 43200, title: 'AdSense Safe Stage 2 (12 hours)' },
                  { label: '24h', sec: 86400, title: 'AdSense Safe Launch (24 hours - Recommended)' },
                ].map((item) => (
                  <button
                    key={item.sec}
                    onClick={() => handleChangeSpeed(item.sec)}
                    title={item.title}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-colors cursor-pointer ${
                      (engineState?.intervalSeconds ?? 30) === item.sec
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleTriggerCycle}
              disabled={isTriggering}
              className="mt-1 w-full py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Evaluating...' : 'Run Cycle Now'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-4 sm:px-6 bg-slate-950/40 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'queue'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Queue &amp; Audit Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target Integration Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('hubs')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'hubs'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              Generated Content Hubs (
              {(contentStore.tutorials.length || 0) +
                (contentStore.comparisons.length || 0) +
                (contentStore.alternatives.length || 0)}
              )
            </span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AdSense &amp; E-E-A-T Quality Safeguards</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: LIVE QUEUE & AUDIT LOGS */}
          {activeTab === 'queue' && (
            <div className="space-y-6">
              {/* Queue Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Autonomous Seed Queue</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Auto-evaluates top seed automatically every {engineState?.intervalSeconds ?? 30}s · {engineState?.autoReplenish !== false ? 'Auto-Replenish Active' : 'Auto-Replenish Off'}
                  </span>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Target Platform(s)</th>
                        <th className="p-3">Archetype</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Intent Tier</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">E-E-A-T Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
                      {engineState?.queue.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/80 transition-colors">
                          <td className="p-3 font-semibold text-slate-200">
                            {item.primaryToolName}
                            {item.secondaryToolName && (
                              <span className="text-slate-400 font-normal">
                                {' '}
                                {item.targetType === 'comparison' ? 'vs' : '→'} {item.secondaryToolName}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                item.targetType === 'comparison'
                                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                  : item.targetType === 'alternatives'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {item.targetType}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{item.category}</td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                              {item.searchVolumeTier}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 w-max ${
                                item.status === 'published'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : item.status === 'processing'
                                  ? 'bg-cyan-500/15 text-cyan-400 animate-pulse'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'published'
                                    ? 'bg-emerald-400'
                                    : item.status === 'processing'
                                    ? 'bg-cyan-400'
                                    : 'bg-slate-500'
                                }`}
                              />
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold">
                            {item.status === 'published' ? (
                              <button
                                onClick={() => handleOpenQueueItem(item)}
                                className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="Open this published article immediately"
                              >
                                <span>Read ({item.auditStatus ? `${item.auditStatus.eeatScore}%` : 'Live'})</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            ) : item.auditStatus ? (
                              <span className="text-emerald-400">{item.auditStatus.eeatScore}%</span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Engine Log Console */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Autonomous Engine Stream</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">Real-time audit log</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto leading-relaxed">
                  {engineState?.logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-slate-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`font-bold shrink-0 uppercase text-[10px] ${
                          log.level === 'success'
                            ? 'text-emerald-400'
                            : log.level === 'warn'
                            ? 'text-amber-400'
                            : log.level === 'error'
                            ? 'text-rose-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        [{log.level}]
                      </span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TARGET INTEGRATION MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              {/* Add Custom Seed Form */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>En-queue Custom Target for Autonomous Generation</span>
                </h3>
                <form onSubmit={handleAddTarget} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Archetype</label>
                    <select
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value as any)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    >
                      <option value="integration">Integration Pipeline</option>
                      <option value="comparison">Head-to-Head (Vs)</option>
                      <option value="alternatives">Top Alternatives Hub</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Primary Platform</label>
                    <input
                      type="text"
                      placeholder="e.g. Linear, Supabase, Segment"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Secondary Platform {customType === 'alternatives' && '(Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HubSpot, Zapier, Jira"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Queue Target
                    </button>
                  </div>
                </form>
                {addSuccessMsg && (
                  <div className="text-xs text-emerald-400 font-mono">{addSuccessMsg}</div>
                )}
              </div>

              {/* Curated B2B Domain Matrix */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Curated High-Yield B2B SaaS Domains</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    High commercial search intent &amp; recurring bounty tiers
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matrixDomains.map((domain, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-200">{domain.category}</h4>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {domain.affiliateYield}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 my-2">
                          {domain.tools.map((toolName: string) => (
                            <span
                              key={toolName}
                              className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-xs border border-slate-800"
                            >
                              {toolName}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">Recommended:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleQueueMatrixTool(
                                domain.tools[0],
                                domain.tools[1],
                                'comparison',
                                domain.category
                              )
                            }
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono cursor-pointer transition-colors"
                          >
                            + Compare ({domain.tools[0]} vs {domain.tools[1]})
                          </button>
                          <button
                            onClick={() =>
                              handleQueueMatrixTool(
                                domain.tools[0],
                                undefined,
                                'alternatives',
                                domain.category
                              )
                            }
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-mono cursor-pointer transition-colors"
                          >
                            + Alternatives Hub
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GENERATED CONTENT HUBS */}
          {activeTab === 'hubs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Published Content Catalog</span>
                </h3>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                  {(['all', 'integration', 'comparison', 'alternatives'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setHubFilter(filter)}
                      className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                        hubFilter === filter ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tutorials Grid */}
              {(hubFilter === 'all' || hubFilter === 'integration') &&
                contentStore.tutorials.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
                      Integration Guides ({contentStore.tutorials.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contentStore.tutorials.map((tut: any) => (
                        <div
                          key={tut.id}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                              {tut.architectureType}
                            </span>
                            <h4 className="text-xs font-bold text-slate-200 mt-1 line-clamp-2">
                              {tut.title}
                            </h4>
                          </div>
                          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="text-slate-400 text-[11px]">
                              {tut.estimatedMinutes} min read
                            </span>
                            <button
                              onClick={() => {
                                if (onSelectTutorial) {
                                  onSelectTutorial(tut.id);
                                  onClose();
                                }
                              }}
                              className="text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <span>Open in Reader</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Comparisons Grid */}
              {(hubFilter === 'all' || hubFilter === 'comparison') &&
                contentStore.comparisons.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase text-purple-400 font-bold">
                      Head-to-Head Comparisons ({contentStore.comparisons.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contentStore.comparisons.map((cmp: ToolComparison) => (
                        <div
                          key={cmp.id}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                              {cmp.toolA.name} vs {cmp.toolB.name}
                            </span>
                            <h4 className="text-xs font-bold text-slate-200 mt-1 line-clamp-2">
                              {cmp.title}
                            </h4>
                          </div>
                          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="text-slate-400 text-[11px]">
                              Verdict: <strong className="text-emerald-400">{cmp.toolA.name}</strong>
                            </span>
                            <button
                              onClick={() => {
                                if (onOpenComparison) {
                                  onOpenComparison(cmp);
                                  onClose();
                                }
                              }}
                              className="text-purple-400 font-semibold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <span>View Showdown</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Alternatives Grid */}
              {(hubFilter === 'all' || hubFilter === 'alternatives') &&
                contentStore.alternatives.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase text-amber-400 font-bold">
                      Top Alternatives Hubs ({contentStore.alternatives.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contentStore.alternatives.map((alt: ToolAlternativesHub) => (
                        <div
                          key={alt.id}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                              {alt.primaryTool.name} Alternatives
                            </span>
                            <h4 className="text-xs font-bold text-slate-200 mt-1 line-clamp-2">
                              {alt.title}
                            </h4>
                          </div>
                          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="text-slate-400 text-[11px]">
                              {alt.alternatives.length} alternatives benchmarked
                            </span>
                            <button
                              onClick={() => {
                                if (onOpenAlternatives) {
                                  onOpenAlternatives(alt);
                                  onClose();
                                }
                              }}
                              className="text-amber-400 font-semibold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <span>Explore Hub</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* TAB 4: QUALITY & ADSENSE COMPLIANCE SAFEGUARDS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Programmatic Integrity &amp; Search Engine Defense</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To prevent Google Helpful Content Update or AdSense thin-content flags, every autonomous
                  generation must pass 4 non-negotiable verification gates before publishing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Schema.org JSON-LD Verification</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every article and comparison compiles valid structured data (`HowTo`, `FAQPage`,
                    and `SoftwareApplication`) with real step anchors, timings, and question-answer entities.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>FTC Affiliate Tag Compliance</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All partner referral links are automatically injected with `rel="sponsored noopener"`
                    attributes and clear banner disclosures, ensuring strict adherence to AdSense policies.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Production-Ready Code Snippets</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero pseudo-code or generic hallucinations. Snippets implement real HMAC-SHA256 signature
                    validation, exponential backoff with full jitter, and idempotency key checks.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Institutional E-E-A-T Attribution</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Articles are accredited to the *StackPipeline Editorial Team* with peer reviews signed off
                    by the *StackPipeline Technical Review Board*, backed by verified LinkedIn and GitHub profiles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Next automatic execution:</span>
            <strong className="text-slate-200">
              {engineState?.nextRunAt ? new Date(engineState.nextRunAt).toLocaleTimeString() : 'Pending'}
            </strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors cursor-pointer self-end sm:self-auto"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
