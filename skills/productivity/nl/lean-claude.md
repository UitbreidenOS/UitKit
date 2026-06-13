---
name: lean-claude
description: "Activate token-efficient mode: caveman output, right model selection, MCP discipline, compaction strategy, cavecrew agents — all in one"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../lean-claude.md).

# Lean Claude Skill

## Wanneer activeren
- Bij het starten van elke sessie waarbij kosten of snelheid van belang zijn
- Bij lange sessies waarbij de context te groot wordt
- Bij het uitvoeren van meerdere parallelle agents of batchworkloads
- Bij een krap token-budget
- Voor een complexe taak in meerdere stappen die veel context zal verbruiken

## Wanneer NIET gebruiken
- Bij het schrijven van externe documentatie — beknoptheid kan de duidelijkheid schaden
- Bij beveiligingsbeslissingen, onomkeerbare acties of meerstappenreeksen waarbij het verkeerd lezen van een fragment schade veroorzaakt
- Bij het inwerken van een nieuw teamlid in een codebase

## Instructies

Plak deze activatieprompt aan het begin van elke sessie om alle lean-optimalisaties in één keer in te schakelen:

```
Activate lean mode for this session:

OUTPUT: caveman full — drop articles, use fragments, short synonyms.
Auto-revert to full prose for: security warnings, irreversible actions,
multi-step sequences where fragment ambiguity is risky.

MODEL: use Haiku 4.5 for any task where output is constrained and verifiable
(linting, formatting, simple renames, single-function edits, classification).
Stay on Sonnet 4.6 for multi-file reasoning. Only escalate to Opus for deep
architectural decisions or complex security analysis.

CONTEXT: do not read full files when a line range will do. Prefer targeted
reads over whole-file reads. Tell me before reading any file >500 lines.

AGENTS: for repetitive or isolated tasks, spawn a Haiku subagent rather than
doing the work in the main session. Each subagent gets a fresh context window.
```

---

### 1. Modelselectie — de grootste hefboom

| Taak | Model | Besparingen |
|------|-------|-------------|
| Linting, opmaak, eenvoudige hernoemingen | Haiku 4.5 | ~60% vs Sonnet |
| Eenvoudige functiebewerkingen, boilerplate-generatie | Haiku 4.5 | ~60% |
| Wijzigingen in meerdere bestanden, debugging, code-review | Sonnet 4.6 | referentie |
| Architectuurbeslissingen, beveiligingsanalyse | Opus 4.7 | — (de kosten waard) |
| Classificatie, routing, extractie op schaal | Haiku 4.5 | ~60% |

**Regel:** Standaard Sonnet 4.6 gebruiken. Overschakelen naar Haiku wanneer de uitvoer beperkt en verifieerbaar is. Alleen naar Opus escaleren wanneer u echt diep redeneren nodig heeft.

---

### 2. Caveman-uitvoercompressie

Instrueert Claude om te reageren in beknopte, gefragmenteerde proza. Gemeten op ~65% vermindering van uitvoertokens met 100% technische nauwkeurigheid behouden.

**Compressieniveaus:**

| Niveau | Regel | Voorbeeld |
|--------|-------|-----------|
| `lite` | Vultekst weglaten, volledige zinnen bewaren | "The function handles edge cases." |
| `full` (standaard) | Lidwoorden weglaten, fragmenten toegestaan | "func handles edge cases" |
| `ultra` | Afkorten, voegwoorden weglaten, pijlen | "fn→edge cases handled" |

**Activeren:** voeg `caveman full` toe aan uw sessieprompt (al opgenomen in de activatieprompt hierboven).

**Comprimeer uw geheugenbestanden** — bestanden die Claude elke sessie opnieuw leest worden invoertokens:
```
/caveman-compress .claude/memory/project-context.md
```
~46% besparing op invoertokens per sessie voor gecomprimeerde bestanden. Volledige implementatie: [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)

---

### 3. MCP-discipline — 30.000 tokens voordat u een woord typt

Elke ingeschakelde MCP-server laadt alle tooldefinities in de context bij het starten van de sessie. 10 MCP-servers ≈ 80 tools ≈ **30.000 tokens verbruikt voordat u een woord typt**.

**Controleer uw actieve MCP's:**
```bash
# Check what's enabled
cat ~/.claude/settings.json | grep -A2 mcpServers
cat .claude/settings.json | grep -A2 mcpServers 2>/dev/null
```

**Schakel elke server uit die u in deze sessie niet gaat gebruiken.** 5 ongebruikte MCP-servers uitschakelen bespaart ~15.000 tokens — meer dan de meeste CLAUDE.md-bestanden verbruiken.

---

### 4. Contextbeheer

**CLAUDE.md:**
- Houd het project-CLAUDE.md onder de 300 regels
- Verwijder regels die niet meer van toepassing zijn
- Nooit regels op gebruikersniveau dupliceren in het project-CLAUDE.md

**Bestandslezingen:**
- Vraag om specifieke regelbereiken: "read auth.py lines 45–90" niet "read auth.py"
- Vermijd het twee keer lezen van hetzelfde grote bestand
- Gebruik subagents voor taken die het lezen van veel bestanden vereisen die de hoofdsessie niet nodig heeft

**Compactie — vroeg activeren, niet bij 95%:**
```
/compact
```
Compacteer voor het overschakelen naar een nieuwe hoofdtaak, na een lange debugsessie, of voor het starten van werk dat het lezen van veel grote bestanden vereist. Wacht niet op automatische compactie.

---

### 5. Cavecrew — goedkope agents voor goedkope taken

Start Haiku-gebaseerde subagents voor afgebakende taken in plaats van Sonnet-context te verbruiken:

| Rol | Model | Gebruiken voor |
|-----|-------|----------------|
| Onderzoeker | Haiku 4.5 | Bestanden lokaliseren, codebase doorzoeken, alleen-lezen taken |
| Bouwer | Sonnet 4.6 | Gerichte wijzigingen in 1–3 bestanden |
| Beoordelaar | Haiku 4.5 | Een diff of bestand controleren op problemen |
| Orchestrator | Opus 4.7 | Alleen complexe meerstappencoördinatie |

**~60% tokenbesparing** vs. Sonnet gebruiken voor elke subagent. Gebruik Haiku voor alles waarbij de taak beperkt en de uitvoer verifieerbaar is.

---

### 6. Promptefficiëntie

| In plaats van | Gebruik |
|--------------|---------|
| "Fix the authentication" | "Fix JWT expiry check in auth/middleware.py:45 — not rejecting expired tokens" |
| Vijf afzonderlijke "add a test for X" | "Add tests for all five functions in utils.py" |
| "Explain this codebase" | "Explain how auth flows from login to session creation, max 3 paragraphs" |
| Lang heen-en-weer | Gerelateerde taken in één prompt bundelen |

Vage prompts → verkenning → meer toolaanroepen → meer context verbruikt.
Specifieke prompts → gerichte antwoorden → minder tokens.

---

### 7. Sessiekostenregistratie

Gebruik de `cost-tracker`-hook om tokengebruik per toolaanroep te zien:
```bash
npx claudient add hooks
# Then add hooks/lifecycle/cost-tracker.sh to .claude/settings.json
```

Geeft u een doorlopend logboek van invoer-/uitvoertokens + geschatte kosten per sessie. Gebruik het om te identificeren welke taken het meest verbruiken — optimaliseer die dan eerst.

---

## Snelle referentiekaart

| Situatie | Actie |
|----------|-------|
| Start van elke sessie | Plak de activatieprompt hierboven |
| Eenvoudige bewerking, lint, opmaak | Overschakelen naar Haiku 4.5 |
| Geheugenbestanden zijn groot | caveman-compress erop uitvoeren |
| Context wordt traag | `/compact` nu, niet wachten |
| Ongebruikte MCP's ingeschakeld | Uitschakelen in settings.json |
| Herhalende taak over bestanden | Haiku-subagent, niet de hoofdsessie |
| Vage aanvraag, lang antwoord | Herschrijven als specifieke, afgebakende prompt |
| Architectuur-/beveiligingsbeslissing | Escaleren naar Opus — de kosten waard |

---
