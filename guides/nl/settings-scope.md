# Referentie voor Instellingenbereik — Globaal vs Project

Alles in Claude Code bestaat in ofwel het **globale** bereik (`~/.claude/`) ofwel het **project** bereik (`.claude/`). Sommige functies zijn alleen globaal. Deze gids is de gezaghebbende referentie voor waar dingen zich bevinden en hoe ze interageren.

---

## Bereik-overzicht

| Functie | Globaal (`~/.claude/`) | Project (`.claude/`) | Opmerkingen |
|---|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | `CLAUDE.md` (repo-wortel) | Beide geladen; samengevoegd bij start |
| `settings.json` | `~/.claude/settings.json` | `.claude/settings.json` | Samengevoegd; project overschrijft globaal |
| `settings.local.json` | `~/.claude/settings.local.json` | `.claude/settings.local.json` | Persoonlijke overrides; gitignored |
| Vaardigheden | `~/.claude/skills/` | `.claude/skills/` | Beide tegelijkertijd actief |
| Agenten | `~/.claude/agents/` | `.claude/agents/` | Beide tegelijkertijd actief |
| Hooks | `~/.claude/settings.json` | `.claude/settings.json` | Beide activeren; arrays samengevoegd |
| Regels | `~/.claude/rules/` | `.claude/rules/` | Beide actief; gematcht op `paths:` frontmatter |
| MCP-servers | `~/.claude.json` | `.claude/mcp.json` | Samengevoegd bij start |
| Taken | `~/.claude/tasks/` | — | Alleen globaal |
| Agenten-teams | `~/.claude/teams/` | — | Alleen globaal |
| Toetsencombinaties | `~/.claude/keybindings.json` | — | Alleen globaal |
| Geheugenbestanden | `~/.claude/memory/` | — | Alleen globaal |
| Credentials / tokens | `~/.claude/` | — | Alleen globaal; nooit committen |

---

## `settings.local.json`

Beide bereiken ondersteunen een `.local.json` variant voor persoonlijke overrides:

- `~/.claude/settings.local.json` — persoonlijke globale overrides (nooit gecommit)
- `.claude/settings.local.json` — persoonlijke project-overrides (standaard gitignored)

Gebruik `.local.json` om door het team ingestelde instellingen te overschrijven zonder de gedeelde configuratie aan te raken. Veelvoorkomende gebruiksscenario's: hook uitschakelen tijdens foutopsporing, persoonlijke `ANTHROPIC_BASE_URL` instellen, standaardmodel overschrijven.

De laadvolgorde binnen elk bereik is:

1. `settings.json` (basis)
2. `settings.local.json` (basis-overrides)

---

## Samenvoeg-gedrag

Wanneer dezelfde sleutel bestaat in zowel globaal als project bereik:

| Sleuteltype | Gedrag |
|---|---|
| Scalaire (`model`, `effort`, stringvlaggen) | Project wint — globale waarde wordt genegeerd |
| Arrays (`hooks`, `tools`, `permissions`) | Samengevoegd — beide waarden zijn actief |
| Geneste objecten | Recursief samengevoegd; project-sleutels winnen bij conflict |

**Kritisch:** hooks-arrays worden samengevoegd, niet vervangen. Als u een globale `Stop` hook en een `Stop` hook in het project definieert, **beide activeren**. Dit is vaak het beoogde gedrag (globale hooks verwerken audit-logging; project-hooks verwerken project-specifieke validatie), maar kan gedupliceerde uitvoering veroorzaken als dezelfde hook per ongeluk in beide bereiken wordt gedefinieerd.

---

## CLAUDE.md laadvolgorde

Al het volgende wordt bij sessiestartgeladen en samengevoegd in context:

1. `~/.claude/CLAUDE.md` — globale gebruikersinstructies
2. `CLAUDE.md` aan repo-wortel — projectinstructies
3. `CLAUDE.md` bestanden in bovenliggende mappen tussen huigig bestand en repo-wortel (omhoog gelopen)
4. `.claude/rules/*.md` bestanden waarvan `paths:` frontmatter het huigig bestand overeenkomt

Latere vermeldingen overschrijven eerdere niet — alle inhoud is tegelijkertijd actief. Als vermeldingen conflicteren, heeft inhoud op projectniveau praktische voorrang omdat het later in de samengevoegde prompt verschijnt, maar er is geen expliciet override-mechanisme tussen CLAUDE.md-bestanden.

**Token-budget:** De gecombineerde CLAUDE.md-inhoud telt mee tegen het context-venster. Als alle bronnen het budget overschrijden, worden oudere of lagerprioriteitsbronnen afgekapt. Houd globaal CLAUDE.md beknopt — het laadt voor elk project.

---

## Project-bereik mappenindeling

Een goed gestructureerd projectbereik ziet er als volgt uit:

```
.claude/
  settings.json         # gecommit — teamconfiguratie
  settings.local.json   # gitignored — persoonlijke overrides
  mcp.json              # gecommit — project MCP-servers
  skills/
    feature-name.md     # projectspecifieke schuine opdrachten
  agents/
    specialist.md       # projectspecifieke sub-agenten
  rules/
    style.md            # altijd-actieve regels (geen paths: = altijd aan)
    tests.md            # paths: ["**/*.test.ts"] = auto-activering
  hooks/
    validate.sh         # hook-scripts (verwezen vanuit settings.json)
  memory/               # sessiegeheugen (gitignored)
```

---

## Globaal bereik mappenindeling

```
~/.claude/
  CLAUDE.md             # globale instructies, geladen voor elk project
  settings.json         # globale standaardinstellingen
  settings.local.json   # persoonlijke globale overrides
  skills/               # vaardigheden actief in elk project
  agents/               # agenten beschikbaar in elk project
  rules/                # regels actief in elk project
  tasks/                # takenlijsten tussen sessies
  teams/                # agenten-teamdefinities
  keybindings.json      # toetsenbord herkoppeling
  memory/               # persistent geheugen over projects
```

---

## Veelvoorkomende valkuilen

**`.local.json` bestanden committen.** Ze zijn standaard gitignored, maar als u ze force-add, stelt u persoonlijke API-sleutels of endpoint-overrides aan het team bloot. Voeg expliciet `settings.local.json` toe aan `.gitignore` als het niet al gedekt is.

**Dezelfde hook in beide bereiken definiëren.** De hook activeert twee keer. Dit is vooral verstorend voor hooks die audit-logs schrijven — u krijgt dubbele vermeldingen. Eenmaal globaal controleren; per project valideren.

**Alles in de globale CLAUDE.md dumpen.** Globaal CLAUDE.md laadt voor elk project. Het volstouwen met projectspecifieke instructies verspilt tokens op onafhankelijke sessies. Zet projectspecifieke instructies in het project-`CLAUDE.md`.

**Aanname dat vaardigheden omhoog in de boom lopen.** Dat doen ze niet. CLAUDE.md-bestanden lopen omhoog; vaardigheden niet. Een vaardigheid in `/workspace/project/.claude/skills/` is niet zichtbaar wanneer Claude in `/workspace/project/packages/api/` werkt. Elk sub-pakket heeft zijn eigen `.claude/skills/` nodig voor pakketspecifieke vaardigheden.

---
