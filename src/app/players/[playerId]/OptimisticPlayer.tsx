"use client";

import { TAddOptimistic } from "@/app/players/useOptimisticPlayers";
import { type Player } from "@/lib/db/schema/players";
import { cn } from "@/lib/utils";
import { useOptimistic, useState } from "react";

import PlayerForm from "@/components/players/PlayerForm";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";

export default function OptimisticPlayer({ player }: { player: Player }) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Player) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPlayer, setOptimisticPlayer] = useOptimistic(player);
  const updatePlayer: TAddOptimistic = (input) =>
    setOptimisticPlayer({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen} title="Edit Player">
        <PlayerForm
          player={player}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePlayer}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{player.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticPlayer.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticPlayer, null, 2)}
      </pre>
    </div>
  );
}
