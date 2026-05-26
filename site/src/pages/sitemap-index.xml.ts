import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { urlForEntry } from "../lib/content";

const SITE_URL = "https://claudient.tools";

const COLLECTIONS = [
  "skills",
  "agents",
  "hooks",
  "mcp",
  "workflows",
  "guides",
  "prompts",
  "rules",
] as const;

/** Static pages that are always included */
const STATIC_PATHS = [
  "/",
  "/skills/",
  "/agents/",
  "/hooks/",
  "/mcp/",
  "/workflows/",
  "/guides/",
  "/prompts/",
  "/rules/",
];

export const GET: APIRoute = async () => {
  const urls: string[] = STATIC_PATHS.map((p) => `${SITE_URL}${p}`);

  for (const col of COLLECTIONS) {
    const entries = await getCollection(col, ({ data }) => !data.draft);
    for (const entry of entries) {
      const path = urlForEntry(col, entry);
      urls.push(`${SITE_URL}${path}`);
    }
  }

  const urlTags = urls
    .map(
      (url) => `  <url>\n    <loc>${url}</loc>\n  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
