import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.mjs";
import { schemas } from "./schema";

export const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, {
  schema: schemas,
});
