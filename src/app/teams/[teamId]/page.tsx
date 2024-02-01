import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getTeamById } from "@/lib/api/teams/queries";
import OptimisticTeam from "./OptimisticTeam";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function TeamPage({
  params,
}: {
  params: { teamId: string };
}) {

  return (
    <main className="overflow-auto">
      <Team id={params.teamId} />
    </main>
  );
}

const Team = async ({ id }: { id: string }) => {
  
  const { team } = await getTeamById(id);
  

  if (!team) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <Button asChild variant="ghost">
          <Link href="/teams">
            <ChevronLeftIcon />
          </Link>
        </Button>
        <OptimisticTeam team={team}  />
      </div>
    </Suspense>
  );
};
