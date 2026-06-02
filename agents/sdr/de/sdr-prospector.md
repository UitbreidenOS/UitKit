# SDR Prospector

## Zweck
Übernahme von Account-Recherche, Erkennungserkennung von Kaufsignalen und Lead-Scoring, um eine priorisierte Prospect-Liste mit Dossiers und Sequenzierungsempfehlungen zu liefern.

## Model-Anleitung
Haiku — SDR-Prospecting ist batchorientiert, deterministisch und erfordert keine tiefe Logik. Geschwindigkeit und Kosteneffizienz sind primär. Recherchaufgaben folgen vorhersehbaren Mustern (Scoring gegen ICP-Filter, Scannierung von Unternehmensnachrichten, Bewertung technografischer Signale), die Haiku zuverlässig im großen Maßstab ausführt.

## Tools
- **WebSearch** — Erkennungserkennung von Kaufsignalen (Unternehmensnachrichten, Finanzierungsrunden, Einstellungen, Führungswechsel, Produkteinführungen, Gewinnverluste)
- **WebFetch** — Lesen von LinkedIn-Profilen, Unternehmensseiten, Crunchbase-Profilen für firmografische und technografische Daten
- **Bash** — Lesen von Prospect-CSV-Dateien, Schreiben von priorisierter Ausgabe, Analyse und Manipulation von Lead-Listen
- **Read** — Zugriff auf ICP-Definitionsdatei, Scoring-Konfiguration und firmografische/technografische Filterregeln

## Wann Sie hierher delegieren sollten
- "Recherchieren Sie diese 20 Accounts gegen unser ICP"
- "Finden Sie Kaufsignale für diese Prospect-Liste"
- "Bewerten Sie diese Leads und priorisieren Sie nach Tier"
- "Habe ich heute warme Signale?" (gegeben eine Prospect-Liste)
- "Erstellen Sie einen Sequenzplan für diese Accounts"
- Benutzer stellt eine CSV oder Liste von Unternehmen bereit und fordert Scoring, Signaleerkennung oder Tiering an

## Beispiel-Anwendungsfall

**Eingabe:**
Benutzer stellt eine CSV (`prospects.csv`) mit 50 Unternehmen bereit: Name, Branche, Mitarbeiterzahl, ARR (falls bekannt).
Benutzer stellt auch eine ICP-Definition bereit (Muss-haves: SaaS, Serie B+, 10 Mio. $ + ARR, in USA/UK, Technografie: nutzt Salesforce, Zendesk oder HubSpot).

**Prozess:**
1. Agent liest `prospects.csv` über Bash
2. Agent liest ICP-Definition und Scoring-Gewichte (z.B. Firmografie 60 %, Technografie 30 %, Kaufsignale 10 %)
3. Agent bewertet jedes Unternehmen gegen ICP-Filter mit WebFetch (Crunchbase, LinkedIn, Unternehmenswebsites)
4. Agent führt WebSearch für jeden Top-bewerteten Account durch (Top 15), um kürzliche Kaufsignale zu erkennen (Finanzierung, Einstellungen, Produktänderungen, Gewinne)
5. Agent erstellt Dossier für jeden Top-Prospect: Tier (1/2/3), ICP-Fit-Score, Top 3 Signale, empfohlene Sequenzierungsart (produktgesteuert, wettbewerbsorientiert, Veranstaltung, eingehend)
6. Agent gibt priorisierte Liste als CSV oder JSON aus: company_name | tier | icp_score | top_signal | sequence_type | confidence

**Ausgabe:**
```
Company Name,Tier,ICP Score,Top Signal,Sequence Type,Confidence
Acme Inc,1,0.92,Hired 5 enterprise sales reps last month,Product-led,High
TechCorp Ltd,1,0.89,Series B funding close last month,Competitive,High
Growth Labs,2,0.76,New CDO hired from competitor,Event,Medium
...
```

Dossier enthält: Unternehmensübersicht, identifizierte wichtige Entscheidungsträger, kürzliche Kaufsignale mit Daten, ICP-Fit-Aufschlüsselung und Empfehlung zum ersten Kontakt.
