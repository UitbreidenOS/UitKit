# Frontend-prestatieregels

Toepassen bij het bouwen of beoordelen van browsergeleverde UI.

## Laden

- Serveer HTML vanuit de edge of CDN — elimineer roundtrips naar de oorsprong voor het initiële document
- Gebruik `<link rel="preload">` voor kritieke lettertypen en boven-in-beeld afbeeldingen; gebruik `<link rel="prefetch">` voor volgende-pagina assets
- Splits bundels op routegrenzen; lazy-load alles wat niet nodig is voor eerste paint
- Inline kritieke CSS (< 14 KB) in `<head>`; laad de rest asynchrone
- Stel ver-toekomstige `Cache-Control: immutable` in op gehasht statische assets; `no-cache` op HTML

## Afbeeldingen

- Gebruik moderne formaten: WebP met JPEG/PNG fallback; AVIF waar ondersteund
- Specificeer altijd `width` en `height` attributen om layout shift (CLS) te voorkomen
- Gebruik `loading="lazy"` voor onder-in-beeld afbeeldingen; nooit voor boven-in-beeld
- Serveer afbeeldingen in de gerenderde grootte — lever geen 2000 px afbeelding voor een 200 px slot
- Gebruik een CDN afbeeldingstransformatie service in plaats van resize tijdens build

## JavaScript

- Elke byte JS wordt geparsd en uitgevoerd — lever alleen wat de huidige route nodig heeft
- Vermijd synchrone lange taken (> 50 ms) op de main thread; verplaats zwaar werk naar een Web Worker
- Debounce input handlers; throttle scroll en resize listeners
- Verwijder event listeners en cancel timers bij component unmount om memory leaks te voorkomen
- Tree-shake dependencies: importeer named exports, niet hele bibliotheken

## Renderen

- Meet Core Web Vitals (LCP, INP, CLS) in real user monitoring — niet alleen in Lighthouse
- LCP doel: < 2,5 s; INP doel: < 200 ms; CLS doel: < 0,1
- Vermijd geforceerde synchrone layouts: lees layout eigenschappen niet onmiddellijk nadat je ze schrijft
- Gebruik `content-visibility: auto` op off-screen secties van lange pagina's
- Virtualiseer lange lijsten — render nooit duizenden DOM nodes

## Lettertypen

- Subset lettertypen naar de karaktersets die je gebruikt; laad geen volledige Unicode ranges voor alleen-Latijnse content
- Gebruik `font-display: swap` voor body text; `font-display: optional` voor decoratieve lettertypen
- Preconnect naar font CDN's: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- Self-host lettertypen wanneer latentie naar een derde-partij CDN meetbaar is

## Meting

- Stel een prestatiebudget in en fail CI wanneer het wordt overschreden (bundle grootte, LCP, Lighthouse score)
- Profile met echte devices op throttled verbindingen — developer machines zijn niet representatief
- Gebruik `PerformanceObserver` om veld data (real user metrics) te verzamelen, niet alleen synthetische tests
