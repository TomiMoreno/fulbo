
import { type Location, type CompleteLocation } from "@/lib/db/schema/locations";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Location>) => void;

export const useOptimisticLocations = (
  locations: CompleteLocation[],
  
) => {
  const [optimisticLocations, addOptimisticLocation] = useOptimistic(
    locations,
    (
      currentState: CompleteLocation[],
      action: OptimisticAction<Location>,
    ): CompleteLocation[] => {
      const { data } = action;

      

      const optimisticLocation = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticLocation]
            : [...currentState, optimisticLocation];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticLocation } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticLocation, optimisticLocations };
};
