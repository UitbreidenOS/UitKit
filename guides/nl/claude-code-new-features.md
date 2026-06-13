# Claude Code Gids voor nieuwe functies (2026)

De definitieve gids voor de nieuwste mogelijkheden van Claude Code — gebaseerd op het officiële changelog en What's New-documentatie. Behandelt Agent View, /goal, /ultrareview, Auto Mode, Opus 4.7, Computer Use, Ultraplan en het herontworpen bureaublad.

---

## Snelle referentie — Alle nieuwe commando's

| Commando | Wat het doet | Sinds |
|---|---|---|
| `claude agents` | Dashboard voor alle parallelle sessies | v2.1.139 |
| `/goal [condition]` | Claude werkt autonoom totdat de voorwaarde is bereikt | v2.1.139 |
| `/ultrareview` | Vloot van cloud-agenten controleert uw code | v2.1.111 |
| `claude ultrareview [target]` | Niet-interactieve cloud-review voor CI | v2.1.120 |
| `/effort` | Interactieve schuifregelaar voor intelligentieniveau | v2.1.111 |
| `/loop [interval]` | Voer een commando uit op een terugkerend schema | v2.1.95 |
| `/goal` | Autonome taakvoltooiing | v2.1.139 |
| `/autofix-pr` | Auto-fix PR's vanaf uw terminal | v2.1.100 |
| `/team-onboarding` | Pak uw instellingen in als herhaalbare gids | v2.1.100 |
| `claude project purge` | Verwijder alle lokale statusgegevens voor een project | v2.1.126 |
| `--plugin-url <url>` | Laad plugin van URL voor huidige sessie | v2.1.129 |
| `--plugin-dir <path.zip>` | Laad plugin uit .zip-archief | v2.1.128 |

---

## Agent View — Alle sessies in één dashboard

`claude agents` (gestart 11 mei 2026 — Research Preview) geeft u één scherm voor elke Claude Code-sessie: wat draait, wat wacht op uw invoer, wat klaar is.

```bash
# Agent View openen
claude agents

# Agent View met specifieke instellingen
claude agents --model claude-opus-4-7 --effort xhigh

# Sessies als JSON opsommen (voor scripts, statusbalken, tmux)
claude agents --json

# Beperken tot een specifieke map
claude agents --cwd /path/to/project
```

**Wat u ziet:**
- Elke draaiende sessie met huidige taak en status
- Sessies geblokkeerd en wacht op uw invoer (duidelijk gemarkeerd)
- Voltooide sessies met hun looptijd
- Real-time kosten per sessie

**Antwoord zonder context te verliezen:**
U kunt rechtstreeks vanuit Agent View op elke wachtende sessie reageren zonder terminalvensters te wisselen.

**Tabtitel toont wachtaantal:**
De titelbalk van het terminal wordt bijgewerkt om te tonen hoeveel sessies wachten op uw invoer — in één oogopslag zichtbaar zonder Agent View te openen.

**Best practice — parallelle worktree-sessies:**
```bash
# Geïsoleerde worktrees voor elke taak maken
git worktree add ../myapp-auth feature/auth
git worktree add ../myapp-payments fix/payment-timeout
git worktree add ../myapp-docs docs/api-reference

# Start Claude in elke map (achtergrondmodus)
cd ../myapp-auth     && claude --bg "implement OAuth with Better Auth"
cd ../myapp-payments && claude --bg "fix the Stripe webhook signature verification"
cd ../myapp-docs     && claude --bg "write API documentation for all routes"

# Controleer alle drie vanaf één scherm
claude agents
```

---

## /goal — Autonome taakvoltooiing

Stel een meetbare voltooiingsvoorwaarde in. Claude herhaalt — schrijft code, voert tests uit, lost fouten op — totdat de voorwaarde klopt.

```bash
# In interactieve modus
/goal all tests pass for the auth module

# Met een specifieke meetbare voorwaarde
/goal the /api/users endpoint returns 201 with valid input and 422 with invalid email

# Met een tijdsbudget
/goal migrate the database schema and verify all existing tests still pass

# Draait ook in niet-interactieve modus (-p vlag)
claude -p "..." --goal "all TypeScript errors resolved"
```

**Hoe /goal werkt:**
1. Claude begrijpt de huidige staat
2. Schrijft of repareert code naar het doel
3. Voert tests of verificatieopdrachten uit
4. Leest de resultaten, lost fouten op
5. Herhaalt totdat de doelvoorwaarde klopt of een doodloop bereikt is
6. Stopt en rapporteert uitkomst

**Goede doelen (specifiek, testbaar):**
```
/goal npm test passes with zero failures
/goal the Lighthouse score for the homepage is above 90
/goal the Docker container builds and all health checks pass
/goal all TypeScript errors in src/ are resolved
/goal the migration runs cleanly on the staging database
```

**Vermijd vage doelen:**
```
/goal make the app better           ← not testable
/goal fix all the bugs              ← too open-ended
/goal improve code quality          ← no clear signal
```

**Opmerking:** /goal evaluator wacht totdat alle draaiende shells en subagenten klaar zijn voordat de voorwaarde wordt gecontroleerd.

---

## /ultrareview — Cloud Fleet Code Review

Een vloot gespecialiseerde agenten draait in de cloud om uw code te beoordelen. Bevindingen komen rechtstreeks in uw CLI of bureaublad terecht.

```bash
# Controleer huidige branch (interactief)
/ultrareview

# Controleer een specifieke PR
/ultrareview PR#123

# Niet-interactief (voor CI/CD-scripts)
claude ultrareview                    # review current branch
claude ultrareview --pr 123          # review specific PR
claude ultrareview --focus security  # focus on security only
```

**Wat de vloot controleert:**
- Beveiligingsgaten (injection, auth bypass, blootgestelde geheimen)
- Logicafouten en edge cases gemist in tests
- Prestatieknelpunten (N+1 query's, geheugenlekken)
- Breekbare API-wijzigingen
- Gaten in testdekking

**vs. /code-review (lokaal):**
- `/code-review` — één agent, huidige sessiecontext, sneller
- `/ultrareview` — meerdere gespecialiseerde agenten parallel, breder bereik, beste voor vóór samenvoegsel

---

## Auto Mode — Intelligente toestemmingsverwerkering

Auto mode classificeert uw toestemmingsvragen automatisch:
- **Veilige bewerkingen** (alleen-lezen, sandbox) → zonder onderbreking uitvoeren
- **Riskante bewerkingen** (destructief, netwerk, referentie-access) → geblokkeerd of geëscaleerd

```bash
# Auto mode inschakelen
claude --auto-mode

# Auto mode is nu beschikbaar zonder vlag voor Max-abonnees
# Op Opus 4.7 met Max-abonnement: standaard ingeschakeld

# Hard-deny-regels (onvoorwaardelijk geblokkeerd ongeacht uitzonderingen)
# In .claude/settings.json:
{
  "autoMode": {
    "hard_deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
```

**Auto mode spinner wordt rood** wanneer een toestemmingscontrole vast komt te zitten — visueel signaal dat iets uw aandacht nodig heeft.

---

## Claude Opus 4.7 + Inspanningsniveaus

Opus 4.7 is nu het standaardmodel voor Max en Team Premium. Het introduceert het `xhigh` inspanningsniveau — de aanbevolen instelling voor complexe codeeringstaken.

```bash
# Inspanningsniveau interactief instellen
/effort

# Gebruik de inspanningsschuif (pijltjestoetsen, Enter om te bevestigen)
# Niveaus: low → medium → high → xhigh

# Instellen via commando-regel
claude --effort xhigh "debug this race condition"
claude --effort low   "rename this variable"

# Controleer inspanningsniveau in hooks via $CLAUDE_EFFORT
# Of effort.level in hook JSON-invoer

# Snelle modus gebrukt nu standaard Opus 4.7
# Terug naar 4.6: CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1
```

**Wanneer elk inspanningsniveau gebruiken:**

| Niveau | Gebruiken voor | Token-uitgave |
|---|---|---|
| `low` | Variabele hernoemen, opmaak, eenvoudige vervolledigingen | Minimaal |
| `medium` | Standaard feature-werk, debugging van veelvoorkomende fouten | Gemiddeld |
| `high` | Refactors, architectuur-reviews, tests schrijven | Hoger |
| `xhigh` | Veiligheidaudits, race conditions, complexe multi-bestand wijzigingen | Hoogst |

**Comprimeer eerdere context:**
Het Rewind-menu bevat nu "Summarize up to here" — comprimeert eerdere beurten met behoud van recente context. Verlaagt kosten zonder sleutelinzichten te verliezen.

---

## Computer Use — CLI-besturing van GUI-apps

Claude kan native apps openen, door UI klikken en veranderingen verifiëren die alleen een GUI kan bevestigen.

```bash
# Computer use inschakelen (onderzoeksvoorbeeld)
claude --computer-use

# Claude kan nu:
# - Native apps op uw bureaublad openen
# - Op knoppen klikken en formulieren invullen
# - Screenshots maken en UI-status verifiëren
# - End-to-end-flows uitvoeren die een echte browser of app vereisen
```

**Beste use cases:**
- Verifieer dat een UI-wijziging er correct uitziet
- Automatiseer flows die geen CLI hebben (legacy apps, complexe web UI's)
- Sluit de lus na code-wijzigingen: "werkt dit eigenlijk in de browser?"

**Ook beschikbaar in de bureaublad-app** — computer use werkt in zowel CLI als het herontworpen bureaublad.

---

## Ultraplan — Cloud-planning + Externe uitvoering

Schrijf een plan in de cloud, controleer en plaats opmerkingen in een webeditor, voer het vervolgens uit op afstand of haal het lokaal terug.

```bash
# Ultraplan starten (vroege preview)
/ultraplan

# Claude schrijft een gestructureerd plan
# → U krijgt een URL om te controleren en aan te tekenen in een webeditor
# → Plaats opmerkingen over stappen, keur delen goed/af
# → Voer extern uit in een cloud-omgeving
# → Of haal lokaal terug en voer uit

# De eerste uitvoering maakt automatisch een cloud-omgeving voor u
```

**Ideaal voor:**
- Lange meerdaagse taken die profiteren van een gestructureerd geschreven plan vóór uitvoering
- Een plan met teamgenoten delen voor controle voordat deze wordt uitgevoerd
- Taken die moeten draaien in een schone cloud-omgeving (niet uw lokale machine)

---

## Routines — Geplande Cloud-agenten

Op Claude Code Web voeren Routines sjabloongerelateerde cloud-agenten uit volgens een planning, GitHub-evenement of API-aanroep.

```
Voorbeeld-routines:
- "Every Monday: review open PRs and summarize what needs attention"
- "On push to main: run /ultrareview on the diff"
- "Daily at 9am: check for dependency security advisories"
- "On GitHub issue opened: triage and label it"
```

Configureer in de Claude Code Web-interface → Routines.

---

## Monitor Tool — Live-log-streaming

Het Monitor-tool streamt achtergrondgebeurtenissen naar het gesprek — Claude kan logs volgen en in real-time reageren.

```bash
# Claude kan Monitor-tool automatisch gebruiken bij het controleren van processen
# Of u kunt het expliciet aanroepen:
/monitor <process or log source>

# Voorbeeld: Claude controleert een implementatie en reageert op fouten
"Deploy this to staging and monitor the logs — fix any errors that appear"
```

---

## Herontworpen bureaubladervaring

De Claude Code Desktop (Web) ondergingen een grote herziening met:

**Parallelle indeling:**
- Meerdere agenten tegelijk zichtbaar van één venster
- Zijchats zonder het hoofdthread kwijt te raken
- Paneel-indeling door te slepen en los te laten
- Sessies-zijbalk voor navigatie tussen projecten

**Ingebouwde tools:**
- HTML- en PDF-voorvertoningen (gegenereerde uitvoer inline weergeven)
- In-app-bestandseditor (bestanden bewerken zonder naar IDE te wisselen)
- Herontworpen diff-viewer (wijzigingen controleren zonder ander gereedschap)
- Aangepaste thema's (maken van `/theme` of via plugin)

**Auto-archief:**
Sessies worden automatisch gearchiveerd wanneer hun bijbehorende PR wordt samengevoegd — houdt uw werkruimte schoon.

**Sessiesamenvattting:**
Wanneer u terugkeert naar een sessie die op de achtergrond draait, biedt Claude een samenvatting van wat er gebeurde terwijl u weg was.

---

## Plugins: .zip- en URL-laden

```bash
# Een plugin uit een .zip-bestand laden (voor huidge sessie)
claude --plugin-dir ./my-plugin.zip

# Van een URL laden
claude --plugin-url https://example.com/my-plugin.zip

# Bladeren en installeren vanuit marketplace
/plugin

# Plugin-details weergeven (onderdelen, tokenkosten)
claude plugin details <name>

# Plugin-onderdelen opsommen vóór installatie
# /plugin toont nu skills, hooks, agenten, MCP-servers in het browser pane
```

---

## Windows: Geen Git Bash vereist

Claude Code werkt nu nief op Windows met PowerShell — Git voor Windows is niet langer een vereiste.

```powershell
# Claude Code op Windows installeren (geen Git Bash vereist)
winget install Anthropic.ClaudeCode

# Of via npm
npm install -g @anthropic-ai/claude-code

# PowerShell is nu de primaire shell in Windows
# Bash-tool valt automatisch terug op PowerShell
```

---

## Andere opmerkelijke toevoegingen

**`/loop` self-pacing:**
```bash
/loop 5m /check-deploy    # run every 5 minutes
/loop /monitor-tests      # self-pace (Claude decides interval)
```

**`/team-onboarding`:**
Verpakt uw Claude Code-instellingen (hooks, skills, CLAUDE.md) in een herhaalbare gids voor nieuwe teamleden.

**`/autofix-pr`:**
Maakt automatische PR-fix-suggesties mogelijk van uw terminal — Claude controleert CI-resultaten en stelt fixes voor.

**Voice input-correcties:**
Voice push-to-talk werkt nu in het antwoord pane van Agent View. Verbeterde betrouwbaarheid op macOS.

**Mobile push-meldingen:**
Wanneer een lange taak klaar is of Claude uw invoer nodig heeft, ontvang een push-melding op uw telefoon (via Remote Control).
```bash
# Vereist Claude Code Remote Control-instelling
# Configureer in Desktop-instellingen → Meldingen → Mobiel
```

---

## Aanvullende CLI-commando's

**`claude agents --json`** (v2.1.145+)
Machine-leesbare sessielijst — drukt alle live-sessies af als JSON-array en sluit af:
```bash
claude agents --json | jq '.[] | select(.status == "running")'
```
Velden: `pid`, `cwd`, `kind`, `startedAt`, `sessionId`, `name`, `status`. Combineer met `--cwd` om op map te filteren.

**`claude respawn`**
Start een sessie opnieuw met intacte gespreksgeschiedenis:
```bash
claude respawn <session-id>      # restart one session
claude respawn --all             # restart all running sessions
```

**`claude daemon status`**
Toon de toezichtproces-status en worker-teller. Nuttig voor het diagnosticeren waarom sessies niet starten.

**`/scroll-speed`**
Muis-scrollsnelheid in de CLI afstemmen. `/scroll-speed 3` (standaard), `/scroll-speed 1` (langzaam), `/scroll-speed 10` (snel).

**`/code-review` (hernoemd van `/simplify`)**
Vanaf v2.1.146 werd `/simplify` hernoemd naar `/code-review`. Oude naam werkt nog steeds als alias. Accepteert nu een optioneel inspanningsniveau:
```
/code-review
/code-review xhigh
```
Controleert huidge diffs op compileeringsfouten, logicafouten, beveiligingsgaten — geen stijl of opmaak.

---
