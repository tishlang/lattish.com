import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { globby } from "globby";

const DOCS_DIR = path.join(process.cwd(), "content/docs");

export interface DocFrontmatter {
  title: string;
  description?: string;
  template?: string;
  hero?: {
    tagline?: string;
    actions?: Array<{ text: string; link: string; icon?: string; variant?: string }>;
  };
}

export interface DocMeta {
  slug: string;
  slugSegments: string[];
  title: string;
  description?: string;
  template?: string;
  hero?: DocFrontmatter["hero"];
}

export interface Doc {
  meta: DocMeta;
  content: string;
}

const docsSidebar = [
  { label: "Introduction", slug: "" },
  { label: "Getting Started", directory: "getting-started" },
  { label: "API", directory: "api" },
] as const;

function getSlugFromPath(filePath: string): string {
  const relative = path.relative(DOCS_DIR, filePath);
  const withoutExt = relative.replace(/\.mdx?$/, "");
  return withoutExt === "index" ? "" : withoutExt;
}

export async function getAllDocs(): Promise<DocMeta[]> {
  const files = await globby("**/*.mdx", { cwd: DOCS_DIR });
  const docs: DocMeta[] = [];

  for (const file of files) {
    const fullPath = path.join(DOCS_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(raw);

    const slug = getSlugFromPath(fullPath);
    const slugSegments = slug ? slug.split("/") : [];

    docs.push({
      slug,
      slugSegments,
      title: data.title ?? "Untitled",
      description: data.description,
      template: data.template,
      hero: data.hero,
    });
  }

  docs.sort((a, b) => {
    if (a.slug === "") return -1;
    if (b.slug === "") return 1;
    const aDir = a.slugSegments[0] ?? "";
    const bDir = b.slugSegments[0] ?? "";
    if (aDir !== bDir) {
      const order = docsSidebar
        .filter((s) => "directory" in s)
        .map((s) => (s as { directory: string }).directory);
      const ai = order.indexOf(aDir);
      const bi = order.indexOf(bDir);
      if (ai !== -1 && bi !== -1) return ai - bi;
      return aDir.localeCompare(bDir);
    }
    return a.slug.localeCompare(b.slug);
  });

  return docs;
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const segs = slug ? slug.split("/") : [];
  const candidates =
    segs.length === 0
      ? ["index.mdx"]
      : [path.join(...segs, "index.mdx"), path.join(...segs) + ".mdx"];

  for (const rel of candidates) {
    const fullPath = path.join(DOCS_DIR, rel);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);
      const actualSlug = getSlugFromPath(fullPath);
      const slugSegments = actualSlug ? actualSlug.split("/") : [];

      return {
        meta: {
          slug: actualSlug,
          slugSegments,
          title: data.title ?? "Untitled",
          description: data.description,
          template: data.template,
          hero: data.hero,
        },
        content,
      };
    }
  }
  return null;
}

export async function getDocPaths(): Promise<Array<{ slug: string[] }>> {
  const files = await globby("**/*.mdx", { cwd: DOCS_DIR });
  return files.map((file) => {
    const fullPath = path.join(DOCS_DIR, file);
    const slug = getSlugFromPath(fullPath);
    return { slug: slug ? slug.split("/") : [] };
  });
}

export async function getPrevNext(
  slug: string
): Promise<{ prev: DocMeta | null; next: DocMeta | null }> {
  const all = await getAllDocs();
  const idx = all.findIndex((d) => (d.slug ? d.slug === slug : slug === ""));
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export { docsSidebar };
