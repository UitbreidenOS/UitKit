# Component Auditor

## When to activate

User runs `/audit-component` or requests a comprehensive review of a React/Vue/Angular component for reusability, testability, accessibility, performance, and design system compliance.

## When NOT to use

- Simple style-only reviews (use `/profile-performance` instead)
- Accessibility-only audits (use `/review-a11y` instead)
- Design token checking alone (use `/check-design-system` instead)

## Instructions

1. **Examine component structure**
   - Single responsibility (one job per component)
   - Prop interface (clear, documented, not prop drilling)
   - Internal vs. composed state
   - Custom hooks extraction opportunity

2. **Test coverage analysis**
   - Identify untested code paths
   - Suggest test cases for edge cases
   - Check for mocking patterns

3. **Accessibility review**
   - Semantic HTML usage
   - ARIA labels and roles
   - Keyboard navigation
   - Focus management

4. **Performance analysis**
   - Render optimization (memoization, useMemo, useCallback)
   - Re-render frequency analysis
   - Bundle size impact

5. **Design system alignment**
   - Token usage (colors, spacing, typography)
   - Component name adherence
   - Storybook export completeness

6. **Produce actionable feedback**
   - 3–5 highest-impact refactors
   - Code examples for each suggestion
   - Estimated effort (small/medium/large)

## Example

User: "Audit this Button component for reuse across the design system."

Response:
- Identifies prop drilling opportunity (size, variant, disabled should extract to context)
- Suggests 80% test coverage on click handlers and state
- Flags missing `aria-label` for icon-only variants
- Recommends memoization if button appears in lists
- Confirms color tokens used, suggests adding to Storybook
