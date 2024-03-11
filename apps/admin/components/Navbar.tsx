"use client";
import { useClerk } from "@clerk/nextjs";
import { BellRingIcon } from "lucide-react";
import { useEffect } from "react";
import CustomUserButton from "./CustomUserButton";
import Image from "next/image";

const Navbar = () => {
  const { user } = useClerk();

  const greet = (name: string) => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greeting;

    if (currentHour < 12) {
      greeting = "Good Morning";
    } else if (currentHour < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }

    return `${greeting}, ${name}!`;
  };

  return (
    <div className="p-6 flex justify-between">
      {/* Greeting */}
      <div className="flex items-center gap-5">
        {/* User Image */}
        <div className="border-2 border-[rgba(0,0,0,0.15)] p-1 rounded-full">
          {/* img */}
          <div className="h-12 w-12 relative rounded-full overflow-hidden">
            <Image src={user?.imageUrl!} alt="user" fill />
          </div>
        </div>

        {/* Greet */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">{greet(user?.firstName!)}</h1>
          <span className="text-sm text-muted-foreground">
            Have an in-depth look at all the metrics within your dashboard
          </span>
        </div>
      </div>
      {/* Controls */}

      <div className="flex gap-3 items-center ">
        <BellRingIcon className="text-[rgb(180,180,180)] mr-4" />
        <CustomUserButton />
      </div>
    </div>
  );
};

export default Navbar;
