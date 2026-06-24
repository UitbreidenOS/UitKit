---
description: Identify and fix responsive layout breakages for a given file or component
argument-hint: "[file] [breakpoint: sm|md|lg|xl]"
---
Fix responsive layout issues in: $ARGUMENTS

Parse args: first token is the target file; optional breakpoint name narrows scope to that breakpoint only. If no breakpoint is given, audit all standard breakpoints.

**Step 1 — Identify the breakpoint system**
Scan the project for:
- Tailwind config (`tailwind.config.*`) to extract custom breakpoints
- CSS custom properties or SCSS variables defining breakpoints
- Media query values used in existing stylesheets
Use the project's own breakpoint names/values throughout — do not invent or override them.

**Step 2 — Audit layout at each breakpoint**
Check for these failure patterns:

Overflow and clipping:
- Fixed `width` or `height` values on containers that should be fluid
- `min-width` larger than the viewport at that breakpoint
- `white-space: nowrap` on text that will overflow on narrow screens

Flexbox / Grid:
- `flex-wrap: nowrap` causing overflow on small screens
- Grid columns with `fr` units that collapse to unreadable widths
- Missing `min-width: 0` on flex/grid children that contain overflowing content

Spacing:
- Fixed `padding` or `margin` values that consume disproportionate space on mobile
- Absolute-positioned elements with fixed offsets that escape their container at narrow widths

Typography:
- `font-size` values not scaling down — flag if no `clamp()` or responsive class is used
- Line lengths (`max-width`) not adjusted for small screens

Images and media:
- Missing `max-width: 100%` on images inside fluid containers
- `aspect-ratio` not set on media that causes layout shift

**Step 3 — Apply fixes**
For each issue found:
- Edit the file directly
- Use the project's responsive utility classes (e.g., Tailwind `sm:`, `md:`) or media queries matching the existing pattern
- Do not rewrite working code — surgical, minimal edits only

**Step 4 — Report**
After applying fixes, list: `file:line | breakpoint | issue | fix applied`

If the component requires visual verification, note which breakpoints to manually check in the browser.
