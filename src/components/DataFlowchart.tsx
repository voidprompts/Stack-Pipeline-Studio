import React, { useState, useId } from 'react';
import { SoftwareTool } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Info,
  Lock,
  Network,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DataFlowchartProps {
  softwareA: SoftwareTool;
  softwareB: SoftwareTool;
  architectureType: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface FlowNode {
  id: string;
  title: string;
  subtitle: string;
  category: 'source' | 'security' | 'transform' | 'queue' | 'dispatcher' | 'sink';
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  bottleneckRisk: 'low' | 'medium' | 'high';
  bottleneckTitle: string;
  bottleneckDetail: string;
  remedy: string;
  integrationPoint: string;
  protocol: string;
  metric: string;
  samplePayload: Record<string, any>;
}

export const DataFlowchart: React.FC<DataFlowchartProps> = ({
  softwareA,
  softwareB,
  architectureType,
  difficulty = 'Intermediate',
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-queue');
  const [highlightBottlenecks, setHighlightBottlenecks] = useState(true);
  const [animateFlow, setAnimateFlow] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const filterId = useId();

  const isBidirectional = architectureType === 'Bidirectional Sync';
  const isBatchETL = architectureType === 'Scheduled Batch ETL';
  const isReverseETL = architectureType === 'Reverse ETL Trigger';
  const isWebhook = !isBidirectional && !isBatchETL && !isReverseETL;

  // Dynamic nodes tailored to selected Software A & Software B, Architecture Paradigm, and Difficulty Tier
  const nodes: FlowNode[] = [
    {
      id: 'node-source',
      title: isReverseETL ? 'Data Warehouse / CDC' : softwareA.name,
      subtitle: isReverseETL
        ? 'Warehouse Primary'
        : isBatchETL
        ? `${softwareA.category} (Cron)`
        : `${softwareA.category} Trigger`,
      category: 'source',
      x: 30,
      y: 160,
      width: 155,
      height: 95,
      icon: 'source',
      bottleneckRisk: isBatchETL ? 'medium' : softwareA.webhookSupport ? 'low' : 'medium',
      bottleneckTitle: isBatchETL
        ? 'Cursor Desync & High DB Heap Pressure'
        : isReverseETL
        ? 'High CDC Log Extraction Latency'
        : 'Trigger Burst & Polling Delay',
      bottleneckDetail: isBatchETL
        ? `Scheduled bulk scans querying changed records can cause table scan lockups or memory timeouts if cursor timestamp indexing is absent.`
        : isReverseETL
        ? `Continuous SQL log tailing (Debezium/CDC) can lag under write-heavy analytical warehouse bulk loads.`
        : softwareA.webhookSupport
        ? `Instant webhook push enabled. Sudden high-volume lead or event bursts can overwhelm downstream buffers without throttling.`
        : `Polling-based trigger on entry-tier plans introduces a 5-to-15 minute sync latency delay.`,
      remedy: isBatchETL
        ? 'Use indexed cursor pagination (e.g. `updated_at > $cursor ORDER BY id ASC LIMIT 250`) to keep batch queries non-blocking.'
        : isReverseETL
        ? 'Read from dedicated read-replicas with Write-Ahead-Log (WAL) tailing rather than production master.'
        : 'Enable webhook subscriptions with exponential backoff on connection drops.',
      integrationPoint: isReverseETL
        ? 'Data Warehouse Change Data Capture'
        : isBatchETL
        ? `${softwareA.name} Bulk Cursor Reader`
        : `${softwareA.name} Outbound Webhook Dispatcher`,
      protocol: isBatchETL
        ? 'Scheduled Cron / REST (Cursor GET)'
        : isReverseETL
        ? 'WAL / CDC Stream'
        : 'HTTPS POST / Webhook Event',
      metric: isBatchETL ? 'Runs every 15-60 min' : '< 150ms trigger latency',
      samplePayload: isBatchETL
        ? {
            batch_id: 'batch_sched_9042',
            cursor_timestamp: '2026-03-22T21:00:00Z',
            chunk_size: 250,
            source_system: softwareA.slug,
            has_more: true,
          }
        : isReverseETL
        ? {
            warehouse_source: 'analytics_dw.customer_360',
            cdc_operation: 'UPSERT',
            record_id: 'cust_891024',
            delta_fields: ['lead_score', 'churn_probability', 'mrr_tier'],
          }
        : {
            event: 'record.created',
            timestamp: new Date().toISOString(),
            source_system: softwareA.slug,
            record_id: 'evt_902148102',
            data: {
              email: 'lead@enterprise-corp.com',
              company: 'Enterprise Corp',
              annual_contract_value: 48000,
            },
          },
    },
    {
      id: 'node-gateway',
      title:
        difficulty === 'Beginner'
          ? 'OAuth & Access Guard'
          : isBatchETL
          ? 'Token Vault & Scheduler'
          : 'Ingress & Auth Gateway',
      subtitle:
        difficulty === 'Beginner'
          ? 'No-Code Auth Vault'
          : isBatchETL
          ? 'Batch Token Refresh'
          : 'Signature & Token Guard',
      category: 'security',
      x: 215,
      y: 160,
      width: 155,
      height: 95,
      icon: 'security',
      bottleneckRisk: difficulty === 'Beginner' ? 'low' : 'medium',
      bottleneckTitle:
        difficulty === 'Beginner'
          ? 'Expired OAuth 2.0 Refresh Scope'
          : isBatchETL
          ? 'Mid-Batch Access Token Expiry'
          : 'Cryptographic Auth Overhead & Token Expiry',
      bottleneckDetail:
        difficulty === 'Beginner'
          ? 'Cloud connector session disconnects when OAuth tokens expire without automated background refresh consent.'
          : isBatchETL
          ? 'Long-running batch ingestion jobs exceeding 3,600s fail halfway through when bearer tokens expire mid-stream.'
          : 'HMAC SHA-256 signature verification and OAuth Bearer token refresh logic can fail under cold-start serverless spikes or expired refresh keys.',
      remedy:
        difficulty === 'Beginner'
          ? 'Authorize with permanent offline access refresh tokens (`access_type=offline`) in connector dashboard.'
          : 'Automate programmatic proactive token refresh 5 minutes prior to JWT expiry with thread-safe mutex.',
      integrationPoint:
        difficulty === 'Beginner'
          ? 'Cloud Managed OAuth Vault'
          : 'Edge Security Gateway (Cloudflare / API Gateway)',
      protocol:
        difficulty === 'Beginner'
          ? 'OAuth 2.0 PKCE / API Token'
          : 'HMAC-SHA256 / OAuth 2.0 Bearer',
      metric: difficulty === 'Beginner' ? 'Automated Token Sync' : '99.99% signature pass rate',
      samplePayload: {
        verified: true,
        auth_mode: difficulty === 'Beginner' ? 'OAuth 2.0 Managed Token' : 'Bearer pat-na1-scoped',
        headers: {
          'X-Signature-SHA256':
            difficulty === 'Beginner'
              ? 'N/A (Managed Provider)'
              : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          'X-Delivery-Attempt': 1,
        },
      },
    },
    {
      id: 'node-transform',
      title: isBidirectional
        ? 'Field Mapper & Diff Engine'
        : isBatchETL
        ? 'Bulk Array Formatter'
        : 'Payload Normalizer',
      subtitle: isBidirectional
        ? 'Dual-Way Mapping'
        : isBatchETL
        ? 'Chunked Vector Cleanse'
        : 'Schema Mapping & Cleanse',
      category: 'transform',
      x: 400,
      y: 160,
      width: 155,
      height: 95,
      icon: 'transform',
      bottleneckRisk: 'medium',
      bottleneckTitle: isBidirectional
        ? 'Field Type Mismatch & Cyclic Recursion'
        : isBatchETL
        ? 'Memory Spikes on Dense JSON Arrays'
        : 'Schema Drift & Unprocessable Entity (422)',
      bottleneckDetail: isBidirectional
        ? 'Mapping custom enum or multi-select fields between both platforms can cause recursive endless loop triggers without delta diffing.'
        : isBatchETL
        ? 'Loading large 10,000-object JSON payloads directly into Node memory triggers V8 Garbage Collection stalls.'
        : 'Incoming fields with unexpected null values, missing required fields, or unsupported date formats trigger immediate ingestion crashes.',
      remedy: isBidirectional
        ? 'Compute SHA-256 field state hashes to abort execution immediately if field contents have not changed.'
        : isBatchETL
        ? 'Stream records via Node.js ndjson streams or pipeline chunks of 250 records to maintain constant < 120MB heap.'
        : 'Implement strict Zod/JSON-Schema validation with fallback default values and non-blocking dead letter routing.',
      integrationPoint:
        difficulty === 'Beginner'
          ? 'No-Code Visual Data Mapper'
          : 'Transformation Pipeline (Make/n8n/Node.js)',
      protocol:
        difficulty === 'Beginner'
          ? 'GUI Field Aliasing'
          : isBatchETL
          ? 'NDJSON Streaming Pipeline'
          : 'JSON Schema Validation / Zod',
      metric: isBatchETL ? '250 records / 1.2s transform' : '0.8ms transformation compute',
      samplePayload: isBatchETL
        ? {
            chunk_index: 1,
            batch_count: 250,
            normalized_schema: `${softwareB.slug}_batch_v1`,
            memory_heap_mb: 84.2,
          }
        : isBidirectional
        ? {
            directional_flag: 'A_TO_B',
            diff_detected: true,
            changed_keys: ['lead_status', 'mrr'],
            hash_previous: 'a4f910..',
            hash_current: 'c9012b..',
          }
        : {
            normalized: true,
            target_schema: `${softwareB.slug}_v1`,
            fields_mapped: 12,
            identity_key: 'lead@enterprise-corp.com',
            transformed_at: '2026-03-22T21:30:00Z',
          },
    },
    {
      id: 'node-queue',
      title: isBidirectional
        ? 'Lock & Conflict Matrix'
        : isBatchETL
        ? 'Staging Heap & Cursor Lock'
        : 'Buffer & Deduplication',
      subtitle: isBidirectional
        ? 'Collision Resolver'
        : isBatchETL
        ? 'Batch Delta Cache'
        : 'Idempotency Cache',
      category: 'queue',
      x: 585,
      y: 160,
      width: 155,
      height: 95,
      icon: 'queue',
      bottleneckRisk: 'high',
      bottleneckTitle: isBidirectional
        ? 'Bidirectional Race Condition Collision'
        : isBatchETL
        ? 'Concurrent Batch Overlaps'
        : 'Thundering Herd & Duplicate Replays',
      bottleneckDetail: isBidirectional
        ? 'Simultaneous edits in both systems within the same sync window trigger conflicting updates and race condition overwrite hazards.'
        : isBatchETL
        ? 'If a scheduled batch takes longer than the cron interval, concurrent jobs process duplicate records simultaneously.'
        : 'High-frequency webhook retries without an Idempotency-Key cause duplicate leads, inflated contact counts, and race conditions.',
      remedy: isBidirectional
        ? 'Implement Last-Write-Wins (LWW) timestamp evaluation with an atomic distributed lock on the primary customer UUID.'
        : isBatchETL
        ? 'Acquire an exclusive Redis redlock before job execution; exit immediately if another batch instance holds the lock.'
        : 'Store composite unique hashes (e.g., md5(email + timestamp_bucket)) in Redis with a 24-hour TTL lock before dispatching downstream.',
      integrationPoint:
        difficulty === 'Beginner'
          ? 'Cloud Connector Deduplication Engine'
          : 'Redis / SQS Idempotency Cache',
      protocol: isBidirectional
        ? 'Distributed Mutex Lock (Redlock)'
        : isBatchETL
        ? 'Cron Lock / Redis SETNX'
        : 'SETNX Lock / Leaky Bucket Rate Limiter',
      metric: isBidirectional
        ? 'Deterministic Conflict Resolution'
        : 'Zero duplicate writes guaranteed',
      samplePayload: isBidirectional
        ? {
            lock_resource: `lock:lead:${softwareB.slug}:90214`,
            conflict_strategy: 'LAST_WRITE_WINS',
            system_a_ts: '2026-03-22T21:30:04Z',
            system_b_ts: '2026-03-22T21:30:01Z',
            winner: 'SYSTEM_A',
          }
        : isBatchETL
        ? {
            job_mutex_id: 'cron_batch_sync_lock',
            status: 'LOCKED',
            acquired_at: new Date().toISOString(),
            ttl_seconds: 600,
          }
        : {
            idempotency_key: 'idemp_e9a10c842b10',
            cached_ttl_seconds: 86400,
            lock_acquired: true,
            queue_depth: 3,
          },
    },
    {
      id: 'node-dispatcher',
      title: isBatchETL
        ? 'Bulk Upsert Dispatcher'
        : difficulty === 'Advanced'
        ? 'Circuit Breaker & Backoff'
        : 'Retry & Rate Throttle',
      subtitle: isBatchETL
        ? 'Chunked REST Ingestion'
        : 'Governor Rate Throttle',
      category: 'dispatcher',
      x: 770,
      y: 160,
      width: 155,
      height: 95,
      icon: 'dispatcher',
      bottleneckRisk: 'high',
      bottleneckTitle: `${softwareB.name} Rate Limit Ceiling`,
      bottleneckDetail: `Destination enforces: ${softwareB.apiRateLimit}. Exceeding this ceiling results in immediate HTTP 429 Too Many Requests and IP cooldown bans.`,
      remedy:
        difficulty === 'Beginner'
          ? 'Configure connector pacing delay (e.g., maximum 5 operations/sec) within the automation interface.'
          : 'Enforce token bucket rate limiting calibrated strictly to destination quotas, with full jitter exponential backoff ($t = 2^n \\pm \\text{rand}$).',
      integrationPoint: `${softwareB.name} Rate Limiter / Circuit Breaker`,
      protocol: isBatchETL
        ? 'Batch POST (Chunk Size: 100-250)'
        : 'HTTP Client with Jittered Backoff',
      metric: `Throttled to ${softwareB.apiRateLimit}`,
      samplePayload: {
        circuit_breaker_state: 'CLOSED',
        active_quota_used: '32%',
        retry_policy: {
          strategy: difficulty === 'Beginner' ? 'linear_pacing' : 'exponential_jitter',
          max_retries: difficulty === 'Advanced' ? 5 : 3,
          base_delay_ms: 1000,
        },
      },
    },
    {
      id: 'node-sink',
      title: softwareB.name,
      subtitle: isBidirectional
        ? `${softwareB.category} (2-Way Node)`
        : `${softwareB.category} Sink`,
      category: 'sink',
      x: 955,
      y: 160,
      width: 155,
      height: 95,
      icon: 'sink',
      bottleneckRisk: 'low',
      bottleneckTitle: isBatchETL
        ? 'Batch Transaction Lock Contention'
        : 'Ingestion Write Locks & Latency',
      bottleneckDetail: isBatchETL
        ? `Inserting 250 items concurrently in ${softwareB.name} can trigger table deadlocks if background workflow triggers fire on each inserted record.`
        : 'Complex relational cascade triggers, workflow rules, or unindexed composite search keys in the target system can inflate response time to > 3,500ms.',
      remedy: isBatchETL
        ? 'Disable non-critical background triggers during batch ingest or chunk payloads into sub-batches of 50.'
        : 'Use batch composite upsert endpoints (e.g. 25-50 records per HTTP request) rather than serial single-record writes.',
      integrationPoint: `${softwareB.name} REST / GraphQL API Target`,
      protocol: isBatchETL
        ? 'Composite Bulk Upsert API'
        : 'HTTPS POST/PATCH (REST / GraphQL)',
      metric: '200 OK / 201 Created confirmation',
      samplePayload: isBatchETL
        ? {
            status: 200,
            batch_result: {
              processed: 250,
              created: 182,
              updated: 68,
              failed: 0,
            },
            roundtrip_ms: 812,
          }
        : {
            status: 200,
            destination_id: `${softwareB.slug}_rec_99214`,
            persisted: true,
            roundtrip_latency_ms: 284,
          },
    },
  ];

  // DLQ auxiliary node
  const dlqNode = {
    id: 'node-dlq',
    title: 'Dead Letter Queue (DLQ)',
    subtitle: 'Quarantined Failures',
    category: 'queue' as const,
    x: 585,
    y: 340,
    width: 155,
    height: 85,
    bottleneckRisk: 'medium' as const,
    bottleneckTitle: 'Unmonitored Poison Pill Buildup',
    bottleneckDetail:
      'Unresolvable 4xx client errors (malformed emails, deleted custom fields) routed to DLQ can silently pile up without automated engineer alerting.',
    remedy: 'Trigger PagerDuty / Slack notifications when DLQ message count exceeds 5 items per hour.',
    integrationPoint: 'AWS SQS / Cloud PubSub Quarantine Queue',
    protocol: 'Asynchronous SQS Replay Buffer',
    metric: 'Zero silent payload drops',
    samplePayload: {
      quarantined_count: 1,
      reason: 'HTTP 422: Missing required field company_domain',
      action: 'Awaiting manual schema review or replay',
    },
  };

  const selectedNode =
    [...nodes, dlqNode].find((n) => n.id === selectedNodeId) || nodes[3];

  const getRiskBorderColor = (risk: 'low' | 'medium' | 'high', isSelected: boolean) => {
    if (isSelected) return 'stroke-emerald-400 stroke-[2.5]';
    if (!highlightBottlenecks) return 'stroke-slate-700 stroke-[1.5]';
    switch (risk) {
      case 'high':
        return 'stroke-rose-500/90 stroke-[2]';
      case 'medium':
        return 'stroke-amber-500/90 stroke-[2]';
      case 'low':
        return 'stroke-emerald-500/80 stroke-[1.5]';
    }
  };

  const getRiskBadgeColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'high':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" />
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">
                Interactive Data Flow & Bottleneck Topology
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {softwareA.name} ➔ {softwareB.name}
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/25">
                {architectureType}
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                {difficulty} Tier
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual map of serialization, cryptographic verification, governor rate limits, and idempotency barriers
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Bottleneck Highlight Switch */}
          <button
            onClick={() => setHighlightBottlenecks(!highlightBottlenecks)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              highlightBottlenecks
                ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Bottlenecks: {highlightBottlenecks ? 'Highlighted' : 'Off'}</span>
          </button>

          {/* Flow Animation Toggle */}
          <button
            onClick={() => setAnimateFlow(!animateFlow)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              animateFlow
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Packets: {animateFlow ? 'Streaming' : 'Static'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, Number((z - 0.1).toFixed(2))))}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-x-auto bg-[#030712] border-b border-slate-800 select-none py-4">
        <div
          className="mx-auto transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoomLevel})`, width: '1140px', height: '450px' }}
        >
          <svg
            viewBox="0 0 1140 450"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Drop Shadow Filter */}
              <filter id={`glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#10b981" floodOpacity="0.15" />
              </filter>
              <filter id={`risk-glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f43f5e" floodOpacity="0.25" />
              </filter>

              {/* Arrowhead Markers */}
              <marker
                id={`arrow-${filterId}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
              </marker>
              <marker
                id={`arrow-cyan-${filterId}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4" />
              </marker>
              <marker
                id={`arrow-amber-${filterId}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
              </marker>
              <marker
                id={`arrow-rose-${filterId}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
              </marker>

              {/* Grid Background Pattern */}
              <pattern id={`grid-${filterId}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="1140" height="450" fill={`url(#grid-${filterId})`} />

            {/* Pipeline Stage Lane Labels */}
            <g opacity="0.6">
              <text x="30" y="45" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                {isBatchETL ? 'CRON SCHEDULER & EXTRACT' : isReverseETL ? 'WAREHOUSE CDC SOURCE' : 'INGRESS PHASE'}
              </text>
              <line x1="30" y1="55" x2="370" y2="55" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

              <text x="400" y="45" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                {isBidirectional ? 'FIELD DIFFING & CONFLICT LOCK' : isBatchETL ? 'CHUNK STREAMING & MUTEX' : 'TRANSFORMATION & IDEMPOTENCY'}
              </text>
              <line x1="400" y1="55" x2="740" y2="55" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

              <text x="770" y="45" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                {isBatchETL ? 'BULK DISPATCH & COMPOSITE UPSERT' : 'DISPATCH & PERSISTENCE'}
              </text>
              <line x1="770" y1="55" x2="1110" y2="55" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
            </g>

            {/* Connection Paths Between Horizontal Nodes */}
            {/* 1 -> 2 */}
            <path
              d="M 185 207.5 L 215 207.5"
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              markerEnd={`url(#arrow-${filterId})`}
            />

            {/* 2 -> 3 */}
            <path
              d="M 370 207.5 L 400 207.5"
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              markerEnd={`url(#arrow-${filterId})`}
            />

            {/* 3 -> 4 */}
            <path
              d="M 555 207.5 L 585 207.5"
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              markerEnd={`url(#arrow-${filterId})`}
            />

            {/* 4 -> 5 */}
            <path
              d="M 740 207.5 L 770 207.5"
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              markerEnd={`url(#arrow-${filterId})`}
            />

            {/* 5 -> 6 */}
            <path
              d="M 925 207.5 L 955 207.5"
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              markerEnd={`url(#arrow-${filterId})`}
            />

            {/* Bidirectional Loopback Arrow (Node 6 feedback into Node 4 Conflict Resolver) */}
            {isBidirectional && (
              <g>
                <path
                  d="M 1032.5 255 C 1032.5 315, 662.5 315, 662.5 255"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  markerEnd={`url(#arrow-cyan-${filterId})`}
                />
                <text x="760" y="305" fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  ⇄ 2-Way Delta Feedback Loop
                </text>
              </g>
            )}

            {/* Dead Letter Queue Branch (4 to DLQ on failure) */}
            <path
              d="M 662.5 255 L 662.5 340"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              markerEnd={`url(#arrow-rose-${filterId})`}
            />
            <text x="670" y="300" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {difficulty === 'Beginner' ? 'Alert Error Log' : 'Unrecoverable 4xx / DLQ'}
            </text>

            {/* Retry Loop (Node 5 back to Node 4 buffer on 429 backoff) */}
            <path
              d="M 847.5 160 C 847.5 100, 662.5 100, 662.5 160"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              markerEnd={`url(#arrow-amber-${filterId})`}
            />
            <text x="715" y="110" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {difficulty === 'Beginner' ? 'Pacing Delay Loop' : '429 Retry Backoff Loop'}
            </text>

            {/* Animated Packet Stream (SVG Stroke Dash offset) */}
            {animateFlow && (
              <>
                <circle r="4" fill="#34d399">
                  <animateMotion
                    path="M 185 207.5 L 955 207.5"
                    dur={isBatchETL ? '5.5s' : '3.2s'}
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="3" fill="#fbbf24">
                  <animateMotion
                    path="M 847.5 160 C 847.5 100, 662.5 100, 662.5 160"
                    dur="4.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                {isBidirectional && (
                  <circle r="3.5" fill="#06b6d4">
                    <animateMotion
                      path="M 1032.5 255 C 1032.5 315, 662.5 315, 662.5 255"
                      dur="3.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </>
            )}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const riskBorder = getRiskBorderColor(node.bottleneckRisk, isSelected);

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer transition-all duration-150 group"
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  {/* Outer Glow / Halo on Selection */}
                  {isSelected && (
                    <rect
                      x="-4"
                      y="-4"
                      width={node.width + 8}
                      height={node.height + 8}
                      rx="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  )}

                  {/* Card Background */}
                  <rect
                    x="0"
                    y="0"
                    width={node.width}
                    height={node.height}
                    rx="10"
                    fill="#0f172a"
                    className={`${riskBorder} group-hover:stroke-emerald-400 transition-colors`}
                  />

                  {/* Top Bar for Category / Stage */}
                  <rect
                    x="1"
                    y="1"
                    width={node.width - 2}
                    height="24"
                    rx="9"
                    fill={node.category === 'source' || node.category === 'sink' ? '#1e293b' : '#1e1b4b'}
                    opacity="0.4"
                  />

                  {/* Node Title */}
                  <text
                    x="12"
                    y="17"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.05em"
                  >
                    {node.subtitle.toUpperCase()}
                  </text>

                  {/* Main Node Name */}
                  <text
                    x="12"
                    y="46"
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="system-ui, sans-serif"
                  >
                    {node.title.length > 15 ? `${node.title.slice(0, 14)}...` : node.title}
                  </text>

                  {/* Metric or Protocol Indicator */}
                  <text
                    x="12"
                    y="68"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.protocol.length > 18 ? `${node.protocol.slice(0, 17)}..` : node.protocol}
                  </text>

                  {/* Bottleneck Warning Chip inside Node if highlighted */}
                  {highlightBottlenecks && (
                    <g transform="translate(10, 75)">
                      <circle
                        cx="4"
                        cy="4"
                        r="3"
                        fill={
                          node.bottleneckRisk === 'high'
                            ? '#f43f5e'
                            : node.bottleneckRisk === 'medium'
                            ? '#f59e0b'
                            : '#10b981'
                        }
                      />
                      <text
                        x="12"
                        y="7"
                        fill={
                          node.bottleneckRisk === 'high'
                            ? '#fda4af'
                            : node.bottleneckRisk === 'medium'
                            ? '#fde68a'
                            : '#6ee7b7'
                        }
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {node.bottleneckRisk.toUpperCase()} RISK
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Dead Letter Queue Node */}
            <g
              onClick={() => setSelectedNodeId(dlqNode.id)}
              className="cursor-pointer transition-all duration-150 group"
              transform={`translate(${dlqNode.x}, ${dlqNode.y})`}
            >
              {selectedNodeId === dlqNode.id && (
                <rect
                  x="-4"
                  y="-4"
                  width={dlqNode.width + 8}
                  height={dlqNode.height + 8}
                  rx="14"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  opacity="0.4"
                />
              )}

              <rect
                x="0"
                y="0"
                width={dlqNode.width}
                height={dlqNode.height}
                rx="10"
                fill="#180b12"
                stroke={selectedNodeId === dlqNode.id ? '#f43f5e' : '#881337'}
                strokeWidth={selectedNodeId === dlqNode.id ? '2.5' : '1.5'}
                className="group-hover:stroke-rose-400 transition-colors"
              />

              <text x="12" y="18" fill="#fda4af" fontSize="9" fontFamily="monospace" fontWeight="bold">
                EXCEPTION QUARANTINE
              </text>
              <text x="12" y="44" fill="#ffe4e6" fontSize="12" fontWeight="700">
                Dead Letter Queue
              </text>
              <text x="12" y="64" fill="#fb7185" fontSize="9" fontFamily="monospace">
                Poison Pill Isolation
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Interactive Node Inspector Panel */}
      <div className="p-6 bg-slate-900/60 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Node Details & Integration Point */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Selected Topology Component
            </span>
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getRiskBadgeColor(
                selectedNode.bottleneckRisk
              )}`}
            >
              {selectedNode.bottleneckRisk} Bottleneck Risk
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{selectedNode.title}</span>
            </h4>
            <div className="text-xs font-mono text-emerald-400 mt-0.5">
              {selectedNode.integrationPoint}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Transport Protocol</div>
              <div className="font-semibold text-slate-200 mt-0.5">{selectedNode.protocol}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Performance Benchmark</div>
              <div className="font-semibold text-emerald-300 mt-0.5 font-mono">{selectedNode.metric}</div>
            </div>
          </div>
        </div>

        {/* Center Column: Bottleneck Analysis & Mitigation Remedy */}
        <div className="lg:col-span-1 space-y-4">
          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
            Bottleneck Diagnostic & Architecture Remedy
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  selectedNode.bottleneckRisk === 'high'
                    ? 'text-rose-400'
                    : selectedNode.bottleneckRisk === 'medium'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              />
              <div>
                <h5 className="text-xs font-bold text-slate-200">
                  {selectedNode.bottleneckTitle}
                </h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedNode.bottleneckDetail}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-400">Architectural Solution: </span>
                  <span className="text-slate-300">{selectedNode.remedy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: In-Flight Payload Packet */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Serialized Packet Envelope
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Stage State</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
            <pre>{JSON.stringify(selectedNode.samplePayload, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
