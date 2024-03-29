"use client";
import AddItem from "@/components/AddItem";
import CustomPagination from "@/components/CustomPagination";
import SearchBar from "@/components/CustomSearch";
import CustomTable from "@/components/CustomTable";
import { getDate2 } from "@/lib/commonFunctions";
import { TableCellInterface } from "@/lib/commonInterfaces";
import { items_per_page } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Users = () => {
  const [rows, setRows] = useState(1);
  const [movies, setMovies] = useState<TableCellInterface[][]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const tableFields = [
    "Name",
    "Rating",
    "PG Rating",
    "Duration",
    "Language",
    "Added On",
  ];
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");

  const selectPage = (page: number) => {
    if (currPage === page) return;
    setCurrPage(page);
    setMovies([]);
    getMovies(page * items_per_page - items_per_page, items_per_page);
  };

  const getMovies = async (skip: number = 0, take: number = 10) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const usersRes = await fetch(
      baseURL + `/api/getMovies?skip=${skip}&take=${take}`,
      {
        cache: "no-store",
      }
    );
    const data = await usersRes.json();
    const __users: TableCellInterface[][] = data?.movies?.map((item: any) => [
      {
        field: "name",
        value: item.name,
        bold: true,
      },
      {
        field: "rating",
        value: item.rating,
      },
      {
        field: "pg_rating",
        value: item.pg_rating,
      },
      {
        field: "duration",
        value: item.duration,
      },
      {
        field: "language",
        value: item.language,
      },
      {
        field: "Added On",
        value: getDate2(item.created_at),
      },
    ]);
    setRows(data?.total);
    setMovies(__users);
  };

  useEffect(() => {
    const page = parseInt(pageNumber!) || 1;
    getMovies(page * items_per_page - items_per_page, items_per_page);
    setCurrPage(page);
  }, []);

  return (
    <div className="p-6 flex gap-10 h-[85vh] overflow-scroll">
      <section className="w-full flex flex-col gap-10">
        <div>
          <AddItem link="/dashboard/movies/add-movie" text="Add Movie(s)" />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">View All Movies</h1>
          <SearchBar apiRoute="getMovieByName" placeholder="Enter a name" />
        </div>
        <CustomTable
          fields={tableFields}
          data={movies}
          caption="List of all the movies"
        />
        <CustomPagination
          currPage={currPage}
          selectPage={selectPage}
          totalRows={rows}
        />
      </section>
    </div>
  );
};

export default Users;
