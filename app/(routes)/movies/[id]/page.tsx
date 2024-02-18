"use client";
import { Button } from "@/components/ui/button";
import { getDate, getDate2, getTime } from "@/lib/commonFunctions";
import { cn } from "@/lib/utils";
import { HeartIcon, Popcorn, Smartphone, Star } from "lucide-react";
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

  const getCinemas = async () => {
    const { id } = params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const res = await fetch(`${baseUrl}/getMovie/?id=${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
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
    <>
      {movieToShow?.name && (
        <div className="px-6 py-4 flex gap-10">
          {/* left */}
          <div className="w-[30%] min-w-[300px] ">
            {/* Movie image and some info */}
            <div className="flex flex-col gap-5">
              <div className="">
                {movieToShow?.movie_picture && (
                  <img
                    loading="lazy"
                    src={movieToShow?.movie_picture[0]?.picture}
                    className="w-full h-[500px] object-cover "
                  />
                )}
              </div>

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
                  <h1 className="text-2xl font-semibold mb-3">
                    About the movie
                  </h1>
                  <div>
                    <p>{movieToShow?.description}</p>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-semibold mb-3">Cast</h1>
                  <div className="flex flex-wrap gap-5">
                    {movieToShow?.movie_cast?.map((cast: any, i: number) => (
                      <div key={i}>
                        <div className=" ">
                          <img
                            loading="lazy"
                            src={cast?.actor?.picture}
                            alt="cast_img"
                            className="object-cover h-20 w-20 rounded-full"
                          />
                          <p className="w-24 break-words">
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

          {/* Right */}
          <div className="flex-grow flex flex-col gap-4">
            {/* Movie trailer */}
            <div className="w-full h-[500px] flex justify-center bg-[rgb(26,26,26)]">
              <ReactPlayer
                url={movieToShow?.trailer_url}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>

            {/* Streaming Dates */}
            <div className="flex gap-4 items-center">
              <span className="text-lg">Streaming on:</span>
              {streamingDates?.map((date, i) => (
                <Button
                  key={i}
                  variant={"outline"}
                  className={cn(
                    selectedDate === date
                      ? "bg-[#E7BA01] text-black"
                      : "bg-[rgb(36,36,36)] ",
                    "py-2 px-6 w-fit rounded-lg border transition-all duration-300 hover:bg-[#b99b22]"
                  )}
                  onClick={() => {
                    setSelectedDate(date);
                  }}
                >
                  {date}
                </Button>
              ))}
            </div>

            {/* Streaming cinema halls and times */}

            <div className="flex flex-col mt-4 border-t">
              {streamingOnDate?.map((cin: any, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-lg border-b p-4"
                >
                  <div className="flex flex-col sm:gap-0 gap-2">
                    <div className="flex gap-5">
                      <span className="overflow-hidden">
                        {cin?.cinema?.name}
                      </span>
                      <span className="flex gap-2">
                        {" "}
                        <Star
                          className="h-6 w-6"
                          color="#E7BA01"
                          fill="#E7BA01"
                        />
                        {cin?.cinema?.rating} / 5
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-20 items-start sm:items-end">
                      <div className="flex gap-10">
                        <div className="text-sm text-[#72BA9D] flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span>M-Ticket</span>
                        </div>

                        <div className="text-sm text-[#FFAE2D] flex items-center gap-2">
                          <Popcorn className="h-4 w-4" />
                          <span>Food & Beverage</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-5">
                        {cin?.showTimes?.map(
                          (
                            timeObj: { time: string; stream_id: number },
                            j: number
                          ) => (
                            <Link href={`/streaming/${timeObj?.stream_id}`}>
                              <Button
                                key={j}
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
