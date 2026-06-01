"use client";

import type { ReactNode, CSSProperties } from "react";
import { useState, useEffect } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { highlightCode } from "@/lib/highlight";

interface CodeBlockProps {
  code: string;
  label: string;
  /** Typewriter reveal — lines fade in one by one when the block enters the viewport. */
  animated?: boolean;
  /** Extra content rendered on the right side of the header bar (e.g. tab buttons). */
  headerExtra?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function CodeBlock({
  code,
  label,
  animated = false,
  headerExtra,
  className,
  style,
}: CodeBlockProps) {
  const lines = highlightCode(code);
  const { ref, inView } = useInView();
  const [visibleCount, setVisibleCount] = useState(animated ? 0 : lines.length);

  useEffect(() => {
    if (!animated || !inView || visibleCount >= lines.length) return;
    const delay = visibleCount === 0 ? 300 : 120;
    const t = setTimeout(() => setVisibleCount((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [animated, inView, visibleCount, lines.length]);

  return (
    <div
      ref={ref}
      className={cn(
        "border border-border transition-colors hover:border-primary/20",
        className
      )}
      style={style}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
          <span className="ml-2 text-xs text-muted-foreground">{label}</span>
        </div>
        {headerExtra && (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 sm:justify-end">
            {headerExtra}
          </div>
        )}
      </div>

      <div className="overflow-x-auto p-5 text-xs">
        <code className="block text-foreground whitespace-pre">
          {lines.map((lineTokens, i) => (
            <div
              key={i}
              className="leading-7"
              style={
                animated
                  ? {
                      opacity: i < visibleCount ? 1 : 0,
                      transform: i < visibleCount ? "none" : "translateY(4px)",
                      transition: "opacity 0.3s, transform 0.3s",
                    }
                  : undefined
              }
            >
              {lineTokens.length === 0 ? <>&nbsp;</> : lineTokens}
            </div>
          ))}
          {animated && (
            <span
              className="animate-blink inline-block h-4 w-1.5 bg-primary"
              style={{ opacity: visibleCount >= lines.length ? 1 : 0 }}
            />
          )}
        </code>
      </div>
    </div>
  );
}
