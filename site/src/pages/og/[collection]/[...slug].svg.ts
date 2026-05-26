import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { pathToParts, titleFromEntry } from "../../../lib/content";
import { buildOgSvg } from "../../../lib/og";

type CollectionName =
  | "skills"
  | "agents"
  | "hooks"
  | "mcp"
  | "workflows"
  | "guides"
  | "prompts"
  | "rules";

const COLLECTIONS: CollectionName[] = [
  "skills",
  "agents",
  "hooks",
  "mcp",
  "workflows",
  "guides",
  "prompts",
  "rules",
];

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: {
    params: { collection: string; slug: string };
    props: { title: string; category: string; collection: string };
  }[] = [];

  for (const col of COLLECTIONS) {
    const entries = await getCollection(col, ({ data }) => !data.draft);
    for (const entry of entries) {
      const { path, category } = pathToParts(entry.id);
      const title = titleFromEntry(entry);
      paths.push({
        params: { collection: col, slug: path },
        props: { title, category, collection: col },
      });
    }
  }

  return paths;
};

export const GET: APIRoute = ({ props }) => {
  const { title, category, collection } = props as {
    title: string;
    category: string;
    collection: string;
  };

  const svg = buildOgSvg({ title, category, collection });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
