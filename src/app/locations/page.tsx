import { Suspense } from "react";

import Loading from "@/app/loading";
import LocationList from "@/components/locations/LocationList";
import { getLocations } from "@/lib/api/locations/queries";


export const revalidate = 0;

export default async function LocationsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Locations</h1>
        </div>
        <Locations />
      </div>
    </main>
  );
}

const Locations = async () => {
  
  const { locations } = await getLocations();
  
  return (
    <Suspense fallback={<Loading />}>
      <LocationList locations={locations}  />
    </Suspense>
  );
};
