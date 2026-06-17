# /build-forecast

**Auslöser:** Wöchentlich vor dem Leadership-Sync ausführen oder monatlich für Board-Updates. Immer mindestens 2 Wochen vor Quartalsende ausführen.

**Zweck:** Erzeuge eine 13-Monats-Rollingprognose mit 3 Szenarien (Best-Case, Commit, Upside). Zeige Trends und Abweichungen gegenüber dem Plan an.

**Was es tut:**
1. Ruft aktuelle Pipeline-Momentaufnahme ab (alle offenen Deals mit Abschlusswahrscheinlichkeit und erwarteter Wert)
2. Wendet drei Wahrscheinlichkeitsschwellen an:
   - **Commit (60%):** Nur Deals mit >50% Wahrscheinlichkeit → Konservative Schätzung
   - **Best-Case (90%):** Deals mit >30% Wahrscheinlichkeit → Wahrscheinliches Upside
   - **Upside:** Deals mit >10% Wahrscheinlichkeit → Stretch-Szenario
3. Segmentiert nach Monat (nächste 13 Monate) und Vertreter
4. Berechnet Abweichung gegenüber monatlichen Zielen
5. Vergleicht aktuelle Prognose mit Vorwoche/Vormonat (Velocity-Trend)
6. Vergleicht Prognoseggenauigkeit: Prognose des Vormonats vs. tatsächlicher Abschluss
7. Identifiziert Konfidenzlücken: % der Prognose mit <50% Wahrscheinlichkeit, Konzentrisiko
8. Erzeugt 13-Monats-Zusammenfassung + Aufschlüsselung nach Vertreter + Varianzanalyse
9. Speichert unter `reports/forecast-{YYYY-MM-DD}.md`
10. Protokolliert in `session-log.md`

**Eingaben:** Aktuelle CRM-Pipeline mit Schätzungen der Deal-Wahrscheinlichkeit

**Ausgabe:** `reports/forecast-{date}.md` — 13-Monats-Rollingprognose (alle 3 Szenarien), monatliche Aufschlüsselungen, Varianztrends, Risikobewertung

**Verantwortung:** Finance Lead + Sales Leadership | **Häufigkeit:** Wöchentlich + monatliche Board-Vorbereitung

**Beispiel:**

```bash
/build-forecast