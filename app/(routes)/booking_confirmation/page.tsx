"use client";

import { getDate, getDate2, getTime } from "@/lib/commonFunctions";
import { CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const Page = () => {
  const [seats, setSeats] = useState<any>([]);
  const [totalSeats, setTotalSeats] = useState(0);
  const [streamingDetails, setStreamingDetails] = useState<any>({});
  const [bookingDetails, setBookingDetails] = useState<any>({});
  const [QRvalue, setQRvalue] = useState<any>({});
  const searchParams = useSearchParams();
  const bookingToken = searchParams.get("booking_token");
  const getBookingConfirmation = async () => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const res = await fetch(
        `${baseURL}/bookingConfirmation?booking_token=${bookingToken}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      console.log(data);
      const bookingDetails = data?.bookingDetails;
      const streamingDetails = data?.streamingDetails;
      let __totalSeats = 0;
      let __seats = bookingDetails?.reduce((acc: any, item: any) => {
        const seat = item?.seat?.id;
        const seat_group = item?.seat?.seat_group?.name;
        __totalSeats++;
        if (!acc[seat_group]) {
          acc[seat_group] = { group: seat_group, seats: [] };
        }
        acc[seat_group].seats.push({ seat: seat, id: item?.seat?.primary_id });
        return acc;
      }, {});

      let groupedSeats = __seats ? Object.values(__seats) : [];

      const __QRvalue = {
        bookingToken: bookingToken,
      };

      setQRvalue(__QRvalue);
      setSeats(groupedSeats);
      setTotalSeats(__totalSeats);
      setBookingDetails(bookingDetails);
      setStreamingDetails(streamingDetails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookingConfirmation();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      {seats?.length > 0 ? (
        <>
          <div className="flex gap-2 items-center text-lime-500 text-2xl">
            <CheckCircle2Icon className="h-10 w-10" />
            <span>Thank you for your purchase</span>
          </div>

          <p className="mt-5 text-xl">Booking Summary</p>
          <div className="w-[350px] mt-5 bg-[rgb(36,36,36)] border border-[rgb(30,30,30)] rounded-lg flex flex-col ">
            {/* Top */}
            <div className="relative flex gap-4 p-3">
              <div className="relative h-[170px] w-[120px] rounded-lg overflow-hidden">
                <Image
                  src={streamingDetails?.movie?.movie_picture[0]?.picture}
                  alt="Image"
                  className="rounded-lg"
                  fill
                />
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-xl">{streamingDetails?.movie?.name}</h1>
                <span>
                  {getDate2(streamingDetails?.date)} |{" "}
                  {getTime(streamingDetails?.date)}
                </span>
                <span>{streamingDetails?.cinema?.name}</span>
              </div>
            </div>

            <div className="booking-confirmation-card-info relative text-center">
              <span className="text-[13px] bg-[rgb(26,26,26)] px-7 rounded-xl">
                Please show this ticket at the counter
              </span>
            </div>

            {/* Mid */}
            <div className="flex gap-4 p-3">
              <div className="text-center w-[120px]">
                <QRCode
                  style={{ height: "auto", width: "120px" }}
                  value={JSON.stringify(QRvalue)}
                />
              </div>

              <div className="flex flex-col items-center flex-grow">
                <span className="text-lg">{totalSeats} Ticket(s)</span>
                <div className="flex flex-col gap-2">
                  {seats?.map((group: any, i: number) => (
                    <div className="flex flex-wrap gap-1">
                      <span key={i}>{group.group} - </span>
                      {group?.seats?.map((seat: any) => (
                        <span key={seat?.id}>{seat?.seat}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="">
              <p className="text-sm text-center bg-[rgb(26,26,26)] p-2">
                Cancellation available only until 2 hours prior to streaming
              </p>
              <div className="flex justify-between p-3">
                <span>Total Amount</span>
                <span>Rs. {bookingDetails[0]?.payment?.amount / 100}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-2xl">Sorry no booking available</div>
      )}
    </div>
  );
};

export default Page;
