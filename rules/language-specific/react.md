# React Rules

## Apply to
All React files (`*.tsx`, `*.jsx`) in any project.

## Rules

1. **One component per file** — name the file after the component. `UserCard.tsx` exports `UserCard`. Barrel files (`index.ts`) are acceptable for re-exporting, not for co-locating multiple components.

2. **Prefer function components with hooks over class components** — class components are legacy. The only valid reason to use a class component is a class-based error boundary.

3. **Keep components under ~150 lines** — if a component needs more, extract sub-components or move logic into custom hooks. Long components fail the single-responsibility principle.

4. **Lift state to the lowest common ancestor — no higher** — don't hoist state to a parent just because it's convenient. Global state (Context, Zustand, etc.) is for genuinely global data: auth, theme, locale.

5. **Custom hooks for logic, components for rendering** — data fetching, derived state, event handling belong in `use*` hooks, not inline in JSX. The component body should be mostly JSX.

6. **Never mutate state directly** — always return new objects/arrays. `setState(prev => ({ ...prev, key: value }))` not `state.key = value; setState(state)`.

7. **Specify keys on list items — never use array index as a key for dynamic lists** — index keys break reconciliation when items reorder or are inserted/deleted. Use stable, unique IDs.

8. **Memoize correctly or not at all** — `useMemo` and `useCallback` add overhead. Use them when a computation is genuinely expensive or a reference identity change causes unnecessary child re-renders. Benchmark before adding.

9. **Co-locate state, effects, and their UI** — don't scatter related state across the top of a file. Group `useState`/`useEffect` pairs near the JSX they affect, or extract to a hook.

10. **Avoid `useEffect` for derived state** — if a value can be computed from existing state/props synchronously, compute it inline. `useEffect` for derived state introduces a render cycle and a stale-read window.

11. **Type all props with TypeScript interfaces, not `any`** — `React.FC<Props>` is optional; typing the parameter directly (`({ name }: Props) => ...`) is equally valid and avoids `FC`'s implicit `children` footgun.

12. **Handle loading, error, and empty states explicitly** — every async-driven UI has three non-happy paths. Render them intentionally, not via fallthrough.

13. **Keep `useEffect` dependency arrays accurate** — `eslint-plugin-react-hooks` enforces this. Never suppress the exhaustive-deps warning without a comment explaining why.

14. **Avoid prop drilling beyond two levels** — pass via Context or a state manager. Three levels of prop threading is a sign of a missing abstraction.

15. **Test behavior, not implementation** — use React Testing Library. Assert on what the user sees and can interact with, not on internal state or component tree structure.


---
