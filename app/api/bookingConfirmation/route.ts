import prismaDB from "@/lib/prismaDb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingToken: string = searchParams.get("booking_token")!;

    const bookingDetails = await prismaDB.booking.findMany({
      where: { booking_token: bookingToken },
      include: {
        payment: true,
        seat: {
          include: {
            seat_group: true,
          },
        },
      },
    });

    if (bookingDetails.length === 0) {
      throw new Error("Invalid request ... No booking exists with given token");
    }

    if (
      bookingDetails[0]?.status === "PENDING" ||
      !bookingDetails[0]?.payment_id
    ) {
      throw new Error(
        "Taking longer than usual to process payment ... Please refresh the page and check again"
      );
    }

    const streaming_id = bookingDetails[0]?.streaming_id;
    const streamingDetails = await prismaDB.streaming.findUnique({
      where: {
        id: streaming_id!,
      },
      include: {
        movie: {
          include: {
            movie_picture: true,
          },
        },
        cinema: true,
      },
    });

    return NextResponse.json({
      streamingDetails: streamingDetails,
      bookingDetails: bookingDetails,
    });
  } catch (error: any) {
    const err =
      error?.message || "Something went wrong ... please try again later";
    return NextResponse.json({ message: err }, { status: 400 });
  }
}
