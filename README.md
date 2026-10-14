# Pivot — The Adaptive Agent

Mission: https://build.doo.ooo/challenges/adaptive-agent

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

## Evidence and architecture

- `npm run compare` writes measured frozen/adaptive comparison metrics to ignored `outputs/comparison-report.json`.
- `node scripts/live-smoke.mjs http://127.0.0.1:3261` checks the actual runtime without paid model calls.
- `node scripts/verify-ai-run.mjs` makes four real paid calls when a local key is configured; do not run it as an ordinary offline test.
- `docs/architecture.md`, `docs/failure-test.md`, `docs/ai-usage.md`, `docs/thesis.md` and `docs/mission-map.md` explain the system and limits.
- `plan/feature-adaptive-agent-1.md` tracks the roadmap. `roadmap.html` is the original planning board, not the product dashboard.

## Hosted staging and release status

`hosted-site/` preserves the current Sites Vinext starter and `sites()` integration, declaring D1 as `DB`. It has built successfully and passed actual local Worker/D1 runtime checks. Its paid model endpoint is disabled. Shared pure modules and a D1 revision comparison serialize effects. It has not been registered, published or submitted to DOO.

Inside `hosted-site/`, run `npm ci`, `npm run build`, apply `drizzle/0000_yummy_loners.sql` once with Wrangler's local D1 command from the staging README, then `npm start -- --port 3262`. For a new public release, follow the current Sites workflow with a new Pivot Site identity. Preserve applied migrations. Do not copy either prior project's Site ID.

The actual continuous walkthrough is at `/walkthrough.mp4` (90.70 seconds, H.264, 584×672, no audio). It was captured from the user-selected Pivot tab on October 14, 2026, then transcoded without cuts. Full decoding and sampled frames verified the stock-loss completion and over-budget refusal. The controls in this recording use the deterministic planner; the genuine DeepSeek evidence was collected separately before capture. See `docs/recording-verification.md`. The local recorder remains at `/record.html` for future captures.

Limits: synthetic supplier sources and effects; no external fulfillment connectors; local demonstration operator; deterministic forecasts without calibrated uncertainty; no external audit anchor. A supplier ETA event affects the unshipped route; post-dispatch external telemetry is outside this version. The frozen-plan baseline is safely blocked when it cannot meet the goal, not allowed to fabricate delivery.
