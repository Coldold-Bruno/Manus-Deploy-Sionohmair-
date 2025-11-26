CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`formationAccessId` int NOT NULL,
	`badgeType` varchar(50) NOT NULL,
	`badgeName` varchar(255) NOT NULL,
	`badgeDescription` text NOT NULL,
	`badgeIcon` varchar(50) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercise_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleProgressId` int NOT NULL,
	`moduleNumber` int NOT NULL,
	`exerciseNumber` int NOT NULL,
	`exerciseTitle` varchar(255) NOT NULL,
	`userAnswer` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`score` int NOT NULL,
	`feedback` text NOT NULL,
	`attemptNumber` int NOT NULL DEFAULT 1,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercise_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `formation_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int NOT NULL,
	`purchaseDate` timestamp NOT NULL DEFAULT (now()),
	`accessStartDate` timestamp NOT NULL DEFAULT (now()),
	`accessEndDate` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`completedModules` int NOT NULL DEFAULT 0,
	`totalExercisesCompleted` int NOT NULL DEFAULT 0,
	`overallScore` int NOT NULL DEFAULT 0,
	`lastAccessDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `formation_access_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`formationAccessId` int NOT NULL,
	`moduleNumber` int NOT NULL,
	`moduleName` varchar(255) NOT NULL,
	`isUnlocked` boolean NOT NULL DEFAULT false,
	`isStarted` boolean NOT NULL DEFAULT false,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`completedExercises` int NOT NULL DEFAULT 0,
	`moduleScore` int NOT NULL DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `module_progress_id` PRIMARY KEY(`id`)
);
