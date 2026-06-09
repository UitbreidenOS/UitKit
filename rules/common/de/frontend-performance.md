# Frontend-Performance-Regeln

Anwenden beim Erstellen oder Überprüfen von browser-basierter UI.

## Laden

- Serviere HTML vom Edge oder CDN — eliminiere Origin Round Trips für das initiale Dokument
- Verwende `<link rel="preload">` für kritische Fonts und Above-the-Fold-Bilder; verwende `<link rel="prefetch">` für Nächste-Seite-Assets
- Teile Bundles an Route-Grenzen auf; Lazy-Load alles, das nicht für das erste Rendering benötigt wird
- Inline kritisches CSS (< 14 KB) in `<head>`; lade den Rest asynchron
- Setze Far-Future `Cache-Control: immutable` auf gehashte statische Assets; `no-cache` auf HTML

## Bilder

- Verwende moderne Formate: WebP mit JPEG/PNG-Fallback; AVIF wo unterstützt
- Gib immer `width` und `height`-Attribute an, um Layout-Shift zu verhindern (CLS)
- Verwende `loading="lazy"` für Below-the-Fold-Bilder; nie für Above-the-Fold
- Serviere Bilder in der gerenderten Größe — liefere kein 2000 px Bild für einen 200 px Slot
- Verwende einen CDN-Bildtransformationsdienst statt Größenänderung zur Build-Zeit

## JavaScript

- Jedes Byte JS wird geparst und ausgeführt — verschiebe nur das, das die aktuelle Route benötigt
- Vermeide synchrone lange Aufgaben (> 50 ms) auf dem Main Thread; verschiebe schwere Arbeiten zu einem Web Worker
- Debounce Input-Handler; Throttle Scroll- und Resize-Listener
- Entferne Event-Listener und kündige Timer bei Component Unmount, um Memory Leaks zu verhindern
- Tree-Shake Abhängigkeiten: importiere benannte Exports, nicht ganze Bibliotheken

## Rendering

- Messe Core Web Vitals (LCP, INP, CLS) in echtem User Monitoring — nicht nur in Lighthouse
- LCP-Ziel: < 2,5 s; INP-Ziel: < 200 ms; CLS-Ziel: < 0,1
- Vermeide erzwungene synchrone Layouts: lies nicht sofort nach dem Schreiben Layout-Eigenschaften
- Verwende `content-visibility: auto` auf Off-Screen-Sektionen von langen Seiten
- Virtualisiere lange Listen — rendere nie tausende von DOM-Knoten

## Fonts

- Subset Fonts zu den Zeichensätzen, die du verwendest; lade nicht vollständige Unicode-Bereiche für Nur-Latein-Inhalte
- Verwende `font-display: swap` für Body-Text; `font-display: optional` für dekorative Fonts
- Preconnect zu Font-CDNs: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- Self-Host Fonts wenn die Latenz zu einem Third-Party-CDN messbar ist

## Messung

- Setze ein Performance Budget und lasse CI fehlschlagen, wenn es überschritten wird (Bundle-Größe, LCP, Lighthouse-Score)
- Profile mit echten Geräten auf gedrosselten Verbindungen — Developer-Maschinen sind nicht repräsentativ
- Verwende `PerformanceObserver` um Field-Daten zu sammeln (echte User-Metriken), nicht nur synthetische Tests
