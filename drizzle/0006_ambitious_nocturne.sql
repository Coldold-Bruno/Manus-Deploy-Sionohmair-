CREATE TABLE `lead_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`activityType` varchar(50) NOT NULL,
	`activityData` text,
	`score` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `subscribers` ADD `leadScore` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `leadTemperature` enum('cold','warm','hot') DEFAULT 'cold';