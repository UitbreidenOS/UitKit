# Referenz zum Agent-Frontmatter

Jede Claude Code Agent-Datei beginnt mit einem YAML-Frontmatter-Block. Dieser Block steuert Identität, Routing, Modellauswahl, Ausführungsverhalten, Werkzeugzugriff und Anzeige. Diese Referenz behandelt alle unterstützten Felder mit Typen, Standardwerten und Verwendungsleitlinien.

---

## Erforderliche Felder

### `name`

**Typ:** `string` (Kebab-case)
**Erforderlich:** Ja

Der Bezeichner, der verwendet wird, um diesen Agent programmgesteuert zu erzeugen. Muss eindeutig in allen Agent-Dateien des Projekts sein.

```yaml
name: security-auditor
```

Verwendet in:
```python
Agent(subagent_type="security-auditor", prompt="...")
```

Halten Sie Namen kurz, aussagekräftig und mit Bindestrichen. Vermeiden Sie Versionsnummern oder Umgebungssuffixe im Namen — verwenden Sie stattdessen separate Dateien.

---

### `description`

**Typ:** `string`
**Erforderlich:** Ja
**Empfohlene maximale Länge:** 200 Zeichen

Einzeilige Beschreibung der Domäne und des Zwecks des Agenten. Wird von Claudes Router für automatische Delegationsentscheidungen verwendet — dies ist das primäre Signal, das bestimmt, wann dieser Agent ausgewählt wird.

```yaml
description: "Überprüft Code auf OWASP Top 10-Sicherheitslücken, geheime Exposition und Injektionsrisiken. Aktivieren Sie für Sicherheitsüberprüfungen vor jedem PR."
```

Schreiben Sie dies, als würden Sie Claude erklären, wann hier delegiert werden soll. Spezifische Triggerbedingungen übertreffen generische Funktionsbeschreibungen. Schlecht: `"Ein Sicherheitsagent."` Gut: `"Aktivieren Sie beim Überprüfen von Authentifizierungscode, API-Endpunkten oder vor der Zusammenführung von PRs, die Geheimnisse, Sitzungen oder Benutzereingabehandlung berühren."`

---

## Modellfelder

### `model`

**Typ:** `string` — einer von `"haiku"`, `"sonnet"`, `"opus"`
**Standard:** Erbt vom aktiven Modell der übergeordneten Sitzung

Setzt das für das Kontextfenster dieses Agenten verwendete Modell außer Kraft. Beeinflusst nicht die übergeordnete Sitzung.

```yaml
model: opus
```

| Wert | Wann zu verwenden |
|-------|-------------|
| `"haiku"` | Mechanische Aufgaben: Neuformatierung, Umbenennung, einfache Klassifizierung, Boilerplate-Generierung. ~60% Kosteneinsparung vs. Sonnet. |
| `"sonnet"` | Standard-Entwicklungsarbeit. Gute Balance zwischen Geschwindigkeit und Denkfähigkeit. |
| `"opus"` | Komplexes Denken: Sicherheitsanalyse, Architekturentscheidungen, mehrdeutige Anforderungen, mehrdatei-Refactorings mit subtilen Einschränkungen. |

Verwenden Sie niemals `"haiku"` für Aufgaben, die Urteilsvermögen erfordern — Sicherheitsanalyse, Architekturentscheidungen oder alles, bei dem eine falsche Antwort nachgelagerte Folgen hat.

---

## Ausführungsfelder

### `background`

**Typ:** `boolean`
**Standard:** `false`

Wenn `true`, wird der Agent immer als nicht-blockierende Hintergrundaufgabe ausgeführt. Die übergeordnete Sitzung wird sofort fortgesetzt, ohne auf die Fertigstellung des Agenten zu warten.

```yaml
background: true
```

Verwenden Sie wenn:
- Die Ausgabe des Agenten wird vor dem nächsten Schritt des übergeordneten Agenten nicht benötigt
- Sie mehrere spezialisierte Agenten parallelisieren
- Die Aufgabe Observability/Logging ist (Audit-Logs, Metrik-Schreibvorgänge) und nicht Entscheidungsfindung

Vermeiden Sie wenn:
- Der übergeordnete Agent die Ergebnisse des Agenten benötigt, um seinen nächsten Schritt zu bestimmen
- Der Agent Dateien schreibt, die der übergeordnete Agent sofort liest

---

### `isolation`

**Typ:** `string` — `"worktree"` oder nicht vorhanden
**Standard:** Keine (Agent wird im aktuellen Arbeitsverzeichnis ausgeführt)

Wenn auf `"worktree"` gesetzt, erstellt Claude Code einen temporären Git-Arbeitsbaum für den Agenten. Der Agent arbeitet auf einer isolierten Kopie des Repositorys. Wenn der Agent keine Änderungen vornimmt, wird der Arbeitsbaum nach Abschluss automatisch bereinigt.

```yaml
isolation: worktree
```

Verwenden Sie wenn:
- Der Agent explorative Änderungen vornimmt, die das Arbeitsverzeichnis nicht beeinflussen sollten, es sei denn, sie werden explizit zusammengeführt
- Mehrere Agenten laufen parallel und dürfen nicht bei denselben Dateien in Konflikt geraten
- Sie einen sauberen Rollback-Pfad möchten, falls die Änderungen des Agenten unbefriedigend sind

**Achtung:** Erfordert ein Git-Repository. In nicht-Git-Verzeichnissen schlägt die Erstellung des Arbeitsbaums stillschweigend fehl und der Agent wird gegen die Arbeitskopie ausgeführt.

---

## Eingabeaufforderungsfelder

### `initialPrompt`

**Typ:** `string`
**Standard:** Keine

Ein String, der automatisch als erste Benutzereingabe eingereicht wird, wenn der Agent als eigenständige Sitzung ausgeführt wird (nicht als Subagent). Hat keine Auswirkung, wenn der Agent über `Agent(subagent_type="...")` erzeugt wird.

```yaml
initialPrompt: "Sie starten eine Sicherheitsüberprüfungssitzung. Beginnen Sie, indem Sie alle Dateien in /src/auth/ auflisten und Einstiegspunkte identifizieren, die externe Eingaben akzeptieren."
```

Verwenden Sie für Agenten, die als Projekteinstiegspunkte oder interaktive Assistenten dienen, die Benutzer direkt starten, anstatt durch einen übergeordneten Orchestrator.

---

## Anzeigefelder

### `color`

**Typ:** `string` — CSS-Farbname oder Hexadezimalwert
**Standard:** Keine (verwendet Terminal-Standard)

Legt die Anzeigefarbe für die Ausgabe dieses Agenten in der CLI fest. Rein kosmetisch — hat keine Auswirkung auf das Verhalten.

```yaml
color: "#ff4444"
```

Nützlich beim Ausführen mehrerer Agenten parallel und Sie müssen ihre Ausgabeströme visuell unterscheiden. Akzeptiert standardmäßige CSS-Farbnamen (`"red"`, `"dodgerblue"`) oder Hexadezimal-Strings (`"#ff4444"`).

---

## Hook-Felder

### `hooks`

**Typ:** `object`
**Standard:** Keine

Definiert Hooks, die ausschließlich auf diesen Agenten beschränkt sind. Gleiche Struktur wie Session-Level-Hooks in `settings.json`. Hier definierte Hooks werden nur ausgelöst, wenn dieser Agent aktiv ist — sie beeinflussen nicht die übergeordnete Sitzung oder andere Agenten.

```yaml
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "${CLAUDE_PROJECT_DIR}/.claude/hooks/validate-changes.sh"
```

Alle Standard-Hook-Events werden unterstützt: `SessionStart`, `PreToolUse`, `PostToolUse`, `PreCompact`, `PostCompact`, `Stop`, `Notification`.

Verwenden Sie für:
- Protokollierung der Agent-Fertigstellung in Audit-Dateien
- Validierung von Dateien, die der Agent schreibt, bevor die übergeordnete Sitzung sie liest
- Senden von Benachrichtigungen, wenn ein länger laufender Agent fertig wird

---

## Werkzeug-Einschränkungsfelder

### `tools`

**Typ:** `array` von `string`
**Standard:** Alle verfügbaren Werkzeuge (erbt von Session-Berechtigungen)

Beschränkt den Agenten nur auf die aufgelisteten Werkzeuge. Jeder Werkzeugaufruf, der nicht in dieser Liste enthalten ist, wird blockiert.

```yaml
tools:
  - Read
  - Grep
  - Glob
  - Bash
```

Werkzeugbeschränkung ist ein Sicherheits- und Fokus-Mechanismus. Ein reiner Lese-Recherche-Agent sollte nicht Write oder Edit haben. Ein Formatierungs-Agent benötigt kein WebSearch.

**Wichtige Achtung:** Werkzeugbeschränkungen gelten für die eigenen Aufrufe dieses Agenten. Sie verhindern nicht, dass der Agent einen von ihm erzeugten Subagenten anweist, unrestricted Werkzeuge zu verwenden. Wenn Sie einen Agenten aus Sicherheitsgründen einschränken, schränken Sie auch seine Sub-Subagenten separat ein.

Allgemeines Nur-Lese-Set: `["Read", "Grep", "Glob"]`
Allgemeines Analyse-Set: `["Read", "Grep", "Glob", "Bash"]`
Vollständiges Entwicklungs-Set: `["Read", "Write", "Edit", "Bash", "Grep", "Glob"]`

---

## Aufwandsfelder

### `effort`

**Typ:** `string` — einer von `"low"`, `"medium"`, `"high"`, `"xhigh"`
**Standard:** Erbt von der Aufwandseinstellung der übergeordneten Sitzung

Setzt die standardmäßige Aufwandsebene für das Kontextfenster dieses Agenten. Setzt die Session-Standard nur für diesen Agenten außer Kraft.

```yaml
effort: xhigh
```

| Wert | Wann zu verwenden |
|-------|-------------|
| `"low"` | Einfache Formatierer, Klassifizierer, mechanische Transformationen |
| `"medium"` | Routine-Entwicklungsaufgaben, einfache Refactorings |
| `"high"` | Komplexe Feature-Implementierung, mehrdatei-Änderungen |
| `"xhigh"` | Architekturentscheidungen, Sicherheitsaudits, Debugging tiefergehender Probleme, alles wobei ein fehltes Detail echte Konsequenzen hat |

Die Aufwandsebene beeinflusst, wie viel das Modell vor dem Antworten "denkt". Höherer Aufwand = mehr Tokens, mehr Latenz, gründlichere Ausgabe. Verwenden Sie `"low"` für kostensensitive mechanische Agenten und `"xhigh"` wenn Gründlichkeit wichtiger ist als Geschwindigkeit.

---

## Vollständiges Beispiel

Ein vollständig kommentierter Agent, der mehrere Felder kombiniert:

```yaml
---
name: security-auditor
description: "Überprüft Code auf OWASP Top 10-Sicherheitslücken, geheime Exposition und Injektionsrisiken. Aktivieren Sie für Sicherheitsüberprüfungen vor jedem PR."
model: opus
background: false
isolation: worktree
effort: xhigh
tools:
  - Read
  - Grep
  - Glob
  - Bash
hooks:
  Stop:
    - type: command
      command: echo "Security audit complete" | tee -a .claude/audit.log
color: "#ff4444"
---

# Security Auditor

## Purpose
Performs a structured security review against OWASP Top 10, secret exposure patterns,
and injection risk surfaces. Runs in an isolated worktree so exploratory file reads
do not affect the working tree.

## Instructions
...
```

---

## Feldkompatibilitätstabelle

| Feld | Subagent-Verwendung | Eigenständige Sitzung | Hinweise |
|-------|-------------|-------------------|-------|
| `name` | Erforderlich | Erforderlich | Verwendet in `Agent(subagent_type="name")` |
| `description` | Erforderlich | Erforderlich | Primäres Routing-Signal |
| `model` | Ja | Ja | Setzt das übergeordnete Modell für diesen Kontext außer Kraft |
| `background` | Ja | Nein | Nur aussagekräftig wenn als Subagent erzeugt |
| `isolation` | Ja | Ja | Erfordert Git-Repository |
| `initialPrompt` | Nein | Ja | Wird nur in eigenständigen Sitzungen ausgelöst |
| `color` | Ja | Ja | Rein kosmetisch |
| `hooks` | Ja | Ja | Auf diese Agent-Sitzung beschränkt |
| `tools` | Ja | Ja | Whitelist; blockiert alle nicht aufgelisteten Werkzeuge |
| `effort` | Ja | Ja | Setzt Session-Aufwand für diesen Kontext außer Kraft |

---

## Vorsichtsmaßnahmen

**`isolation: "worktree"` erfordert Git.** In nicht-Git-Verzeichnissen schlägt die Erstellung des Arbeitsbaums stillschweigend fehl und der Agent wird ohne Isolation gegen die Arbeitskopie ausgeführt. Stellen Sie sicher, dass Ihr Projekt ein Git-Repository ist, bevor Sie sich auf dieses Feld für Sicherheit verlassen.

**`background: true` Agenten sind aus Sicht des übergeordneten Agenten "Fire-and-Forget".** Der übergeordnete Agent wird sofort fortgesetzt. Wenn Sie die Ausgabe des Agenten zur Entscheidungsfindung benötigen, verwenden Sie nicht `background: true`. Verwenden Sie es nur für Aufgaben, bei denen das Ergebnis asynchron verbraucht wird (Logs, Benachrichtigungen, Nebenwirkungen).

**`model: "haiku"` ist eine Kostenoptimierung, keine Funktionsverschlechterung für einfache Aufgaben.** Für mechanische Arbeiten — Neuformatierung, einfache Umbenennung, Boilerplate-Generierung — funktioniert Haiku äquivalent zu Sonnet bei ~60% niedrigeren Kosten. Verwenden Sie Haiku nicht für Sicherheitsanalyse, Architekturentscheidungen oder Aufgaben, bei denen sich subtile Fehler zusammensetzen. Der Kostenunterschied ist das Qualitätsrisiko nicht wert.

**Werkzeugbeschränkungen sind kein Sandbox.** Sie blockieren die direkten Werkzeugaufrufe des Agenten. Ein Agent, dem befohlen wird, Sub-Subagenten zu erzeugen, kann unrestricted Werkzeugzugriff an diese Sub-Subagenten weitergeben, es sei denn, Sie schränken diese auch ein. Für echte Sicherheitsgrenzen schränken Sie jede Schicht des Agent-Baums separat ein.

**`description` ist das wichtigste Feld nach `name`.** Der Router verwendet es, um zu entscheiden, wann hier delegiert werden soll. Eine vage oder generische Beschreibung verursacht Routing-Fehler — entweder wird der Agent ausgelöst, wenn er es nicht sollte, oder er wird nie ausgewählt. Schreiben Sie die Beschreibung als explizite Triggerbedingung, nicht als Fähigkeitszusammenfassung.

---
