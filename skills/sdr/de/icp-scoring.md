# ICP-Bewertung

## Wann aktiviert werden

Sie prospektieren B2B-SaaS-Unternehmen und müssen Leads gegen ein definiertes Ideal Customer Profile (ICP) qualifizieren. Auslösung wenn: Bewertung eines neuen Leads für Outreach-Ebene, Priorisierung einer Prospect-Liste, Entscheidung über Kontakttiefe für ein Unternehmen, oder Validierung der Passung vor Sales-Übergabe.

## Wann NICHT verwenden

- Sie haben einen Lead bereits in einem Customer Success-/Retention-Workflow — verwenden Sie stattdessen Churn-Prevention-Frameworks.
- Der Prospect ist bereits Kunde oder aktive Opportunity in Ihrem CRM — dies ist nur für Neuprospektion gedacht.
- Sie führen Lead-Generierungs-Sourcing durch (Finden von *welchen* Unternehmen zu prospektieren sind) — dies ist für *Qualifizierung* von Unternehmen, die Sie bereits identifiziert haben.
- Das Zielunternehmen hat weniger als 10 Mitarbeiter oder befindet sich in einer Disqualifizierungs-Branche — Bewertung ist sinnlos; als "Do-Not-Contact" markieren.

## Anleitung

### 3-Schichten-ICP-Definition

Jedes ICP ist über drei orthogonale Dimensionen definiert. Bewerten Sie jede unabhängig und kombinieren Sie dann.

**Schicht 1: Firmografische Passung (0–40 Punkte)**

Objektive Unternehmensattribute, die strukturelle Kauffähigkeit bestimmen.

| Attribut | Ziel | Punkte |
|---|---|---|
| **Branchenvertikale** | Primär (z. B. SaaS, FinTech, Healthcare Tech) | 20 |
| Sekundäre Passung (benachbart, bewährter Anwendungsfall) | 10 |
| Falsche Vertikale (Disqualifizierer) | 0 |
| **Unternehmensgröße (Headcount)** | 50–500 | 15 |
| 25–49 oder 501–1.000 | 8 |
| 10–24 oder 1.001+ | 2 |
| Unter 10 | 0 (Hard Disqualifier) |
| **Jährliche wiederkehrende Einnahmen (ARR)** | $5M–$100M | 5 |
| $2M–$4,9M oder $100M–$500M | 3 |
| Unter $2M oder über $500M | 0 |
| **Geografie** | USA, UK, Kanada, Westeuropa (primär) | In obigen enthalten; Sekundärmärkte mit 80% bewertet |

*Firmografisches Limit: 40 Punkte. Ein Unternehmen, das in allen Attributen perfekt ist, erhält 40 Punkte.*

**Schicht 2: Technografische Passung (0–30 Punkte)**

Tech-Stack- und Infrastruktursignale, die Produktpassung oder Disqualifizierung anzeigen.

Bewertung basierend auf *Vorhandensein* von Signalen (nicht deren Abwesenheit). Überprüfen Sie: öffentliche Tech-Stacks (StackShare, LinkedIn, Job-Angebote, Finanzierungspräsentationen), öffentliche GitHub-Repositories, Jobausschreibungen für Tech-Rollen, Gründungs-/Finanzierungsankündigungen.

| Signaltyp | Beispiele | Punkte |
|---|---|---|
| **Core-Passung** (Ihre Lösung passt direkt in ihren Stack) | Verwenden von Node.js, PostgreSQL, Kubernetes; Suche nach „DevOps Engineer"; öffentliche Diskussionen über Microservices | 15 |
| **Sekundäre Passung** (starke Nähe) | Cloud-Infrastruktur (AWS, GCP, Azure); CI/CD-Erwähnungen; Datenpipeline-Investitionen | 10 |
| **Schwaches Signal** (allgemeine moderne Technologie, nicht spezifisch für Ihr ICP) | Standard-SaaS-Stack (React, Python, typisches AWS); keine roten Flaggen, aber keine starke Passung | 5 |
| **Hard Disqualifier** | Gesperrt in Konkurrenz-Tech-Stack; nur Legacy-Mainframe; völlig inkompatible Vendor-Nutzung | 0 |

*Wählen Sie die höchste gefundene Signalkategorie aus. Technografisches Limit: 30 Punkte.*

**Schicht 3: Verhaltenssignale (0–20 Punkte)**

Aktuelle Impulse und Wachstumssignale, die Kaufabsicht und Budgetallokation anzeigen.

| Signal | Aktualität | Punkte |
|---|---|---|
| **Finanzierungsrunde** (Serie A oder später, nicht Seed) | Letzte 12 Monate | 8 |
| 13–24 Monate zurück | 5 |
| Über 24 Monate | 2 |
| **Einstellungswelle** (öffentlich ausgeschriebene 5+ Positionen in Ihrer Zielabteilung: Engineering, Daten, Produkt) | Letzte 30 Tage | 8 |
| 31–90 Tage zurück | 5 |
| Über 90 Tage | 2 |
| **Expansionssignale** (neues Büro, neue Produkteinführung, neuer Markteintritt, neues Integrations-Ökosystem) | Letzte 90 Tage | 4 |

*Verhaltenslimit: 20 Punkte. Mehrere Signale sind additiv bis zu 20 Punkten.*

### Aktualitätsverlust (0–10 Punkte Bonus/Abzug)

Alle firmografischen Daten werden veraltet. Passen Sie die Endnote basierend auf Datenaktualität an.

| Datenaktualität | Anpassung |
|---|---|
| Alle ICP-Attribute in den letzten 30 Tagen verifiziert | +10 |
| In den letzten 31–90 Tagen verifiziert | +5 |
| In den letzten 91–180 Tagen verifiziert | 0 |
| Über 180 Tage alt (keine aktuelle Verifikation) | –5 |

*Beispiel: Ein 75-Punkte-Lead mit 6 Monate alten Mitarbeiterzahldaten erhält 70 Punkte.*

### Vollständiges Bewertungsmodell: 0–100

**Formel:**
```
SCORE = Firmografisch (0–40) + Technografisch (0–30) + Verhaltensmäßig (0–20) + Aktualität (–5 bis +10)
BEREICH: 0–100
```

### Hard Disqualifiers (Score = 0, alle Ebenen überspringen)

Auch wenn andere Dimensionen hoch bewerten, kennzeichnen Sie den Lead als **Do-Not-Contact**, wenn eines der folgenden zutrifft:

1. **Konkurrenz** — Sie bauen/verkaufen ein konkurrierendes Produkt.
2. **Bestehender Kunde** — Bereits in Ihrer Kundenbasis oder aktivem Test.
3. **Falsche Branchenvertikale** — Außerhalb Ihrer definierten primären/sekundären Vertikalen (z. B. Regierungsauftragnehmer, wenn Sie SaaS anvisieren).
4. **Headcount unter 10** — Zu klein für Kaufprozess oder Budget.
5. **Explizite Disqualifizierungssignale** — Öffentliche Aussagen gegen Ihre Kategorie; ausschließliche Nutzung inkompatibel Vendor; Insolvenzmitteilungen oder Entlassungsankündigungen, die Budgeteinfrierung anzeigen.

### Tier-Definitionen & Action Playbooks

Nach der Bewertung (und Bestätigung, dass keine Hard Disqualifiers vorhanden sind) leiten Sie zum Outreach-Tier weiter:

#### Tier 1 (80–100 Punkte)
**Merkmale:** Perfekte oder nahezu perfekte Passung. ICP-Übereinstimmung in 2+ Dimensionen. Aktuelle Signale.

**Outreach-Playbook:**
- Manuelle umfassende Recherche: Lesen Sie die letzten 3 Earnings Calls (falls öffentlich), aktuelle Blog-Posts, CEO Twitter, LinkedIn Hiring Posts, aktuelle Finanzierungsankündigungen.
- Identifizieren Sie 2–3 spezifische, personalisierte Hooks (z. B. „Ich habe bemerkt, dass Sie letzten Monat 7 Engineering-Positionen ausgeschrieben haben; wir helfen Teams wie Ihrem, die Onboarding-Zeit um 40% zu reduzieren").
- Personalisierte E-Mail-Sequenz: 5er-Touch, 21-Tage-Kadenz. Custom Hook in E-Mail 1. Referenzen auf spezifischen Unternehmensmeilenstein in E-Mail 3. Social Touch (LinkedIn-Kommentar zu aktuellem Post) als Touch 4.
- Sales-Beteiligung: Zuordnung zu benanntem Account Executive. Nutzen Sie das vollständige Sales Development Playbook.

**Antwortzitate-Benchmark:** 8–12% Reply Rate (mit Personalisierung).

#### Tier 2 (50–79 Punkte)
**Merkmale:** Starke Passung in 1 Dimension, angemessene Passung in anderen. Klare ICP-Übereinstimmung, aber möglicherweise fehlende aktuelle Impulse.

**Outreach-Playbook:**
- Template E-Mail mit 1 Personalisierungs-Hook (z. B. „Ihr Team hat letztes Quartal 6 Ingenieure eingestellt; wir helfen Teams wie [ähnliches Unternehmen], [Outcome] zu reduzieren").
- Standard-3er-Touch-Sequenz über 14 Tage: E-Mail → 5 Tage Wartezeit → LinkedIn-Nachricht → 3 Tage Wartezeit → Abschließende E-Mail.
- Keine manuelle umfassende Recherche; verwenden Sie nur öffentliche Signale (LinkedIn, StackShare, Finanzierungsankündigungen).
- Leichte Sales-Beteiligung: Nur SDR, keine AE-Zuordnung.

**Antwortzitate-Benchmark:** 4–6% Reply Rate.

#### Tier 3 (20–49 Punkte)
**Merkmale:** Teilweise Passung. ICP-Übereinstimmung nur in einer Dimension, oder schwache Signale über mehrere Dimensionen hinweg.

**Outreach-Playbook:**
- Template E-Mail (keine Personalisierung). Nur ein einziger Touch.
- Batch-and-Blast: Senden in Bulk-Kampagnen. Keine Folgesequenz.
- Verwendung für Listenaufbau und Markenbekanntheit, nicht direkte Verkäufe.
- Keine Sales-Beteiligung.

**Antwortzitate-Benchmark:** 1–2% Reply Rate (erwarten Sie niedrige Beteiligung).

#### Unter 20 Punkte
**Aktion:** Nicht kontaktieren. In „Nurture"-Segment für zukünftige Kampagnen verschieben. Quartalsweise neu bewerten.

---

### Bewertungs-Prompt-Template

Verwenden Sie diese Prompt-Struktur, um einen Lead mit Claude zu bewerten:

```
Bewerten Sie dieses Unternehmen anhand unseres 0–100-Modells gegen unser ICP.

UNTERNEHMEN: [Unternehmensname]
BRANCHE: [Branche]
MITARBEITERZAHL: [Zahl] (Quelle: [LinkedIn/PitchBook/etc])
ARR: [Geschätzt oder öffentlich $] (Quelle: [wie Sie es wissen])
GEOGRAFIE: [Land/Region]

TECH-STACK-SIGNALE:
- [Tool/Plattform 1] (Quelle: [Jobausschreibung/StackShare/GitHub])
- [Tool/Plattform 2]
- [Tool/Plattform 3]

VERHALTENSSIGNALE:
- Finanzierung: [Serie X, $Y, Datum] (Quelle: [Crunchbase/Pressemitteilung])
- Einstellung: [Anzahl der offenen Stellen in Ihrer Zielabteilung, Ausschreibungsdaten] (Quelle: [LinkedIn Jobs])
- Expansion: [Neuer Markt/Büro/Produkteinführung] (Quelle: [Ankündigung])

DATENAKTUALITÄT: Alle Daten verifiziert [Datumsbereich]

AUFGABE:
1. Bewerten Sie jede Dimension unabhängig (Firmografisch, Technografisch, Verhaltensmäßig, Aktualität).
2. Identifizieren Sie alle Hard Disqualifiers.
3. Zurück: GESAMTNOTE, TIER, EMPFEHLUNG (Kontakttiefe + Sequenztyp).
4. Listen Sie die Top 2 Personalisierungs-Hooks auf (wenn Tier 1 oder 2).

Format-Antwort als:
---
**SCORE: [0-100]**
**TIER: [1/2/3/Do Not Contact]**
**DISQUALIFIERS:** [Keine / Alle gefundenen aufzählen]
**FIRMOGRAFISCH:** [X Punkte] — [Begründung]
**TECHNOGRAFISCH:** [X Punkte] — [Begründung]
**VERHALTENSMÄSSIG:** [X Punkte] — [Begründung]
**AKTUALITÄTSANPASSUNG:** [+/- X Punkte]

**TOP-PERSONALISIERUNGS-HOOKS:**
1. [Hook 1 — spezifisch, zeitgebunden]
2. [Hook 2 — spezifisch, zeitgebunden]

**EMPFEHLUNG:** [Outreach-Playbook und nächster Schritt]
---
```

---

## Beispiel

### Szenario: TechVentures Inc. bewerten (Hypothetisches FinTech SaaS)

**Gesammelte Rohdaten:**

| Attribut | Wert | Quelle |
|---|---|---|
| Unternehmen | TechVentures Inc. | Crunchbase |
| Branche | FinTech (Zahlungsverarbeitung) | Website, LinkedIn |
| Mitarbeiterzahl | 180 | LinkedIn Company Page (vor 2 Wochen aktualisiert) |
| ARR | $18M | Crunchbase Finanzierung + Burn-Berechnung |
| Geografie | San Francisco, CA (USA) | Unternehmenswebsite |
| Tech-Stack | Python, PostgreSQL, AWS, Kubernetes, Node.js Microservices | Job-Angebote (Aug 2026), öffentliche GitHub-Repos |
| Finanzierung | Serie B, $45M, aufgelegt Mar 2026 | Crunchbase, TechCrunch |
| Einstellung | 12 offene Engineering-Stellen (in den letzten 30 Tagen ausgeschrieben) | LinkedIn Jobs-Seite |
| Expansion | UK-Expansion angekündigt (Jul 2025) | Unternehmens-Blog |
| Daten verifiziert | Jun 2026 | Diese Bewertungssitzung |

### Bewertung:

**FIRMOGRAFISCH (max 40):**
- Branchenfit (FinTech primäre Vertikale): 20 Punkte
- Mitarbeiterzahl (180, im Bereich 50–500): 15 Punkte
- ARR ($18M, im Bereich $5M–$100M): 5 Punkte
- **Summe: 40 Punkte** ✓

**TECHNOGRAFISCH (max 30):**
- Core-Fit: PostgreSQL + Python Microservices auf AWS/Kubernetes entspricht moderner SaaS-Infrastruktur (15 Punkte).
- Keine disqualifizierenden Signale.
- **Summe: 15 Punkte** ✓

**VERHALTENSMÄSSIG (max 20):**
- Finanzierung (Serie B, $45M, Mar 2026 = vor 3 Monaten): 8 Punkte
- Einstellungswelle (12 Engineering-Stellen, in den letzten <30 Tagen ausgeschrieben): 8 Punkte
- Expansion (UK-Büro angekündigt, aber vor 11+ Monaten): 2 Punkte
- **Summe: 18 Punkte** ✓

**AKTUALITÄT (±10):**
- Alle Daten in den letzten 30 Tagen verifiziert: +10 Punkte

---

### ENDSCORE: 40 + 15 + 18 + 10 = **83 Punkte**

### TIER: **Tier 1 (80–100)**

### DISQUALIFIERS: Keine

### EMPFEHLUNG:

**Outreach-Playbook — Tier 1:**

**Personalisierungs-Hooks:**
1. „Sie haben $45M in Serie B aufgelegt (Mar 2026) und stellen aggressiv ein (12 Engineering-Stellen offen). Wir helfen FinTech-Plattformen, die auf AWS/Kubernetes skalieren, die Infrastrukturkomplexität um 35% zu reduzieren—direkt relevant, wenn Sie in UK expandieren und Personal aufstocken."
2. „Sie haben auf PostgreSQL + Microservices gebaut, was genau dort ist, wo [unsere Lösung] am meisten Wert bietet. Teams wie Stripe und Wise nutzen uns, um Bereitstellungszyklen zu beschleunigen, wenn sie über Regionen hinweg skalieren."

**E-Mail-Sequenz (5 Touches, 21 Tage):**
- **Tag 1:** Personalisierte E-Mail. Betreff: „[CTO-Name], TechVentures' Wachstumstrajectorie + Microservices-Stack." Finanzierungsankündigungs-Callout + 1 Personalisierungs-Hook einbeziehen.
- **Tag 6:** Follow-up-E-Mail. „Hat meine vorherige E-Mail zu UK-Expansionsherausforderungen Sie erreicht?"
- **Tag 10:** LinkedIn-Nachricht an CTO/VP Engineering (anderer Nachrichtenwinkel).
- **Tag 14:** Value-Add-Touch: Relevante Case Study teilen (FinTech-Unternehmen, ähnliches ARR, Skalierungsszenario).
- **Tag 21:** Abschließende E-Mail. „Letzte Chance: Lassen Sie uns über Ihre Q3-Infrastrukturziele sprechen."

**Sales-Beteiligung:** Zuordnung zu benanntem AE. 30-Min.-Discovery-Call anstreben.

**Erwartetes Ergebnis:** 8–12% Reply Rate. Ziel für sofortige Sales-Qualifizierung.

---

**Ende des Bewertungsbeispiels. TechVentures Inc. ist ein Go für Outreach auf Tier 1-Intensität.**
