"use client";
import AddItem from "@/components/AddItem";
import CustomPagination from "@/components/CustomPagination";
import SearchBar from "@/components/CustomSearch";
import CustomTable from "@/components/CustomTable";
import { getDate2 } from "@/lib/commonFunctions";
import { TableCellInterface } from "@/lib/commonInterfaces";
import { items_per_page } from "@/lib/constants";
import React, { useEffect, useState } from "react";

const Actors = () => {
  const [rows, setRows] = useState(1);
  const [actors, setActors] = useState<TableCellInterface[][]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const tableFields = ["Name", "Popularity Rating (/5)", "Movies", "Picture"];

  const selectPage = (page: number) => {
    if (currPage === page) return;
    setCurrPage(page);
    setActors([]);
    getActors(page * items_per_page - items_per_page, items_per_page);
  };

  const getStarredMovies = (movie_cast: any) => {
    let i = 0,
      n = Math.min(5, movie_cast.length),
      str = "";

    for (i = 0; i < n; i++) {
      str += movie_cast[i]?.movie?.name;
      if (i !== n - 1) {
        str += ",\n";
      }
    }

    if (movie_cast?.length > n) {
      str += ", etc.";
    }
    return str;
  };

  const getActors = async (skip: number = 0, take: number = 10) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(
      baseURL + `/api/getActors?skip=${skip}&take=${take}`,
      {
        cache: "no-store",
      }
    );
    const data = await res.json();
    const __actors: TableCellInterface[][] = data?.actors?.map((item: any) => [
      {
        field: "name",
        value: item.name,
        bold: true,
      },
      {
        field: "popularity_rating",
        value: item?.popularity_rating,
      },
      {
        field: "movies",
        value: getStarredMovies(item?.movie_cast),
      },
      {
        field: "picture",
        image: item.picture,
      },
    ]);
    setRows(data?.total);
    setActors(__actors);
  };

  useEffect(() => {
    getActors(0, items_per_page);
  }, []);

  return (
    <div className="p-6 flex flex-col gap-10 h-[85vh] overflow-scroll">
      <section>
        <AddItem link="/dashboard/actors/add-actor" text="Add Actor(s)" />
      </section>

      <section className="w-full flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">View All Actors</h1>
          <SearchBar apiRoute="getActorByName" placeholder="Enter a name" />
        </div>
        <CustomTable
          fields={tableFields}
          data={actors}
          caption="List of all the actors"
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

export default Actors;
