import prismaDB from "@/lib/prismaDb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const cancelBooking = async (bookingToken: string) => {
  const res = await prismaDB.$transaction(async (tx) => {
    await tx.booked_seat.deleteMany({
      where: { booking_token: bookingToken },
    });

    await tx.booking.deleteMany({
      where: {
        booking_token: bookingToken,
      },
    });
  });
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session = event.data.object as Stripe.Checkout.Session;
    if (!session) {
      throw new Error();
    }

    if (event.type === "checkout.session.completed") {
      if (!session?.metadata) {
        throw new Error();
      }
      const { amount_total, id } = session;
      const { customerId, streamingId, bookingToken } = session.metadata;
      if (session.payment_status === "paid") {
        console.log("Payment completed");
        const res = await prismaDB.$transaction(async (tx) => {
          const newPayment = await tx.payment.create({
            data: {
              amount: amount_total!,
              customer_id: customerId,
              stripe_session_id: id,
            },
          });

          await tx.booking.updateMany({
            where: {
              booking_token: bookingToken,
            },
            data: {
              status: "BOOKED",
              payment_id: newPayment.id,
            },
          });
        });
      } else {
        // payment failed
        await cancelBooking(bookingToken);
      }
    } else if (event.type === "checkout.session.expired") {
      if (!session?.metadata) {
        throw new Error();
      }
      const { customerId, streamingId, bookingToken } = session.metadata;
      console.log("Payment session expired for user: " + customerId);
      await cancelBooking(bookingToken);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Could not process the payment ... Do not worry you will get a refund within 3-5 business days if money is debited ",
      },
      { status: 400 }
    );
  }
}
