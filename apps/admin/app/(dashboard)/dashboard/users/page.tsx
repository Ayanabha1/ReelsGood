"use client";
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
  const [users, setUsers] = useState<TableCellInterface[][]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const tableFields = ["First Name", "Last Name", "Email", "Customer Since"];
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");

  const selectPage = (page: number) => {
    if (currPage === page) return;
    setCurrPage(page);
    setUsers([]);
    getUsers(page * items_per_page - items_per_page, items_per_page);
  };

  const getUsers = async (skip: number = 0, take: number = 10) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const usersRes = await fetch(
      baseURL + `/api/getUsers?skip=${skip}&take=${take}`,
      {
        cache: "no-store",
      }
    );
    const data = await usersRes.json();
    const __users: TableCellInterface[][] = data?.users?.map((item: any) => [
      {
        field: "first_name",
        value: item.first_name,
        bold: true,
      },
      {
        field: "last_name",
        value: item.last_name,
      },
      {
        field: "email",
        value: item.email,
      },
      {
        field: "Customer since",
        value: getDate2(item.created_at),
      },
    ]);
    setRows(data?.total);
    setUsers(__users);
  };

  useEffect(() => {
    const page = parseInt(pageNumber!) || 1;
    getUsers(page * items_per_page - items_per_page, items_per_page);
    setCurrPage(page);
  }, []);

  return (
    <div className="p-6 flex gap-10 h-[85vh] overflow-scroll">
      <section className="w-full flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">View All Customers</h1>
          <SearchBar
            apiRoute="getUsersByName"
            placeholder="Enter name or email"
          />
        </div>
        <CustomTable
          fields={tableFields}
          data={users}
          caption="List of all the users"
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
