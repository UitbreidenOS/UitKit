---
name: sdr-research-brief
description: "30-Sekunden-Account-Dossier für SDRs: Unternehmens-Snapshot, aktuelle Auslöser, Kaufsignale, Stakeholder-Karte und personalisierter Outreach-Winkel — aus einer URL oder einem Unternehmensnamen"
---

# SDR-Recherche-Brief-Skill

## Wann aktivieren
- Du benötigst ein vollständiges Account-Briefing vor dem Verfassen von Kaltakquise-Outreach
- Du hast einen Unternehmensnamen oder eine URL und möchtest Auslöser, Signale und Stakeholder in unter einer Minute
- Vorbereitung auf einen Kaltakquise-Anruf und Bedarf an Gesprächspunkten + wahrscheinlichen Einwänden
- Aufbau einer Ziel-Account-Liste und Priorisierung nach Passung + Timing
- Recherche zu einem Unternehmen, das gerade mit deinen Inhalten interagiert hat oder ein Meeting gebucht hat

## Wann NICHT verwenden
- Du hast bereits tiefen Account-Kontext von einem früheren AE oder im CRM
- Massen-Anreicherung von 50+ Accounts auf einmal — nutze stattdessen den `/lead-enrichment`-Skill
- Verbraucher-/B2C-Ziele — andere Signale und Recherchemethoden
- Wenn du nur E-Mail-Personalisierung benötigst — nutze `/sdr-agent` direkt

## Anweisungen

### Kern-Account-Brief-Eingabeaufforderung

```
Generiere einen SDR-Account-Brief für [UNTERNEHMENSNAME / URL].

Mein Produkt: [was du in einem Satz verkaufst]
Mein ICP: [ideales Kundenprofil — Größe, Branche, Rolle, Schmerz]

Erstelle:

## 1. Unternehmens-Snapshot (30 Sekunden)
- Was sie tun (1 Satz, kein Fachjargon)
- Größe: Mitarbeiterzahl, Umsatzschätzung, Finanzierungsphase
- Hauptsitz und Hauptmärkte
- Tech-Stack-Signale (aus Stellenausschreibungen, BuiltWith, G2-Bewertungen)
- Geschäftsmodell: PLG / vertriebsgeführt / Self-serve / Enterprise

## 2. Aktuelle Auslöser (warum JETZT kontaktieren — nicht vor 6 Monaten)
Scan nach:
- Finanzierungsrunde in den letzten 90 Tagen → Budget freigeschaltet
- Führungskraft eingestellt (neuer VP Sales, CRO, CFO) → neuer Käufer mit Auftrag zur Veränderung
- Produkteinführung → Skalierungsmodus, neue Einstellungen
- Entlassungen → Effizienzmandat, Kosteneinsparungen
- Akquisition → Integrationsschmerz, neuer Tech-Stack-Bedarf
- Stellenausschreibungen für Rollen, die dein Produkt entfernt oder verbessert

## 3. ICP-Passbewertung (0-100)
Bewertung nach diesen Dimensionen:
- Unternehmensgröße Passung: [Gewicht 25]
- Branchenpassung: [Gewicht 20]
- Tech-Stack-Überschneidung: [Gewicht 20]
- Auslöser/Timing: [Gewicht 25]
- Entscheider-Zugänglichkeit: [Gewicht 10]

## 4. Stakeholder-Karte
3 zu kontaktierende Personen identifizieren (Champion, Wirtschaftlicher Käufer, Blocker):
- Name, Titel, LinkedIn-URL (falls öffentlich)
- Warum sie sich für dein Produkt interessieren
- Bester Kanal zur Kontaktaufnahme
- Aktuelle Aktivität oder Post zum Referenzieren

## 5. Personalisierter Outreach-Winkel
- Der EINE Hook, der diesen Outreach jetzt relevant macht
- Vorgeschlagene Betreffzeile (A/B-Variante)
- Erster Satzentwurf (nicht generisch — spezifischen Auslöser referenzieren)
- Einwand, den sie wahrscheinlich zuerst erheben werden
```

### Kurz-Brief (CLI-Stil — unter 10 Sekunden)

```
Schneller SDR-Brief — [UNTERNEHMEN]:
- Was sie tun: [1 Satz]
- Auslöser: [das aktuellste Signal — Finanzierung, Führungskraft eingestellt, Stellenausschreibung]
- Wen kontaktieren: [Name, Titel]
- Einstiegs-Hook: [1 Satz, der den Auslöser referenziert]
- Risiko: [was sie möglicherweise NICHT passend macht]
```

### Auslöser-Recherche-Framework

Verwende dies, um Signale zu finden, die Claude recherchieren kann:

```typescript
interface TriggerSignal {
  type: 'funding' | 'exec_hire' | 'product_launch' | 'layoffs' | 'acquisition' | 'hiring_surge' | 'tech_change'
  recency: number // days ago
  relevance: number // 0-1, how relevant is this to your product
  hook: string // how to reference it in outreach
}

const TRIGGER_SOURCES = [
  'Crunchbase / TechCrunch — funding rounds',
  'LinkedIn — exec hires in last 90 days',
  'Company blog — product announcements',
  'LinkedIn Jobs — open roles (signal: 10+ eng roles = growth)',
  'G2 / Capterra reviews — what tools they use and hate',
  'Glassdoor — culture signals, tech stack mentions',
  'SEC filings — public companies only, use earnings calls for pain points',
  'Reddit/HN — if technical founders, check what they complain about',
]

// Priority order: funding > exec hire > product launch > layoffs > hiring surge > tech change
// Older than 90 days: deprioritise — timing has passed
```

### Stakeholder-Mapping-Eingabeaufforderung

```
Kartiere das Einkaufskomitee für [UNTERNEHMEN] für einen [PRODUKTKATEGORIE]-Kauf.

Typische Rollen bei dieser Kaufentscheidung:
- Champion (nutzt das Produkt täglich, setzt sich intern ein)
- Wirtschaftlicher Käufer (unterzeichnet den Vertrag, kümmert sich um ROI)
- Technischer Evaluator (bewertet Sicherheit, Integration, Skalierbarkeit)
- Blocker (Legal, Finance, IT — kann Deals verhindern)

Für jede Rolle:
1. Wer bei [UNTERNEHMEN] füllt sie wahrscheinlich aus? (Name falls auf LinkedIn findbar)
2. Was ist ihnen am wichtigsten?
3. Welchen Einwand erheben sie?
4. Welche Botschaft bringt sie dazu, Ja zu sagen?

Tabelle ausgeben: Rolle | Name | Titel | Schmerz | Botschaft | Einwand
```

### ICP-Scoring-Rubrik (pro Produkt anpassen)

```
ICP-Scoring — [PRODUKTNAME]

UNTERNEHMENSGRÖSSE (25 Pkt):
- 50-500 Mitarbeiter: 25 Pkt
- 500-2000: 15 Pkt
- <50 oder >2000: 5 Pkt

BRANCHE (20 Pkt):
- Zielverticals [Ihre auflisten]: 20 Pkt
- Angrenzend: 10 Pkt
- Außerhalb: 0 Pkt

TECH-STACK (20 Pkt):
- Nutzt [Ihre Integrationspartner]: +5 Pkt jeder, max 20
- Nutzt direkten Wettbewerber: -10 Pkt (schwererer Verkauf, aber möglich)

AUSLÖSER (25 Pkt):
- Finanzierung in 90 Tagen: 25 Pkt
- Führungskraft eingestellt in 90 Tagen: 20 Pkt
- Produkteinführung: 15 Pkt
- Einstellungszunahme (>20% Mitarbeiterwachstum): 15 Pkt
- Kein aktueller Auslöser: 5 Pkt

ENTSCHEIDER-ZUGANG (10 Pkt):
- Direkte LinkedIn-Verbindung zum Käufer: 10 Pkt
- 2.-Grad-Verbindung: 7 Pkt
- Keine Verbindung: 3 Pkt

GESAMT: /100
- 80+: Priorität 1 — sofort personalisierter Outreach
- 60-79: Priorität 2 — Sequenz innerhalb von 2 Wochen
- 40-59: Priorität 3 — Nurture
- <40: Keine Passung — überspringen
```

### Recherche-Ausgabe-Vorlage

```markdown
# Account-Brief: [UNTERNEHMEN] — [DATUM]

## Snapshot
[Unternehmen] ist ein [Beschreibung]. [Mitarbeiter] Mitarbeiter. [Finanzierungsphase].
Primärmarkt: [Geografie + Segment]. Tech-Stack: [wichtige Tools].

## Warum Jetzt (Auslöser)
[AUSLÖSERTYP] — [spezifisches Ereignis, Datum, Quelle].
Relevanz: [wie das mit Ihrem Produkt/Schmerzpunkt zusammenhängt].

## ICP-Score: [X]/100
- Größe: [X/25] | Branche: [X/20] | Stack: [X/20] | Auslöser: [X/25] | Zugang: [X/10]

## Wen Kontaktieren
| Rolle | Name | Titel | LinkedIn | Priorität |
|---|---|---|---|---|
| Champion | [Name] | [Titel] | [URL] | 1. |
| Wirtschaftlicher Käufer | [Name] | [Titel] | [URL] | 2. |
| Blocker | [Name] | [Titel] | [URL] | Zur Info |

## Outreach-Winkel
Hook: [der spezifische auslöserbasierte Hook]
Betreff: [A-Version] / [B-Version]
Einstieg: [Erster Satz, der den Hook referenziert — nicht generisch]
Wahrscheinlicher Einwand: [Wogegen sie zuerst werden]
```

## Beispiel

**Benutzer:** Gib mir einen Account-Brief zu Vercel. Ich verkaufe ein B2B-Observability-Tool für Frontend-Performance.

**Ausgabe:**
```markdown
# Account-Brief: Vercel — Juni 2026

## Snapshot
Vercel ist eine Cloud-Plattform für Frontend-Entwickler, genutzt von 1M+ Entwicklern weltweit.
~1.200 Mitarbeiter. Series E (150 Mio. $, 2023). Hauptsitz: San Francisco. Stack: Next.js (eigen),
Turborepo, Datadog, PagerDuty, Segment.

## Warum Jetzt (Auslöser)
NEUE FÜHRUNGSKRAFT EINGESTELLT — VP of Platform Engineering von Cloudflare eingestellt (LinkedIn, vor 14 Tagen).
Neue Platform-Führungskräfte prüfen Monitoring-Tools typischerweise in den ersten 90 Tagen.
Relevanz: Vercels Skalierung (Millionen Deploys/Tag) erzeugt Frontend-Latenz-Komplexität,
die ihr aktueller Stack (Datadog) nicht optimiert.

## ICP-Score: 88/100
- Größe: 25/25 | Branche: 20/20 | Stack: 15/20 | Auslöser: 25/25 | Zugang: 3/10

## Wen Kontaktieren
| Rolle | Name | Titel | LinkedIn | Priorität |
|---|---|---|---|---|
| Champion | [VP Platform] | VP Platform Engineering | [URL] | 1. |
| Wirtschaftlicher Käufer | [CTO] | CTO | [URL] | 2. |
| Blocker | [IT/Security] | Head of Security | [URL] | Zur Info |

## Outreach-Winkel
Hook: Neuer VP Platform in dieser Skalierung — Datadog zeigt Frontend-Latenz nicht nach Edge-Node
Betreff A: "Frontend-Observability für Vercels Skalierung" / Betreff B: "Wie [X] die p95-Latenz um 40% reduziert hat"
Einstieg: "Herzlichen Glückwunsch zur VP-Platform-Einstellung — Teams in Ihrer Skalierung stellen in den ersten 90 Tagen typischerweise fest, dass allgemeine APM-Tools wie Datadog Frontend-spezifische Observability-Lücken haben."
Wahrscheinlicher Einwand: "Wir haben bereits Datadog / wir haben das intern gebaut"
```

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
