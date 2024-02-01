import { Suspense } from "react";

import Loading from "@/app/loading";
import PlayerList from "@/components/players/PlayerList";
import { getPlayers } from "@/lib/api/players/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function PlayersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Players</h1>
        </div>
        <Players />
      </div>
    </main>
  );
}

const Players = async () => {
  await checkAuth();

  const { players } = await getPlayers();
  
  return (
    <Suspense fallback={<Loading />}>
      <PlayerList players={players}  />
    </Suspense>
  );
};
