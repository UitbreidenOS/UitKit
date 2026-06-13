---
name: stakeholder-report
description: "Wöchentlicher und monatlicher Stakeholder-Datenbericht: Schlüsselmetriken, Trends, Ursachenanalyse, Maßnahmen — strukturiert für Führungskräfte und funktionsübergreifende Zielgruppen"
---

# Skill: Stakeholder-Bericht

## Wann aktivieren
- Verfassen des wöchentlichen oder monatlichen Datenberichts für Führung, Vorstand oder funktionsübergreifende Stakeholder
- Übersetzung von Rohdaten in ein entscheidungsreifes Dokument — kein bloßer Datendump
- Sowohl das Was als auch das Warum darstellen, nicht nur Metriken
- Vorbereitung des Analyseteils einer Geschäftsüberprüfung, eines QBR oder Vorstandspakets
- Datenbefunde an ein gemischtes Publikum kommunizieren (technisch und nicht-technisch)

## Wann NICHT verwenden
- Live-Dashboard-Updates — diese im BI-Tool einrichten
- Rohdatenexporte — Stakeholder müssen keine CSVs sehen
- Statistische Forschungsberichte — dies ist Geschäftskommunikation, keine akademische Analyse
- Einmalige explorative Analysen — für Ad-hoc-Arbeiten `/sql` oder `/pandas-polars` verwenden

## Anweisungen

### Wöchentlicher Stakeholder-Bericht

```
Schreibe einen wöchentlichen Datenbericht für [Zielgruppe: Führungsteam / Abteilungsleiter / Vorstand].

UNTERNEHMEN/TEAM: [Name]
WOCHE VOM: [Datumsbereich]
BERICHTSAUTOR: [Name/Team]

SCHLÜSSELMETRIKEN (vs. letzte Woche und vs. Ziel):

Wachstum:
- [Metrik 1]: [Wert] ([+/-X %] WoW, [+/-X %] vs. Ziel)
- [Metrik 2]: [Wert] ([+/-X %] WoW, [+/-X %] vs. Ziel)

Umsatz:
- [Metrik]: [Wert] ([Änderung])

Engagement / Produkt:
- [Metrik]: [Wert] ([Änderung])

Effizienz:
- [Metrik]: [Wert] ([Änderung])

WAS DIESE WOCHE PASSIERT IST (Ereignisse, die die Zahlen erklären):
- [Ereignis 1: Produktrelease, Kampagne, Vorfall, Partnervertrag etc.]
- [Ereignis 2]

ANALYSE:
- Ursache der größten positiven Bewegung: [beschreiben]
- Ursache der größten negativen Bewegung: [beschreiben]
- Anomalien, die nicht zum Muster passen: [beschreiben oder „keine"]

DIESE WOCHE ERFORDERLICHE ENTSCHEIDUNGEN:
[Alle Entscheidungen auflisten, die durch die Daten informiert werden — was sollte das Team anders tun?]

VORSCHAU NÄCHSTE WOCHE:
- Zu beobachtende Metriken: [welche Metriken sich nächste Woche voraussichtlich bewegen werden und warum]
- Geplante Änderungen, die die Daten beeinflussen: [Releases, Kampagnen etc.]

Einen Bericht im Narrative- + Datenformat erstellen. Mit einem einseitigen Executive Summary beginnen. Header für jeden Abschnitt verwenden. Konkrete Datenpunkte einbeziehen. Vage Formulierungen vermeiden („relativ gut" → „14 % über Plan"). Gesamtlänge: 600–800 Wörter.
```

---

### Monatlicher Stakeholder-Bericht

```
Schreibe einen monatlichen Datenbericht. Detaillierter als wöchentlich — umfasst Trends, Kohortenanalyse und zukunftsgerichtete Kommentare.

MONAT: [Monat Jahr]
ZIELGRUPPE: [Führung / Vorstand / Investoren / All-Hands]

EXECUTIVE SUMMARY:
- Monat in einem Satz: [das Wichtigste, was passiert ist]
- Monat vs. Plan: [im Rahmen / vorne / hinten — primärer Treiber]

MONATLICHE METRIKEN (vs. letzten Monat und vs. gleichem Monat letztes Jahr):

[Metrik] | [Dieser Monat] | [Letzter Monat] | [MoM %] | [Letztes Jahr] | [YoY %] | [vs. Plan]
Umsatz | [X] Mio. $ | [X] Mio. $ | [+/-X %] | [X] Mio. $ | [+/-X %] | [+/-X %]
[Metrik 2] | ... | ... | ... | ... | ... | ...
[Für jeden KPI fortsetzen]

TRENDANALYSE:
- 3-Monats-Trend bei [wichtigster Metrik]: [Richtung und Änderungsrate beschreiben]
- 12-Monats-Trend bei [Umsatz oder primärem KPI]: [beschreiben]
- Vorlaufende Indikatoren für nächsten Monat: [was sagen frühe Signale über den nächsten Monat?]

URSACHENANALYSE — ERFOLGE:
[Für die größte positive Bewegung: was sie verursacht hat, ob sie wiederholbar ist, was mehr getan werden sollte]

URSACHENANALYSE — VERFEHLUNGEN:
[Für die größte Verfehlung: was sie verursacht hat, ob sie einmalig oder strukturell ist, was der Plan ist]

KOHORTENERKENNTNISSE (falls zutreffend):
[Performance neuer Nutzerkohorten, Bindungskurven, LTV nach Akquisitionsquelle]

PROGNOSEAKTUALISIERUNG:
- Revidierte Q[?]-Prognose: [X] Mio. $ (war [X] Mio. $, Änderung aufgrund: [Grund])
- Jahresprognose: [X] Mio. $ ([X] % über/unter ursprünglichem Plan)
- Wesentliche Annahmeänderungen: [was sich im Modell geändert hat]

MASSNAHMEN UND VERANTWORTLICHE:
| Maßnahme | Verantwortlicher | Fälligkeitsdatum | Erfolgsmessung |
|---|---|---|---|
| [Maßnahme 1] | [Name] | [Datum] | [Wie wir es messen] |
| [Maßnahme 2] | [Name] | [Datum] | [Wie wir es messen] |

Den vollständigen Monatsbericht erstellen. Narrativer Ton — kein reiner Stichpunktdump. Jeder Abschnitt sollte zum nächsten überleiten.
```

---

### Abschnitt Ursachenanalyse

Dies ist der wertvollste und schwierigste Abschnitt. Diesen Prompt verwenden, um ihn zu strukturieren:

```
Schreibe eine Ursachenanalyse für [Metrikname] [steigt/fällt] um [X %] in [Zeitraum].

SYMPTOM:
[Metrik] änderte sich von [X] auf [X] — ein [X %] [Anstieg/Rückgang].
Dies war [erwartet / unerwartet / teilweise erwartet].

VORHANDENE DATEN:
- Segmentaufschlüsselung: [wie diese Metrik nach [Kanal / Kohorte / Geographie / Produktlinie] aufgeschlüsselt wird?]
- Korrelation mit anderen Metriken: [was hat sich gleichzeitig bewegt?]
- Zeitverlauf: [wann genau begann die Bewegung? War sie graduell oder plötzlich?]

HYPOTHESEN (nach Wahrscheinlichkeit geordnet):
1. [Wahrscheinlichste Ursache] — gestützt durch: [welche Daten dies belegen]
2. [Zweite Hypothese] — gestützt durch: [Daten]
3. [Dritte Hypothese] — gestützt durch: [Daten]

WAS ICH AUSGESCHLOSSEN HABE:
- [Hypothese X] — weil [Gegenbeweis]

SCHLUSSFOLGERUNG:
- Primärursache: [beste Einschätzung]
- Konfidenz: [Hoch / Mittel / Niedrig]
- Verifizierungsmethode: [welche Analyse dies bestätigen würde]
- Empfohlene Maßnahme: [was dagegen getan werden sollte]
- Erwartete Auswirkung der Maßnahme: [X % Verbesserung der Metrik über X Wochen]

Als 300-Wörter-URA-Abschnitt schreiben, bereit zum Einfügen in einen Stakeholder-Bericht.
```

---

### Datenzusammenfassung auf Vorstandsebene

```
Schreibe den Daten-/Metrikabschnitt eines Vorstandsupdates.

VORSTANDSSITZUNG: [Datum]
BERICHTSZEITRAUM: [Quartal oder Monat]
UNTERNEHMENSPHASE: [Seed / Series A / Wachstum / Pre-IPO]

SCHLÜSSELMETRIKEN VS. PLAN:
[Schlüsselmetriken mit Planvergleich einfügen]

Wesentliche Aspekte nach Phase:

SEED/SERIES A:
- Umsatz/ARR und Wachstumsrate vs. Plan
- Burn-Rate und Runway
- Wesentliche Produkt- oder Kundenmeilensteine
- Einstellungen vs. Plan

WACHSTUMSPHASE:
- Umsatz, Bruttomarge und Einheitenökonomie-Trends
- CAC und Amortisationszeitraum — verbessernd oder verschlechternd?
- NRR — Expansion vs. Fluktuation
- Weg zur Profitabilität (falls relevant)

PRE-IPO:
- GAAP vs. Non-GAAP-Metriken
- Rule-of-40-Position
- Quartalsguidance und Abweichungserklärung

Den Metrikabschnitt schreiben:
1. 2-Satz-Performance-Zusammenfassung (ehrlich — Vorstände durchschauen Schönfärberei)
2. Schlüsselmetriktabelle mit vs. Plan
3. 3 Stichpunkte: was die Performance getrieben hat (positiv und negativ)
4. 1 zukunftsgerichteter Satz: revidierte Prognose oder wichtigster Beobachtungspunkt für nächstes Quartal

Unter 300 Wörter. Kein Jargon. Mit Fakten beginnen.
```

---

### QBR-Datenpaket (Quarterly Business Review)

```
Schreibe das Datenpaket für einen Quarterly Business Review mit [Zielgruppe: Kunden / internes Führungsteam / Partner].

QUARTAL: Q[?] [Jahr]
TYP: [Internes QBR / Kunden-QBR / Partner-QBR]

INTERNES QBR (Führungsteam):
- Quartals-Performance vs. OKRs
- Top-3-Erfolge mit Daten
- Top-3-Verfehlungen mit Ursache
- Revidierte Jahresprognose
- Ressourcenempfehlungen für nächstes Quartal

KUNDEN-QBR (für ein SaaS-Kundenerfolgs-Review):
Kunde: [Name]
- Nutzungsmetriken: [DAUs, genutzte Schlüsselfeatures, Adoption vs. lizenzierte Plätze]
- Erbrachter Mehrwert: [erzielte Ergebnisse — wo möglich quantifizieren]
- Bevorstehende Roadmap-Features, die für sie relevant sind
- Verlängerungsrisikolevel: [Grün / Gelb / Rot]
- Empfohlene nächste Schritte für ihr Konto

PARTNER-QBR:
- Gemeinsam generierte Pipeline: [X] Mio. $
- Gemeinsame Wins: [N] Kunden, [X] Mio. $ ARR
- Pipeline-Risiken: [N] Deals, Gründe
- Co-Marketing-Performance
- Empfohlene Investitionen für nächstes Quartal

Das entsprechende QBR-Datenpaket basierend auf dem gewählten Typ generieren.
```

---

### Metriken-Glossar-Abschnitt

Wenn Stakeholder nicht wissen, was die Metriken bedeuten:

```
Erstelle ein verständliches Metriken-Glossar für unseren Stakeholder-Bericht.

ZU DEFINIERENDE METRIKEN:
[Metriken auflisten]

Für jede Metrik:
- Name: [offizieller Name]
- Einfache Erklärung: [was sie in einem Satz misst — kein Jargon]
- Warum sie wichtig ist: [warum diese Metrik zeigt, ob das Unternehmen gesund ist]
- Berechnungsmethode: [Formel oder kurze Beschreibung]
- Zielbereich: [was „gut" für unser Unternehmen bedeutet]
- Was sie bewegt: [die wichtigsten Treiber]

Jede Definition unter 80 Wörter halten. Für eine nicht-technische Führungskraft schreiben, die intelligent, aber kein Datenanalyst ist.
```

## Beispiel

**Nutzer:** Monatsbericht für das Führungsteam. Oktober-Umsatz: 2,1 Mio. $ (Plan war 2,0 Mio. $, +5 %). MoM-Wachstum: +12 %. YoY: +47 %. Fluktuation: 2,1 % (war 1,8 % letzten Monat). NRR: 108 % (war 112 % letzten Monat). Größtes Ereignis: Enterprise-Kunde in der Monatsmitte abgewandert (war 8 % des ARR). Neue Logo-Wins: 14 (bester Monat aller Zeiten). Zielgruppe: CEO, CFO, VP Sales, VP Product.

**Erwartete Ausgabe:** Vollständiger Monatsbericht, der mit „Oktober war ein Rekordumsatzmonat für Neugeschäfte, der teilweise durch unsere bislang größte Kundenwanderung aufgewogen wurde" beginnt. Umsatzabschnitt zeigt 2,1 Mio. $ vs. 2,0 Mio. $ Plan. Ursachenanalyse zur Fluktuation: der Abgang des Enterprise-Kunden trieb den NRR-Rückgang von 112 % auf 108 % — ein strukturelles, kein Trendsignal. Der neue Logo-Rekord ist echtes Signal. Maßnahmentabelle: Nachbesprechung zum abgewanderten Kunden (VP Customer Success, 7. Nov.), ICP-Verfeinerung zur Aussortierung von Kunden mit ähnlichem Risikoprofil (VP Product + VP Sales, 14. Nov.). Beobachtungsliste: Enterprise-Verlängerungs-Pipeline für Q4.

---
