CREATE TABLE `pivot_ai_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`sandbox_id` text NOT NULL,
	`run_id` text NOT NULL,
	`payload` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`lease_until` integer DEFAULT 0 NOT NULL,
	`result` text
);
--> statement-breakpoint
CREATE INDEX `pivot_ai_pending` ON `pivot_ai_jobs` (`status`,`created_at`);