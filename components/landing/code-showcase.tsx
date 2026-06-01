"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { CodeBlock } from "./code-block";

const tabs = [
  {
    label: "counter.tish",
    code: `import { useState, createRoot, h, Fragment } from '@tishlang/lattish'

fn App() {
  let [count, setCount] = useState(0)
  return <div>
    <p>{"Count: " + String(count)}</p>
    <button onclick={() => setCount(count + 1)}>Increment</button>
  </div>
}

createRoot(document.getElementById("root")).render(App)`,
  },
  {
    label: "list.tish",
    code: `import { useState, createRoot, h, Fragment } from '@tishlang/lattish'

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
    code: `import { useState, useEffect, createRoot, h } from '@tishlang/lattish'

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

export function CodeShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const { ref, inView } = useInView();
  const active = tabs[activeTab];

  const tabButtons = tabs.map((tab, i) => (
    <button
      key={tab.label}
      type="button"
      onClick={() => setActiveTab(i)}
      className={`rounded px-2 py-1 text-xs transition-colors ${activeTab === i
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground"
        }`}
    >
      {tab.label}
    </button>
  ));

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div
          ref={ref}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <CodeBlock
            code={active.code}
            label={active.label}
            headerExtra={tabButtons}
          />
        </div>
      </div>
    </section>
  );
}
