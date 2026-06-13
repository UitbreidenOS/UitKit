---
description: Code gegen Lighthouse-Anforderungen für Performance, Barrierefreiheit und Best Practices prüfen und Fixes anwenden
argument-hint: "[file-oder-route] [zielwert: 90|95|100]"
---
Optimieren Sie $ARGUMENTS, um Lighthouse-Audits beim angegebenen Zielwert zu bestehen (Standard: 90).

Dieser Befehl führt eine statische Code-Analyse durch — er startet keinen Browser. Wenden Sie Fixes an, die bekannte Lighthouse-Fehlermuster adressieren.

**Performance — Core Web Vitals**

LCP (Largest Contentful Paint):
- Fügen Sie `fetchpriority="high"` zum Above-the-Fold-Hero-Bild oder zum größten Textblock hinzu
- Entfernen Sie `loading="lazy"` von jedem Bild, das wahrscheinlich Above-the-Fold liegt
- Stellen Sie sicher, dass kritisches CSS inline eingebunden oder synchron geladen wird; prüfen Sie auf Render-blockierende `<link rel="stylesheet">` im `<head>`
- Ersetzen Sie `<img src="...">` durch `<Image>` (Next.js) oder fügen Sie explizit `width`/`height` hinzu, um Layout-Verschiebungen zu vermeiden

CLS (Cumulative Layout Shift):
- Jedes `<img>`, `<video>` und `<iframe>` muss explizite `width`- und `height`-Attribute oder eine `aspect-ratio`-CSS-Eigenschaft haben
- Schriftladung: Fügen Sie `font-display: swap` zu allen `@font-face`-Deklarationen hinzu
- Vermeiden Sie das Einfügen von Inhalten über bestehenden Inhalten nach dem Laden der Seite (Anzeigen, Banner, Cookie-Hinweise)

INP / TBT (Interaction to Next Paint / Total Blocking Time):
- Verschieben Sie teure Berechnungen aus dem Haupt-Thread oder wrappen Sie sie in `startTransition`
- Teilen Sie große Komponenten mit `React.lazy` + `Suspense` auf, falls sie unterhalb des Falts liegen
- Drosseln oder entprellen Sie Event-Handler bei Scroll, Resize und Input

**Best Practices**
- Alle `<a>`-Ziele mit `target="_blank"` müssen `rel="noopener noreferrer"` haben
- Keine `console.log` / `console.error`-Aufrufe in Produktionscode-Pfaden
- Keine veralteten HTML-Attribute (`border`, `align`, `bgcolor` auf Elementen)
- `<meta name="viewport">` muss vorhanden sein und darf das Zoomen durch Nutzer nicht deaktivieren

**SEO**
- Jede Seite/Route muss einen eindeutigen `<title>` und `<meta name="description">` haben
- Die Heading-Hierarchie muss mit `<h1>` beginnen ohne übersprungene Ebenen
- Links müssen aussagekräftigen Text haben — kennzeichnen Sie "hier klicken" und "mehr lesen"-Anker

**Barrierefreiheit (Lighthouse-Teilmenge)**
- Button- und Link-Labels: jedes interaktive Element muss einen zugänglichen Namen haben
- Bild-Alt-Text: alle nicht-dekorativen Bilder benötigen aussagekräftiges `alt`
- Formular-Labels: jedes Input-Feld hat ein zugehöriges `<label>` oder `aria-label`

**Ausgabe**
Für jedes gefundene Problem geben Sie aus: `datei:zeile | audit-kategorie | problem | angewendeter fix`
Wenden Sie alle Fixes direkt an. Wenn ein Fix eine Laufzeitänderung erfordert (z. B. tatsächliches Bundle-Splitting), notieren Sie es als manuelle Aktion mit der genauen erforderlichen Änderung.
