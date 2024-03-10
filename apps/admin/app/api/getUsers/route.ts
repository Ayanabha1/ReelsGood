import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take: string = searchParams.get("take")!;
    const skip: string = searchParams.get("skip")!;
    let users;
    if (take && skip) {
      users = await prismaDB.customer.findMany({
        take: parseInt(take),
        skip: parseInt(skip),
      });
    } else {
      users = await prismaDB.customer.findMany({});
    }
    const total = await prismaDB.customer.count();
    return NextResponse.json({
      users: users,
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
