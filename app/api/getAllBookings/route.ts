import prismaDB from "@/lib/prismaDb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId: string = searchParams.get("customer_id")!;

    const bookings = await prismaDB.booking.findMany({
      where: { customer_id: customerId, status: "BOOKED" },
      include: {
        payment: true,
        streaming: {
          include: {
            movie: {
              include: {
                movie_picture: true,
              },
            },
            cinema: true,
          },
        },
        booked_seat: {
          include: {
            seat: {
              include: {
                seat_group: true,
              },
            },
          },
        },
      },
    });

    if (bookings.length === 0) {
      throw new Error("Invalid request ... No booking exists with given token");
    }

    return NextResponse.json({
      bookings: bookings,
    });
  } catch (error: any) {
    const err =
      error?.message || "Something went wrong ... please try again later";
    return NextResponse.json({ message: err }, { status: 400 });
  }
}
