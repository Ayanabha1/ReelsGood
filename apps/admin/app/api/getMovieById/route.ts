import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let __searchParam: string = searchParams.get("movie_id")!;
    if (!__searchParam) {
      throw new Error("Could not find any movie");
    }
    let movie_id = parseInt(__searchParam);
    let movie = await prismaDB.movie.findFirst({
      where: {
        id: { equals: movie_id },
      },
      include: {
        movie_cast: {
          include: {
            actor: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: movie,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any actor" },
      { status: 400 }
    );
  }
}
