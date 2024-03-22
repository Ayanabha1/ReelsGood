import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const movieId = payload?.movie_id;
    const images = payload?.images;
    const res = await prismaDB.$transaction(async (tx) => {
      await tx.movie_picture.deleteMany({ where: { movie_id: movieId } });
      if (images?.length > 0) {
        await tx.movie_picture.createMany({
          data: images,
        });
      }
    });

    return NextResponse.json({
      message: "Movie images added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not update movie images" },
      { status: 400 }
    );
  }
}
