import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { playersRouter } from "./players";
import { matchesRouter } from "./matches";
import { teamsRouter } from "./teams";

export const appRouter = router({
  computers: computersRouter,
  players: playersRouter,
  matches: matchesRouter,
  teams: teamsRouter,
});

export type AppRouter = typeof appRouter;
