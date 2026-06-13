# Workflow für Vorfallreaktion

End-to-End-Workflow für die Verwaltung eines Produktionsvorfalls von der Erkennung bis zum Post-Mortem.

## Wann verwendet

Verwenden Sie diesen Workflow wenn:
- Eine Warnung auslöst und eine Auswirkung auf Benutzer anzeigt
- Ein Kunde meldet, dass etwas kaputt ist
- Bereitstellung verursachte unerwartetes Verhalten
- Fehlerquoten oder Latenz überschreiten SLO-Schwellwerte

## Phase 1: Erkennen und erklären (0-5 Minuten)

**Schritt 1 — Überprüfen Sie den Vorfall:**
```
Betrifft dies tatsächlich Benutzer? Überprüfen Sie:
- Fehlerquote-Dashboard (über 1%?)
- Latenz-Dashboard (p99 über SLO?)
- Direkte Benutzerberichte über Support
- Ergebnisse synthetischer Monitore
```

**Schritt 2 — Klassifizieren Sie die Schwere:**
- **SEV1**: Vollständiger Serviceausfall oder Datenverlust. Alle Hände.
- **SEV2**: Erhebliche Beeinträchtigung (>25% der Benutzer betroffen). IC zugewiesen.
- **SEV3**: Geringer Einfluss, Workaround verfügbar. Während der Geschäftszeiten bearbeiten.

**Schritt 3 — Erklären und kommunizieren:**
```
Posten Sie zu #incidents:
[SEV{N}] {Servicename} — {einzeilige Beschreibung}
Auswirkung: {wer und was betroffen ist}
IC: {Ihr Name}
Kriegsraum: {Link}
Nächste Aktualisierung: {Zeit, max 30 Min für SEV1}
```

## Phase 2: Ermittlung (5-30 Minuten)

**Stellen Sie diese Fragen in Ordnung:**

1. Hat sich in letzter Zeit etwas geändert? (Bereitstellung, Konfiguration, Verkehrsspitzen)
   ```bash
   git log --oneline -10  # aktuelle Commits
   # Überprüfen: Bereitstellungsprotokolle, Änderungen an Feature-Flaggen, Konfigurationsänderungen
   ```

2. Wie groß ist der Explosionsradius?
   - Welche Benutzer sind betroffen?
   - Welche Funktionen/Endpunkte schlagen fehl?
   - Welche Abhängigkeiten sind beteiligt?

3. Was zeigen die Protokolle an?
   ```bash
   # Finden Sie den ersten Fehler
   # Überprüfen: Fehlermeldungen, Stack-Traces, Timing
   ```

4. Wie sehen die Daten aus?
   ```bash
   # Überprüfen: DB-Verbindungsanzahl, Warteschlangentiefe, Cache-Hit-Quote
   ```

**Hypothesen nach Wahrscheinlichkeit geordnet:**
1. Aktuelle Bereitstellung (wenn in den letzten 2 Stunden bereitgestellt)
2. Upstream-Abhängigkeit (überprüfen Sie Statusseiten)
3. Verkehrsspitze oder Kapazitätsproblem
4. Datenbeschädigung oder unerwarteter Status
5. Infrastrukturfehler

## Phase 3: Abschwächung (kürzester Weg zur Verringerung der Benutzerauswirkungen)

**Optionen nach Geschwindigkeit:**

1. **Rollback** (schnellste Wenn durch Bereitstellung verursacht):
   ```bash
   # Git-basiertes Rollback oder Feature-Flag-Kill-Switch
   ```

2. **Deaktivieren Sie die Funktion** (Feature-Flag):
   ```
   Setzen Sie feature.broken_thing = false
   ```

3. **Skalieren Sie auf** (wenn Kapazitätsproblem):
   ```bash
   kubectl scale deployment api --replicas=10
   ```

4. **Wenden Sie einen Hotfix an** (wenn Rollback nicht möglich):
   - Verzweigung vom Tag, der in der Produktion war
   - Minimale Reparatur, beschleunigte Überprüfung
   - Mit zusätzlicher Überwachung bereitstellen

**Abschwächung bedeutet nicht Auflösung.** Abschwächung reduziert die Benutzerauswirkung; Auflösung behebt die Grundursache.

## Phase 4: Kommunizieren (durchgehend)

**Kundenupdate (für SEV1/SEV2):**
```
Wir erleben {kurze Beschreibung}. Unser Team untersucht aktiv.
Erkannte Zeit: {Zeit}
Auswirkung: {Benutzerbeschreibung}
Nächste Aktualisierung: {15-30 min ab jetzt}
Statusseite: {Link}
```

**Auflösungs-Update:**
```
[GELÖST] {Servicename} — {Zeit gelöst}
Dauer: {X Stunden Y Minuten}
Auswirkung: {was betroffen war}
Grundursache: {kurz — vollständiges Post-Mortem innerhalb von 48 Stunden}
Status: Alle Systeme funktionieren normal.
```

## Phase 5: Auflösen und überprüfen

**Vor dem Schließen des Vorfalls:**
- [ ] Fehlerquoten kehren zur normalen Basislinie zurück
- [ ] Latenz zurück zur Normalität
- [ ] Keine anomalen Protokolle
- [ ] Betroffene Benutzer können den betroffenen Workflow abschließen
- [ ] Das On-Call-Team ist zuversichtlich, dass das Problem gelöst ist

## Phase 6: Post-Mortem (innerhalb von 48 Stunden für SEV1/SEV2)

**Post-Mortem-Dokument:**
1. **Zusammenfassung**: Was ist passiert, wie lange, was war der Einfluss
2. **Zeitstrahl**: Minute für Minute von der Erkennung bis zur Auflösung
3. **Grundursache**: Die tatsächliche zugrunde liegende Ursache (nicht das Symptom)
4. **Beitragende Faktoren**: Was hat dies schlimmer gemacht oder die Erkennung/Behebung erschwert
5. **Was gut lief**: Erkennungsgeschwindigkeit, Kommunikation, Werkzeuge, die halfen
6. **Was schief lief**: Lücken in der Überwachung, langsame Erkennung, Kommunikationsfehler
7. **Maßnahmenpunkte**: Spezifische, eigentümerorientierte, zeitgebundene Verbesserungen

**Blameless-Kultur:**
- Post-Mortems identifizieren Systemfehler, nicht einzelne Fehler
- Das Ziel ist es, eine Wiederholung zu verhindern, keine Schuld zuzuweisen
- Post-Mortems umfassend veröffentlichen — das ganze Unternehmen lernt

## Verwandte Skills

- `/runbook-generator` — Runbooks für spezifische Fehlermodi erstellen
- `/slo-architect` — SLOs und Burn-Rate-Warnungen entwerfen
- `/observability-designer` — instrumentieren Sie Ihr System, um schneller zu erkennen
- `/agents/roles/incident-commander` — KI-Assistent für Kriegsraumkoordination

---
