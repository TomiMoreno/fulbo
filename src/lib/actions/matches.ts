"use server";

import { revalidatePath } from "next/cache";
import {
  createMatch,
  deleteMatch,
  updateMatch,
} from "@/lib/api/matches/mutations";
import {
  MatchId,
  NewMatchParams,
  UpdateMatchParams,
  matchIdSchema,
  insertMatchParams,
  updateMatchParams,
} from "@/lib/db/schema/matches";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateMatches = () => revalidatePath("/matches");

export const createMatchAction = async (input: NewMatchParams) => {
  try {
    const payload = insertMatchParams.parse(input);
    await createMatch(payload);
    revalidateMatches();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateMatchAction = async (input: UpdateMatchParams) => {
  try {
    const payload = updateMatchParams.parse(input);
    await updateMatch(payload.id, payload);
    revalidateMatches();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteMatchAction = async (input: MatchId) => {
  try {
    const payload = matchIdSchema.parse({ id: input });
    await deleteMatch(payload.id);
    revalidateMatches();
  } catch (e) {
    return handleErrors(e);
  }
};