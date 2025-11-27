CREATE TABLE `nft_benefit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`beneficiaryId` int NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`source` varchar(255),
	`metadata` text,
	`processed` boolean NOT NULL DEFAULT false,
	`trackingId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nft_benefit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_royalty_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`alertType` enum('royalty_due','royalty_overdue','benefit_detected','threshold_reached','reminder') NOT NULL,
	`trackingId` int,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`amount` decimal(10,2),
	`isRead` boolean NOT NULL DEFAULT false,
	`actionRequired` boolean NOT NULL DEFAULT false,
	`actionUrl` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nft_royalty_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_royalty_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beneficiaryId` int NOT NULL,
	`sourceId` int NOT NULL,
	`userId` int NOT NULL,
	`eventType` enum('correction_used','benefit_declared','revenue_detected','conversion_tracked','sale_completed','other') NOT NULL,
	`benefitAmount` decimal(10,2) NOT NULL,
	`royaltyPercentage` decimal(5,2) NOT NULL,
	`royaltyAmount` decimal(10,2) NOT NULL,
	`status` enum('pending','notified','paid','overdue','waived') NOT NULL DEFAULT 'pending',
	`notifiedAt` timestamp,
	`paidAt` timestamp,
	`dueDate` timestamp NOT NULL,
	`eventDetails` text,
	`contributionId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nft_royalty_tracking_id` PRIMARY KEY(`id`)
);
