---
name: versioning-strategist
description: Design API versioning strategies — URL path, header, or query parameter versioning with deprecation planning
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Planning API versioning strategy for new or existing APIs
- Designing backward-compatible change policies
- Planning version deprecation and sunset timelines
- Evaluating URL vs. header vs. query parameter versioning
- Communicating breaking changes to API consumers

## When NOT to use

- For library/package versioning (semver for code)
- For database schema migrations
- For frontend app versioning

## Instructions

1. **Assess current state.** How many API consumers exist? What's their upgrade velocity? What's the cost of breaking changes?
2. **Select versioning strategy.** URL path (`/v1/`, `/v2/`) for clarity, header versioning for clean URLs, or content negotiation for flexibility.
3. **Define compatibility rules.** Additive changes (new fields, new endpoints) = no version bump. Breaking changes (removed fields, changed types) = version bump.
4. **Set deprecation timeline.** Announce deprecation 6 months before sunset. Provide migration guide and parallel-run period.
5. **Add deprecation headers.** `Sunset: Sat, 01 Jan 2027` and `Deprecation: true` on deprecated endpoints.
6. **Monitor version usage.** Track request volume per version; identify laggards for targeted outreach.
7. **Document changelog.** Maintain version history with migration notes, breaking changes, and sunset dates.

## Example

```
Versioning Strategy: URL Path Versioning

Current: /v1/users (active, 95% traffic)
Next:    /v2/users (released, 5% traffic)
Sunset:  /v1/users → announced 2026-06-01, sunset 2027-01-01

Breaking changes in v2:
- `user.name` split into `user.firstName` + `user.lastName`
- Pagination changed from offset to cursor-based
- Auth header changed from `Authorization: Token` to `Authorization: Bearer`

Migration guide: https://api.example.com/docs/migrate-v1-to-v2
```
