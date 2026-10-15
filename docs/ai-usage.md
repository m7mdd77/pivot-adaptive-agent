# AI use and limits

OpenAI Codex assisted implementation, tests, documentation and the UI. The explicit planner uses DeepSeek v4 Flash through the genuine supported AgentRouter Claude Code client with tools/MCP disabled. Model output is a structured proposal and a concise explanation, never trusted authority or automatic execution.

On October 14, 2026, `scripts/verify-ai-run.mjs` verified stock loss and ETA delay with two genuine model calls each. Reported tokens: stock run 1604; ETA run 1759; total 3363. Both preserved the goal, changed from A to B, delivered 12 synthetic kits at minute 100 for $264, and retained valid audit chains. The ETA run explicitly canceled the prior reservation. These are recorded results, not a prediction of future provider availability.

Limits: six attempts/run with 3000 reserved tokens each, persistent 20-attempt/hour process database allowance, bounded input/output and a 25-second application deadline. Failures count. The client has an estimated cost limit, but provider billing and reservation tokens can differ; no dollar-spending guarantee is made. No retries or fallback occur automatically.

The public Site supports live proposals through an authenticated D1 job queue and an outbound PC worker. The provider key, executable client, private SQLite budget and client configuration remain on this PC. Sites stores only its worker service secret. A fresh heartbeat enables the control; the PC must stay awake and connected. One claim per job, a 35-second lease and independent context/pause validation prevent replay or automatic effects.

On October 15, two genuine public requests completed stock-loss and ETA-delay scenarios using 600 and 835 reported tokens respectively, with cache reads reported separately. Both delivered 12 kits for $264 at minute 100; the ETA case retained and canceled the previous reservation. See `docs/evidence/public-live-ai.json`.
