# Tech Debt Audit

## Purpose
End-of-session tech debt audit — finds and documents duplicated code, dead code, and improvement opportunities.

## When to use
- At the end of a coding session before closing out
- Before opening a PR to check what was introduced alongside the feature work
- When a codebase feels messy after a run of quick fixes
- During periodic maintenance sprints

## The Prompt

```
Review the code changed in this session and the surrounding codebase. Identify:

1. **Duplicated code** — functions, logic, or patterns that appear more than once and could be consolidated
2. **Dead code** — functions, variables, imports, or branches that are never reached or used
3. **Naming inconsistencies** — variables or functions that don't follow the codebase's established conventions
4. **Missing error handling** — places where errors could be thrown but aren't caught
5. **Performance quick wins** — obvious inefficiencies (N+1 queries, unnecessary re-renders, synchronous operations that could be async)

For each finding:
- File and line number
- What the issue is
- Suggested fix (2 sentences max)
- Effort to fix: [low / medium / high]

Sort by effort ascending. Stop at 10 items.
```

## Variables

None — this prompt operates on the current session context and open files. No placeholders required.

## Example

**Scenario:** You just finished adding a new user authentication flow across three files.

**Usage:** Paste the prompt as-is at the end of your session.

**Expected output:**

```
1. src/auth/login.ts:42 — Duplicated token validation logic also in src/auth/refresh.ts:18.
   Extract to shared `validateToken(token)` helper. Effort: low

2. src/utils/formatDate.ts:7 — `formatDateLegacy()` is imported nowhere.
   Delete the function and its test. Effort: low

3. src/api/users.ts:91 — fetchUserById called inside a loop over user IDs (N+1).
   Replace with a single fetchUsersByIds batch call. Effort: medium
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.youtube.com/@UITBREIDEN)
