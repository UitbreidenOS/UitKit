---
name: "learn-codebase"
description: "Claude Code codebase custom rules generator. Scans frameworks, dependency structures, test frameworks, and builds customized project-rules.md and CLAUDE.md files"
---

# Learn Codebase — Automated Workspace Rules Configuration

## When to activate
- Initializing a new git repository or checking out a new codebase.
- Setting up project rules when there is no existing `CLAUDE.md` or `.claude/rules/`.
- Integrating automated build or testing pipeline guides in the workspace.
- Enforcing custom coding guidelines tailored to JavaScript, TypeScript, Python, Rust, or Go ecosystems.

## When NOT to use
- Small, single-file scripts where no configuration or strict code formatting is needed.
- Static media, asset repositories, or generic text projects.

## Instructions

The `learn-codebase` skill runs `npx claudient learn` to inspect the project layout, configurations, and frameworks. It then writes tailored code conventions, lint checks, and testing commands directly to `.claude/rules/project-rules.md`.

```
                    ┌───────────────────┐
                    │  Scan Directory   │
                    └─────────┬─────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
   Ecosystem Files                     Ecosystem Files
(package.json / Cargo.toml)      (tsconfig.json / eslintrc)
            │                                   │
            └─────────────────┬─────────────────┘
                              ▼
                    ┌───────────────────┐
                    │ Compile Metadata  │
                    └─────────┬─────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
     CLAUDE.md File                   project-rules.md File
   (Root commands)                    (Specific conventions)
```

### 1. Build and Test Scoping
The command automatically maps dependency profiles:
*   **Node.js/JS:** Checks scripts in `package.json` to extract `build`, `dev`, and test runners (Jest, Playwright, Vitest).
*   **Python:** Scans imports inside `requirements.txt` or `pyproject.toml` to identify Flask/Django/FastAPI apps and tests (Pytest).
*   **Rust:** Configures cargo dependencies, test command `cargo test`, and lint routines.
*   **Go:** Builds go module pipelines using `go test ./...`.

### 2. Tailored Rules Generation
Based on the languages discovered, the command builds strict instructions:
*   *TypeScript:* Enforces strict typings, forbids type casting to `any`, and sets interface design rules.
*   *FastAPI:* Details Pydantic data validation structures and router designs.
*   *React/Next.js:* Outlines App Router/Page Router specifications, Client/Server component separations, and schema inputs.

---

## Example

**Running codebase learning on a Next.js TypeScript repository:**

```bash
npx claudient learn
```

**Output:**
```
🔍 Scoping codebase at: /Users/tushar/Desktop/Claudient

Detected Languages:  JavaScript, TypeScript
Detected Frameworks: Next.js, React
Testing Suites:      Jest, Playwright
Configuration Files: package.json, tsconfig.json, .eslintrc.json

✅ Rule file generated: .claude/rules/project-rules.md
✅ CLAUDE.md generated at codebase root

🎉 Learn complete. Custom rules added to active workspace configs.
```
This enables Claude Code to read `.claude/rules/project-rules.md` in subsequent prompts to automatically match the TypeScript interface style, Next.js architecture, and run testing commands.
