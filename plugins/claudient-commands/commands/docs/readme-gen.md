---
description: Generate a comprehensive README.md for the current project
argument-hint: "[output-path]"
---
Analyze this project and generate a production-quality README.md.

Steps:
1. Scan the repo structure: read package.json / pyproject.toml / Cargo.toml / go.mod or equivalent to determine language, framework, and dependencies.
2. Identify the entry point(s), build system, and test runner.
3. Read any existing README, CONTRIBUTING, and docs/ files for context — do not duplicate, improve.
4. Inspect CI config (.github/workflows/, .gitlab-ci.yml, etc.) for badges and workflow names.

Write the README with these sections (include only sections that are relevant — omit empty ones):

- **Project name + one-sentence tagline** — lead with value, not tech stack.
- **Badges** — build status, coverage, license, version (use real shield URLs if CI exists).
- **Overview** — 2–4 sentences: what problem it solves, who it's for, what makes it distinct.
- **Requirements** — minimum runtime/compiler versions, OS constraints.
- **Installation** — exact commands, copy-pasteable. Cover all supported package managers if applicable.
- **Quick start** — the minimal code or command to get a working result in under 2 minutes.
- **Usage** — key CLI flags, API surface, or configuration options. Use real examples from the codebase.
- **Configuration** — env vars, config file format, defaults. Reference actual variable names found in code.
- **Architecture** (if non-trivial) — one short paragraph or ASCII diagram showing major components.
- **Development** — how to clone, install dev deps, run tests, lint, and build.
- **Contributing** — link to CONTRIBUTING.md if it exists; otherwise write two sentences.
- **License** — license name and link to LICENSE file.

Constraints:
- Every code block must specify its language fence.
- Do not invent features or APIs — only document what exists in the codebase.
- Write for a developer who has never seen this project.
- Use ATX headings (##), not underline style.
- Keep the tone direct and neutral — no marketing language.

Output path: $ARGUMENTS (default: README.md in the repo root).
Write the file. Do not print the content to the terminal — just confirm the path written.
