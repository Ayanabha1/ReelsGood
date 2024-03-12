import prismaDB from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let __searchParam: string | number = searchParams.get("data")!;
    if (!__searchParam) {
      throw new Error("Could not find any payment");
    }
    let payments = [];
    const parsedParamId = Number(__searchParam);

    __searchParam = __searchParam?.toLocaleLowerCase();

    payments = await prismaDB.payment.findMany({
      include: { customer: true },
      where: {
        OR: [
          {
            id: {
              equals: !isNaN(parsedParamId)
                ? parseInt(__searchParam)
                : undefined,
            },
          },
          {
            customer: {
              first_name: { contains: __searchParam, mode: "insensitive" },
            },
          },
          {
            customer: {
              last_name: { contains: __searchParam, mode: "insensitive" },
            },
          },
        ],
      },
    });

    const __data = payments?.map((item) => ({
      ...item,
      name: item.customer?.first_name + " " + item.customer?.last_name,
      amount: `₹${item?.amount / 100}`,
    }));
    return NextResponse.json({
      data: __data,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any payment record" },
      { status: 400 }
    );
  }
}
