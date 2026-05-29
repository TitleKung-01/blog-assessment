import { Search, X } from "lucide-react";

import { buildBlogListHref } from "@/lib/blog-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BlogSearchFormProps = {
  initialQuery: string;
};

export function BlogSearchForm({ initialQuery }: BlogSearchFormProps) {
  return (
    <form action="/blog" method="get" className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          defaultValue={initialQuery}
          placeholder="ค้นหาจากชื่อบทความ..."
          className="pl-9"
          aria-label="ค้นหาชื่อบทความ"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="gap-1.5">
          <Search className="size-4" />
          ค้นหา
        </Button>
        {initialQuery ? (
          <Button asChild variant="outline" className="gap-1.5">
            <a href={buildBlogListHref("", 1)}>
              <X className="size-4" />
              ล้าง
            </a>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
