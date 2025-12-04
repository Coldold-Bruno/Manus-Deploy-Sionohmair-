CREATE TABLE `user_quotas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`copyGenerationsUsed` int NOT NULL DEFAULT 0,
	`copyGenerationsLimit` int NOT NULL DEFAULT 5,
	`contentAnalysesUsed` int NOT NULL DEFAULT 0,
	`contentAnalysesLimit` int NOT NULL DEFAULT 10,
	`avatarsCount` int NOT NULL DEFAULT 0,
	`avatarsLimit` int NOT NULL DEFAULT 3,
	`correctionsUsed` int NOT NULL DEFAULT 0,
	`correctionsLimit` int NOT NULL DEFAULT 5,
	`quotesUsed` int NOT NULL DEFAULT 0,
	`quotesLimit` int NOT NULL DEFAULT 5,
	`resetAt` timestamp NOT NULL DEFAULT (now()),
	`isPremium` boolean NOT NULL DEFAULT false,
	`premiumUntil` timestamp,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`stripePriceId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_quotas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `filed_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.838';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.838';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.836';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.836';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.836';--> statement-breakpoint
ALTER TABLE `detection_logs` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `notified_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `recovery_actions` MODIFY COLUMN `performed_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `submitted_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.837';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `declared_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.838';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-04 21:39:27.838';--> statement-breakpoint
ALTER TABLE `user_quotas` ADD CONSTRAINT `user_quotas_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;