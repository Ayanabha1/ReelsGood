import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take: string = searchParams.get("take")!;
    const skip: string = searchParams.get("skip")!;
    let actors;
    if (take && skip) {
      actors = await prismaDB.actor.findMany({
        take: parseInt(take),
        skip: parseInt(skip),
        include: {
          movie_cast: {
            include: {
              movie: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    } else {
      actors = await prismaDB.actor.findMany({});
    }
    const total = await prismaDB.actor.count();
    return NextResponse.json({
      actors: actors,
      total: total,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not fetch users" },
      { status: 400 }
    );
  }
}
