import Link from "next/link";
import { getAllDocs } from "@/lib/docs";
import { Sidebar } from "@/components/docs/sidebar";
import { SearchButton } from "@/components/docs/search-button";
import { cn } from "@/lib/utils";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allDocs = await getAllDocs();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <span className="text-primary">&gt;</span>
            <span>Lattish</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </Link>
            <SearchButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <Sidebar allDocs={allDocs} />
        </aside>
        <main className={cn("min-w-0 flex-1", "max-w-3xl")}>{children}</main>
      </div>
    </div>
  );
}
