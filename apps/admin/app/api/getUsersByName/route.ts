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
    let users = await prismaDB.customer.findMany({
      where: {
        OR: [
          {
            first_name: { contains: __searchParam, mode: "insensitive" },
          },
          {
            last_name: { contains: __searchParam, mode: "insensitive" },
          },
          {
            email: { contains: __searchParam, mode: "insensitive" },
          },
        ],
      },
    });

    const _data = users.map((item) => ({
      ...item,
      name: item?.first_name + " " + item?.last_name,
    }));

    return NextResponse.json({
      data: _data,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Could not find any actor" },
      { status: 400 }
    );
  }
}
