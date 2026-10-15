# Pivot — The Adaptive Agent

Mission: https://build.doo.ooo/challenges/adaptive-agent

Public demo: https://pivot-adaptive-agent.choggyacc.chatgpt.site

Source repository: https://github.com/m7mdd77/pivot-adaptive-agent

Walkthrough: https://pivot-adaptive-agent.choggyacc.chatgpt.site/walkthrough.mp4

Pivot detects invalidated stock or delivery assumptions and revises a multi-step fulfillment plan without changing its quantity, budget or deadline. Both adaptive and frozen-plan runs use identical initial state, events and action checks. Effects are persistent synthetic inventory/reservation/dispatch records, not real orders or payments.

## Run a clean checkout

Requires Node.js >=24. The local app uses built-in modules and has no third-party runtime dependencies.

```powershell
npm ci
npm run check
npm start
```

Open http://127.0.0.1:3261. Prepare a comparison, change reality, then advance or finish the bounded run. Select Delivery slips to inspect an existing reservation and its explicit cancellation. The expensive-replacement fixture injects an unsafe candidate and shows refusal with zero corresponding effects.

SQLite in ignored `data/` persists sessions, observations, plans and receipts across restarts. Limits include 12 runs/session, 100 accepted events/run, 30 rejected events, 450 trace entries, 3 revisions and 2 compensations. SSE sends committed state and a reconnect snapshot; heartbeats never invoke planning. Recordings are local, bounded and owner-scoped.

## Optional genuine AI

Copy `.env.example` to your ignored `.env`, add your own AgentRouter key and installed supported Claude Code client path, then restart. Keep keys out of browser source, exports, screenshots and Git. The model proposes; independent policy checks; advance applies a separate synthetic effect. No automatic retry, fallback or tools are enabled.

On October 14, 2026, four genuine DeepSeek v4 Flash calls passed two complete adaptive runs, using 3363 reported tokens. Both delivered 12 synthetic kits for $264 at simulated minute 100. The ETA scenario kept its old receipt and explicitly canceled the reservation. Inspect the separately labeled recorded evidence at `/verified-ai-runs.json`. A recorded response is not a fresh provider invocation.

Application allowances are 6 attempts/run, 3000 reserved tokens/attempt, 20 attempts/hour across this process database and a 25-second deadline. Failures count. Reserved tokens and the client's estimated cost limit are not guarantees about actual provider billing.

## Live public AI through this PC

The public Ask DeepSeek control queues a proposal in D1. The authenticated PC worker claims it, invokes the supported client with the existing private environment, and returns a checked proposal. Keep this PC awake and connected. From the project directory, start it with:

```powershell
node --env-file=../decision-engine/.env pc-ai-worker.js
```

The existing local worker token must match the Site’s server-only `PIVOT_AI_WORKER_TOKEN`. Never publish the token or provider key. The worker makes outbound HTTPS requests; no incoming tunnel is required. Readiness expires when its heartbeat stops. A lost or duplicate job is never retried against the model automatically.

On October 15, 2026, two genuine calls from the public Site completed stock-loss and ETA-delay runs, using 1435 reported tokens plus separately reported cache reads. Both delivered 12 kits for $264 at minute 100. The ETA run preserved its original receipt and canceled the prior hold. Sanitized results are in `docs/evidence/public-live-ai.json`.

## Evidence and architecture

- `npm run compare` writes measured frozen/adaptive comparison metrics to ignored `outputs/comparison-report.json`.
- `node scripts/live-smoke.mjs http://127.0.0.1:3261` checks the actual runtime without paid model calls.
- `node scripts/verify-ai-run.mjs` makes four real paid calls when a local key is configured; do not run it as an ordinary offline test.
- `docs/architecture.md`, `docs/failure-test.md`, `docs/ai-usage.md`, `docs/thesis.md` and `docs/mission-map.md` explain the system and limits.
- `plan/feature-adaptive-agent-1.md` tracks the roadmap. `roadmap.html` is the original planning board, not the product dashboard.

## Hosted source and release status

`hosted-site/` preserves the current Sites Vinext starter and `sites()` integration, declaring D1 as `DB`. It has built successfully and passed actual local Worker/D1 runtime checks. Its live model endpoint uses an authenticated outbound worker on the operator’s PC. Shared pure modules and a D1 revision comparison serialize effects. The Pivot Site is registered and publicly deployed. Competition submission is a separate authorized step.

Inside `hosted-site/`, run `npm ci`, `npm run build`, apply each unapplied migration in `drizzle/` once with Wrangler's local D1 command from the staging README, then `npm start -- --port 3262`. For updates, follow the current Sites workflow with the retained Pivot Site identity. Preserve applied migrations. Do not copy either prior project's Site ID.

The actual continuous walkthrough is at `/walkthrough.mp4` (90.70 seconds, H.264, 584×672, no audio). It was captured from the user-selected Pivot tab on October 14, 2026, then transcoded without cuts. Full decoding and sampled frames verified the stock-loss completion and over-budget refusal. The controls in this recording use the deterministic planner; the genuine DeepSeek evidence was collected separately before capture. See `docs/recording-verification.md`. The local recorder remains at `/record.html` for future captures.

Limits: synthetic supplier sources and effects; no external fulfillment connectors; local demonstration operator; deterministic forecasts without calibrated uncertainty; no external audit anchor. A supplier ETA event affects the unshipped route; post-dispatch external telemetry is outside this version. The frozen-plan baseline is safely blocked when it cannot meet the goal, not allowed to fabricate delivery.

Hosted storage caps a serialized session at 1.5 MB and expires sessions after seven days. New-session creation reclaims bounded batches of expired state and counters. Oversized mutations are refused before persistence. All 50 automated tests pass.
