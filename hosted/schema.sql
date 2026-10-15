CREATE TABLE IF NOT EXISTS pivot_sandboxes (id TEXT PRIMARY KEY, csrf TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, payload TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS pivot_expiry ON pivot_sandboxes(expires_at);
CREATE TABLE IF NOT EXISTS pivot_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS pivot_ai_jobs (id TEXT PRIMARY KEY, sandbox_id TEXT NOT NULL, run_id TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL, created_at INTEGER NOT NULL, lease_until INTEGER NOT NULL DEFAULT 0, result TEXT);
CREATE INDEX IF NOT EXISTS pivot_ai_pending ON pivot_ai_jobs(status,created_at);
