"use server";

import { revalidatePath } from "next/cache";
import {
  createLocation,
  deleteLocation,
  updateLocation,
} from "@/lib/api/locations/mutations";
import {
  LocationId,
  NewLocationParams,
  UpdateLocationParams,
  locationIdSchema,
  insertLocationParams,
  updateLocationParams,
} from "@/lib/db/schema/locations";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateLocations = () => revalidatePath("/locations");

export const createLocationAction = async (input: NewLocationParams) => {
  try {
    const payload = insertLocationParams.parse(input);
    await createLocation(payload);
    revalidateLocations();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLocationAction = async (input: UpdateLocationParams) => {
  try {
    const payload = updateLocationParams.parse(input);
    await updateLocation(payload.id, payload);
    revalidateLocations();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLocationAction = async (input: LocationId) => {
  try {
    const payload = locationIdSchema.parse({ id: input });
    await deleteLocation(payload.id);
    revalidateLocations();
  } catch (e) {
    return handleErrors(e);
  }
};