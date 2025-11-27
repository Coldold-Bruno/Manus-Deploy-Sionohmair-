CREATE TABLE `nft_beneficiaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nftSourceId` int NOT NULL,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	`totalContributed` decimal(10,2) NOT NULL DEFAULT '0.00',
	`lastContributionAt` timestamp,
	`contributionStatus` enum('pending','active','completed','exempt') NOT NULL DEFAULT 'pending',
	`gratitudeLevel` enum('none','low','medium','high','exceptional') NOT NULL DEFAULT 'none',
	CONSTRAINT `nft_beneficiaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beneficiaryId` int NOT NULL,
	`nftSourceId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`percentage` decimal(5,2) NOT NULL,
	`reportedRevenue` decimal(10,2) NOT NULL,
	`paymentMethod` enum('stripe','bank_transfer','other') NOT NULL DEFAULT 'stripe',
	`paymentStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nft_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beneficiaryId` int NOT NULL,
	`inquiryType` enum('initial','quarterly','annual','on_demand') NOT NULL DEFAULT 'quarterly',
	`inquiryDate` timestamp NOT NULL DEFAULT (now()),
	`reportedRevenue` decimal(10,2) NOT NULL DEFAULT '0.00',
	`evidenceProvided` text,
	`calculatedContribution` decimal(10,2) NOT NULL DEFAULT '0.00',
	`status` enum('pending','reviewed','approved','disputed') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	CONSTRAINT `nft_inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('formation','resource','template','coaching','other') NOT NULL DEFAULT 'other',
	`initialValue` decimal(10,2) NOT NULL DEFAULT '0.00',
	`currentValue` decimal(10,2) NOT NULL DEFAULT '0.00',
	`totalContributions` decimal(10,2) NOT NULL DEFAULT '0.00',
	`beneficiariesCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nft_sources_id` PRIMARY KEY(`id`)
);
