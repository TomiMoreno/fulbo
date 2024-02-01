CREATE TABLE IF NOT EXISTS "players" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"is_male" boolean NOT NULL,
	"age" integer NOT NULL,
	"height" integer NOT NULL,
	"profile_picture" varchar(256),
	"nickname" varchar(256),
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "players" ("name");