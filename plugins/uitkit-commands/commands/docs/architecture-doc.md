---
description: Generate a structured architecture document for a codebase or module
argument-hint: "[path or module name]"
---
Produce a thorough architecture document for: $ARGUMENTS

Steps:
1. Explore the target — read entry points, config files, and directory structure. Do not skip hidden directories like `.claude/` or `infra/`.
2. Identify and name the top-level components: services, layers, stores, queues, external integrations.
3. For each component, state:
   - Responsibility (one sentence)
   - Technology / language / framework
   - Inbound and outbound dependencies
   - Data it owns or passes through
4. Draw the runtime data-flow as an ASCII diagram. Label call direction with arrows. Include async boundaries.
5. Identify cross-cutting concerns: auth, logging, error handling, feature flags, caching.
6. List known constraints or non-obvious decisions (e.g., "uses polling instead of webhooks because the vendor API is read-only").
7. Identify gaps: undocumented parts, missing tests, unclear ownership.

Output format:
- H2 headings for each section
- Tables for component listings (Component | Responsibility | Tech | Depends On)
- ASCII diagram inline under "Data Flow"
- Bullet lists for cross-cutting concerns and gaps
- No intro fluff — start with the component table

Accuracy rules:
- Ground every claim in actual files. If you cannot verify a claim, mark it `[unverified]`.
- Do not invent integrations or layers that don't exist in the code.
- If $ARGUMENTS is empty, document the entire repository root.
