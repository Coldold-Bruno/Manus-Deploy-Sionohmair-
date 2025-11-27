CREATE TABLE `correction_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`contentType` enum('text','financial','website','document','other') NOT NULL,
	`description` text,
	`systemPrompt` text NOT NULL,
	`instructions` text,
	`evaluationCriteria` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `correction_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `corrections_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentType` enum('text','financial','website','document','other') NOT NULL DEFAULT 'text',
	`title` varchar(255) NOT NULL,
	`originalContent` text NOT NULL,
	`correctedContent` text NOT NULL,
	`scoreBefore` int NOT NULL,
	`scoreAfter` int NOT NULL,
	`frictions` text NOT NULL,
	`recommendations` text NOT NULL,
	`specificAnalysis` text,
	`nftBeneficiaryId` int,
	`status` enum('draft','completed','exported') NOT NULL DEFAULT 'completed',
	`wasUsed` boolean NOT NULL DEFAULT false,
	`declaredBenefit` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `corrections_history_id` PRIMARY KEY(`id`)
);
