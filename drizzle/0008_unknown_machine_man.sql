CREATE TABLE `lead_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadEmail` varchar(320) NOT NULL,
	`userId` int NOT NULL,
	`noteType` enum('call','email','meeting','objection','other') NOT NULL DEFAULT 'other',
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lead_notes_id` PRIMARY KEY(`id`)
);
