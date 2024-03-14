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
  caption = "Fetching data...",
  clickCb,
}: {
  fields: string[];
  data: TableCellInterface[][];
  caption?: string;
  clickCb?: (item: any) => void;
}) => {
  const clickHandler = (item: any) => {
    if (clickCb) {
      // Changing data format
      const data = item?.reduce((acc: any, d: TableCellInterface) => {
        acc[d.field!] = d.value;
        return acc;
      }, {});
      clickCb(data);
    }
  };
  return (
    <div className="border p-2 px-4 rounded-lg shadow-md">
      <Table>
        {data?.length === 0 ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          <TableRow>
            {fields?.map((item, i) => (
              <TableHead
                className={cn(
                  " max-w-[200px]",
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
            <TableRow
              key={i}
              onClick={() => {
                clickHandler(item);
              }}
            >
              {item?.map((field, j) => {
                if (field?.metadata === true) {
                  // do not render
                  return null;
                } else {
                  return (
                    <TableCell
                      key={`${i}+${j}`}
                      className={cn(
                        " max-w-[200px] overflow-auto text-[1rem] cursor-pointer",
                        j !== item?.length - 1 && "border-r"
                      )}
                    >
                      <div className={cn("flex")}>
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
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
