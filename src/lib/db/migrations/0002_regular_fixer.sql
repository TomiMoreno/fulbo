CREATE TABLE IF NOT EXISTS "teams" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"logo" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams_to_players" (
	"team_id" varchar(191) NOT NULL,
	"player_id" varchar(191) NOT NULL,
	CONSTRAINT "teams_to_players_team_id_player_id_pk" PRIMARY KEY("team_id","player_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams_to_players" ADD CONSTRAINT "teams_to_players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams_to_players" ADD CONSTRAINT "teams_to_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
