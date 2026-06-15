---
name: freshness-auditor
description: "Führen Sie Frischeaudits durch und generieren Sie priorisierte Aktualisierungslisten für die Inhaltswartung"
updated: 2026-06-15
---

# Audit der Frische

## Wann man es aktiviert

- **Vor Zertifizierungserneuerung** — Audit von Claudient-Inhalten, um sicherzustellen, dass alle Dateien aktuell und verteidigbar sind
- **Vor dem Veröffentlichen einer neuen Version oder größeren Aktualisierung** — Überprüfen der Dokumentationsgenauigkeit
- **Quartalsweise Wartung** — Identifizierung von veralteten Inhalten, die aktualisiert werden müssen (alle 3 Monate)
- **Nach einer großen Claude-Modellversion** — Markieren Sie möglicherweise veraltete Anleitungen in Fähigkeiten und Workflows
- **Bedarfsgesteuerte Inhaltsaudits** — Wenn Sie die allgemeine Inhaltsgesundheit bewerten möchten, ohne auf den vierteljährlichen Sprint zu warten

## Wann NICHT zu verwenden

- Für die Echtzeit-Frische-Überwachung (verwenden Sie stattdessen CI-Checks mit `check-freshness.js`)
- Zur Validierung bestimmter externer Links (verwenden Sie ein spezielles Link-Checker-Tool)
- Um Inhalte umzuschreiben (verwenden Sie stattdessen `/workflows/freshness-refresh`, das Review-Agenten startet)
- Um Stilkonsistenz zu erzwingen (verwenden Sie Linting-Regeln und die `code-review`-Fähigkeit)

## Anleitung

### Schritt 1: Audit der Frische ausführen

Führen Sie das Frische-Check-Skript aus:

```bash
node scripts/check-freshness.js
```

Dies scannt alle `skills/` und `agents/` Verzeichnisse nach Dateien mit einem `updated:` Datum im YAML-Präambel. Es kennzeichnet Dateien, die älter als 6 Monate sind, als veraltet und Dateien ohne Datum ganz.

Die Ausgabe enthält:
- Anzahl der frischen, veralteten und nicht datierten Dateien
- Liste veralteter Dateien mit ihrem letzten Aktualisierungsdatum
- Liste von Dateien, denen ein `updated:` Feld fehlt

### Schritt 2: Detaillierten Bericht generieren

Für eine detailliertere Aufschlüsselung nach Kategorie und Priorität:

```bash
node scripts/generate-refresh-report.js > FRESHNESS_REPORT.md
```

Dies erzeugt einen Markdown-Bericht mit:
- Frische vs. veraltete Anzahl nach Kategorie (Fähigkeiten, Agenten, Anleitungen, Workflows)
- Dateien nach Alter sortiert (älteste zuerst)
- Geschätzte Zeit zum Aktualisieren jeder Datei
- Tier 1/2/3 Kategorisierung für Priorisierung

### Schritt 3: Nach Auswirkungen kategorisieren

Lesen Sie den Freshness-Bericht und sortieren Sie Dateien in Tiers:

**Tier 1 (Kritisch — sofort aktualisieren):**
- Kern-Debugging- und Test-Fähigkeiten
- Häufig referenzierte Anleitungen (Erste Schritte, konzeptionelle Grundlagen)
- Wesentliche Agent-Definitionen in Workflows verwendet
- Alle Dateien älter als 12 Monate

Diese Dateien befinden sich auf kritischen Pfaden; Veraltung könnte Benutzer irreführen oder Workflows unterbrechen.

**Tier 2 (Wichtig — innerhalb von 2 Wochen aktualisieren):**
- Domänenspezifische Fähigkeiten (Frontend, Backend, DevOps usw.)
- Stack-spezifische Anleitungen und Workflows
- Sekundäre Agent-Definitionen
- Dateien im Alter von 6–12 Monaten in aktiven Bereichen

Diese werden regelmäßig referenziert, sind aber weniger kritisch als Tier 1.

**Tier 3 (Optional — überprüfen, kann unverändert bleiben):**
- Archivierte oder veraltete Fähigkeiten
- Selten verwendete Agent-Definitionen
- Historische Beispiele und Fallstudien
- Zeitlose konzeptionelle Anleitungen, die sich wahrscheinlich nicht ändern

Diese müssen möglicherweise nicht aktualisiert werden, wenn der Inhalt immer noch korrekt ist.

### Schritt 4: Inhaltsgenauigkeit bewerten (manuelles Review)

Führen Sie für jede Tier-1-Datei eine schnelle Genauigkeitsprüfung durch:

```markdown
Datei: [Pfad]
Zuletzt aktualisiert: [Datum]
Alter: [N Monate]

Schnelle Genauigkeitsprüfung:
- [ ] Alle Befehlsbeispiele funktionieren immer noch in aktuellem Claude Code
- [ ] Tool-Namen und Funktionen sind immer noch vorhanden
- [ ] Keine Verweise auf veraltete Funktionen oder alte Modellversionen
- [ ] Externe Links (falls vorhanden) sind nicht 404
- [ ] Code-Syntax ist aktuell (nicht mit veralteten APIs)

Status: [Frisch | Kleinere Aktualisierungen erforderlich | Größere Umschreibung erforderlich]
```

Wenn >30% des Dateiinhalts ungenau oder veraltet ist, markieren Sie ihn zur umfassenden Überprüfung im nächsten vierteljährlichen Zyklus.

### Schritt 5: Priorisierte Aktualisierungsliste erstellen

Erstellen Sie eine Textdatei mit Ihren Erkenntnissen:

```markdown
# Ergebnisse des Frische-Audits — [DATUM]

## Zusammenfassung
- Gescannte Dateien insgesamt: X
- Frisch (< 6 Monate): X
- Veraltet (≥ 6 Monate): X
- Fehlende Daten: X

## Tier 1 (Sofort aktualisieren)
- [Dateipfad] — zuletzt aktualisiert [Datum], [N] Monate
- ...

## Tier 2 (Innerhalb von 2 Wochen aktualisieren)
- [Dateipfad] — zuletzt aktualisiert [Datum], [N] Monate
- ...

## Tier 3 (Optionaler Überblick)
- [Dateipfad] — zuletzt aktualisiert [Datum], [N] Monate
- ...

## Dateien, die eine größere Umschreibung benötigen
- [Dateipfad] — [Grund: veraltete Beispiele, veraltete Funktionen, etc.]

## Nächste Schritte
1. Weisen Sie Tier-1-Dateien Review-Agenten zu
2. Planen Sie Tier-2-Überprüfung für Sprint-Backlog
3. Archivieren oder veralten Sie Tier-3-Dateien, wenn nicht mehr relevant
4. Führen Sie den vollständigen `/workflows/freshness-refresh` aus, um Aktualisierungen zu koordinieren
```

### Schritt 6: Über nächste Aktion entscheiden

Basierend auf Audit-Ergebnissen:

- **Wenn <10% veraltet:** Inhalte sind gesund. Aktualisieren Sie normal im vierteljährlichen Zyklus.
- **Wenn 10–30% veraltet:** Planen Sie einen gezielten Aktualisierungs-Sprint für Tier-1- und Tier-2-Dateien in den nächsten 2 Wochen.
- **Wenn >30% veraltet:** Kritisches Gesundheitsproblem. Führen Sie `/workflows/freshness-refresh` sofort aus, um alle Agenten parallel zu aktualisieren.
- **Wenn Dateien >12 Monate alt sind:** Zur sofortigen Überprüfung eskalieren.

---

## Beispiel

### Szenario: Vor-Zertifizierungs-Audit

Vor der Zertifizierung von Claudient als Produktionswerkzeug möchten Sie sicherstellen, dass alle Inhalte aktuell sind.

### Ausführung:

```bash
# Schritt 1: Führen Sie die Freshness-Überprüfung aus
node scripts/check-freshness.js

# Ausgabe:
# Frische-Check: 847 Dateien gescannt (veralteter Schwellenwert: 6 Monate)
#   Frisch:  621
#   Veraltet:  156
#   Kein Datum: 70
```

156 veraltete Dateien und 70 fehlende Daten — Zeit zur Behebung vor der Zertifizierung.

```bash
# Schritt 2: Detaillierten Bericht generieren
node scripts/generate-refresh-report.js > FRESHNESS_REPORT.md

# Überprüfen Sie den Bericht und kategorisieren Sie:
# Tier 1 (Kernfähigkeiten): 32 Dateien
# Tier 2 (Domänenfähigkeiten, Workflows): 89 Dateien
# Tier 3 (Archiviert, Beispiele): 35 Dateien
```

### Entscheidung:

Basierend auf dem Audit entscheidet das Team:
- Tier-1-Dateien (32) müssen vor der Zertifizierungsgenehmigung aktualisiert werden — 4 Agenten zuweisen, 2 Stunden
- Tier-2-Dateien (89) können in 2-wöchige Sprints eingeteilt werden — 3 Agenten im Rotationsbetrieb
- Tier-3-Dateien (35) sind archiviert/veraltet — mit der Markierung „archiviert" im Präambel kennzeichnen, keine Aktualisierung erforderlich

### Nächster Schritt:

Starten Sie einen gezielten Aktualisierungs-Workflow nur für Tier-1-Dateien:

```bash
# (Verwendet den freshness-refresh-Workflow mit --tier 1-Flag)
```

Dies gewährleistet Zertifizierungsbereitschaft, ohne den gesamten Backlog zu blockieren.

---

## Verwandter Inhalt

- `/guides/content-freshness` — SLA, Veraltungsschwellen und was pro Inhaltstyp zu überprüfen ist
- `/workflows/freshness-refresh` — vollständiger vierteljährlicher Wartungs-Sprint (nutzt dieses Audit als Eingabe)
- `/scripts/check-freshness.js` — Haupt-CLI zur Frische-Erkennung
- `/scripts/generate-refresh-report.js` — generiert den detaillierten Frische-Bericht

---
