import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getTeams } from "@/lib/api/teams/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { teamsToPlayers } from "./teamsToPlayers";

export const teams = pgTable("teams", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  logo: varchar("logo", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const teamRelations = relations(teams, ({ many }) => ({
  teamsToPlayers: many(teamsToPlayers),
}));

// Schema for teams - used to validate API requests
const baseSchema = createSelectSchema(teams).omit(timestamps);

export const insertTeamSchema = createInsertSchema(teams).omit(timestamps);
export const insertTeamParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateTeamSchema = baseSchema;
export const updateTeamParams = baseSchema.extend({});
export const teamIdSchema = baseSchema.pick({ id: true });

// Types for teams - used to type API request params and within Components
export type Team = typeof teams.$inferSelect;
export type NewTeam = z.infer<typeof insertTeamSchema>;
export type NewTeamParams = z.infer<typeof insertTeamParams>;
export type UpdateTeamParams = z.infer<typeof updateTeamParams>;
export type TeamId = z.infer<typeof teamIdSchema>["id"];

// this type infers the return from getTeams() - meaning it will include any joins
export type CompleteTeam = Awaited<
  ReturnType<typeof getTeams>
>["teams"][number];
