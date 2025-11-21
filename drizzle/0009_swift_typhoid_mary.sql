CREATE TABLE `lead_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadEmail` varchar(320) NOT NULL,
	`userId` int NOT NULL,
	`taskType` enum('call','email','meeting','follow_up','other') NOT NULL DEFAULT 'other',
	`title` varchar(255) NOT NULL,
	`description` text,
	`dueDate` timestamp NOT NULL,
	`status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lead_tasks_id` PRIMARY KEY(`id`)
);
