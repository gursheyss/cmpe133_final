CREATE TABLE `budgets` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`userId` text NOT NULL,
	`category_id` text NOT NULL,
	`amount` text NOT NULL,
	`period` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `budgets_userId_idx` ON `budgets` (`userId`);--> statement-breakpoint
CREATE INDEX `budgets_categoryId_idx` ON `budgets` (`category_id`);--> statement-breakpoint
CREATE INDEX `budgets_date_idx` ON `budgets` (`start_date`,`end_date`);