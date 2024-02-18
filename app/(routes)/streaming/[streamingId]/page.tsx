"use client";

import { Button } from "@/components/ui/button";
import { getDate2, getTime } from "@/lib/commonFunctions";
import { stripe } from "@/lib/stripe";
import { useUser } from "@clerk/nextjs";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SeatInterface {
  booking?: any;
  primary_id: number;
  id: string;
  row: string;
  is_seat: boolean;
  cinema_id: number;
  selected: boolean;
}
interface SeatRowInterface {
  row: string;
  seats: SeatInterface[];
}

interface SeatGroupInterface {
  name: string;
  price: number;
  seats: SeatRowInterface[];
}

interface MoviePictureInterface {
  id: number;
  movie_id: number;
  picture: string;
}

interface MovieInterface {
  id: number;
  name: string;
  description: string;
  movie_picture: MoviePictureInterface[];
  rating: number;
}

interface BookingResponseInterface {
  message: string;
  stripe_session_url?: string;
}

const Page = ({ params }: { params: { streamingId: number } }) => {
  const { streamingId } = params;
  const [seatGroups, setSeatGroups] = useState<SeatGroupInterface[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieInterface>();
  const [cinemaDetails, setCinemaDetails] = useState<any>({});
  const [streamingDetails, setStreamingDetails] = useState<any>({});
  const [amount, setAmount] = useState<number>(0);
  const { user } = useUser();

  const getAllData = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const __data = await fetch(
      `${baseUrl}/getStreamingData?streamingId=${streamingId}`,
      { cache: "no-store" }
    );
    const data = await __data.json();
    const seats = data?.seats;
    const __groupedSeats = seats?.reduce((acc: any, item: any) => {
      const { name, price } = item?.seat_group;
      if (!acc[name]) {
        acc[name] = { name, price, seats: [] };
      }
      const seatData = item;
      delete seatData?.seat_group;
      acc[name].seats.push(seatData);
      return acc;
    }, {});
    const groupedSeatsTemp: any = __groupedSeats
      ? Object?.values(__groupedSeats)
      : [];

    const groupedSeats: SeatGroupInterface[] = groupedSeatsTemp?.map(
      (group: any) => {
        const groupTemp = group?.seats?.reduce((acc: any, item: any) => {
          const row = item.row;
          if (!acc[row]) {
            acc[row] = { row, seats: [] };
          }
          item.selected = false;
          acc[row].seats.push(item);
          return acc;
        }, {});

        const temp = group;
        temp.seats = groupTemp ? Object?.values(groupTemp) : [];
        return temp;
      }
    );
    setSeatGroups(groupedSeats);
    setMovieDetails(data?.movieDetails);
    setCinemaDetails(data?.cinemaDetails);
    setStreamingDetails(data?.streamingDetails);
  };

  const selectSeat = (
    primaryId: number,
    seatId: string,
    price: number,
    seat: SeatInterface
  ) => {
    if (selectedSeatIds?.includes(primaryId)) {
      // console.log("Removing", primaryId);
      seat.selected = false;
      setAmount((prev) => Math.max(0, prev - price));
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== primaryId));
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
    } else {
      // console.log("Adding", primaryId);
      seat.selected = true;
      setAmount((prev) => prev + price);
      setSelectedSeatIds((prev) => [...prev, primaryId]);
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  const reserveSeat = async () => {
    try {
      const customerId = user?.id;
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const body = {
        seats: selectedSeats,
        seatIds: selectedSeatIds,
        streamingId: streamingDetails.id,
        customerId: customerId,
        movieName: movieDetails?.name,
        moviePicture: movieDetails?.movie_picture[0]?.picture,
        cinemaName: cinemaDetails?.name,
        date: getDate2(streamingDetails?.date),
        time: getTime(streamingDetails?.date),
        amount: amount,
      };
      let res = await fetch(`${baseURL}/bookTicket`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const resData: BookingResponseInterface = await res.json();
      const stripeSessionUrl = resData.stripe_session_url!;
      window.location.href = stripeSessionUrl;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div
      className={`flex flex-col gap-4 relative px-6 py-4 ${
        selectedSeatIds.length && "pb-24"
      }`}
    >
      {/* Movie and cinema details */}
      <div className="flex gap-2 items-center ">
        <Link href={`/movies/${movieDetails?.id}`}>
          <ChevronLeftIcon className="h-7 w-7" />
        </Link>
        {/* movie details */}
        {cinemaDetails && movieDetails && (
          <div className="flex flex-col">
            <div>
              <span className="text-xl flex gap-2">{movieDetails?.name}</span>
            </div>
            <div className="text-sm">
              <span>{cinemaDetails?.name}</span>
              <span> | </span>
              <span>{getDate2(streamingDetails?.date)}</span>
              <span>, </span>
              <span>{getTime(streamingDetails?.date)}</span>
            </div>
          </div>
        )}
      </div>
      {/* Movie seats here */}
      <div className="flex flex-col md:items-center">
        <div className="flex flex-col gap-4 overflow-auto">
          {seatGroups?.map((group: SeatGroupInterface, index: number) => (
            <div
              key={index}
              className="flex flex-col w-fit lg:max-w-[60vw] justify-start "
            >
              {/* Group label */}
              <div>
                <p className="border-b border-[rgba(255,255,255,.25)] text-muted-foreground p-2 px-0">
                  {group?.name} - Rs. {group?.price}
                </p>
              </div>

              {/* seat rows */}
              <div className="flex flex-col gap-2 mt-3">
                {group?.seats?.map((seatRow: SeatRowInterface) => (
                  <div key={seatRow?.row} className="flex items-center gap-4">
                    <span className="w-4">{seatRow?.row}</span>

                    {/* seats */}

                    {seatRow?.seats?.map((seat: SeatInterface) => {
                      if (seat?.is_seat) {
                        if (seat?.booking?.length > 0) {
                          // reserved seat
                          return (
                            <div
                              key={seat?.primary_id}
                              className={`border  rounded-sm h-7 w-7  flex items-center justify-center overflow-hidden text-sm cursor-pointer bg-gray-400 text-black`}
                            >
                              {seat?.id}
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={seat?.primary_id}
                              className={`border border-[#72BA9D] rounded-sm h-7 w-7  flex items-center justify-center overflow-hidden text-sm cursor-pointer text-[#72BA9D] hover:bg-[#72ba9d94] hover:text-white ${
                                seat.selected && "bg-[#72BA9D] text-white"
                              }`}
                              onClick={() => {
                                selectSeat(
                                  seat?.primary_id,
                                  seat?.id,
                                  group?.price,
                                  seat
                                );
                              }}
                            >
                              {seat?.id}
                            </div>
                          );
                        }
                      } else {
                        return (
                          <div
                            key={seat?.primary_id}
                            className="rounded-sm h-7 w-7 flex items-center justify-center overflow-hidden text-sm"
                          >
                            <div className="h-3 w-3 border rounded-full"></div>
                          </div>
                        );
                      }
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Seat index */}
        <div className="mt-10 flex gap-5">
          <div className="flex gap-2 items-center">
            <div
              className={`border border-[#72BA9D] rounded-sm h-4 w-4  flex items-center justify-center overflow-hidden text-sm cursor-pointer text-[#72BA9D]`}
            ></div>
            <span>Available</span>
          </div>
          <div className="flex gap-2 items-center">
            <div
              className={`border border-[#72BA9D] rounded-sm h-4 w-4  flex items-center justify-center overflow-hidden text-sm cursor-pointer bg-[#72BA9D] text-white`}
            ></div>
            <span>Selected</span>
          </div>

          <div className="flex gap-2 items-center">
            <div
              className={`border  rounded-sm h-4 w-4  flex items-center justify-center overflow-hidden text-sm cursor-pointer bg-gray-400 text-black`}
            ></div>
            <span>Reserved</span>
          </div>
        </div>

        {/* screen here */}
        <div className="flex flex-col items-center mt-[50px]">
          <div className="relative h-6 w-72">
            <Image src="/screen.png" alt="screen here" fill />
          </div>
          <span className="text-sm">All eyes this way please!</span>
        </div>
      </div>
      {/* Checkout */}
      {selectedSeatIds.length ? (
        <div className="fixed left-0 bottom-0 w-full p-4 bg-[rgb(36,36,36)] border text-white flex items-center justify-center">
          <Button
            className="bg-[#72BA9D] py-4 px-14 text-lg"
            onClick={() => {
              reserveSeat();
            }}
          >
            Pay Rs. {amount}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
