import { getMatchById, getMatches } from "@/lib/api/matches/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  matchIdSchema,
  insertMatchParams,
  updateMatchParams,
} from "@/lib/db/schema/matches";
import {
  createMatch,
  deleteMatch,
  updateMatch,
} from "@/lib/api/matches/mutations";

export const matchesRouter = router({
  getMatches: publicProcedure.query(async () => {
    return getMatches();
  }),
  getMatchById: publicProcedure
    .input(matchIdSchema)
    .query(async ({ input }) => {
      return getMatchById(input.id);
    }),
  createMatch: publicProcedure
    .input(insertMatchParams)
    .mutation(async ({ input }) => {
      return createMatch(input);
    }),
  updateMatch: publicProcedure
    .input(updateMatchParams)
    .mutation(async ({ input }) => {
      return updateMatch(input.id, input);
    }),
  deleteMatch: publicProcedure
    .input(matchIdSchema)
    .mutation(async ({ input }) => {
      return deleteMatch(input.id);
    }),
});
