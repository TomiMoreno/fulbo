import { db } from "@/lib/db/index";
import { matchIdSchema, matches, type MatchId } from "@/lib/db/schema/matches";
import { players } from "@/lib/db/schema/players";
import { teams } from "@/lib/db/schema/teams";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const getMatches = async () => {
  const homeTeam = alias(teams, "homeTeam");
  const awayTeam = alias(teams, "awayTeam");
  const m = await db
    .select({ match: matches, player: players, homeTeam, awayTeam })
    .from(matches)
    .leftJoin(players, eq(matches.playerId, players.id))
    .leftJoin(homeTeam, eq(matches.homeTeamId, homeTeam.id))
    .leftJoin(awayTeam, eq(matches.awayTeamId, awayTeam.id));

  return { matches: m };
};

export const getMatchById = async (id: MatchId) => {
  const { id: matchId } = matchIdSchema.parse({ id });
  const homeTeam = alias(teams, "homeTeam");
  const awayTeam = alias(teams, "awayTeam");
  const [m] = await db
    .select({
      match: matches,
      player: players,
      homeTeam: teams,
      awayTeam: teams,
    })
    .from(matches)
    .where(eq(matches.id, matchId))
    .leftJoin(players, eq(matches.playerId, players.id))
    .leftJoin(teams, eq(matches.homeTeamId, homeTeam.id))
    .leftJoin(teams, eq(matches.awayTeamId, awayTeam.id))
    .limit(1);

  return { match: m };
};
