CREATE TABLE `ab_test_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`subscriberEmail` varchar(320) NOT NULL,
	`variant` enum('A','B') NOT NULL,
	`opened` boolean NOT NULL DEFAULT false,
	`clicked` boolean NOT NULL DEFAULT false,
	`openedAt` timestamp,
	`clickedAt` timestamp,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ab_test_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ab_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`variantA` varchar(255) NOT NULL,
	`variantB` varchar(255) NOT NULL,
	`emailContent` text NOT NULL,
	`status` enum('draft','running','completed') NOT NULL DEFAULT 'draft',
	`startDate` timestamp,
	`endDate` timestamp,
	`winnerVariant` enum('A','B'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ab_tests_id` PRIMARY KEY(`id`)
);
