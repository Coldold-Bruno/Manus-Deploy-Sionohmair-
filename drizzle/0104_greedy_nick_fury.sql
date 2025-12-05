CREATE TABLE `loyalty_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badge_code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`category` varchar(50) NOT NULL,
	`criteria` text NOT NULL,
	`prestige_points` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyalty_badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyalty_badges_badge_code_unique` UNIQUE(`badge_code`)
);
--> statement-breakpoint
CREATE TABLE `user_loyalty_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`badge_id` int NOT NULL,
	`earned_at` timestamp NOT NULL DEFAULT (now()),
	`notification_sent` boolean NOT NULL DEFAULT false,
	`notification_sent_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_loyalty_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `filed_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `detection_logs` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `notified_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `recovery_actions` MODIFY COLUMN `performed_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.946';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `submitted_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `declared_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 12:20:33.947';