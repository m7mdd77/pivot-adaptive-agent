# Pivot hosted staging

This Sites-supported Vinext checkout is the registered Pivot deployment source. Its new Site identity is stored in `.openai/hosting.json`. It preserves the starter's `sites()` integration and Node compatibility flag. D1 is declared as `DB`; migrations are generated from `db/schema.ts` before local preview.

`lib/` contains allowlisted copies of the shared core and D1 adapter. `public/` contains the same interface and sanitized recorded AI evidence. Live planning jobs are stored in D1 and claimed by the authenticated PC worker. The provider key stays in the existing local environment; it is never deployed to Sites.

Run `npm ci`, `npm run db:generate`, `npm run build`, apply the generated SQL once through Wrangler's local D1 command, then `npm start -- --port 3262`. On Windows, stop a Worker preview before rebuilding and use a writable checkout-local `XDG_CONFIG_HOME` if needed.

Publication uses this Pivot Site identity, source synchronization and exact-version deployment through the current Sites skill. Do not copy either submitted project's Site ID. Do not replay applied migrations. Verify the actual Worker preview/public runtime before claiming hosted functionality.

Hosted sessions expire after seven days. New-session creation reclaims up to 25 expired sandbox rows and 100 expired counters per request. State is capped at 1.5 MB; an oversized mutation fails before the compare-and-swap write, preserving prior state.

The PC worker connects outbound to `/api/ai-worker/claim`, `/ping` and `/complete`, using the secret runtime variable `PIVOT_AI_WORKER_TOKEN`. Jobs have one claim, a 35-second lease and a 40-second request deadline. Late/duplicate results cannot update a run; completed work, current evidence and operator pause are independently rechecked. The public AI control is enabled only while the PC heartbeat is fresh.
