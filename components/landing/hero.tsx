"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionBody, SectionEyebrow } from "./typography";
import { CodeBlock } from "./code-block";

const heroCode = `import { useState, createRoot, h, Fragment } from '@tishlang/lattish'

fn App() {
  let [count, setCount] = useState(0)
  return <div>
    <p>{"Count: " + String(count)}</p>
    <button onclick={() => setCount(count + 1)}>Increment</button>
  </div>
}

createRoot(document.getElementById("root")).render(App)`;

export function Hero() {

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionEyebrow
          className="animate-fade-in-up"
          style={{ animationDelay: "0ms" }}
        >
          runtime for tish jsx
        </SectionEyebrow>

        <h1
          className="animate-fade-in-up mt-4 max-w-2xl text-balance text-3xl font-medium leading-tight text-foreground md:text-4xl lg:text-5xl"
          style={{ animationDelay: "80ms", opacity: 0 }}
        >
          hooks + dom
          <br />
          for compiled tish apps
        </h1>

        <SectionBody
          className="animate-fade-in-up mt-4 max-w-lg"
          style={{ animationDelay: "160ms", opacity: 0 }}
        >
          useState, createRoot, h, Fragment. the minimal runtime
          that powers tish jsx. compile with tish, run in the browser.
        </SectionBody>

        <div
          className="animate-fade-in-up mt-8 flex items-center gap-3"
          style={{ animationDelay: "240ms", opacity: 0 }}
        >
          <Link href="/docs/getting-started/installation">
            <Button size="sm" className="group h-8 cursor-pointer text-xs">
              get started
              <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button
              size="sm"
              variant="outline"
              className="h-8 cursor-pointer text-xs border-border text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              read the docs
            </Button>
          </Link>
        </div>

        <CodeBlock
          animated
          code={heroCode}
          label="App.tish"
          className="animate-fade-in-up mt-16"
          style={{ animationDelay: "400ms", opacity: 0 }}
        />
      </div>
    </section>
  );
}
