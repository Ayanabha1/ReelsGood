"use client";
import { getDate2, getTime, showSuccess } from "@/lib/commonFunctions";
import { Share } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  EmailShareButton,
  FacebookMessengerShareButton,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const Ticket = ({ ticketData }: { ticketData: any }) => {
  const [data, setData] = useState<any>({});
  const [shareUrl, setShareUrl] = useState<string>("");
  const [shareContainerOpen, setShareContainerOpen] = useState<boolean>(false);
  const shareContainerRef = useRef<HTMLInputElement>(null);
  const shareContainerBtnRef = useRef<HTMLInputElement>(null);

  const getTicketInfo = () => {
    const baseURL = process.env.NEXT_PUBLIC_WEB_URL;
    const bookingDetails = ticketData;
    const bookingToken = ticketData?.booking_token;
    setShareUrl(
      `${baseURL}/booking_confirmation?booking_token=${bookingToken}`
    );
    let __totalSeats = 0;
    let __seats = bookingDetails?.booked_seat?.reduce((acc: any, item: any) => {
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
    setData({
      QRvalue: __QRvalue,
      seats: groupedSeats,
      totalSeats: __totalSeats,
      bookingDetails: bookingDetails,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    showSuccess("Copied to clipboard");
  };

  const handleShareContainer = (e: any) => {
    if (
      shareContainerRef.current &&
      shareContainerRef.current.contains(e.target)
    ) {
      // Do nothing
    } else if (
      shareContainerBtnRef.current &&
      shareContainerBtnRef.current.contains(e.target)
    ) {
      setShareContainerOpen((prev) => !prev);
    } else if (
      shareContainerRef.current &&
      !shareContainerRef.current.contains(e.target)
    ) {
      setShareContainerOpen(false);
    }
  };

  useEffect(() => {
    getTicketInfo();
    window.addEventListener("mousedown", handleShareContainer);
    return () => {
      window.removeEventListener("mousedown", handleShareContainer);
    };
  }, []);

  return (
    <div className="w-[350px] mt-5 bg-[rgb(24,25,29)] border border-[rgb(30,30,30)] rounded-lg flex flex-col ">
      {data?.seats ? (
        <>
          <div className="relative flex gap-4 p-3">
            <div className="relative h-[170px] w-[120px] rounded-lg overflow-hidden">
              <Image
                src={
                  data?.bookingDetails?.streaming?.movie?.movie_picture[0]
                    ?.picture
                }
                alt="Image"
                className="rounded-lg"
                fill
              />
            </div>
            <div className="flex flex-col gap-4 flex-grow">
              <div className="flex justify-between items-start">
                <h1 className="text-xl">
                  {data?.bookingDetails?.streaming?.movie?.name}
                </h1>
                <div
                  className="relative flex ml-auto"
                  ref={shareContainerBtnRef}
                >
                  <Share className="h-5 w-5 mt-1 cursor-pointer" />

                  {/* Share container */}
                  {shareContainerOpen ? (
                    <div
                      ref={shareContainerRef}
                      className="absolute right-0 -bottom-2 translate-y-[100%] p-2 bg-[rgba(9,11,12,0.6)] backdrop-blur-[2px] rounded-md shadow-md flex items-center gap-2"
                    >
                      <div
                        className="relative h-5 w-5 cursor-pointer"
                        onClick={() => copyToClipboard()}
                      >
                        <Image src="/icons/link.png" fill alt="whatsapp" />
                      </div>
                      <WhatsappShareButton
                        url={shareUrl}
                        className="relative h-6 w-6 cursor-pointer"
                      >
                        <Image src="/icons/whatsapp.png" fill alt="whatsapp" />
                      </WhatsappShareButton>
                      <TelegramShareButton
                        url={shareUrl}
                        className="relative h-6 w-6 cursor-pointer"
                      >
                        <Image src="/icons/telegram.png" fill alt="whatsapp" />
                      </TelegramShareButton>
                    </div>
                  ) : null}
                </div>
              </div>
              <span>
                {getDate2(data?.bookingDetails?.streaming?.date)} |{" "}
                {getTime(data?.bookingDetails?.streaming?.date)}
              </span>
              <span>{data?.bookingDetails?.streaming?.cinema?.name}</span>
            </div>
          </div>

          <div className="booking-confirmation-card-info relative text-center">
            <span className="text-[13px] bg-[rgb(26,26,26)] px-7 rounded-xl">
              Please show this ticket at the counter
            </span>
          </div>

          <div className="flex gap-4 p-3">
            <div className="text-center w-[120px]">
              <QRCode
                style={{ height: "auto", width: "120px" }}
                value={JSON.stringify(data?.QRvalue)}
              />
            </div>

            <div className="flex flex-col items-center flex-grow">
              <span className="text-lg">{data?.totalSeats} Ticket(s)</span>
              <div className="flex flex-col gap-2">
                {data?.seats?.map((group: any, i: number) => (
                  <div className="flex flex-wrap gap-1" key={i}>
                    <span>{group.group} - </span>
                    {group?.seats?.map((seat: any, j: number) => (
                      <span key={seat?.id}>{seat?.seat}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="">
            <p className="text-sm text-center bg-[rgb(26,26,26)] p-2">
              Cancellation available only until 2 hours prior to streaming
            </p>
            <div className="flex justify-between p-3">
              <span>Total Amount</span>
              <span>Rs. {data?.bookingDetails?.payment?.amount / 100}</span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Ticket;
