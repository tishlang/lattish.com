"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const SCROLL_OFFSET = 120;

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const el = document.querySelector(".mdx-content");
    if (!el) return;

    const nodes = el.querySelectorAll("h2, h3");
    const list: Heading[] = [];
    nodes.forEach((node) => {
      const id = node.id || (node.textContent?.toLowerCase().replace(/\s+/g, "-") ?? "");
      if (id) list.push({ id, text: node.textContent ?? "", level: parseInt(node.tagName[1], 10) });
    });
    setHeadings(list);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el != null);

    const onScroll = () => {
      let current: string | null = null;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= SCROLL_OFFSET) current = el.id;
      }
      setActiveId(current ?? elements[0]?.id ?? null);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="scrollbar-thin sticky top-24 hidden max-h-[calc(100vh-8rem)] w-44 shrink-0 overflow-y-auto text-xs xl:block">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        On this page
      </p>
      <ul className="flex flex-col gap-0.5">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? 10 : 0 }}>
              <a
                href={`#${h.id}`}
                title={h.text}
                className={cn(
                  "block truncate border-l-2 py-1 pr-1 pl-2 -ml-px leading-tight transition-colors",
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
