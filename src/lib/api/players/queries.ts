import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import {
  playerIdSchema,
  players,
  type PlayerId,
} from "@/lib/db/schema/players";
import { and, eq } from "drizzle-orm";

export const getPlayers = async () => {
  const p = await db.select().from(players);
  return { players: p };
};

export const getPlayerById = async (id: PlayerId) => {
  const { session } = await getUserAuth();
  const { id: playerId } = playerIdSchema.parse({ id });
  const [p] = await db
    .select()
    .from(players)
    .where(
      and(eq(players.id, playerId), eq(players.userId, session?.user.id!))
    );
  return { player: p };
};
