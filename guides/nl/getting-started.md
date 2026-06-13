# Aan de slag met Claudient

Deze gids brengt u in minder dan 10 minuten van nul naar een werkende Claude Code-omgeving met uw eerste skill, agent en hook.

---

## Vereisten

- [Claude Code](https://claude.ai/code) geïnstalleerd en geverifieerd
- Een projectmap waaraan u actief werkt

---

## Stap 1 — Claudient klonen

```bash

```

U heeft nu de volledige bibliotheek lokaal. Er wordt niets automatisch uitgevoerd — u kiest wat u nodig heeft.

---

## Stap 2 — De `.claude/`-map van uw project instellen

Claude Code zoekt naar configuratie in `.claude/` in de root van uw project.

```bash
mkdir -p your-project/.claude/skills
mkdir -p your-project/.claude/hooks
```

Uw projectstructuur zou er als volgt uit moeten zien:

```
your-project/
├── .claude/
│   ├── skills/        ← skills komen hier (huidige standaard)
│   ├── hooks/         ← hook-scripts komen hier
│   └── settings.json  ← hook-configuratie komt hier
├── CLAUDE.md          ← regels komen hier
└── src/
```

---

## Stap 3 — Uw eerste skill toevoegen

Skills zijn slash-commando's. Kopieer een `.md`-bestand uit `skills/` naar `.claude/skills/`:

```bash
# Voorbeeld: de FastAPI-skill toevoegen
cp ~/Claudient/skills/backend/python/fastapi.md your-project/.claude/skills/
```

Open nu Claude Code in uw project en typ `/fastapi` — de skill wordt geactiveerd.

> **Opmerking:** `.claude/commands/` werkt nog steeds (verouderd pad), maar `.claude/skills/` is de huidige standaard. Als beide bestaan, hebben skills voorrang.

**Hoe een skill kiezen:**
- Blader door `skills/` per categorie
- Lees de sectie "When to activate" bovenaan elk bestand
- Als het overeenkomt met uw huidige taak, kopieer het dan

---

## Stap 4 — Een regel toevoegen

Regels staan in `CLAUDE.md` in de root van uw project. Claude leest dit bestand aan het begin van elke sessie.

```bash
# Een gemeenschappelijke regelset kopiëren naar de CLAUDE.md van uw project
cat ~/Claudient/rules/common/coding-style.md >> your-project/CLAUDE.md
```

Of open `rules/common/` en kopieer handmatig de secties die relevant zijn voor uw project.

---

## Stap 5 — Uw eerste hook toevoegen

Hooks worden automatisch uitgevoerd bij Claude Code-gebeurtenissen. Ze staan in `.claude/settings.json`.

Maak of open `.claude/settings.json` in uw project:

```json
{
  "hooks": {}
}
```

Kopieer een hook uit `hooks/` — elk hook-bestand bevat de exacte JSON om in te plakken. Bijvoorbeeld de kosten-tracking hook:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

Kopieer dan het bijbehorende script:

```bash
cp ~/Claudient/hooks/lifecycle/cost-tracker.sh your-project/.claude/hooks/
chmod +x your-project/.claude/hooks/cost-tracker.sh
```

---

## Stap 6 — (Optioneel) Een agent toevoegen

Agents zijn sub-agent definities die u in uw Claude-sessies verwijst. Ze vereisen geen bestandskopie — u roept ze aan via `subagent_type` in een Agent-tool aanroep.

Blader door `agents/` om te begrijpen wat beschikbaar is. Wanneer u wilt dat Claude een taak delegeert aan een specialist (bijv. een beveiligingsreviewer, een databasespecialist), raadpleeg dan de agentdefinitie om te begrijpen wat die verwacht en wat die teruggeeft.

---

## Wat nu te doen

| Doel | Waar te zoeken |
|---|---|
| Uw eigen skill schrijven | [guides/skill-authoring.md](skill-authoring.md) |
| Token-kosten verlagen | [guides/token-optimization.md](token-optimization.md) |
| Geheugen en sessiestatus begrijpen | [guides/memory-management.md](memory-management.md) |
| Uw Claude Code-setup beveiligen | [guides/security.md](security.md) |
| Meerstaps geautomatiseerde workflows bouwen | [guides/agent-orchestration.md](agent-orchestration.md) |
| Kwaliteit automatiseren met hooks | [guides/hooks-cookbook.md](hooks-cookbook.md) |

---

## Problemen oplossen

**Skill verschijnt niet als slash-commando**
— Controleer of het bestand in `.claude/skills/` staat (of `.claude/commands/` voor het oude pad)
— Controleer of de bestandsextensie `.md` is
— Start Claude Code opnieuw op

**Hook wordt niet geactiveerd**
— Controleer of de naam van de gebeurtenis exact overeenkomt: `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`
— Controleer of het scriptpad relatief is aan de projectroot
— Controleer of het script uitvoerbaar is (`chmod +x`)

**CLAUDE.md wordt niet gelezen**
— Het moet in de projectroot staan (op hetzelfde niveau als `src/`, `package.json`, etc.)
— Start de Claude Code-sessie opnieuw na het bewerken

---

## Werk met ons samen
