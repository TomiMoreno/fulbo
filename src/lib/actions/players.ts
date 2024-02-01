"use server";

import { revalidatePath } from "next/cache";
import {
  createPlayer,
  deletePlayer,
  updatePlayer,
} from "@/lib/api/players/mutations";
import {
  PlayerId,
  NewPlayerParams,
  UpdatePlayerParams,
  playerIdSchema,
  insertPlayerParams,
  updatePlayerParams,
} from "@/lib/db/schema/players";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePlayers = () => revalidatePath("/players");

export const createPlayerAction = async (input: NewPlayerParams) => {
  try {
    const payload = insertPlayerParams.parse(input);
    await createPlayer(payload);
    revalidatePlayers();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePlayerAction = async (input: UpdatePlayerParams) => {
  try {
    const payload = updatePlayerParams.parse(input);
    await updatePlayer(payload.id, payload);
    revalidatePlayers();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePlayerAction = async (input: PlayerId) => {
  try {
    const payload = playerIdSchema.parse({ id: input });
    await deletePlayer(payload.id);
    revalidatePlayers();
  } catch (e) {
    return handleErrors(e);
  }
};