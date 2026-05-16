> 🇩🇪 Deutsche Version. [Englische Version](CONTRIBUTING.md).

# Zu Claudient beitragen

Claudient wächst durch Beiträge der Community. Wenn Sie einen Skill, einen Agent, einen Hook, einen Workflow oder einen Prompt haben, der Claude Code für Sie spürbar verbessert hat — gehört er hierher.

---

## Was beigetragen werden kann

| Typ | Speicherort | Beschreibung |
|---|---|---|
| Skill | `skills/<category>/` | Ein Slash-Befehl, der domänenspezifisches Verhalten aktiviert |
| Agent | `agents/<category>/` | Eine spezialisierte Subagent-Definition |
| Hook | `hooks/<trigger>/` | Eine ereignisgesteuerte Automatisierung |
| Rule | `rules/common/` oder `rules/<language>/` | Eine immer einzuhaltende Richtlinie |
| Workflow | `workflows/` | Ein End-to-End-Mehrschritteprozess |
| Prompt | `prompts/<category>/` | Eine wiederverwendbare Prompt-Vorlage |
| Guide | `guides/` | Ein ausführliches Dokumentationsstück |
| Übersetzung | `guides/<lang>/` | Eine Übersetzung eines bestehenden englischen Guides |

---

## Qualitätsanforderungen

Überprüfen Sie vor der Einreichung, ob Ihr Beitrag die Anforderungen erfüllt:

**Skills**
- [ ] Hat einen klaren Abschnitt „When to activate" mit konkreten Auslösebedingungen
- [ ] Hat einen Abschnitt „When NOT to use" mit mindestens einem Anti-Pattern
- [ ] Enthält mindestens ein konkretes Beispiel
- [ ] Verweist auf tatsächliche Claude Code-Funktionen — keine generischen LLM-Ratschläge
- [ ] Sie haben es in mindestens einer echten Sitzung getestet

**Agents**
- [ ] Gibt eine Teilmenge von Tools an (nicht alle Tools)
- [ ] Enthält Modellempfehlungen (Haiku / Sonnet / Opus) mit Begründung
- [ ] Enthält ein konkretes Anwendungsbeispiel

**Hooks**
- [ ] Enthält den genauen JSON-Ausschnitt für `settings.json`
- [ ] Enthält das Skript (falls zutreffend) mit Einrichtungsanweisungen
- [ ] Beschreibt klar, was es auslöst und was es tut

**Guides**
- [ ] Für erfahrene Entwickler geschrieben
- [ ] Keine Platzhalterabschnitte
- [ ] Entspricht dem aktuellen Verhalten von Claude Code

---

## Skill-Vorlage

Kopieren Sie dies beim Hinzufügen eines neuen Skills:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns]

## Instructions
[Skill content]

## Example
[Concrete example]
```

---

## Dateibenennung

- Verwenden Sie `kebab-case.md` für alle Markdown-Dateien
- Verwenden Sie `kebab-case.sh` oder `kebab-case.py` für Skripte
- Legen Sie Dateien im richtigen Unterverzeichnis ab — lesen Sie `README.md` für die Übersicht

---

## Eine PR einreichen

1. Forken Sie das Repository und erstellen Sie einen Branch: `git checkout -b add/fastapi-skill`
2. Fügen Sie Ihre Datei(en) gemäß dem oben beschriebenen Format hinzu
3. Wenn Sie einen neuen Guide auf Englisch hinzugefügt haben, vermerken Sie in der PR-Beschreibung, welche Übersetzungen benötigt werden
4. Öffnen Sie eine PR mit einem Titel wie: `add: FastAPI skill` oder `fix: token-optimization guide`
5. Füllen Sie die PR-Beschreibung aus — was es ist, warum es nützlich ist, wie Sie es getestet haben

---

## Übersetzungen

So übersetzen Sie einen bestehenden englischen Guide:

1. Kopieren Sie die englische Datei: `cp guides/getting-started.md guides/fr/getting-started.md`
2. Übersetzen Sie den Inhalt — lassen Sie alle Codeblöcke, Dateipfade und technische Begriffe auf Englisch
3. Reichen Sie eine PR mit dem Titel ein: `translate: getting-started guide (French)`

Unterstützte Sprachen: Englisch (primär), Französisch (`fr/`), Deutsch (`de/`), Niederländisch (`nl/`), Spanisch (`es/`).

---

## Was abgelehnt wird

- Inhalte, die eine bestehende Datei ohne klare Verbesserung duplizieren
- Vorläufige oder unvollständige Beiträge (Abschnitte mit „coming soon")
- Skills, die generisches LLM-Verhalten beschreiben statt Claude Code-spezifischer Funktionen
- Anwendungscode (dieses Repository enthält ausschließlich Dokumentation und Konfiguration)
- Alles, was gegen die Dateibenennungs- oder Formatkonventionen in `CLAUDE.md` verstößt

---

## Fragen

Öffnen Sie eine GitHub Discussion, wenn Sie unsicher sind, wo etwas hingehört, oder wenn Sie Feedback möchten, bevor Sie etwas erstellen. Issues sind für Bugs und konkrete Lücken in der Abdeckung gedacht.

---

## Mit uns arbeiten

Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte mit Entwickler-Communities und liefern B2B-KI-Lösungen. Wenn Sie über das Beitragen zu diesem Repository hinausgehen und tatsächlich KI-Produkte oder B2B-Lösungen mit uns entwickeln möchten, nehmen Sie Kontakt auf.

**[uitbreiden.com](https://uitbreiden.com/)**
