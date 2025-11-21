CREATE TABLE `email_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('welcome','resource','promotion','reactivation','newsletter') NOT NULL,
	`subject` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`variables` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_templates_id` PRIMARY KEY(`id`)
);
