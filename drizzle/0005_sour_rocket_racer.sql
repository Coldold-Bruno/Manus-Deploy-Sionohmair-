ALTER TABLE `subscribers` ADD `interests` enum('diagnostic','formation','transformation','general') DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `lastEmailSent` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `engagementScore` int DEFAULT 0;