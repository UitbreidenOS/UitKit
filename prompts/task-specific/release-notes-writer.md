# Prompt: Release Notes Writer

## Purpose

Convert raw git commits or a CHANGELOG section into polished, customer-facing release notes. Removes developer jargon, frames changes as user benefits, and surfaces breaking changes prominently.

## When to use

- Publishing a new version to npm, PyPI, GitHub Releases, or a product changelog page
- Translating an internal changelog into marketing-friendly copy for a newsletter or blog post
- Any release where the audience is end users or customers rather than contributors

## The Prompt

```
Convert the following commits (or CHANGELOG section) into customer-facing release notes.

INPUT:
[paste raw git log output, CHANGELOG section, or bullet list of changes here]

VERSION: [e.g., v2.4.0]
PRODUCT NAME: [e.g., Claudient, MyApp CLI, Acme SDK]
AUDIENCE: [choose one: end users / developers / enterprise buyers]

Produce release notes with this exact structure:

---
## [PRODUCT NAME] [VERSION] — [Release Date]

### What's new
[3–5 bullet points. Each bullet: one sentence, benefit language not implementation language.
Good: "Faster search — results now appear in under 100ms"
Bad: "Refactored search index with inverted trie structure"]

### Bug fixes
[Bullet list. Each item: what broke, what it does now. Skip internal refactors with no user impact.]

### Breaking changes
[If none: omit this section entirely. If present: use bold warning, exact migration steps, link to docs.]

### Upgrade
[Exact command to upgrade: npm install x@version, pip install x==version, etc.]
---

Rules:
- Never mention internal function names, file paths, PR numbers, or commit hashes in the output
- Never use these words: refactor, cleanup, codebase, impl, internals, DX
- If a commit has no user-visible impact (ci: fix flaky test, chore: update deps), omit it silently
- If a change affects API compatibility, it is a breaking change even if the author didn't label it
- Keep total length under 30 lines — release notes are not blog posts
- If the input contains insufficient information to write a bullet, note "[NEEDS DETAIL]" rather than inventing
```

## Variables

| Variable | Description | Example |
|---|---|---|
| `INPUT` | Raw commits, git log, or CHANGELOG block | `git log v2.3.0..v2.4.0 --oneline` output |
| `VERSION` | Version string being released | `v2.4.0` |
| `PRODUCT NAME` | The product or package name | `Claudient` |
| `AUDIENCE` | Who will read these notes | `developers` |

## Example

Input commits:
```
feat: add prompt caching support to API client
fix: streaming responses drop last token on slow connections
chore: upgrade eslint to v9
feat!: rename `runAgent` to `invokeAgent` — old name removed
docs: add MCP setup guide
test: increase coverage for webhook handler
```

Output:
```
## MyApp SDK v1.5.0 — May 2026

### What's new
- **Prompt caching support** — API calls using repeated context now cost up to 90% less on cached tokens
- **MCP setup documentation** — step-by-step guide for connecting Model Context Protocol servers

### Bug fixes
- Streaming responses no longer drop the final token on slow or throttled connections

### Breaking changes
> **`runAgent` has been removed.** Replace all calls with `invokeAgent` — the signature is identical.
> Migration: global find-and-replace `runAgent(` → `invokeAgent(`

### Upgrade
\`\`\`bash
npm install myapp-sdk@1.5.0
\`\`\`
```

---
