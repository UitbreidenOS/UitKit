---
description: Refactor component state to reduce complexity, lift/colocate correctly, and eliminate prop drilling
argument-hint: "[file-or-component-name]"
---
Refactor state management in: $ARGUMENTS

Read the target file (and its immediate consumers if identifiable) before proposing changes.

**Step 1 — Classify existing state**
For each `useState`, `useReducer`, `useRef`, `useContext`, or store selector found, label it:
- `local` — used only within this component
- `shared` — passed as props to 2+ children
- `derived` — can be computed from other state or props, does not need to be stored
- `server` — data that comes from an API and should live in a query cache, not component state
- `url` — state that belongs in the URL (filters, pagination, selected IDs)

**Step 2 — Identify problems**
- Prop drilling: props passed through 2+ intermediate components that don't use them → candidate for context or colocation
- Derived state stored as `useState` that is set inside `useEffect` → replace with `useMemo` or inline computation
- State that resets on every render because initializer is recreated (object/array literal in useState call) → stabilize with `useRef` initializer or module-level constant
- Redundant state that duplicates props or can be computed from other state
- Stale closures: `useEffect` missing deps or using `deps: []` with references to mutable values

**Step 3 — Apply refactors**
Priority order:
1. Delete derived state first — pure simplification, zero risk
2. Colocate state that was lifted higher than necessary — move it back down to the leaf that owns it
3. Lift state that is genuinely shared — move to lowest common ancestor, not arbitrarily higher
4. Replace prop drilling chains with a narrow context (not a global store) scoped to the subtree that needs it
5. Move server data to the existing query library (React Query, SWR, RTK Query — use whichever is already in the project)
6. Move URL-shaped state to the router (Next.js `useSearchParams`, React Router `useSearchParams`)

**Step 4 — Output**
Apply all changes directly to the files. After edits, summarize:
- State vars removed: N
- Props eliminated from intermediate components: N
- `useEffect` calls removed: N
- Any architectural decision that needs team awareness (e.g., new context introduced)

Do not add a state management library that is not already in the project.
