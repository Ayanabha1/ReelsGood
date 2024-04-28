"use client";
import CustomButton from "@/components/CustomButton";
import { CinemaInterface } from "@/lib/commonInterfaces";
import React, { useEffect, useState } from "react";

const ModifyCinemaSeats = ({
  params,
}: {
  params: { cinemaId: React.ReactNode };
}) => {
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [cinema, setCinema] = useState<CinemaInterface>();

  const getCinema = async () => {
    const { cinemaId } = params;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const usersRes = await fetch(
      baseURL + `/api/getCinemaById?cinema_id=${cinemaId}`,
      {
        cache: "no-store",
      }
    );

    const data = await usersRes.json();
    setCinema(data?.data);
    console.log(data);
  };
  useEffect(() => {
    getCinema();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-10 h-[85vh] overflow-scroll">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl">
          {cinema?.name || "Cinema"}: Modify Seating Arrangement
        </h1>

        <CustomButton
          variant="outline"
          loading={loading}
          className="shadow"
          disabled={!changed}
        >
          Save Changes
        </CustomButton>
      </div>
    </div>
  );
};

export default ModifyCinemaSeats;
