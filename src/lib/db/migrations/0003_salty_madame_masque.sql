CREATE TABLE IF NOT EXISTS "locations" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"address" varchar(256) NOT NULL,
	"link" text NOT NULL,
	"picture" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
