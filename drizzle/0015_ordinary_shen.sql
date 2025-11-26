CREATE TABLE `coach_availability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp NOT NULL,
	`status` enum('available','booked','cancelled') NOT NULL DEFAULT 'available',
	`isRecurring` enum('yes','no') NOT NULL DEFAULT 'no',
	`recurringPattern` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coach_availability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coaching_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`clientPhone` varchar(50),
	`clientTimezone` varchar(100),
	`preferredContactMethod` enum('email','phone','whatsapp') DEFAULT 'email',
	`availabilityId` int,
	`scheduledAt` timestamp NOT NULL,
	`duration` int NOT NULL DEFAULT 60,
	`zoomMeetingId` varchar(255),
	`zoomJoinUrl` varchar(1000),
	`zoomStartUrl` varchar(1000),
	`zoomPassword` varchar(50),
	`status` enum('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
	`preSessionQuestionnaire` json,
	`preSessionCompleted` enum('yes','no') NOT NULL DEFAULT 'no',
	`sessionNotes` text,
	`postSessionSummary` json,
	`clientNotes` text,
	`deliverables` json,
	`reminderSent24h` enum('yes','no') NOT NULL DEFAULT 'no',
	`reminderSent1h` enum('yes','no') NOT NULL DEFAULT 'no',
	`clientRating` int,
	`clientFeedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	`cancelledAt` timestamp,
	`cancellationReason` text,
	CONSTRAINT `coaching_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sprint_deliverables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int NOT NULL,
	`sessionId` int,
	`deliverableType` enum('diagnostic_pfpma','analyse_frictions','facteur_alpha','plan_action','texte_optimise','rapport_final','autre') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`fileUrl` varchar(1000),
	`fileType` varchar(100),
	`fileSize` int,
	`status` enum('pending','in_progress','review','completed') NOT NULL DEFAULT 'pending',
	`version` int NOT NULL DEFAULT 1,
	`previousVersionId` int,
	`clientFeedback` text,
	`revisionRequested` enum('yes','no') NOT NULL DEFAULT 'no',
	`revisionNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `sprint_deliverables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `coaching_sessions` ADD CONSTRAINT `coaching_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coaching_sessions` ADD CONSTRAINT `coaching_sessions_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coaching_sessions` ADD CONSTRAINT `coaching_sessions_availabilityId_coach_availability_id_fk` FOREIGN KEY (`availabilityId`) REFERENCES `coach_availability`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sprint_deliverables` ADD CONSTRAINT `sprint_deliverables_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sprint_deliverables` ADD CONSTRAINT `sprint_deliverables_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sprint_deliverables` ADD CONSTRAINT `sprint_deliverables_sessionId_coaching_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `coaching_sessions`(`id`) ON DELETE no action ON UPDATE no action;