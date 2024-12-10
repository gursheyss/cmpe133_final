CREATE TABLE `dividends` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`investment_id` text NOT NULL,
	`amount` text NOT NULL,
	`payment_date` integer NOT NULL,
	`reinvested` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`investment_id`) REFERENCES `investments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `dividends_investmentId_idx` ON `dividends` (`investment_id`);--> statement-breakpoint
CREATE INDEX `dividends_paymentDate_idx` ON `dividends` (`payment_date`);--> statement-breakpoint
CREATE TABLE `investments` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`userId` text NOT NULL,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`shares` text NOT NULL,
	`average_cost` text NOT NULL,
	`current_price` text NOT NULL,
	`last_updated` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `investments_userId_idx` ON `investments` (`userId`);--> statement-breakpoint
CREATE INDEX `investments_symbol_idx` ON `investments` (`symbol`);