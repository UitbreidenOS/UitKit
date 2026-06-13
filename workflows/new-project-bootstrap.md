# New Project Bootstrap Workflow

How to spin up a new project with Claude Code — structured, opinionated, and ready to build on from day one.

---

## When to use this workflow
- Starting a new application from scratch
- Setting up a new service in an existing system
- Creating a new repository for a side project or client engagement

---

## Step 1 — Define what you're building

Before touching any code or config, answer these questions clearly.

**Prompt Claude:**
```
I am starting a new project. Help me define it clearly before we write any code.

What I want to build: [describe in 2–3 sentences]

Ask me the following questions one at a time and wait for my answer before asking the next:
1. Who are the users and what is the primary thing they do?
2. What is the expected scale at launch? (users, requests/sec, data volume)
3. What are the hard constraints? (budget, timeline, team size, existing tech stack)
4. What does "done" look like for v1?
5. What is explicitly out of scope for v1?

After I answer all five, summarize what we're building and confirm with me before proceeding.
```

Do not proceed until the scope is confirmed in writing.

---

## Step 2 — Choose the stack

**Prompt Claude:**
```
Based on what we're building:
- [paste summary from Step 1]

Recommend a specific stack. For each component (backend, frontend, database, auth, deployment), recommend:
- Your recommended choice and why it fits our constraints
- What we'd be giving up vs the next-best alternative
- No more than 2 options per component — I need a decision, not a menu

Be opinionated. I will push back if I disagree.
```

Lock in the stack before writing any code. Record decisions in `docs/adr/` if they're non-obvious.

---

## Step 3 — Bootstrap the project structure

**Prompt Claude:**
```
Set up the initial project structure for: [stack from Step 2]

Create:
1. The directory structure (show as a tree before creating anything)
2. Package/dependency files with pinned versions
3. Configuration files (TypeScript, ESLint, Prettier, etc.)
4. .gitignore appropriate for this stack
5. A minimal working "hello world" that proves the stack runs

Do not add features yet. The goal is a running skeleton.
```

Verify it runs before continuing.

---

## Step 4 — Set up CLAUDE.md

**Prompt Claude:**
```
Create a CLAUDE.md for this project.

Include:
1. What this project is (one paragraph)
2. Stack summary (language, framework, key libraries, DB)
3. Directory structure with purpose of each directory
4. Coding conventions specific to this stack
5. Commands to run (dev server, tests, build, lint)
6. Decisions already made (from Steps 1–3) that should not be revisited
7. What NOT to do in this project

Make it dense and useful — not a tutorial. A senior developer should be able to start contributing after reading it.
```

---

## Step 5 — Set up the development environment

**Prompt Claude:**
```
Set up the development environment:

1. Docker Compose file for local dependencies (database, cache, queues)
2. Environment variable template (.env.example with all required vars, no real values)
3. Database migrations setup (initial schema if applicable)
4. Test setup (test runner config, example test, CI-ready)
5. A Makefile or scripts/ directory with common commands:
   - make dev (start local environment)
   - make test (run tests)
   - make build (production build)
   - make lint (lint and format check)
```

---

## Step 6 — Set up CI

**Prompt Claude:**
```
Set up a GitHub Actions CI pipeline:

On every PR:
- Install dependencies (with cache)
- Run lint
- Run tests
- Build (if applicable)

Use the github-actions skill for best practices:
- Pin action versions
- Explicit permissions
- Dependency caching
- Fail fast on test failures

The pipeline must pass on the current skeleton before we add features.
```

Verify CI passes on the initial commit before moving to feature development.

---

## Step 7 — First feature planning

Once the skeleton is running and CI is green:

**Prompt Claude:**
```
The project is bootstrapped. Now plan the first feature:

Feature: [describe the first user-facing capability]

Use the feature-development workflow to plan and implement it.
Start with Step 1 of that workflow.
```

See `workflows/feature-development.md`.

---

## Bootstrap checklist

- [ ] Scope defined and confirmed in writing
- [ ] Stack decided with documented reasoning
- [ ] Project structure created and running ("hello world" works)
- [ ] CLAUDE.md written and committed
- [ ] Docker Compose / local dependencies running
- [ ] .env.example committed with all required vars
- [ ] Tests configured and at least one passing
- [ ] CI pipeline green on first push
- [ ] `docs/adr/` created with initial architectural decisions

---
