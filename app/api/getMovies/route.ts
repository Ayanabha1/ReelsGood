import prismaDB from "@/lib/prismaDb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const movies = await prismaDB.movie.findMany({
      include: {
        movie_picture: true,
      },
    });
    return NextResponse.json({ movies: movies });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch movies ... Please try again later!" },
      { status: 400 }
    );
  }
}
