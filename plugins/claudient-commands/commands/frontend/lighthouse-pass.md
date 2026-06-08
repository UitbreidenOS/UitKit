---
description: Audit code against Lighthouse performance, accessibility, and best-practices targets and apply fixes
argument-hint: "[file-or-route] [target-score: 90|95|100]"
---
Optimize $ARGUMENTS to pass Lighthouse audits at the specified target score (default: 90).

This command performs a static code analysis — it does not run a browser. Apply fixes that address known Lighthouse failure patterns.

**Performance — Core Web Vitals**

LCP (Largest Contentful Paint):
- Add `fetchpriority="high"` to the above-the-fold hero image or largest text block
- Remove `loading="lazy"` from any image that is likely above the fold
- Ensure critical CSS is inlined or loaded synchronously; audit for render-blocking `<link rel="stylesheet">` in `<head>`
- Replace `<img src="...">` with `<Image>` (Next.js) or add explicit `width`/`height` to prevent layout shift

CLS (Cumulative Layout Shift):
- Every `<img>`, `<video>`, and `<iframe>` must have explicit `width` and `height` attributes or an `aspect-ratio` CSS property
- Font loading: add `font-display: swap` to all `@font-face` declarations
- Avoid inserting content above existing content after page load (ads, banners, cookie notices)

INP / TBT (Interaction to Next Paint / Total Blocking Time):
- Move expensive computations off the main thread or wrap in `startTransition`
- Split large components with `React.lazy` + `Suspense` if they are below the fold
- Debounce or throttle event handlers on scroll, resize, and input

**Best Practices**
- All `<a>` targets with `target="_blank"` must have `rel="noopener noreferrer"`
- No `console.log` / `console.error` calls left in production code paths
- No deprecated HTML attributes (`border`, `align`, `bgcolor` on elements)
- `<meta name="viewport">` must be present and must not disable user scaling

**SEO**
- Each page/route must have a unique `<title>` and `<meta name="description">`
- Heading hierarchy must start at `<h1>` with no skipped levels
- Links must have descriptive text — flag "click here" and "read more" anchors

**Accessibility (Lighthouse subset)**
- Button and link labels: every interactive element must have an accessible name
- Image alt text: all non-decorative images need descriptive `alt`
- Form labels: every input has an associated `<label>` or `aria-label`

**Output**
For each issue found, emit: `file:line | audit category | issue | fix applied`
Apply all fixes directly. If a fix requires a runtime change (e.g., actual bundle splitting), note it as a manual action with the exact change needed.
