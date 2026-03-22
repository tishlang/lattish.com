"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";

export function CTA() {
  const { ref, inView } = useInView();

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div
          ref={ref}
          className="border border-border p-8 transition-colors duration-500 hover:border-primary/20 md:p-12"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(12px)",
            transition:
              "opacity 0.5s ease, transform 0.5s ease, border-color 0.5s",
          }}
        >
          <p className="text-xs text-primary">get started</p>
          <h2 className="mt-2 text-xl font-medium text-foreground md:text-2xl">
            start building with lattish
          </h2>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            install the runtime, compile your tish jsx with the tish compiler,
            and run in the browser. hooks, dom, and nothing else.
          </p>

          <div className="mt-6 flex items-center gap-2 border border-border bg-card px-4 py-2.5 w-fit">
            <span className="text-primary text-xs">$</span>
            <code className="text-xs text-foreground">npm install lattish</code>
            <span className="animate-blink inline-block h-3.5 w-1 bg-primary" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link href="/docs/getting-started/installation">
              <Button size="sm" className="group h-8 text-xs">
                install lattish
                <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link
              href="https://github.com/tishlang/lattish"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-border text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                view on github
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
