import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    await prismaDB.cinema.createMany({ data: payload }).catch((err) => {
      throw new Error();
    });
    return NextResponse.json({
      message: "Cinema(s) added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not add cinema(s)" },
      { status: 400 }
    );
  }
}
