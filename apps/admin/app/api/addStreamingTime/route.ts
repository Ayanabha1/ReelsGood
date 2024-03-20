import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const data = payload;
    const res = await prismaDB.streaming.createMany({
      data: data,
    });

    return NextResponse.json({
      message: "Streaming time added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not add streaming time" },
      { status: 400 }
    );
  }
}
