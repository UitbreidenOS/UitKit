export interface FeaturedItem {
  slug: string;
  collection: "skills" | "agents" | "mcp" | "hooks" | "workflows";
  override?: { title?: string; description?: string };
}

export const popularSkills: FeaturedItem[] = [
  { slug: "small-business/invoice-chaser", collection: "skills" },
  { slug: "backend/nodejs/nextjs", collection: "skills" },
  { slug: "backend/python/fastapi", collection: "skills" },
  { slug: "ai-engineering/rag-architect", collection: "skills" },
  { slug: "small-business/quickbooks-workflow", collection: "skills" },
];

export const popularAgents: FeaturedItem[] = [
  { slug: "roles/sre-engineer", collection: "agents" },
  { slug: "roles/security-auditor", collection: "agents" },
  { slug: "core/code-reviewer", collection: "agents" },
  { slug: "core/planner", collection: "agents" },
  { slug: "core/architect", collection: "agents" },
];

export const popularMcp: FeaturedItem[] = [
  { slug: "playwright-mcp", collection: "mcp" },
  { slug: "github", collection: "mcp" },
  { slug: "figma", collection: "mcp" },
  { slug: "notion", collection: "mcp" },
  { slug: "stripe", collection: "mcp" },
];
