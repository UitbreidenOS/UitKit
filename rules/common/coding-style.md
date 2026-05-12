# Coding Style Rules

Copy the relevant sections into your project's `CLAUDE.md`.

---

## Naming

- Variables and functions: `camelCase` (JS/TS), `snake_case` (Python, Go, Rust)
- Classes and types: `PascalCase` in all languages
- Constants: `SCREAMING_SNAKE_CASE` only for true constants that never change
- Boolean variables: prefix with `is`, `has`, `can`, `should` — `isActive`, `hasPermission`
- Do not abbreviate names unless the abbreviation is universally known (`id`, `url`, `db`, `ctx`)

## Functions

- One responsibility per function — if you need "and" in the description, split it
- Maximum 40 lines per function; if longer, extract sub-functions
- No boolean parameters — use an options object or two separate functions
- Return early for guard clauses — don't nest the happy path inside conditionals

## Comments

- Write no comments unless the WHY is non-obvious
- Never write comments that describe what the code does (the code already does that)
- Write a comment when: there is a hidden constraint, a workaround for a specific bug, or behavior that would surprise a reader
- Never write TODO comments — create a tracked issue instead

## Error handling

- Never swallow errors silently (`catch (e) {}` is always wrong)
- Always handle errors at the boundary where you can take action
- Propagate errors upward with context — wrap with the relevant ID or operation name
- Do not use `console.error` in production code — use the project's logger

## File organization

- One primary export per file
- File names match their primary export: `UserService.ts` exports `UserService`
- No barrel files (`index.ts` re-exports) — import directly from the source file
- Group imports: external packages first, then internal modules, then relative imports

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. [uitbreiden.com](https://uitbreiden.com/)
