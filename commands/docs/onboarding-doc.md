---
description: Generate a developer onboarding document for this codebase
argument-hint: "[output-file]"
---
You are writing a developer onboarding document for this codebase. The goal is to get a new engineer productive as fast as possible — no fluff, no corporate tone.

Target output file (if specified): $ARGUMENTS

Steps to complete:

1. Scan the repository root for: README, package.json, pyproject.toml, Makefile, Dockerfile, docker-compose.yml, .env.example, and any CI config files (.github/, .gitlab-ci.yml, etc.).

2. Identify:
   - What the project does (one paragraph, no marketing language)
   - Primary language(s) and runtime versions
   - How to install dependencies
   - How to run the project locally (dev mode)
   - How to run tests
   - How to run linting / type checks
   - Any required environment variables (from .env.example or docs)
   - Any required external services (databases, queues, APIs)

3. Look for non-obvious setup steps: migrations, seed scripts, certificate installs, local tunnels, service mocks. Include them explicitly.

4. Check for a CONTRIBUTING.md or similar. If found, extract the branching strategy, PR process, and code review expectations and summarize them.

5. Identify the primary entry points: main files, key modules, important directories. Give a brief map (3–8 items) so the reader knows where to look first.

6. Note any known gotchas, quirks, or things that surprise new developers (broken tooling, flaky tests, unusual conventions, required manual steps).

Write the document in Markdown with the following sections — include only sections you have real content for:

## Overview
## Prerequisites
## Installation
## Running Locally
## Running Tests
## Environment Variables
## External Dependencies
## Codebase Map
## Contributing
## Known Issues / Gotchas

Rules:
- Write for a senior developer who has never seen this project
- Every command must be copy-pasteable and correct
- Do not invent information — if something is unclear, say so explicitly with a TODO marker
- No motivational language, no "happy path" framing — just facts and commands
- Keep each section tight; bullet points over prose where appropriate

If $ARGUMENTS is a file path, write the output to that file. Otherwise print the document to the conversation.
