# Claude Design — visuele design-agent van Anthropic Labs

Claude Design is een visuele design-agent — geen traditioneel designhulpmiddel — die gepolijste visuele werken genereert uit beschrijvingen in natuurlijk taal. Het leest uw bestaande designsysteem, codebase en merkbestanden om op merk output te produceren, en verpakt het resultaat vervolgens als een handoff-bundle die Claude Code rechtstreeks kan gebruiken.

---

## Wat Claude Design is

- **Tekst-naar-design**: beschrijf wat u nodig hebt, Claude bouwt een eerste versie
- **Design system-bewust**: leest uw codebase en designbestanden om automatisch kleuren, typografie en bestaande componenten toe te passen
- **Conversationele refinement**: inline-opmerkingen, directe bewerkingen, aangepaste aanpassingsschuiven
- **Multi-format export**: interne URL's, Canva, PDF, PPTX, HTML
- **Claude Code handoff-bundle**: verpakt de design in een ontwikkelingsbundle die Claude Code kan gebruiken
- **Beschikbaarheid**: onderzoeksvoorvertoning voor Pro, Max, Team en Enterprise-abonnees (vanaf 17 april 2026)

---

## Hoe het past in een Claude Code-werkstroom

1. Begin in Claude Design — beschrijf de benodigde UI of visuele asset
2. Voeg uw designsysteemtokens toe (kleuren, typografie, componentbibliotheek)
3. Refiner conversationeel totdat de uitvoer overeenkomt met het doel
4. Exporteren → "Send to Claude Code" genereert een handoff-bundle
5. In Claude Code: refereer naar de handoff-bundle om de design als code te implementeren

De handoff-bundle bevat layoutspecificaties, geëxtraheerde designtokens, componentaantekeningen en responsieve breekpuntopmerkingen — genoeg voor Claude Code om zonder verdere designinterpretatie te implementeren.

---

## Design→Code handoff-patroon

```bash
# Exporteer uit Claude Design, vervolgens:
unzip checkout-v2.bundle -d design-handoffs/checkout-v2/

# Open Claude Code en refereer naar de bundle
claude "Implement the checkout page from design-handoffs/checkout-v2/ using shadcn/ui components"
```

Aanbevolen projectstructuur:

```
project-root/
├── design-handoffs/
│   ├── checkout-v2/
│   │   ├── layout.json          # Component tree and positioning
│   │   ├── tokens.json          # Colors, spacing, typography
│   │   ├── components.md        # Component annotations
│   │   └── preview.png          # Visual reference
│   └── landing-v1/
└── src/
```

---

## Een designsysteem toevoegen

Claude Design leest designcontext uit drie bronnen:

| Bron | Hoe toe te voegen | Wat Claude leest |
|--------|---------------|-------------------|
| Tokenbestand | Upload `tokens.json` of plak CSS-variabelen | Kleuren, afstand, radii, letterschalen |
| Componentenbibliotheek | Link naar Storybook-URL of upload componentschermafbeeldingen | Bestaande componentnamen en varianten |
| Merkbestand | Upload merkpdf of stijlgids | Logogebruik, typografiehiërarchie, toon |
| Codebase | Plak `tailwind.config.js` of themabestand | Hulpprogrammaklassemappings, breekpunten |

Hoe meer context u opgeeft, hoe minder correctie de refinementlus vereist.

---

## Gebruiksscenario's

- Productmockups en interactieve prototypes vóór sprintplanning
- Pitch decks en beleggersmaterialen zonder een designer in het team
- Marketingmaterialen: one-pagers, concepten voor landingspagina's, sociale kaarten
- UI-verkenning vóór volledige implementatie — verken 3 richtingen goedkoop
- Snelle merkconsequente visuele assets voor teams zonder een toegewijde designer
- Snelle onboardingschermen, ledige staten en design van foutstatussen

---

## Conversationele Refinement

Claude Design ondersteunt natuurlijke taalwijzigingen tijdens refinement:

```
"Move the CTA button above the fold"
"Make the heading larger and use our primary brand color"
"Try a version with less whitespace — this is for a dense data dashboard"
"Add a dark mode variant"
"Match the typography from the homepage we uploaded"
```

Elke instructie produceert een nieuwe versie; vorige versies worden bewaard in versiegeschiedenis.

---

## Exportformaten

| Formaat | Beste voor |
|--------|---------|
| Handoff bundle (`.bundle`) | Claude Code-implementatie |
| HTML | Statische mockup in browser |
| PDF | Stakeholder review, afdrukken |
| PPTX | Pitch decks, presentaties |
| Canva export | Marketing team editing |
| Interne URL | Delen in claude.ai |

---

## Beperkingen (onderzoeksvoorvertoning)

- Status onderzoeksvoorvertoning — functies en exportformaten kunnen zonder voorafgaande kennisgeving veranderen
- Geen vectoreditor — geen Figma-equivalente knoopmanipulatie of precisielayouthulpmiddelen
- Handoff-bundle is een ontwikkelingshulp, geen pixelnauwkeurige spec; Claude Code kan layout voor responsiviteit moeten aanpassen
- Vereist Claude.ai-account met Pro, Max, Team of Enterprise-abonnement
- Niet geschikt als enige waarheidsbron voor productiedesignsystemen
- Complexe designs met veel aangepaste componenten kunnen aanzienlijke promptrefinement vereisen

---
