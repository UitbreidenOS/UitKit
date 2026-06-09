---
description: Genereer Storybook CSF3 stories voor een component met alle betekenisvolle varianten en toestanden
argument-hint: "[ComponentFile.tsx]"
---
Genereer Storybook stories voor: $ARGUMENTS

Lees het componentbestand voordat je iets schrijft. Extraheer de props interface, varianten en staat uit de bron.

**Stap 1 — Analyseer de component**
Identificeer:
- Alle props en hun types (boolean vlaggen, union string literals, optioneel vs verplicht)
- Gecontroleerd vs ongecontroleerd gedrag (accepteert het `value`/`onChange`?)
- Laad-, fout-, lege en uitgeschakelde toestanden als deze bestaan
- Eventuele samengestelde sub-componenten die samen moeten worden getoond

**Stap 2 — Bepaal story dekking**
Genereer stories voor:
1. `Default` — minimale vereiste props, geen optionele extras
2. Één story per betekenisvolle boolean prop die zichtbare output verandert (bijv. `isDisabled`, `isLoading`, `isError`)
3. Één story per string union variant (bijv. `variant: "primary" | "secondary" | "danger"`)
4. `AllVariants` — één story die alle varianten naast elkaar rendert met een render functie en flex/grid wrapper, nuttig voor visuele regressie
5. Gecontroleerde toestand story als de component `value`/`onChange` accepteert — gebruik `useState` in de `render` functie
6. Edge cases: lege tekenreeks, zeer lange tekst overflow, nultelling, null/undefined optionele gegevens — alleen als de component dit waarschijnlijk zal tegenkomen

Genereer geen stories voor interne implementatiedetails of props die alleen de ergonomie van ontwikkelaars beïnvloeden.

**Stap 3 — Schrijf het story bestand**
Formatregels:
- Gebruik CSF3 (`export default { ... }` meta object + benoemde story exports)
- `satisfies Meta<typeof Component>` voor het meta type
- `satisfies StoryObj<typeof Component>` voor elke story
- `args` op het meta niveau voor gedeelde standaardwaarden; override per story alleen wat verandert
- Gebruik `argTypes` om union props te documenteren met `control: { type: 'select' }`
- Importeer de component met hetzelfde importpad dat elders in het project wordt gebruikt (controleer bestaande imports)
- Decorators: voeg alleen een `padding` decorator toe als de component dit visueel nodig heeft — wrap niet onnodig in providers tenzij de component expliciet context nodig heeft

**Stap 4 — Interactie tests (als @storybook/test beschikbaar is)**
Voor de `Default` story voeg je een `play` functie toe die:
- Verifieert dat de component zonder fout rendert
- Simuleert de primaire gebruikersinteractie (klik, type, selecteer)
- Controleert het verwachte DOM resultaat met `expect()`

Uitvoerbestand: plaats het story bestand naast de component (`ComponentName.stories.tsx`). Maak geen aparte `__stories__` directory tenzij er al een bestaat.
