import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import {
  MatchId,
  NewMatchParams,
  UpdateMatchParams,
  updateMatchSchema,
  insertMatchSchema,
  matches,
  matchIdSchema,
} from "@/lib/db/schema/matches";

export const createMatch = async (match: NewMatchParams) => {
  const newMatch = insertMatchSchema.parse(match);
  try {
    const [m] = await db.insert(matches).values(newMatch).returning();
    return { match: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateMatch = async (id: MatchId, match: UpdateMatchParams) => {
  const { id: matchId } = matchIdSchema.parse({ id });
  const newMatch = updateMatchSchema.parse(match);
  try {
    const [m] = await db
      .update(matches)
      .set({ ...newMatch, updatedAt: new Date() })
      .where(eq(matches.id, matchId!))
      .returning();
    return { match: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteMatch = async (id: MatchId) => {
  const { id: matchId } = matchIdSchema.parse({ id });
  try {
    const [m] = await db
      .delete(matches)
      .where(eq(matches.id, matchId!))
      .returning();
    return { match: m };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
