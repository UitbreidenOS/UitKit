> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../new-project-bootstrap.md).

# Neues Projekt Bootstrap Workflow

So wird ein neues Projekt mit Claude Code aufgesetzt — strukturiert, meinungsfreudig und bereit zum Bauen vom ersten Tag an.

---

## Wann diesen Workflow verwenden
- Eine neue Anwendung von Grund auf starten
- Einen neuen Service in einem bestehenden System einrichten
- Ein neues Repository für ein Nebenprojekt oder ein Kundenprojekt erstellen

---

## Schritt 1 — Definieren, was gebaut wird

Bevor Code oder Konfiguration berührt wird, diese Fragen klar beantworten.

**Claude fragen:**
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

Nicht fortfahren, bis der Umfang schriftlich bestätigt ist.

---

## Schritt 2 — Den Stack auswählen

**Claude fragen:**
```
Based on what we're building:
- [paste summary from Step 1]

Recommend a specific stack. For each component (backend, frontend, database, auth, deployment), recommend:
- Your recommended choice and why it fits our constraints
- What we'd be giving up vs the next-best alternative
- No more than 2 options per component — I need a decision, not a menu

Be opinionated. I will push back if I disagree.
```

Den Stack festlegen, bevor Code geschrieben wird. Entscheidungen in `docs/adr/` aufzeichnen, wenn sie nicht offensichtlich sind.

---

## Schritt 3 — Die Projektstruktur bootstrappen

**Claude fragen:**
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

Verifizieren, dass es läuft, bevor fortgefahren wird.

---

## Schritt 4 — CLAUDE.md einrichten

**Claude fragen:**
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

## Schritt 5 — Entwicklungsumgebung einrichten

**Claude fragen:**
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

## Schritt 6 — CI einrichten

**Claude fragen:**
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

Sicherstellen, dass CI beim ersten Commit besteht, bevor Feature-Entwicklung beginnt.

---

## Schritt 7 — Erstes Feature planen

Sobald das Skeleton läuft und CI grün ist:

**Claude fragen:**
```
The project is bootstrapped. Now plan the first feature:

Feature: [describe the first user-facing capability]

Use the feature-development workflow to plan and implement it.
Start with Step 1 of that workflow.
```

Siehe `workflows/feature-development.md`.

---

## Bootstrap-Checkliste

- [ ] Umfang definiert und schriftlich bestätigt
- [ ] Stack mit dokumentierter Begründung entschieden
- [ ] Projektstruktur erstellt und läuft ("hello world" funktioniert)
- [ ] CLAUDE.md geschrieben und committet
- [ ] Docker Compose / lokale Abhängigkeiten laufen
- [ ] .env.example mit allen erforderlichen Vars committet
- [ ] Tests konfiguriert und mindestens einer bestehend
- [ ] CI-Pipeline grün beim ersten Push
- [ ] `docs/adr/` mit anfänglichen Architekturentscheidungen erstellt

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
