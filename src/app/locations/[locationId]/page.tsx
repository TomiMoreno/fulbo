import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getLocationById } from "@/lib/api/locations/queries";
import OptimisticLocation from "./OptimisticLocation";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function LocationPage({
  params,
}: {
  params: { locationId: string };
}) {

  return (
    <main className="overflow-auto">
      <Location id={params.locationId} />
    </main>
  );
}

const Location = async ({ id }: { id: string }) => {
  
  const { location } = await getLocationById(id);
  

  if (!location) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <Button asChild variant="ghost">
          <Link href="/locations">
            <ChevronLeftIcon />
          </Link>
        </Button>
        <OptimisticLocation location={location}  />
      </div>
    </Suspense>
  );
};
