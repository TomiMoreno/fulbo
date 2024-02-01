import { db } from "@/lib/db/index";
import { matchIdSchema, matches, type MatchId } from "@/lib/db/schema/matches";
import { players } from "@/lib/db/schema/players";
import { eq } from "drizzle-orm";

export const getMatches = async () => {
  const m = await db
    .select({ match: matches, player: players })
    .from(matches)
    .leftJoin(players, eq(matches.playerId, players.id));
  return { matches: m };
};

export const getMatchById = async (id: MatchId) => {
  const { id: matchId } = matchIdSchema.parse({ id });
  const [m] = await db
    .select({ match: matches, player: players })
    .from(matches)
    .where(eq(matches.id, matchId))
    .leftJoin(players, eq(matches.playerId, players.id));
  return { match: m };
};
