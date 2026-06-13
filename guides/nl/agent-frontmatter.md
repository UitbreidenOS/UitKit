# Referentie voor agent-frontmatter

Elk Claude Code agent-bestand begint met een YAML frontmatter-blok. Dit blok bepaalt identiteit, routering, modelkeuze, uitvoeringsgedrag, gereedschapstoegang en weergave. Deze referentie behandelt alle ondersteunde velden met typen, standaardwaarden en gebruiksleidraad.

---

## Verplichte velden

### `name`

**Type:** `string` (kebab-case)
**Verplicht:** Ja

De identificator die wordt gebruikt om dit agent programmatisch in te stellen. Moet uniek zijn in alle agent-bestanden van het project.

```yaml
name: security-auditor
```

Gebruikt in:
```python
Agent(subagent_type="security-auditor", prompt="...")
```

Houd namen kort, beschrijvend en met koppeltekens. Vermijd versienummers of omgevingssuffixen in de naam — gebruik in plaats daarvan aparte bestanden.

---

### `description`

**Type:** `string`
**Verplicht:** Ja
**Aanbevolen maximale lengte:** 200 tekens

Eenregelbeschrijving van het domein en doel van de agent. Wordt gebruikt door Claudes router voor automatische delegatiebeslissingen — dit is het primaire signaal dat bepaalt wanneer deze agent wordt geselecteerd.

```yaml
description: "Controleert code op OWASP Top 10-kwetsbaarheden, geheimpreventie en injectierisico's. Activeren voor veiligheidscontroles voordat u een PR indient."
```

Schrijf dit alsof u Claude vertelt wanneer hier moet worden gedelegeerd. Specifieke triggervoorwaarden overtreffen generieke capaciteitsbeschrijvingen. Slecht: `"Een veiligheidsagent."` Goed: `"Activeer bij het beoordelen van verificatiecode, API-eindpunten of voordat u een PR samenvoegt die geheimen, sessies of verwerking van gebruikersinvoer raakt."`

---

## Modelvelden

### `model`

**Type:** `string` — een van `"haiku"`, `"sonnet"`, `"opus"`
**Standaard:** Neemt het actieve model van de bovenliggende sessie over

Negeer het model dat wordt gebruikt voor dit agentscontextvenster. Heeft geen invloed op de bovenliggende sessie.

```yaml
model: opus
```

| Waarde | Wanneer te gebruiken |
|-------|-------------|
| `"haiku"` | Mechanische taken: herformattering, hernoemen, eenvoudige classificatie, boilerplate-generatie. ~60% kostenreductie vs. Sonnet. |
| `"sonnet"` | Standaard ontwikkelingswerk. Goed evenwicht tussen snelheid en redenering. |
| `"opus"` | Complexe redenering: veiligheidsanalyse, architectuurbesluiten, onduidelijke vereisten, multi-bestands refactoring met subtiele beperkingen. |

Gebruik nooit `"haiku"` voor taken die oordeel vereisen — veiligheidsanalyse, architectuurbesluiten, of alles waarbij een fout gevolgen downstream heeft.

---

## Uitvoeringsvelden

### `background`

**Type:** `boolean`
**Standaard:** `false`

Wanneer `true`, wordt de agent altijd uitgevoerd als een niet-blokkerende achtergrondtaak. De bovenliggende sessie gaat onmiddellijk verder zonder op voltooiing van de agent te wachten.

```yaml
background: true
```

Gebruik wanneer:
- De uitvoer van de agent is niet nodig voordat de volgende stap van de ouder wordt uitgevoerd
- U meerdere gespecialiseerde agents paralleliseert
- De taak observeerbaarheid/logging is (audit logs, metrics schrijft) in plaats van besluitvorming

Vermijd wanneer:
- De ouder de bevindingen van de agent nodig heeft om de volgende stap te bepalen
- De agent bestanden schrijft die de ouder onmiddellijk zal lezen

---

### `isolation`

**Type:** `string` — `"worktree"` of afwezig
**Standaard:** Geen (agent voert uit in de huidige werkmap)

Wanneer ingesteld op `"worktree"`, maakt Claude Code een tijdelijke git worktree voor de agent. De agent werkt op een geïsoleerde kopie van het repository. Als de agent geen wijzigingen aanbrengt, wordt de worktree na voltooiing automatisch opgeruimd.

```yaml
isolation: worktree
```

Gebruik wanneer:
- De agent exploratieve bewerkingen uitvoert die de werktree niet zouden mogen beïnvloeden tenzij expliciet samengevoegd
- Meerdere agents parallel uitvoeren en niet in conflict mogen gaan met dezelfde bestanden
- U een schoon terugrolpad wilt als de wijzigingen van de agent niet bevredigend zijn

**Waarschuwing:** Vereist een git-repository. In niet-git-mappen faalt het aanmaken van de worktree stilzwijgend en voert de agent uit tegen de werkende kopie.

---

## Promptvelden

### `initialPrompt`

**Type:** `string`
**Standaard:** Geen

Een string die automatisch wordt verzonden als de eerste gebruikersbeurt wanneer de agent als standalone sessie wordt uitgevoerd (niet als subagent). Heeft geen effect wanneer de agent via `Agent(subagent_type="...")` wordt gegenereerd.

```yaml
initialPrompt: "U start een veiligheidscontrolesessie. Begin door alle bestanden in /src/auth/ op te sommen en identificeer invoerpunten die externe invoer accepteren."
```

Gebruik voor agents die als projectingangspunten dienen of interactieve assistenten die gebruikers direct starten in plaats van via een bovenliggende orchestrator.

---

## Weergavevelden

### `color`

**Type:** `string` — CSS-kleurnaam of hexadecimale waarde
**Standaard:** Geen (gebruikt terminal standaard)

Stelt de weergavekleur voor de uitvoer van deze agent in de CLI in. Puur cosmetisch — heeft geen effect op gedrag.

```yaml
color: "#ff4444"
```

Handig bij het uitvoeren van meerdere agents parallel en u moet hun uitvoerstromen visueel onderscheiden. Accepteert standaard CSS-kleurnamen (`"red"`, `"dodgerblue"`) of hex-strings (`"#ff4444"`).

---

## Hook-velden

### `hooks`

**Type:** `object`
**Standaard:** Geen

Definiëert hooks die exclusief voor deze agent gelden. Dezelfde structuur als session-level hooks in `settings.json`. Hier gedefinieerde hooks worden alleen geactiveerd wanneer deze agent actief is — ze beïnvloeden niet de bovenliggende sessie of andere agents.

```yaml
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-changes.sh"
```

Alle standaard hook-events worden ondersteund: `SessionStart`, `PreToolUse`, `PostToolUse`, `PreCompact`, `PostCompact`, `Stop`, `Notification`.

Gebruik voor:
- Loggen van agent-voltooiing in auditbestanden
- Valideren van bestanden die de agent schrijft voordat de bovenliggende sessie ze leest
- Berichten verzenden wanneer een langlopende agent klaar is

---

## Hulpmiddelbeperkingsvelden

### `tools`

**Type:** `array` van `string`
**Standaard:** Alle beschikbare hulpmiddelen (erft van sessietoelatingen)

Beperkt de agent tot alleen de vermelde hulpmiddelen. Elk hulpmiddeloproep die niet in deze lijst staat, wordt geblokkeerd.

```yaml
tools:
  - Read
  - Grep
  - Glob
  - Bash
```

Hulpmiddelbeperking is een veiligheids- en focusmechanisme. Een alleen-lezen onderzoeksagent mag niet Write of Edit hebben. Een opmaakagent heeft geen WebSearch nodig.

**Belangrijke waarschuwing:** Hulpmiddelbeperkingen zijn van toepassing op de eigen oproepen van deze agent. Ze voorkomen niet dat de agent een subagent die het genereert, opdracht geeft om onbeperkte hulpmiddelen te gebruiken. Als u een agent om veiligheidsredenen beperkt, beperkt u ook de sub-subagents afzonderlijk.

Gemeenschappelijke alleen-lezen set: `["Read", "Grep", "Glob"]`
Gemeenschappelijke analyseset: `["Read", "Grep", "Glob", "Bash"]`
Volledige ontwikkelingset: `["Read", "Write", "Edit", "Bash", "Grep", "Glob"]`

---

## Inspanningsvelden

### `effort`

**Type:** `string` — een van `"low"`, `"medium"`, `"high"`, `"xhigh"`
**Standaard:** Erft van de inspanningsinstelling van de bovenliggende sessie

Stelt het standaardniveau van inspanning voor dit agentscontextvenster in. Negeer de sessiestandaard voor deze agent alleen.

```yaml
effort: xhigh
```

| Waarde | Wanneer te gebruiken |
|-------|-------------|
| `"low"` | Eenvoudige formatters, classificeerders, mechanische transformaties |
| `"medium"` | Routinematige ontwikkelingstaaken, eenvoudige refactorings |
| `"high"` | Complexe feature-implementatie, multi-bestands wijzigingen |
| `"xhigh"` | Architectuurbesluiten, veiligheidsaudits, diepgaande probleemoplossing, alles waar het missen van een detail echte gevolgen heeft |

Het inspanningsniveau beïnvloedt hoeveel het model "denkt" voordat het antwoordt. Hogere inspanning = meer tokens, meer latentie, grondiger resultaat. Gebruik `"low"` voor kostenbewuste mechanische agents en `"xhigh"` wanneer nauwkeurigheid belangrijker is dan snelheid.

---

## Volledig voorbeeld

Een volledig geannoteerde agent die meerdere velden combineert:

```yaml
---
name: security-auditor
description: "Controleert code op OWASP Top 10-kwetsbaarheden, geheimpreventie en injectierisico's. Activeren voor veiligheidscontroles voordat u een PR indient."
model: opus
background: false
isolation: worktree
effort: xhigh
tools:
  - Read
  - Grep
  - Glob
  - Bash
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
color: "#ff4444"
---

# Security Auditor

## Purpose
Performs a structured security review against OWASP Top 10, secret exposure patterns,
and injection risk surfaces. Runs in an isolated worktree so exploratory file reads
do not affect the working tree.

## Instructions
...
```

---

## Veldcompatibiliteitstabel

| Veld | Subagent-gebruik | Standalone sessie | Opmerkingen |
|-------|-------------|-------------------|-------|
| `name` | Verplicht | Verplicht | Gebruikt in `Agent(subagent_type="name")` |
| `description` | Verplicht | Verplicht | Primair routeringssignaal |
| `model` | Ja | Ja | Negeer oudermodel voor deze context |
| `background` | Ja | Nee | Alleen relevant als subagent gegenereerd |
| `isolation` | Ja | Ja | Vereist git-repository |
| `initialPrompt` | Nee | Ja | Wordt alleen in standalone sessies geactiveerd |
| `color` | Ja | Ja | Puur cosmetisch |
| `hooks` | Ja | Ja | Beperkt tot deze agentsessie alleen |
| `tools` | Ja | Ja | Whitelist; blokkeert alle niet vermelde hulpmiddelen |
| `effort` | Ja | Ja | Negeer sessie-inspanning voor deze context |

---

## Voorzorgsmaatregelen

**`isolation: "worktree"` vereist git.** In niet-git-mappen faalt het aanmaken van de worktree stilzwijgend en voert de agent uit tegen de werkende kopie zonder isolatie. Verifieer dat uw project een git-repository is voordat u op dit veld voor veiligheid vertrouwt.

**`background: true` agents zijn "fire-and-forget" vanuit het perspectief van de ouder.** De ouder gaat onmiddellijk verder. Als u de uitvoer van de agent nodig hebt om een besluit te nemen, gebruik dan niet `background: true`. Gebruik het alleen voor taken waarbij het resultaat asynchroon wordt verbruikt (logs, meldingen, bijwerkingen).

**`model: "haiku"` is een kostenoptimalisatie, geen vermogensverslechtering voor eenvoudige taken.** Voor mechanisch werk — herformattering, eenvoudige hernoaming, boilerplate-generatie — werkt Haiku gelijkwaardig aan Sonnet met ongeveer 60% lagere kosten. Gebruik Haiku niet voor veiligheidsanalyse, architectuurbesluiten of taken waarbij subtiele fouten zich opstapelen. Het kostenverschil is het kwaliteitsrisico niet waard.

**Hulpmiddelbeperkingen zijn geen sandbox.** Ze blokkeren de directe hulpmiddeloproepen van de agent. Een agent die opdracht krijgt om sub-subagents in te stellen, kan onbeperkte hulpmiddeltoegang aan die sub-subagents doorgeven tenzij u deze ook beperkt. Voor echte veiligheidsgrenzen beperkt u elke laag van de agentboom afzonderlijk.

**`description` is het belangrijkste veld na `name`.** De router gebruikt het om te bepalen wanneer hier moet worden gedelegeerd. Een vage of generieke beschrijving veroorzaakt routeringsfouten — ofwel wordt de agent geactiveerd wanneer hij dat niet zou moeten, ofwel wordt hij nooit geselecteerd. Schrijf de beschrijving als een expliciete triggervoorwaarde, niet als een capaciteitssamenvatting.

---
