import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createPlayer,
  deletePlayer,
  updatePlayer,
} from "@/lib/api/players/mutations";
import { 
  playerIdSchema,
  insertPlayerParams,
  updatePlayerParams 
} from "@/lib/db/schema/players";

export async function POST(req: Request) {
  try {
    const validatedData = insertPlayerParams.parse(await req.json());
    const { player } = await createPlayer(validatedData);

    revalidatePath("/players"); // optional - assumes you will have named route same as entity

    return NextResponse.json(player, { status: 201 });
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

    const validatedData = updatePlayerParams.parse(await req.json());
    const validatedParams = playerIdSchema.parse({ id });

    const { player } = await updatePlayer(validatedParams.id, validatedData);

    return NextResponse.json(player, { status: 200 });
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

    const validatedParams = playerIdSchema.parse({ id });
    const { player } = await deletePlayer(validatedParams.id);

    return NextResponse.json(player, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
