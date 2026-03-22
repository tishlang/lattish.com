"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "docs", href: "/docs" },
  { label: "tish", href: "https://tishlang.com" },
  { label: "github", href: "https://github.com/tishlang/lattish" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b backdrop-blur-sm transition-all duration-300",
        scrolled
          ? "border-border bg-background/90"
          : "border-transparent bg-background/50"
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="group flex items-center gap-2 text-foreground">
          <span className="text-primary transition-transform duration-200 group-hover:translate-x-0.5">
            {">"}
          </span>
          <span className="text-sm font-medium">Lattish</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              {...(link.href.startsWith("http") && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className={cn(
                "relative inline-flex items-center gap-1 text-xs transition-colors hover:text-foreground",
                pathname === link.href ||
                  (link.href === "/docs" && pathname.startsWith("/docs"))
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
              {link.href.startsWith("http") && (
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              )}
              {(pathname === link.href ||
                (link.href === "/docs" && pathname.startsWith("/docs"))) && (
                <span className="absolute -bottom-3.5 left-0 right-0 h-px bg-primary" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/docs/getting-started/installation">
            <Button size="sm" className="h-7 text-xs">
              get started
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <div className="relative h-5 w-5">
            <Menu
              className={cn(
                "absolute inset-0 h-5 w-5 text-foreground transition-all duration-200",
                open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              )}
            />
            <X
              className={cn(
                "absolute inset-0 h-5 w-5 text-foreground transition-all duration-200",
                open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              )}
            />
          </div>
        </button>
      </nav>

      <div
        className={cn(
          "grid overflow-hidden border-t border-border transition-all duration-300 ease-in-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-transparent"
        )}
      >
        <div className="overflow-hidden">
          <div className="mx-auto max-w-5xl px-6 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith("http") && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-2 text-xs transition-colors hover:text-foreground",
                    pathname === link.href ||
                      (link.href === "/docs" && pathname.startsWith("/docs"))
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {(pathname === link.href ||
                    (link.href === "/docs" &&
                      pathname.startsWith("/docs"))) && <span>{">"}</span>}
                  {link.label}
                  {link.href.startsWith("http") && (
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link href="/docs" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  read the docs
                </Button>
              </Link>
              <Link href="/docs/getting-started/installation" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full text-xs">
                  start building
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
