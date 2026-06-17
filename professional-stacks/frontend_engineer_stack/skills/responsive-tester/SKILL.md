# Responsive Tester

## When to activate

User runs `/test-responsive` or requests testing of a component across multiple breakpoints and devices.

## When NOT to use

- Visual regression testing (use `/test-visual-regression` instead)
- Performance profiling (use `/profile-performance` instead)
- Accessibility reviews (use `/review-a11y` instead)

## Instructions

1. **Define test breakpoints**
   - Mobile (320px, 375px, 425px)
   - Tablet (768px, 1024px)
   - Desktop (1280px, 1440px, 1920px)
   - Landscape modes
   - Use design system breakpoints if defined

2. **Test layout integrity**
   - Content reflows without overflow
   - Text readable at all sizes
   - Touch targets meet 48x48px minimum on mobile
   - No horizontal scroll except for intentional overflow

3. **Test component behavior**
   - Navigation responsive (hamburger menu on mobile)
   - Forms responsive (single column on mobile, multi-column on desktop)
   - Images scale properly (responsive images, correct aspect ratio)
   - Media queries applied correctly

4. **Test viewport scenarios**
   - Portrait and landscape orientation
   - Zoom levels (100%, 125%, 150%)
   - Window resize (browser dev tools)
   - Mobile device emulation (Chrome DevTools, BrowserStack)

5. **Document findings**
   - Screenshots at each breakpoint
   - Issues identified (layout breaks, overflow, etc.)
   - Device-specific bugs (iOS Safari, Android Chrome)
   - Suggested fixes

6. **Produce responsive test report**
   - Breakpoint coverage (pass/fail at each breakpoint)
   - Device compatibility (pass/fail per device)
   - Accessibility at each breakpoint
   - Optimization recommendations

## Example

User: "Test this hero section across all devices."

Response:
- **Mobile (375px):** Pass (text readable, image scales, CTA tappable)
- **Mobile Landscape (812px):** Warning (image clip at bottom, hero height too tall)
- **Tablet (768px):** Pass (layout shifts to 2 columns, spacing correct)
- **Desktop (1440px):** Pass (4 columns, all spacing correct)
- **Issues:** Hero height should max-height: 80vh on landscape
- **Recommendation:** Test on actual iOS device (Safari viewport inconsistency)
