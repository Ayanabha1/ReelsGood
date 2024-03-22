"use client";
import { PagesInterface } from "@/lib/commonInterfaces";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { items_per_page } from "@/lib/constants";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const CustomPagination = ({
  currPage,
  totalRows,
  selectPage,
}: {
  currPage: number;
  totalRows: number;
  selectPage: (page: number) => void;
}) => {
  const [pages, setPages] = useState<PagesInterface[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const nextPageClick = () => {
    if (currPage === pages.length) {
      return;
    }
    selectPage(currPage + 1);

    router.push(`${pathname}?page=${currPage + 1}`);
  };
  const prevPageClick = () => {
    if (currPage === 1) {
      return;
    }
    selectPage(currPage - 1);
    router.push(`${pathname}?page=${currPage - 1}`);
  };

  const pageClickHandler = (page: number) => {
    if (currPage !== page) {
      selectPage(page);
      router.push(`${pathname}?page=${page}`);
    }
  };

  const getPages = () => {
    const __pagesTotal = Math.ceil(totalRows / items_per_page);
    let _pages: PagesInterface[] = [];
    for (let i = 1; i <= __pagesTotal; i++) {
      _pages.push({ val: i });
    }
    setPages(_pages);
  };

  useEffect(() => {
    getPages();
  }, [totalRows]);

  return (
    <Pagination className="cursor-pointer mb-10 pb-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={prevPageClick} />
        </PaginationItem>

        {/* Pages */}
        {pages?.map((item, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currPage === item?.val}
              onClick={() => {
                pageClickHandler(item.val);
              }}
            >
              {item?.val}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext onClick={nextPageClick} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
