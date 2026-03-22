"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const codeLines = [
  {
    parts: [
      { text: "import", cls: "text-primary" },
      { text: " { useState, createRoot, h, Fragment } ", cls: "text-foreground" },
      { text: "from", cls: "text-primary" },
      { text: " 'lattish'", cls: "text-primary/70" },
    ],
  },
  { parts: [] },
  {
    parts: [
      { text: "fn", cls: "text-primary" },
      { text: " App() {", cls: "text-foreground" },
    ],
  },
  {
    parts: [
      { text: "  let", cls: "text-primary" },
      { text: " [count, setCount] = ", cls: "text-foreground" },
      { text: "useState", cls: "text-primary" },
      { text: "(0)", cls: "text-muted-foreground" },
    ],
  },
  {
    parts: [
      { text: "  return ", cls: "text-primary" },
      { text: "<div>", cls: "text-muted-foreground" },
    ],
  },
  {
    parts: [
      { text: "    <p>", cls: "text-muted-foreground" },
      { text: '{"Count: " + String(count)}', cls: "text-primary/70" },
      { text: "</p>", cls: "text-muted-foreground" },
    ],
  },
  {
    parts: [
      { text: "    <button ", cls: "text-muted-foreground" },
      { text: "onclick", cls: "text-primary" },
      { text: "={() => setCount(count + 1)}>", cls: "text-muted-foreground" },
    ],
  },
  {
    parts: [
      { text: '{"Increment"}', cls: "text-primary/70" },
      { text: "</button>", cls: "text-muted-foreground" },
    ],
  },
  { parts: [{ text: "  </div>", cls: "text-muted-foreground" }] },
  { parts: [{ text: "}", cls: "text-muted-foreground" }] },
  { parts: [] },
  {
    parts: [
      { text: "createRoot", cls: "text-primary" },
      { text: "(document.getElementById(", cls: "text-foreground" },
      { text: '"root"', cls: "text-primary/70" },
      { text: ")).render(App)", cls: "text-foreground" },
    ],
  },
];

export function Hero() {
  const { ref: termRef, inView: termVisible } = useInView();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!termVisible) return;
    if (visibleLines >= codeLines.length) return;

    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, visibleLines === 0 ? 300 : 120);

    return () => clearTimeout(timer);
  }, [termVisible, visibleLines]);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p
          className="animate-fade-in-up text-xs text-primary"
          style={{ animationDelay: "0ms" }}
        >
          runtime for tish jsx
        </p>

        <h1
          className="animate-fade-in-up mt-4 max-w-2xl text-balance text-3xl font-medium leading-tight text-foreground md:text-4xl lg:text-5xl"
          style={{ animationDelay: "80ms", opacity: 0 }}
        >
          hooks + dom
          <br />
          for compiled tish apps
        </h1>

        <p
          className="animate-fade-in-up mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground"
          style={{ animationDelay: "160ms", opacity: 0 }}
        >
          useState, createRoot, h, Fragment. the minimal runtime
          that powers tish jsx. compile with tish, run in the browser.
        </p>

        <div
          className="animate-fade-in-up mt-8 flex items-center gap-3"
          style={{ animationDelay: "240ms", opacity: 0 }}
        >
          <Link href="/docs/getting-started/installation">
            <Button size="sm" className="group h-8 text-xs">
              get started
              <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              read the docs
            </Button>
          </Link>
        </div>

        <div
          ref={termRef}
          className="animate-fade-in-up mt-16 border border-border transition-colors hover:border-primary/20"
          style={{ animationDelay: "400ms", opacity: 0 }}
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/20 transition-colors" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
            <span className="ml-2 text-xs text-muted-foreground">App.tish</span>
          </div>
          <div className="p-5 text-xs leading-7">
            {codeLines.map((line, i) => (
              <div
                key={i}
                className="transition-opacity duration-300"
                style={{
                  opacity: i < visibleLines ? 1 : 0,
                  transform: i < visibleLines ? "none" : "translateY(4px)",
                  transition: "opacity 0.3s, transform 0.3s",
                }}
              >
                {line.parts.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  line.parts.map((part, j) => (
                    <span key={j} className={part.cls}>
                      {part.text}
                    </span>
                  ))
                )}
              </div>
            ))}
            <span
              className="animate-blink inline-block h-4 w-1.5 bg-primary"
              style={{ opacity: visibleLines >= codeLines.length ? 1 : 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
