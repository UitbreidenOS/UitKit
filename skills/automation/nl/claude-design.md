# Claude Design Integratie

## Wanneer activeren

- Gebruiker heeft een handoff-bundel uit Claude Design geëxporteerd en wil het implementeren als code
- Gebruiker wil een design→code-workflow instellen met Claude Design-output
- Gebruiker vraagt hoe je een Claude Design export in React, HTML of framework componenten omzet
- Gebruiker wil design tokens (kleuren, spatiëring, typografie) uit een Claude Design-bundel extraheren
- Gebruiker kaart Claude Design component annotaties toe aan een UI-bibliotheek (shadcn/ui, MUI, Tailwind, Radix)

## Wanneer NIET gebruiken

- UI from scratch bouwen zonder design-input — gebruik in plaats daarvan een code-first benadering
- Werken met Figma, Sketch of andere vector design tools — deze skill is Claude Design-specifiek
- Zuivere refactoring of logica werk zonder visueel design component
- Gebruiker heeft een screenshot of afbeelding maar geen Claude Design bundel — hanteren als standaard visuele prompt

## Instructies

### Handoff-bundel ontvangen

Vraag de gebruiker het bundel-inhoud voor implementatiestart te bevestigen :

```bash
unzip design-handoffs/checkout.bundle -d design-handoffs/checkout/
ls design-handoffs/checkout/
# Verwacht: layout.json, tokens.json, components.md, preview.png
```

Als bundel `tokens.json` bevat, laad het eerst. Design tokens definiëren het volledige visuele contract — kleuren, spatiëring, lettertypegroottes, borderradii. Codificeer nooit hard waarden die in tokenbestand verschijnen.

### Bundel-bestanden plaatsen

Standaardiseer deze locatie om padverval tussen projecten te vermijden :

```
project-root/
└── design-handoffs/
    └── <feature-name>/
        ├── layout.json
        ├── tokens.json
        ├── components.md
        └── preview.png
```

Plaats bundel-bestanden nooit in `src/` of naast toepassingscode.

### Design-tokens extraheren en toepassen

Converteer `tokens.json` naar het token-formaat van het project voordat u componenten schrijft :

```typescript
// tokens.json (Claude Design output)
{
  "color": {
    "primary": "#1A56DB",
    "surface": "#F9FAFB",
    "text-primary": "#111928"
  },
  "spacing": {
    "4": "1rem",
    "6": "1.5rem"
  },
  "radius": {
    "md": "0.5rem"
  }
}
```

Kaart-voorbeelden :

| Claude Design Token | Tailwind klasse | CSS-variabele | shadcn/ui token |
|--------------------|---------------|--------------|-----------------|
| `color.primary` | `bg-blue-600` | `--color-primary` | `--primary` |
| `spacing.4` | `p-4` | `--spacing-4` | directe waarde |
| `radius.md` | `rounded-md` | `--radius-md` | `--radius` |

Als project Tailwind gebruikt, breid `tailwind.config.js` uit met geëxtraheerde tokens in plaats van inline toepassing.

### Component-aantekeningen lezen

Open `components.md` voordat u component-code schrijft. Het geeft een opsomming van :
- Component-namen en hun design-system equivalenten
- Variant-namen (bijv. `Button/primary`, `Card/elevated`)
- State-aantekeningen (hover, focus, disabled, loading)
- Responsief gedrag-notities (stapel op mobiel, zij-aan-zij op desktop)

Prompt-patroon voor component-implementatie :

```
"Implementeer de [ComponentName] beschreven in design-handoffs/checkout/components.md.
Gebruik shadcn/ui als basis. Match de token-waarden in tokens.json exact.
De layout-specificatie is in layout.json — gebruik het alleen voor spatiëring en positionering,
niet als pixel-perfect constraint."
```

### Responsive breakpoints hanteren

Claude Design bundels bevatten breakpoint-aantekeningen in `layout.json`. Wijs ze toe :

```json
// layout.json breakpoint sectie
"breakpoints": {
  "mobile": "< 768px",
  "tablet": "768px – 1024px",
  "desktop": "> 1024px"
}
```

In Tailwind : `sm:` wijst toe aan tablet, `lg:` wijst toe aan desktop. Verifieer dit tegen het `tailwind.config.js` van het project — aangepaste breakpoints kunnen verschillen.

### Exact match versus als inspiratie gebruiken

Gebruik expliciete prompt-taal om het implementatiecontract in te stellen :

| Voornemen | Prompt-formulering |
|--------|----------------|
| Exacte overeenkomst | "Implementeer dit ontwerp zo dicht bij pixel-perfect als de component-bibliotheek toestaat. Vlag elke afwijking." |
| Geïnspireerd door | "Gebruik dit ontwerp als referentie voor lay-out en kleurrichting. Pas naar wens aan voor onze component-bibliotheek conventies." |
| Token-alleen | "Negeer de lay-out; pas alleen design-tokens uit tokens.json toe op onze bestaande componenten." |

Default naar "geïnspireerd door" tenzij de gebruiker anders aangeeft — exacte overeenkomsten zijn zelden bereikbaar tussen design tools en UI-bibliotheken en produceren vaak broos CSS.

### Implementatie tegen preview valideren

Na component-generatie, vraag Claude om te vergelijken tegen `preview.png`:

```
"Vergelijk de gegenereerde component tegen design-handoffs/checkout/preview.png.
Lijst alle visuele verschillen op — layout, kleur, spatiëring of typografie — en pas ze aan."
```

## Voorbeeld

```
Gebruiker : "Ik heb een checkout-pagina uit Claude Design geëxporteerd. De bundel is in
design-handoffs/checkout-v2.bundle. Genereer de React-component met
shadcn/ui om deze aan te passen."

Claude Code-workflow :
1. Bundel unzippen naar design-handoffs/checkout-v2/
2. tokens.json lezen → breid tailwind.config.js uit met geëxtraheerde tokens
3. components.md lezen → identificeer : CheckoutForm, OrderSummary, PaymentInput componenten
4. layout.json lezen → noteer twee-kolom layout instort naar enkele kolom op mobiel
5. Genereer CheckoutPage.tsx met Card, Input, Button van shadcn/ui
6. Pas token-klassen toe (bg-primary, text-primary, rounded-md) van Tailwind uitbreiding
7. Verifieer tegen preview.png, herstel spatiëring afwijking in OrderSummary padding
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
