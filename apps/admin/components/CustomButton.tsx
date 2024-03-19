import React from "react";
import WhiteSpinner from "@/assets/spinner_white.gif";
import BlackSpinner from "@/assets/spinner_black.gif";
import { Button } from "./ui/button";
import Image from "next/image";

const CustomButton = ({
  children,
  variant = "default",
  type = "button",
  disabled,
  className,
  onClick,
  loading = false,
}: {
  children?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: (args: any) => void;
  loading?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={(disabled ? disabled : false) || (loading ? true : disabled)}
      type={type}
      variant={variant}
      className={`py-2 px-6 flex justify-center items-center text-md rounded-md  ${
        disabled
          ? "cursor-not-allowed bg-opacity-80"
          : "cursor-pointer hover:bg-opacity-90 "
      } transition-all duration-150 ${className}`}
    >
      {loading ? (
        <div className="relative h-6 w-6">
          <Image
            src={variant === "outline" ? BlackSpinner! : WhiteSpinner!}
            alt="loading"
          />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
