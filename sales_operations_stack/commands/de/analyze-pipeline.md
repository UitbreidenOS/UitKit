Now I'll provide the German translation while preserving the structure, terminology, and formatting:

```markdown
# /analyze-pipeline

**Trigger:** Wöchentlich (jeden Montag) vor dem Leadership-Sync oder bei Bedarf für Pipeline-Transparenz.

**Zweck:** Echtzeitabfrage der Pipeline-Gesundheit erstellen: Dealanzahl nach Phase, durchschnittliches Alter pro Phase, Forecast-Gesundheit, phasenweise Konversionsraten und Risikodeal-Identifizierung.

**Was es tut:**
1. Aktuelle CRM-Export abrufen (Salesforce, HubSpot oder Pipedrive)
2. Datenfr ische validieren (warnt, wenn >24 Stunden alt)
3. Deals nach Phase, Tier (Enterprise/Mid/Commercial) und Rep segmentieren
4. Schlüsselmetriken berechnen: Pipeline-Wert, Phasenalterung, Konversionsraten, Forecast-Genauigkeit
5. Gefährdete Deals identifizieren (>30 Tage in Phase, <50% Wahrscheinlichkeit)
6. Zusammenfassung-Dashboard generieren: Top-Risiken, Quota-Tempo, empfohlene Maßnahmen
7. Bericht speichern unter `reports/pipeline-snapshot-{YYYY-MM-DD}.md`
8. Zusammenfassung in `session-log.md` protokollieren

**Eingaben:** CRM-Verbindung (erfordert API-Anmeldedaten oder Export-Datei)

**Ausgabe:** `reports/pipeline-snapshot-{date}.md` — Vollständiger Gesundheitsbericht mit Metriken, gefährdeten Deals, Konversions-Trends und Aktionen

**Verantwortlicher:** Sales Ops Lead | **Frequenz:** Wöchentlich + bei Bedarf

**Beispiel:**

```bash
/analyze-pipeline
```

Ausgabe:
- Pipeline-Abdeckung: 3,8:1 (Ziel 3,5–4,5:1) ✓ Grün
- Forecast-Genauigkeit: 92% vs. eingereicht 95% — Überwachen
- Gefährdete Deals: 7 (>30 Tage in Phase oder <50% Wahrscheinlichkeit) — Eskalation an Manager
- Quota-Tempo: -14% vs. anteiliger Ziel — Intervention erforderlich

Nächster Schritt: Gefährdete Deals überprüfen; Deal-Reviews mit betroffenen Reps planen.

---

Built with [Claudient](https://github.com/Claudient/Claudient) · [uitbreiden.com](https://uitbreiden.com/)