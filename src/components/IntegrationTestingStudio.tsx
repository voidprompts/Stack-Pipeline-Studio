import React, { useState, useEffect, useRef } from 'react';
import { SoftwareTool } from '../types';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Database,
  Terminal,
  Copy,
  Check,
  Zap,
  Activity,
  Server,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface IntegrationTestingStudioProps {
  softwareA: SoftwareTool;
  softwareB: SoftwareTool;
}

export type FailureScenarioId =
  | 'rate_limit_429'
  | 'service_down_503'
  | 'unauthorized_401'
  | 'schema_mismatch_422'
  | 'gateway_timeout_504';

export type RetryStrategyId =
  | 'exponential_backoff'
  | 'circuit_breaker'
  | 'dlq_quarantine'
  | 'oauth_refresh_replay'
  | 'idempotent_dedupe';

interface TimelineEvent {
  id: string;
  timestamp: string;
  attemptNumber: number;
  stage: 'dispatch' | 'error' | 'backoff' | 'token_refresh' | 'circuit_trip' | 'dlq' | 'success';
  title: string;
  description: string;
  statusCode?: number;
  details?: {
    latencyMs?: number;
    requestHeaders?: Record<string, string>;
    responseBody?: Record<string, any>;
    backoffDelayMs?: number;
  };
}

export const IntegrationTestingStudio: React.FC<IntegrationTestingStudioProps> = ({
  softwareA,
  softwareB,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<FailureScenarioId>('rate_limit_429');
  const [selectedStrategy, setSelectedStrategy] = useState<RetryStrategyId>('exponential_backoff');
  const [isRunning, setIsRunning] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [activeLogEvent, setActiveLogEvent] = useState<TimelineEvent | null>(null);
  const [circuitBreakerState, setCircuitBreakerState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [activeCodeTab, setActiveCodeTab] = useState<'typescript' | 'python' | 'zapier'>('typescript');
  const [copiedCode, setCopiedCode] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenarios = [
    {
      id: 'rate_limit_429' as FailureScenarioId,
      label: '429 Too Many Requests (Rate Limit Burst)',
      httpCode: 429,
      recommendedStrategy: 'exponential_backoff' as RetryStrategyId,
      cause: `${softwareB.name} REST API quota exhausted (100 req/10s). Returns Retry-After: 3 header.`,
    },
    {
      id: 'service_down_503' as FailureScenarioId,
      label: '503 Service Unavailable (Target Outage)',
      httpCode: 503,
      recommendedStrategy: 'circuit_breaker' as RetryStrategyId,
      cause: `${softwareB.name} cluster undergoing database failover or maintenance window.`,
    },
    {
      id: 'unauthorized_401' as FailureScenarioId,
      label: '401 Unauthorized (Expired OAuth Bearer Token)',
      httpCode: 401,
      recommendedStrategy: 'oauth_refresh_replay' as RetryStrategyId,
      cause: `Access token expired after 3600 seconds; requires immediate refresh token exchange.`,
    },
    {
      id: 'schema_mismatch_422' as FailureScenarioId,
      label: '422 Unprocessable Entity (Missing Required Field)',
      httpCode: 422,
      recommendedStrategy: 'dlq_quarantine' as RetryStrategyId,
      cause: `Payload missing required property 'email'. Retrying will not resolve this logic error.`,
    },
    {
      id: 'gateway_timeout_504' as FailureScenarioId,
      label: '504 Gateway Timeout (Latency Surge > 10,000ms)',
      httpCode: 504,
      recommendedStrategy: 'idempotent_dedupe' as RetryStrategyId,
      cause: `Upstream query hung; client cannot determine if ${softwareB.name} record was written or dropped.`,
    },
  ];

  const strategies = [
    {
      id: 'exponential_backoff' as RetryStrategyId,
      label: 'Exponential Backoff with Full Jitter',
      badge: 'Gold Standard for 429 & 503',
      description: 'Calculates t = (2^attempt * baseDelay) ± jitter to prevent thundering herd spikes.',
    },
    {
      id: 'circuit_breaker' as RetryStrategyId,
      label: 'Circuit Breaker (Closed → Open → Half-Open)',
      badge: 'Cascading Failure Prevention',
      description: 'Trips open after 3 consecutive failures to fast-fail requests without overloading downstream APIs.',
    },
    {
      id: 'dlq_quarantine' as RetryStrategyId,
      label: 'Dead Letter Queue (DLQ) Quarantine',
      badge: 'Zero Data Loss for 4xx Errors',
      description: 'Immediately routes non-transient 4xx failures to AWS SQS / Cloud PubSub for human triage.',
    },
    {
      id: 'oauth_refresh_replay' as RetryStrategyId,
      label: 'Automated OAuth Token Refresh & Re-flight',
      badge: 'Zero-Interruption Auth',
      description: 'Intercepts 401, requests new access token with refresh_token, and transparently retries.',
    },
    {
      id: 'idempotent_dedupe' as RetryStrategyId,
      label: 'Idempotency Key & Safe Ingestion',
      badge: 'Prevents Duplicate Records',
      description: 'Attaches unique UUID v4 Idempotency-Key so retried requests safely upsert without duplicate deals.',
    },
  ];

  // Auto-sync recommended strategy when scenario changes
  const handleScenarioChange = (scenarioId: FailureScenarioId) => {
    setSelectedScenario(scenarioId);
    const scenarioObj = scenarios.find((s) => s.id === scenarioId);
    if (scenarioObj) {
      setSelectedStrategy(scenarioObj.recommendedStrategy);
    }
    resetSimulation();
  };

  const resetSimulation = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setCurrentAttempt(0);
    setEvents([]);
    setActiveLogEvent(null);
    setCircuitBreakerState('CLOSED');
  };

  const runSimulation = () => {
    resetSimulation();
    setIsRunning(true);

    const now = () => new Date().toLocaleTimeString('en-US', { hour12: false });
    const timeline: TimelineEvent[] = [];

    // Helper to push and update state
    const pushEvent = (evt: TimelineEvent) => {
      timeline.push(evt);
      setEvents([...timeline]);
      setActiveLogEvent(evt);
    };

    // Step 1: Initial Dispatch
    const idempotencyKey = `sp_idemp_${Math.random().toString(36).substring(2, 10)}`;
    pushEvent({
      id: 'evt_1',
      timestamp: now(),
      attemptNumber: 1,
      stage: 'dispatch',
      title: `Attempt #1: Dispatch Webhook (${softwareA.name} → ${softwareB.name})`,
      description: `Dispatched POST payload with Idempotency-Key: ${idempotencyKey}`,
      details: {
        requestHeaders: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
          'X-Delivery-Attempt': '1',
          'User-Agent': 'StackPipeline-Orchestrator/2026.3',
        },
        responseBody: {
          lead: { email: 'alex.vance@techcorp.io', company: 'TechCorp', pipeline_stage: 'qualified' },
        },
      },
    });

    // Step 2: Failure Response (after 400ms)
    timerRef.current = setTimeout(() => {
      setCurrentAttempt(1);

      if (selectedScenario === 'rate_limit_429') {
        pushEvent({
          id: 'evt_2',
          timestamp: now(),
          attemptNumber: 1,
          stage: 'error',
          statusCode: 429,
          title: `HTTP 429 Too Many Requests Received from ${softwareB.name}`,
          description: `Rate limit ceiling hit. Header 'Retry-After: 2' supplied by ${softwareB.name}.`,
          details: {
            latencyMs: 142,
            responseBody: {
              status: 'error',
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Rate limit of 100 requests per 10 seconds exceeded for tenant.',
              retry_after_seconds: 2,
            },
          },
        });

        // Step 3: Backoff Calculation
        timerRef.current = setTimeout(() => {
          pushEvent({
            id: 'evt_3',
            timestamp: now(),
            attemptNumber: 1,
            stage: 'backoff',
            title: `Exponential Backoff Scheduled (2,450ms Delay with Jitter)`,
            description: `Formula: t = (2^1 * 1000ms) + 450ms random jitter. Sleeping thread...`,
            details: {
              backoffDelayMs: 2450,
            },
          });

          // Step 4: Re-attempt #2
          timerRef.current = setTimeout(() => {
            setCurrentAttempt(2);
            pushEvent({
              id: 'evt_4',
              timestamp: now(),
              attemptNumber: 2,
              stage: 'dispatch',
              title: `Attempt #2: Re-delivering Webhook Payload`,
              description: `Dispatched with incremented X-Delivery-Attempt: 2 and identical Idempotency-Key.`,
              details: {
                requestHeaders: {
                  'Idempotency-Key': idempotencyKey,
                  'X-Delivery-Attempt': '2',
                },
              },
            });

            // Step 5: Successful Recovery
            timerRef.current = setTimeout(() => {
              pushEvent({
                id: 'evt_5',
                timestamp: now(),
                attemptNumber: 2,
                stage: 'success',
                statusCode: 200,
                title: `HTTP 200 OK: Successfully Upserted in ${softwareB.name}`,
                description: `Webhook resolved cleanly without duplicate deal creation or manual admin intervention.`,
                details: {
                  latencyMs: 98,
                  responseBody: {
                    status: 'success',
                    contactId: 'hub_84920194',
                    action_taken: 'record_updated_without_dedupe_conflict',
                  },
                },
              });
              setIsRunning(false);
            }, 600);
          }, 1200);
        }, 500);
      } else if (selectedScenario === 'service_down_503') {
        // Circuit Breaker simulation
        pushEvent({
          id: 'evt_2',
          timestamp: now(),
          attemptNumber: 1,
          stage: 'error',
          statusCode: 503,
          title: `HTTP 503 Service Unavailable (${softwareB.name} Cluster Down)`,
          description: `Host failed to return healthy response within SLA. Consecutive failures: 1/3.`,
          details: {
            latencyMs: 380,
            responseBody: { error: 'Service temporarily unavailable during cluster maintenance' },
          },
        });

        timerRef.current = setTimeout(() => {
          setCurrentAttempt(2);
          pushEvent({
            id: 'evt_3',
            timestamp: now(),
            attemptNumber: 2,
            stage: 'error',
            statusCode: 503,
            title: `Attempt #2 Failed: HTTP 503 from ${softwareB.name}`,
            description: `Consecutive failures reach 2/3 threshold.`,
          });

          timerRef.current = setTimeout(() => {
            setCurrentAttempt(3);
            setCircuitBreakerState('OPEN');
            pushEvent({
              id: 'evt_4',
              timestamp: now(),
              attemptNumber: 3,
              stage: 'circuit_trip',
              title: `Circuit Breaker TRIPPED to OPEN State`,
              description: `Failure threshold (3/3) exceeded. Circuit is now OPEN. Fast-failing downstream requests for 30s to protect system.`,
            });

            timerRef.current = setTimeout(() => {
              pushEvent({
                id: 'evt_5',
                timestamp: now(),
                attemptNumber: 3,
                stage: 'dlq',
                title: `Payload Diverted to Dead Letter Queue (DLQ)`,
                description: `Enqueued in SQS queue 'sp_dlq_${softwareB.slug}'. Alert dispatched to Slack ops channel.`,
                details: {
                  responseBody: {
                    dlq_message_id: 'msg_9841203941',
                    queue_arn: 'arn:aws:sqs:us-east-1:stackpipeline:outbound-dlq',
                    status: 'quarantined_for_auto_replay',
                  },
                },
              });
              setIsRunning(false);
            }, 700);
          }, 800);
        }, 800);
      } else if (selectedScenario === 'unauthorized_401') {
        // OAuth Token Refresh simulation
        pushEvent({
          id: 'evt_2',
          timestamp: now(),
          attemptNumber: 1,
          stage: 'error',
          statusCode: 401,
          title: `HTTP 401 Unauthorized: Expired Bearer Token`,
          description: `${softwareB.name} rejected JWT: 'token_expired_at_1774312000'.`,
          details: {
            latencyMs: 76,
            responseBody: {
              error: 'invalid_token',
              error_description: 'The access token provided has expired.',
            },
          },
        });

        timerRef.current = setTimeout(() => {
          pushEvent({
            id: 'evt_3',
            timestamp: now(),
            attemptNumber: 1,
            stage: 'token_refresh',
            title: `Executing OAuth 2.0 Refresh Token Exchange`,
            description: `POST /oauth/v2/token with grant_type=refresh_token to obtain fresh 3600s token.`,
            details: {
              responseBody: {
                access_token: 'pat-na1-fresh-token-9812903123',
                token_type: 'bearer',
                expires_in: 3600,
              },
            },
          });

          timerRef.current = setTimeout(() => {
            setCurrentAttempt(2);
            pushEvent({
              id: 'evt_4',
              timestamp: now(),
              attemptNumber: 2,
              stage: 'dispatch',
              title: `Attempt #2: Re-flight with New Bearer Token`,
              description: `Re-sent payload with fresh authorization header.`,
            });

            timerRef.current = setTimeout(() => {
              pushEvent({
                id: 'evt_5',
                timestamp: now(),
                attemptNumber: 2,
                stage: 'success',
                statusCode: 200,
                title: `HTTP 200 OK: Completed with Zero Lost Webhooks`,
                description: `Seamless token renewal without customer interruption or manual re-authentication.`,
                details: {
                  responseBody: { success: true, updated_contact_id: 'pat_contact_8819' },
                },
              });
              setIsRunning(false);
            }, 600);
          }, 800);
        }, 700);
      } else if (selectedScenario === 'schema_mismatch_422') {
        // 422 Non-transient error -> immediate DLQ
        pushEvent({
          id: 'evt_2',
          timestamp: now(),
          attemptNumber: 1,
          stage: 'error',
          statusCode: 422,
          title: `HTTP 422 Unprocessable Entity: Non-Transient Validation Failure`,
          description: `${softwareB.name} rejected: Field 'properties.email' is missing or malformed.`,
          details: {
            latencyMs: 95,
            responseBody: {
              status: 'error',
              message: 'Validation failed: properties.email is a mandatory unique identifier',
              error_tokens: ['MISSING_MANDATORY_FIELD'],
            },
          },
        });

        timerRef.current = setTimeout(() => {
          pushEvent({
            id: 'evt_3',
            timestamp: now(),
            attemptNumber: 1,
            stage: 'dlq',
            title: `Zero-Retry Rule Enforced → Immediate DLQ Quarantine`,
            description: `Retrying a 422 schema mismatch will never succeed. Payload quarantined to prevent wasted API quotas.`,
            details: {
              responseBody: {
                quarantine_id: 'dlq_422_err_918239',
                reason: 'SCHEMA_VALIDATION_ERROR',
                payload_saved: true,
              },
            },
          });
          setIsRunning(false);
        }, 700);
      } else {
        // 504 Gateway Timeout
        pushEvent({
          id: 'evt_2',
          timestamp: now(),
          attemptNumber: 1,
          stage: 'error',
          statusCode: 504,
          title: `HTTP 504 Gateway Timeout (> 10,000ms Latency Cutoff)`,
          description: `Socket connection closed before ${softwareB.name} acknowledged commit.`,
          details: {
            latencyMs: 10040,
            responseBody: { error: 'Upstream gateway timed out awaiting server response' },
          },
        });

        timerRef.current = setTimeout(() => {
          pushEvent({
            id: 'evt_3',
            timestamp: now(),
            attemptNumber: 1,
            stage: 'backoff',
            title: `Idempotency-Safe Re-dispatch Triggered`,
            description: `Using Idempotency-Key ensures if ${softwareB.name} actually processed the record, no duplicate is created.`,
          });

          timerRef.current = setTimeout(() => {
            setCurrentAttempt(2);
            pushEvent({
              id: 'evt_4',
              timestamp: now(),
              attemptNumber: 2,
              stage: 'success',
              statusCode: 200,
              title: `HTTP 200 OK: Idempotency Match Acknowledged`,
              description: `${softwareB.name} recognized Idempotency-Key and returned existing record without duplication.`,
              details: {
                latencyMs: 110,
                responseBody: { status: 'idempotent_replay_success', duplicate_prevented: true },
              },
            });
            setIsRunning(false);
          }, 800);
        }, 700);
      }
    }, 600);
  };

  const copyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Production implementation code snippets
  const codeTemplates = {
    typescript: `import fetch from 'node-fetch';
import crypto from 'node:crypto';

interface WebhookPayload {
  email: string;
  firstName: string;
  dealSize: number;
}

/**
 * Resilient Webhook Dispatcher with Exponential Backoff + Jitter
 * Handles 429, 503, and Idempotency deduplication
 */
export async function dispatchResilientWebhook(
  url: string,
  payload: WebhookPayload,
  maxRetries = 3
) {
  const idempotencyKey = crypto.randomUUID();
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
          'X-Delivery-Attempt': String(attempt),
        },
        body: JSON.stringify(payload),
        timeout: 10000, // 10s deadline
      });

      // 1. Success
      if (response.ok) {
        return await response.json();
      }

      // 2. Non-retryable client errors (Bad Schema / 422)
      if (response.status === 422 || response.status === 400) {
        throw new Error(\`Fatal Schema Mismatch (Status \${response.status}). Sent to DLQ.\`);
      }

      // 3. Transient rate limit (429) or server outage (503)
      if (response.status === 429 || response.status >= 500) {
        const retryAfterHeader = response.headers.get('retry-after');
        const retryAfterSec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : null;

        // Exponential backoff formula with ±20% full jitter
        const baseDelay = retryAfterSec ? retryAfterSec * 1000 : Math.pow(2, attempt) * 1000;
        const jitter = (Math.random() - 0.5) * 0.4 * baseDelay;
        const totalDelay = Math.max(500, Math.round(baseDelay + jitter));

        console.warn(\`Attempt \${attempt} failed with HTTP \${response.status}. Retrying in \${totalDelay}ms...\`);
        await new Promise((resolve) => setTimeout(resolve, totalDelay));
        continue;
      }

      throw new Error(\`Unexpected HTTP status: \${response.status}\`);
    } catch (err: any) {
      if (attempt >= maxRetries) {
        // Final fallback: Push to Dead Letter Queue
        await routeToDeadLetterQueue(payload, err.message);
        throw err;
      }
    }
  }
}

async function routeToDeadLetterQueue(payload: any, errorReason: string) {
  console.error('[DLQ QUARANTINE] Storing unhandled payload for manual replay:', { payload, errorReason });
}`,
    python: `import time
import uuid
import random
import requests

def dispatch_webhook_with_backoff(target_url, payload, max_retries=3):
    """
    Python webhook client with exponential backoff, jitter, and idempotency headers.
    """
    idempotency_key = str(uuid.uuid4())
    attempt = 0

    while attempt < max_retries:
        attempt += 1
        headers = {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotency_key,
            "X-Delivery-Attempt": str(attempt)
        }

        try:
            response = requests.post(target_url, json=payload, headers=headers, timeout=10.0)

            if response.status_code == 200 or response.status_code == 201:
                return response.json()

            # Non-transient errors: Do not retry 422 / 400
            if response.status_code in [400, 422]:
                raise ValueError(f"Unrecoverable client schema error: {response.text}")

            # Rate limits (429) & Server Downtime (503/504)
            if response.status_code in [429, 502, 503, 504]:
                retry_after = response.headers.get("Retry-After")
                base_delay = int(retry_after) if retry_after else (2 ** attempt)
                jitter = random.uniform(0.8, 1.2)
                sleep_duration = base_delay * jitter
                print(f"[RETRY] HTTP {response.status_code}. Sleeping {sleep_duration:.2f}s before attempt #{attempt + 1}")
                time.sleep(sleep_duration)
                continue

        except requests.exceptions.Timeout:
            print(f"[TIMEOUT] Gateway hung on attempt #{attempt}. Retrying with same Idempotency-Key.")
            time.sleep(2 ** attempt)

    # Route to DLQ if all retries exhausted
    route_to_dlq(payload, "Max retries exceeded")

def route_to_dlq(payload, reason):
    print(f"[DLQ] Writing failed event to AWS SQS Dead Letter Queue: {reason}")
`,
    zapier: `// Zapier Code by JavaScript Step: Automated Retry & Error Routing
const { leadEmail, retryCount = 0 } = inputData;

try {
  const response = await fetch('https://api.${softwareB.slug}.com/v1/contacts', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.BEARER_TOKEN}\`,
      'Content-Type': 'application/json',
      'Idempotency-Key': bundle.authData?.idempotencyKey || bundle.inputDataRaw?.id
    },
    body: JSON.stringify({ email: leadEmail })
  });

  if (response.status === 429) {
    // Return flag to invoke Zapier Autoreplay queue
    output = { status: 'RATE_LIMITED', retry_after: response.headers.get('retry-after') || '30' };
  } else if (!response.ok) {
    // Route to Slack Alerting Path
    output = { status: 'ERROR', code: response.status, body: await response.text() };
  } else {
    output = { status: 'SUCCESS', data: await response.json() };
  }
} catch (err) {
  output = { status: 'NETWORK_FATAL', message: err.message };
}`,
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-100">
                Integration Testing & Failure Simulation Lab
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Live Simulator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Simulate API failures between {softwareA.name} and {softwareB.name}, inspect retry lifecycles, and test backoff policies
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={resetSimulation}
            disabled={isRunning || events.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Play className={`w-4 h-4 fill-slate-950 ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Simulating Lifecycle...' : 'Trigger Failure & Run Retry'}</span>
          </button>
        </div>
      </div>

      {/* Scenario & Strategy Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Scenario Picker */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
            1. Target Failure Scenario ({softwareB.name})
          </label>
          <div className="space-y-2">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                  selectedScenario === sc.id
                    ? 'border-amber-500/50 bg-amber-950/20 text-slate-100'
                    : 'border-slate-800/60 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">[{sc.httpCode}]</span>
                    <span>{sc.label}</span>
                  </span>
                  {selectedScenario === sc.id && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-relaxed pl-12">{sc.cause}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Strategy Picker */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
            2. Active Webhook Retry Strategy ({softwareA.name})
          </label>
          <div className="space-y-2">
            {strategies.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStrategy(st.id);
                  resetSimulation();
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                  selectedStrategy === st.id
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-slate-100'
                    : 'border-slate-800/60 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-200">{st.label}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/30">
                    {st.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{st.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Simulation Pipeline View */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 mb-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Simulation Execution Pipeline
            </span>
            {circuitBreakerState !== 'CLOSED' && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  circuitBreakerState === 'OPEN'
                    ? 'bg-rose-950/50 text-rose-400 border-rose-800/50'
                    : 'bg-amber-950/50 text-amber-400 border-amber-800/50'
                }`}
              >
                Circuit Breaker: {circuitBreakerState}
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-slate-400">
            Current Attempt: <span className="text-emerald-400 font-bold">#{currentAttempt || 0}</span> / 3
          </div>
        </div>

        {events.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
            <Server className="w-10 h-10 text-slate-600 mb-3" />
            <div className="text-sm font-semibold text-slate-300">Simulator Idle</div>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              Select a failure scenario above and click "Trigger Failure & Run Retry" to watch the automated webhook retry lifecycle in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Timeline Stream (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {events.map((evt, idx) => {
                const isSelected = activeLogEvent?.id === evt.id;
                const stageIcons = {
                  dispatch: <ArrowRight className="w-4 h-4 text-sky-400" />,
                  error: <XCircle className="w-4 h-4 text-rose-400" />,
                  backoff: <Clock className="w-4 h-4 text-amber-400" />,
                  token_refresh: <Zap className="w-4 h-4 text-purple-400" />,
                  circuit_trip: <ShieldAlert className="w-4 h-4 text-rose-400" />,
                  dlq: <Database className="w-4 h-4 text-orange-400" />,
                  success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
                }[evt.stage];

                return (
                  <div
                    key={evt.id}
                    onClick={() => setActiveLogEvent(evt)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-slate-900 shadow-md shadow-emerald-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1 rounded-md bg-slate-900 border border-slate-800 shrink-0">
                        {stageIcons}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-100 flex items-center gap-2">
                            {evt.title}
                            {evt.statusCode && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                  evt.statusCode === 200
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : 'bg-rose-950 text-rose-400'
                                }`}
                              >
                                {evt.statusCode}
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{evt.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Request / Response Inspector (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs font-mono uppercase text-slate-400">
                  <span>Packet Inspector</span>
                  <span className="text-emerald-400 font-bold">
                    {activeLogEvent ? `Event: ${activeLogEvent.stage.toUpperCase()}` : 'Select event'}
                  </span>
                </div>

                {activeLogEvent?.details ? (
                  <div className="space-y-3 font-mono text-xs text-slate-300">
                    {activeLogEvent.details.latencyMs && (
                      <div className="flex justify-between text-[11px] pb-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Roundtrip Latency:</span>
                        <span className="text-emerald-400">{activeLogEvent.details.latencyMs} ms</span>
                      </div>
                    )}

                    {activeLogEvent.details.requestHeaders && (
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 mb-1">HTTP Headers</div>
                        <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
                          {JSON.stringify(activeLogEvent.details.requestHeaders, null, 2)}
                        </pre>
                      </div>
                    )}

                    {activeLogEvent.details.responseBody && (
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 mb-1">Payload Envelope</div>
                        <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto max-h-44">
                          {JSON.stringify(activeLogEvent.details.responseBody, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-6 text-center">
                    Click any timeline event on the left to inspect raw network headers and JSON payloads.
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>RFC 7231 HTTP/1.1 Compliant</span>
                <span>StackPipeline Engine</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Production Code Implementation Reference */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">
              Production Implementation Code for {selectedStrategy.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
              <button
                onClick={() => setActiveCodeTab('typescript')}
                className={`px-2.5 py-1 rounded font-mono ${
                  activeCodeTab === 'typescript' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-2.5 py-1 rounded font-mono ${
                  activeCodeTab === 'python' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveCodeTab('zapier')}
                className={`px-2.5 py-1 rounded font-mono ${
                  activeCodeTab === 'zapier' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                Zapier Code
              </button>
            </div>

            <button
              onClick={() => copyCode(codeTemplates[activeCodeTab])}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-64 bg-[#080d1a]">
          <pre>{codeTemplates[activeCodeTab]}</pre>
        </div>
      </div>
    </div>
  );
};
