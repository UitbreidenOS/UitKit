---
name: pr-description
description: "Write pull request descriptions: summary, motivation, changes, testing steps, screenshots placeholder"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../pr-description.md).

# Vaardigheid: Pull Request Beschrijving

## Wanneer activeren
- U opent een pull request en heeft een gestructureerde beschrijving nodig
- Het team vereist een standaard PR-sjabloon dat u steeds vergeet in te vullen
- Een complexe wijziging beschrijven aan reviewers die snel context nodig hebben
- Automatisch PR-teksten genereren uit commitgeschiedenis of branch-diff

## Wanneer NIET gebruiken
- Concept-PRs gemarkeerd als WIP — sla de volledige beschrijving over totdat ze klaar zijn voor beoordeling
- Triviale eenregelige fixes waarbij de titel zelfverklarend is
- Dependabot / geautomatiseerde dependency-PRs — laat de bot deze schrijven

## Instructies

### PR-beschrijvingsstructuur

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

### Werkstroom

Geef Claude een van de volgende:
- De branch-diff (`git diff main...HEAD`)
- Het commitlogboek (`git log main..HEAD --oneline`)
- Een duidelijke beschrijving van wat er is veranderd

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

### Lengte kalibreren
- **Kleine PR** (1–3 bestanden, duidelijke wijziging): samenvatting + wijzigingen + testchecklist
- **Middelgrote PR** (4–10 bestanden, functie): volledig sjabloon
- **Grote PR** (10+ bestanden, architecturaal): volledig sjabloon + beschrijving architectuurdiagram

### Reviewergerichte schrijfstijl
Goede PR-beschrijvingen beantwoorden de vragen die reviewers zullen stellen vóórdat ze ze stellen:
- Waarom is deze aanpak gekozen boven alternatieven?
- Welke risicogebieden moeten worden gefocust bij de beoordeling?
- Hoe is dit getest?
- Is er iets opzettelijk buiten de scope gelaten?

## Voorbeeld

**Invoer:** "Added rate limiting to the API using Redis. Limits are 100 req/min per IP for unauthenticated users, 1000 req/min for authenticated. Configured via env vars."

**Verwachte uitvoer:**
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
