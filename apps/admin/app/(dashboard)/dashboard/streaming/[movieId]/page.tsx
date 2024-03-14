"use client";
import CustomTable from "@/components/CustomTable";
import { showError } from "@/lib/commonFunctions";
import { CinemaInterface, TableCellInterface } from "@/lib/commonInterfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface MovieInterface {
  name: string;
}

interface StreamingInterface {
  cinema: CinemaInterface;
  streaming: { date: Date };
}

const MovieStreaming = ({
  params,
}: {
  params: { movieId: React.ReactNode };
}) => {
  const router = useRouter();
  const [tableData, setTableData] = useState<TableCellInterface[][]>([]);
  const [movie, setMovie] = useState<MovieInterface>();
  const tableFields = ["Cinema", "Cinema Rating", "City", "State", "Added On"];
  const getStreamingData = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const movieId = params.movieId;
      if (!movieId) {
        showError("Please go back and select a movie");
        return;
      }
      const res = await fetch(
        baseURL + `/api/getStreaming?movie_id=${movieId}`,
        {
          cache: "no-store",
        }
      );
      const __data = await res.json();
      if (res?.status > 200) {
        console.log(__data);
        throw new Error(__data?.message);
      }
      const __tableData: TableCellInterface[][] = __data?.data?.map(
        (item: StreamingInterface): TableCellInterface[] => [
          {
            field: "id",
            value: item?.cinema?.id,
            metadata: true,
          },
          {
            field: "name",
            value: item?.cinema?.name,
          },
          {
            field: "rating",
            value: item?.cinema?.rating,
          },
          {
            field: "city",
            value: item?.cinema?.city,
          },
          {
            field: "state",
            value: item?.cinema?.state,
          },
          {
            field: "created_at",
            value: item?.cinema?.created_at,
          },
        ]
      );

      setMovie(__data?.movie);
      setTableData(__tableData);
    } catch (error: any) {
      showError(error?.message || error);
    }
  };

  const selectCinema = (data: CinemaInterface) => {
    if (data?.id) {
      router.push(`/dashboard/streaming/${params.movieId}/${data?.id}`);
    }
  };

  useEffect(() => {
    getStreamingData();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-10 h-[85vh] overflow-scroll">
      <h1 className="text-2xl font-semibold">
        {movie?.name} | Select a cinema{" "}
      </h1>
      <CustomTable
        fields={tableFields}
        data={tableData}
        clickCb={selectCinema}
        caption="Movie streaming at"
      />
    </div>
  );
};

export default MovieStreaming;
