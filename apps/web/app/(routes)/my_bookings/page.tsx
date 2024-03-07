"use client";
import { loadingInterfaceType } from "@/CommonInterfaces/shared_interfaces";
import Breadcrumps from "@/components/Breadcrumps";
import Ticket from "@/components/Ticket";
import { useLoader } from "@/hooks/loader";
import { showError } from "@/lib/commonFunctions";
import { auth, useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { userId } = useAuth();
  const [bookings, setBookings] = useState([]);
  const loader: loadingInterfaceType = useLoader();
  const [paths, setPaths] = useState([
    { name: "Home", link: "/movies" },
    { name: "My Bookings", link: "/my_booking" },
  ]);

  const getTickets = async () => {
    loader.setLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(
        `${baseURL}/getAllBookings?customer_id=${userId}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();
      if (res.status > 200) {
        throw new Error(data?.message);
      }
      setBookings(data?.bookings);
    } catch (error: any) {
      showError(error?.message);
    }
    loader.setLoading(false);
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="px-6 py-4">
      <title>Bookings - ReelsGood</title>
      <h1 className="text-2xl mb-4 text-center md:text-left">My bookings</h1>
      <Breadcrumps paths={paths} />
      {bookings?.length > 0 ? (
        <div className="flex justify-center md:justify-normal flex-wrap gap-10">
          {bookings?.map((item, i) => (
            <Ticket ticketData={item} key={i} />
          ))}
        </div>
      ) : (
        <h1 className="text-3xl text-center text-[rgb(248,250,252)]">
          No bookings found
        </h1>
      )}
    </div>
  );
};

export default Page;
