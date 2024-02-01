import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getPlayerById } from "@/lib/api/players/queries";
import OptimisticPlayer from "./OptimisticPlayer";
import { checkAuth } from "@/lib/auth/utils";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function PlayerPage({
  params,
}: {
  params: { playerId: string };
}) {

  return (
    <main className="overflow-auto">
      <Player id={params.playerId} />
    </main>
  );
}

const Player = async ({ id }: { id: string }) => {
  await checkAuth();

  const { player } = await getPlayerById(id);
  

  if (!player) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <Button asChild variant="ghost">
          <Link href="/players">
            <ChevronLeftIcon />
          </Link>
        </Button>
        <OptimisticPlayer player={player}  />
      </div>
    </Suspense>
  );
};
