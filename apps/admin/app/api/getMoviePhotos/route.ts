import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let __searchParam: string = searchParams.get("movie_id")!;
    if (!__searchParam) {
      throw new Error("Could not find any actor");
    }
    const movieId = parseInt(__searchParam);
    let photos = await prismaDB.movie_picture.findMany({
      where: {
        movie_id: movieId,
      },
    });
    const movie = await prismaDB.movie.findFirst({
      where: { id: movieId },
    });

    return NextResponse.json({
      data: photos,
      movie: movie,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any actor" },
      { status: 400 }
    );
  }
}
