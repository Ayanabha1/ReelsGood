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
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
});

const CustomTable = ({
  fields,
  data,
  caption,
}: {
  fields: string[];
  data: TableCellInterface[][];
  caption: string;
}) => {
  return (
    <div className="border p-2 px-4 rounded-lg shadow-md">
      <Table>
        {data?.length === 0 ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          <TableRow>
            {fields?.map((item, i) => (
              <TableHead
                className={cn(
                  "pl-0 max-w-[200px]",
                  i === 0 ? " text-left" : "text-right",
                  i !== fields?.length - 1 && "border-r"
                )}
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
                    "pl-0 max-w-[200px] overflow-auto text-[1rem] ",
                    j !== item?.length - 1 && "border-r"
                  )}
                >
                  <div
                    className={cn(
                      "flex",
                      j === 0 ? "justify-start" : "justify-end"
                    )}
                  >
                    {field.image ? (
                      <div className="relative h-40 w-40 ">
                        <Image
                          src={field.image}
                          alt="Image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <pre
                      className={cn(
                        poppins.className,
                        "pl-0 text-[1rem] break-words overflow-scroll"
                      )}
                    >
                      {field.value}
                    </pre>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
