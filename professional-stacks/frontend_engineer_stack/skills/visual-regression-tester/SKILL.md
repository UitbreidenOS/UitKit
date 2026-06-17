# Visual Regression Tester

## When to activate

User runs `/test-visual-regression` or requests visual regression testing to detect unintended style changes.

## When NOT to use

- Responsive design testing (use `/test-responsive` instead)
- Performance profiling (use `/profile-performance` instead)
- Accessibility reviews (use `/review-a11y` instead)

## Instructions

1. **Establish baseline snapshots**
   - Capture current visual state (Chromatic, Percy, or local snapshots)
   - Generate snapshots for all component variants
   - Store baseline for comparison
   - Document baseline creation date and environment

2. **Implement snapshot capture**
   - Use Storybook addon (Chromatic, Percy) or Jest snapshots
   - Capture at consistent viewport size (1280x1024 standard)
   - Include hover, focus, active states
   - Capture light and dark modes (if supported)

3. **Run visual regression test**
   - Generate new snapshots after code change
   - Compare new snapshots to baseline
   - Identify pixel-level differences
   - Flag unintended changes (colors, spacing, fonts, etc.)

4. **Triage visual changes**
   - **Intentional:** Document approved changes (new design, refactor)
   - **Unintended:** Identify root cause (CSS, component change, dependency update)
   - **Edge cases:** Unexpected rendering in specific browsers/devices

5. **Report findings**
   - Before/after visual comparison
   - List of changed components
   - Impact assessment (user-visible, critical, cosmetic)
   - Root cause analysis for each change

6. **Approve or reject changes**
   - Approve intentional visual changes with justification
   - Reject unintended regressions
   - Require fix before merge
   - Update baseline for approved changes

## Example

User: "Check for visual regressions after updating Button styles."

Response:
- **Changed components:** 3 (Button primary, Button secondary, ButtonGroup)
- **Intentional changes detected:** Button padding increased from 8px to 12px
- **Unintended regressions:** Button outline color changed from gray to blue (unexpected)
- **Root cause:** Removed `.button:focus { color: blue }` CSS line
- **Fix:** Restore focus color CSS, re-snapshot
- **Impact:** High (focus state critical for accessibility)
