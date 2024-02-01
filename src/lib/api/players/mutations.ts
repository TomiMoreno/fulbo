import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  PlayerId, 
  NewPlayerParams,
  UpdatePlayerParams, 
  updatePlayerSchema,
  insertPlayerSchema, 
  players,
  playerIdSchema 
} from "@/lib/db/schema/players";
import { getUserAuth } from "@/lib/auth/utils";

export const createPlayer = async (player: NewPlayerParams) => {
  const { session } = await getUserAuth();
  const newPlayer = insertPlayerSchema.parse({ ...player, userId: session?.user.id! });
  try {
    const [p] =  await db.insert(players).values(newPlayer).returning();
    return { player: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updatePlayer = async (id: PlayerId, player: UpdatePlayerParams) => {
  const { session } = await getUserAuth();
  const { id: playerId } = playerIdSchema.parse({ id });
  const newPlayer = updatePlayerSchema.parse({ ...player, userId: session?.user.id! });
  try {
    const [p] =  await db
     .update(players)
     .set({...newPlayer, updatedAt: new Date() })
     .where(and(eq(players.id, playerId!), eq(players.userId, session?.user.id!)))
     .returning();
    return { player: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deletePlayer = async (id: PlayerId) => {
  const { session } = await getUserAuth();
  const { id: playerId } = playerIdSchema.parse({ id });
  try {
    const [p] =  await db.delete(players).where(and(eq(players.id, playerId!), eq(players.userId, session?.user.id!)))
    .returning();
    return { player: p };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

