import { cn } from "@/lib/utils";
import { TriangleIcon } from "lucide-react";
import React from "react";

const IncreasePercentage = ({
  value,
  text,
  textColor,
}: {
  value: string;
  text?: string;
  textColor?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-fit flex text-[rgb(73,203,110)] bg-[rgb(197,250,218)] px-2  rounded-lg items-center text-[12px]">
        <TriangleIcon className="h-2 w-2" fill="rgb(73,203,110)" />
        <span className="mt-[1px]">+{value}</span>
      </div>
      {text ? (
        <span
          className={cn(
            "text-sm ",
            textColor ? `text-[${textColor}]` : "text-muted-foreground"
          )}
        >
          {text}
        </span>
      ) : null}
    </div>
  );
};

export default IncreasePercentage;
