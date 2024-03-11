import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = {
      name: payload?.name?.trim(),
      picture: payload?.picture?.trim(),
      popularity_rating: payload?.popularity_rating || 1,
    };
    await prismaDB.actor.create({ data: data });
    return NextResponse.json({
      message: "Actor added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not add actor" },
      { status: 400 }
    );
  }
}
