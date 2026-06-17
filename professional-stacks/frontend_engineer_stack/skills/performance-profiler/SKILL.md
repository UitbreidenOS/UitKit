# Performance Profiler

## When to activate

User runs `/profile-performance` or requests profiling of a component for render bottlenecks, optimization opportunities, and Core Web Vitals compliance.

## When NOT to use

- General component audits (use `/component-auditor` instead)
- Accessibility reviews (use `/review-a11y` instead)
- Server-side performance (this is frontend-only)

## Instructions

1. **Establish baseline metrics**
   - Measure initial render time (with React DevTools Profiler)
   - Record re-render frequency and duration
   - Capture bundle size contribution (with webpack-bundle-analyzer)
   - Baseline Core Web Vitals (LCP, FID, CLS)

2. **Identify bottlenecks**
   - Unnecessary re-renders (children, props changes)
   - Expensive computations (unmoized selectors, filters)
   - Layout thrashing (reading then writing DOM in loops)
   - Large bundle dependencies (suggest tree-shaking)

3. **Profile recommendations**
   - `useMemo` for expensive computations
   - `useCallback` for dependent callbacks (event handlers, memo deps)
   - `React.memo` for pure components
   - Code splitting for lazy-loaded components
   - Virtualization for long lists

4. **Measure post-optimization**
   - Re-measure same metrics after change
   - Calculate improvement % (target >10% for significant changes)
   - Compare against Core Web Vitals targets

5. **Document findings**
   - Before/after metrics (render time, re-renders, bundle size)
   - Specific code examples for optimization
   - Estimated user impact (perceived performance improvement)

## Example

User: "Profile this DataTable component — it feels slow."

Response:
- **Baseline:** 320ms initial render, 45 re-renders/input change, 85KB bundle
- **Bottleneck:** Entire table re-renders on every row filter (no memoization)
- **Recommendation:** Wrap rows in `React.memo`, use `useMemo` for filtered data
- **Optimization:** 120ms initial render (62% faster), 2 re-renders/input (95% fewer), same bundle
- **Impact:** LCP improves from 2.8s to 1.9s, perceived snappiness increases
