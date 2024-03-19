import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let __movieId: string | number = searchParams.get("movie_id")!;
    if (!__movieId) {
      throw new Error("Could not find any streaming info");
    }
    let movieId = parseInt(__movieId);

    const __data = await prismaDB.streaming_cinema.findMany({
      where: {
        movie_id: movieId,
      },
      include: {
        cinema: true,
      },
    });

    const __movie = await prismaDB.movie.findFirst({ where: { id: movieId } });

    const payload = __data?.reduce((acc: any, item: any) => {
      if (!acc[item?.cinema_id])
        acc[item?.cinema_id] = { cinema: item?.cinema, streaming: [] };
      acc[item?.cinema_id].streaming.push(item);
      return acc;
    }, {});

    const payloadValues = Object?.values(payload);

    return NextResponse.json({
      data: payloadValues,
      movie: __movie,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any streaming record for this movie" },
      { status: 400 }
    );
  }
}
