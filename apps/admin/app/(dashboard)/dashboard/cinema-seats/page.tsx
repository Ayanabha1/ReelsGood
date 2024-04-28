"use client";
import AddItem from "@/components/AddItem";
import CustomPagination from "@/components/CustomPagination";
import SearchBar from "@/components/CustomSearch";
import CustomTable from "@/components/CustomTable";
import { getDate2 } from "@/lib/commonFunctions";
import { CinemaInterface, TableCellInterface } from "@/lib/commonInterfaces";
import { items_per_page } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CinemaSeats = () => {
  const [rows, setRows] = useState(1);
  const [cinemas, setCinemas] = useState<TableCellInterface[][]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const tableFields = [
    "Id",
    "Name",
    "Rating",
    "City",
    "State",
    "Operating Since",
  ];
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");
  const router = useRouter();

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
          field: "id",
          value: item.id,
          bold: true,
        },
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

  const selectCinema = (item: CinemaInterface) => {
    if (item?.id) {
      router.push(`/dashboard/cinema-seats/${item?.id}`);
    }
  };

  useEffect(() => {
    const page = parseInt(pageNumber!) || 1;
    getCinemas(page * items_per_page - items_per_page, items_per_page);
    setCurrPage(page);
  }, []);

  return (
    <div className="p-6 flex flex-col gap-10 h-[85vh] overflow-scroll">
      <section>
        <AddItem link="/dashboard/cinemas/add-cinema" text="Add Cinema(s)" />
      </section>
      <section className="w-full flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Cinemas | Select A Cinema</h1>
          <SearchBar apiRoute="getCinemaByName" placeholder="Enter a name" />
        </div>
        <CustomTable
          fields={tableFields}
          data={cinemas}
          clickCb={selectCinema}
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

export default CinemaSeats;
