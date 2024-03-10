"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCellInterface } from "@/lib/commonInterfaces";
import { cn } from "@/lib/utils";

const CustomTable = ({
  fields,
  data,
}: {
  fields: string[];
  data: TableCellInterface[][];
}) => {
  return (
    <Table>
      {data?.length === 0 ? (
        <TableCaption>A list of recent transactions.</TableCaption>
      ) : null}
      <TableHeader>
        <TableRow>
          {fields?.map((item, i) => (
            <TableHead
              className={cn("pl-0", i === 0 ? "text-left" : "text-right")}
              key={i}
            >
              {item}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, i) => (
          <TableRow key={i}>
            {item?.map((field, j) => (
              <TableCell
                key={`${i}+${j}`}
                className={cn(
                  "pl-0 text-[1rem]",
                  j === 0 ? "text-left" : "text-right"
                )}
              >
                {field.value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
