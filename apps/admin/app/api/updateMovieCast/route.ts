import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const movieId = payload?.movie_id;
    const cast = payload?.cast;
    console.log(movieId);
    console.log(cast);
    const res = await prismaDB.$transaction(async (tx) => {
      await tx.movie_cast.deleteMany({ where: { movie_id: movieId } });
      if (cast?.length > 0) {
        await tx.movie_cast.createMany({
          data: cast,
        });
      }
    });

    return NextResponse.json({
      message: "Movie cast added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not add movie" },
      { status: 400 }
    );
  }
}
