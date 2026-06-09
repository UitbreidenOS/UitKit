---
description: Code gegen Lighthouse-Leistungs-, Zugangs- und Best-Practices-Ziele prüfen und Fixes anwenden
argument-hint: "[file-or-route] [target-score: 90|95|100]"
---
Optimieren Sie $ARGUMENTS, um Lighthouse-Audits mit der angegebenen Zielwertung (Standard: 90) zu bestehen.

Dieser Befehl führt eine statische Code-Analyse durch – er führt keinen Browser aus. Wenden Sie Fixes an, die bekannte Lighthouse-Fehlermuster beheben.

**Leistung – Core Web Vitals**

LCP (Largest Contentful Paint):
- Fügen Sie `fetchpriority="high"` zum oberhalb des Faltbereichs befindlichen Hero-Bild oder größten Text-Block hinzu
- Entfernen Sie `loading="lazy"` von Bildern, die wahrscheinlich oberhalb des Faltbereichs angezeigt werden
- Stellen Sie sicher, dass kritisches CSS inline oder synchron geladen ist; prüfen Sie auf render-blockierende `<link rel="stylesheet">` in `<head>`
- Ersetzen Sie `<img src="...">` durch `<Image>` (Next.js) oder fügen Sie explizite `width`/`height` hinzu, um Layout-Verschiebungen zu verhindern

CLS (Cumulative Layout Shift):
- Jedes `<img>`, `<video>` und `<iframe>` muss explizite `width`- und `height`-Attribute oder eine `aspect-ratio`-CSS-Eigenschaft haben
- Schriftart-Laden: fügen Sie `font-display: swap` zu allen `@font-face`-Deklarationen hinzu
- Vermeiden Sie das Einfügen von Inhalten über vorhandenen Inhalten nach dem Laden der Seite (Anzeigen, Banner, Cookie-Hinweise)

INP / TBT (Interaction to Next Paint / Total Blocking Time):
- Verschieben Sie aufwendige Berechnungen aus dem Haupt-Thread oder wrappen Sie diese in `startTransition`
- Teilen Sie große Komponenten mit `React.lazy` + `Suspense` auf, wenn sie unterhalb des Faltbereichs sind
- Verwenden Sie Debounce oder Throttle für Event-Handler bei Scroll, Resize und Input

**Best Practices**
- Alle `<a>`-Ziele mit `target="_blank"` müssen `rel="noopener noreferrer"` haben
- Keine `console.log` / `console.error` Aufrufe im Production-Code
- Keine veralteten HTML-Attribute (`border`, `align`, `bgcolor` auf Elementen)
- `<meta name="viewport">` muss vorhanden sein und darf die Benutzer-Skalierung nicht deaktivieren

**SEO**
- Jede Seite/Route muss einen eindeutigen `<title>` und `<meta name="description">` haben
- Die Überschrift-Hierarchie muss mit `<h1>` beginnen ohne übersprungene Ebenen
- Links müssen beschreibenden Text haben – kennzeichnen Sie "click here" und "read more" Anker

**Barrierefreiheit (Lighthouse-Teilmenge)**
- Schaltflächen- und Link-Bezeichnungen: jedes interaktive Element muss einen zugänglichen Namen haben
- Bild-Alternativtext: alle nicht dekorativen Bilder benötigen beschreibenden `alt`
- Formular-Bezeichnungen: jede Eingabe hat ein zugehöriges `<label>` oder `aria-label`

**Ausgabe**
Geben Sie für jedes gefundene Problem folgendes aus: `file:line | audit category | issue | fix applied`
Wenden Sie alle Fixes direkt an. Wenn ein Fix eine Laufzeitänderung erfordert (z. B. echte Bundle-Aufteilung), notieren Sie diese als manuelle Aktion mit der genauen erforderlichen Änderung.
