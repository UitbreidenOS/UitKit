# Design System Checker

## When to activate

User runs `/check-design-system` or requests verification that a component uses design tokens and adheres to the design system.

## When NOT to use

- Full component audits (use `/component-auditor` instead)
- Storybook generation (use `/storybook-generator` instead)
- Accessibility reviews (use `/review-a11y` instead)

## Instructions

1. **Analyze token usage**
   - Identify all hardcoded colors, spacing, typography
   - Map to design token equivalents
   - Flag any missing tokens in the design system
   - Suggest token structure if design system is incomplete

2. **Check design system alignment**
   - Component naming matches design system spec
   - Props align with design tokens (color, size, spacing, etc.)
   - Variants match approved design system variants
   - Dark mode support (if design system requires)

3. **Review Storybook integration**
   - Component exported to Storybook
   - All variants documented
   - Props documented with descriptions
   - Usage examples provided

4. **Generate token migration plan**
   - List hardcoded values to replace
   - Provide `var()` CSS or token references
   - Suggest code diffs for refactor
   - Estimate effort (small/medium/large)

5. **Verify design spec alignment**
   - Component matches Figma/design spec
   - Breakpoints and responsive behavior correct
   - Spacing, typography, colors all match
   - Interaction patterns (hover, focus, active) match

6. **Produce audit report**
   - Token compliance score (%)
   - Design system alignment score (%)
   - Storybook coverage score (%)
   - Actionable refactoring plan

## Example

User: "Check if this Card component follows our design system."

Response:
- **Token Compliance:** 60% (hardcoded colors, missing spacing tokens)
- **Design System Alignment:** 90% (naming correct, variants match)
- **Storybook Coverage:** 70% (missing dark mode variant)
- **Refactor Plan:**
  - Replace `color: #FF6B6B` with `var(--color-red-500)`
  - Replace `padding: 16px` with `var(--spacing-4)`
  - Add dark mode variant to Storybook
  - Add `aria-label` for icon cards
