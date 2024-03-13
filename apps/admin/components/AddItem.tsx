"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddItem = ({ link, text }: { link: string; text: string }) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-5">
      <h1 className="text-xl">{text}</h1>
      <Link href={link}>
        <Button variant="outline" className="shadow-md text-[16px]">
          {text}
        </Button>
      </Link>
    </div>
  );
};

export default AddItem;
