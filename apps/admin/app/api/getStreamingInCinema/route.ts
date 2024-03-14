import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let __movieId: string | number = searchParams.get("movie_id")!;
    let __cinemaId: string | number = searchParams.get("cinema_id")!;
    if (!__movieId || !__cinemaId) {
      throw new Error("Could not find any streaming info");
    }
    let movieId = parseInt(__movieId);
    let cinemaId = parseInt(__cinemaId);

    const data = await prismaDB.streaming.findMany({
      where: {
        movie_id: movieId,
        cinema_id: cinemaId,
      },
      include: {
        cinema: true,
      },
    });

    const movie = await prismaDB.movie.findFirst({ where: { id: movieId } });
    const cinema = await prismaDB.cinema.findFirst({ where: { id: cinemaId } });

    return NextResponse.json({
      data,
      movie,
      cinema,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any streaming record for this movie" },
      { status: 400 }
    );
  }
}
