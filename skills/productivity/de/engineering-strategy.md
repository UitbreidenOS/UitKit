---
name: engineering-strategy
description: "Engineering-Strategiedokument: technische Vision, Build-vs.-Buy-Entscheidungen, Team-Topologie, 12-Monats-Roadmap"
---

# Engineering-Strategie-Skill

## Wann aktivieren
- Das Engineering-Strategiedokument für eine neue CTO-Rolle oder zu Beginn eines Planungszyklus schreiben
- Die Engineering-Richtung dem Vorstand, CEO oder Investoren vorstellen
- Entscheiden, ob man eine wichtige technische Fähigkeit aufbaut, kauft oder partnerschaftlich einbindet
- Die Team-Topologie nach signifikantem Wachstum, einer Reorganisation oder einem Produkt-Pivot neu gestalten
- Eine 12-Monats-Roadmap festlegen, die Produktlieferung mit Plattformgesundheit ausbalanciert
- Die technische Vision nach wichtigen Architekturentscheidungen dokumentieren

## Wann NICHT verwenden
- Individuelle Architekturentscheidungen — verwende dafür `/adr-writer`
- Sprint-Planung — verwende dein Projektmanagement-Tool
- Individuelle Rollen einstellen — verwende stattdessen eine Stellenbeschreibung und einen Einstellungsraster
- Post-Incident-Reviews — das ist ein spezifisches operatives Artefakt, kein Strategiedokument

## Anweisungen

### Vollständiges Engineering-Strategiedokument

```
Ein Engineering-Strategiedokument für [UNTERNEHMEN] schreiben.

Kontext:
- Unternehmensphase: [Seed / Series A / Series B / Wachstum / Enterprise]
- Aktuelle Engineering-Teamgröße: [X Ingenieure]
- Aktuelle Architektur: [Monolith / Microservices / Serverless / Hybrid]
- Haupttechnologie-Stack: [Sprachen, Frameworks, Cloud-Anbieter]
- Aktuelle größte technische Herausforderung: [z.B. Deployment-Geschwindigkeit, Zuverlässigkeit, Skalierung, technische Schulden]
- Geschäftlicher Kontext: [was das Unternehmen in den nächsten 12 Monaten zu erreichen versucht]
- Top-3-Produktprioritäten von CEO/CPO: [auflisten]

Ein Strategiedokument erstellen, das folgendes abdeckt:

## 1. Engineering-Vision (12 Monate)
Ein Absatz: Wie sieht unsere Engineering-Organisation in 12 Monaten aus?
Folgendes spezifisch ansprechen:
- Deployment-Häufigkeit (Ziel)
- Systemzuverlässigkeit (Uptime / Fehlerrate-Ziel)
- Teamstruktur (wie viele Teams, welches Modell)
- Developer-Experience (wie schnell kann ein neuer Ingenieur sein erstes Feature liefern?)

## 2. Ist-Zustand-Bewertung
Ehrliche Diagnose — was funktioniert, was ist kaputt:
- Architektur: [aktueller Stand und wichtigste Einschränkungen]
- Technische Schulden: [wenn möglich quantifizieren — % der Entwicklungszeit, die verloren geht]
- Deployment-Geschwindigkeit: [aktuelle Deployments/Tag oder Woche]
- Zuverlässigkeit: [aktuelle Uptime, Incident-Rate]
- Teamstruktur: [aktuelle Topologie und wo sie versagt]

## 3. Strategische Prioritäten (gerankt)
Top 3-5 Engineering-Wetten für die nächsten 12 Monate.
Für jede Priorität:
- Was es ist
- Warum es wichtig ist (geschäftliche Auswirkung, keine technische Eleganz)
- Wie Erfolg aussieht (messbar)
- Ungefähr erforderliche Investition (Engineering-Wochen / Köpfe)

## 4. Build vs. Buy vs. Partner
Für jede wichtige technische Fähigkeit, die wir benötigen:
| Fähigkeit | Aufbauen | Kaufen | Partner | Empfehlung | Begründung |
Kriterien verwenden:
- Kerndifferenziator? → Aufbauen
- Allgemeines/gelöstes Problem? → Kaufen
- Reichweite/Netzwerk benötigt? → Partner
- Time-to-Market kritisch? → Eher Kaufen

## 5. Team-Topologie
Aktuelle → Zielstruktur über 12 Monate.
Zu wählende Teammodelle:
- Stream-aligned Teams (Produkt-Feature-Besitz)
- Platform-/Enabling-Teams (Developer-Experience, Infra)
- Complicated-Subsystem-Teams (ML, Suche, Datenpipeline)
Team-Topologies-Vokabular verwenden: stream-aligned, platform, enabling, complicated subsystem.
Für jedes Team: Mission, Größe, technischer Besitz, Schnittstellen zu anderen Teams.

## 6. Technologiewetten
Worauf wir uns in den nächsten 2-3 Jahren festlegen?
- Kernsprachen und Frameworks (worauf wir standardisieren)
- Cloud-Anbieter und wichtige verwaltete Dienste
- Was wir aufgeben (Sunset-Plan)
- Was wir beobachten, aber noch nicht festlegen

## 7. Engineering-Gesundheitsmetriken
Wie messen wir, ob die Strategie funktioniert?
| Metrik | Aktuell | 6-Monats-Ziel | 12-Monats-Ziel |
Einschließen: DORA-Metriken (Deployment-Häufigkeit, Lead Time, MTTR, Change-Failure-Rate), Verfügbarkeit, Developer-NPS, Tech-Debt-Verhältnis.

## 8. Risiken und Gegenmaßnahmen
Top 3 Risiken für diese Strategie:
- Risiko, Wahrscheinlichkeit, Auswirkung, Gegenmaßnahme

## 9. Investitionsanforderung
Was wir benötigen, um diese Strategie umzusetzen?
- Kopfzahl: [X Ingenieure in den nächsten 12 Monaten einzustellen]
- Tooling-Budget: [$X für Build-vs.-Buy-Entscheidungen]
- Infrastruktur: [erwartete Infrastrukturkostenänderung]
```

### Build-vs.-Buy-Entscheidungsrahmen

```
Helfe mir zu entscheiden, ob ich [FÄHIGKEIT] aufbauen oder kaufen soll.

Beschreibung der Fähigkeit: [was wir damit tun müssen]
Unser aktueller Ansatz: [wie wir es heute handhaben, falls überhaupt]
Zeitdruck: [wann wir es brauchen]
Engineering-Kosten für den Aufbau: [Schätzung in Engineering-Wochen, oder Claude schätzen lassen]
Identifizierte Kaufoptionen: [Anbieternames, Preise falls bekannt]
Die Expertise unseres Teams in diesem Bereich: [stark / schwach / keine]

Anhand dieser Kriterien bewerten:

1. Kerndifferenziator-Test
Ist diese Fähigkeit Teil unseres einzigartigen Wertangebots?
- JA → Starkes Signal zum Aufbauen (Besitz = Wettbewerbsvorteil)
- NEIN → Starkes Signal zum Kaufen (es ist allgemeine Infrastruktur)

2. Komplexität vs. Expertise
- Hohe Komplexität + geringe Team-Expertise → Kaufen (Aufbaurisiko ist hoch)
- Hohe Komplexität + starke Team-Expertise → Aufbauen (wenn differenziert)
- Geringe Komplexität + beliebige Expertise → Aufbauen (sofern Off-the-shelf nicht trivial ist)

3. Time-to-Market
- Benötigt in < 3 Monaten → Kaufen gewinnt fast immer
- 3-12 Monate → hängt von strategischer Bedeutung ab
- 12+ Monate → aufbauen, wenn differenzierend

4. Gesamtbetriebskosten (3-Jahres-Horizont)
Aufbauen: Engineering-Kosten + Wartungsaufwand + Opportunitätskosten
Kaufen: Lizenzgebühren + Integration + Lock-in-Prämie

5. Anbieterrisiko
- Startup-Anbieter: Lock-in-Risiko, Übernahmerisiko
- Etablierter Anbieter: Preissetzungsmachtrisiko, langsames Roadmap-Risiko
- Open Source: Wartungslast, Community-Risiko

Ausgabe:
- Empfehlung: Aufbauen / Kaufen / Hybrid / Verzögern
- 3 stärkste Gründe für die Empfehlung
- Was die Meinung ändern würde
- Bei Kaufen: Anbieter-Shortlist und nächster Schritt
- Bei Aufbauen: grobe Architektur und Teamzuweisung
```

### Team-Topologie-Design

```
Die Team-Topologie für unsere Engineering-Organisation entwerfen.

Aktueller Stand:
- Gesamtingenieure: [X]
- Aktuelle Teams: [auflisten und was sie tun]
- Größte Koordinationsprobleme: [wo brechen Übergaben ab oder verlangsamen sich?]
- Produktbereiche: [die wichtigsten Produktdomänen auflisten]
- Platform/Infra-Reife: [stark / schwach / nicht vorhanden]

Zielzustand:
- Ingenieure in 12 Monaten: [X (einschließlich Einstellungsplan)]
- Primäre Geschäftspriorität: [Produkt-Features liefern / Infrastruktur skalieren / Incidents reduzieren]

Ziel-Topologie mit diesen Team-Typen entwerfen:
1. Stream-aligned Teams: Besitzen eine Produktdomäne von Anfang bis Ende, schneller Durchfluss, ermächtigt
2. Platform-Team: Internes Produkt — CI/CD, Observability, Entwickler-Tooling, Infra
3. Enabling-Team: Temporär, coacht andere Teams durch Übergänge (Migration, neue Technologie)
4. Complicated-Subsystem-Team: Tiefe Expertise erforderlich — ML, Suche, Zahlungsverarbeitung

Für jedes Team im Ziel-Design:
- Teamname und Mission
- Teamgröße (Ziel und Zwischen)
- Was sie besitzen (Services, Features, Infra)
- Wovon sie abhängig sind (vom Platform-Team oder extern)
- Wie sie mit benachbarten Teams interagieren (API, geteilter Service, Beratung)
- Erfolgsmetrik für dieses Team

Interaktionsmodi zwischen Teams:
- Zusammenarbeit: eng zusammenarbeitend, häufige Kommunikation (temporär, für Übergänge)
- X-as-a-Service: Konsumenten-/Anbieter-Beziehung mit definierter Schnittstelle
- Facilitating: Ein Team hilft einem anderen, Fähigkeiten aufzubauen (zeitlich begrenzt)

Ausgabe: Organigramm + Team-Charters + Interaktionsmodell-Diagramm (textbasiert)
```

### 12-Monats-Engineering-Roadmap

```
Eine 12-Monats-Engineering-Roadmap erstellen.

Geschäftsprioritäten der Führung:
Q1: [was das Unternehmen liefern / erreichen muss]
Q2: [was das Unternehmen liefern / erreichen muss]
Q3: [was das Unternehmen liefern / erreichen muss]
Q4: [was das Unternehmen liefern / erreichen muss]

Engineering-Einschränkungen:
- Aktuelle Teamkapazität: [X Ingenieure × 10 produktive Tage/Sprint]
- Geplante Einstellungen: [wann und welche Rollen]
- Bekannte technische Schuldenverbindlichkeiten: [was angegangen werden muss]
- Geplante Migrationen: [z.B. Wechsel zu Microservices, Infra-Upgrade]

Roadmap-Format:

## Q1 — [Thema]
Produktlieferobjekte: [auflisten]
Platform / Infra-Arbeit: [auflisten]
Angegangene technische Schulden: [auflisten]
Einstellungen: [Rollen]
Risiko: [was dieses Quartal zum Scheitern bringen könnte]

[für Q2, Q3, Q4 wiederholen]

## Investitionsaufteilung (Ziel)
- Neue Produkt-Features: [X]%
- Platform und Infrastruktur: [X]%
- Reduzierung technischer Schulden: [X]%
- Zuverlässigkeit und On-Call: [X]%

Zielquoten für gesunde Engineering-Organisationen:
- Frühphase: 70/15/10/5 (schnell liefern, Schulden später angehen)
- Wachstumsphase: 60/20/15/5 (beginnen, in Plattform zu investieren)
- Scale-Phase: 50/25/20/5 (Schulden und Zuverlässigkeit werden existenziell)

## Abhängigkeiten und Blocker
Was muss außerhalb des Engineerings passieren, damit diese Roadmap erfolgreich ist?
- Produktentscheidungen bis [Datum] erforderlich
- Design-Ressourcen in [Quartal] benötigt
- Daten- / Rechts- / Compliance-Genehmigungen für [Feature] erforderlich
```

### DORA-Metriken-Baseline

```typescript
interface DORAMetrics {
  // Deployment Frequency: how often you deploy to production
  deploymentFrequency: 'multiple_per_day' | 'daily' | 'weekly' | 'monthly' | 'less_than_monthly'

  // Lead Time for Changes: time from commit to production
  leadTimeHours: number

  // Change Failure Rate: % of deployments causing incidents
  changeFailureRate: number  // 0.0 to 1.0

  // Mean Time to Restore: average time to recover from an incident
  mttrHours: number
}

// Elite performer benchmarks (DORA State of DevOps report)
const DORA_ELITE: DORAMetrics = {
  deploymentFrequency: 'multiple_per_day',
  leadTimeHours: 1,
  changeFailureRate: 0.05,   // < 5%
  mttrHours: 1,
}

// High performer benchmarks
const DORA_HIGH: DORAMetrics = {
  deploymentFrequency: 'daily',
  leadTimeHours: 24,
  changeFailureRate: 0.10,   // < 10%
  mttrHours: 8,
}

// Use these to benchmark current state and set targets in engineering strategy
```

## Beispiel

**Benutzer:** Ich bin ein neuer CTO bei einem Series-B-Startup (120 Mitarbeiter, 18 Ingenieure). Wir haben einen 6 Jahre alten Rails-Monolith, 4 undifferenzierte Teams, 1 Deployment pro Woche und 97% Uptime. Der Vorstand möchte unsere Produktlieferung in 12 Monaten verdreifachen.

**Auszug der Ausgabe:**

```
## Engineering-Vision (12 Monate)
Eine 25-köpfige Engineering-Organisation, die 10x pro Tag in die Produktion liefert mit 99,5% Uptime,
strukturiert in 4 stream-aligned Produktteams und 1 Plattform-Team. Ein neuer Ingenieur liefert
in seiner ersten Woche in die Produktion.

## Ist-Zustand-Bewertung
Architektur: Rails-6-Monolith, 6 Jahre Schulden. Haupteinschränkung: Feature-Flags existieren nicht,
also ist jedes Deployment alles-oder-nichts — deshalb fühlen sich wöchentliche Deployments notwendig an.
Deployment-Geschwindigkeit: 1 Deployment/Woche = DORA-"mittlerer" Performer. Ziel: täglich mindestens, mehrmals/Tag bis Q4.
Zuverlässigkeit: 97% Uptime = ~260 Stunden/Jahr Ausfallzeit. Ziel: 99,5% = < 44 Stunden/Jahr.
Teamstruktur: 4 undifferenzierte Teams = jeder hängt von jedem ab. Koordinationsaufwand
erklärt, warum 18 Ingenieure das Gefühl haben, sich langsam zu bewegen.

## Strategische Prioritäten
1. Feature-Flag-Infrastruktur (Q1): Sicheres kontinuierliches Deployment ermöglichen. Ohne dies kann die Geschwindigkeit nicht verbessert werden.
2. Plattform-Team-Bildung (Q1): 3 Ingenieure von Produktarbeit abziehen, vollzeit für CI/CD, Observability, Deployment
3. Team-Domain-Eigentum (Q2): Klare Produktdomain-Grenzen zuweisen — das Cross-Team-Abhängigkeitsnetz stoppen
4. Service-Extraktion (Q3-Q4): 2-3 wertträchtigste begrenzte Kontexte aus dem Monolith extrahieren

## Build vs. Buy
| Fähigkeit | Empfehlung | Begründung |
|---|---|---|
| Feature-Flags | Kaufen (LaunchDarkly) | Kein Differenziator. $20K/Jahr spart 8 Engineering-Wochen |
| Observability | Kaufen (Datadog oder Honeycomb) | Allgemeingut. Jetzt kaufen, Datenpipeline später aufbauen |
| CI/CD-Pipeline | Aufbauen auf GitHub Actions | Bereits vorhanden, Team hat Expertise |
| Incident-Management | Kaufen (PagerDuty) | Gelöstes Problem, kritischer Pfad |
```

---
