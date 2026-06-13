---
name: pr-description
description: "Write pull request descriptions: summary, motivation, changes, testing steps, screenshots placeholder"
updated: 2026-06-13
---

# PR Description Skill

## When to activate
- Opening a pull request and need a structured description
- Team requires a standard PR template that you keep forgetting to fill in
- Describing a complex change to reviewers who need context fast
- Auto-generating PR bodies from commit history or branch diff

## When NOT to use
- Draft PRs marked WIP — skip the full description until ready for review
- Trivial one-line fixes where the title is self-explanatory
- Dependabot / automated dependency PRs — let the bot write these

## Instructions

### PR description structure

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

### Workflow

Provide Claude with any of:
- The branch diff (`git diff main...HEAD`)
- The commit log (`git log main..HEAD --oneline`)
- A plain description of what changed

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

### Calibrating length
- **Small PR** (1–3 files, obvious change): summary + changes + testing checklist
- **Medium PR** (4–10 files, feature): full template
- **Large PR** (10+ files, architectural): full template + architecture diagram description

### Reviewer-first writing
Good PR descriptions answer the questions reviewers will ask before they ask them:
- Why was this approach chosen over alternatives?
- What are the risk areas to focus review on?
- How was this tested?
- Is anything intentionally left out of scope?

## Example

**Input:** "Added rate limiting to the API using Redis. Limits are 100 req/min per IP for unauthenticated users, 1000 req/min for authenticated. Configured via env vars."

**Expected output:**
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
