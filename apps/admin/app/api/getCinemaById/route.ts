import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let __searchParam: string = searchParams.get("cinema_id")!;
    if (!__searchParam) {
      throw new Error("Could not find any cinema");
    }
    let cinema_id = parseInt(__searchParam);
    let cinema = await prismaDB.cinema.findFirst({
      where: {
        id: { equals: cinema_id },
      },
      include: {
        seat: {
          include: {
            seat_group: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: cinema,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any cinema" },
      { status: 400 }
    );
  }
}
