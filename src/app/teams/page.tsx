import { Suspense } from "react";

import Loading from "@/app/loading";
import TeamList from "@/components/teams/TeamList";
import { getTeams } from "@/lib/api/teams/queries";

export const revalidate = 0;

export default async function TeamsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Teams</h1>
        </div>
        <Teams />
      </div>
    </main>
  );
}

const Teams = async () => {
  const { teams } = await getTeams();

  return (
    <Suspense fallback={<Loading />}>
      <TeamList teams={teams} />
    </Suspense>
  );
};
