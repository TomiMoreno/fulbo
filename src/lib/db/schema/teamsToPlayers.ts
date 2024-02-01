import { relations } from "drizzle-orm";
import { players } from "./players";
import { teams } from "./teams";

import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const teamsToPlayers = pgTable(
  "teams_to_players",
  {
    teamId: varchar("team_id", { length: 191 })
      .references(() => teams.id)
      .notNull(),
    playerId: varchar("player_id", { length: 191 })
      .references(() => players.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.teamId, t.playerId],
    }),
  })
);

export const teamsToPlayersRelations = relations(teamsToPlayers, ({ one }) => ({
  teams: one(teams),
  players: one(players),
}));
