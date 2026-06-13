# SDK vs CLI — Unterschiede im Systemprompt

Wenn Sie Claude Code über die CLI verwenden, im Vergleich zum Claude Agent SDK, ist der in den Modellkontext geladene Systemprompt dramatisch unterschiedlich. Dies ist wichtig beim Aufbau automatisierter Pipelines, beim Debuggen unerwartetem Verhaltens oder beim Optimieren der Kosten.

---

## Was die CLI lädt

Die CLI lädt einen modularen Systemprompt, der sich aus 110+ bedingt aktivierten Fragmenten beim Start zusammensetzt. Das Geladene hängt von Ihrer Projektkonfiguration ab:

| Fragment-Kategorie | Tokens (ungefähr) |
|---|---|
| Basis-Prompt (immer geladen) | ~269 |
| Tool-Beschreibungen (Read, Write, Edit, Bash, etc.) | ~800–1.200 |
| CLAUDE.md Inhalt (global + Projekt) | Variiert — kann 0 bis 4.000+ sein |
| Kompetenz-Beschreibungen (`.claude/skills/`) | ~50–200 pro Kompetenz |
| Regel-Dateien (`.claude/rules/`) | Variiert |
| MCP-Tool-Beschreibungen | ~100–500 pro Server |
| Sitzungskontext (cwd, git status, platform) | ~100–300 |
| **Total mit vollständiger Konfiguration** | **bis zu ~5.000–8.000 Tokens** |

Nichts davon ist im Terminal für Sie sichtbar. Die Fragmente werden vor Ihrer ersten Nachricht eingespritzt.

---

## Was das SDK lädt

Ohne explizite Konfiguration lädt das SDK (Paket `anthropic` mit Standard `messages.create`) keinen Claude Code Kontext — es verhält sich wie ein einfacher API-Aufruf. Kein CLAUDE.md, keine Kompetenzen, keine Tool-Beschreibungen über das hinaus, was Sie explizit übergeben.

Um den CLI-äquivalenten Systemprompt vom SDK zu laden:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system=[
        {
            "type": "text",
            "text": "Your custom instructions here"
        }
    ],
    messages=[{"role": "user", "content": "Do X"}]
)
```

Um die Claude Code Voreinstellung zu laden (enthält Tool-Beschreibungen und Basis-Prompt):

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system={"type": "preset", "preset": "claude_code"},
    messages=[{"role": "user", "content": "Do X"}]
)
```

Um auch Projekteinstellungen aus `.claude/settings.json` zu laden, fügen Sie hinzu:

```python
extra_headers={"X-Setting-Sources": "project"}
```

---

## Verhaltensunterschiede auf einen Blick

| Verhalten | CLI | SDK (Standard) | SDK + Voreinstellung |
|---|---|---|---|
| CLAUDE.md geladen | Ja | Nein | Nein (manuell hinzufügen) |
| Tool-Nutzung aktiviert | Ja | Erfordert explizite Tools | Ja |
| Kompetenz-Beschreibungen | Ja | Nein | Nein |
| Regel-Dateien | Ja | Nein | Nein |
| Session git Kontext | Ja | Nein | Nein |
| Basis-Sicherheitsanweisungen | Ja | Ja | Ja |
| MCP-Tool-Beschreibungen | Ja (wenn konfiguriert) | Nein | Nein |
| Kosten vs CLI-Sitzung | Referenz | ~40–70% niedriger | ~80–95% der CLI |

---

## Das `--bare` Flag

`claude -p "task" --bare` überspringt alle Projektermittlung auf CLI-Ebene:

- Kein CLAUDE.md Laden
- Keine `.claude/settings.json` Ermittlung
- Keine MCP-Server Verbindungen
- Kein Kompetenzen Laden

Das Ergebnis ist eine CLI-Invokation, die sich wie ein direkter SDK-Aufruf verhält, mit der CLI UX-Schicht oben drauf. Die Startzeit sinkt auf warmen Systemen von ~2–3 Sekunden auf ~200ms.

Verwenden Sie `--bare` für:
- Hochfrequente Automatisierungsskripte, die Claude über CLI aufrufen
- SDK-ähnliche Integrationen, die zufällig die CLI-Binärdatei verwenden
- Testen Sie Prompts isoliert ohne Projekt-Kontextbeeinträchtigung

Verwenden Sie `--bare` nicht für:
- Interaktive Entwicklungssitzungen (Sie verlieren CLAUDE.md, Kompetenzen, Regeln)
- Workflows, die Zugriff auf Projekt-MCP-Server benötigen

---

## Keine Determinismus-Garantie

Es gibt keine äquivalente `seed` Parameter für Claude Code oder die Claude API. Bei temperature=0 sind Antworten praktisch konsistent, aber nicht garantiert über API-Aufrufe identisch. Dies ist eine fundamentale Modell-Eigenschaft — nicht ein Konfigurationsproblem, und nicht etwas, das `--bare` oder die Voreinstellung löst.

Wenn Ihre Automatisierung auf deterministischer Ausgabe angewiesen ist:
- Verwenden Sie strukturierte Ausgabe mit definierten JSON-Schemata
- Validieren Sie Ausgaben gegen ein Schema, anstatt rohen Text zu vergleichen
- Bauen Sie idempotente Pipelines, die Variation in Formulierungen tolerieren

---

## Startup-Latenz-Referenz

| Modus | Typischer kalter Start | Typischer warmer Start |
|---|---|---|
| `claude` (vollständige CLI) | 3–5 Sekunden | 1–2 Sekunden |
| `claude -p "x"` (Druck-Modus) | 2–4 Sekunden | 1–1,5 Sekunden |
| `claude -p "x" --bare` | 0,3–0,5 Sekunden | 0,1–0,2 Sekunden |
| SDK `messages.create` | ~100–200ms (Netzwerk) | ~100ms (Netzwerk) |

Bare CLI-Modus ist die richtige Wahl, wenn Sie die Claude Code-Binärdatei benötigen, aber sich um Latenz kümmern. Das SDK ist noch schneller, wenn Sie die CLI gar nicht brauchen.

---
