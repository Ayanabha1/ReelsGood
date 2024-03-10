import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take: string = searchParams.get("take")!;
    const skip: string = searchParams.get("skip")!;
    let cinemas;
    if (take && skip) {
      cinemas = await prismaDB.cinema.findMany({
        take: parseInt(take),
        skip: parseInt(skip),
      });
    } else {
      cinemas = await prismaDB.cinema.findMany({});
    }
    const total = await prismaDB.cinema.count();
    return NextResponse.json({
      cinemas: cinemas,
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
