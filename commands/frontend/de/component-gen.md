---
description: Generiert eine typisierte, barrierefreie React-Komponente mit Props-Interface und grundlegenden Tests
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Generiere eine produktionsreife React-Komponente basierend auf: $ARGUMENTS

Analysiere die Argumente:
- Erstes Token ist der PascalCase-Komponentenname
- Optional `functional` (Standard) oder `compound`-Variante
- Optional `react` (Standard) oder `next` für Framework-spezifische Muster

Anforderungen:
1. TypeScript mit explizitem Props-Interface — keine `any`, keine impliziten Typen
2. Benannte Exporte nur — keine Standard-Exporte
3. Props müssen `className?: string` für Stil-Erweiterung und `children?: React.ReactNode` enthalten, wenn die Komponente ein Container ist
4. Nutze `forwardRef`, wenn die Komponente ein natives DOM-Element umhüllt
5. Compound-Variante: Behalte Sub-Komponenten als statische Eigenschaften (z.B. `Card.Header`, `Card.Body`)
6. Keine Inline-Stile — nutze CSS Modules oder Tailwind Utility-Klassen je nachdem, was bereits im Projekt vorhanden ist
7. ARIA-Rollen und Attribute müssen korrekt für den Komponententyp sein (button, dialog, listbox, etc.)
8. Tastaturnavigation, wo zutreffend (Escape schließt Overlays, Enter/Space aktiviert Buttons)

Dateistruktur zum Ausgeben:
- `ComponentName.tsx` — Komponenten-Implementierung
- `ComponentName.test.tsx` — RTL Unit-Tests mit Abdeckung von: Rendering, Props-Weitergabe, Tastatur-Interaktion, Barrierefreiheit via `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — Storybook CSF3-Story mit mindestens Default und einer Varianten-Story

Vor dem Schreiben Repository scannen nach:
- Bestehende Komponenten-Muster zum Abgleich (Namensvergabe, Datei-Layout, Import-Stil)
- Design-Token oder Theme-Dateien zum Abrufen von Farb-/Abstands-Informationen
- Bestehende Test-Einrichtung (jest-Konfiguration, Test-Utilities, Render-Wrapper)

Erfinde kein Design-System — gleiche ab, was bereits in der Codebasis vorhanden ist. Wenn keines existiert, nutze minimales ungestyltes Markup und vermerke, dass Styling dem Verbraucher überlassen wird.
