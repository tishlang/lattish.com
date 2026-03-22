import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DocMeta } from "@/lib/docs";

interface PrevNextProps {
  prev: DocMeta | null;
  next: DocMeta | null;
}

export function PrevNext({ prev, next }: PrevNextProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-border pt-8">
      <div className="flex-1">
        {prev && (
          <Link
            href={`/docs/${prev.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{prev.title}</span>
          </Link>
        )}
      </div>
      <div className="flex flex-1 justify-end">
        {next && (
          <Link
            href={`/docs/${next.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>{next.title}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}
