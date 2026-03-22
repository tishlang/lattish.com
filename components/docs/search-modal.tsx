"use client";

import { useEffect, useState, useCallback } from "react";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  url: string;
  meta: { title?: string };
  excerpt?: string;
}

interface SearchModalProps {
  onClose?: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefind, setPagefind] = useState<{
    search: (q: string) => Promise<{
      results: Array<{
        id: string;
        url: string;
        meta: () => Promise<{ title?: string }>;
        excerpt: () => Promise<string>;
      }>;
    }>;
    debouncedSearch?: (q: string) => Promise<{
      results: Array<{
        id: string;
        url: string;
        meta: () => Promise<{ title?: string }>;
        excerpt: () => Promise<string>;
      }>;
    }>;
  } | null>(null);
  const [pagefindReady, setPagefindReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import(
          // @ts-expect-error - pagefind.js generated after build
          /* webpackIgnore: true */ "/pagefind/pagefind.js"
        ).catch(() => null);
        const pf = mod?.default ?? mod;
        if (!cancelled && pf) {
          setPagefind(pf);
          setPagefindReady(true);
        } else if (!cancelled) {
          setPagefindReady(false);
        }
      } catch {
        if (!cancelled) setPagefindReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const doSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      if (!pagefind) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const searchFn = pagefind.debouncedSearch ?? pagefind.search;
        const { results: res } = await searchFn.call(pagefind, q);
        const mapped: SearchResult[] = await Promise.all(
          res.slice(0, 8).map(async (r) => {
            const data = await r.data();
            return {
              id: r.id,
              url: normalizeUrl(data.url),
              meta: data.meta ?? {},
              excerpt: data.excerpt,
            };
          })
        );
        setResults(mapped);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [pagefind]
  );

  useEffect(() => {
    const id = setTimeout(() => doSearch(query), 150);
    return () => clearTimeout(id);
  }, [query, doSearch]);

  return (
    <DialogContent
      className="max-w-xl gap-0 p-0"
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <DialogHeader className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search docs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {!pagefindReady && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Search index loads after build. Run{" "}
            <code className="rounded bg-muted px-1">pnpm build</code> first.
          </p>
        )}
        {pagefindReady && loading && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Searching...
          </p>
        )}
        {pagefindReady && !loading && query && results.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No results found.
          </p>
        )}
        {pagefindReady && !loading && results.length > 0 && (
          <ul className="flex flex-col gap-0.5">
            {results.map((r) => (
              <li key={r.id}>
                <a
                  href={r.url}
                  className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  onClick={() => onClose?.()}
                >
                  <span className="font-medium">{r.meta?.title ?? r.url}</span>
                  {r.excerpt && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {r.excerpt.replace(/<[^>]+>/g, "")}
                    </p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DialogContent>
  );
}

function normalizeUrl(url: string): string {
  return (
    url
      .replace(/^\/_next\/static\/chunks\/app\/server\/app/, "")
      .replace(/^\/docs/, "/docs")
      .replace(/\.html$/, "")
      .replace(/\/index$/, "") || "/docs"
  );
}
