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
  const items: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }> = [];

  for (const section of docsSidebarConfig) {
    if ("slug" in section && section.slug === "") {
      items.push({ label: section.label, href: "/docs" });
      continue;
    }
    if ("directory" in section) {
      const dir = section.directory;
      const children = allDocs
        .filter((d) => d.slugSegments[0] === dir)
        .map((d) => ({
          label: d.title,
          href: `/docs/${d.slug}`,
        }));
      if (children.length > 0) {
        items.push({
          label: section.label,
          href: children[0]?.href ?? `/docs/${dir}`,
          children,
        });
      }
    }
  }

  return items;
}

export function Sidebar({ allDocs }: SidebarProps) {
  const pathname = usePathname();
  const items = buildSidebarItems(allDocs);

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {items.map((item) => (
        <div key={item.label}>
          <Link
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 transition-colors hover:bg-muted hover:text-foreground",
              pathname === item.href ||
                (item.children && pathname.startsWith(item.href + "/"))
                ? "bg-muted/80 text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
          {item.children && item.children.length > 1 && (
            <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block rounded py-1.5 text-xs transition-colors hover:text-foreground",
                    pathname === child.href
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
