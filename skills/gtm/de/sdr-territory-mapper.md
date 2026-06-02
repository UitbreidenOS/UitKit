---
name: sdr-territory-mapper
description: "SDR-Gebietsanalyse: Account-Abdeckung kartieren, Whitespace identifizieren, nach ICP-Dichte und Auslösersignal-Konzentration priorisieren, Gebietspläne und Abdeckungsberichte erstellen"
---

# SDR-Gebiets-Mapper-Skill

## Wann aktivieren
- Planung einer neuen Gebietszuweisung für einen SDR oder AE
- Überprüfung deines aktuellen Gebiets auf Whitespace und unberührte Accounts
- Quartalsweise Gebietsplanung und Headcount-Abstimmung
- Identifizierung, welche Segmente oder Geografien die höchste ICP-Dichte haben
- Präsentation eines Gebietsplans vor deinem Manager oder in einem QBR
- Neuausbalancierung von Gebieten nach Teamänderungen oder einem Markt-Pivot

## Wann NICHT verwenden
- Einzelne Account-Recherche — nutze dafür `/sdr-research-brief`
- Vollständige RevOps-Prognose — nutze `/revenue-operations` für Pipeline-Metriken
- Kundensegmentierung für CS — andere Funktion und Signale
- TAM/SAM/SOM für Investor-Decks — nutze dafür `/pitch-deck`

## Anweisungen

### Gebiets-Gesundheitscheck

```
Führe einen Gebiets-Gesundheitscheck für [GEBIET — z.B. "Mid-Market EMEA, 200-1000 Mitarbeiter, SaaS-Verticals"] durch.

Mein Produkt: [was du verkaufst]
Mein ICP: [Unternehmensgröße, Branche, Tech-Stack, Zielrolle]
Verfügbare Gebietsdaten: [CRM-Export / Apollo-Liste / LinkedIn Sales Navigator Export / manuelle Liste]

[ACCOUNT-LISTE ODER DATEN EINFÜGEN]

Analysiere:

## 1. Abdeckungs-Zusammenfassung
- Gesamte Accounts im Gebiet: [N]
- Accounts mindestens einmal kontaktiert: [N] ([%])
- Nie kontaktierte Accounts: [N] — das ist der Whitespace
- Accounts in aktiver Sequenz: [N]
- Accounts mit offenen Opportunities: [N]
- Accounts Closed-Won: [N]
- Accounts Closed-Lost: [N] → förderfähig für Re-Engagement in [X Monaten]?

## 2. ICP-Dichte nach Segment
Accounts aufteilen nach:
- Unternehmensgrößen-Bucket (50-200 / 200-500 / 500-1000 / 1000+)
- Branchen-Vertical
- Geografie (Land/Region)
Identifizieren: welches Segment hat die höchste ICP-Dichte UND niedrigste Abdeckung = Prioritäts-Whitespace

## 3. Auslösersignal-Konzentration
Welches Segment hat die meisten Accounts mit aktiven Auslösern gerade?
(Finanzierungen, Führungskräfte eingestellt, Produkteinführungen, Einstellungszunahmen)
Das sind deine Hochwahrscheinlichkeits-Ziele diesen Monat.

## 4. Prioritäts-Account-Liste
Top-25-Accounts für dieses Quartal:
Gerankt nach: ICP-Score × Auslöser-Aktualität × Kontakt-Zugänglichkeit
| Rang | Account | ICP-Score | Auslöser | Letzter Kontakt | Priorität |
|---|---|---|---|---|---|

## 5. Gebiets-Lücken
- Segmente, in denen du unterpenetriert bist
- Branchen ohne Abdeckung
- Geografien mit Accounts aber ohne Outreach
- Rollen, die du noch nicht angesprochen hast (nur VP Sales per E-Mail, nicht CTO)

## 6. Empfohlene wöchentliche Kadenz
Basierend auf Gebietsgröße und Pipeline-Zielen:
- Täglich zu recherchierende Accounts: [N]
- Neue Outreach-Starts pro Woche: [N]
- Follow-ups pro Tag: [N]
- Tägliches Anrufziel: [N]
```

### ICP-Dichte-Mapping-Eingabeaufforderung

```
Kartiere ICP-Dichte in meinem Zielmarkt.

ICP-Definition:
- Branche: [Liste]
- Unternehmensgröße: [X-Y Mitarbeiter]
- Geografie: [Region/Land]
- Tech-Stack-Signale: [Tools, die Passung anzeigen]
- Zielrollen: [Titel]

Datenquelle: [Apollo-Export / LinkedIn Sales Nav / CRM / manuell]

[DATEN EINFÜGEN]

Ausgabe:
1. Heatmap nach Segment — wo ist ICP-Dichte am höchsten?
2. Unterversorgte Segmente — hohe ICP-Dichte, niedrige bestehende Abdeckung
3. Übersättigte Segmente — hoher Wettbewerb, abnehmende Erträge
4. Empfohlen: wo 80% des Outreach-Aufwands dieses Quartal zu fokussieren
```

### Whitespace-Identifizierungs-Eingabeaufforderung

```
Identifiziere Whitespace in meinem Gebiet.

[CRM-EXPORT ODER ACCOUNT-LISTE EINFÜGEN]
[IN DEN LETZTEN 6 MONATEN BEREITS KONTAKTIERTE ACCOUNTS EINFÜGEN]

Whitespace = Accounts, die:
1. ICP-Kriterien entsprechen
2. In den letzten 6 Monaten NICHT kontaktiert wurden
3. Mindestens ein aktives Auslösersignal haben (Finanzierung, Einstellung, Führungskraft eingestellt)

Ausgabe:
- Gesamte Whitespace-Accounts: [N]
- Top-20-Whitespace-Accounts gerankt nach ICP-Score + Auslöser-Aktualität
- Ansatz: kalt, warm (gemeinsame Verbindung) oder forschungszuerst
```

### Gebietsplan-Dokument (für Manager-Review)

```
Schreibe einen quartalsweisen Gebietsplan für Q[X] [JAHR].

Gebiet: [Definition]
SDR/AE: [Name]
Quota: [$ oder Meeting-Ziel]
Performance letztes Quartal: [Erreichungs-%]

Generiere:

## Gebietsübersicht
[1 Absatz — was das Gebiet ist und warum es ein guter Markt ist]

## ICP-Analyse
[Welche Unternehmen im Gebiet am besten passen und warum]

## Top-Accounts (Priorität 1)
[Top-10-Accounts — warum jeder eine Priorität ist, Auslösersignal, Kontaktstrategie]

## Abdeckungsplan
[Wöchentliche Aktivitätsaufschlüsselung — Recherche, neuer Outreach, Follow-ups, Anrufe]

## Pipeline-Projektion
[Erwartete gebuchte Meetings, Konversion zu Pipeline, projizierter Umsatzbeitrag]

## Ressourcenbedarf
[Welche Unterstützung benötigt wird — Marketing-Kampagnen, Inhalte, Einführungen, Tools]

## Risiken und Gegenmaßnahmen
[Was schiefgehen könnte und die Notfallplanung]
```

### Account-Scoring-Modell für Gebietspriorisierung

```typescript
interface TerritoryAccount {
  company: string
  employees: number
  industry: string
  techStack: string[]
  lastContactedDaysAgo: number | null
  triggerSignals: TriggerSignal[]
  linkedInConnections: number // 2nd-degree connections
  crmStatus: 'never_contacted' | 'in_sequence' | 'opportunity' | 'closed_lost' | 'closed_won'
}

function scoreTerritoryAccount(account: TerritoryAccount, icp: ICPCriteria): number {
  let score = 0

  // ICP fit (50 points)
  score += scoreCompanySize(account.employees, icp.sizeRange) * 0.2    // max 20
  score += scoreIndustry(account.industry, icp.industries) * 0.15       // max 15
  score += scoreTechStack(account.techStack, icp.techStack) * 0.15     // max 15

  // Timing (30 points)
  const recentTriggers = account.triggerSignals.filter(t => t.recencyDays <= 90)
  score += Math.min(30, recentTriggers.length * 10)

  // Accessibility (10 points)
  score += Math.min(10, account.linkedInConnections * 2)

  // Contact recency penalty (10 points)
  if (account.lastContactedDaysAgo === null) {
    score += 10 // Never contacted — fresh territory = bonus
  } else if (account.lastContactedDaysAgo > 180) {
    score += 7  // Eligible for re-engagement
  } else if (account.lastContactedDaysAgo > 90) {
    score += 3
  } else {
    score -= 10 // Recently contacted — reduce priority
  }

  // CRM status adjustment
  if (account.crmStatus === 'closed_lost') score += 5  // Can re-engage
  if (account.crmStatus === 'closed_won') score -= 50  // Never cold outreach existing customers

  return Math.max(0, Math.min(100, score))
}

function buildTerritoryPriorityList(
  accounts: TerritoryAccount[],
  icp: ICPCriteria,
  topN: number = 25
): TerritoryAccount[] {
  return accounts
    .map(account => ({ account, score: scoreTerritoryAccount(account, icp) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ account }) => account)
}
```

### Re-Engagement-Identifizierung

```
Identifiziere Closed-Lost-Accounts, die für Re-Engagement geeignet sind.

[CRM-EXPORT ODER CLOSED-LOST-LISTE EINFÜGEN]

Re-Engagement-Kriterien:
- Deal vor mehr als [90/180] Tagen verloren
- Verlustgrund ist NICHT: "nie gepasst" / "falsches Unternehmen" / "abgemeldet"
- Unternehmen hat ein neues Auslösersignal seit Deal-Abschluss
- ODER: neuer Entscheider ist seit Deal-Abschluss beigetreten

Ausgabe:
- Förderfähige Accounts: [N]
- Top-10-Re-Engagement-Ziele gerankt nach: neue Auslöserstärke + Zeit seit Verlust
- Empfohlener Ansatz: [Kaltstart / warme E-Mail mit Bezug auf Geschichte / nur neuer Kontakt]
- Betreffzeilen-Vorschlag für Re-Engagement-E-Mail
```

## Beispiel

**Benutzer:** Gebietsplanung Q3. Ich habe EMEA Mid-Market SaaS, 200-1000 Mitarbeiter. Mein CRM-Export zeigt 847 Accounts, nur 312 wurden in den letzten 6 Monaten kontaktiert. Hilf mir zu priorisieren.

**Ausgabe:**

**Abdeckungs-Zusammenfassung:**
- 847 Accounts gesamt | 312 berührt (37%) | **535 Whitespace-Accounts** (63%)
- Aktive Sequenzen: 89 Accounts
- Offene Opportunities: 23 Accounts
- Closed-Lost förderfähig für Re-Engagement: 67 Accounts (vor 90+ Tagen verloren mit neuen Auslösern)

**Prioritätsaufschlüsselung:**
- Priorität 1 (ICP-Score 80+, aktueller Auslöser): 48 Accounts → 100% des Outreach Woche 1-2
- Priorität 2 (ICP-Score 60-79, kein Auslöser): 127 Accounts → Outreach Woche 3-6
- Priorität 3 (ICP-Score 40-59): 360 Accounts → nur Low-Touch-Sequenz
- Deprioritisieren (<40 Score): 312 Accounts → dieses Quartal ausschließen

**Whitespace-Hotzone:** UK-basierte FinTech (100-500 Mitarbeiter) — 34 nicht kontaktierte Accounts mit hoher ICP-Dichte, 12 mit Finanzierungsauslösern in den letzten 60 Tagen. Das ist dein Q3-Sprint-Ziel.

**Wochenplan:**
- Mo-Di: 8 neue Accounts recherchiert + Sequenz gestartet
- Mi-Do: 15 Follow-ups + 20 Anrufe
- Fr: Pipeline-Review + Vorbereitung nächste Woche
- Ziel: 12 neue Meetings gebucht / Monat → 36 Meetings / Quartal

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
