---
name: visual-qa
description: Visual regression and layout QA via screenshots — compare UI states, catch CSS breaks, and document visual drift.
updated: 2026-06-13
---

# Visual QA via Computer Use

## When to activate

- User asks to check if a CSS/layout change broke anything visually
- A UI component was edited and the user wants a side-by-side before/after comparison
- The app has no visual regression test suite (Percy, Chromatic, Playwright screenshots) and a manual check is needed
- User reports a layout bug ("it looks broken on my screen") and wants you to reproduce it
- Verifying responsive breakpoints — checking what the UI looks like at different viewport widths
- Checking dark mode, high-contrast, or other theme variants visually
- User says "does this look right", "check the layout", or "compare before and after"

## When NOT to use

- The user has a Percy/Chromatic/Playwright visual regression suite — run that instead
- The layout check would require navigating through sensitive screens (payment, credential, health data)
- You have no baseline screenshot to compare against and the user cannot provide one
- The check is purely functional (does the button work) rather than visual — use ui-testing skill instead

## Instructions

### Establishing baselines

Visual QA requires a reference state. Establish baselines before any changes are deployed:

1. Take a full-page screenshot of each view to be checked.
2. Name screenshots with a consistent convention: `[component]-[state]-[breakpoint]-before.png`
   - Example: `nav-menu-open-1280px-before.png`
3. Store or note the baseline so the after-screenshot can be compared.

If the user cannot provide a before screenshot, note this and proceed with a single-state audit (check for obvious layout issues without regression comparison).

### Screenshot discipline

- Always capture the full viewport, not a cropped region, unless the check is scoped to a specific component.
- Capture at the exact same scroll position before and after.
- For responsive checks, resize the viewport to the target breakpoint before capturing:
  - Mobile: 375px wide
  - Tablet: 768px wide
  - Desktop: 1280px wide
  - Wide: 1440px wide
- Disable animations/transitions before capturing if possible — a mid-animation screenshot is not useful.

### What to check in a visual audit

Work through this checklist for each screenshot:

**Layout integrity**
- [ ] No elements overflowing their containers
- [ ] No text truncated unexpectedly (check headings, labels, button copy)
- [ ] No unexpected horizontal scrollbar
- [ ] Spacing (padding/margin) is consistent with adjacent elements
- [ ] Grid/flexbox alignment is correct — no stray items

**Typography**
- [ ] Font sizes are correct (headings visually larger than body, labels smaller)
- [ ] Line height is not collapsed (text lines not overlapping)
- [ ] No invisible text (white text on white background, etc.)
- [ ] Font weight changes (bold, medium) rendered correctly

**Color and contrast**
- [ ] Brand colors match expected values (check against design system if available)
- [ ] Interactive states (hover, focus, active) visible and correct
- [ ] No unintended color bleed from adjacent elements
- [ ] Dark mode: all foreground/background pairings readable

**Component-specific**
- [ ] Modals and overlays centered and properly dimming background
- [ ] Dropdowns and tooltips not clipped by overflow:hidden containers
- [ ] Images loading (no broken image icons)
- [ ] Icons rendering at correct size and color
- [ ] Form inputs aligned with their labels

### Comparing before and after

When both states are available:

1. Place before and after screenshots side by side or describe differences explicitly.
2. For each visible difference, classify:
   - **Intended change** — matches what the developer changed (skip)
   - **Regression** — something that was correct is now broken (flag)
   - **Unrelated drift** — different screen content (data changed, ignore)
3. Report regressions with: component name, what changed, severity (cosmetic / functional / critical).

Severity guide:
- **Cosmetic**: minor spacing off by a few pixels, not user-facing impact
- **Functional**: button partially obscured, text unreadable, interactive element unreachable
- **Critical**: page layout completely broken, primary CTA invisible or inaccessible

### Safety rules

- Do not navigate to any screen that could trigger financial transactions, credential changes, or expose health data during a visual check.
- If capturing a screen that incidentally shows sensitive data, note this and do not include the screenshot in any report shared externally.
- Read-only visual observation only — do not click interactive elements unless explicitly asked as part of the visual QA scope.

### Reporting format

```
Visual QA Report
Component/View: [name]
Breakpoints checked: [list]
Themes checked: [light / dark / both]

Regressions found: [n]

[1] [Component name] — [Severity]
    Before: [description or screenshot ref]
    After: [description or screenshot ref]
    Issue: [what broke and why it matters]

Cosmetic notes (not blocking):
- [list of minor issues]

Passed checks: [list of what looked correct]
```

## Example

**Scenario**: A developer updated the navbar CSS. The user wants a visual QA before merging.

**Execution**:

1. User provides a before screenshot: `navbar-desktop-before.png` — shows nav with logo left, links center, CTA button right.
2. Navigate to the app at 1280px viewport. Take screenshot: `navbar-desktop-after.png`.
3. Compare:
   - Logo position: same. PASS.
   - Nav links: now pushed to the right and overlapping the CTA button. REGRESSION.
   - CTA button: partially hidden behind nav links. Severity: Functional.
4. Resize to 375px. Take screenshot: `navbar-mobile-after.png`.
   - Hamburger icon: present and visible. PASS.
   - Menu closed state: looks correct. PASS.

**Report**:
```
Visual QA Report
Component/View: Global Navbar
Breakpoints checked: 1280px, 375px
Themes checked: light

Regressions found: 1

[1] Nav links — Functional
    Before: links centered between logo and CTA button
    After: links overflowing into CTA button, button 40% occluded
    Issue: CTA "Get Started" is partially unreachable on desktop — primary conversion action blocked

Cosmetic notes (not blocking):
- None

Passed checks:
- Mobile hamburger icon visible
- Logo position unchanged
- Mobile menu closed state correct
```

Developer should fix the flex/grid property causing nav link overflow before merging.
