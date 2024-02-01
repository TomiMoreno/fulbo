CREATE TABLE IF NOT EXISTS "matches" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"play_date" date NOT NULL,
	"player_id" varchar(256) NOT NULL,
	"home_score" integer NOT NULL,
	"away_score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
