CREATE TABLE `api_integrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`platform` varchar(50) NOT NULL,
	`integration_name` varchar(255) NOT NULL,
	`api_key` text,
	`api_secret` text,
	`access_token` text,
	`refresh_token` text,
	`config` text,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`last_sync_at` datetime,
	`last_error` text,
	`consent_given` boolean NOT NULL DEFAULT false,
	`consent_date` datetime,
	`created_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`updated_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	CONSTRAINT `api_integrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `arbitration_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contestation_id` int NOT NULL,
	`presumed_royalty_id` int NOT NULL,
	`user_id` int NOT NULL,
	`arbitrator1_id` int,
	`arbitrator2_id` int,
	`arbitrator3_id` int,
	`filed_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`sionohmair_response_at` datetime,
	`hearing_date` datetime,
	`sentence_date` datetime,
	`claimant_documents` text,
	`respondent_documents` text,
	`arbitrators_notes` text,
	`sentence_text` text,
	`sentence_amount` decimal(10,2),
	`sentence_type` varchar(50),
	`total_fees` decimal(10,2) NOT NULL DEFAULT '600.00',
	`claimant_fees_share` decimal(5,2),
	`status` varchar(20) NOT NULL DEFAULT 'filed',
	`created_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`updated_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	CONSTRAINT `arbitration_cases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `arbitrators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`title` varchar(255),
	`specialization` varchar(255),
	`bio` text,
	`arbitrator_type` varchar(20) NOT NULL,
	`is_available` boolean NOT NULL DEFAULT true,
	`cases_handled` int NOT NULL DEFAULT 0,
	`average_resolution_days` int,
	`created_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.198',
	`updated_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.198',
	CONSTRAINT `arbitrators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `benefit_indices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beneficiary_id` int NOT NULL,
	`source_id` int NOT NULL,
	`user_id` int NOT NULL,
	`indice_type` varchar(50) NOT NULL,
	`indice_category` varchar(50) NOT NULL,
	`indice_name` varchar(255) NOT NULL,
	`indice_description` text,
	`indice_source` varchar(255),
	`indice_data` text,
	`confidence_score` decimal(3,2) NOT NULL,
	`presumed_benefit` decimal(10,2) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'detected',
	`validated_at` datetime,
	`validated_by` int,
	`detected_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`created_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`updated_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	CONSTRAINT `benefit_indices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `detection_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`integration_id` int,
	`detection_method` varchar(50) NOT NULL,
	`detection_source` varchar(255),
	`indices_found` int NOT NULL DEFAULT 0,
	`benefits_detected` decimal(10,2) NOT NULL DEFAULT '0.00',
	`raw_data` text,
	`detected_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	CONSTRAINT `detection_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presumed_royalties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beneficiary_id` int NOT NULL,
	`source_id` int NOT NULL,
	`user_id` int NOT NULL,
	`presumed_benefit` decimal(10,2) NOT NULL,
	`royalty_rate` decimal(5,2) NOT NULL,
	`confidence_coefficient` decimal(3,2) NOT NULL,
	`presumed_royalty_amount` decimal(10,2) NOT NULL,
	`indice_ids` text,
	`indices_summary` text,
	`recovery_status` varchar(20) NOT NULL DEFAULT 'notified',
	`notified_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`reminded_at` datetime,
	`formal_notice_at` datetime,
	`due_date` datetime NOT NULL,
	`paid_at` datetime,
	`paid_amount` decimal(10,2),
	`payment_method` varchar(50),
	`transaction_id` varchar(255),
	`created_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`updated_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	CONSTRAINT `presumed_royalties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recovery_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`presumed_royalty_id` int NOT NULL,
	`user_id` int NOT NULL,
	`action_type` varchar(50) NOT NULL,
	`action_description` text,
	`action_result` varchar(50),
	`performed_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`performed_by` int,
	CONSTRAINT `recovery_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `royalty_contestations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`presumed_royalty_id` int NOT NULL,
	`user_id` int NOT NULL,
	`contestation_type` varchar(50) NOT NULL,
	`contestation_motif` varchar(100) NOT NULL,
	`arguments` text NOT NULL,
	`supporting_documents` text,
	`proposed_amount` decimal(10,2),
	`proposed_justification` text,
	`status` varchar(20) NOT NULL DEFAULT 'submitted',
	`sionohmair_response` text,
	`sionohmair_proposed_amount` decimal(10,2),
	`responded_at` datetime,
	`final_amount` decimal(10,2),
	`resolution_method` varchar(50),
	`resolved_at` datetime,
	`submitted_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	`updated_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.197',
	CONSTRAINT `royalty_contestations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voluntary_declarations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beneficiary_id` int NOT NULL,
	`source_id` int NOT NULL,
	`user_id` int NOT NULL,
	`declared_benefit` decimal(10,2) NOT NULL,
	`benefit_period` varchar(50),
	`benefit_description` text,
	`royalty_rate` decimal(5,2) NOT NULL,
	`royalty_amount` decimal(10,2) NOT NULL,
	`bonus_applied` boolean NOT NULL DEFAULT false,
	`bonus_percentage` decimal(5,2) DEFAULT '10.00',
	`final_amount` decimal(10,2) NOT NULL,
	`is_paid` boolean NOT NULL DEFAULT false,
	`paid_at` datetime,
	`payment_method` varchar(50),
	`transaction_id` varchar(255),
	`declared_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.198',
	`created_at` datetime NOT NULL DEFAULT '2025-11-27 13:47:16.198',
	CONSTRAINT `voluntary_declarations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `api_integrations` (`user_id`);--> statement-breakpoint
CREATE INDEX `platform_idx` ON `api_integrations` (`platform`);--> statement-breakpoint
CREATE INDEX `contestation_idx` ON `arbitration_cases` (`contestation_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `arbitration_cases` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `arbitration_cases` (`status`);--> statement-breakpoint
CREATE INDEX `beneficiary_idx` ON `benefit_indices` (`beneficiary_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `benefit_indices` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `benefit_indices` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `detection_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `detected_at_idx` ON `detection_logs` (`detected_at`);--> statement-breakpoint
CREATE INDEX `beneficiary_idx` ON `presumed_royalties` (`beneficiary_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `presumed_royalties` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `presumed_royalties` (`recovery_status`);--> statement-breakpoint
CREATE INDEX `due_date_idx` ON `presumed_royalties` (`due_date`);--> statement-breakpoint
CREATE INDEX `royalty_idx` ON `recovery_actions` (`presumed_royalty_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `recovery_actions` (`user_id`);--> statement-breakpoint
CREATE INDEX `royalty_idx` ON `royalty_contestations` (`presumed_royalty_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `royalty_contestations` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `royalty_contestations` (`status`);--> statement-breakpoint
CREATE INDEX `beneficiary_idx` ON `voluntary_declarations` (`beneficiary_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `voluntary_declarations` (`user_id`);