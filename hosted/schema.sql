CREATE TABLE IF NOT EXISTS pivot_sandboxes (id TEXT PRIMARY KEY, csrf TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, payload TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS pivot_expiry ON pivot_sandboxes(expires_at);
CREATE TABLE IF NOT EXISTS pivot_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
