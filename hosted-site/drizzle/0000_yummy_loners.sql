CREATE TABLE `pivot_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pivot_sandboxes` (
	`id` text PRIMARY KEY NOT NULL,
	`csrf` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pivot_expiry` ON `pivot_sandboxes` (`expires_at`);