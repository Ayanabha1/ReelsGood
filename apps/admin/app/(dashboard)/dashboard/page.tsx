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

const Dashboard = () => {
  return (
    <div className="p-6">
      {/* Space from some banners and other stuff */}

      {/* Transaction History */}

      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-semibold">Transaction History</h1>
        <Table>
          <TableCaption>A list of recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-0">Name</TableHead>
              <TableHead className="pl-0">Status</TableHead>
              <TableHead className="pl-0">Date</TableHead>
              <TableHead className="pl-0">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="pl-0">Ayanabha Misra</TableCell>
              <TableCell className="pl-0">Paid</TableCell>
              <TableCell className="pl-0">Jul 01, 2024</TableCell>
              <TableCell className="pl-0">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
