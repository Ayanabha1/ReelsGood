import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take: string = searchParams.get("take")!;
    const skip: string = searchParams.get("skip")!;
    let payments;
    if (take && skip) {
      payments = await prismaDB.payment.findMany({
        include: {
          customer: true,
        },
        take: parseInt(take),
        skip: parseInt(skip),
      });
    } else {
      payments = await prismaDB.payment.findMany({
        include: {
          customer: true,
        },
      });
    }
    const total = await prismaDB.payment.count();
    return NextResponse.json({
      payments: payments,
      total: total,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not fetch payments" },
      { status: 400 }
    );
  }
}
