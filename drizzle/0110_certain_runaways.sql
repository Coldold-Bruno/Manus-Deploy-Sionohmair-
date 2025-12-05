CREATE TABLE `customSegments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`criteria` text NOT NULL,
	`logic` enum('AND','OR') NOT NULL DEFAULT 'AND',
	`leadCount` int DEFAULT 0,
	`lastCountUpdate` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customSegments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `filed_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `detection_logs` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `notified_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.026';--> statement-breakpoint
ALTER TABLE `recovery_actions` MODIFY COLUMN `performed_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `submitted_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `declared_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-12-05 14:31:40.027';