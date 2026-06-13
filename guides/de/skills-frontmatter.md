# Kompetenz-Frontmatter-Referenz

Vollständige Referenz für alle YAML-Frontmatter-Felder in Claude Code-Kompetenzdateien. Frontmatter steuert Aktivierungsabgleich, automatische Invokation, Anstrengungsstandardwerte, und ob die Kompetenz einen Modellaufruf überhaupt auslöst.

---

## Erforderliche Felder

### `name`

**Typ :** `string` (kebab-case)
**Erforderlich :** Ja

Der Identifikator, der zur Schrägstrich-Befehl wird. `name: fastapi-crud` → `/fastapi-crud`.

```yaml
name: fastapi-crud
```

Regeln:
- Muss eindeutig über alle Kompetenzdateien im Scope (Projekt + global) sein
- Nur Kebab-case — keine Unterstriche, keine Punkte
- Halten Sie es kurz genug zum Tippen ohne Autoergänzungsreibung

---

### `description`

**Typ :** `string`
**Erforderlich :** Ja
**Zeichenlimit :** Zählt zur gemeinsamen Grenze von 1.536 Zeichen mit `when_to_use`

Das primäre Signal, das Claude für semantisches Matching nutzt — sowohl für Auto-Invokation als auch zum Reagieren auf Benutzer-Schrägstrich-Befehle. Schreiben Sie dies als explizite Aktivierungsbedingung, nicht als Fähigkeitszusammenfassung.

```yaml
description: "FastAPI-Endpunkt-Erstellung mit Pydantic-Validierung, asynchronen Route-Handlern und Dependency Injection. Aktivieren Sie für neue API-Routen, Request-Modelldefinitionen oder Background-Task-Setup."
```

Schlecht: `"Eine Kompetenz für FastAPI."` — zu vage, schlechtes Matching-Signal.
Gut: das Beispiel oben — Technologie + Aufgabentyp + spezifische Unteraufgaben.

---

## Optionale Felder

### `when_to_use`

**Typ :** `string`
**Zeichenlimit :** Gemeinsame Grenze von 1.536 Zeichen mit `description`

Zusätzlicher Aktivierungskontext an `description` in der Kompetenzbewertung angehängt. Verwendung für Trigger-Bedingungen, die zu ausführlich für die Beschreibung sind, aber die Matching-Präzision verbessern.

```yaml
when_to_use: "Aktivieren Sie, wenn der Benutzer FastAPI, async Python API, Pydantic-Modelle erwähnt, oder in einem Projekt mit main.py mit app = FastAPI() definiert arbeitet."
```

Behandeln Sie `description` als Headline und `when_to_use` als erweiterten Matching-Kontext. Beide zählen zu derselben 1.536-Zeichen-Grenze — budgetieren Sie entsprechend.

---

### `paths`

**Typ :** `array` von Glob-Strings
**Standard :** Keine (Kompetenz wird nie automatisch durch Datei-Kontext aktiviert)

Auto-aktiviert die Kompetenz, wenn Claude eine Datei berührt, die einem gelisteten Muster entspricht. Nützlich für Test-Utilities, Config-Datei-Helfer, und Schema-Tools, die stillschweigend laden sollten, wenn Claude spezifische Dateien öffnet.

```yaml
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**"
  - "**/jest.config.*"
```

Notizen:
- Matching erfolgt gegen den Dateipfad, den Claude derzeit liest oder bearbeitet, nicht das Arbeitsverzeichnis
- Kompetenzen mit `paths:` aktivieren stillschweigend — der Benutzer sieht keine Schrägstrich-Befehls-Invokation
- Mehrere Kompetenzen können gleichzeitig über `paths:` aktivieren — es gibt keine Konfliktlösung; alle aktivierten Kompetenzen werden geladen

---

### `effort`

**Typ :** `string` — `"low"` | `"medium"` | `"high"` | `"xhigh"`
**Standard :** Erbt von der aktiven Anstrengungseinstellung der Sitzung

Überschreibt die Anstrengungsstufe für Sitzungen, in denen diese Kompetenz aktiv ist. Verwenden Sie `"xhigh"` für Kompetenzen, die Sicherheitsanalyse, Architekturentscheidungen oder jede Aufgabe beinhalten, bei der das Übersehen einer subtilen Einschränkung echte Konsequenzen hat.

```yaml
effort: xhigh
```

| Wert | Geeignet für |
|---|---|
| `"low"` | Umformatierung, Umbenennung, Boilerplate-Generierung, einfache Klassifizierung |
| `"medium"` | Routine-Feature-Implementierung, einfache Refactorings |
| `"high"` | Komplexe Feature-Arbeit, Multi-Datei-Änderungen mit Abhängigkeiten |
| `"xhigh"` | Sicherheitsüberprüfung, Architekturentscheidungen, Debugging tiefer Probleme |

---

### `shell`

**Typ :** `string`
**Standard :** `"bash"`

Überschreibt den Shell-Interpreter für Script-Blöcke innerhalb der Kompetenz. Nur relevant für Windows-spezifische Kompetenzen, wo PowerShell erforderlich ist.

```yaml
shell: powershell
```

Lassen Sie dies ungesetzt für jede Kompetenz, die auf macOS, Linux, oder Cross-Platform-Umgebungen abzielt.

---

### `disable-model-invocation`

**Typ :** `boolean`
**Standard :** `false`

Wenn `true`, löst das Aktivieren der Kompetenz keine Modell-Antwort aus. Der Kompetenzkörper wird als Direktive in den Kontext geladen, und das Modell wendet es auf nachfolgende Interaktionen an, anstatt eine sofortige Antwort zu generieren.

```yaml
disable-model-invocation: true
```

Verwenden Sie für:
- Kompetenzen, die Verhalten konfigurieren, ohne "zu antworten" (z.B. `always-use-typescript` Stil-Direktiven)
- Kompetenzen, die Kontext passiv injizieren (z.B. eine Kompetenz, die Projektkonventionen in den Kontext lädt, ohne darauf einzuwirken)

---

## Zeichenbudget

Die Kompetenzbewertung für Automatic-Invokation-Matching hat eine harte Grenze:

| Feld | Budget |
|---|---|
| `description` + `when_to_use` kombiniert | 1.536 Zeichen |
| Voller Kompetenzkörper (bei Match geladen) | ~15.000 Zeichen |

**Strategie :** Setzen Sie dichte, schlüsselwortreiche Aktivierungstrigger in `description` und `when_to_use`. Setzen Sie detaillierte Anweisungen, Code-Beispiele, und Muster in den Kompetenzkörper. Der Körper wird nur nach dem Match geladen — es beeinflusst die Matching-Performance nicht.

---

## Monorepo-Erkennung

Kompetenzen gehen **nicht** den Verzeichnisbaum hinauf. Dies ist die häufigste Verwirrungs-Quelle bei der Migration aus CLAUDE.md-Mustern.

| Funktionalität | Baum hinaufgehen? |
|---|---|
| `CLAUDE.md` | Ja — vom aktuellen Datei zur Repo-Wurzel |
| `.claude/rules/` | Nein — nutzt `paths:` Frontmatter-Matching |
| `.claude/skills/` | Nein — nur Kompetenzen im nächsten `.claude/skills/` sind aktiv |
| `~/.claude/skills/` | Immer aktiv egal welches Verzeichnis |

In einem Monorepo:
- Globale Kompetenzen (`~/.claude/skills/`) sind überall verfügbar
- Root-level `.claude/skills/` Kompetenzen sind nur von der Repo-Wurzel verfügbar
- Package-level `.claude/skills/` Verzeichnisse sind für paket-spezifische Kompetenzen erforderlich

---

## Vollständiges Frontmatter-Beispiel

```yaml
---
name: drizzle-orm
description: "Drizzle ORM Schema-Definition, Query-Building, und Neon Postgres Integration in TypeScript. Aktivieren Sie für Datenbankschema-Arbeit, ORM-Abfrage-Muster, oder Migrations-Erstellung."
when_to_use: "Verwenden Sie beim Arbeiten mit drizzle.config.ts, schema.ts Dateien, db/ Verzeichnis, oder wenn der Benutzer Drizzle, Neon, oder Datenbankmigration in einem TypeScript-Projekt erwähnt."
paths:
  - "**/schema.ts"
  - "**/drizzle.config.ts"
  - "db/**"
  - "**/migrations/**"
effort: high
---

# Drizzle ORM

## Wann aktivieren
...
```

---

## Zusammenfassung der Feld-Kompatibilität

| Feld | Erforderlich | Auto-Invokation-Effekt | Manuelle Invokation-Effekt |
|---|---|---|---|
| `name` | Ja | Schrägstrich-Befehl Name | Primärer Identifikator |
| `description` | Ja | Primäres Matching-Signal | Im Kompetenzbewertung gezeigt |
| `when_to_use` | Nein | Sekundäres Matching-Signal | Im Kompetenzbewertung gezeigt |
| `paths` | Nein | Datei-basierte Auto-Aktivierung | Kein Effekt |
| `effort` | Nein | Setzt Anstrengung wenn Kompetenz aktiviert | Setzt Anstrengung wenn Kompetenz aktiviert |
| `shell` | Nein | Kein Effekt auf Matching | Ändert Script-Interpreter |
| `disable-model-invocation` | Nein | Keine Antwort generiert | Keine Antwort generiert |

---
