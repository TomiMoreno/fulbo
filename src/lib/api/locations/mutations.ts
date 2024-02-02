import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  LocationId, 
  NewLocationParams,
  UpdateLocationParams, 
  updateLocationSchema,
  insertLocationSchema, 
  locations,
  locationIdSchema 
} from "@/lib/db/schema/locations";

export const createLocation = async (location: NewLocationParams) => {
  const newLocation = insertLocationSchema.parse(location);
  try {
    const [l] =  await db.insert(locations).values(newLocation).returning();
    return { location: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLocation = async (id: LocationId, location: UpdateLocationParams) => {
  const { id: locationId } = locationIdSchema.parse({ id });
  const newLocation = updateLocationSchema.parse(location);
  try {
    const [l] =  await db
     .update(locations)
     .set({...newLocation, updatedAt: new Date() })
     .where(eq(locations.id, locationId!))
     .returning();
    return { location: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLocation = async (id: LocationId) => {
  const { id: locationId } = locationIdSchema.parse({ id });
  try {
    const [l] =  await db.delete(locations).where(eq(locations.id, locationId!))
    .returning();
    return { location: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

