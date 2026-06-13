# MCP: Task Master

AI-aangestuurde taakbeheer met contextisisolatie — breek grote features in getraceerde subtaken, onderhoud voortgang over sessies en coördineer multi-agent-werk vanuit een gestructureerde taakgraf.

## Waarom je dit nodig hebt

Lange features bestrijken meerdere sessies en omvatten vaak parallelle werkstromen. Zonder persistent taaktracking, begint Claude elke sessie zonder te weten wat klaar is, wat volgt of wat geblokkeerd is. Task Master lost dit op:
- Een PRD of functieomschrijving wordt in één prompt een gestructureerde, afhankelijk-geordende taaklijst
- Voortgang personeelt in je repository — elke sessie pikt exact op waar de vorige stopte
- Afhankelijke ordering betekent `next_task` retourneert altijd het juiste ding om aan te werken, niet een gok
- Complexe taken kunnen in subtaken worden uitgebreid en aan parallelle agents worden overgedragen, elk met geïsoleerde context
- Complexiteitsanalyse brengt risicovolle taken aan het licht voordat ze planningproblemen worden

## Installatie

```bash
npm install -g task-master-ai
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your-anthropic-api-key-here",
        "PERPLEXITY_API_KEY": "your-perplexity-api-key-here"
      }
    }
  }
}
```

`ANTHROPIC_API_KEY` is vereist — Task Master roept Claude intern aan om PRD's te parseren en taken te analyseren. `PERPLEXITY_API_KEY` is optioneel; het schakelt onderzoeksverhoogde taakopsplitsingen in die huidige best practices inzamelen.

## Sleuteltools / Wat het doet

- `initialize_project` — zet Task Master in in het huidige project en maak de `.taskmaster/`-directory
- `parse_prd` — lees een PRD of functieomschrijving en genereer automatisch een gestructureerde taaklijst met afhankelijkheden en prioriteiten
- `get_tasks` — lijst alle taken met status, prioriteit en afhankelijkheidssamenvatting
- `get_task` — haal volledige details op van een enkele taak inclusief beschrijving, subtaken en notities
- `create_task` — maak handmatig een taak aan met titel, beschrijving, prioriteit en afhankelijkheden
- `update_task` — werk taaktitel, -beschrijving, -prioriteit of -afhankelijkheden bij
- `set_task_status` — markeer een taak als `pending`, `in-progress`, `done` of `blocked`
- `next_task` — retourneer de hoogsteprioriteitongeblokkeerde taak klaar om aan te werken, respecteer afhankelijkheidsorder
- `expand_task` — breek een taak in subtaken voor parallelle executie of fijnere tracking
- `add_subtask` — voeg handmatig een subtaak aan een bestaande taak toe
- `analyze_project_complexity` — score alle taken op complexiteit en markeer risicovolle items met redenering
- `generate_task_files` — schrijf afzonderlijke markdown-bestanden per taak naar `.taskmaster/tasks/` voor agent-context

## Gebruiksvoorbeelden

```
Initialiseer Task Master voor dit project, parseer dan de PRD op docs/prd.md
en genereer de volledige taaklijst. Toon me de afhankelijkheidsgraf.
```

```
Wat is de volgende taak waaraan ik moet werken? Respecteer afhankelijkheidsorder
en toon me de taakbeschrijving en alle subtaken.
```

```
Ik heb taak 5 voltooid. Markeer het klaar, toon me dan welke taken
net zijn ontgrendeld en welk een heeft de hoogste prioriteit.
```

```
Breek taak 8 uit in subtaken gedetailleerd genoeg voor parallelle agent-executie.
Elke subtaak moet onafhankelijk uitvoerbaar zijn in minder dan 2 uur.
```

```
Analyseer de complexiteit van alle resterende taken. Markeer alles boven
een complexiteitsscore van 7, leg uit waarom het complex is en suggereer
hoe je het kunt verminderen voordat we beginnen.
```

## Verificatie

**Vereist:** `ANTHROPIC_API_KEY` — verkrijg uit console.anthropic.com. Task Master gebruikt Claude om PRD's te parseren, complexiteit te analyseren en taken uit te breiden. De sleutel wordt intern door de MCP-server aangeroepen, niet door Claude Code's sessie rechtstreeks.

**Optioneel:** `PERPLEXITY_API_KEY` — verkrijg uit perplexity.ai/api. Stelt Task Master in staat taakopsplitsingen aan te vullen met huidige bibliotheekversies, bekende migratieproblemen en relevante community-patronen. Handig voor taken met onbekende technology stacks.

## Tips

**Commit `.taskmaster/` naar git:** Taskgegevens bevinden zich in `.taskmaster/tasks.json`. Committen betekent dat je hele team dezelfde taakstaat ziet, voortgang is controleerbaar in geschiedenis en sessies hervatten met volledige context na gat.

**Gebruik altijd `next_task` in plaats van handmatig kiezen:** Task Master bouwt een afhankelijkheidsgraf wanneer het de PRD parseert. `next_task` doorkruist deze grafiek om aan het oppervlak te brengen wat werkelijk ontgrendeld en hoogste prioriteit is. Handmatig kiezen omzeilt deze logica en riskeert het starten van taken waarvan afhankelijkheden niet klaar zijn.

**`expand_task` vóór parallel agent-werk:** Bij overhandiging aan meerdere agents via worktrees, breid je eerst de relevante taak uit. Elke subtaak wordt een geïsoleerde eenheid van werk met eigen context — agents stappen niet over elkaar.

**`generate_task_files` voor agent-context:** Het schrijven van afzonderlijke taakbestanden naar `.taskmaster/tasks/` geeft elke agent een schone, gerichte context-bestand met net wat het voor één taak nodig heeft. Agents hoeven niet de volledige taaklijst te parseren.

**`analyze_project_complexity` vroeg:** Voer complexiteitsanalyse uit direct na `parse_prd`, voordat werk begint. Taken gemarkeerd als hooggecomplexeerd is waar planningsrisico leeft. Spreek onduidelijkheid aan of verdeel ze verder voordat je aan een tijdlijn toezeggen.

**Geblokkeerde taken moeten expliciet worden ontgrendeld:** Als een taak is gemarkeerd `blocked`, brengt Task Master deze niet naar oppervlakte via `next_task` tot de status wordt bijgewerkt. Wanneer een blocker is opgelost, stel je de geblokkeerde taak terug op `pending` en voeg je een notitie toe waarin je uitlegt wat is veranderd.

---
