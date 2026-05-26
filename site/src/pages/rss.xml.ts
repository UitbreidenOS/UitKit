import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { titleFromEntry, descriptionFromEntry, urlForEntry } from "../lib/content";

const COLLECTIONS = [
  "skills",
  "agents",
  "hooks",
  "mcp",
  "workflows",
  "guides",
] as const;

export async function GET(context: APIContext) {
  const allItems: Array<{
    title: string;
    description: string;
    link: string;
    pubDate: Date;
  }> = [];

  for (const col of COLLECTIONS) {
    const entries = await getCollection(col, ({ data }) => !data.draft);
    for (const entry of entries) {
      allItems.push({
        title: `[${col.charAt(0).toUpperCase() + col.slice(1)}] ${titleFromEntry(entry)}`,
        description: descriptionFromEntry(entry),
        link: urlForEntry(col, entry),
        pubDate: entry.data?.updatedAt ? new Date(entry.data.updatedAt) : new Date(0),
      });
    }
  }

  const sorted = allItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  const items = sorted.slice(0, 50);

  return rss({
    title: "Claudient — All Updates",
    description: "The 50 newest entries across all collections in the Claudient Claude Code knowledge base.",
    site: context.site ?? "https://claudient.tools",
    items,
    customData: `<language>en-us</language>`,
  });
}
