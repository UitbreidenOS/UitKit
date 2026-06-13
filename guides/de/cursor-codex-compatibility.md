# Claudient-Skills in Cursor, Windsurf, Copilot und Codex verwenden

Claudient-Skills sind schlichte Markdown-Dateien. Nichts in ihrem Format ist Claude Code-spezifisch — keine Binärdatei, keine proprietäre Syntax, keine API-Aufrufe. Das macht sie auf alle großen KI-Codierungswerkzeuge mit einem Regel- oder Kontextinjektionsmechanismus portierbar.

Dieser Leitfaden behandelt die Mechanik der Übertragung eines Claudient-Skills auf Cursor, Windsurf, GitHub Copilot und OpenAI Codex CLI — was funktioniert, was nicht funktioniert und wo die Grenze zu ziehen ist.

---

## Warum es funktioniert

Ein Claudient-Skill besteht aus vier Markdown-Abschnitten: `When to activate`, `When NOT to use`, `Instructions` und `Example`. Das Modell liest dies als Klartext und passt sein Verhalten entsprechend an.

Das ist genau das, was jedes KI-Codierungswerkzeug tut, wenn Sie Text in seine Regel- oder Anweisungsdatei einfügen — der Text wird Teil des System-Prompts, bevor Ihre Anfrage verarbeitet wird. Das Skill-Format ist bereits dafür optimiert:

- `When to activate` und `When NOT to use` geben dem Modell Umfangsbeschränkungen, die eine Überanwendung verhindern
- `Instructions` enthält direktive Sprache („immer X tun", „niemals Y tun") statt Dokumentationssprache
- `Example` verankert das Modell in der erwarteten Ausgabestruktur

Jedes Modell, das einen System-Prompt oder eine benutzerdefinierte Anweisungsdatei akzeptiert, kann einen Claudient-Skill ohne Änderungen verwenden. Sie verlieren Claude Code-spezifische Funktionen (Slash-Befehlanrufe, Hook-Trigger, Subagent-Delegierung), aber die grundlegende Verhaltensanleitung wird vollständig übertragen.

---

## Schnellreferenz

| Werkzeug | Wo den Skill platzieren |
|---|---|
| Claude Code | `.claude/skills/<skill>.md` (Slash-Befehl) oder Import über `CLAUDE.md` |
| Cursor | `.cursor/rules/<skill>.mdc` (automatisch geladen) oder `.cursorrules` (veraltet) |
| Windsurf | `.windsurfrules` im Projektstamm |
| GitHub Copilot | `.github/copilot-instructions.md` |
| OpenAI Codex CLI | `AGENTS.md` im Projektstamm oder mit Flag `--context` übergeben |
| Zed | Projektregeldatei (`.zed/settings.json` → Schlüssel `"system_prompt"`) |
| Continue.dev | `~/.continue/config.json` → Feld `"systemMessage"` oder Block `@Rules` |

---

## Cursor

Cursor ist die häufigste Alternative zu Claude Code für Teams, die bereits VS Code verwenden. Es unterstützt granulare projektspezifische Regeln mit Umfangskontrollen.

### Speicherort der Regeldatei

Cursor lädt Regeln automatisch aus `.cursor/rules/`. Jede Datei muss die Erweiterung `.mdc` verwenden. Cursor liest beim Start alle `.mdc`-Dateien in diesem Verzeichnis — Sie müssen sie nicht manuell referenzieren.

```
your-project/
├── .cursor/
│   └── rules/
│       ├── fastapi.mdc
│       ├── db-migrations.mdc
│       └── test-coverage.mdc
└── src/
```

### Einen Claudient-Skill in eine Cursor-Regel konvertieren

1. Kopieren Sie die `.md`-Datei von `skills/` in `.cursor/rules/`
2. Benennen Sie die Erweiterung von `.md` in `.mdc` um
3. Fügen Sie oben einen MDC-Frontmatter-Block ein, um den Umfang zu kontrollieren:

```
---
description: FastAPI-Endpunkt-Muster — aktivieren beim Erstellen oder Ändern von FastAPI-Routen
globs: ["**/*.py", "**/routers/**"]
alwaysApply: false
---

# FastAPI CRUD

## When to activate
...
```

Das Feld `globs` teilt Cursor mit, diese Regel nur anzuheften, wenn Dateien, die diesen Mustern entsprechen, im Kontext geöffnet sind. Das Feld `description` wird von Cursors Regelabgleichlogik verwendet — kopieren Sie den Inhalt des Abschnitts `When to activate` des Skills als prägnante Auslösephrase.

Wenn `alwaysApply: true` gesetzt wird, wird die Regel bei jeder Anfrage injiziert, unabhängig von der geöffneten Datei. Verwenden Sie dies nur für projektweite Codierungsstandards, niemals für aufgabenspezifische Skills — es verschwendet Kontext und verschlechtert die Reaktionsqualität bei unabhängigen Aufgaben.

### Legacy `.cursorrules`

`.cursorrules` ist eine einzelne Datei im Projektstamm. Sie wird bei jeder Anfrage ohne Umfang geladen. Fügen Sie den vollständigen Skill-Inhalt nur hier ein, wenn:

- Das Projekt einen einzelnen dominanten Technologie-Stack hat
- Sie möchten, dass der Skill aktiv ist, unabhängig davon, welche Datei offen ist
- Sie verwenden die Verzeichnisstruktur `.cursor/rules/` noch nicht

Für Projekte mit mehreren Skills ist `.cursor/rules/` mit separaten `.mdc`-Dateien eindeutig besser — jeder Skill wird nur geladen, wenn es relevant ist.

### Cursor-spezifische Einschränkung

Cursor unterstützt nicht die Slash-Befehlanrufe einzelner Skills auf die gleiche Weise wie Claude Code. Alle `.mdc`-Dateien, die dem aktuellen Kontext entsprechen, werden gleichzeitig geladen. Wenn Sie fünf installierte Skills haben und alle fünf entsprechen (z.B. alle haben `alwaysApply: true`), injiziert Cursor alle fünf in den System-Prompt. Halten Sie den Umfang durch `globs` und präzise `description`-Werte eng, um dies zu vermeiden.

---

## Windsurf

Windsurf (der Editor von Codeium) verwendet eine einzelne Regeldatei pro Projekt.

### Speicherort der Regeldatei

Platzieren Sie eine `.windsurfrules`-Datei im Projektstamm:

```
your-project/
├── .windsurfrules
├── src/
└── package.json
```

### Einen Claudient-Skill konvertieren

Fügen Sie den Skill-Inhalt direkt in `.windsurfrules` ein. Für mehrere Skills verketten Sie sie mit einer horizontalen Regel (`---`) als Trennzeichen:

```markdown
# FastAPI CRUD

## When to activate
- Erstellen eines neuen FastAPI-Endpunkts (GET, POST, PUT, DELETE)
...

## Instructions
...

---

# Database Migrations

## When to activate
- Ausführen von Alembic-Migrationen
...
```

Windsurf lädt die gesamte Datei `.windsurfrules` bei jeder Anfrage. Es gibt keinen Umfangsmechanismus pro Datei — das Modell muss die Abschnitte `When to activate` und `When NOT to use` zum Selbstauswählen verwenden. Dies funktioniert, aber große Dateien (über 3–4 Skills) beginnen die Aufmerksamkeit des Modells zu verwässern. Halten Sie `.windsurfrules` auf den 2–3 relevantesten Skills für den aktuellen Workflow beschränkt und wechseln Sie bei Bedarf.

---

## GitHub Copilot

Die benutzerdefinierte Anweisungsdatei von Copilot gilt für alle Copilot-Interaktionen in einem Repository.

### Speicherort der Regeldatei

```
your-project/
├── .github/
│   └── copilot-instructions.md
└── src/
```

Der Dateiname muss genau `copilot-instructions.md` lauten. Copilot liest dies automatisch für jedes Repository, in dem es vorhanden ist.

### Einen Claudient-Skill konvertieren

Fügen Sie den Skill-Inhalt in `copilot-instructions.md` ein. Das Format mit vier Abschnitten wird von den GPT-4-Modellen, die Copilot antreiben, verstanden — der Abschnitt `When NOT to use` ist besonders wirksam, um Copilot daran zu hindern, Muster im falschen Kontext anzuwenden.

```markdown
# FastAPI CRUD

## When to activate
- Erstellen eines neuen FastAPI-Endpunkts
- Hinzufügen von Pydantic-Anfrage-/Antwortmodellen
- Implementierung von Dependency Injection in Routen

## When NOT to use
- Bestehende Flask- oder Django-Projekte
- Einfache Scripts ohne API-Schicht
- gRPC- oder GraphQL-APIs

## Instructions

Definieren Sie immer ein Pydantic-Modell für Anforderungskörper. Akzeptieren Sie niemals rohe Dicts.
Erheben Sie `HTTPException` mit dem korrekten Statuscode — 422 für Validierungsfehler,
404 für nicht gefunden, 500 nur für unerwartete Fehler.

## Example

**User:** Fügen Sie einen POST-Endpunkt hinzu, um einen neuen Benutzer zu erstellen.

**Expected:**
- `UserCreate` Pydantic-Modell mit `email: EmailStr` und `password: str`
- Route bei `POST /users` zurückgebend `UserResponse` (kein password-Feld)
- `HTTPException(409)` wenn E-Mail bereits vorhanden ist
```

### Copilot-Zeichenbeschränkungen

Ab Mitte 2025 wendet Copilot eine Softbegrenzung auf pro Anfrage geladenen `copilot-instructions.md`-Inhalt an. Dateien über ca. 8.000 Zeichen können abgeschnitten werden. Bei Multi-Skill-Projekten priorisieren Sie die am häufigsten ausgelösten Skills und halten Sie einzelne `Instructions`-Abschnitte eher dicht als umfassend.

---

## OpenAI Codex CLI

Codex CLI (Befehl `codex`) verwendet `AGENTS.md` für persistenten Kontext, entsprechend CLAUDE.md in Claude Code.

### Speicherort der Regeldatei

Platzieren Sie `AGENTS.md` im Projektstamm:

```
your-project/
├── AGENTS.md
└── src/
```

### Einen Claudient-Skill konvertieren

Fügen Sie den Skill direkt in `AGENTS.md` ein. Codex liest diese Datei beim Starten der Sitzung und fügt sie für jede Anfrage in diesem Verzeichnis in den System-Prompt ein.

```markdown
# FastAPI CRUD

## When to activate
...

## Instructions
...
```

Für einzelne Anrufe ohne Änderung von `AGENTS.md` übergeben Sie den Skill als Kontextdatei:

```bash
codex --context skills/backend/python/fastapi.md "POST /users Endpunkt hinzufügen"
```

Das Flag `--context` akzeptiert einen Dateipfad und stellt seinen Inhalt dem System-Prompt für diesen Anruf vorab ein. Nützlich zum Testen von Skills vor dem Committen zu `AGENTS.md`.

### Verschachtelung

Wie CLAUDE.md unterstützt `AGENTS.md` Verzeichnisebenen-Überrides. Eine Datei bei `services/api/AGENTS.md` gilt nur, wenn Codex innerhalb dieses Teilbaums operiert, was eine Pro-Service-Skill-Zuweisung in einem Monorepo ermöglicht.

---

## Zed und Continue.dev

### Zed

Der KI-Kontext von Zed wird in `.zed/settings.json` konfiguriert. Fügen Sie den Skill-Inhalt in das Feld `"system_prompt"` ein:

```json
{
  "assistant": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-5"
    },
    "system_prompt": "# FastAPI CRUD\n\n## When to activate\n..."
  }
}
```

Für Multi-Skill-Setups verketten Sie Skills als einzelne Zeichenkette. Zed unterstützt keine dateibasierten Regelimporte, daher muss der gesamte Kontext inline in `settings.json` aktiv sein.

### Continue.dev

Continue unterstützt sowohl globale als auch projektbezogene System-Nachricht-Overrides. In `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4-5",
      "systemMessage": "# FastAPI CRUD\n\n## When to activate\n..."
    }
  ]
}
```

Für projektbezogene Regeln unterstützt Continue `@Rules`-Blöcke in `.continue/rules.md` (Version 0.9+). Fügen Sie den Skill-Inhalt dort ein — Continue injiziert ihn zusammen mit dem System-Prompt des Modells für in diesem Projekt gemachte Anfragen.

---

## Was sich gut überträgt

**Der Instructions-Abschnitt** — direktive Sprache funktioniert modellübergreifend identisch. „Definieren Sie immer ein Pydantic-Modell für Anforderungskörper. Akzeptieren Sie niemals rohe Dicts." ist für GPT-4o, Claude, Gemini und alle anderen Modelle mit Anweisungsfolgefähigkeit unmissverständlich.

**Der Example-Abschnitt** — Few-Shot-Verankerung ist modellunabhängig. Ein Beispiel, das die erwartete Ausgabestruktur zeigt, verbessert die Einhaltung bei allen Modellen, nicht nur Claude.

**Der When NOT to use-Abschnitt** — negative Beschränkungen sind in den meisten Regeldateien untergenutzt. Dieser Abschnitt ist oft der Unterschied zwischen einem Skill, der hilft und einem, der nicht verbundene Arbeit behindert.

**Dateiumfangsbezogene Regeln (Cursor globs)** — das Cursor `.mdc`-Format mit `globs` repliziert das `paths`-Frontmatter-Feld von Claude Code. Skills, die Dateimuster in ihrem Abschnitt `When to activate` angeben, übersetzen natürlich zu Cursors `globs` — automatisieren Sie die Umwandlung.

---

## Was sich nicht überträgt

**Slash-Befehlanruf** — `/skill-name` ist Claude Code-spezifisch. Andere Tools laden Skills passiv aus ihrer Regeldatei; Sie können einen Skill nicht in der gleichen Weise mitten in einer Sitzung auslösen.

**Hooks** — `.claude/settings.json`-Hooks (`PreToolUse`, `PostToolUse`, `Notification`, `Stop`) sind nur Claude Code. Shell-Skripte, die bei Tool-Events ausgelöst werden, haben kein Äquivalent in Cursor, Windsurf oder Copilot. Versuchen Sie nicht, Hook-Dateien zu übersetzen.

**Subagent-Delegierung** — Skills, die Claude anweisen, einen Subagenten zu erzeugen (Tool `Task`, Verweise `subagent_type`), führen in anderen Tools nicht aus. Das Modell liest die Anweisung und tut nichts Bedeutungsvolles damit, oder versucht, das Verhalten in einem einzelnen Kontextfenster zu simulieren.

**MCP-Tool-Verweise** — Anweisungen, die spezifische MCP-Tools referenzieren (`mcp__tool_name`), funktionieren nur in Claude Code mit dem konfigurierten MCP-Server. Entfernen Sie diese aus Skills, bevor Sie sie in anderen Tools verwenden, oder ersetzen Sie sie durch äquivalente native Tool-Anweisungen für die Zielplattform.

**`!command`-Laufzeit-Injektion** — Die Syntax `!git branch --show-current` zum Einbetten der Shell-Ausgabe in den Skill-Kontext zur Aktivierungszeit ist Claude Code-spezifisch. Andere Tools führen diese Inline-Befehle nicht aus. Ersetzen Sie sie durch statischen Text oder entfernen Sie sie beim Portieren ganz.

---

## Praktischer Workflow zum Portieren eines Skills

1. Öffnen Sie die Skill-Datei von `skills/`
2. Entfernen Sie alle `!command`-Inline-Injektionen
3. Entfernen oder schreiben Sie Abschnitte um, die Claude Code-Agents, Hooks oder MCP-Tools referenzieren
4. Bestimmen Sie das Zielwerkzeug und die Zieldatei (siehe Tabelle oben)
5. Für Cursor: fügen Sie den MDC-Frontmatter-Block hinzu; extrahieren Sie den `When to activate`-Inhalt als `description`-Wert; machen Sie Dateimuster `globs` entsprechend
6. Für einfache Dateiziele (Windsurf, Copilot, Codex): fügen Sie ein wie vorhanden mit Trennzeichen, wenn Sie mehrere Skills verketten
7. Testen Sie mit einer Aufgabe, die `When to activate` entspricht — stellen Sie sicher, dass das Modell die `Instructions`-Muster anwendet
8. Testen Sie mit einer Aufgabe, die `When NOT to use` entspricht — stellen Sie sicher, dass das Modell die Muster nicht anwendet

Die Struktur mit vier Abschnitten wurde für Autonomie entworfen. Ein gut geschriebener Claudient-Skill sollte weniger als 10 Minuten benötigen, um auf eines dieser Werkzeuge portiert zu werden.

---
