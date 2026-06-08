# Frontend Performance Rules

Apply when building or reviewing browser-delivered UI.

## Loading

- Serve HTML from the edge or CDN — eliminate origin round trips for the initial document
- Use `<link rel="preload">` for critical fonts and above-the-fold images; use `<link rel="prefetch">` for next-page assets
- Split bundles at route boundaries; lazy-load everything not needed for first paint
- Inline critical CSS (< 14 KB) in `<head>`; load the rest asynchronously
- Set far-future `Cache-Control: immutable` on hashed static assets; `no-cache` on HTML

## Images

- Use modern formats: WebP with JPEG/PNG fallback; AVIF where supported
- Always specify `width` and `height` attributes to prevent layout shift (CLS)
- Use `loading="lazy"` for below-the-fold images; never for above-the-fold
- Serve images at the rendered size — don't deliver a 2000 px image for a 200 px slot
- Use a CDN image transformation service rather than resizing at build time

## JavaScript

- Every byte of JS is parsed and executed — ship only what the current route needs
- Avoid synchronous long tasks (> 50 ms) on the main thread; move heavy work to a Web Worker
- Debounce input handlers; throttle scroll and resize listeners
- Remove event listeners and cancel timers on component unmount to prevent memory leaks
- Tree-shake dependencies: import named exports, not entire libraries

## Rendering

- Measure Core Web Vitals (LCP, INP, CLS) in real user monitoring — not just in Lighthouse
- LCP target: < 2.5 s; INP target: < 200 ms; CLS target: < 0.1
- Avoid forced synchronous layouts: don't read layout properties immediately after writing them
- Use `content-visibility: auto` on off-screen sections of long pages
- Virtualise long lists — never render thousands of DOM nodes

## Fonts

- Subset fonts to the character sets you use; don't load full Unicode ranges for Latin-only content
- Use `font-display: swap` for body text; `font-display: optional` for decorative fonts
- Preconnect to font CDNs: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- Self-host fonts when latency to a third-party CDN is measurable

## Measurement

- Set a performance budget and fail CI when it is exceeded (bundle size, LCP, Lighthouse score)
- Profile with real devices on throttled connections — developer machines are not representative
- Use `PerformanceObserver` to collect field data (real user metrics), not just synthetic tests
