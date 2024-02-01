import { getPlayerById, getPlayers } from "@/lib/api/players/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  playerIdSchema,
  insertPlayerParams,
  updatePlayerParams,
} from "@/lib/db/schema/players";
import { createPlayer, deletePlayer, updatePlayer } from "@/lib/api/players/mutations";

export const playersRouter = router({
  getPlayers: publicProcedure.query(async () => {
    return getPlayers();
  }),
  getPlayerById: publicProcedure.input(playerIdSchema).query(async ({ input }) => {
    return getPlayerById(input.id);
  }),
  createPlayer: publicProcedure
    .input(insertPlayerParams)
    .mutation(async ({ input }) => {
      return createPlayer(input);
    }),
  updatePlayer: publicProcedure
    .input(updatePlayerParams)
    .mutation(async ({ input }) => {
      return updatePlayer(input.id, input);
    }),
  deletePlayer: publicProcedure
    .input(playerIdSchema)
    .mutation(async ({ input }) => {
      return deletePlayer(input.id);
    }),
});
