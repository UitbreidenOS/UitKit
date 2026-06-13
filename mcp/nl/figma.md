# MCP: Figma

Lees Figma-ontwerpen rechtstreeks in Claude Code. Extraheer componentspecificaties, kleurkentekens, typografieschalen, laagstructuur en exporteer assets — genereer dan onmiddellijk code die overeenkomt met het ontwerp, zonder browservensters en terminal om te schakelen.

## Waarom je dit nodig hebt

De kloof tussen ontwerp en implementatie is waar consistentie afbreekt. Met Figma MCP:
- Claude leest de werkelijke spec in plaats van te vertrouwen op jouw beschrijving ervan
- Kleurkentekens, afstandswaarden en typografieschalen komen rechtstreeks uit de bron van waarheid
- Componenten worden gegenereerd met de juiste afmetingen, niet benaderingen
- Ontwerp-opmerkingen (openstaande vragen, redline-notities) zijn programmatisch toegankelijk
- Je kunt een live-implementatie tegen de Figma-spec in één prompt vergelijken

## Installatie

```bash
npm install -g figma-mcp
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_TOKEN": "your-figma-personal-access-token"
      }
    }
  }
}
```

## Sleuteltools

- `get_file` — haal de volledige structuur van een Figma-bestand op (alle frames, componenten en lagen)
- `get_node` — haal een specifieke frame, component of laag op via knooppunt-ID
- `get_styles` — extraheer alle kleur-, typografie- en effectstijlen die in het bestand zijn gedefinieerd
- `get_components` — lijst alle componenten in het bestand met hun eigenschappen
- `get_comments` — lees ontwerp-opmerkingen, handig voor het markeren van openstaande vragen of hangende beslissingen
- `export_node` — exporteer elk knooppunt als PNG, SVG of PDF op een opgegeven schaal
- `get_file_versions` — bekijk de versiegeschiedenis van een bestand

## Gebruiksvoorbeelden

```
Lees het ontwerp voor de uitcheckpagina (knooppunt-ID: 123:456) en genereer
de React-component met Tailwind-klassen die exact de afstand,
kleuren en typografie in de spec overeenkomen.
```

```
Extraheer alle kleurstijlen uit ons designsystem-bestand
(bestandssleutel: aBcDeFgHiJkL) en genereer een Tailwind-themaconfiguratie
met de juiste hexwaarden en tokennamen.
```

```
Haal de typografieschaal uit ons Figma-ontwerpbestand en maak
een CSS-blad met aangepaste eigenschappen met --font-size-xs tot --font-size-4xl.
```

```
Lijst alle openstaande ontwerp-opmerkingen in het bestand en maak een GitHub-issue
voor elk, getagd met het label 'design-feedback'.
```

```
Vergelijk de Button-component in het Figma-bestand met onze huidige
implementatie in src/components/Button.tsx en lijst alle visuele
verschillen in afstand, kleur of fontgewicht op.
```

## Verificatie

1. Meld je aan bij Figma en open **Accountinstellingen** (klik op je avatar → Instellingen)
2. Ga naar **Beveiliging** → **Persoonlijke toegangstokens**
3. Klik op **Nieuw token genereren**, geef het een naam en kopieer de waarde
4. Een read-only-token is voldoende voor alle lees-/exportbewerkingen — geen schrijfscopes nodig tenzij je opmerkingen wilt maken

Stel het token in als `FIGMA_API_TOKEN` in het configuratieblok hierboven. Commit het niet naar versiecontrole.

## Tips

**Bestandssleutels en knooppunt-ID's zoeken:** De bestandssleutel is de tekenreeks tussen `/file/` en de volgende `/` in de Figma-URL. De knooppunt-ID is de waarde van de queryparameter `node-id` (bijv. `node-id=123-456` → gebruik `123:456` met een dubbelepunt).

**Tarieflimieten:** De Figma REST API staat 600 aanvragen per minuut toe. Voor grote designsystemen met honderden componenten, batch je queries in plaats van elke knooppunt afzonderlijk op te halen.

**Assets exporteren:** `export_node` retourneert binaire gegevens. Zeg Claude waar het bestand moet worden geschreven: `"Exporteer knooppunt 123:456 als SVG en sla het op in src/assets/icons/arrow.svg"`.

**Tools combineren:** Gebruik eerst `get_styles` om je tokenkaart op te bouwen, dan `get_node` voor afzonderlijke componenten. Dit voorkomt redundante API-aanroepen bij het genereren van een volledig designsysteem.

**Visueel diff-workflow:** Maak een screenshot van de geïmplementeerde component met Playwright MCP, haal dan de Figma-spec op met deze server. Vraag Claude om de twee naast elkaar te vergelijken en verschillen op te sommen.

---
