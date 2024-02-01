import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createMatch,
  deleteMatch,
  updateMatch,
} from "@/lib/api/matches/mutations";
import { 
  matchIdSchema,
  insertMatchParams,
  updateMatchParams 
} from "@/lib/db/schema/matches";

export async function POST(req: Request) {
  try {
    const validatedData = insertMatchParams.parse(await req.json());
    const { match } = await createMatch(validatedData);

    revalidatePath("/matches"); // optional - assumes you will have named route same as entity

    return NextResponse.json(match, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateMatchParams.parse(await req.json());
    const validatedParams = matchIdSchema.parse({ id });

    const { match } = await updateMatch(validatedParams.id, validatedData);

    return NextResponse.json(match, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = matchIdSchema.parse({ id });
    const { match } = await deleteMatch(validatedParams.id);

    return NextResponse.json(match, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
