---
description: Audit a component or page for WCAG 2.1 AA violations and emit a prioritized fix list
argument-hint: "[file-or-directory]"
---
Perform a WCAG 2.1 AA accessibility audit on: $ARGUMENTS

If no argument is given, audit the currently open file or the `src/` directory.

Audit checklist — evaluate each criterion and flag violations with file:line references:

**Perceivable**
- 1.1.1 Non-text content: every `<img>`, `<svg>`, `<canvas>` has meaningful `alt` or `aria-label`; decorative images use `alt=""`
- 1.3.1 Info and relationships: semantic HTML (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`) used correctly; no layout tables
- 1.3.2 Meaningful sequence: DOM order matches visual order; no CSS-only reordering that breaks screen reader flow
- 1.4.1 Use of color: information is not conveyed by color alone
- 1.4.3 Contrast: text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large); check computed color values
- 1.4.4 Resize text: layout survives 200% zoom without horizontal scroll or content loss
- 1.4.10 Reflow: no two-dimensional scrolling at 320px viewport width

**Operable**
- 2.1.1 Keyboard: all interactive elements reachable and operable via keyboard alone
- 2.1.2 No keyboard trap: focus can always leave every component
- 2.4.3 Focus order: logical tab sequence matches visual flow
- 2.4.7 Focus visible: all focusable elements have a visible focus indicator (not just browser default)
- 2.4.6 Headings and labels: headings are hierarchically correct (h1 → h2 → h3); no skipped levels

**Understandable**
- 3.1.1 Language of page: `<html lang="...">` is set correctly
- 3.2.2 On input: no unexpected context changes on focus or input
- 3.3.1 Error identification: form errors are identified in text and associated with the field via `aria-describedby`
- 3.3.2 Labels or instructions: every form field has a visible label or `aria-label`

**Robust**
- 4.1.2 Name, role, value: custom interactive components expose correct ARIA role, state, and property
- 4.1.3 Status messages: dynamic content uses `aria-live` regions appropriately

Output format:
1. Summary line: `N violations found (X critical, Y serious, Z moderate)`
2. Violation table: `| file:line | criterion | severity | issue | fix |`
3. After the table, emit the fixed code for each violation inline — do not just describe changes, apply them

Severity scale: critical (blocks screen reader users), serious (WCAG failure), moderate (best-practice gap).
