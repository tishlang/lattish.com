"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";

const tabs = [
  {
    label: "counter.tish",
    code: `import { useState, createRoot, h, Fragment } from 'lattish'

fn App() {
  let [count, setCount] = useState(0)
  return <div>
    <p>{"Count: " + String(count)}</p>
    <button onclick={() => setCount(count + 1)}>{"Increment"}</button>
  </div>
}

createRoot(document.getElementById("root")).render(App)`,
  },
  {
    label: "list.tish",
    code: `import { useState, createRoot, h, Fragment } from 'lattish'

fn TodoList() {
  let [items, setItems] = useState(["Learn Lattish", "Build app"])
  return <ul>
    {items.map((item, i) => <li key={String(i)}>{item}</li>)}
  </ul>
}

createRoot(document.body).render(TodoList)`,
  },
  {
    label: "effects.tish",
    code: `import { useState, useEffect, createRoot, h } from 'lattish'

fn App() {
  let [data, setData] = useState(null)
  useEffect(() => {
    fetch("/api/data").then(r => r.json()).then(setData)
  }, [])
  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>
}

createRoot(document.getElementById("root")).render(App)`,
  },
];

function findLineCommentStart(line: string): number {
  let inDouble = false;
  let inBacktick = false;
  let escape = false;
  for (let i = 0; i < line.length - 1; i++) {
    const c = line[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inDouble) {
      if (c === "\\") escape = true;
      else if (c === '"') inDouble = false;
      continue;
    }
    if (inBacktick) {
      if (c === "\\") escape = true;
      else if (c === "`") inBacktick = false;
      continue;
    }
    if (c === '"') {
      inDouble = true;
      continue;
    }
    if (c === "`") {
      inBacktick = true;
      continue;
    }
    if (c === "/" && line[i + 1] === "/") return i;
  }
  return -1;
}

const KEYWORD_RE =
  /^(import|from|fn|const|let|async|return|if|else|for|await|true|false|null|useState|useEffect|useRef|useMemo|useLayoutEffect|createRoot|Fragment)\b/;
const TYPE_RE = /^(string|number|boolean|void)\b/;

function tokenizeCodeSegment(code: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;

  const nextKey = () => `${keyPrefix}-${k++}`;

  while (i < code.length) {
    const rest = code.slice(i);

    const ws = rest.match(/^\s+/);
    if (ws) {
      out.push(ws[0]);
      i += ws[0].length;
      continue;
    }

    const dq = rest.match(/^"(?:[^"\\]|\\.)*"/);
    if (dq) {
      out.push(
        <span key={nextKey()} className="text-primary/70">
          {dq[0]}
        </span>
      );
      i += dq[0].length;
      continue;
    }

    const sq = rest.match(/^'(?:[^'\\]|\\.)*'/);
    if (sq) {
      out.push(
        <span key={nextKey()} className="text-primary/70">
          {sq[0]}
        </span>
      );
      i += sq[0].length;
      continue;
    }

    const bt = rest.match(/^`(?:[^`\\]|\\.)*`/);
    if (bt) {
      out.push(
        <span key={nextKey()} className="text-primary/70">
          {bt[0]}
        </span>
      );
      i += bt[0].length;
      continue;
    }

    const kw = rest.match(KEYWORD_RE);
    if (kw) {
      out.push(
        <span key={nextKey()} className="text-primary">
          {kw[0]}
        </span>
      );
      i += kw[0].length;
      continue;
    }

    const typ = rest.match(TYPE_RE);
    if (typ) {
      out.push(
        <span key={nextKey()} className="text-chart-4">
          {typ[0]}
        </span>
      );
      i += typ[0].length;
      continue;
    }

    const num = rest.match(/^\d+\.?\d*/);
    if (num) {
      out.push(
        <span key={nextKey()} className="text-chart-4">
          {num[0]}
        </span>
      );
      i += num[0].length;
      continue;
    }

    const arrow = rest.match(/^=>/);
    if (arrow) {
      out.push(
        <span key={nextKey()} className="text-muted-foreground">
          {arrow[0]}
        </span>
      );
      i += 2;
      continue;
    }

    const ident = rest.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (ident) {
      out.push(
        <span key={nextKey()} className="text-foreground">
          {ident[0]}
        </span>
      );
      i += ident[0].length;
      continue;
    }

    const punct = rest.match(/^[(){}\[\].,;:=+\-*/%<>!|&?]/);
    if (punct) {
      out.push(
        <span key={nextKey()} className="text-muted-foreground">
          {punct[0]}
        </span>
      );
      i += 1;
      continue;
    }

    out.push(rest[0]);
    i += 1;
  }

  return out;
}

function highlightLine(line: string, lineIndex: number): ReactNode {
  const commentStart = findLineCommentStart(line);
  if (commentStart === -1) {
    return (
      <div key={lineIndex} className="leading-7">
        {tokenizeCodeSegment(line, `l${lineIndex}`)}
      </div>
    );
  }

  const codePart = line.slice(0, commentStart);
  const commentPart = line.slice(commentStart);
  return (
    <div key={lineIndex} className="leading-7">
      {tokenizeCodeSegment(codePart, `l${lineIndex}c`)}
      <span className="text-muted-foreground/30 italic">{commentPart}</span>
    </div>
  );
}

function highlightCode(code: string): ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) =>
    line.length === 0 ? (
      <div key={i} className="leading-7">
        &nbsp;
      </div>
    ) : (
      highlightLine(line, i)
    )
  );
}

export function CodeShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const { ref, inView } = useInView();
  const active = tabs[activeTab];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div
          ref={ref}
          className="border border-border transition-colors duration-500 hover:border-primary/20"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease, border-color 0.5s",
          }}
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/20 transition-colors" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
              <span className="ml-2 text-xs text-muted-foreground">
                {active.label}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 sm:justify-end">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`rounded px-2 py-1 text-xs transition-colors ${
                    activeTab === i
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto p-5 text-xs leading-7">
            <code className="block text-foreground">
              {highlightCode(active.code)}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
