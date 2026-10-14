# AI use and limits

OpenAI Codex assisted implementation, tests, documentation and the UI. The optional local planner uses DeepSeek v4 Flash through the genuine supported AgentRouter Claude Code client with tools/MCP disabled. Model output is a structured proposal and a concise explanation, never trusted authority or automatic execution.

On October 14, 2026, `scripts/verify-ai-run.mjs` verified stock loss and ETA delay with two genuine model calls each. Reported tokens: stock run 1604; ETA run 1759; total 3363. Both preserved the goal, changed from A to B, delivered 12 synthetic kits at minute 100 for $264, and retained valid audit chains. The ETA run explicitly canceled the prior reservation. These are recorded results, not a prediction of future provider availability.

Limits: six attempts/run with 3000 reserved tokens each, persistent 20-attempt/hour process database allowance, bounded input/output and a 25-second application deadline. Failures count. The client has an estimated cost limit, but provider billing and reservation tokens can differ; no dollar-spending guarantee is made. No retries or fallback occur automatically.

Public hosting contains no key, executable client, private SQLite database or client configuration. It uses deterministic synthetic scenarios and may display separately labeled recorded AI evidence. Live model requests remain local. Provider key is read from the private server environment; it was not copied into this project.
