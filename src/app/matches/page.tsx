import MatchList from "@/components/matches/MatchList";
import NewMatchModal from "@/components/matches/MatchModal";
import { api } from "@/lib/trpc/api";

export default async function Matches() {
  const { matches } = await api.matches.getMatches.query();  

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Matches</h1>
        <NewMatchModal />
      </div>
      <MatchList matches={matches} />
    </main>
  );
}
