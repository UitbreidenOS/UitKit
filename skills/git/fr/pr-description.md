---
name: pr-description
description: "Write pull request descriptions: summary, motivation, changes, testing steps, screenshots placeholder"
---

> 🇫🇷 Version française. [English version](../pr-description.md).

# Compétence : Description de Pull Request

## Quand activer
- Vous ouvrez une pull request et avez besoin d'une description structurée
- L'équipe exige un modèle PR standard que vous oubliez toujours de remplir
- Décrire un changement complexe à des relecteurs qui ont besoin de contexte rapidement
- Génération automatique de corps de PR à partir de l'historique des commits ou du diff de branche

## Quand NE PAS utiliser
- PRs brouillons marquées WIP — reportez la description complète jusqu'à ce qu'elles soient prêtes pour révision
- Corrections triviales d'une ligne où le titre est explicite
- PRs Dependabot / dépendances automatisées — laissez le bot les rédiger

## Instructions

### Structure de la description PR

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

### Flux de travail

Fournissez à Claude l'un des éléments suivants :
- Le diff de branche (`git diff main...HEAD`)
- Le journal des commits (`git log main..HEAD --oneline`)
- Une description simple de ce qui a changé

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

### Calibrer la longueur
- **Petite PR** (1–3 fichiers, changement évident) : résumé + changements + liste de vérification tests
- **PR moyenne** (4–10 fichiers, fonctionnalité) : modèle complet
- **Grande PR** (10+ fichiers, architecturale) : modèle complet + description du diagramme d'architecture

### Rédaction centrée sur le relecteur
Les bonnes descriptions de PR répondent aux questions que les relecteurs poseront avant qu'ils les posent :
- Pourquoi cette approche a-t-elle été choisie plutôt que les alternatives ?
- Quelles sont les zones à risque sur lesquelles concentrer la révision ?
- Comment cela a-t-il été testé ?
- Est-ce que quelque chose est intentionnellement laissé hors du périmètre ?

## Exemple

**Entrée :** "Added rate limiting to the API using Redis. Limits are 100 req/min per IP for unauthenticated users, 1000 req/min for authenticated. Configured via env vars."

**Résultat attendu :**
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
