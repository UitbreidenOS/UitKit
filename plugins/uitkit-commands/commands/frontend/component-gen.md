---
description: Generate a typed, accessible React component with props interface and basic tests
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Generate a production-ready React component based on: $ARGUMENTS

Parse the arguments:
- First token is the PascalCase component name
- Optional `functional` (default) or `compound` variant
- Optional `react` (default) or `next` for framework-specific patterns

Requirements:
1. TypeScript with explicit Props interface — no `any`, no implicit types
2. Named export only — no default exports
3. Props must include `className?: string` for style extension and `children?: React.ReactNode` if the component is a container
4. Use `forwardRef` if the component wraps a native DOM element
5. Compound variant: expose sub-components as static properties (e.g. `Card.Header`, `Card.Body`)
6. No inline styles — use CSS Modules or Tailwind utility classes depending on what's already in the project
7. ARIA roles and attributes must be correct for the component type (button, dialog, listbox, etc.)
8. Keyboard navigation support where applicable (Escape closes overlays, Enter/Space activates buttons)

File structure to emit:
- `ComponentName.tsx` — component implementation
- `ComponentName.test.tsx` — RTL unit tests covering: render, props forwarding, keyboard interaction, accessibility via `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — Storybook CSF3 story with at least Default and a variant story

Before writing, scan the repo for:
- Existing component patterns to match (naming, file layout, import style)
- Design token or theme files to pull color/spacing from
- Existing test setup (jest config, test utilities, render wrappers)

Do not invent a design system — match what is already in the codebase. If none exists, use minimal unstyled markup and note that styling is left to the consumer.
