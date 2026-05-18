---
name: pr-description
description: "Write pull request descriptions: summary, motivation, changes, testing steps, screenshots placeholder"
---

> 🇪🇸 Versión en español. [Versión en inglés](../pr-description.md).

# Habilidad: Descripción de Pull Request

## Cuándo activar
- Está abriendo un pull request y necesita una descripción estructurada
- El equipo requiere una plantilla PR estándar que siempre olvida completar
- Describir un cambio complejo a revisores que necesitan contexto rápido
- Generación automática de cuerpos de PR a partir del historial de commits o el diff de rama

## Cuándo NO usar
- PRs borrador marcadas como WIP — omita la descripción completa hasta que estén listas para revisión
- Correcciones triviales de una línea donde el título es autoexplicativo
- PRs de Dependabot / dependencias automatizadas — deje que el bot las escriba

## Instrucciones

### Estructura de la descripción PR

```markdown
## Summary
[1–3 bullet points: what this PR does at a high level]

## Motivation
[Why this change is needed — the problem it solves or the opportunity it captures]

## Changes
[Detailed breakdown of what changed and where]
- `path/to/file.py` — what changed and why
- `path/to/other.ts` — what changed and why

## Testing
- [ ] Unit tests added / updated
- [ ] Integration tests pass (`npm test` / `pytest`)
- [ ] Manual testing: [describe steps]
- [ ] Edge cases covered: [list]

## Screenshots (if UI change)
| Before | After |
|--------|-------|
| [screenshot] | [screenshot] |

## Breaking changes
[None / describe any breaking changes and migration path]

## Checklist
- [ ] Self-reviewed the diff
- [ ] Added tests for new behaviour
- [ ] Updated documentation / CHANGELOG
- [ ] No secrets or PII in the code
```

### Flujo de trabajo

Proporcione a Claude cualquiera de los siguientes:
- El diff de rama (`git diff main...HEAD`)
- El registro de commits (`git log main..HEAD --oneline`)
- Una descripción simple de lo que cambió

```
Write a PR description for this change:

Branch: feature/add-stripe-subscriptions
Commits:
- feat(billing): add Stripe checkout session creation
- feat(billing): add subscription webhook handler
- test(billing): add billing service tests
- docs: update API reference with billing endpoints

The change adds subscription billing using Stripe. Users can now
subscribe to the Pro plan via the /billing/checkout endpoint.
```

### Calibrar la longitud
- **PR pequeña** (1–3 archivos, cambio obvio): resumen + cambios + lista de verificación de pruebas
- **PR mediana** (4–10 archivos, funcionalidad): plantilla completa
- **PR grande** (10+ archivos, arquitectónica): plantilla completa + descripción del diagrama de arquitectura

### Escritura centrada en el revisor
Las buenas descripciones de PR responden las preguntas que los revisores harán antes de que las hagan:
- ¿Por qué se eligió este enfoque sobre las alternativas?
- ¿Cuáles son las áreas de riesgo en las que enfocar la revisión?
- ¿Cómo se probó esto?
- ¿Hay algo que intencionalmente se dejó fuera del alcance?

## Ejemplo

**Entrada:** "Added rate limiting to the API using Redis. Limits are 100 req/min per IP for unauthenticated users, 1000 req/min for authenticated. Configured via env vars."

**Salida esperada:**
```markdown
## Summary
- Add Redis-backed rate limiting to all API endpoints
- Configurable limits: 100 req/min (unauthenticated), 1000 req/min (authenticated)

## Motivation
Without rate limiting, a single client can exhaust server resources or abuse
the API. This unblocks the public API launch by meeting the security requirements
in the launch checklist.

## Changes
- `middleware/rate_limit.py` — new RateLimitMiddleware using Redis sliding window
- `config/settings.py` — `RATE_LIMIT_UNAUTH` and `RATE_LIMIT_AUTH` env vars
- `tests/test_rate_limit.py` — unit tests for both limit tiers and bypass logic

## Testing
- [x] Unit tests: 14 new tests covering limit enforcement, header injection, bypass
- [x] Integration test: ran 150 requests against staging, confirmed 429 on request 101
- [x] Manual: verified `X-RateLimit-Remaining` header decrements correctly

## Breaking changes
None — existing clients will see new `X-RateLimit-*` headers but no behaviour change
unless they exceed the limits (which would have caused errors anyway).
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
