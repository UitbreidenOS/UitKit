# Erste Schritte mit Claudient

Dieser Leitfaden bringt Sie in weniger als 10 Minuten von null zu einer funktionierenden Claude Code-Umgebung mit Ihrer ersten Skill, Ihrem ersten Agenten und Ihrem ersten Hook.

---

## Voraussetzungen

- [Claude Code](https://claude.ai/code) installiert und authentifiziert
- Ein Projektverzeichnis, an dem Sie aktiv arbeiten

---

## Schritt 1 — Claudient klonen

```bash

```

Sie haben jetzt die vollständige Bibliothek lokal. Es wird nichts automatisch ausgeführt — Sie wählen aus, was Sie benötigen.

---

## Schritt 2 — Das `.claude/`-Verzeichnis Ihres Projekts einrichten

Claude Code sucht nach Konfiguration in `.claude/` im Projektstammverzeichnis.

```bash
mkdir -p your-project/.claude/skills
mkdir -p your-project/.claude/hooks
```

Ihre Projektstruktur sollte wie folgt aussehen:

```
your-project/
├── .claude/
│   ├── skills/        ← Skills kommen hierher (aktueller Standard)
│   ├── hooks/         ← Hook-Skripte kommen hierher
│   └── settings.json  ← Hook-Konfiguration kommt hierher
├── CLAUDE.md          ← Regeln kommen hierher
└── src/
```

---

## Schritt 3 — Ihre erste Skill hinzufügen

Skills sind Slash-Befehle. Kopieren Sie eine beliebige `.md`-Datei aus `skills/` in `.claude/skills/`:

```bash
# Beispiel: FastAPI-Skill hinzufügen
cp ~/Claudient/skills/backend/python/fastapi.md your-project/.claude/skills/
```

Öffnen Sie jetzt Claude Code in Ihrem Projekt und tippen Sie `/fastapi` — die Skill wird aktiviert.

> **Hinweis:** `.claude/commands/` funktioniert weiterhin (veralteter Pfad), aber `.claude/skills/` ist der aktuelle Standard. Wenn beide existieren, haben Skills Vorrang.

**So wählen Sie eine Skill aus:**
- Durchsuchen Sie `skills/` nach Kategorie
- Lesen Sie den Abschnitt "When to activate" am Anfang jeder Datei
- Wenn sie zu Ihrer aktuellen Aufgabe passt, kopieren Sie sie hinein

---

## Schritt 4 — Eine Regel hinzufügen

Regeln befinden sich in `CLAUDE.md` im Projektstammverzeichnis. Claude liest diese Datei zu Beginn jeder Sitzung.

```bash
# Einen gemeinsamen Regelsatz in die CLAUDE.md Ihres Projekts kopieren
cat ~/Claudient/rules/common/coding-style.md >> your-project/CLAUDE.md
```

Oder öffnen Sie `rules/common/` und kopieren Sie manuell die für Ihr Projekt relevanten Abschnitte.

---

## Schritt 5 — Ihren ersten Hook hinzufügen

Hooks werden automatisch bei Claude Code-Ereignissen ausgeführt. Sie befinden sich in `.claude/settings.json`.

Erstellen oder öffnen Sie `.claude/settings.json` in Ihrem Projekt:

```json
{
  "hooks": {}
}
```

Kopieren Sie einen Hook aus `hooks/` — jede Hook-Datei enthält das genaue JSON zum Einfügen. Zum Beispiel der Kostenverfolgung-Hook:

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

Dann kopieren Sie das zugehörige Skript:

```bash
cp ~/Claudient/hooks/lifecycle/cost-tracker.sh your-project/.claude/hooks/
chmod +x your-project/.claude/hooks/cost-tracker.sh
```

---

## Schritt 6 — (Optional) Einen Agenten hinzufügen

Agenten sind Unter-Agenten-Definitionen, die Sie in Ihren Claude-Sitzungen referenzieren. Sie erfordern kein Kopieren von Dateien — Sie rufen sie über `subagent_type` in einem Agent-Tool-Aufruf auf.

Durchsuchen Sie `agents/`, um zu verstehen, was verfügbar ist. Wenn Sie möchten, dass Claude eine Aufgabe an einen Spezialisten delegiert (z.B. einen Sicherheitsprüfer, einen Datenbankspezialisten), referenzieren Sie die Agentendefinition, um zu verstehen, was er erwartet und was er zurückgibt.

---

## Was als nächstes zu tun ist

| Ziel | Wo nachschlagen |
|---|---|
| Eine eigene Skill schreiben | [guides/skill-authoring.md](skill-authoring.md) |
| Token-Kosten reduzieren | [guides/token-optimization.md](token-optimization.md) |
| Speicher und Sitzungszustand verstehen | [guides/memory-management.md](memory-management.md) |
| Claude Code-Setup absichern | [guides/security.md](security.md) |
| Mehrstufige automatisierte Workflows erstellen | [guides/agent-orchestration.md](agent-orchestration.md) |
| Qualität mit Hooks automatisieren | [guides/hooks-cookbook.md](hooks-cookbook.md) |

---

## Fehlerbehebung

**Skill erscheint nicht als Slash-Befehl**
— Prüfen Sie, ob die Datei in `.claude/skills/` ist (oder `.claude/commands/` für den alten Pfad)
— Prüfen Sie, ob die Dateiendung `.md` ist
— Starten Sie Claude Code neu

**Hook wird nicht ausgelöst**
— Überprüfen Sie, ob der Ereignisname exakt übereinstimmt: `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`
— Prüfen Sie, ob der Skriptpfad relativ zum Projektstamm ist
— Prüfen Sie, ob das Skript ausführbar ist (`chmod +x`)

**CLAUDE.md wird nicht gelesen**
— Sie muss im Projektstammverzeichnis liegen (auf gleicher Ebene wie `src/`, `package.json`, etc.)
— Starten Sie die Claude Code-Sitzung nach dem Bearbeiten neu

---

## Arbeiten Sie mit uns
