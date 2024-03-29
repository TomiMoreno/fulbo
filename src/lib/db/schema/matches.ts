import { type getMatches } from "@/lib/api/matches/queries";
import { relations, sql } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { players } from "./players";

import { nanoid, timestamps } from "@/lib/utils";
import { teams } from "./teams";

export const matches = pgTable("matches", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  playDate: date("play_date").notNull(),
  playerId: varchar("player_id", { length: 256 })
    .references(() => players.id)
    .notNull(),
  homeScore: integer("home_score").notNull(),
  awayScore: integer("away_score").notNull(),
  homeTeamId: varchar("home_team_id", { length: 256 })
    .references(() => teams.id)
    .notNull(),
  awayTeamId: varchar("away_team_id", { length: 256 })
    .references(() => teams.id)
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const matchesRelations = relations(matches, ({ one }) => ({
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: "home_team",
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: "away_team",
  }),
  organizer: one(players, {
    fields: [matches.playerId],
    references: [players.id],
  }),
}));

const baseSchema = createSelectSchema(matches).omit(timestamps);

export const insertMatchSchema = createInsertSchema(matches).omit(timestamps);
export const insertMatchParams = baseSchema
  .extend({
    playDate: z.coerce.string().min(1),
    playerId: z.coerce.string().min(1),
    homeScore: z.coerce.number(),
    awayScore: z.coerce.number(),
  })
  .omit({
    id: true,
  });

export const updateMatchSchema = baseSchema;
export const updateMatchParams = baseSchema.extend({
  playDate: z.coerce.string().min(1),
  playerId: z.coerce.string().min(1),
  homeScore: z.coerce.number(),
  awayScore: z.coerce.number(),
});
export const matchIdSchema = baseSchema.pick({ id: true });

// Types for matches - used to type API request params and within Components
export type Match = typeof matches.$inferSelect;
export type NewMatch = z.infer<typeof insertMatchSchema>;
export type NewMatchParams = z.infer<typeof insertMatchParams>;
export type UpdateMatchParams = z.infer<typeof updateMatchParams>;
export type MatchId = z.infer<typeof matchIdSchema>["id"];

// this type infers the return from getMatches() - meaning it will include any joins
export type CompleteMatch = Awaited<
  ReturnType<typeof getMatches>
>["matches"][number];
