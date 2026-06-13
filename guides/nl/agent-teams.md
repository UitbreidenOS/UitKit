# Agent Teams — Multi-Session Coördinatie

Agent teams laten je meerdere Claude Code-instanties samen als een gecoördineerd team laten werken. Eén sessie fungeert als leider — coördineert werk, wijst taken toe en synthestiseert resultaten. Teamgenoten werken onafhankelijk, elk in hun eigen contextvenster, en kunnen direct met elkaar communiceren.

In tegenstelling tot subagents (die binnen een enkele sessie draaien en alleen terugrapporten aan de aanroeper), zijn agent team teamgenoten volledig onafhankelijke Claude Code-sessies die een takenlijst delen en direct met elkaar berichten kunnen uitwisselen.

**Deze functie is experimenteel** en standaard uitgeschakeld.

---

## Wanneer je Agent Teams gebruikt

| Use case | Waarom teams werken |
|----------|---------------|
| Onderzoek en review | Meerdere teamgenoten onderzoeken tegelijk verschillende aspecten, delen bevindingen en bestrijden ze |
| Nieuwe modules/features | Elke teamgenoot is eigenaar van een apart onderdeel zonder elkaar in de weg te zitten |
| Debuggen met concurrerende hypothesen | Teamgenoten testen verschillende theorieën parallel en convergeren sneller |
| Cross-layer coördinatie | Frontend, backend en testwijzigingen elk eigendom van een ander teamgenoot |

Wanneer je Teams NIET gebruikt (gebruik een enkele sessie of subagents):

- **Sequentiële taken** waar elke stap afhankelijk is van de vorige
- **Bewerkingen in hetzelfde bestand** — teamgenoten overschrijven elkaar
- **Werk met veel inter-task-afhankelijkheden** — coördinatieoverhead domineert
- **Eenvoudige taken** waarbij de overhead van het opzetten van een team groter is dan het voordeel

---

## Agent Teams vs Subagents

| | Subagents | Agent Teams |
|---|---|---|
| Context | Eigen context; resultaten keren terug naar aanroeper | Eigen context; volledig onafhankelijk |
| Communicatie | Rapporteren alleen terug naar hoofdagent | Teamgenoten versturen direct berichten naar elkaar |
| Coördinatie | Hoofdagent beheert al het werk | Gedeelde takenlijst met zelf-coördinatie |
| Beste voor | Gerichte taken waarbij alleen het resultaat telt | Complex werk dat discussie en samenwerking vereist |
| Token-kosten | Lager (resultaten samengevat teruggezonden) | Hoger (elke teamgenoot is een aparte Claude-instantie) |

Vuistregel: gebruik subagents als werknemers alleen hoeven terug te rapporteren. Gebruik teams als werknemers bevindingen moeten delen, elkaar moeten bestrijden en zelf moeten coördineren.

---

## Agent Teams inschakelen

Voeg de experimentele flag toe aan je instellingen:

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Of zet het in je shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Vereist Claude Code v2.1.32 of later. Controleer met `claude --version`.

---

## Een team starten

Na inschakeling, vertel Claude dat hij een team moet maken in natuurlijke taal:

```
I'm designing a CLI tool for tracking TODO comments. Create an agent team:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude maakt het team, laat teamgenoten draaien, coördineert werk en synthestiseert bevindingen. Je hoeft geen configuratiebestanden te schrijven — beschrijf de teamstructuur in je prompt.

---

## Weergavemodi

Twee weergavemodi bepalen hoe teamgenoten in je terminal verschijnen.

### In-process (standaard)

Alle teamgenoten draaien in je hoofdterminal.

| Toets | Actie |
|-----|--------|
| `Shift+Down` | Cyclus door teamgenoten |
| Type | Verstuur bericht direct naar teamgenoot |
| `Enter` | Bekijk de sessie van een teamgenoot |
| `Escape` | Onderbreek de huidige beurt van teamgenoot |
| `Ctrl+T` | Toggle de gedeelde takenlijst |

Werkt in elke terminal. Geen extra setup nodig.

### Split panes

Elke teamgenoot krijgt zijn eigen terminalpane. Je kunt de output van iedereen tegelijk zien en op een pane klikken om rechtstreeks te communiceren.

Vereist **tmux** of **iTerm2**:
- tmux: installeer via je packagemanager (`brew install tmux`, `apt install tmux`)
- iTerm2: installeer de `it2` CLI en schakel Python API in in iTerm2-voorkeuren

### Configuratie

```json
{
  "teammateMode": "in-process"
}
```

Geldige waarden: `"in-process"`, `"tmux"`, `"auto"` (detecteert beschikbare terminalmultiplexer).

Override per sessie:

```bash
claude --teammate-mode in-process
```

---

## Takenlijst en toewijzing

De gedeelde takenlijst coördineert werk tussen alle teamgenoten. Taken hebben drie statussen:

| Status | Betekenis |
|-------|---------|
| **pending** | Nog niet opgeëist door enig teamgenoot |
| **in progress** | Opgeëist en actief bewerkt |
| **completed** | Klaar |

Taken kunnen afhangen van andere taken. Een pending-taak met onopgeloste afhankelijkheden kan niet worden opgeëist totdat die afhankelijkheden compleet zijn.

### Toewijzingsmodi

- **Leider wijst toe** — vertel de leider welke taak aan welke teamgenoot toe te wijzen
- **Zelf-eis** — nadat een taak klaar is, pikt een teamgenoot automatisch de volgende ongeassigneerde, ongeblokkeerde taak op

Taak-eisen gebruiken bestandsvergrendeling om race conditions te voorkomen wanneer meerdere teamgenoten tegelijk proberen op te eisen.

---

## Teamgenoten en modellen specificeren

Claude bepaalt teamgrootte op basis van de taak, of je kunt expliciet zijn:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

Teamgenoten nemen de `/model` selectie van de leider niet standaard over. Om dit te wijzigen, stel je **Default teammate model** in via `/config` en kies je **Default (leader's model)**.

---

## Plan-goedkeuringsgrenzen

Voor risicovolle taken, vereisen dat teamgenoten eerst plannen voordat ze implementeren:

```
Spawn an architect teammate to refactor the auth module.
Require plan approval before they make any changes.
```

Wanneer een teamgenoot klaar is met plannen, stuurt het een plan-goedkeuringsverzoek naar de leider. De leider beoordeelt en:

- **Goedkeuren** — teamgenoot begint implementatie
- **Afwijzen met feedback** — teamgenoot herziet plan en dient opnieuw in

Je kunt het oordeel van de leider beïnvloeden:

```
Only approve plans that include test coverage.
Reject plans that modify the database schema.
```

---

## Direct met teamgenoten praten

Elk teamgenoot is een volledige, onafhankelijke Claude Code-sessie. Je kunt elk teamgenoot op elk moment bericht sturen.

- **In-process modus:** `Shift+Down` om naar teamgenoot te gaan, typ je bericht
- **Split-pane modus:** klik op de pane van teamgenoot en typ direct

---

## Subagent-definities als teamgenoten gebruiken

Verwijs naar een bestaand subagent-type wanneer je een teamgenoot opzet:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

De teamgenoot gebruikt de `tools` allowlist en `model` van die definitie. De inhoud van de definitie wordt toegevoegd aan de systeemprompt van de teamgenoot als aanvullende instructies.

**Wat overgaat:** `tools`, `model`, systeemprompt-inhoud.

**Wat gaat NIET over:** `skills` en `mcpServers`. Teamgenoten laden skills en MCP-servers uit project/user-instellingen zoals elke normale sessie.

---

## Architectuur en opslag

| Component | Rol |
|-----------|------|
| Team lead | Hoofdsessie die het team maakt, teamgenoten laat draaien, coördineert |
| Teammates | Aparte Claude Code-instanties die aan toegewezen taken werken |
| Task list | Gedeelde werkitems die teamgenoten claimen en voltooien |
| Mailbox | Berichtensysteem voor communicatie tussen agents |

### Opslaglocaties

| Pad | Inhoud |
|------|----------|
| `~/.claude/teams/{team-name}/config.json` | Teamconfiguratie (auto-gegenereerd, niet handmatig bewerken) |
| `~/.claude/tasks/{team-name}/` | Gedeelde takenlijstgegevens |

Er is geen project-level teamconfiguratie. Een bestand als `.claude/teams/teams.json` in je projectmap wordt niet herkend.

---

## Machtigingen

Alle teamgenoten starten met de machtigingsinstellingen van de leider. Als de leider draait met `--dangerously-skip-permissions`, doen alle teamgenoten dat ook.

Je kunt de modi van individuele teamgenoten na het opzetten wijzigen, maar niet bij het opzetten.

---

## Context en communicatie

### Wat teamgenoten ontvangen

Teamgenoten laden dezelfde projectcontext als een normale sessie: `CLAUDE.md`, MCP-servers, skills. Ze ontvangen ook de opzet-prompt van de leider. De gespreksgeschiedenis van de leider gaat NIET over.

### Hoe communicatie werkt

- Berichten worden automatisch bezorgd (geen polling nodig)
- Idle-meldingen worden naar de leider gestuurd wanneer een teamgenoot stopt
- Gedeelde takenlijst is zichtbaar voor alle agents
- Bericht elk teamgenoot op naam (namen toegewezen door leider bij opzetten)

---

## Hook-events voor Agent Teams

Drie hook-events leveren kwaliteitsgrenzen voor teamcoördinatie.

### TeammateIdle

Fires wanneer een teamgenoot op het punt staat werkeloos te worden. Exit code `2` stuurt feedback en houdt de teamgenoot werkend.

### TaskCreated

Fires wanneer een taak wordt aangemaakt. Exit code `2` voorkomt aanmaking met feedback.

### TaskCompleted

Fires wanneer een taak als compleet wordt gemarkeerd. Exit code `2` voorkomt voltooiing met feedback.

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-task-tests.sh"
      }]
    }]
  }
}
```

Gebruik `TaskCompleted` hooks om normen af te dwingen — bijvoorbeeld verifiëren dat een teamgenoot tests schreef voordat een taak als klaar wordt gemarkeerd.

---

## Afsluiten en opruimen

### Afsluiten van een teamgenoot

```
Ask the researcher teammate to shut down.
```

De teamgenoot kan goedkeuren (sluit netjes af) of afwijzen met uitleg waarom het moet blijven werken.

### Het team opruimen

```
Clean up the team.
```

Gebruik altijd de leider voor opruiming. Teamgenoten moeten opruiming niet zelf uitvoeren. Sluit alle teamgenoten af voordat je opruiming uitvoert.

---

## Best Practices

1. **Teamgrootte: 3-5 teamgenoten.** Meer betekent meer coördinatieoverhead met afnemende opbrengsten.
2. **Taken per teamgenoot: 5-6.** Houdt iedereen productief zonder buitensporige contextschakeling.
3. **Geef context.** Teamgenoten erven de gespreksgeschiedenis van de leider niet. Include taak-specifieke details in opzet-prompts.
4. **Vermijd bestandsconflicten.** Wijs elke teamgenoot verschillende bestanden toe. Twee teamgenoten die hetzelfde bestand bewerken veroorzaken overschrijvingen.
5. **Start met onderzoek.** Als je nieuw bent voor teams, begin met niet-coding-taken (review, onderzoek, investigation) voordat je parallelle implementatie doet.
6. **Monitor en stuur.** Check voortgang. Laat een team te lang onbewaakt lopen verhoogt risico van verspilde moeite.
7. **Wacht op teamgenoten.** Vertel de leider "wait for your teammates to complete their tasks before proceeding" als hij begint te implementeren in plaats van delegeren.

---

## Use case voorbeelden

### Parallelle code review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Concurrerende hypothesen

```
Users report the app exits after one message. Spawn 5 teammates to
investigate different hypotheses. Have them talk to each other to
disprove each other's theories. Update findings doc with consensus.
```

### Cross-layer feature

```
Build the notifications feature. Spawn teammates:
- Backend: API endpoints and database schema
- Frontend: React components and state management
- Tests: integration and unit tests for both layers
Each teammate owns their layer. Coordinate via the shared task list.
```

---

## Beperkingen

- Geen sessieherstel met `/resume` of `/rewind` voor in-process teamgenoten
- Taakstatus kan vertraging vertonen — teamgenoten markeren taken soms niet als compleet
- Afsluiten kan langzaam zijn (teamgenoten voltooien eerst hun huidige verzoek)
- Eén team tegelijk per leider
- Geen geneste teams (teamgenoten kunnen niet hun eigen teams opzetten)
- Leider is vast voor de levensduur van het team
- Machtigingen worden ingesteld bij opzetting (verander individueel daarna, niet bij opzetting)
- Split panes vereisen tmux of iTerm2 (niet VS Code terminal, Windows Terminal of Ghostty)

---

## Token-kosten

Agent teams gebruiken aanzienlijk meer tokens dan een enkele sessie. Elk teamgenoot heeft zijn eigen contextvenster, en tokengebruik schaalt lineair met actieve teamgenoten.

Voor onderzoek, review en nieuwe features zijn de extra tokens meestal voordelig. Voor routinetaken is een enkele sessie kosteneffectiever.

---
