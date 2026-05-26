import type { APIRoute } from "astro";
import { buildOgSvg } from "../../lib/og";

export const GET: APIRoute = () => {
  const svg = buildOgSvg({ title: "Claudient — Claude Code Knowledge Base" });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
