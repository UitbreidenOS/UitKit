# A11Y Reviewer

## When to activate

User runs `/review-a11y` or requests an accessibility audit of a component for WCAG 2.1 AA compliance.

## When NOT to use

- Broader component audits (use `/component-auditor` instead)
- Performance profiling (use `/profile-performance` instead)
- Semantic code structure issues outside accessibility scope

## Instructions

1. **Semantic HTML check**
   - Correct tag usage (`<button>` not `<div onclick>`)
   - Heading hierarchy (`<h1>` → `<h2>`, not skipping levels)
   - List semantics (`<ul>`, `<ol>`, `<li>`)
   - Form semantics (`<label>`, `<fieldset>`, `<legend>`)

2. **Color contrast audit**
   - AA standard: 4.5:1 for text, 3:1 for UI components
   - Tool: axe, WAVE, or computed contrast ratios
   - Suggest alternative colors if failing

3. **Keyboard navigation test**
   - Tab order is logical and visible
   - No keyboard traps (escape key works)
   - Focus visible on all interactive elements
   - Suggest CSS for `:focus-visible` if missing

4. **ARIA review**
   - ARIA labels for icon-only buttons
   - ARIA roles where semantics insufficient
   - ARIA live regions for dynamic updates
   - Avoid redundant ARIA on semantic elements

5. **Motion and animation**
   - Respect `prefers-reduced-motion` media query
   - Warn if animations cannot be disabled
   - Suggest CSS override for animations

6. **Produce WCAG audit report**
   - Failures (must fix to meet AA)
   - Warnings (should fix)
   - Passed checks
   - Code examples for each fix

## Example

User: "Check this modal dialog for accessibility."

Response:
- **Failure:** Heading hierarchy broken (h1 missing main page heading)
- **Failure:** Focus trap on close button (no Tab escape)
- **Warning:** Close button missing `aria-label` (X icon not labeled)
- **Warning:** Modal not marked with `role="dialog"` and `aria-labelledby`
- **Pass:** Color contrast meets 4.5:1
- **Fix:** Add `aria-label="Close"` to button, add `role="dialog"`, manage focus trap on open/close
