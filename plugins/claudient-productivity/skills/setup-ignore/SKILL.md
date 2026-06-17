---
name: "setup-ignore"
description: "Claude Code setup ignore: workflow guidelines, best practices, instructions, and integration examples"
---

# Setup Ignore

## When to activate
Activate when starting a new project session, when a user complains about high token usage/cost, or when Claude Code is reading too many irrelevant files (like `package-lock.json`, `dist/`, or `vendor/`). Invoked via `/setup-ignore`.

## When NOT to use
Do not use if the project already has a well-configured `.claudeignore` file, or if the user explicitly needs Claude to analyze compiled output, minified files, or exact dependency lock versions.

## Instructions
1. Analyze the project structure to determine the primary language/framework (e.g., look for `package.json` for Node, `requirements.txt`/`pyproject.toml` for Python, `go.mod` for Go).
2. Fetch the corresponding template from `claudeignore-templates/` (e.g., `node.claudeignore`, `python.claudeignore`, `go.claudeignore`).
3. If a `.claudeignore` file already exists in the project root, intelligently merge the template rules into it, avoiding duplicates. Do not overwrite custom user rules.
4. If a `.claudeignore` file does not exist, create it in the project root using the template content.
5. Explain to the user roughly how many tokens/files this will save from being needlessly indexed (e.g., "Ignored `node_modules` and `package-lock.json`, which saves ~40k tokens per request").

## Example
User: `/setup-ignore`
Claude: I see this is a Node.js project. I have created a `.claudeignore` file based on the Node template. I've ignored `node_modules/`, `dist/`, and `package-lock.json`. This will significantly reduce your context size and token costs on every turn.