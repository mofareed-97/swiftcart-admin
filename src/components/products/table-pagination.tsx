"use client";

import React from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IProps {
  totalPages: number;
}
function TablePrdouctsPagination({ totalPages }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isPending, startTransition] = React.useTransition();

  const pageQuery = searchParams.get("page") || 1;

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const [currentPage, setCurrentPage] = React.useState(pageQuery);

  React.useEffect(() => {
    if (currentPage) {
      startTransition(() => {
        router.push(
          `${pathname}?${createQueryString({
            page: `${currentPage}`,
          })}`
        );
      });
    }
  }, [currentPage]);

  return (
    <div className="flex items-start gap-4 justify-end my-4">
      <Button
        disabled={+currentPage <= 1 || isPending}
        variant={"outline"}
        onClick={() => {
          if (+currentPage > 1) {
            setCurrentPage((prevPage) => +prevPage - 1);
          }
        }}
      >
        Previous
      </Button>
      <Button
        disabled={isPending || totalPages >= totalPages}
        variant={"outline"}
        onClick={() => setCurrentPage((prev) => +prev + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export default TablePrdouctsPagination;
