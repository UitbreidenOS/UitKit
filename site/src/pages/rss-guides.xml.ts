import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { titleFromEntry, descriptionFromEntry, urlForEntry } from "../lib/content";

export async function GET(context: APIContext) {
  const entries = await getCollection("guides", ({ data }) => !data.draft);

  const sorted = [...entries].sort((a, b) => {
    const da = a.data?.updatedAt ? new Date(a.data.updatedAt).getTime() : 0;
    const db = b.data?.updatedAt ? new Date(b.data.updatedAt).getTime() : 0;
    if (da !== db) return db - da;
    return titleFromEntry(a).localeCompare(titleFromEntry(b));
  });

  const items = sorted.slice(0, 50).map((entry) => ({
    title: titleFromEntry(entry),
    description: descriptionFromEntry(entry),
    link: urlForEntry("guides", entry),
    pubDate: entry.data?.updatedAt ? new Date(entry.data.updatedAt) : new Date(0),
  }));

  return rss({
    title: "Claudient — Guides",
    description: "New and updated Claude Code guides from the Claudient knowledge base.",
    site: context.site ?? "https://claudient.tools",
    items,
    customData: `<language>en-us</language>`,
  });
}
