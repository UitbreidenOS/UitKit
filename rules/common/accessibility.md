# Accessibility Rules

## Apply to
All UI code — HTML, JSX, TSX, template engines, design system components.

## Rules

1. **Semantic HTML first** — use `<button>`, `<nav>`, `<main>`, `<article>`, `<header>` before reaching for `<div>` + ARIA. The correct element conveys role, state, and keyboard behavior for free.

2. **Every interactive element must be keyboard-operable** — focusable, activatable with Enter/Space, navigable with Tab/Shift-Tab. Never suppress the focus outline without providing an equivalent visual indicator.

3. **All images need `alt` text** — decorative images use `alt=""`. Informative images describe content, not appearance: `alt="Error: form submission failed"` not `alt="red icon"`.

4. **Color alone cannot convey meaning** — pair color with text, icon, or pattern. A red border on an invalid field needs an error message. Charts need labeled data points or patterns.

5. **Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text and UI components** — test with a tool (axe, Lighthouse, Stark). Never eyeball contrast.

6. **Label every form control** — use `<label for="id">` or `aria-label` or `aria-labelledby`. Placeholder text is not a label — it disappears and has low contrast.

7. **Announce dynamic content changes** — when content updates without a page load, use `aria-live="polite"` for non-urgent updates, `aria-live="assertive"` only for errors or time-sensitive alerts.

8. **Never remove `tabindex="-1"` to hide elements from keyboard without also hiding them visually** — use `display: none` or `visibility: hidden` or `hidden` attribute to remove from both focus order and visual flow simultaneously.

9. **Custom widgets must implement the ARIA Authoring Practices pattern** — modals trap focus. Menus use arrow keys. Accordions use Enter/Space. Don't invent interaction models.

10. **Test with a screen reader before shipping interactive UI** — VoiceOver (macOS/iOS) or NVDA (Windows). Automated tools catch ~30% of issues; manual testing is non-negotiable for critical flows.

11. **Headings form a logical outline, never skip levels** — `h1` → `h2` → `h3`. Headings communicate document structure, not visual size. Use CSS for size.

12. **Error messages are specific and associated with their field** — "Required" is insufficient. "Email address is required" paired with `aria-describedby` pointing to the error element is correct.

13. **Don't auto-play audio or video with sound** — provide play/pause controls. Flashing content above 3 Hz can trigger seizures — avoid or provide a warning.

14. **Touch targets minimum 44×44 CSS pixels** — applies to mobile and touch interfaces. Small targets fail users with motor impairments and thumbs.

15. **Run `axe-core` or `eslint-plugin-jsx-a11y` in CI** — catch regressions automatically. Zero accessibility violations in automated checks is the floor, not the ceiling.


---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
