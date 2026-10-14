# Pivot hosted staging

This Sites-supported Vinext checkout is a local staging build; no Site has been created or published. It preserves the starter's `sites()` integration and Node compatibility flag. D1 is declared as `DB`; migrations are generated from `db/schema.ts` before local preview.

`lib/` contains allowlisted copies of the shared core and D1 adapter. `public/` contains the same interface and sanitized recorded AI evidence. No paid inference endpoint is enabled here.

Run `npm ci`, `npm run db:generate`, `npm run build`, apply the generated SQL once through Wrangler's local D1 command, then `npm start -- --port 3262`. On Windows, stop a Worker preview before rebuilding and use a writable checkout-local `XDG_CONFIG_HOME` if needed.

Publication needs a new Site identity for Pivot, source synchronization and exact-version deployment through the current Sites skill. Do not copy either submitted project's Site ID. Do not replay applied migrations. Verify the actual Worker preview/public runtime before claiming hosted functionality.
