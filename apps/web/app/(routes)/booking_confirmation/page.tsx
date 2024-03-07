"use client";

import { loadingInterfaceType } from "@/CommonInterfaces/shared_interfaces";
import Ticket from "@/components/Ticket";
import { useLoader } from "@/hooks/loader";
import { getDate, getDate2, getTime, showError } from "@/lib/commonFunctions";
import { CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const Page = () => {
  const [ticketData, setTicketData] = useState<any>(null);
  const searchParams = useSearchParams();
  const bookingToken = searchParams.get("booking_token");
  const loader: loadingInterfaceType = useLoader();

  const getBookingConfirmation = async () => {
    loader.setLoading(true);
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const res = await fetch(
        `${baseURL}/bookingConfirmation?booking_token=${bookingToken}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (res.status > 200) {
        throw new Error(data?.message);
      }

      setTicketData(data?.bookingDetails);
    } catch (error: any) {
      showError(error?.message);
    }
    loader.setLoading(false);
  };

  useEffect(() => {
    getBookingConfirmation();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <title>Booking confirmation - ReelsGood</title>
      {ticketData ? (
        <>
          <div className="flex gap-2 items-center text-lime-500 text-2xl">
            <CheckCircle2Icon className="h-10 w-10" />
            <span>Thank you for your purchase</span>
          </div>

          <p className="mt-5 text-xl">Booking Summary</p>
          <Ticket ticketData={ticketData} />
        </>
      ) : (
        <div className="text-2xl">Sorry no booking available</div>
      )}
    </div>
  );
};

export default Page;
