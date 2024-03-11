"use client";
import { useEffect, useCallback, useState } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

const useDebounce = (effect: any, dependencies: any, delay: any) => {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
};

const SearchBar = ({
  placeholder = "Please search for something",
  apiRoute,
}: {
  placeholder: string;
  apiRoute: string;
}) => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<any>([]);
  const handleInputChange = (str: string) => {
    setInput(str.trim());
  };

  const searchItem = async (str: string) => {
    if (!apiRoute) return;
    if (str === "") {
      setResult([]);
      return;
    }
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(baseURL + `/api/${apiRoute}?data=${str}`);
    const data = await res.json();
    setResult(data?.data);
  };

  useDebounce(
    () => {
      searchItem(input);
    },
    [input],
    700
  );

  return (
    <div className="relative w-[400px] rounded-md shadow">
      <SearchIcon className="absolute top-[50%] translate-y-[-50%] left-2 h-5 w-5 text-[rgba(0,0,0,0.35)]" />
      <Input
        placeholder={`${placeholder} (min 2 letters)`}
        className="pl-9"
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
      />
      <Card
        className={cn(
          "absolute -bottom-1 translate-y-[100%] w-full rounded-tl-none rounded-tr-none shadow z-[10]",
          !input && "hidden"
        )}
      >
        {result?.length === 0 && input ? (
          <p className="p-2">No search result</p>
        ) : null}

        <div className="flex flex-col max-h-[300px] overflow-scroll">
          {result?.map((item: any, i: number) => (
            <div
              className={cn(
                "flex p-4 cursor-pointer hover:bg-[rgba(0,0,0,0.05)]",
                i !== result?.length - 1 && "border-b"
              )}
              key={i}
            >
              <span>{item?.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SearchBar;
