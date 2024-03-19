import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const movieId = payload?.movie_id;
    const data = payload?.data;
    console.log(data);
    const res = await prismaDB.streaming_cinema.createMany({
      data: data,
    });

    return NextResponse.json({
      message: "Streaming cinemas added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not add movie" },
      { status: 400 }
    );
  }
}
