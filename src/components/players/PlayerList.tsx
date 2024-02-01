"use client";

import Link from "next/link";
import { useState } from "react";

import Modal from "@/components/shared/Modal";
import { CompletePlayer, type Player } from "@/lib/db/schema/players";
import { cn } from "@/lib/utils";

import { useOptimisticPlayers } from "@/app/players/useOptimisticPlayers";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import PlayerForm from "./PlayerForm";

type TOpenModal = (player?: Player) => void;

export default function PlayerList({ players }: { players: CompletePlayer[] }) {
  const { optimisticPlayers, addOptimisticPlayer } =
    useOptimisticPlayers(players);
  const [open, setOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const openModal = (player?: Player) => {
    setOpen(true);
    player ? setActivePlayer(player) : setActivePlayer(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePlayer ? "Edit Player" : "Create Players"}
      >
        <PlayerForm
          player={activePlayer}
          addOptimistic={addOptimisticPlayer}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticPlayers.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPlayers.map((player) => (
            <Player player={player} key={player.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Player = ({
  player,
  openModal,
}: {
  player: CompletePlayer;
  openModal: TOpenModal;
}) => {
  const optimistic = player.id === "optimistic";
  const deleting = player.id === "delete";
  const mutating = optimistic || deleting;
  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{player.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={"/players/" + player.id}>View details</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No players
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new player.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Players{" "}
        </Button>
      </div>
    </div>
  );
};
