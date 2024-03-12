import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    await prismaDB.actor.createMany({ data: payload }).catch((err) => {
      throw new Error();
    });
    console.log(payload);
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
