"use client";

import { useInView } from "@/hooks/use-in-view";

const runtimes = [
  { label: "lattish", value: 100, size: "~3kb", highlight: true },
  { label: "preact", value: 85, size: "~4kb", highlight: false },
  { label: "react", value: 42, size: "~7kb", highlight: false },
  { label: "vue", value: 38, size: "~8kb", highlight: false },
  { label: "svelte", value: 55, size: "~5kb", highlight: false },
];

export function Benchmarks() {
  const { ref, inView } = useInView();

  return (
    <section className="border-b border-border py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div
          ref={ref}
          className="grid gap-12 lg:grid-cols-2 lg:gap-20"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div>
            <p className="text-xs text-primary">lightweight</p>
            <h2 className="mt-2 text-xl font-medium leading-tight text-foreground md:text-2xl">
              minimal runtime, maximum efficiency
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              lattish is a tiny runtime built for compiled tish jsx. hooks and
              dom helpers only — no framework overhead. smaller bundle, faster
              load. relative size comparison (gzipped, approximate).
            </p>
          </div>

          <div className="flex flex-col justify-end gap-4">
            {runtimes.map((bench) => (
              <div key={bench.label} className="flex items-center gap-4">
                <span
                  className={`w-20 text-right text-xs ${
                    bench.highlight ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {bench.label}
                </span>
                <div className="flex-1">
                  <div className="h-6 w-full rounded-sm bg-secondary">
                    <div
                      className={`flex h-full items-center rounded-sm px-3 ${
                        bench.highlight
                          ? "bg-primary"
                          : "bg-muted-foreground/15"
                      }`}
                      style={{ width: `${bench.value}%` }}
                    >
                      <span
                        className={`text-xs ${
                          bench.highlight
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {bench.size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
