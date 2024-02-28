"use client";
import { loadingInterfaceType } from "@/CommonInterfaces/shared_interfaces";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/hooks/loader";
import { getDate, getDate2, getTime, showError } from "@/lib/commonFunctions";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  HeartIcon,
  MoveLeftIcon,
  Popcorn,
  Smartphone,
  Star,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";

interface timeInterface {
  date: Date;
  time: string[];
}

const Page = ({ params }: { params: { id: ReactNode } }) => {
  const [movieToShow, setMovieToShow] = useState<any>({});
  const [streamingCinemas, setStreamingCinemas] = useState<any[]>([]);
  const [streamingDates, setStreamingDates] = useState<string[]>([]);
  const [streamingOnDate, setStreamingOnDate] = useState<any[]>([]);
  const [streamingTimes, setStreamingTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const loader: loadingInterfaceType = useLoader();

  const getCinemas = async () => {
    loader.setLoading(true);
    try {
      const { id } = params;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const res = await fetch(`${baseUrl}/getMovie/?id=${id}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res?.status > 200) {
        throw new Error(data?.message);
      }
      const { movie, cinemas } = data;

      setMovieToShow(movie);
      setStreamingCinemas(cinemas);
      let __dates: string[] = [];
      cinemas?.forEach((cin: any) => {
        const d = new Date(cin?.date);
        const date = getDate2(d);
        __dates.push(date);
      });
      __dates = __dates.filter((item, i, date) => date.indexOf(item) === i);
      __dates = __dates.sort();
      setStreamingDates(__dates);
      setSelectedDate(__dates[0]);
    } catch (error: any) {
      showError(error?.message || error?.response?.data?.message);
    }
    loader.setLoading(false);
  };

  const getCinemasWihDates = (date: string | null) => {
    let __cinemas = streamingCinemas?.filter(
      (cin: any) => getDate2(cin?.date) === date
    );
    __cinemas = __cinemas?.map((cin: any) => ({
      ...cin,
      time: getTime(cin?.date),
    }));

    const groupedData = __cinemas?.reduce((acc, item) => {
      const { id, cinema_id, time } = item;
      if (!acc[cinema_id]) {
        acc[cinema_id] = { ...item, showTimes: [] };
        delete acc[cinema_id].time;
      }
      acc[cinema_id].showTimes.push({ time: time, stream_id: id });
      return acc;
    }, {});

    __cinemas = groupedData ? Object.values(groupedData) : [];

    setStreamingOnDate(__cinemas);
  };

  useEffect(() => {
    if (selectedDate !== "") {
      getCinemasWihDates(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    setIsMounted(true);
    getCinemas();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="px-4 sm:px-6 pt-4 flex gap-2 justify-center sm:justify-normal relative">
        <Link href={`/movies`} className="absolute left-4 sm:left-6 top-4">
          <MoveLeftIcon />
        </Link>
        <span className="sm:ml-8 text-lg sm:text-xl">
          {movieToShow?.name || "Browse other movies"}
        </span>
      </div>
      {movieToShow?.name && (
        <div className="px-4 sm:px-6 py-4 flex flex-col gap-5 overflow-x-hidden">
          {/* Top */}
          <div className="flex sm:gap-5 max-h-[70vh] min-h-[60vh]">
            {/* Movie Thumbnail */}
            <div className="flex w-[100%] sm:max-w-[30%]">
              <img
                loading="lazy"
                src={movieToShow?.movie_picture[0]?.picture}
                className="w-[100%] object-cover"
              />
            </div>

            {/* Movie trailer */}
            <div className="flex w-0 sm:w-[70%]">
              <div className="flex w-full justify-center bg-[rgb(26,26,26)]">
                <ReactPlayer
                  url={movieToShow?.trailer_url}
                  controls={true}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="flex flex-col md:flex-row gap-5 text-sm lg:text-md">
            {/* Movie details */}

            <div className="md:w-[30%] ">
              {/* Movie image and some info */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-2 items-center text-md">
                      <span className="bg-[#E7BA01] text-black rounded-md py-1 px-2 font-semibold">
                        {movieToShow?.rating}
                      </span>
                      <span>IMDb</span>
                    </div>

                    <span>•</span>
                    <span>{movieToShow?.language}</span>
                    <span>•</span>
                    <span>{movieToShow?.duration}</span>
                    <span>•</span>
                    <span>PG-{movieToShow?.pg_rating}</span>
                  </div>
                </div>

                {/* Description and cast */}
                <div className="flex flex-col gap-5">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-semibold mb-3">
                      About the movie
                    </h1>
                    <div className="">
                      <p>{movieToShow?.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h1 className="text-xl lg:text-2xl font-semibold mb-3">
                      Cast
                    </h1>
                    <div className="flex flex-wrap gap-3 md:gap-5">
                      {movieToShow?.movie_cast?.map((cast: any, i: number) => (
                        <div key={i}>
                          <div className="flex flex-col items-center gap-2">
                            <img
                              loading="lazy"
                              src={cast?.actor?.picture}
                              alt="cast_img"
                              className="object-cover h-16 w-16 lg:h-20  lg:w-20 rounded-full"
                            />
                            <p className="text-[14px] lg:text-md">
                              {cast?.actor?.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streaming details */}

            <div className="flex md:w-[70%] flex-col gap-4">
              {/* Streaming Dates */}
              <div className="flex gap-4 flex-col xsm:flex-row">
                <div className="bg-[rgb(36,36,36)] flex justify-center items-center rounded-lg py-1 lg:py-2 px-4 lg:px-6 shadow-xl">
                  <span className="text-center">Streaming on</span>
                </div>
                <div className="flex gap-4 flex-wrap items-center">
                  {streamingDates?.map((date, i) => (
                    <Button
                      key={i}
                      variant={"outline"}
                      className={cn(
                        selectedDate === date
                          ? "bg-[#E7BA01] text-black"
                          : "bg-[rgb(36,36,36)] ",
                        "p-1 sm:py-1 lg:py-2 sm:px-4 lg:px-6 w-fit rounded-lg border transition-all duration-300 hover:bg-[#b99b22]"
                      )}
                      onClick={() => {
                        setSelectedDate(date);
                      }}
                    >
                      {date}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Streaming cinema halls and times */}

              <div className="flex flex-col mt-4 border-t">
                {streamingOnDate?.map((cin: any, i) => (
                  <div
                    key={i}
                    className="flex flex-col xsm:flex-row items-start xsm:items-center gap-3 xsm:gap-10 md:text-lg border-b p-4 px-1"
                  >
                    <div className="flex flex-col gap-2 min-w-[300px] ">
                      <div className="flex flex-wrap gap-5">
                        <span className="overflow-hidden">
                          {cin?.cinema?.name}
                        </span>
                        <span className="flex gap-2 items-center md:items-start">
                          {" "}
                          <Star
                            className="h-4 md:h-6 w-4 md:w-6"
                            color="#E7BA01"
                            fill="#E7BA01"
                          />
                          {cin?.cinema?.rating} / 5
                        </span>
                      </div>
                      <div className="flex gap-5">
                        <div className="text-sm text-[#72BA9D] flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span>M-Ticket</span>
                        </div>

                        <div className="text-sm text-[#FFAE2D] flex items-center gap-2">
                          <Popcorn className="h-4 w-4" />
                          <span>Food & Beverage</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-5  lg:w-[70%]">
                      {cin?.showTimes?.map(
                        (
                          timeObj: { time: string; stream_id: number },
                          j: number
                        ) => (
                          <Link
                            key={j}
                            href={`/streaming/${timeObj?.stream_id}`}
                          >
                            <Button
                              variant={"outline"}
                              className="border bg-[rgb(36,36,36)] hover:bg-[#E7BA01] font-semibold transition-all duration-300"
                            >
                              {timeObj?.time}
                            </Button>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
