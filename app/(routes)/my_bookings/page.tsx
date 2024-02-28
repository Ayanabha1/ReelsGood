"use client";
import Ticket from "@/components/Ticket";
import { auth, useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { userId } = useAuth();
  const [bookings, setBookings] = useState([]);

  const getTickets = async () => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseURL}/getAllBookings?customer_id=${userId}`, {
      cache: "no-store",
    });

    const data = await res.json();
    setBookings(data?.bookings);
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="px-6 py-4">
      <title>Bookings - ReelsGood</title>
      <h1 className="text-2xl mb-4">My bookings</h1>
      <div className="flex flex-wrap gap-10">
        {bookings?.map((item, i) => (
          <Ticket ticketData={item} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Page;
