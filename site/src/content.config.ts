import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Content collections that read directly from the repo root.
 * Translations (fr/de/nl/es) are excluded from v1 — they'll be re-enabled
 * once per-language routing is wired in a later phase.
 */

// Negation patterns exclude translation subdirs for v1 — re-enabled when
// per-language routing ships. Astro's glob loader uses micromatch syntax,
// so `!` prefixes negate.
const patterns = [
  "**/*.md",
  "!**/fr/**",
  "!**/de/**",
  "!**/nl/**",
  "!**/es/**",
  "!**/it/**",
  "!**/pt/**",
];

// Loose schema — most existing files predate frontmatter, so every field
// is optional and we compute fallbacks at render time from filename + body.
const contentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  tools: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
  author: z.string().optional(),
  model: z.string().optional(),
  event: z.string().optional(),
});

const makeCollection = (folder: string) =>
  defineCollection({
    loader: glob({
      pattern: patterns,
      base: `../${folder}`,
    }),
    schema: contentSchema,
  });

export const collections = {
  skills: makeCollection("skills"),
  agents: makeCollection("agents"),
  hooks: makeCollection("hooks"),
  mcp: makeCollection("mcp"),
  workflows: makeCollection("workflows"),
  guides: makeCollection("guides"),
  prompts: makeCollection("prompts"),
  rules: makeCollection("rules"),
};
