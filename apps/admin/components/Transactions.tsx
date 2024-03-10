"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "./CustomTable";
import { getDate2 } from "@/lib/commonFunctions";
import { PagesInterface, TableCellInterface } from "@/lib/commonInterfaces";
import CustomPagination from "./CustomPagination";
import { items_per_page } from "@/lib/constants";

const Transactions = () => {
  const [currPage, setCurrPage] = useState<number>(1);
  const [paymentData, setPaymentData] = useState<TableCellInterface[][]>([]);
  const [rows, setRows] = useState(1);
  const tableFields = ["Name", "Status", "Date", "Amount"];

  const selectPage = (page: number) => {
    if (currPage === page) return;
    setCurrPage(page);
    setPaymentData([]);
    getPayments(page * items_per_page - items_per_page, items_per_page);
  };

  const getPayments = async (skip: number = 0, take: number = 10) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const paymentsRes = await fetch(
      baseURL + `/api/getPayments?skip=${skip}&take=${take}`,
      {
        cache: "no-store",
      }
    );
    const data = await paymentsRes.json();
    const __payments: TableCellInterface[][] = data?.payments?.map(
      (item: any) => [
        {
          field: "name",
          value: item.customer.first_name + " " + item.customer.last_name,
          bold: true,
        },
        {
          field: "status",
          value: "Paid",
          color: "rgb(194,249,246)",
        },
        {
          field: "data",
          value: getDate2(item.created_at),
        },
        {
          field: "value",
          value: `₹${item.amount / 100}`,
        },
      ]
    );
    setRows(data?.total);
    setPaymentData(__payments);
  };

  useEffect(() => {
    getPayments(0, items_per_page);
    setCurrPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Transaction History</h1>
      <CustomTable
        fields={tableFields}
        data={paymentData}
        caption="A list of recent transactions"
      />
      <CustomPagination
        totalRows={rows}
        currPage={currPage}
        selectPage={selectPage}
      />
    </div>
  );
};

export default Transactions;
