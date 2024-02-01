import { getTeamById, getTeams } from "@/lib/api/teams/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  teamIdSchema,
  insertTeamParams,
  updateTeamParams,
} from "@/lib/db/schema/teams";
import { createTeam, deleteTeam, updateTeam } from "@/lib/api/teams/mutations";

export const teamsRouter = router({
  getTeams: publicProcedure.query(async () => {
    return getTeams();
  }),
  getTeamById: publicProcedure.input(teamIdSchema).query(async ({ input }) => {
    return getTeamById(input.id);
  }),
  createTeam: publicProcedure
    .input(insertTeamParams)
    .mutation(async ({ input }) => {
      return createTeam(input);
    }),
  updateTeam: publicProcedure
    .input(updateTeamParams)
    .mutation(async ({ input }) => {
      return updateTeam(input.id, input);
    }),
  deleteTeam: publicProcedure
    .input(teamIdSchema)
    .mutation(async ({ input }) => {
      return deleteTeam(input.id);
    }),
});
