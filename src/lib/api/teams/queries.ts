import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type TeamId, teamIdSchema, teams } from "@/lib/db/schema/teams";
import {
  teamsToPlayers,
  teamsToPlayersRelations,
} from "@/lib/db/schema/teamsToPlayers";
import { players } from "@/lib/db/schema/players";

export const getTeams = async () => {
  const t = await db.select().from(teams);
  return { teams: t };
};

export const getTeamById = async (id: TeamId) => {
  const { id: teamId } = teamIdSchema.parse({ id });

  const team = await db.query.teams.findFirst({
    with: {
      teamsToPlayers: {
        columns: {},
        with: {
          player: true,
        },
      },
    },
    where: eq(teams.id, teamId),
  });

  return { team };
};
