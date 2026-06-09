---
description: Genereer een getypeerde, toegankelijke React-component met props-interface en basistest
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Genereer een productie-klare React-component op basis van: $ARGUMENTS

Parse de argumenten:
- Eerste token is de PascalCase-componentnaam
- Optioneel `functional` (standaard) of `compound` variant
- Optioneel `react` (standaard) of `next` voor framework-specifieke patronen

Vereisten:
1. TypeScript met expliciete Props-interface — geen `any`, geen impliciete types
2. Alleen benoemde export — geen standaard exports
3. Props moet `className?: string` bevatten voor stijluitbreiding en `children?: React.ReactNode` als de component een container is
4. Gebruik `forwardRef` als de component een native DOM-element omwikkelt
5. Compound variant: expose sub-components als statische eigenschappen (bijv. `Card.Header`, `Card.Body`)
6. Geen inline-stijlen — gebruik CSS Modules of Tailwind-hulpklassen, afhankelijk van wat al in het project aanwezig is
7. ARIA-rollen en -kenmerken moeten correct zijn voor het componenttype (button, dialog, listbox, enz.)
8. Ondersteuning voor toetsenbordnavigatie waar van toepassing (Escape sluit overlays, Enter/Space activeert knoppen)

Bestandsstructuur om uit te zenden:
- `ComponentName.tsx` — componentimplementatie
- `ComponentName.test.tsx` — RTL-eenheidstests die betrekking hebben op: render, props doorsturen, toetsenbordinteractie, toegankelijkheid via `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — Storybook CSF3-verhaal met minstens Default en een variant-verhaal

Controleer voordat u schrijft de repo voor:
- Bestaande componentpatronen die overeenkomen (naamgeving, bestandsindeling, importstijl)
- Ontwerp token- of themabestanden om kleur/afstand uit op te halen
- Bestaande testinstellingen (jest-config, testutilities, renderwrappers)

Verzin geen ontwerpsysteem — match wat al in de codebase aanwezig is. Gebruik anders minimale ongestijlde opmaak en merk op dat styling aan de consument wordt overgelaten.
