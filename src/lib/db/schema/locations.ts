import { sql } from "drizzle-orm";
import { varchar, text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getLocations } from "@/lib/api/locations/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const locations = pgTable("locations", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  address: varchar("address", { length: 256 }).notNull(),
  link: text("link").notNull(),
  picture: text("picture").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for locations - used to validate API requests
const baseSchema = createSelectSchema(locations).omit(timestamps);

export const insertLocationSchema =
  createInsertSchema(locations).omit(timestamps);
export const insertLocationParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateLocationSchema = baseSchema;
export const updateLocationParams = baseSchema.extend({});
export const locationIdSchema = baseSchema.pick({ id: true });

// Types for locations - used to type API request params and within Components
export type Location = typeof locations.$inferSelect;
export type NewLocation = z.infer<typeof insertLocationSchema>;
export type NewLocationParams = z.infer<typeof insertLocationParams>;
export type UpdateLocationParams = z.infer<typeof updateLocationParams>;
export type LocationId = z.infer<typeof locationIdSchema>["id"];

// this type infers the return from getLocations() - meaning it will include any joins
export type CompleteLocation = Awaited<
  ReturnType<typeof getLocations>
>["locations"][number];
