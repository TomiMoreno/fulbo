"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/teams/useOptimisticTeams";
import { type Team } from "@/lib/db/schema/teams";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import TeamForm from "@/components/teams/TeamForm";


export default function OptimisticTeam({ 
  team,
   
}: { 
  team: Team; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Team) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticTeam, setOptimisticTeam] = useOptimistic(team);
  const updateTeam: TAddOptimistic = (input) =>
    setOptimisticTeam({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <TeamForm
          team={team}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateTeam}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{team.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticTeam.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticTeam, null, 2)}
      </pre>
    </div>
  );
}
