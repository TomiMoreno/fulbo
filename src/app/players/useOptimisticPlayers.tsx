import { type CompletePlayer, type Player } from "@/lib/db/schema/players";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Player>) => void;

export const useOptimisticPlayers = (players: CompletePlayer[]) => {
  const [optimisticPlayers, addOptimisticPlayer] = useOptimistic(
    players,
    (
      currentState: CompletePlayer[],
      action: OptimisticAction<Player>
    ): CompletePlayer[] => {
      const { data } = action;

      const optimisticPlayer = {
        ...data,

        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticPlayer]
            : [...currentState, optimisticPlayer];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticPlayer } : item
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item
          );
        default:
          return currentState;
      }
    }
  );

  return { addOptimisticPlayer, optimisticPlayers };
};
