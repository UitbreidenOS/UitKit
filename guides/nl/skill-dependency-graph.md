# Gids voor afhankelijkheidsgrafiek van vaardigheden

Deze gids legt uit hoe u de relaties tussen vaardigheden en agenten in Claudient kunt analyseren en visualiseren met behulp van de afhankelijkheidsgrafiek-tools.

---

## Overzicht

De Claudient-repository is een netwerk van vaardigheden en agenten. Na verloop van tijd verwijzen vaardigheden naar elkaar — hetzij op naam, functionaliteit of context. Het begrijpen van deze afhankelijkheden helpt u om:

- **Clusters identificeren**: welke vaardigheden werken samen
- **Weesjes opsporen**: vaardigheden waar niemand naar verwijst (kandidaten voor archivering)
- **Breekbaarheid detecteren**: vaardigheden met te veel inkomende randen (veel afhankelijk, hoog risico bij wijzigingen)
- **Refactorering plannen**: vaardigheden samenvoegen of extraheren om koppeling te verminderen

De afhankelijkheidsgrafiek-tools scannen alle `.md`-bestanden in de `skills/`- en `agents/`-mappen, detecteren kruisverwijzingen door naamovereenkomst en produceren drie uitvoerformaten: Mermaid-diagrammen, JSON-adjacentiebestanden en samenvattingsstatistieken.

---

## Het kernscript: `scripts/dependency-graph.js`

Dit Node.js-script loopt door de `skills/`- en `agents/`-mappen en bouwt een grafiek van vaardigheid-naar-vaardigheid en agent-naar-agent verwijzingen.

### Hoe het werkt

1. **Verzamelt alle namen**: Leest elk `.md`-bestand in `skills/` en `agents/`, waarbij bestandsnamen (kebab-case, geconverteerd naar kleine letters) als knooppunt-ID's worden geëxtraheerd.
2. **Vindt verwijzingen**: Voor elk bestand scant het de inhoud (niet-hoofdlettergevoelig) naar verwijzingen naar andere vaardigheden of agenten met behulp van woordgrensovereenkomst via regex.
3. **Bouwt adjacentielijst**: Wijst elke vaardigheid/agent toe aan de vaardigheden/agenten waarnaar het verwijst.
4. **Voert uit**: Produceert Mermaid-diagram, JSON of statistieken afhankelijk van vlaggen.

### Gebruik

```bash
# Mermaid-diagram (standaard) — beperkt tot de top 50 randen
node scripts/dependency-graph.js

# JSON-adjacentielijst — alle randen
node scripts/dependency-graph.js --json

# Alleen statistieken
node scripts/dependency-graph.js --stats
```

### Uitvoerformaten

#### Mermaid-diagramuitvoer

```
graph LR
    agent_handoff["agent handoff"] --> session_handoff["session handoff"]
    skill_composition["skill composition"] --> agent_handoff["agent handoff"]
    ...
    %% ... toont top 50 van 237 randen
```

Kopieer en plak dit in een Markdown-codeblok (gebruik ` ```mermaid ... ``` `) om een interactief stroomdiagram van links naar rechts in GitHub, Obsidian of een Markdown-viewer met Mermaid-ondersteuning weer te geven.

**Opmerking**: De Mermaid-uitvoer is beperkt tot 50 randen om overweldigende diagrammen te voorkomen. Gebruik `--json` voor de volledige grafiek.

#### JSON-uitvoer

```json
{
  "agent-handoff": ["session-handoff", "agent-tracing"],
  "skill-composition": ["agent-handoff"],
  "rag-architect": ["prompt-caching", "llm-eval"],
  ...
}
```

Elke sleutel is een vaardigheid/agent; de waarde is een gesorteerde array van vaardigheden/agenten waarnaar wordt verwezen. Gebruik dit voor programmatische analyse of voeding in visualisatietools.

#### Statistiekuitvoer

```
Afhankelijkheidsgrafiek Statistieken:

  Totale vaardigheden/agenten: 427
  Knooppunten met verwijzingen: 189
  Totale randen: 512
  Wees-knooppunten (geen verwijzingen): 238

  Top 10 meest verbonden:
    prompt-engineering: 24 verwijzingen
    agent-handoff: 18 verwijzingen
    claude-api: 16 verwijzingen
    llm-eval: 14 verwijzingen
    ...
```

Biedt een samenvattingsweergave: totale knooppunten, hoeveel afhankelijkheden hebben, rand-telling, wees-telling en de top 10 meest verwezen vaardigheden/agenten.

---

## Met de interactieve visualizer werken: `scripts/visualize-graph.js`

Voor interactieve verkenning gebruikt u de D3.js force-directed graph visualizer.

### Gebruik

```bash
# JSON genereren uit afhankelijkheidsgrafiek, doorgeven naar visualizer
node scripts/dependency-graph.js --json | node scripts/visualize-graph.js

# Of sla JSON eerst op, visualiseer dan
node scripts/dependency-graph.js --json > /tmp/graph.json
node scripts/visualize-graph.js < /tmp/graph.json
```

Dit genereert een zelfstandig HTML-bestand met een interactieve D3.js force-directed graph. Open het in een webbrowser om:

- **Knooppunten slepen** om het netwerk te verkennen
- **Zoomen en pannen** om te navigeren
- **Over knooppunten zweven** om verbindingen te markeren
- **Op knooppunten klikken** om ze vast te zetten/los te maken
- **Knooppuntgraad zien** (in-graad en uit-graad) in tooltips

De HTML bevat alle afhankelijkheden ingebed (geen externe aanvragen) en is geschikt voor presentaties of het delen met teamleden.

---

## Veelvoorkomende workflows

### Alle vaardigheden vinden die afhankelijk zijn van een bepaalde vaardigheid

Queryeer de JSON-uitvoer:

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value[] == "prompt-caching") | .key'
```

Dit retourneert alle vaardigheden die naar `prompt-caching` verwijzen.

### Zeer verbonden knooppunten identificeren (hub-vaardigheden)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries | map({name: .key, count: (.value | length)}) | sort_by(.count) | reverse | .[0:10]'
```

Top 10 vaardigheden op uitgaande verwijzingen.

### Wees-vaardigheden vinden (geen afhankelijkheden)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value | length == 0) | .key'
```

Dit kunnen zelfstandige vaardigheden, domein-specifieke vaardigheden of kandidaten voor archivering zijn als ze niet actief worden onderhouden.

### Controleren op cirkelvormige afhankelijkheden

Inspecteer handmatig de grafiek of gebruik de interactieve visualizer om cycli op te sporen. Opmerking: de huidige implementatie detecteert alleen directe verwijzingen; echte detectie van cirkelvormige afhankelijkheden (A → B → A) zou grafieken doorlopen vereisen.

---

## Resultaten interpreteren

### Hoge uitgangsgraad (veel uitgaande randen)

Een vaardigheid die naar veel anderen verwijst. Voorbeelden:
- `agent-handoff` (verwijst naar `session-handoff`, `agent-tracing`, enz.) — een vaardigheid die meerdere concepten combineert
- `skill-composition` — een gids of meta-vaardigheid die beschrijft hoe andere vaardigheden moeten worden gecombineerd

**Actie**: Controleer of verwijzingen nodig zijn. Consolideer als er duplicatie is.

### Hoge ingangsgraad (veel inkomende randen)

Een vaardigheid waarnaar veel anderen verwijzen. Voorbeelden:
- `prompt-engineering` (waarnaar door veel vaardigheden op hoger niveau wordt verwezen)
- `claude-api` (basis voor SDK-vaardigheden)

**Actie**: Behandel als stabiele kerninfrastructuur. Wijzigingen hier hebben brede gevolgen — controleer zorgvuldig.

### Geïsoleerde knooppunten (nul randen)

Een vaardigheid zonder kruisverwijzingen naar andere vaardigheden. Voorbeelden:
- Domeinspecifieke vaardigheden (bijv. `photography-studio` in `skills/small-business/`)
- Nieuw toegevoegde vaardigheden nog niet geïntegreerd
- Zelfstandige tutorials

**Actie**: Niet per se slecht. Isolatie kan domeinspecialisatie aangeven. Maar als het een hulpprogrammavaardigheid is, overweeg of het ergens anders moet worden verwezen.

---

## Afhankelijkheden bijwerken (Handmatig)

De grafiek is gebouwd op basis van **tekstverwijzingen** in bestandsinhoud. Wanneer u:

1. **Hernoemt een vaardigheidsbestand** (bijv. `foo.md` → `bar.md`): Alle bestaande verwijzingen naar "foo" breken automatisch. Werk alle bestanden bij die `foo` noemen om `bar` te gebruiken.
2. **Voegt een nieuwe verwijzing toe**: Vermeld de andere vaardigheid op naam in uw bestandsinhoud. De volgende grafieken zullen dit detecteren.
3. **Verwijdert een verwijzing**: Verwijder de vermelding. De volgende grafieken verwijderen de rand.

Geen expliciete afhankelijkheidenmanifest nodig — de grafiek wordt afgeleid uit de inhoud.

---

## Integratie met CI/CD

Voeg een pre-commit of CI-controle toe om de afhankelijkheidsgrafiek te valideren:

```bash
# Detecteer cirkelvormige afhankelijkheden of geïsoleerde vaardigheden
node scripts/dependency-graph.js --stats | grep "Orphan nodes"
```

Of gebruik de `/skill-audit` workflow (zie `workflows/skill-audit.md`) om een volledige afhankelijkheidsaudit uit te voeren als onderdeel van uw beoordelingsproces.

---

## Voorbeeld: vaardigheidssamenstelling analyseren

Stel dat u de structuur van de `skill-composition` gids wilt begrijpen:

```bash
node scripts/dependency-graph.js --json | jq '.["skill-composition"]'
```

Uitvoer:
```json
["agent-handoff", "agent-memory", "llm-eval", "prompt-engineering"]
```

De `skill-composition` gids verwijst naar vier kernvaardigheden. U kent nu het leerpad: lees die vier vaardigheden, ga dan terug naar `skill-composition` om te leren hoe u ze kunt combineren.

---

## Probleemoplossing

**Grafiek is leeg of heeft zeer weinig randen**: Zorg ervoor dat u vanaf de repository root (`/Users/tushar/Desktop/Claudient`) bent. Het script zoekt naar `skills/` en `agents/` relatief ten opzichte van de repository root.

**Onwaar positieven (onjuist gedetecteerde verwijzingen)**: De overeenkomst is niet-hoofdlettergevoelig en gebruikt woordgrenzen. Strings zoals "agent" komen overeen met "agent-handoff" (correct), maar zouden ook overeen kunnen komen met "agent_supervisor" als u niet voorzichtig bent. Controleer de werkelijke bestandsinhoud van de vaardigheid om te bevestigen dat de verwijzing opzettelijk is.

**Een vaardigheid ontbreekt in de grafiek**: Het script indexeert alleen `.md`-bestanden in de `skills/`- en `agents/`-mappen. Gidsen, workflows en andere mappen worden niet geïndexeerd (dit is opzettelijk — de grafiek concentreert zich op de vaardigheid/agent-kern). Als een vaardigheid ontbreekt, controleer of deze in de juiste map staat.

---

## Volgende stappen

- Voer `/skill-discovery` uit (zie `skills/ai-engineering/skill-discovery.md`) om gerelateerde vaardigheden interactief te vinden.
- Voer de `skill-audit` workflow uit (`workflows/skill-audit.md`) om dekkingsgaten en over-verbonden knooppunten te identificeren.
- Gebruik de interactieve visualizer (`scripts/visualize-graph.js`) om het netwerk in real-time te verkennen.
