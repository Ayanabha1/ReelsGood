"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const AddItem = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-5">
      <h1 className="text-xl">Add an actor</h1>
      <Button
        variant="outline"
        className="shadow-md"
        onClick={() => {
          router.push("actors/add-actor");
        }}
      >
        Add Actor
      </Button>
    </div>
  );
};

export default AddItem;
