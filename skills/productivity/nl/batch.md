---
name: batch
description: "Parallel agent orchestration: decompose large tasks into independent units, spawn background agents in worktrees, each opens a PR"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../batch.md).

# Vaardigheid: Batch (Batchverwerking)

## Wanneer activeren
- Dezelfde wijziging toepassen op 10+ bestanden (hernoemen, refactoring, migratie)
- Een grote codebase-audit uitvoeren (beveiligingsscan, dependency-check, testdekking)
- Boilerplate genereren voor veel modules in parallel
- Elke taak waarbij het werk kan worden verdeeld in onafhankelijke, niet-overlappende eenheden

## Wanneer NIET gebruiken
- Taken met sequentiële afhankelijkheden (stap B vereist de uitvoer van stap A)
- Wijzigingen in een enkel bestand of een klein aantal gerelateerde bestanden
- Taken die gedeelde context vereisen over alle eenheden (gebruik in plaats daarvan een enkele agent)
- Wanneer u elke wijziging moet beoordelen en goedkeuren voordat de volgende begint

## Instructies

### Het batch-patroon

Standaard Claude Code werkt sequentieel: één taak → één agent → één sessie. De batchmodus verdeelt een grote taak in N onafhankelijke eenheden en verwerkt ze parallel — elke eenheid draait als een aparte achtergrondagent in een geïsoleerde git worktree, voert zijn wijzigingen door en opent een PR.

```
Grote taak
    │
    ├── Eenheid 1 → worktree-1 → branch-1 → PR #1
    ├── Eenheid 2 → worktree-2 → branch-2 → PR #2
    ├── Eenheid 3 → worktree-3 → branch-3 → PR #3
    └── Eenheid N → worktree-N → branch-N → PR #N
```

### Activatieprompt

```
/batch

Task: [describe the full task]
Files/scope: [list files or glob patterns, or describe the scope]
```

Claude zal:
1. **Onderzoeksfase** — de codebase lezen om patronen en omvang te begrijpen
2. **Decompositie** — de taak opsplitsen in 5–30 onafhankelijke eenheden
3. **Planreview** — de indeling presenteren en wachten op uw goedkeuring
4. **Uitvoering** — één achtergrondagent per eenheid starten in een geïsoleerde worktree
5. **PRs** — elke agent legt zijn wijzigingen vast en opent een PR tegen main

### Decompositieregels die Claude volgt
- Elke eenheid moet **onafhankelijk** zijn — geen gedeelde toestand, geen afhankelijkheden tussen eenheden
- Elke eenheid moet **voltooibaar zijn in één agentsessie** (~15–30 min werk)
- Elke eenheid moet een **duidelijk succescriterium** hebben (tests slagen, lint slaagt)
- Eenheden zijn zo gedimensioneerd dat ze **reviewbaar zijn in één PR** (voorkeur voor kleine PRs)

### Goede batchtaken

```bash
# Een functie hernoemen die door de gehele codebase wordt gebruikt
/batch
Task: Rename `getUserById` to `findUserById` everywhere it's used.
Scope: src/**/*.ts, tests/**/*.ts

# Type-annotaties toevoegen aan alle Python-modules
/batch
Task: Add full type annotations (PEP 484) to all functions in the services layer.
Scope: src/services/*.py

# API-aanroepen migreren naar nieuwe SDK
/batch
Task: Migrate all uses of the old `stripe.charges.create()` to `stripe.paymentIntents.create()`.
Scope: src/billing/**

# Beveiligingsaudit
/batch
Task: Audit every endpoint handler for missing authentication middleware.
Scope: routes/**/*.ts
Report findings per file — do not make changes.
```

### Voortgang bewaken

Terwijl agents op de achtergrond draaien, bewaken met:
```bash
# worktree-status controleren
git worktree list

# Open PRs controleren
gh pr list --label batch

# Zien welke agents nog lopen
claude agents
```

### Resultaten samenvoegen

Zodra PRs open zijn:
1. Elke PR onafhankelijk beoordelen — ze zijn klein door ontwerp
2. In willekeurige volgorde samenvoegen (ze zijn onafhankelijk)
3. Worktrees opruimen nadat alle PRs zijn samengevoegd:
```bash
git worktree prune
```

### Wanneer een eenheid mislukt

Als de PR van een agent voor tests zakt:
- De andere agents gaan door — fouten cascaderen niet
- De mislukte PR beoordelen, handmatig corrigeren of die eenheid opnieuw uitvoeren
- `git worktree remove worktree-N` gebruiken om op te ruimen en opnieuw te starten

## Voorbeeld

**Taak:** JSDoc-commentaar toevoegen aan alle geëxporteerde functies in een TypeScript-bibliotheek van 40 bestanden.

**Claudes decompositie:**
```
Unit 1: src/auth/*.ts (6 files, ~15 functions)
Unit 2: src/billing/*.ts (5 files, ~12 functions)
Unit 3: src/api/users/*.ts (4 files, ~18 functions)
...
Unit 8: src/utils/*.ts (3 files, ~8 functions)
```

**Na goedkeuring:** 8 achtergrondagents starten parallel. Elk opent een PR met de titel `docs(jsdoc): add JSDoc to [module name]`. Totale tijd: ~20 minuten in plaats van ~2,5 uur sequentieel.

---
