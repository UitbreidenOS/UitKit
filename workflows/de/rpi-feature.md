# RPI-Funktions-Workflow

Forschung, Plan, Implementiert — ein dreiphasiger Multi-Agent-Workflow zum Versenden von Funktionen mit strikter Umfangssteuerung. Jede Phase erzeugt ein konkretes Artefakt und muss abgeschlossen sein, bevor die nächste beginnt.

---

## Wann es verwenden

- Funktionsanforderungen, bei denen die Oberfläche am Anfang unklar ist
- Arbeit, die mehrere Dateien oder Services umfasst
- Jede Aufgabe, bei der ein schlechter Plan teurer ist als die zum Planen aufgewendete Zeit
- Situationen, bei denen mehrere Perspektiven (PM, UX, Engineering) vor der Codierung harmoniert werden sollten

---

## Phasen

### Phase 1 — Forschung (`/rpi:research`)

**Eingabe:** Rohe Funktionsanforderung (ein Satz bis ein Absatz)

**Agenten:**
- **Explore-Agent** — liest das existierende Codebase für Muster relevant zur Anforderung: ähnliche Funktionen, Datenmodelle, API-Formen, existierende Abstraktionen
- **Forschungs-Agent** — untersucht alle externen Abhängigkeiten: Dritt-APIs, Bibliotheken, Dokumentation, Bruch-Änderungen
- **Produkt-Manager-Agent** — synthetisiert Explorations- und Forschungs-Erkenntnisse in ein strukturiertes Anforderungsdokument und gibt eine GO/NO-GO-Empfehlung mit expliziter Begründung aus

**Tor:** Phase 2 kann nicht beginnen, bis der PM-Agent eine GO-Empfehlung ausgegeben hat. Wenn NO-GO zurückgegeben wird, erklärt die Ausgabe warum und schlägt eine überarbeitete Anforderung vor.

**Ausgabe:** `rpi/{feature-slug}/RESEARCH.md`

```markdown
# Forschung: {feature-slug}

## Anforderungen
[Strukturierte Liste abgeleitet von der Rohforderung]

## Codebase-Erkenntnisse
[Relevante existierende Muster, Einstiegspunkte, Modelle]

## Externe Erkenntnisse
[APIs, Bibliotheken, Kompatibilitäts-Notizen]

## Empfehlung
GO / NO-GO

## Begründung
[Warum — spezifisch, nicht generisch]
```

---

### Phase 2 — Plan (`/rpi:plan`)

**Vorbedingung:** `rpi/{feature-slug}/RESEARCH.md` existiert und enthält eine GO-Empfehlung.

**Agenten (parallel ausgeführt):**
- **PM-Agent** — schreibt User Stories und Akzeptanz-Kriterien aus den Anforderungen
- **UX-Agent** — kartiert den Benutzerfluss, Rand-Fälle, Fehler-Zustände und Barrierefreiheits-Überlegungen
- **Engineering-Agent** — erzeugt ein technisches Design: Dateien zum Erstellen oder Ändern, Datenmodell-Änderungen, API-Vertrag, Komplexitäts-Schätzung

**Überprüfung:**
- **CTO-Advisor-Agent** — liest alle drei Artefakte und überprüft auf Architektur-Bedenken, Konsistenz und fehlende Querschnitts-Bedenken (Authentifizierung, Observability, Migrationen). Gibt eine Liste ungelöster Bedenken zurück, falls vorhanden; die parallelen Agenten adressieren sie, bevor PLAN.md finalisiert wird.

**Tor:** Phase 3 kann nicht beginnen, bis PLAN.md geschrieben ist und der CTO-Advisor keine ungelösten Bedenken zurückgegeben hat.

**Ausgabe:**
- `rpi/{feature-slug}/plan/pm.md`
- `rpi/{feature-slug}/plan/ux.md`
- `rpi/{feature-slug}/plan/eng.md`
- `rpi/{feature-slug}/PLAN.md` (konsolidierte Zusammenfassung, eine Seite)

---

### Phase 3 — Implementieren (`/rpi:implement`)

**Vorbedingung:** `rpi/{feature-slug}/PLAN.md` existiert.

**Prozess:**
1. Lesen Sie PLAN.md, um die geordnete Liste der Dateiänderungen aus dem Engineering-Plan zu extrahieren
2. Implementieren Sie eine Komponente nach der anderen, der Reihenfolge in `eng.md` folgend
3. Nach jeder Hauptkomponente (nicht jede Datei) delegieren Sie zum **Code-Reviewer-Agent** — überprüft die Komponente gegen die Akzeptanz-Kriterien in `pm.md` und das technische Design in `eng.md`
4. Der Reviewer genehmigt die Komponente oder gibt spezifische Änderungsanforderungen zurück; adressieren Sie alle Änderungsanforderungen, bevor Sie zur nächsten Komponente übergehen
5. Bei Abschluss schreiben Sie das Entscheidungs-Log

**Ausgabe:** Funktionsfähige Implementierung + `rpi/{feature-slug}/IMPLEMENT.md`

```markdown
# Implementierungs-Log: {feature-slug}

## Entscheidungen
[Liste der Implementierungs-Entscheidungen, die vom Plan abweichen, mit Begründung]

## Aufgeschoben
[Alles explizit zu einem Follow-up aufgeschoben]

## Abgeschlossen
[Finale Komponenten-Checkliste mit Reviewer-Genehmigung notiert]
```

---

## Verzeichnis-Anordnung

```
rpi/
  {feature-slug}/
    RESEARCH.md
    PLAN.md
    IMPLEMENT.md
    plan/
      pm.md
      ux.md
      eng.md
```

---

## Beispiel

```
Benutzer: /rpi:research "CSV-Export zur Auftrags-Tabelle hinzufügen"

→ RESEARCH.md geschrieben, GO ausgestellt

Benutzer: /rpi:plan

→ plan/pm.md, ux.md, eng.md geschrieben; CTO-Überprüfung bestanden; PLAN.md geschrieben

Benutzer: /rpi:implement

→ Implementierung schreitet Komponente für Komponente mit Code-Überprüfungs-Toren voran
```

---
