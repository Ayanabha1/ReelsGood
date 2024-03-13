import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log(payload);
    await prismaDB.movie.createMany({ data: payload }).catch((err) => {
      console.log(err);
      throw new Error();
    });
    return NextResponse.json({
      message: "Actor added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not add movie" },
      { status: 400 }
    );
  }
}
