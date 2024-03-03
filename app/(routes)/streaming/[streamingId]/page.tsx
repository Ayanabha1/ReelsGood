"use client";

import { loadingInterfaceType } from "@/CommonInterfaces/shared_interfaces";
import Breadcrumps from "@/components/Breadcrumps";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/hooks/loader";
import { getDate2, getTime, showError } from "@/lib/commonFunctions";
import { stripe } from "@/lib/stripe";
import { useUser } from "@clerk/nextjs";
import { ChevronLeftIcon, MoveLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";

interface SeatInterface {
  booked_seat?: any;
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
  movie_banner: string;
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
  const loader: loadingInterfaceType = useLoader();
  const [paths, setPaths] = useState([
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movies" },
  ]);

  const getAllData = async () => {
    loader.setLoading(true);
    try {
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
      setPaths((prev) => [
        ...prev,
        {
          name: data?.movieDetails?.name,
          link: `/movies/${data?.movieDetails?.id}`,
        },
        {
          name: "Book Tickets",
          link: `/streaming/${streamingId}`,
        },
      ]);
    } catch (error: any) {
      showError(error?.message || error?.response?.data?.message);
    }
    loader.setLoading(false);
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
    loader.setLoading(true);

    try {
      const customerId = user?.id;
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const body = {
        seats: selectedSeats,
        seatIds: selectedSeatIds,
        streamingId: streamingDetails.id,
        customerId: customerId,
        movieName: movieDetails?.name,
        moviePicture: movieDetails?.movie_banner,
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
      if (res?.status > 200) {
        throw new Error(resData?.message);
      }
      const stripeSessionUrl = resData.stripe_session_url!;
      if (stripeSessionUrl) {
        window.location.href = stripeSessionUrl;
      }
    } catch (error: any) {
      showError(error?.message || error?.response?.data?.message);
    }
    loader.setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div
      className={`flex flex-col gap-4 relative px-3 sm:px-6 py-4 ${
        selectedSeatIds.length && "pb-24"
      } text-sm sm:text-lg`}
    >
      <Breadcrumps paths={paths} />
      {/* Movie and cinema details */}
      <div className="flex gap-2 items-start sm:items-center ">
        {/* movie details */}
        {cinemaDetails && movieDetails && (
          <div className="flex flex-col">
            <div>
              <span className="text-lg sm:text-xl flex gap-2">
                {movieDetails?.name}
              </span>
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
                        if (seat?.booked_seat?.length > 0) {
                          // reserved seat
                          return (
                            <div
                              key={seat?.primary_id}
                              className={`border  rounded-sm h-6 w-6 sm:h-8 sm:w-8   flex items-center justify-center overflow-hidden text-[12px] sm:text-sm cursor-not-allowed bg-[#9F9FA3] text-black`}
                            >
                              {seat?.id}
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={seat?.primary_id}
                              className={`border  rounded-sm h-6 w-6 sm:h-8 sm:w-8  flex items-center justify-center overflow-hidden text-[12px] sm:text-sm cursor-pointer text-md transition-all duration-300 hover:bg-[#b99b22] text-black ${
                                seat.selected ? "bg-[#E7BA01]" : "bg-[#fff]"
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
                            className="rounded-sm h-6 w-6 sm:h-8 sm:w-8  flex items-center justify-center overflow-hidden text-[12px]"
                          >
                            {/* <div className="h-3 w-3 border rounded-full"></div> */}
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

        {/* screen here */}
        <div className="flex flex-col items-center mt-[50px]">
          <img
            loading="lazy"
            className="h-6 w-96 mb-2"
            src="/screen.png"
            alt="screen here"
          />
          <span className="text-sm">All eyes this way please!</span>
        </div>
      </div>
      {/* Checkout */}
      {selectedSeatIds.length ? (
        <div className="fixed left-0 bottom-0 w-full p-4 bg-[rgb(36,36,36)] border text-white flex items-center justify-center">
          <Button
            className="bg-[#E7BA01] py-4 px-14 text-lg"
            onClick={() => {
              reserveSeat();
            }}
          >
            Pay Rs. {amount}
          </Button>
        </div>
      ) : null}

      {/* Seat index */}
      <div className="mt-10 flex flex-wrap justify-center gap-5">
        <div className="flex gap-2 items-center">
          <div
            className={`border  rounded-sm h-4 w-4  flex items-center justify-center overflow-hidden text-sm cursor-pointer bg-[#9F9FA3] text-black`}
          ></div>
          <span>Reserved</span>
        </div>
        <div className="flex gap-2 items-center">
          <div
            className={`border bg-[#fff] rounded-sm h-4 w-4  flex items-center justify-center overflow-hidden text-sm`}
          ></div>
          <span>Available</span>
        </div>

        <div className="flex gap-2 items-center">
          <div
            className={`border bg-[#E7BA01] rounded-sm h-4 w-4  flex items-center justify-center overflow-hidden text-sm cursor-pointer`}
          ></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default Page;
