---
description: Generate a CONTRIBUTING.md tailored to this repository's actual workflow
argument-hint: "[output-path]"
---
Generate a CONTRIBUTING.md for this repository.

Before writing anything:
1. Read the existing README, any CI config (`.github/workflows/`, `Makefile`, `justfile`),
   lint/format config (`.eslintrc`, `pyproject.toml`, `.prettierrc`, etc.), and test runner
   config (`jest.config.*`, `pytest.ini`, `vitest.config.*`).
2. Check for existing contribution docs — if `CONTRIBUTING.md` already exists, read it
   before overwriting. Preserve accurate sections; replace outdated or missing ones.
3. Identify the actual commands used: install, build, test, lint, format. Use what the
   repo defines, not generic defaults.

Write CONTRIBUTING.md with these sections:

### Prerequisites
Exact runtime/tool versions required (Node, Python, Go, etc.), sourced from `.nvmrc`,
`.python-version`, `go.mod`, or equivalent. If none found, say so.

### Getting Started
Clone → install → first run. Exact commands only. No "you might need to" hedging.

### Development Workflow
How to run the dev server / watcher / REPL. How to run tests and lints. Exact commands.

### Making Changes
Branch naming convention (infer from existing branch names or CI rules if present).
Commit message format (infer from git log or commitlint config).
PR process: who reviews, what checks must pass, how to request review.

### Code Style
Summarize enforced rules from the linter/formatter config. Do not list every rule —
only decisions a contributor would actively make (naming, file structure, test colocation).

### Testing Requirements
What test coverage is expected. Where to put new tests. How to run only a subset.

### Submitting a PR
Checklist: tests pass, lint passes, docs updated if needed, changelog entry if applicable.
Link to CI if GitHub Actions are present.

Accuracy rules:
- Every command must come from actual repo config. Do not invent scripts.
- If a section has no evidence in the repo, omit it rather than writing a generic placeholder.
- Output to: $ARGUMENTS (default: `CONTRIBUTING.md` at repo root).
- After writing, print the list of source files you read to produce the output.
