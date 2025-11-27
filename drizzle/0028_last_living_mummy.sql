CREATE TABLE `client_avatars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int,
	`gender` varchar(50),
	`location` varchar(255),
	`occupation` varchar(255),
	`income` varchar(100),
	`education` varchar(255),
	`goals` json,
	`challenges` json,
	`pain_points` json,
	`desires` json,
	`fears` json,
	`values` json,
	`buying_behavior` json,
	`media_consumption` json,
	`preferred_tone` varchar(100),
	`key_messages` json,
	`avoid_topics` json,
	`created_at` datetime NOT NULL,
	`updated_at` datetime,
	CONSTRAINT `client_avatars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(500),
	`content` text NOT NULL,
	`content_type` varchar(50) NOT NULL,
	`url` varchar(1000),
	`seo_score` int,
	`conversion_score` int,
	`engagement_score` int,
	`readability_score` int,
	`psychology_score` int,
	`overall_score` int,
	`seo_analysis` json,
	`conversion_analysis` json,
	`engagement_analysis` json,
	`readability_analysis` json,
	`psychology_analysis` json,
	`suggestions` json,
	`created_at` datetime NOT NULL,
	`updated_at` datetime,
	CONSTRAINT `content_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `copywriting_frameworks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`acronym` varchar(50) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`structure` json,
	`best_for` json,
	`not_for` json,
	`examples` json,
	`usage_count` int DEFAULT 0,
	`created_at` datetime NOT NULL,
	CONSTRAINT `copywriting_frameworks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generated_copies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`framework_id` int,
	`avatar_id` int,
	`content_type` varchar(50) NOT NULL,
	`brief` text NOT NULL,
	`keywords` json,
	`tone` varchar(100),
	`length` varchar(50),
	`generated_content` text NOT NULL,
	`variants` json,
	`quality_score` int,
	`persuasion_score` int,
	`used` boolean DEFAULT false,
	`used_at` datetime,
	`created_at` datetime NOT NULL,
	`updated_at` datetime,
	CONSTRAINT `generated_copies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketing_funnels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`stages` json,
	`total_visitors` int DEFAULT 0,
	`total_conversions` int DEFAULT 0,
	`conversion_rate` decimal(5,2),
	`avg_revenue` decimal(10,2),
	`bottlenecks` json,
	`optimizations` json,
	`created_at` datetime NOT NULL,
	`updated_at` datetime,
	CONSTRAINT `marketing_funnels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `api_integrations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `filed_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.131';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.131';--> statement-breakpoint
ALTER TABLE `arbitration_cases` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.131';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.131';--> statement-breakpoint
ALTER TABLE `arbitrators` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.131';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `benefit_indices` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `detection_logs` MODIFY COLUMN `detected_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `notified_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `presumed_royalties` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `recovery_actions` MODIFY COLUMN `performed_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `submitted_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `royalty_contestations` MODIFY COLUMN `updated_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.130';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `declared_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.131';--> statement-breakpoint
ALTER TABLE `voluntary_declarations` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-11-27 15:13:56.131';