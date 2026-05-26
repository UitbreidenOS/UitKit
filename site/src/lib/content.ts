import type { CollectionEntry, CollectionKey } from "astro:content";

/**
 * Utilities for working with content entries that may lack frontmatter.
 * Every helper here computes graceful fallbacks from the file path and
 * body so the site renders correctly even for older .md files written
 * before the frontmatter convention existed.
 */

export interface PathParts {
  /** filename without extension (e.g. "invoice-chaser") */
  slug: string;
  /** top-level folder (e.g. "small-business") */
  category: string;
  /** second-level folder, if present (e.g. "nodejs" for skills/backend/nodejs/...) */
  subcategory: string | null;
  /** the full path joined for URL building (e.g. "small-business/invoice-chaser") */
  path: string;
  /** raw split path parts */
  parts: string[];
}

export function pathToParts(id: string): PathParts {
  const cleaned = id.replace(/\.md$/, "");
  const parts = cleaned.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] ?? "index";
  const category = parts.length > 1 ? parts[0] : "general";
  const subcategory = parts.length > 2 ? parts[1] : null;
  return {
    slug,
    category,
    subcategory,
    path: parts.join("/"),
    parts,
  };
}

export function slugToTitle(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => {
      if (word.length <= 2 && word === word.toLowerCase()) {
        // small connectors stay lowercase except first word
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function titleFromEntry(
  entry: CollectionEntry<CollectionKey>,
): string {
  if (entry.data?.title) return entry.data.title;
  const body = (entry as { body?: string }).body ?? "";
  const h1 = body.match(/^#\s+(.+?)$/m);
  if (h1) return h1[1].trim();
  return slugToTitle(pathToParts(entry.id).slug);
}

export function descriptionFromEntry(
  entry: CollectionEntry<CollectionKey>,
  maxLength = 200,
): string {
  if (entry.data?.description) return entry.data.description;
  const body = (entry as { body?: string }).body ?? "";
  const lines = body.split("\n");
  let foundH1 = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!foundH1 && line.startsWith("# ")) {
      foundH1 = true;
      continue;
    }
    if (
      foundH1 &&
      line &&
      !line.startsWith("#") &&
      !line.startsWith(">") &&
      !line.startsWith("---") &&
      !line.startsWith("![")
    ) {
      // strip markdown formatting (bold, italic, links) for clean meta
      const clean = line
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/\[(.+?)\]\([^)]+\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1");
      if (clean.length > maxLength) {
        return clean.slice(0, maxLength - 1).trimEnd() + "…";
      }
      return clean;
    }
  }
  return "";
}

export function groupByCategory<T extends CollectionEntry<CollectionKey>>(
  entries: T[],
): Array<{ category: string; entries: T[] }> {
  const map = new Map<string, T[]>();
  for (const entry of entries) {
    const { category } = pathToParts(entry.id);
    const list = map.get(category) ?? [];
    list.push(entry);
    map.set(category, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, entries]) => ({
      category,
      entries: entries.sort((a, b) =>
        titleFromEntry(a).localeCompare(titleFromEntry(b)),
      ),
    }));
}

export function urlForEntry(
  collection: string,
  entry: CollectionEntry<CollectionKey>,
): string {
  const { path } = pathToParts(entry.id);
  return `/${collection}/${path}/`;
}
