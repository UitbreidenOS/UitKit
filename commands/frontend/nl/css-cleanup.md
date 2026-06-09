---
description: Verwijder dode CSS, consolideer duplicaten, dwing design tokens af en los specificiteit problemen op
argument-hint: "[file-or-directory]"
---
Clean up CSS/styles in: $ARGUMENTS

If no argument is given, scan all `.css`, `.scss`, `.module.css`, and Tailwind class strings in `src/`.

**Step 1 — Dead code removal**
Identify and delete:
- CSS rules whose selectors match no element in the JSX/HTML in this codebase (static analysis — flag dynamic class names as uncertain, do not delete them)
- `@keyframes` declarations that are not referenced by any `animation` or `animation-name` property
- CSS custom properties (variables) declared in `:root` or a component scope but never read via `var(--name)`
- Commented-out rule blocks older than the surrounding code (use git blame heuristic if available)

**Step 2 — Duplicate consolidation**
- Identical or near-identical rule sets applied to different selectors → extract a shared utility class or CSS custom property
- Repeated `margin`, `padding`, or `gap` values that match an existing design token → replace with the token
- Media query blocks with the same breakpoint scattered across the file → merge into a single block

**Step 3 — Design token enforcement**
Scan the project for a token source: CSS custom properties in `:root`, a Tailwind config `theme.extend`, a `tokens.ts` / `theme.ts` file, or a design system import.
For each hardcoded value found:
- Colors (hex, rgb, hsl): replace with the closest matching token if one exists within 5% perceptual distance; flag if no match
- Spacing (px, rem values): replace with the matching spacing scale token
- Font sizes: replace with the matching type scale token
- Do not replace values that have no reasonable token equivalent — flag them in the output instead

**Step 4 — Specificity and cascade issues**
- Selectors with specificity above `(0, 2, 0)` (two classes) → simplify or restructure
- `!important` declarations: remove each one and verify the cascade works without it; if removal changes behavior, note it but leave the `!important` in place with a comment explaining why
- Deeply nested SCSS (more than 3 levels) → flatten to BEM or utility classes matching the project convention
- Universal selector `*` with non-reset properties → flag for review

**Step 5 — Output**
Apply all safe changes (dead code, duplicates, token substitutions) directly.
For destructive or uncertain changes (selector deletion that may affect dynamic classes, `!important` removal), emit a list:
`file:line | issue | recommended action | reason not auto-applied`

Report totals: lines removed, rules consolidated, tokens substituted.
