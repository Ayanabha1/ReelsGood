"use client";
import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { useLoader } from "@/hooks/loader";
import { loadingInterfaceType } from "@/CommonInterfaces/shared_interfaces";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-[3px]">
      <Card className="flex flex-col gap-2 items-center w-fit py-4 px-6 border border-[rgba(106,106,106,0.45)] shadow-xl bg-[rgb(22,22,22)]">
        <div className="relative h-16 w-16">
          <Image src="/logo.png" alt="logo" fill />
        </div>
        <h1 className="text-2xl">Loading</h1>
      </Card>
    </div>
  );
};

const LoadingWrapper = () => {
  const loader: loadingInterfaceType = useLoader();

  if (loader.loading) {
    return <Loading />;
  }
  return null;
};

export default LoadingWrapper;
