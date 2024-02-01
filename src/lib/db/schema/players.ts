import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getPlayers } from "@/lib/api/players/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { teamsToPlayers } from "./teamsToPlayers";

export const players = pgTable(
  "players",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    isMale: boolean("is_male").notNull(),
    age: integer("age").notNull(),
    height: integer("height").notNull(),
    profilePicture: varchar("profile_picture", { length: 256 }),
    nickname: varchar("nickname", { length: 256 }),
    userId: varchar("user_id", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`now()`),
  },
  (players) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(players.name),
    };
  }
);

export const playersRelations = relations(players, ({ many }) => ({
  teamsToPlayers: many(teamsToPlayers),
}));

// Schema for players - used to validate API requests
const baseSchema = createSelectSchema(players).omit(timestamps);

export const insertPlayerSchema = createInsertSchema(players).omit(timestamps);
export const insertPlayerParams = baseSchema
  .extend({
    isMale: z.coerce.boolean(),
    age: z.coerce.number(),
    height: z.coerce.number(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updatePlayerSchema = baseSchema;
export const updatePlayerParams = baseSchema
  .extend({
    isMale: z.coerce.boolean(),
    age: z.coerce.number(),
    height: z.coerce.number(),
  })
  .omit({
    userId: true,
  });
export const playerIdSchema = baseSchema.pick({ id: true });

// Types for players - used to type API request params and within Components
export type Player = typeof players.$inferSelect;
export type NewPlayer = z.infer<typeof insertPlayerSchema>;
export type NewPlayerParams = z.infer<typeof insertPlayerParams>;
export type UpdatePlayerParams = z.infer<typeof updatePlayerParams>;
export type PlayerId = z.infer<typeof playerIdSchema>["id"];

// this type infers the return from getPlayers() - meaning it will include any joins
export type CompletePlayer = Awaited<
  ReturnType<typeof getPlayers>
>["players"][number];
