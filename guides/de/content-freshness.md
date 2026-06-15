---
name: content-freshness
description: "Wartungs-SLA, Aktualitätsschwellen und Frische-Verfahren für Claudient-Inhalte"
updated: 2026-06-15
---

# Claudient Content Freshness SLA

Wartungsstandards und Verfahren zur Aufrechterhaltung aktueller und genauer Claudient-Inhalte. Diese Anleitung definiert Aktualitätsschwellen, was pro Inhaltstyp zu überprüfen ist, und den Frontmatter-Aktualisierungsprozess.

---

## Aktualitätsschwellen

Eine Datei wird als **veraltet** betrachtet, wenn ihr `updated`-Datum im YAML-Frontmatter älter als der Schwellenwert für ihren Typ ist:

| Inhaltstyp | Schwellenwert | Grund |
|---|---|---|
| Skills (Kern-Produktivität, Testing, Debugging) | 6 Monate | Kernmuster ändern sich häufig mit Claude-Modell-Updates |
| Skills (domänenspezifisch: Backend, Frontend, etc.) | 6 Monate | Tooling und Best Practices entwickeln sich schnell |
| Agenten (Kern-Rollen: Debugger, Reviewer, etc.) | 6 Monate | Agent-Fähigkeiten hängen von Claude-Modell-Fähigkeiten ab |
| Anleitungen (Getting Started, konzeptuell) | 9 Monate | Referenzmaterial ist stabiler als How-to |
| Anleitungen (Tool/Framework-spezifisch) | 6 Monate | Tools und APIs ändern sich schneller als Konzepte |
| Workflows (taktisch: Bug-Investigation, Code-Review) | 6 Monate | Diese spiegeln aktuelle Praktiken und Tools wider |
| Workflows (strategisch: Onboarding, Planung) | 9 Monate | Langfristige Prozesse sind stabiler |
| Prompts | 6 Monate | Prompt-Effektivität verschlechtert sich, wenn sich das Modellverhalten ändert |
| ADRs / Regeln (dokumentierte Entscheidungen) | 12 Monate | Entscheidungen sollen langlebig sein; überprüfen Sie nur, wenn sich der Kontext ändert |

**Globale Regel:** Wenn es ein `updated`-Datum hat und älter als 6 Monate ist, fügen Sie es zur Auffrischungswarteschlange hinzu. Verwenden Sie längere Schwellenwerte (9–12 Monate) nur für wirklich nicht-technische Inhalte (historische Beispiele, archivierte Anleitungen).

---

## Indikatoren für veraltete Inhalte

Eine Datei ist funktionell veraltet, auch wenn ihr Datum neu ist, wenn eines der folgenden zutrifft:

### Skills
- Beispiele für Befehlssyntax, die nicht mehr funktionieren (Test in Claude Code)
- Toolnamen, die umbenannt oder entfernt wurden
- Veraltete Screenshot- oder UI-Referenz
- Hook-Triggerbedingungen, die nicht mehr existieren
- Beispiel, das in aktuellem Claude Code bricht
- Erwähnt eine veraltete Funktion oder einen Modellnamen

### Agenten
- Beschreibt Tools, auf die der Agent nicht mehr Zugriff hat
- Verweist auf eine Modellversion, die nicht mehr verfügbar ist
- Fähigkeitsansprüche, die nicht mehr der Realität entsprechen
- Prompt-Beispiele, die altes API-Verhalten widerspiegeln

### Anleitungen
- Feature-Vergleichstabelle, die sich geändert hat (z. B. Modellpreise, Kontextfenster)
- Installationsanweisungen für ein Tool mit einer neuen Hauptversion
- Workflow-Schritte, die von einer entfernten Funktion abhängen
- Veraltete Screenshot- oder Schnittstellen-Referenz
- Verweist auf eine alte Projektstruktur oder Namenskonvention

### Workflows
- Verweist auf ein Tool oder Skill, das entfernt wurde
- Parallele Schritte, die von nicht mehr verfügbaren Tools abhängen
- Beispiel geht von einer nicht mehr empfohlenen Codebase-Struktur aus
- Metrik oder SLA, die nicht mehr relevant ist (veraltete Teamgrößen, Traffic-Level)

### Alle Inhaltstypen
- Tote Links (404s auf externe Ressourcen)
- Verweise auf „kommende" Funktionen, die lange Zeit versendet wurden
- Beispiele mit veralteten Sprach-/Framework-Versionen
- Mehrdeutige Aussagen ohne unterstützende Beweise

---

## Frontmatter-Format

Jede Datei in `skills/`, `agents/`, `guides/`, `workflows/`, `rules/` und `prompts/` muss einen YAML-Frontmatter-Block am Anfang haben:

```yaml
---
name: the-skill-name
description: "Einzeiliger Zweck dieser Datei"
updated: 2026-06-15
---
```

### Frontmatter-Regeln

- **name:** kebab-case, entspricht dem Dateinamen (ohne `.md`)
- **description:** ~50 Zeichen, passt auf eine Zeile, enthält nicht den Titel
- **updated:** ISO 8601-Datum (`YYYY-MM-DD`), aktualisiert auf heute, wenn Sie die Datei ändern

**Beispiel (Skill-Datei):**
```yaml
---
name: freshness-auditor
description: "Führen Sie Frische-Audits durch und generieren Sie priorisierte Auffrischungslisten"
updated: 2026-06-15
---
```

**Beispiel (Workflow-Datei):**
```yaml
---
name: freshness-refresh
description: "Vierteljährliches Wartunts-Sprint zum Audits und Auffrischung veralteter Inhalte"
updated: 2026-06-15
---
```

### Wie man Frontmatter aktualisiert

Wenn Sie eine Datei ändern:
1. Finden Sie den `---`-Block oben
2. Ändern Sie den `updated:`-Wert auf heutiges Datum im ISO-Format
3. Ändern Sie nicht `name` oder `description` (dies sind stabile Identifikatoren)
4. Commiten Sie die Datei mit dem aktualisierten Datum

Wenn eine Datei veraltet ist aber immer noch korrekt, aktualisieren Sie nur das `updated:`-Datum, um den Aktualitätszähler zurückzusetzen. Dies signalisiert "Frische bestätigt — Inhalt verifiziert als aktuell."

---

## Was pro Skill-Typ zu überprüfen ist

### Produktivitäts-Skills
- Führen Sie alle Befehlsbeispiele in einer echten Claude Code-Sitzung aus — funktioniert es?
- Wenn der Skill eine Slash-Command aufruft (z. B. `/code-review`), überprüfen Sie, dass dieser Befehl noch existiert
- Wenn der Skill auf einen Hook oder eine Einstellung verweist (z. B. `settings.json`-Konfiguration), überprüfen Sie, dass er noch gültig ist
- Überprüfen Sie externe Tool-Links (npm, GitHub, Docs) auf 404s

### Domain-Skills (Backend, Frontend, ML, etc.)
- Überprüfen Sie, dass Framework/Library-Versionsempfehlungen noch aktuell sind
- Führen Sie Code-Beispiele aus (wenn eigenständig), um sicherzustellen, dass die Syntax gültig ist
- Überprüfen Sie, ob das Tool oder Framework eine Hauptversion veröffentlicht und das Verhalten geändert hat
- Überprüfen Sie, dass Paketnamen und Import-Pfade sich nicht geändert haben

### Konzeptuelle Skills und Anleitungen
- Lesen Sie den Inhalt mit frischem Blick — ist die Erklärung noch klar und korrekt?
- Überprüfen Sie externe Links (Tutorials, Specs, Standards) auf 404s
- Wenn der Skill zwei Optionen vergleicht, überprüfen Sie, dass beide noch in Gebrauch sind
- Wenn der Skill eine „Best Practice" beschreibt, überprüfen Sie, dass sie mit dem aktuellen Industrie-Konsens übereinstimmt

### Agenten
- Überprüfen Sie, dass die Modellempfehlung des Agenten (Haiku/Sonnet/Opus) noch für die Aufgabe geeignet ist
- Überprüfen Sie, dass das aufgelistete `tools:` noch in Claude Code existiert
- Lesen Sie den Abschnitt `model guidance` — gilt er noch für das aktuelle Claude-Modell?
- Überprüfen Sie, dass angenommene Agent-Fähigkeiten nicht entfernt wurden

### Workflows
- Lesen Sie die Workflow-Schritte — sind alle referenzierten Tools, Befehle und Funktionen noch verfügbar?
- Überprüfen Sie, ob ein Schritt von veraltetem Verhalten abhängt
- Überprüfen Sie, dass erwähnte Metriken oder SLAs noch realistisch sind
- Wenn der Workflow Agenten erzeugt, stellen Sie sicher, dass Agent-Definitionen noch existieren und ihre Rollen sich nicht geändert haben

### Regeln
- Überprüfen Sie, dass die Regel immer noch in der Codebase befolgt wird
- Wenn die Regel auf ein Tool oder eine Funktion verweist, überprüfen Sie, dass es noch existiert
- Lesen Sie die Begründung — ist sie noch gültig?

---

## Frische-Überprüfungs-Workflow (Für einzelne Mitwirkende)

Beim Hinzufügen oder Ändern einer Datei:

1. **Aktualisieren Sie das Frontmatter:**
   ```yaml
   updated: [HEUTIGES DATUM IM YYYY-MM-DD FORMAT]
   ```

2. **Testen Sie wenn zutreffend:**
   - Wenn die Datei Befehle enthält, führen Sie diese aus
   - Wenn die Datei Code enthält, validieren Sie die Syntax
   - Wenn die Datei eine Funktion referenziert, überprüfen Sie, dass sie existiert

3. **Überprüfen Sie Links:**
   - Externe URLs in der Datei sollten nicht 404 sein
   - Interne Links (zu anderen Dateien in Claudient) sollten existierende Dateien referenzieren

4. **Commiten:**
   ```bash
   git add path/to/file.md
   git commit -m "chore: refresh [filename] — verify accuracy and update date"
   ```

---

## Vierteljährlicher Frische-Sprint

Führen Sie alle 3 Monate den vollständigen Workflow `/workflows/freshness-refresh` aus:

1. **Generieren Sie einen Bericht:** `node scripts/generate-refresh-report.js`
2. **Triage-Dateien** nach Alter und Wichtigkeit
3. **Spawn Review-Agenten**, um Inhaltsgenauigkeit zu überprüfen
4. **Wenden Sie Updates** aus Agent-Berichten an
5. **Commiten Sie den Batch** und setzen Sie den Aktualitätszähler zurück

---

## SLA-Ziele

- **Kern-Produktivitäts-Skills:** 95% frisch (< 6 Monate)
- **Alle anderen Inhalte:** 85% frisch
- **Fehlende Frontmatter-Daten:** 0 (alle Dateien müssen ein `updated:`-Feld haben)
- **Tote Links:** 0 (CI-Überprüfung wird sofort signalisiert)

Überwachen Sie diese Metriken in dem Bericht für Frische-Generierung vierteljährlich.

---

## Verwandter Inhalt

- `/workflows/freshness-refresh` — vierteljährliches Wartungs-Sprint-Verfahren
- `/skills/productivity/freshness-auditor` — führen Sie einen Frische-Audit on-demand durch
- `/scripts/check-freshness.js` — CLI-Tool zur Erkennung veralteter Dateien
- `/scripts/generate-refresh-report.js` — generieren Sie einen detaillierten Frische-Bericht

---
