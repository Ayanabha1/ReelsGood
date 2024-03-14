"use client";
import CustomTable from "@/components/CustomTable";
import { getDate2, getTime, showError } from "@/lib/commonFunctions";
import {
  CinemaInterface,
  MovieInterface,
  TableCellInterface,
} from "@/lib/commonInterfaces";
import React, { useEffect, useState } from "react";

interface StreamingInterface {
  date: Date;
  cinema: CinemaInterface;
  id: number | string;
}

const page = ({
  params,
}: {
  params: { movieId: React.ReactNode; cinemaId: React.ReactNode };
}) => {
  const tableFields = ["Cinema", "Date", "Time"];
  const [movie, setMovie] = useState<MovieInterface>();
  const [cinema, setCinema] = useState<CinemaInterface>();
  const [tableData, setTableData] = useState<TableCellInterface[][]>([]);

  const getStreamingData = async () => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const movieId = params.movieId,
      cinemaId = params.cinemaId;
    if (!movieId) {
      showError("Please go back and select a movie");
      return;
    }
    const res = await fetch(
      baseURL +
        `/api/getStreamingInCinema?movie_id=${movieId}&cinema_id=${cinemaId}`,
      {
        cache: "no-store",
      }
    );
    const data = await res.json();
    const __tableData: TableCellInterface[][] = data?.data?.map(
      (item: StreamingInterface): TableCellInterface[] => [
        {
          field: "id",
          value: item?.cinema?.id,
          metadata: true,
        },
        {
          field: "Cinema",
          value: item?.cinema?.name,
        },
        {
          field: "Date",
          value: getDate2(item?.date),
        },
        {
          field: "Time",
          value: getTime(item?.date),
        },
      ]
    );
    setCinema(data?.cinema);
    setCinema(data?.movie);
    setTableData(__tableData);
  };
  useEffect(() => {
    getStreamingData();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-10 h-[85vh] overflow-scroll">
      <h1 className="text-2xl font-semibold">
        Streaming times of movie in cinema
      </h1>

      <CustomTable fields={tableFields} data={tableData} />
    </div>
  );
};

export default page;
