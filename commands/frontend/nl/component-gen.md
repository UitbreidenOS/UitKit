---
description: Genereer een getypeerde, toegankelijke React-component met props-interface en basis tests
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Genereer een production-ready React-component op basis van: $ARGUMENTS

Parse de argumenten:
- Eerste token is de PascalCase-componentnaam
- Optioneel `functional` (standaard) of `compound` variant
- Optioneel `react` (standaard) of `next` voor framework-specifieke patronen

Vereisten:
1. TypeScript met expliciete Props interface — geen `any`, geen impliciete types
2. Named export alleen — geen default exports
3. Props moeten `className?: string` bevatten voor style-uitbreiding en `children?: React.ReactNode` als de component een container is
4. Gebruik `forwardRef` als de component een native DOM-element omhult
5. Compound variant: expose sub-componenten als statische eigenschappen (bijv. `Card.Header`, `Card.Body`)
6. Geen inline styles — gebruik CSS Modules of Tailwind utility classes afhankelijk van wat al in het project is
7. ARIA-rollen en -attributen moeten correct zijn voor het componenttype (button, dialog, listbox, enz.)
8. Toetsenbordnavigatie-ondersteuning waar van toepassing (Escape sluit overlays, Enter/Space activeert buttons)

Bestandsstructuur om te genereren:
- `ComponentName.tsx` — component-implementatie
- `ComponentName.test.tsx` — RTL-eenheidstests die bestrijken: render, props-forwarding, toetsenbordinteractie, toegankelijkheid via `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — Storybook CSF3-verhaal met ten minste Default en een variant verhaal

Voordat je schrijft, scan de repository voor:
- Bestaande componentpatronen om mee overeen te stemmen (naamgeving, bestandsindeling, importstijl)
- Design token- of themabestanden om kleur/afstand uit te trekken
- Bestaande testopstelling (jest-configuratie, test utilities, render-wrappers)

Verzin geen design system — match wat al in de codebase aanwezig is. Als er geen bestaat, gebruik minimale ongestylede markup en noteer dat styling aan de consument wordt overgelaten.
