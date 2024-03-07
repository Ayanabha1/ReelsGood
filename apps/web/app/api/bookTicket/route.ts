import prismaDB from "@/lib/prismaDb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

async function isSeatAvailable(seatId: number, streaming_id: number) {
  try {
    const seat = await prismaDB.booked_seat.findMany({
      where: {
        seat_primary_id: seatId,
        streaming_id: streaming_id,
      },
    });
    if (seat.length > 0) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function checkAllSeatsAvailable(seatIds: number[], streaming_id: number) {
  try {
    let promises = seatIds.map((seat) => isSeatAvailable(seat, streaming_id));
    const res: Boolean[] = await Promise.all(promises);
    let vacantSeats = 0;
    res.forEach((el) => {
      if (el === true) {
        vacantSeats++;
      }
    });
    return vacantSeats === seatIds.length;
  } catch (error) {
    return false;
  }
}

function createToken(data: any) {
  let token = "";
  token += data?.streamingId;
  token += data?.customerId;
  data?.seats?.forEach((seat: string) => {
    token += seat;
  });
  return token;
}

function createExpirationTime() {
  // 30 mins from now (1800s)
  return Math.floor(Date.now() / 1000) + 1800;
}

async function createStripeSession(
  data: any,
  bookingToken: string
): Promise<string> {
  const baseURL = process.env.PUBLIC_URL;
  const {
    seats,
    seatIds,
    streamingId,
    customerId,
    movieName,
    moviePicture,
    amount,
    cinemaName,
    date,
    time,
  } = data;

  const desc = `
  BOOKING SUMMARY: ${movieName} | ${cinemaName} | ${date}, ${time} | Seats: ${seats}
  `;
  const transformedItem = {
    price_data: {
      currency: "inr",
      product_data: {
        images: [moviePicture],
        name: movieName,
        description: desc,
      },
      unit_amount: amount * 100,
    },
    quantity: 1,
  };
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [transformedItem],
    mode: "payment",
    success_url: `${baseURL}/booking_confirmation?booking_token=${bookingToken}`,
    cancel_url: `${baseURL}/streaming/${streamingId}`,
    expires_at: createExpirationTime(),
    metadata: {
      streamingId: streamingId,
      customerId: customerId,
      bookingToken: bookingToken,
    },
  });
  return session.url!;
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const {
      seatIds,
      seats,
      streamingId,
      customerId,
      movieName,
      moviePicture,
      amount,
      cinemaName,
      date,
      time,
    } = payload;
    const bookingToken = createToken(payload);

    const bookable = await checkAllSeatsAvailable(seatIds, streamingId);
    const res = await prismaDB
      .$transaction(async (tx) => {
        if (!bookable) {
          throw new Error("Selected seat(s) is/are not available");
        } else {
          let booking = await tx.booking.create({
            data: {
              customer_id: customerId,
              streaming_id: streamingId,
              booking_token: bookingToken,
              status: "PENDING",
            },
          });
          const bookingId = booking.id;
          let promises = seatIds.map((seat: number) =>
            tx.booked_seat.create({
              data: {
                seat_primary_id: seat,
                streaming_id: streamingId,
                booking_id: bookingId,
                booking_token: bookingToken,
              },
            })
          );
          const bookedSeats = await Promise.all(promises);
          return bookedSeats;
        }
      })
      .catch((err) => {
        throw new Error("Selected seat(s) is/are not available");
      });
    const stripeSessionUrl = await createStripeSession(payload, bookingToken);

    return NextResponse.json({
      message: "Selected seats are available",
      stripe_session_url: stripeSessionUrl,
    });
  } catch (error) {
    console.log(`[BOOKING ERROR] ${error}`);
    return NextResponse.json({ message: `${error}` }, { status: 400 });
  }
}
