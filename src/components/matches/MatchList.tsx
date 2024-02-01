"use client";
import { CompleteMatch } from "@/lib/db/schema/matches";
import { trpc } from "@/lib/trpc/client";
import MatchModal from "./MatchModal";


export default function MatchList({ matches }: { matches: CompleteMatch[] }) {
  const { data: m } = trpc.matches.getMatches.useQuery(undefined, {
    initialData: { matches },
    refetchOnMount: false,
  });

  if (m.matches.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {m.matches.map((match) => (
        <Match match={match} key={match.match.id} />
      ))}
    </ul>
  );
}

const Match = ({ match }: { match: CompleteMatch }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{match.match.playDate.toString()}</div>
      </div>
      <MatchModal match={match.match} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No matches
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new match.
      </p>
      <div className="mt-6">
        <MatchModal emptyState={true} />
      </div>
    </div>
  );
};

