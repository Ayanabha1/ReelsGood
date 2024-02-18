"use client";
import { Button } from "@/components/ui/button";
import { getDate, getTime } from "@/lib/commonFunctions";
import { HeartIcon, Popcorn, Smartphone, Star } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

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
      const date = getDate(d);
      __dates.push(date);
    });
    __dates = __dates.filter((item, i, date) => date.indexOf(item) === i);
    __dates = __dates.sort();
    setStreamingDates(__dates);
    setSelectedDate(__dates[0]);
  };

  const getCinemasWihDates = (date: string | null) => {
    let __cinemas = streamingCinemas?.filter(
      (cin: any) => getDate(cin?.date) === date
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
    getCinemas();
  }, []);

  return (
    <>
      <div className="px-6 py-4">
        <h1 className="text-2xl">{movieToShow?.name}</h1>
        {/* dates */}
        <div className="mt-5 flex flex-wrap gap-5">
          {streamingDates?.map((date, i) => (
            <Button
              key={i}
              variant={"outline"}
              className="bg-[rgb(36,36,36)] py-2 px-6 w-fit rounded-lg border border-[rgba(255,255,255,0.3)]"
              onClick={() => {
                getCinemasWihDates(date);
              }}
            >
              {date}
            </Button>
          ))}
        </div>
        <div className="flex flex-col mt-10 border-t">
          {streamingOnDate?.map((cin: any, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-lg border-b p-4"
            >
              <div className="flex flex-col sm:gap-0 gap-2">
                <div className="flex gap-5">
                  <span className="overflow-hidden w-48">
                    {cin?.cinema?.name}
                  </span>
                  <span className="flex">
                    {" "}
                    <Star className="h-6 w-6" color="#FFD447" fill="#FFD447" />
                    {cin?.cinema?.rating}/5
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
                            className="border border-[#72BA9D] text-[#72BA9D] font-semibold"
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
    </>
  );
};

export default Page;
