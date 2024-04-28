import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log(req.url);
    const { searchParams } = new URL(req.url);
    const take: string = searchParams.get("take")!;
    const skip: string = searchParams.get("skip")!;
    console.log(take);
    console.log(skip);
    let movies;
    if (take && skip) {
      movies = await prismaDB.movie.findMany({
        take: parseInt(take),
        skip: parseInt(skip),
      });
    } else {
      movies = await prismaDB.movie.findMany({});
    }
    const total = await prismaDB.movie.count();
    console.log(movies);
    return NextResponse.json({
      movies: movies,
      total: total,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not fetch users" },
      { status: 400 }
    );
  }
}
