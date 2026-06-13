---
name: readme-generator
description: "Generate complete README.md files: badges, install, usage, API reference, contributing guide, from code or description"
updated: 2026-06-13
---

# README Generator Skill

## When to activate
- New project needs a README written from scratch
- Existing README is outdated or incomplete
- Open-sourcing a project and need professional documentation
- README exists but lacks install instructions, usage examples, or API reference

## When NOT to use
- Internal tools not meant for public consumption
- Projects with an existing documentation site (Docusaurus, MkDocs, etc.) — the README should just link there
- When you need deep API reference docs — use a proper doc generator (TypeDoc, Sphinx)

## Instructions

### Standard README structure

```markdown
# Project Name

> One-sentence description of what the project does and who it's for.

[![npm](badge)] [![license](badge)] [![ci](badge)]

## Features (optional — skip for simple tools)
- Key capability 1
- Key capability 2

## Install
\`\`\`bash
# Primary install method
npm install your-package

# or
pip install your-package
\`\`\`

## Quick Start
\`\`\`language
// Minimal working example — copy-paste ready
\`\`\`

## Usage
[More detailed examples, covering the main use cases]

## API Reference (if library/SDK)
### `functionName(param, options)`
Description.
**Parameters:** ...
**Returns:** ...
**Example:** ...

## Configuration
[Table of env vars or config options]

## Contributing
[One paragraph + link to CONTRIBUTING.md]

## License
MIT — see [LICENSE](LICENSE)
```

### Invoking the skill

**From scratch:**
```
/readme-generator

Project: {name}
What it does: {one paragraph}
Tech stack: {list}
Install method: {npm/pip/brew/binary/etc}
Key commands: {list}
Target audience: {developers / end-users / both}
```

**From existing code:**
```
/readme-generator

Read the codebase and generate a complete README.md.
Focus on: install, quick start, and API reference for exported functions.
```

**Update existing:**
```
/readme-generator

Update README.md — the install instructions are outdated (now uses pnpm),
and the API reference is missing the new `createSession()` function.
```

### Badge generation

Claude will suggest relevant badges from shields.io:

```markdown
[![npm version](https://img.shields.io/npm/v/package-name)](https://npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/org/repo/actions)
[![Downloads](https://img.shields.io/npm/dm/package-name)](https://npmjs.com/package/package-name)
```

### Writing principles

**First 3 lines are everything.** GitHub shows a preview — make the description and quick-start visible without scrolling.

**Working examples over description.** A code block that runs is worth 10 paragraphs of prose.

**Installation must be copy-paste ready.** Every step should work verbatim on a fresh machine.

**API reference format:**
```markdown
### `createUser(email, options?)`

Creates a new user account.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | Yes | User's email address |
| `options.role` | `'admin' \| 'user'` | No | Default: `'user'` |

**Returns:** `Promise<User>`

\`\`\`typescript
const user = await createUser('alice@example.com', { role: 'admin' })
\`\`\`
```

### Calibrating depth

| Project type | README depth |
|---|---|
| CLI tool | Install + usage + all flags/commands |
| npm library | Full API reference for every export |
| SaaS / web app | Features + deploy guide + env vars |
| GitHub template | What to replace + how to customise |
| Internal tool | Install + key commands + how to contribute |

## Example

**Input:**
```
Project: claudient
What it does: npm package with Claude Code skills, agents, hooks, and workflows
Install: npx claudient add all
Key commands: add, remove, list, search, init
Target audience: developers using Claude Code
```

**Expected output:** Complete README with hero description, npm/license/language badges, install section (`npx claudient add all`), CLI reference table for all subcommands, category list, contributing section, MIT license footer.

---
