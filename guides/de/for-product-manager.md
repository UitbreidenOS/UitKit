# Claude für Product Manager

Alles, was ein Product Manager braucht, um KI-gestützte Discovery, Roadmap-Planung, Sprint-Durchführung, Stakeholder-Ausrichtung und datengetriebene Entscheidungen zu führen — mit Claude Code.

---

## Für wen das gedacht ist

Du bist PM bei einem Startup oder Scale-up und verwaltest ein Produkt mit echten Kunden, einem Engineering-Team, das auf klare Spezifikationen angewiesen ist, und Stakeholdern, die Ausrichtung brauchen. Du verbringst zu viel Zeit damit, Dokumente zu schreiben, Meetings vorzubereiten und Entscheidungen einzuholen. Claude Code reduziert diesen Overhead, damit du mehr Zeit mit Kunden verbringen und über das Produkt nachdenken kannst.

**Vor Claude Code:** 4 Stunden, um ein PRD zu schreiben. 2 Stunden, um Discovery-Interviews vorzubereiten. 1 Stunde, um Sprint-Stories zu schreiben. Ein halber Tag, um eine Wettbewerbsanalyse zu erstellen.

**Danach:** PRD in 45 Minuten entworfen. Interview-Leitfaden in 10 Minuten. Sprint-Backlog in 30 Minuten verfeinert. Wettbewerbsanalyse in einer Stunde.

---

## 30-Sekunden-Installation

```bash
# Installiere den vollständigen PM-Stack
npx claudient add skill product/product-discovery
npx claudient add skill product/product-roadmap
npx claudient add skill product/experiment-designer
npx claudient add skill product/product-analytics
npx claudient add skill product/competitive-teardown
npx claudient add skill product/ux-researcher
npx claudient add skill product/code-to-prd
npx claudient add skill product/product-manager-toolkit
npx claudient add skill product/pm-sprint-review
npx claudient add skill product/user-story-writer
npx claudient add agents advisors/cpo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Dein Claude Code PM-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/product-discovery` | Kunden-Interview-Leitfäden, JTBD-Analyse, Opportunity-Scoring, Problem-Briefs | Bevor du dich zum Bauen verpflichtest |
| `/user-story-writer` | Grobe Ideen in strukturierte Stories mit AC und Edge Cases umwandeln | Backlog-Pflege, Sprint-Planung |
| `/code-to-prd` | Ein PRD aus bestehendem Code rückentwickeln — oder ein PRD aus einem Brief generieren | Feature-Dokumentation, Stakeholder-Ausrichtung |
| `/product-roadmap` | Eine priorisierte Roadmap mit Begründung erstellen und kommunizieren | Quartalsplanung, Stakeholder-Reviews |
| `/pm-sprint-review` | Sprint-Velocity, Geliefertes vs. Geplantes, Retro, nächste Sprint-Prioritäten | Am Ende jedes Sprints |
| `/experiment-designer` | A/B-Test-Design, Hypothesenformulierung, Stichprobengröße, Erfolgskennzahlen | Growth-Experimente, Feature-Flags |
| `/product-analytics` | Funnel-Analyse, Kohorten-Retention, Event-Schema, Kennzahlen-Interpretation | Wöchentlicher Daten-Review, nach dem Launch |
| `/ux-researcher` | Usability-Test-Skripte, Interview-Synthese, Persona-Erstellung | Design-Validierung |
| `/competitive-teardown` | Vollständige Wettbewerbsanalyse: Positionierung, Features, Preisgestaltung, SWOT | Quartalsweise, vor Planungszyklen |
| `/product-manager-toolkit` | Priorisierungs-Frameworks (RICE, ICE, MoSCoW), Stakeholder-Maps, Entscheidungsdokumente | Tägliches PM-Handwerk |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cpo-advisor` | Opus | Strategische Produktentscheidungen, Roadmap-Kompromisse, Organisationsdesign |
| `competitive-analyst` | Sonnet | Detaillierte Wettbewerbsintelligenz, Feature-Benchmarking |

---

## Täglicher Workflow

### Morgen-Standup-Vorbereitung (10 Minuten)

```
/pm-sprint-review

Schnelle Standup-Zusammenfassung für Sprint [N] — Tag [X]:

Team: [N Engineers, N Designer]
Sprint-Ziel: [formulieren]

Gestrige Updates (aus Linear/Jira abrufen):
- [Ticket] abgeschlossen von [Person]
- [Ticket] im Review
- [Ticket] blockiert — [Grund]

Heutiger Plan:
- [Ticket] — [Engineer-Name]
- [Ticket] — [Designer-Name]

Blocker, die PM-Aufmerksamkeit benötigen:
- [Blocker 1 — was muss ich heute lösen?]

Fasse als 2-minütiges Standup-Briefing zusammen, das ich laut vorlesen oder in Slack posten kann.
```

### Backlog-Pflege (nach Bedarf)

```
/user-story-writer

Pflege diese groben Punkte aus dem Backlog:

1. "[Grobe Idee oder Stakeholder-Anfrage]"
   Kontext: [zusätzliche Details]

2. "[Grobe Idee]"
   Kontext: [...]

Für jede: schreibe eine vollständige User Story mit AC, Edge Cases, Definition of Done und Story-Point-Schätzung. Markiere, wenn etwas mehr Discovery benötigt, bevor du schreibst.
```

### Stakeholder-Kommunikation

```
/product-manager-toolkit

Schreibe ein Stakeholder-Update für [Zielgruppe — Führungsteam / CEO / Vertrieb / Customer Success]:

Sprint [N] Ergebnis: [geliefert / verfehlt / teilweise]
Wichtigstes Lieferobjekt: [was geliefert wurde, was für sie relevant ist]
Impact: [was dies ermöglicht — Kundennutzen oder Geschäftskennzahl]
Was kommt: [Sprint N+1 Top-Punkt]
Risiken oder Entscheidungen, die von ihnen benötigt werden: [Liste]

Auf Slack-Nachricht oder kurze E-Mail beschränken. Kein Bullet-Soup.
```

---

## Schlüssel-Workflows nach Szenario

### Neue Feature-Anfrage von einem Kunden oder Stakeholder

```
Schritt 1: Ist das real?
/product-discovery

Kundenanfrage: "[Anfrage oder Feature-Wunsch einfügen]"
Quelle: [Enterprise-Kunde / 15 separate Support-Tickets / CEO / ein Power-User]

Analysiere:
- Ist das ein Symptom oder der echte Job to be done?
- Wie viele Kunden haben dieses Problem?
- Was tun sie heute als Workaround?
- Stimmt das Lösen davon mit unserer Produktthese überein?
- Was müssten wir glauben, damit das in den Top-5-Prioritäten landet?

Schritt 2: Wenn real — schreibe die Story
/user-story-writer

Feature-Brief: [einfügen, was du aus Schritt 1 gelernt hast]
Schreibe die User Story bereit für die Sprint-Planung.

Schritt 3: Größe und Priorisierung
/product-manager-toolkit

Füge diese Story meiner Priorisierungsmatrix hinzu.
Aktuelle Kandidaten: [bestehende Backlog-Punkte auflisten]
RICE-Scores: [Reach, Impact, Confidence, Effort]
Wo landet diese neue Story in der Prioritätsreihenfolge?
```

### PRD für ein bedeutendes Feature

```
/code-to-prd

Schreibe ein PRD für: [FEATURE-NAME]

Problem: [welches Problem das für wen löst]
Nachweis: [Kundenforschung, Support-Daten, Analytics, die die Lücke zeigen]
Umfang: [was drin ist und was explizit nicht in diesem Release]
Erfolgskennzahl: [die eine Kennzahl, die beweist, dass dieses Feature erfolgreich war]
Zeitplan: [Ziel-Sprint oder Datum]
Abhängigkeiten: [andere Teams, APIs, benötigte Design-Arbeit]

Erstelle das vollständige PRD: Problemformulierung, Ziele und Nicht-Ziele, User Stories, Erfolgskennzahlen, offene Fragen, außerhalb des Umfangs.
```

### Quartals-Roadmap-Planung

```
/product-roadmap

Erstelle die Produkt-Roadmap für [QUARTAL/JAHR].

Eingangs-Themen (aus Kundenforschung, Geschäftszielen, technischen Schulden):
Thema 1: [Beschreibung] — strategische Bedeutung: [warum das jetzt wichtig ist]
Thema 2: [Beschreibung]
Thema 3: [Beschreibung]

Einschränkungen:
- Engineering-Kapazität: [N Engineer-Wochen]
- Design-Kapazität: [N Designer-Wochen]
- Harte Fristen: [bereits gemachte Zusagen]
- Nicht verhandelbare Punkte: [was unabhängig von der Priorisierung ausgeliefert werden muss]

Erstelle: eine JETZT / NÄCHSTE / SPÄTER Roadmap mit Begründung pro Punkt, Abhängigkeiten und Risiken.
```

### Post-Launch-Analyse

```
/product-analytics

Analysiere die Performance von [FEATURE], das am [DATUM] gestartet ist.

Verfügbare Kennzahlen:
- Adoption: [X% der Nutzer haben das Feature in den ersten 2 Wochen genutzt]
- Retention-Impact: [D14-Retention für Feature-Nutzer vs. Kontrolle: X% vs. Y%]
- Funnel: [X Nutzer sahen es, Y aktivierten es, Z schlossen den Kern-Flow ab]
- Support-Tickets: [N Tickets zu diesem Feature seit dem Launch]
- NPS-Kommentare, die es erwähnen: [relevante Kommentare einfügen]

Sag mir:
1. Funktioniert dieses Feature? (starkes Signal / schwaches Signal / zu früh zu sagen)
2. Was schlagen die Daten vor, was wir als Nächstes tun sollen? (iterieren, ausbauen, einstellen oder warten)
3. Was ist die eine Kennzahl, die ich wöchentlich tracken sollte, um zu wissen, ob es sich verbessert?
```

---

## 30-Tage-Einarbeitungsplan (PM, der einem neuen Team oder Produkt beitritt)

### Woche 1 — Kontext und Discovery
- Installiere alle PM-Skills über die obigen Befehle
- Führe `/product-discovery` bei den Top-3-Kundenproblemen durch, die du gehört hast
- Sprich mit 5 Kunden — nutze den Interview-Leitfaden aus `/product-discovery`
- Kartiere das bestehende Produkt mit `/competitive-teardown` (dein eigenes Produkt, kein Wettbewerber) — verstehe, was du hast

### Woche 2 — Backlog und Sprint-Rhythmus
- Führe `/pm-sprint-review` bei den letzten 3 Sprints durch — verstehe Velocity und wiederkehrende Blocker
- Gehe die Top-20-Backlog-Punkte mit `/user-story-writer` durch — beurteile Qualität und verfeinere die schlechtesten Stories
- Nimm an allen Sprint-Ritualen teil — führe sie noch nicht durch, beobachte nur

### Woche 3 — Roadmap und Stakeholder
- Nutze `/product-roadmap`, um zu kartieren, was existiert und was zugesagt wurde
- Nutze `/product-manager-toolkit`, um eine Stakeholder-Map zu erstellen — wer hat Einfluss auf Roadmap-Entscheidungen?
- Erstelle dein erstes Stakeholder-Update mit `/product-manager-toolkit`

### Woche 4 — Übernimm es
- Führe deinen ersten vollständigen Sprint-Review mit `/pm-sprint-review` durch
- Schreibe deine ersten User Stories für den nächsten Sprint mit `/user-story-writer`
- Teile deine 30-60-90-Tage-Produktthese mit dem CPO — nutze `/cpo-advisor`, um sie zu testen

---

## Tool-Integrationen

### Linear (empfohlen für Sprint-Management)

```json
// Zu ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Mit verbundenem Linear kann Claude Sprint-Status, Ticket-Details und Zyklushistorie lesen — Sprint-Reviews ohne manuelles Kopieren und Einfügen ermöglichen.

### Notion (für PRDs und Roadmaps)

Verbinde das Notion MCP, damit Claude deine PRD-Datenbank, Roadmap-Ansicht und Discovery-Notizen lesen und aktualisieren kann — und die Dokumentation mit Entscheidungen synchron hält.

### Amplitude / Mixpanel

Exportiere Event-Daten als CSV oder füge Abfrageergebnisse in `/product-analytics` ein. Für Echtzeit-Analyse kann die Amplitude API über MCP für Live-Kennzahlen-Abfragen während Planungssitzungen verbunden werden.

### Figma

Für Design-PM-Zusammenarbeit kann Claude Figma-Links lesen und visuelle Kontexte referenzieren, wenn Akzeptanzkriterien geschrieben werden. Kombiniere mit `/user-story-writer`, um AC zu schreiben, das auf spezifische Design-Zustände verweist.

---

## Kennzahlen zum Verfolgen

### Sprint-Gesundheit

| Kennzahl | Ziel | Warnsignal |
|---|---|---|
| Sprint-Ziel-Erreichungsrate | > 70% | < 50%: Planungs- oder Umfangsproblem |
| Velocity-Vorhersagbarkeit | ± 20% des Durchschnitts | Starke Schwankungen: Schätzungs- oder ungeplantes Arbeitsproblem |
| Ungeplante Arbeit | < 20% der Sprint-Kapazität | > 30%: reaktives Team, kein proaktives |
| Story-Point-Genauigkeit | ± 1 Punkt Durchschnitt | Konsistente Überschätzungen: Sicherheitspuffer |

### Produkt-Gesundheit

| Kennzahl | Ziel (je nach Produkt) | Warum wichtig |
|---|---|---|
| Feature-Adoption (D14) | > 30% der aktiven Nutzer | Nutzt jemand, was du geliefert hast? |
| Time-to-Value | Abnehmend | Verbessert sich das Onboarding? |
| Support-Ticket-Rate pro Feature | Abnehmend | Verbessert sich die Qualität? |
| NPS-Impact neuer Features | Neutral bis positiv | Baust du Dinge, die Nutzer lieben? |
| Experiment-Win-Rate | > 30% | Sind deine Hypothesen kalibriert? |

---

## Häufige PM-Fehler, bei denen Claude Code hilft

**Fehler 1: Bauen vor der Validierung**
`/product-discovery` zwingt dich, das Problem zu formulieren und Nachweise zu sammeln, bevor du ein Wort Spezifikation schreibst. Keine Discovery → keine Story.

**Fehler 2: Stories zu groß, um in einem Sprint fertig zu werden**
`/user-story-writer` enthält eine Größenprüfung und einen Aufteilungsleitfaden. Alles, das auf > 5 Punkte geschätzt wird, wird vor der Sprint-Planung aufgeteilt.

**Fehler 3: Akzeptanzkriterien, die nicht testbar sind**
Der AC-Qualitätsprüfer in `/user-story-writer` markiert Kriterien, die für einen QA-Engineer zu vage zum Testen sind. Jedes AC muss beobachtbar und spezifisch sein.

**Fehler 4: Retrospektiven ohne Maßnahmen**
`/pm-sprint-review` erzwingt maximal 2 Retro-Aktionspunkte pro Sprint. Mehr als 2 bedeutet, dass keiner erledigt wird.

**Fehler 5: Roadmap ohne Begründung**
`/product-roadmap` generiert eine Begründung für jeden Punkt der Roadmap. Wenn du nicht erklären kannst, warum etwas auf der Roadmap ist, sollte es nicht dort sein.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [PM-Sprint-Workflow](../workflows/pm-sprint.md)
- [Product-Discovery-Skill](../skills/product/product-discovery.md)
- [User-Story-Writer-Skill](../skills/product/user-story-writer.md)
- [Sprint-Review-Skill](../skills/product/pm-sprint-review.md)
- [CPO-Advisor-Agent](../agents/advisors/cpo-advisor.md)

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
