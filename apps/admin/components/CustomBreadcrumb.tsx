"use client";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface PathRoutesInterface {
  path: string;
  link: string;
}

const CustomBreadcrumb = () => {
  const pathname = usePathname();
  const [pathRoutes, setPathRoutes] = useState<PathRoutesInterface[]>([]);

  const changePathFormat = (s: string) => {
    const parts = s.split("-");
    let capitalisedString = "";
    parts?.forEach((p) => {
      capitalisedString += p[0].toUpperCase() + p.slice(1) + " ";
    });

    return capitalisedString;
  };

  const getPathRoutes = () => {
    const __pathsTemp = pathname?.split("/")?.slice(1);
    const __paths = __pathsTemp?.map((p) => {
      return {
        path: changePathFormat(p),
        link: pathname.split(p)[0] + p,
      };
    });
    setPathRoutes(__paths);
  };
  useEffect(() => {
    getPathRoutes();
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathRoutes?.map((item: PathRoutesInterface, i: number) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={item?.link}>{item?.path}</BreadcrumbLink>
            </BreadcrumbItem>
            {i < pathRoutes.length - 1 ? <BreadcrumbSeparator /> : null}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
