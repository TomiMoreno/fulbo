import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  TeamId, 
  NewTeamParams,
  UpdateTeamParams, 
  updateTeamSchema,
  insertTeamSchema, 
  teams,
  teamIdSchema 
} from "@/lib/db/schema/teams";

export const createTeam = async (team: NewTeamParams) => {
  const newTeam = insertTeamSchema.parse(team);
  try {
    const [t] =  await db.insert(teams).values(newTeam).returning();
    return { team: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTeam = async (id: TeamId, team: UpdateTeamParams) => {
  const { id: teamId } = teamIdSchema.parse({ id });
  const newTeam = updateTeamSchema.parse(team);
  try {
    const [t] =  await db
     .update(teams)
     .set({...newTeam, updatedAt: new Date() })
     .where(eq(teams.id, teamId!))
     .returning();
    return { team: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteTeam = async (id: TeamId) => {
  const { id: teamId } = teamIdSchema.parse({ id });
  try {
    const [t] =  await db.delete(teams).where(eq(teams.id, teamId!))
    .returning();
    return { team: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

