import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type LocationId, locationIdSchema, locations } from "@/lib/db/schema/locations";

export const getLocations = async () => {
  const l = await db.select().from(locations);
  return { locations: l };
};

export const getLocationById = async (id: LocationId) => {
  const { id: locationId } = locationIdSchema.parse({ id });
  const [l] = await db.select().from(locations).where(eq(locations.id, locationId));
  return { location: l };
};

