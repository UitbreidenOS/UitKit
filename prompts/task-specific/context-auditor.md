# Prompt: Context Auditor

## Purpose

Trim CLAUDE.md (or any context file) to under 200 lines while preserving every piece of guidance that is genuinely unique to the project. Removes duplication, outdated references, and rules Claude already follows by default.

## When to use

- CLAUDE.md has grown beyond 200 lines through accumulated edits
- Sessions feel slow or context-heavy and you suspect CLAUDE.md is the culprit
- Before committing a major CLAUDE.md rewrite and you want a principled audit first
- Onboarding a new repo and inheriting an existing over-specified CLAUDE.md

## The Prompt

```
Audit this CLAUDE.md and produce a trimmed version under 200 lines.

Read the current CLAUDE.md in full before proceeding.

Audit criteria — flag each instruction as one of:
  KEEP     — unique project guidance Claude could not infer from the code itself
  TRIM     — accurate but overly verbose; condense to one line without losing meaning
  REMOVE   — falls into one of the categories below

Remove categories:
  [DUPLICATE]  — same instruction stated more than once in different words
  [OBVIOUS]    — Claude already does this by default without being told
                 Examples: "write clean code", "use meaningful variable names",
                 "handle errors properly", "follow best practices"
  [OUTDATED]   — references a file, directory, library, or process that no longer exists
                 (verify by checking whether the referenced path or tool is present)
  [SCOPE CREEP] — general engineering advice that applies to every project, not this one
                  Examples: "always write tests", "document your functions", "use git"

Output format — two sections:

## Audit Log
For every instruction you remove or trim:
| Original (summarized) | Decision | Reason |
|---|---|---|
| "Always use meaningful variable names" | REMOVE | [OBVIOUS] — Claude default behavior |
| 3-paragraph deploy section | TRIM | Reduced to one-line deploy command |

## Trimmed CLAUDE.md
The full replacement CLAUDE.md, under 200 lines, as a single markdown code block.

Rules:
- Never remove: project-specific file paths, naming conventions, tool choices, team decisions
- Never remove: "do not do X" rules — prohibitions are almost always load-bearing
- Never remove: references to actual files or directories that exist in this repo
- If unsure whether something is obvious or unique, KEEP it — aggressive trimming is worse than a long file
- Preserve all section headers that are still relevant
- The trimmed file must be immediately usable — no placeholders, no "[see original]" references
```

## Variables

| Variable | Description |
|---|---|
| (none) | Self-directed — reads `CLAUDE.md` from the working directory |

## Example

Before audit: 340-line CLAUDE.md with sections on code style, testing philosophy, deploy process, naming conventions, MCP setup, and team culture.

Audit findings:
- "Write code that is easy to read" → REMOVE [OBVIOUS]
- "Always add tests for new features" → REMOVE [OBVIOUS]
- "Use kebab-case for all file names" → KEEP (project-specific)
- 8-line paragraph explaining what Docker is → TRIM to: "Use Docker for all services — see `docker-compose.yml`"
- References to `/src/legacy/` which was deleted 6 months ago → REMOVE [OUTDATED]

After audit: 140-line CLAUDE.md that loads faster, provides less noise, and retains all genuinely useful guidance.

---
