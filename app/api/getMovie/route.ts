import prismaDB from "@/lib/prismaDb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paramId: string | null = searchParams.get("id");
  const movie_id: number = parseInt(paramId!);
  try {
    const movie = await prismaDB.movie.findUnique({
      where: { id: movie_id },
    });

    const cinemas = await prismaDB.streaming.findMany({
      where: {
        movie_id: movie_id,
      },
      include: {
        cinema: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({ movie: movie, cinemas: cinemas });
  } catch (error) {
    return NextResponse.json({ message: "Movie not found" }, { status: 404 });
  }
}
