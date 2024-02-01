import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type TeamId, teamIdSchema, teams } from "@/lib/db/schema/teams";

export const getTeams = async () => {
  const t = await db.select().from(teams);
  return { teams: t };
};

export const getTeamById = async (id: TeamId) => {
  const { id: teamId } = teamIdSchema.parse({ id });
  const [t] = await db.select().from(teams).where(eq(teams.id, teamId));
  return { team: t };
};

