"use client";

import { useInView } from "@/hooks/use-in-view";

const sections = [
  {
    number: "01",
    title: "hooks",
    subtitle: "useState, useEffect, useRef, useMemo",
    description:
      "the full hook api you expect. useState for local state, useEffect for side effects, useRef for refs, useMemo for memoization. same mental model as react, implemented for the tish jsx runtime.",
    capabilities: [
      "useState — local component state",
      "useEffect — side effects after render",
      "useLayoutEffect — sync effects before paint",
      "useRef — mutable refs across renders",
      "useMemo — memoized values",
      "unstable_batchedUpdates — batched state updates",
    ],
  },
  {
    number: "02",
    title: "dom runtime",
    subtitle: "h, Fragment, text, createRoot",
    description:
      "minimal dom primitives that the tish compiler targets. h creates elements, Fragment groups children, createRoot mounts and reconciles. no virtual dom by default — direct dom updates, or opt into vdom for diffing.",
    capabilities: [
      "h — create elements and components",
      "Fragment — group children without wrapper",
      "text — text node helper",
      "createRoot — mount and re-render",
      "compiler lowers jsx to these calls",
      "optional vdom mode for diffing",
    ],
  },
  {
    number: "03",
    title: "minimal bundle",
    subtitle: "tiny runtime, zero bloat",
    description:
      "lattish is a small runtime designed for compiled tish jsx. no framework overhead, no extra abstractions. ship the code you write, not a giant library. works with tish's --target js and --jsx lattish.",
    capabilities: [
      "tiny footprint for production builds",
      "no external framework dependency",
      "works with tish compiler --jsx lattish",
      "node_modules resolution for bare specifiers",
      "npm install lattish — that's it",
      "open source, permissive license",
    ],
  },
];

export function Features() {
  const { ref, inView } = useInView();

  return (
    <section id="features" className="py-20 lg:py-28">
      <div ref={ref} className="mx-auto max-w-5xl px-6">
        {sections.map((section, i) => (
          <div
            key={section.number}
            className="border-b border-border py-16 last:border-b-0"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(8px)",
              transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
            }}
          >
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="text-xs text-primary">{section.number}</p>
                <h2 className="mt-2 text-xl font-medium leading-tight text-foreground md:text-2xl">
                  {section.title}
                </h2>
                <p className="mt-2 text-xs text-primary">
                  {section.subtitle}
                </p>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </div>

              <div className="flex flex-col justify-end">
                <div className="border border-border p-5 transition-colors duration-500 hover:border-primary/20">
                  <p className="mb-4 text-xs text-muted-foreground/60">
                    {"// capabilities"}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {section.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-start gap-2 text-xs leading-relaxed"
                      >
                        <span className="mt-0.5 text-primary">-</span>
                        <span className="text-foreground">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
