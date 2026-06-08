---
description: Generate Storybook CSF3 stories for a component covering all meaningful variants and states
argument-hint: "[ComponentFile.tsx]"
---
Generate Storybook stories for: $ARGUMENTS

Read the component file before writing anything. Extract props interface, variants, and state from the source.

**Step 1 — Analyze the component**
Identify:
- All props and their types (boolean flags, union string literals, optional vs required)
- Controlled vs uncontrolled behavior (does it accept `value`/`onChange`?)
- Loading, error, empty, and disabled states if they exist
- Any compound sub-components that need to be demonstrated together

**Step 2 — Determine story coverage**
Generate stories for:
1. `Default` — minimal required props, no optional extras
2. One story per meaningful boolean prop that changes visible output (e.g., `isDisabled`, `isLoading`, `isError`)
3. One story per string union variant (e.g., `variant: "primary" | "secondary" | "danger"`)
4. `AllVariants` — a single story rendering all variants side by side using a render function with a flex/grid wrapper, useful for visual regression
5. Controlled state story if the component accepts `value`/`onChange` — use `useState` inside the `render` function
6. Edge cases: empty string, very long text overflow, zero count, null/undefined optional data — only if the component is likely to encounter these

Do not generate stories for internal implementation details or props that only affect developer ergonomics.

**Step 3 — Write the story file**
Format rules:
- Use CSF3 (`export default { ... }` meta object + named story exports)
- `satisfies Meta<typeof Component>` for the meta type
- `satisfies StoryObj<typeof Component>` for each story
- `args` at the meta level for shared defaults; override per story only what changes
- Use `argTypes` to document union props with `control: { type: 'select' }`
- Import the component with the same import path used elsewhere in the project (check existing imports)
- Decorators: only add a `padding` decorator if the component visually requires it — do not wrap in unnecessary providers unless the component explicitly needs context

**Step 4 — Interaction tests (if @storybook/test is available)**
For the `Default` story, add a `play` function that:
- Verifies the component renders without error
- Simulates the primary user interaction (click, type, select)
- Asserts the expected DOM outcome with `expect()`

Output file: place the story file adjacent to the component (`ComponentName.stories.tsx`). Do not create a separate `__stories__` directory unless one already exists.
