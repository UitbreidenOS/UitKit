---
description: Erstelle eine typisierte, barrierefreie React-Komponente mit Props-Interface und Basic-Tests
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Generiere eine produktionsreife React-Komponente basierend auf: $ARGUMENTS

Parse die Argumente:
- Das erste Token ist der PascalCase-Komponentenname
- Optionale `functional` (Standard) oder `compound` Variante
- Optionales `react` (Standard) oder `next` für Framework-spezifische Muster

Anforderungen:
1. TypeScript mit explizitem Props-Interface — kein `any`, keine impliziten Typen
2. Named Export nur — keine Default-Exports
3. Props müssen `className?: string` für Style-Erweiterung enthalten und `children?: React.ReactNode`, wenn die Komponente ein Container ist
4. Verwende `forwardRef`, wenn die Komponente ein natives DOM-Element umhüllt
5. Compound-Variante: Exponiere Sub-Komponenten als statische Properties (z.B. `Card.Header`, `Card.Body`)
6. Keine Inline-Styles — nutze CSS Modules oder Tailwind Utility Classes je nachdem, was bereits im Projekt vorhanden ist
7. ARIA-Rollen und -Attribute müssen korrekt für den Komponententyp sein (button, dialog, listbox, etc.)
8. Keyboard-Navigation-Support wo anwendbar (Escape schließt Overlays, Enter/Space aktiviert Buttons)

File-Struktur zum Emittieren:
- `ComponentName.tsx` — Komponenten-Implementierung
- `ComponentName.test.tsx` — RTL Unit Tests, die abdecken: Rendering, Props-Weitergabe, Keyboard-Interaktion, Barrierefreiheit via `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — Storybook CSF3 Story mit mindestens Default und eine Variant Story

Vor dem Schreiben, durchsuche das Repo nach:
- Bestehenden Komponenten-Mustern zum Abgleich (Naming, File-Layout, Import-Stil)
- Design-Token oder Theme-Dateien zum Ziehen von Farbe/Spacing
- Bestehendem Test-Setup (jest Config, Test-Utilities, Render-Wrapper)

Erfinde kein Design-System — stimme mit dem bereits in der Codebasis Vorhandenen überein. Falls keines vorhanden ist, nutze minimales unstyled Markup und vermerke, dass Styling dem Consumer überlassen ist.
