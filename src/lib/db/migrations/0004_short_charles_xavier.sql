ALTER TABLE "matches" ADD COLUMN "home_team_id" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "away_team_id" varchar(256) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
