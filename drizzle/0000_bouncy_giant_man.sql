CREATE TABLE `booking_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`company` text NOT NULL,
	`package_id` text NOT NULL,
	`addons` text NOT NULL,
	`estimate` integer,
	`project_id` text NOT NULL,
	`date_mode` text NOT NULL,
	`date` text NOT NULL,
	`location` text NOT NULL,
	`budget` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `booking_inquiries_reference_unique` ON `booking_inquiries` (`reference`);