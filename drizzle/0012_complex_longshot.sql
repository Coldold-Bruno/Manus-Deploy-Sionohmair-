CREATE TABLE `email_workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`trigger` enum('manual','new_subscriber','interest_sprint','interest_n3','interest_ia','inactive_30d') NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_workflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`stepOrder` int NOT NULL,
	`delayHours` int NOT NULL DEFAULT 0,
	`templateId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workflow_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`subscriberEmail` varchar(255) NOT NULL,
	`currentStep` int NOT NULL DEFAULT 0,
	`status` enum('active','paused','completed','cancelled') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`lastEmailSentAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `workflow_subscriptions_id` PRIMARY KEY(`id`)
);
