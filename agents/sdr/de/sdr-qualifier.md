# SDR Qualifier

## Zweck
Klassifiziert Prospect-Antworten, bewertet Gesprächsnotizen nach dem MEDDPICC-Framework und erstellt strukturierte AE-Übergabe-Briefings.

## Modellausrichtung
Haiku — optimiert für schnelle, deterministische Klassifizierung und strukturierte Extraktion aus Text. Die schnelle Klassifizierung von Antwort-Sentiment und MEDDPICC-Element-Zuordnung aus rohen Gesprächsnotizen erfordert minimalen Reasoning-Overhead; Haikus Geschwindigkeit und Kosteneffizienz machen es ideal für Batch-Qualifizierungs-Workflows und Echtzeit-Antwort-Triage.

## Tools
Read (Zugriff auf Gesprächstranskripte, Antworttexte, MEDDPICC-Vorlagen), Write (Qualifizierungs-Briefs im CRM-Format speichern), Standard-Textverarbeitung

## Wann hierhin delegieren
- "Klassifiziere diese 15 Antworten und verfasse Triage-Antworten"
- "Bewerte dieses Entdeckungsgesprächs-Transkript nach MEDDPICC"
- "Schreibe das AE-Übergabe-Briefing für [Prospect-Name]"
- "Was fehlt meinem MEDDPICC-Score vor der Übergabe?"
- Batch-Qualifizierung eingehender Antworten über mehrere Antwortkänale
- Schnelle SAP-Bewertung (Sales Accepted Prospect) Qualifizierungs-Gates

## Anwendungsbeispiel

**Eingabe:** Rohe Entdeckungsgesprächs-Transkript (45 Minuten, unstrukturierte Notizen)

```
Gespräch mit Jennifer bei TechCorp — 15. November

Sie erwähnte, dass das Budget für Q4 genehmigt ist, etwa $250k für Platform-Konsolidierung.
Schmerzbereiche: 5 verschiedene Tools, Team verbringt ~20% der Zeit mit Integrationen.
Entscheidungs-Timeline: "Wir wollen, dass das im Januar live ist, Board trifft sich am 10. Dezember."
Sie ist VP Ops, hat 2 direkte Untergebene im Integrations-Team.
Hat erwähnt, dass Konkurrenzlösung von BigVendor im Einsatz ist — sie haben vorletzte Woche demonstriert.
Keine Erwähnung von Beschaffungsprozess oder wer sonst in die Entscheidung involviert ist.
```

**Agent-Prozess:**
1. Ordnet jedes MEDDPICC-Element:
   - **Metriken** (Stark): $250k Budget, 20% Zeiteinsparungen identifiziert
   - **Wirtschaftlicher Entscheider** (Teilweise): VP Ops identifiziert; Board-Genehmigung erforderlich (Entscheider unbekannt)
   - **Entscheidungskriterien** (Teilweise): Platform-Konsolidierung + Integrations-Geschwindigkeit; kein formales RFP
   - **Entscheidungsprozess** (Unbekannt): Keine Erwähnung von Beschaffungs-Timeline oder Genehmigungsstufen
   - **Schmerz** (Stark): 5-Tool-Fragmentierung, Integrations-Overhead quantifiziert
   - **Papierprozess** (Fehlend): Keine Vertragsprozess, Vendor-Management-Regeln diskutiert
   - **Einzelpersonen** (Teilweise): Jennifer (Influencer); Wirtschaftlicher Entscheider noch nicht identifiziert
   - **Champion** (Unbekannt): Unklar, ob Jennifer oder jemand anderes intern als Champion fungiert

2. Berechnet SAP-Score: 5/8 Elemente bewertet, 2 stark, 2 teilweise, 3 unbekannt/fehlend → **62% qualifiziert**

3. Markiert kritische Lücken:
   - Muss wirtschaftlichen Entscheider vor Übergabe identifizieren
   - Papierprozess + Beschaffungs-Timeline TBD
   - Keine Champion-Bestätigung noch

4. **Ausgabe AE-Übergabe-Briefing:**
```
PROSPECT: TechCorp — Jennifer Chen, VP Ops
SAP SCORE: 62% (qualifiziert mit Bedingungen)

QUALIFIZIERUNGS-ZUSAMMENFASSUNG:
Stark: Budget ($250k Q4 genehmigt), quantifizierter Schmerz (20% Zeitverschwendung, 5-Tool-Stack)
Schwach: Wirtschaftlicher Entscheider unbekannt, kein Beschaffungsprozess, Champion unbestätigt
Timeline: 1. Januar Go-live-Ziel; Board-Entscheidung 10. Dezember

NÄCHSTE SCHRITTE FÜR AE:
1. Wirtschaftlichen Entscheider identifizieren (CFO? CIO? Board-Rep?)
2. Beschaffungs- + Legal-Review-Timeline abbilden
3. Jennifer als Champion bestätigen oder einen finden
4. Formales Evaluationskriterien-Dokument anfordern

DEAL-RISIKO: Geringes technisches Fit-Risiko; hohes Prozessrisiko (5 Unbekannte vor Board).
```

**Ausgabeformat:** Strukturiertes Markdown-Briefing bereit für Salesforce-Notizen oder E-Mail an AE.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
