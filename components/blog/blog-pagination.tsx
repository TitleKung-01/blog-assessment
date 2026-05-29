import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buildBlogListHref } from "@/lib/blog-queries";
import { Button } from "@/components/ui/button";

type BlogPaginationProps = {
  page: number;
  totalPages: number;
  query: string;
  total: number;
};

export function BlogPagination({
  page,
  totalPages,
  query,
  total,
}: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center gap-4 border-t border-border/50 pt-10"
    >
      <p className="text-sm text-muted-foreground">
        แสดงหน้า {page} จาก {totalPages} ({total.toLocaleString("th-TH")}{" "}
        บทความ)
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page <= 1}
          className="gap-1"
        >
          {page > 1 ? (
            <Link href={buildBlogListHref(query, page - 1)}>
              <ChevronLeft className="size-4" />
              ก่อนหน้า
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
              ก่อนหน้า
            </span>
          )}
        </Button>

        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            asChild
            variant={pageNumber === page ? "default" : "outline"}
            size="sm"
            className="min-w-9"
          >
            <Link href={buildBlogListHref(query, pageNumber)}>{pageNumber}</Link>
          </Button>
        ))}

        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          className="gap-1"
        >
          {page < totalPages ? (
            <Link href={buildBlogListHref(query, page + 1)}>
              ถัดไป
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span>
              ถัดไป
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </nav>
  );
}
