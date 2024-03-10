"use client";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import {
  ChevronDown,
  LogOutIcon,
  SettingsIcon,
  TicketIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CustomUserButton = () => {
  const { signOut, openUserProfile, closeUserProfile, user } = useClerk();
  const [profileCardOpen, setProfileCardOpen] = useState(false);
  const router = useRouter();
  const profileCardRef = useRef<HTMLInputElement>(null);
  const userButtonRef = useRef<HTMLInputElement>(null);

  const menuOptions = [
    {
      name: "Manage account",
      icon: SettingsIcon,
      action: () => {
        openUserProfile();
        setProfileCardOpen(false);
      },
    },
    {
      name: "Sign out",
      icon: LogOutIcon,
      action: () => {
        signOut();
        setProfileCardOpen(false);
      },
    },
  ];

  const handleMouseClick = (e: any) => {
    if (userButtonRef.current && userButtonRef.current.contains(e.target)) {
      setProfileCardOpen((prev) => !prev);
    } else if (
      profileCardRef.current &&
      !profileCardRef.current.contains(e.target)
    ) {
      setProfileCardOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseClick);

    return () => {
      document.removeEventListener("mousedown", handleMouseClick);
    };
  }, []);

  return (
    <div className="relative cursor-pointer">
      <div className="flex items-center gap-2" ref={userButtonRef}>
        <div className="relative h-10 w-10">
          <Image
            className="rounded-full "
            alt="profile image"
            src={user?.imageUrl!}
            fill
          />
        </div>
        <span className="text-lg">{user?.fullName} </span>
        <ChevronDown />
      </div>

      <Card
        className={`${
          profileCardOpen ? "flex-col  translate-y-[106%]" : "hidden"
        } z-10 border-none absolute bottom-0 right-0 items-start shadow-2xl overflow-hidden transition-all duration-500`}
        ref={profileCardRef}
      >
        <div className="flex gap-4 p-5 px-8">
          <div className="relative h-[40px] w-[40px]">
            <Image
              className="rounded-full"
              alt="profile image"
              src={user?.imageUrl!}
              fill
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{user?.fullName}</span>
            <span className="text-[rgb(158,158,159)] text-sm">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        </div>

        <ul className="text-sm text-[rgb(158,158,159)] flex flex-col w-full mb-5">
          {menuOptions?.map((op, i) => (
            <li
              key={i}
              className="cursor-pointer flex gap-7 items-center hover:bg-[rgba(220,220,220)] hover:text-black py-4 px-10 w-full"
              onClick={op.action}
            >
              <op.icon className="h-4 w-4" /> {op.name}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CustomUserButton;
