"use client";
import CustomPagination from "@/components/CustomPagination";
import SearchBar from "@/components/CustomSearch";
import CustomTable from "@/components/CustomTable";
import { getDate2 } from "@/lib/commonFunctions";
import { TableCellInterface } from "@/lib/commonInterfaces";
import { items_per_page } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Cinemas = () => {
  const [rows, setRows] = useState(1);
  const [cinemas, setCinemas] = useState<TableCellInterface[][]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const tableFields = ["Name", "Rating", "City", "State", "Operating Since"];
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");

  const selectPage = (page: number) => {
    if (currPage === page) return;
    setCurrPage(page);
    setCinemas([]);
    getCinemas(page * items_per_page - items_per_page, items_per_page);
  };

  const getCinemas = async (skip: number = 0, take: number = 10) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const usersRes = await fetch(
      baseURL + `/api/getCinemas?skip=${skip}&take=${take}`,
      {
        cache: "no-store",
      }
    );
    const data = await usersRes.json();
    const __cinemas: TableCellInterface[][] = data?.cinemas?.map(
      (item: any) => [
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
          field: "city",
          value: item.city,
        },
        {
          field: "state",
          value: item.state,
        },
        {
          field: "operating since",
          value: getDate2(item.created_at),
        },
      ]
    );
    setRows(data?.total);
    setCinemas(__cinemas);
  };

  useEffect(() => {
    const page = parseInt(pageNumber!) || 1;
    getCinemas(page * items_per_page - items_per_page, items_per_page);
    setCurrPage(page);
  }, []);

  return (
    <div className="p-6 flex gap-10 h-[85vh] overflow-scroll">
      <section className="w-full flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">View All Cinemas</h1>
          <SearchBar apiRoute="getCinemaByName" placeholder="Enter a name" />
        </div>
        <CustomTable
          fields={tableFields}
          data={cinemas}
          caption="List of all the cinemas"
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

export default Cinemas;
