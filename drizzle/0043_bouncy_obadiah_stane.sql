CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('trial','paid') NOT NULL DEFAULT 'trial',
	`status` enum('trial','active','trial_expired','cancelled') NOT NULL DEFAULT 'trial',
	`trialStartDate` timestamp NOT NULL DEFAULT (now()),
	`trialEndDate` timestamp NOT NULL,
	`paymentDate` timestamp,
	`activatedAt` timestamp,
	`oneTimePaymentAmount` int NOT NULL DEFAULT 3600,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.578';--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.578';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `filed_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.578';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.578';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.578';--> statement-breakpoint
ALTER TABLE `detection_logs` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.578';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `notified_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `recovery_actions` MODIFY COLUMN `performed_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `submitted_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `declared_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 17:01:42.579';