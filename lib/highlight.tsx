import type { ReactNode } from "react";

function findLineCommentStart(line: string): number {
  let inDouble = false;
  let inBacktick = false;
  let escape = false;
  for (let i = 0; i < line.length - 1; i++) {
    const c = line[i];
    if (escape) { escape = false; continue; }
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
    if (c === '"') { inDouble = true; continue; }
    if (c === "`") { inBacktick = true; continue; }
    if (c === "/" && line[i + 1] === "/") return i;
  }
  return -1;
}

const KEYWORD_RE =
  /^(import|from|fn|const|let|async|return|if|else|for|await|true|false|null|useState|useEffect|useRef|useMemo|useLayoutEffect|createRoot|Fragment)\b/;
const TYPE_RE = /^(string|number|boolean|void)\b/;

function tokenizeSegment(code: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const nextKey = () => `${keyPrefix}-${k++}`;

  while (i < code.length) {
    const rest = code.slice(i);

    const ws = rest.match(/^\s+/);
    if (ws) { out.push(ws[0]); i += ws[0].length; continue; }

    const dq = rest.match(/^"(?:[^"\\]|\\.)*"/);
    if (dq) { out.push(<span key={nextKey()} className="text-primary/70">{dq[0]}</span>); i += dq[0].length; continue; }

    const sq = rest.match(/^'(?:[^'\\]|\\.)*'/);
    if (sq) { out.push(<span key={nextKey()} className="text-primary/70">{sq[0]}</span>); i += sq[0].length; continue; }

    const bt = rest.match(/^`(?:[^`\\]|\\.)*`/);
    if (bt) { out.push(<span key={nextKey()} className="text-primary/70">{bt[0]}</span>); i += bt[0].length; continue; }

    const kw = rest.match(KEYWORD_RE);
    if (kw) { out.push(<span key={nextKey()} className="text-primary">{kw[0]}</span>); i += kw[0].length; continue; }

    const typ = rest.match(TYPE_RE);
    if (typ) { out.push(<span key={nextKey()} className="text-chart-4">{typ[0]}</span>); i += typ[0].length; continue; }

    const num = rest.match(/^\d+\.?\d*/);
    if (num) { out.push(<span key={nextKey()} className="text-chart-4">{num[0]}</span>); i += num[0].length; continue; }

    const arrow = rest.match(/^=>/);
    if (arrow) { out.push(<span key={nextKey()} className="text-muted-foreground">{arrow[0]}</span>); i += 2; continue; }

    const ident = rest.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (ident) { out.push(<span key={nextKey()} className="text-foreground">{ident[0]}</span>); i += ident[0].length; continue; }

    const punct = rest.match(/^[(){}[\].,;:=+\-*/%<>!|&?]/);
    if (punct) { out.push(<span key={nextKey()} className="text-muted-foreground">{punct[0]}</span>); i += 1; continue; }

    out.push(rest[0]);
    i += 1;
  }

  return out;
}

/**
 * Tokenizes tish/jsx source code.
 * Returns one array of ReactNode tokens per source line (empty array = blank line).
 */
export function highlightCode(code: string): ReactNode[][] {
  return code.split("\n").map((line, i) => {
    if (line.length === 0) return [];
    const commentStart = findLineCommentStart(line);
    if (commentStart === -1) return tokenizeSegment(line, `l${i}`);
    return [
      ...tokenizeSegment(line.slice(0, commentStart), `l${i}c`),
      <span key={`l${i}-cmt`} className="text-muted-foreground/30 italic">
        {line.slice(commentStart)}
      </span>,
    ];
  });
}
