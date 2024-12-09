CREATE TABLE `external_accounts` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`userId` text NOT NULL,
	`provider` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`last_four` text,
	`balance` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `external_accounts_userId_idx` ON `external_accounts` (`userId`);--> statement-breakpoint
DROP INDEX `idx_transactions_userId`;--> statement-breakpoint
DROP INDEX `idx_transactions_date`;--> statement-breakpoint
ALTER TABLE `transactions` ADD `account_id` text REFERENCES external_accounts(id);--> statement-breakpoint
ALTER TABLE `transactions` ADD `is_external` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `transactions_userId_idx` ON `transactions` (`userId`);--> statement-breakpoint
CREATE INDEX `transactions_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE INDEX `transactions_accountId_idx` ON `transactions` (`account_id`);--> statement-breakpoint
CREATE INDEX `provider_idx` ON `accounts` (`provider`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `accounts` (`userId`);--> statement-breakpoint
CREATE INDEX `categories_name_idx` ON `categories` (`name`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `token_idx` ON `verificationToken` (`token`);