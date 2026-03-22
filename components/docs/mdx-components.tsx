import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const baseComponents: MDXComponents = {
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/")) {
      let docsHref = href.startsWith("/docs")
        ? href
        : `/docs${href === "/" ? "" : href}`;
      docsHref = docsHref.replace(/\/$/, "") || "/docs";
      return (
        <Link href={docsHref} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  code: ({ children, className, ...props }) => {
    const isBlock =
      className?.includes("language-") || "data-theme" in (props as object);
    if (isBlock) {
      return (
        <code
          className={`scrollbar-thin block overflow-x-auto text-sm ${className ?? ""}`}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      className="scrollbar-thin overflow-x-auto rounded-lg border border-border px-4 py-4 text-sm [&>code]:block [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    >
      {children}
    </pre>
  ),
  table: ({ children, ...props }) => (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border border-border bg-muted/50 px-4 py-2 text-left font-medium"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...baseComponents, ...components };
}

export const mdxComponents = baseComponents;
