"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DocMeta } from "@/lib/docs";

interface SidebarProps {
  allDocs: DocMeta[];
}

const docsSidebarConfig = [
  { label: "Introduction", slug: "" },
  { label: "Getting Started", directory: "getting-started" },
  { label: "API", directory: "api" },
] as const;

function buildSidebarItems(allDocs: DocMeta[]) {
  const items: Array<
    | { kind: "link"; label: string; href: string }
    | { kind: "section"; label: string; children: Array<{ label: string; href: string }> }
  > = [];

  for (const section of docsSidebarConfig) {
    if ("slug" in section && section.slug === "") {
      items.push({ kind: "link", label: section.label, href: "/docs" });
      continue;
    }
    if ("directory" in section) {
      const dir = section.directory;
      const children = allDocs
        .filter((d) => d.slugSegments[0] === dir)
        .map((d) => ({ label: d.title, href: `/docs/${d.slug}` }));
      if (children.length > 0) {
        items.push({ kind: "section", label: section.label, children });
      }
    }
  }

  return items;
}

export function Sidebar({ allDocs }: SidebarProps) {
  const pathname = usePathname();
  const items = buildSidebarItems(allDocs);

  return (
    <nav className="flex flex-col gap-0.5 text-sm">
      {items.map((item) => {
        if (item.kind === "link") {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "block rounded px-2 py-1.5 text-xs transition-colors hover:text-foreground",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        }

        const isSectionActive = item.children.some(
          (c) => pathname === c.href || pathname.startsWith(c.href + "/")
        );
        const children =
          item.children[0]?.label === item.label
            ? item.children.slice(1)
            : item.children;
        const visibleChildren = children.length > 0 ? children : item.children;

        return (
          <div key={item.label} className="mt-4 first:mt-0">
            <p
              className={cn(
                "mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest",
                isSectionActive ? "text-foreground/70" : "text-muted-foreground/50"
              )}
            >
              {item.label}
            </p>
            <div className="flex flex-col gap-0.5 border-l border-border ml-2 pl-2">
              {visibleChildren.map((child) => {
                const isActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    title={child.label}
                    className={cn(
                      "block truncate rounded px-2 py-1.5 text-xs transition-colors hover:text-foreground",
                      isActive ? "text-primary font-medium bg-muted/60" : "text-muted-foreground"
                    )}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
