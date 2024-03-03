"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PathInterface {
  name: string;
  link: string;
}

const Breadcrumps = ({ paths }: { paths: PathInterface[] }) => {
  return (
    <div className="flex items-center gap-3 text-sm">
      {paths?.map((path, i) => (
        <>
          <Link
            key={i}
            href={path?.link}
            className={`${
              i === paths.length - 1
                ? "text-muted-foreground cursor-default"
                : "cursor-pointer hover:underline underline-offset-4"
            } `}
          >
            {path.name}
          </Link>
          {i !== paths.length - 1 ? <ChevronRight className="h-5 w-5" /> : null}
        </>
      ))}
    </div>
  );
};

export default Breadcrumps;
