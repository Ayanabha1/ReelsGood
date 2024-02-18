import prismaDB from "@/lib/prismaDb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const __streamingId: string | null = searchParams.get("streamingId");
  const streamingId: number = parseInt(__streamingId!);
  try {
    const streamingData = await prismaDB.streaming.findUnique({
      where: {
        id: streamingId,
      },
    });
    const cinemaId = streamingData?.cinema_id;
    const movieId = streamingData?.movie_id;
    const seats = await prismaDB.seat.findMany({
      where: { cinema_id: cinemaId! },
      include: {
        seat_group: true,
        booking: {
          where: {
            streaming_id: streamingId,
          },
          select: {
            seat_primary_id: true,
            status: true,
          },
        },
      },
      orderBy: {
        primary_id: "asc",
      },
    });
    // console.log(seats);
    const movieDetails = await prismaDB.movie.findUnique({
      where: { id: movieId! },
      include: { movie_picture: true },
    });
    const cinemaDetails = await prismaDB.cinema.findUnique({
      where: { id: cinemaId! },
    });
    return NextResponse.json({
      seats: seats,
      streamingDetails: streamingData,
      movieDetails: movieDetails,
      cinemaDetails: cinemaDetails,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong ... please try again later" },
      { status: 404 }
    );
  }
}
