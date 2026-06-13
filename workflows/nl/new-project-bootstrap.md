> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../new-project-bootstrap.md).

# New Project Bootstrap Workflow

Hoe je een nieuw project opzet met Claude Code — gestructureerd, opinieus en klaar om op te bouwen vanaf dag één.

---

## Wanneer deze workflow te gebruiken
- Een nieuwe applicatie van scratch starten
- Een nieuwe service opzetten in een bestaand systeem
- Een nieuwe repository aanmaken voor een zijproject of klantbetrokkenheid

---

## Stap 1 — Definieer wat je bouwt

Beantwoord deze vragen duidelijk voor je code of configuratie aanraakt.

**Vraag Claude:**
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

Ga niet door totdat de reikwijdte schriftelijk is bevestigd.

---

## Stap 2 — Kies de stack

**Vraag Claude:**
```
Based on what we're building:
- [paste summary from Step 1]

Recommend a specific stack. For each component (backend, frontend, database, auth, deployment), recommend:
- Your recommended choice and why it fits our constraints
- What we'd be giving up vs the next-best alternative
- No more than 2 options per component — I need a decision, not a menu

Be opinionated. I will push back if I disagree.
```

Vergrendel de stack voor je code schrijft. Registreer beslissingen in `docs/adr/` als ze niet vanzelfsprekend zijn.

---

## Stap 3 — Bootstrap de projectstructuur

**Vraag Claude:**
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

Verifieer dat het draait voor je doorgaat.

---

## Stap 4 — Stel CLAUDE.md in

**Vraag Claude:**
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

## Stap 5 — Stel de ontwikkelomgeving in

**Vraag Claude:**
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

## Stap 6 — Stel CI in

**Vraag Claude:**
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

Verifieer dat CI slaagt op de initiële commit voor je naar featureontwikkeling gaat.

---

## Stap 7 — Eerste feature-planning

Zodra het skelet draait en CI groen is:

**Vraag Claude:**
```
The project is bootstrapped. Now plan the first feature:

Feature: [describe the first user-facing capability]

Use the feature-development workflow to plan and implement it.
Start with Step 1 of that workflow.
```

Zie `workflows/feature-development.md`.

---

## Bootstrap-checklist

- [ ] Reikwijdte gedefinieerd en schriftelijk bevestigd
- [ ] Stack besloten met gedocumenteerde redenering
- [ ] Projectstructuur aangemaakt en draaiend ("hello world" werkt)
- [ ] CLAUDE.md geschreven en gecommit
- [ ] Docker Compose / lokale afhankelijkheden draaien
- [ ] .env.example gecommit met alle vereiste variabelen
- [ ] Tests geconfigureerd en minimaal één slaagt
- [ ] CI-pipeline groen op eerste push
- [ ] `docs/adr/` aangemaakt met initiële architectuurbeslissingen

---
