import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let __searchParam: string = searchParams.get("data")!;
    __searchParam = __searchParam?.toLocaleLowerCase();
    if (!__searchParam) {
      throw new Error("Could not find any actor");
    }
    let actors = await prismaDB.actor.findMany({
      where: {
        name: { contains: __searchParam, mode: "insensitive" },
      },
    });
    return NextResponse.json({
      data: actors,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any actor" },
      { status: 400 }
    );
  }
}
