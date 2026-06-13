---
name: pr-description
description: "Write pull request descriptions: summary, motivation, changes, testing steps, screenshots placeholder"
---

> 🇩🇪 Deutsche Version. [Englische Version](../pr-description.md).

# Skill: Pull Request Beschreibung

## Wann aktivieren
- Sie öffnen einen pull request und benötigen eine strukturierte Beschreibung
- Das Team erfordert eine Standard-PR-Vorlage, die Sie immer wieder vergessen auszufüllen
- Beschreibung einer komplexen Änderung für Reviewer, die schnell Kontext benötigen
- Automatisches Generieren von PR-Texten aus der Commit-Historie oder dem Branch-Diff

## Wann NICHT verwenden
- Entwurfs-PRs, die als WIP markiert sind — überspringen Sie die vollständige Beschreibung, bis sie für die Überprüfung bereit sind
- Triviale einzeilige Fixes, bei denen der Titel selbsterklärend ist
- Dependabot / automatisierte Abhängigkeits-PRs — lassen Sie den Bot diese schreiben

## Anweisungen

### PR-Beschreibungsstruktur

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

### Arbeitsablauf

Stellen Sie Claude eines der folgenden zur Verfügung:
- Den Branch-Diff (`git diff main...HEAD`)
- Das Commit-Log (`git log main..HEAD --oneline`)
- Eine einfache Beschreibung dessen, was sich geändert hat

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

### Länge kalibrieren
- **Kleine PR** (1–3 Dateien, offensichtliche Änderung): Zusammenfassung + Änderungen + Test-Checkliste
- **Mittlere PR** (4–10 Dateien, Feature): vollständige Vorlage
- **Große PR** (10+ Dateien, architektonisch): vollständige Vorlage + Architekturdiagramm-Beschreibung

### Reviewer-zentriertes Schreiben
Gute PR-Beschreibungen beantworten Fragen, die Reviewer stellen werden, bevor sie sie stellen:
- Warum wurde dieser Ansatz gegenüber Alternativen gewählt?
- Welche Risikobereiche sollten bei der Überprüfung im Fokus stehen?
- Wie wurde dies getestet?
- Wurde etwas absichtlich aus dem Umfang ausgeschlossen?

## Beispiel

**Eingabe:** "Added rate limiting to the API using Redis. Limits are 100 req/min per IP for unauthenticated users, 1000 req/min for authenticated. Configured via env vars."

**Erwartete Ausgabe:**
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
