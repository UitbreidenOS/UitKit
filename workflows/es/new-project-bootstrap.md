> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../new-project-bootstrap.md).

# Flujo de Trabajo de Bootstrap de Nuevo Proyecto

Cómo arrancar un nuevo proyecto con Claude Code — estructurado, con opinión y listo para construir desde el primer día.

---

## Cuándo usar este flujo de trabajo
- Comenzar una nueva aplicación desde cero
- Configurar un nuevo servicio en un sistema existente
- Crear un nuevo repositorio para un proyecto personal o un encargo de cliente

---

## Paso 1 — Define qué estás construyendo

Antes de tocar cualquier código o configuración, responde estas preguntas claramente.

**Prompt para Claude:**
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

No procedas hasta que el alcance esté confirmado por escrito.

---

## Paso 2 — Elige el stack

**Prompt para Claude:**
```
Based on what we're building:
- [paste summary from Step 1]

Recommend a specific stack. For each component (backend, frontend, database, auth, deployment), recommend:
- Your recommended choice and why it fits our constraints
- What we'd be giving up vs the next-best alternative
- No more than 2 options per component — I need a decision, not a menu

Be opinionated. I will push back if I disagree.
```

Bloquea el stack antes de escribir cualquier código. Registra las decisiones en `docs/adr/` si no son obvias.

---

## Paso 3 — Bootstrap de la estructura del proyecto

**Prompt para Claude:**
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

Verifica que funcione antes de continuar.

---

## Paso 4 — Configura CLAUDE.md

**Prompt para Claude:**
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

## Paso 5 — Configura el entorno de desarrollo

**Prompt para Claude:**
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

## Paso 6 — Configura el CI

**Prompt para Claude:**
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

Verifica que el CI pase en el commit inicial antes de avanzar al desarrollo de funcionalidades.

---

## Paso 7 — Planificación de la primera funcionalidad

Una vez que el esqueleto está funcionando y el CI está en verde:

**Prompt para Claude:**
```
The project is bootstrapped. Now plan the first feature:

Feature: [describe the first user-facing capability]

Use the feature-development workflow to plan and implement it.
Start with Step 1 of that workflow.
```

Ver `workflows/feature-development.md`.

---

## Lista de verificación del bootstrap

- [ ] Alcance definido y confirmado por escrito
- [ ] Stack decidido con razonamiento documentado
- [ ] Estructura del proyecto creada y funcionando ("hello world" funciona)
- [ ] CLAUDE.md escrito y con commit
- [ ] Docker Compose / dependencias locales funcionando
- [ ] .env.example con commit con todas las variables requeridas
- [ ] Pruebas configuradas y al menos una pasando
- [ ] Pipeline de CI en verde en el primer push
- [ ] `docs/adr/` creado con las decisiones arquitectónicas iniciales

---
