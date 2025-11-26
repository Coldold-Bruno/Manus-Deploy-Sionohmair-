CREATE TABLE `quote_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceType` enum('visual_graphic','sprint_clarte','formation','automatisation_ia') NOT NULL,
	`serviceTier` enum('starter','intermediate','premium'),
	`name` varchar(255) NOT NULL,
	`description` text,
	`content` json NOT NULL,
	`basePrice` int NOT NULL,
	`isActive` enum('yes','no') NOT NULL DEFAULT 'yes',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320) NOT NULL,
	`clientPhone` varchar(50),
	`serviceType` enum('visual_graphic','sprint_clarte','formation','automatisation_ia') NOT NULL,
	`serviceTier` enum('starter','intermediate','premium'),
	`projectDescription` text NOT NULL,
	`projectDetails` json,
	`basePrice` int NOT NULL,
	`adjustments` json,
	`finalPrice` int NOT NULL,
	`status` enum('pending','sent','accepted','rejected','expired') NOT NULL DEFAULT 'pending',
	`pdfUrl` varchar(1000),
	`pdfGeneratedAt` timestamp,
	`acceptedAt` timestamp,
	`rejectedAt` timestamp,
	`rejectionReason` text,
	`stripePaymentIntentId` varchar(255),
	`paidAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`internalNotes` text,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;