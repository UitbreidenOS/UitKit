import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  urlForEntry,
  titleFromEntry,
  descriptionFromEntry,
} from "../lib/content";

const SITE_URL = "https://claudient.tools";

const SECTIONS: Array<{
  key: string;
  label: string;
  indexPath: string;
}> = [
  { key: "skills", label: "Skills", indexPath: "/skills/" },
  { key: "agents", label: "Agents", indexPath: "/agents/" },
  { key: "hooks", label: "Hooks", indexPath: "/hooks/" },
  { key: "mcp", label: "MCP Servers", indexPath: "/mcp/" },
  { key: "workflows", label: "Workflows", indexPath: "/workflows/" },
  { key: "guides", label: "Guides", indexPath: "/guides/" },
  { key: "prompts", label: "Prompts", indexPath: "/prompts/" },
  { key: "rules", label: "Rules", indexPath: "/rules/" },
];

export const GET: APIRoute = async () => {
  const lines: string[] = [
    "# Claudient",
    "",
    "> The Claude Code knowledge base — skills, agents, hooks, MCP configs, workflows, guides, and prompts. Open source, free to use.",
    "",
    `> ${SITE_URL}`,
    "",
  ];

  for (const section of SECTIONS) {
    const entries = await getCollection(section.key as Parameters<typeof getCollection>[0], ({ data }) => !data.draft);

    if (entries.length === 0) continue;

    lines.push(`## ${section.label}`);
    lines.push("");

    const sorted = [...entries].sort((a, b) =>
      titleFromEntry(a).localeCompare(titleFromEntry(b)),
    );

    for (const entry of sorted) {
      const title = titleFromEntry(entry);
      const rawDesc = descriptionFromEntry(entry, 120);
      const desc = rawDesc ? rawDesc.slice(0, 100) + (rawDesc.length > 100 ? "…" : "") : "";
      const url = `${SITE_URL}${urlForEntry(section.key, entry)}`;
      const suffix = desc ? `: ${desc}` : "";
      lines.push(`- [${title}](${url})${suffix}`);
    }

    lines.push("");
  }

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
