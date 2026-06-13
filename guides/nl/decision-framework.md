# Commando vs. agent vs. vaardigheid — wanneer elk te gebruiken

Claude Code heeft drie primitieven om zijn gedrag uit te breiden: vaardigheden, agenten en schuine opmerking commando's. Ze overlappen in oppervlak, daarom is dit de meest voorkomende bron van verwarring bij het bouwen van een Claude Code-kennissysteem. Deze gids lost de ambiguïteit op met een nauwkeurig beslissingsraamwerk.

---

## De drie primitieven

### Vaardigheid (auto-invoked)

- Leeft in `.claude/skills/` als een `.md`-bestand met YAML frontmatter
- Claude laadt het automatisch in wanneer de huidge taak semantisch overeenkomt met de vaardigheidsbeschrijving — geen gebruikersinvoer vereist
- Voert inline uit in het huidge gesprek — geen afzonderlijk contextvenster wordt aangemaakt
- De lichtste primitief: deelt volledige gespreksgeschiedenis, onmiddellijke context en alle geopende bestanden
- Beste voor: domeinexpertise, herhalende patronen, codeerconventies, stijlgidsen, API-idiomen, projectspecifieke kennis
- Vermijd voor: taken die isolatie nodig hebben, lange multi-staps processen, alles dat bewust moet worden geactiveerd

Een vaardigheid is in wezen persistente expertise die in Claudes redenering wordt geïnjecteerd op het moment dat deze nodig is. Wanneer Claude ziet dat u aan een FastAPI-route werkt, wordt de `fastapi-crud`-vaardigheid automatisch geladen en vormt de uitvoer. Geen invocation vereist.

### Agent (gegenereerde subagent)

- Leeft in `agents/` als een `.md`-bestand met YAML frontmatter
- Expliciet gegenereerd door de bovenliggende Claude-sessie via `Agent(subagent_type="name", prompt="...")`
- Draait in een afzonderlijk contextvenster — volledig geïsoleerd van het bovenliggende gesprek
- Kan parallel uitvoeren — meerdere agenten voeren gelijktijdig uit terwijl de ouder wacht of doorgaat
- Heeft zijn eigen tool-beperkingen, modelkeuze en inspanningsniveau
- Beste voor: specialistenwwerk dat isolatie nodig heeft, parallelle uitvoering, taken waarbij tussengeluid de hoofdcontext niet zou moeten vervuilen, langlopende analyse
- Vermijd voor: taken die volledige gespreksgeschiedenis van de ouder nodig hebben (agenten ontvangen alleen de prompt die u doorgeeft)

Een agent is een aannemer: u geeft ze een brief en ze werken onafhankelijk. Ze kunnen uw gespreksgeschiedenis niet lezen tenzij u deze expliciet in de prompt opneemt.

### Schuine opmerking commando (expliciet invoked)

- Leeft in `.claude/commands/` als een `.md`-bestand
- Gebruiker typt `/command-name` om in te roepen — nooit auto-invoked
- Voert inline uit in het huidge gesprek, zoals een vaardigheid, maar vereist expliciete trigger
- Kan complexe multi-staps workflows coderen als gestructureerde prompts
- Beste voor: gedefinieerde workflows die gebruikers bewust activeren — `/code-review`, `/deploy`, `/db-migrate`, `/release-notes`
- Vermijd voor: mogelijkheden die automatisch zouden activeren; alles dat gebruikers vergeten zullen in te roepen

Een schuine opmerking commando is een macro: een voorgedefinieerde workflow die u bij behoefte op naam kunt aanroepen. De gebruiker heeft altijd controle.

---

## Beslissingsboom

Werk deze vragen in volgorde door. Stop bij de eerste match.

```
1. Moet het automatisch activeren zonder dat de gebruiker iets typt?
   JA → Vaardigheid

2. Heeft het isolatie van de bovenliggende context nodig, of moet het parallel
   met ander werk lopen?
   JA → Agent

3. Heeft het een ander model nodig (Haiku voor kosten, Opus voor redeneerdiepte)
   of beperkte hulpmiddeltoegang?
   JA → Agent

4. Is het een gedefinieerde workflow die de gebruiker bewust op naam activeert?
   JA → Schuine opmerking commando

5. Is het zuivere expertise of een patroon (geen uitvoering, geen isolatie nodig)?
   JA → Vaardigheid (inline)

NOG STEEDS ONZEKER → standaard naar Vaardigheid, escaleer naar Schuine opmerking commando, escaleer naar Agent
                     alleen wanneer isolatie echt nodig is
```

---

## Auto-invocation-regels

### Hoe vaardigheden worden geactiveerd

Claude leest vaardigheidsfrontmatter bij sessiestart. Het `description` veld (tot ~1.536 tekens) is altijd in geheugen. Wanneer een taak semantisch overeenkomt, laadt Claude de volledige vaardigheidstekst.

```yaml
---
description: "Use for FastAPI route handlers, dependency injection, and Pydantic model definitions. Activates when writing Python web API code."
paths:
  - "**/*.py"
when_to_use: "Python web API development with FastAPI"
---
```

- `description` — primair matching-signaal; houd het specifiek, niet generiek
- `paths` — bestandsglob-filter; vaardigheid activeert alleen wanneer overeenkomende bestanden in context zijn
- `when_to_use` — secundaire matching-hint voor de router

Vaardigheden met generieke beschrijvingen (`"Use this for Python"`) stemmen te breed af en worden onnodig geladen. Wees nauwkeurig.

### Hoe agenten worden aangeroepen

Agenten worden altijd expliciet gegenereerd. De bovenliggende sessie roept ze aan.

```python
# Basis-aanroeping
Agent(
  subagent_type="security-auditor",
  description="Audit the authentication module for OWASP Top 10 issues",
  prompt="Review /src/auth/ for injection risks, session fixation, and token exposure. Report findings."
)

# Met modeloverride
Agent(
  subagent_type="doc-formatter",
  model="haiku",
  prompt="Reformat all docstrings in /src/utils/ to Google style."
)
```

Geef `background: true` in frontmatter (of stel het in op aanroeptijd) door om de agent zonder blokkering van de bovenliggende sessie uit te voeren.

---

## Context-isolatieregels

| Primitief | Ziet bovenliggend gesprek? | Eigen contextvenster? | Kan parallel uitvoeren? |
|-----------|--------------------------|------------------------|---------------------|
| Vaardigheid | Ja — volledige geschiedenis | Nee | Nee |
| Agent | Nee — alleen prompt | Ja | Ja |
| Schuine opmerking commando | Ja — volledige geschiedenis | Nee | Nee |

De isolatiekolom is de kritische differentiator. Als uw taak toegang tot volledige gespreksgeschiedenis nodig heeft, gebruikt u een vaardigheid of schuine opmerking commando. Als het niet door bovenliggende context zou moeten worden vervuild (of naast andere taken moet lopen), gebruikt u een agent.

---

## Lichtgewicht resolutievolgorde

Wanneer u onzeker bent, gebruikt u de lichtste optie:

**Vaardigheid → Schuine opmerking commando → Agent**

Begin met een vaardigheid. Als de mogelijkheid niet betrouwbaar auto-invoked kan worden (te contextafhankelijk, te expliciet), gaat u naar een schuine opmerking commando. Escaleer alleen naar een agent wanneer isolatie of parallelisme echt telt. Agenten kosten een extra contextvenster en vereisen expliciet doorgeven van context — ze zijn duurder in zowel tokens als complexiteit.

---

## Praktische voorbeelden

### Voorbeeld 1: REST API-naamconventies

> "Ik wil dat Claude altijd onze interne REST-eindpuntnaamconventies volgt bij het schrijven van routes."

**Antwoord: Vaardigheid**

Dit is zuivere expertise. Het zou automatisch moeten activeren wanneer Claude route handlers schrijft. Geen gebruikerstrigger nodig, geen isolatie nodig. Maak `.claude/skills/rest-conventions.md` met uw naamregels en bestandsglob `paths: ["**/*.py", "**/*.ts"]`.

### Voorbeeld 2: Parallelle veiligheidsaudit tijdens ontwikkeling

> "Ik wil een volledige veiligheidsaudit van de auth-module uitvoeren terwijl ik aan de feature werk."

**Antwoord: Agent**

De audit is een specialist, langlopende taak. Het zou geen lawaai in het hoofdgesprek moeten genereren. Het kan parallel lopen terwijl de ontwikkelaar doorgaat. Stel `background: true` en `model: opus` in agentfrontmatter in. Geef audit-bereik in de prompt door.

### Voorbeeld 3: Implementatiewerkstroom

> "Ik wil een commando dat tests uitvoert, de Docker-afbeelding bouwt en naar het register pusht."

**Antwoord: Schuine opmerking commando**

Dit is een voorbedachte, bewust geactiveerde workflow. De ontwikkelaar wil `/deploy` typen als hij klaar is — geen auto-trigger. Maak `.claude/commands/deploy.md` met de volledige multi-staps workflow als gestructureerde instructies gecodeerd.

---

## Token-kostenvergleking

Het begrijpen van opstartkost helpt bepalen of een vaardigheid agressief of spaarzaam moet worden gebruikt.

| Primitief | Opstartkost | Matchingkosten | Opmerkingen |
|-----------|-------------|---------------|-------|
| Vaardigheidsbeschrijving | ~50–100 tokens | Altijd in context | Houd beschrijvingen kort en specifiek |
| Volledige vaardigheidstekst | ~200–2.000 tokens | Geladen op semantisch match | Laadt alleen wanneer nodig |
| Agent | 0 bij startup | Betaald bij generatie | Afzonderlijk contextvenster |
| Schuine opmerking commando | 0 bij startup | Betaald bij invocation | Geladen bij `/command` |

Vaardigheden kosten kleine maar constante opstarkosten voor elke sessie. Als u 40 vaardigheden met 100-tokenomschrijvingen hebt, is dat 4.000 token overhead vóór het eerste gebruikersbericht. Controleer uw vaardigheidsbeschrijvingen en houd ze strak. Agenten en schuine opmerking commando's kosten niets tot expliciete gebruik.

---
