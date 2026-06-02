# Claude für Recruiter und HR

Alles, was ein Recruiter oder HR-Fachmann braucht, um KI-gestützte Einstellungs-Pipelines zu führen — vom Schreiben der Stellenbeschreibung über die Strukturierung von Interviews bis zur Erstellung von Angebotsschreiben — ohne das menschliche Urteilsvermögen zu verlieren, das großartige Einstellungsentscheidungen ausmacht.

---

## Für wen das gedacht ist

Du bist Recruiter, Talent-Acquisition-Spezialist oder HR-Generalist, der dafür verantwortlich ist, Stellen schnell und gut zu besetzen. Du verwaltest mehrere offene Stellen, koordinierst mit Hiring Managern, die unklare Anforderungen haben, und sollst Kandidaten sourcen, prescreenen, bewerten und abschließen — oft ohne ein vollständiges Team.

**Vor Claude Code:** 2–3 Stunden für eine vollständige Stellenbeschreibung und Scorecard. 1 Stunde für die Erstellung einer Sourcing-Suche und einer Outreach-Sequenz. 30 Minuten zur Dokumentation jedes Interview-Debriefs. Marktrecherche für die Vergütungspositionierung manuell aus Glassdoor.

**Danach:** Vollständige Stellenbeschreibung in 15 Minuten. Sourcing-Suche + Outreach-Nachrichten in 20 Minuten. Scorecard für jede Rolle in 30 Minuten erstellt. Vergütungs-Benchmarks in 10 Minuten recherchiert und strukturiert. Du verbringst mehr Zeit mit Kandidatengesprächen und weniger mit Dokumentation.

---

## 30-Sekunden-Installation

```bash
# Installiere den vollständigen Recruiter-Stack
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
npx claudient add skill productivity/team-onboarding
npx claudient add agent advisors/chro-advisor
```

---

## Dein Claude Code Recruiter-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/candidate-sourcer` | Boolean-Suchstrings, LinkedIn-Outreach-Nachrichten, Pipeline-Tracking | Wenn du proaktiv sourcen musst |
| `/interview-scorecard` | Kompetenzbasierte Fragen, Bewertungsrubrik, Panel-Design, Debrief-Vorlage | Jede neue Stelle — vor dem ersten Interview |
| `/comp-benchmarker` | Gehaltsbänder, Equity-Richtlinien, Angebotsschreiben-Erstellung | Vor dem Ausschreiben der Stelle und vor der Angebotserstellung |
| `/job-description` | Rollendefinition, Anforderungsformulierung, Tongestaltung | Beim Öffnen einer neuen Anforderung |
| `/hiring-pipeline` | Pipeline-Phasen, SLAs, Reporting-Vorlagen | Verwaltung mehrerer offener Stellen |
| `/team-onboarding` | 30-60-90-Tage-Onboarding-Plan für neue Mitarbeiter | Wenn ein Angebot angenommen wurde |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `chro-advisor` | Opus | Organisationsdesign, HR-Strategie, Handhabung sensibler Personalangelegenheiten |

---

## Täglicher Workflow

### Morgen (20–30 Minuten)

**1. Pipeline-Review — Montagmorgen**
```
/hiring-pipeline

Wöchentlicher Pipeline-Review — Woche vom [DATUM].

Offene Stellen:
| Stelle | Abteilung | Phase | Kandidaten in der Pipeline | Zieldatum |
|---|---|---|---|---|
| [Titel] | [Abteilung] | [Sourcing / Screening / Interviews / Angebot] | [N] | [Datum] |
| [Titel] | [Abteilung] | [Phase] | [N] | [Datum] |

Für jede Stelle:
- Was ist der Engpass? (nicht genug Kandidaten / Kandidaten kommen nicht voran / Angebote werden abgelehnt)
- Welche Maßnahmen sind diese Woche fällig?
- Gibt es Stellen, die ihr Zieldatum zu verpassen drohen?

Gib mir eine priorisierte Maßnahmenliste für diese Woche.
```

**2. Kandidaten-Outreach — zweimal pro Woche gebündelt**
```
/candidate-sourcer

Ich source für [Stelle] in [Standort].

Pflichtanforderungen:
- [Qualifikation 1]
- [Qualifikation 2]

Zielunternehmen: [5–8 Unternehmen aufzählen, bei denen ich diesen Hintergrund finden würde]

Erstelle:
1. LinkedIn-Recruiter-Boolean-Suchstring
2. Google-X-Ray-Such-Variante
3. Outreach-Nachrichten-Vorlage (personalisierte erste Zeile + Rolle als Aufhänger + CTA)
4. Follow-up-Nachricht (für Nicht-Antworter nach 7 Tagen)

Ich sende diese Woche 20 Nachrichten — hilf mir, den Outreach zu strukturieren.
```

---

### Interview-Vorbereitung

**3. Scorecard für eine neue Stelle erstellen**
```
/interview-scorecard

Interview-Scorecard für [Stelle] erstellen.

Ebene: [Senior IC / Manager / Director]
Abteilung: [Abteilung]
Hauptverantwortlichkeiten:
- [Verantwortlichkeit 1]
- [Verantwortlichkeit 2]
- [Verantwortlichkeit 3]

Pflichtkompetenzen:
- [Kompetenz 1]
- [Kompetenz 2]
- [Kompetenz 3]

Ausschlusskriterien:
- [Alles, das disqualifiziert]

Erstelle: 4–5 Kompetenzen mit je 2–3 Fragen, Bewertungsrubrik (1–4),
Interview-Panel-Design (wer interviewt welche Kompetenz),
und Debrief-Vorlage für den Hiring Manager.
```

**4. Kandidatenspezifische Vorbereitung (vor einem Panel-Interview)**
```
/interview-scorecard

Ich interviewe [Kandidatenname] morgen für [Stelle].

Sein/Ihr Hintergrund: [beschreiben — aktuelle Rolle, Unternehmen, relevante Erfahrung aus LinkedIn oder CV]
Die Kompetenz, die ich bewerte: [welche Kompetenz mir zugewiesen wurde]
Was ich über seine/ihre Stärken weiß: [was im CV/Screening heraussticht]
Was ich nicht sicher bin: [die Lücken oder Dinge, die ich vertiefen möchte]

Gib mir:
- 3 maßgeschneiderte Fragen für diesen Kandidaten (nicht generisch — Hintergrund referenzieren)
- Wie starke vs. schwache Antworten für jede Frage aussehen
- Nachfragefragen, wenn er/sie eine oberflächliche Antwort gibt
- Was ich für das Debrief markieren sollte
```

---

### Angebotsmanagement

**5. Vergütungsrecherche und Angebotserstellung**
```
/comp-benchmarker

Ein Vergütungsangebot für [Stelle] bei [Unternehmen] erstellen.

Stelle: [Titel]
Ebene: [Senior IC / Manager]
Standort: [Stadt, Land]
Unternehmensphase: [Serie A / B / börsennotiert / Enterprise]

Unser aktuelles Band für diese Stelle: $[X] – $[Y] Grundgehalt
Aktuelle Vergütung des Kandidaten: $[X] Grundgehalt, $[X] Bonus, $[X] Equity
Konkurrenzangebot (falls bekannt): $[X] bei [Unternehmen]

Erstelle:
1. Marktbenchmark für diese Stelle und diesen Standort (wo liegt unser Band?)
2. Empfohlenes Angebot innerhalb unseres Bandes mit Begründung
3. Equity-Paket (Optionen oder RSUs basierend auf unserer Phase)
4. Vollständige Angebots-Paket-Zusammenfassung
5. Skript für das mündliche Angebot-Telefonat
6. Gegenargumentation, wenn er/sie ein Gegenangebot macht
```

**6. Angebotsschreiben**
```
/comp-benchmarker

Angebotsschreiben für [Vollständiger Kandidatenname] für die Stelle [Stelle] generieren.

Unternehmen: [Name]
Startdatum: [Datum]
Grundgehalt: $[X]
Bonus: [X% des Grundgehalts, jährlich ausgezahlt]
Equity: [X Anteile, 4-Jahres-Vesting, 1-Jahr-Cliff]
Leistungen: [beschreiben]
Standort: [Stadt oder remote]
Berichtet an: [Manager-Name, Titel]
Angebot läuft ab: [Datum — 5–7 Geschäftstage geben]

Ein professionelles Angebotsschreiben mit allen klar genannten Komponenten generieren.
Hinweis einfügen, dass Equity der Vorstandsgenehmigung unterliegt.
```

---

### Onboarding-Übergabe

**7. Onboarding-Plan für neuen Mitarbeiter**
```
/team-onboarding

Einen 30-60-90-Tage-Onboarding-Plan für [Name des neuen Mitarbeiters] erstellen, der als [Stelle] beginnt.

Startdatum: [Datum]
Manager: [Name]
Team: [beschreiben, welchem Team er/sie beitritt]
Wichtige Stakeholder, die in den ersten 30 Tagen getroffen werden sollen: [Liste]
Hauptziele für die ersten 90 Tage: [wie sieht Erfolg aus?]
Einzurichtende Tools und Systeme: [Liste]
Rollenspezifischer Kontext: [Nuancen, aktuelle Projekte, übernommene Herausforderungen]

Erstelle: strukturierten 30-60-90-Plan mit wöchentlichen Meilensteinen, Stakeholder-Meeting-Zeitplan
und Erfolgskriterien für jede Phase.
```

---

## 30-Tage-Einarbeitungsplan (neue Recruiter oder HR-Generalisten)

### Woche 1 — Rollenanforderungen und Prozessdesign
- Alle Skills über die obigen Install-Befehle installieren
- Für jede offene Stelle: `/interview-scorecard` ausführen, um zu dokumentieren, wofür du einstellst, bevor du einen Kandidaten anschaust
- `/comp-benchmarker` für jede offene Stelle ausführen — das Band kennen, bevor du sourcest oder screenst
- Aktuelle Pipeline auditieren: welche Stellen stagnieren und warum?

### Woche 2 — Aktives Sourcing
- `/candidate-sourcer` für deine Top-2-offenen Stellen ausführen — Suchstrings und Outreach-Sequenzen erstellen
- Diese Woche 20+ Outreach-Nachrichten pro Stelle senden
- `/job-description` nutzen, um jede Stellenausschreibung zu prüfen oder neu zu schreiben, die seit > 30 Tagen live ist, ohne qualitativ hochwertige Bewerber
- Deine Sourcing-zu-Screening-Konversionsrate als Baseline festlegen

### Woche 3 — Interview-Prozess
- Jedes geplante Interview mit der Scorecard aus Woche 1 durchführen
- Debrief mit dem strukturierten Debrief-Prozess durchführen — keine offene Diskussion
- Tracken: Wo werden Angebote abgelehnt? Vergütung, Rollenklarheit oder Prozesslänge?
- Eine Sourcing- und Bewertungsprozessverbesserung mit dem Hiring Manager teilen

### Woche 4 — Angebot und Reporting
- Erstes Angebot mit `/comp-benchmarker`-Daten machen — die Zahl mit Marktrecherche begründen
- Wöchentlichen Pipeline-Review durchführen und Kennzahlen an die Geschäftsführung weitergeben
- Ersten monatlichen Recruiting-Bericht erstellen: Time-to-Fill pro Stelle, Qualität der Quellen, Annahmerate
- Identifizieren: was ist der größte Engpass in deinem Einstellungsprozess gerade?

---

## Tool-Integrationen

### LinkedIn Recruiter

`/candidate-sourcer` nutzen, um Boolean-Strings zu generieren → in LinkedIn Recruiter ausführen. Profile exportieren → Outreach-Liste in Recruiter erstellen → von Claude generierte Vorlagen für InMail verwenden.

### Greenhouse / Lever / Ashby (ATS)

Kandidaten-Pipeline-Daten als CSV exportieren → in Claude für die Analyse einfügen. Claude funktioniert mit jeder ATS-Ausgabe. Claude nutzen für:
- Strukturiertes Interview-Feedback schreiben, das in das ATS eingeht
- Angebotsschreiben-Text zum Einfügen in DocuSign generieren
- Pipeline-Abbruch nach Phase analysieren

### HubSpot oder Notion für das Pipeline-Tracking

Wenn du kein formelles ATS hast, die Pipeline-Tracker-Struktur von `/candidate-sourcer` in Notion oder einer Tabellenkalkulation verwenden. Claude kann deine Pipeline-Daten lesen und wöchentliche Statusberichte generieren.

### Levels.fyi / Glassdoor (Vergütungsrecherche)

Claude nutzt deine eingefügten Marktdaten aus diesen Quellen, um Empfehlungen in `/comp-benchmarker` zu kalibrieren. Die relevanten Daten abrufen, einfügen und Claude analysiert sie im Kontext deiner Stelle und Unternehmensphase.

---

## Zu verfolgende Kennzahlen

| Kennzahl | Definition | Grün | Gelb | Rot |
|---|---|---|---|---|
| Time-to-Fill | Tage von der Eröffnung der Anforderung bis zur Angebotsannahme | < 30 Tage | 30–60 Tage | > 60 Tage |
| Angebotsannahmerate | % der abgegebenen Angebote, die angenommen werden | > 85% | 70–85% | < 70% |
| Sourcing-Antwortrate | % der Outreach-Nachrichten, die eine Antwort erhalten | > 20% | 10–20% | < 10% |
| Trichterkonversion (gesourct → eingestellt) | % der gesourcten Profile, die Einstellungen werden | > 3% | 1–3% | < 1% |
| Interview-zu-Angebot-Verhältnis | Anzahl der Interviews pro Einstellung | < 5:1 | 5–8:1 | > 8:1 |
| 90-Tage-Retention neuer Mitarbeiter | % der Einstellungen, die nach 90 Tagen noch beschäftigt sind | > 90% | 80–90% | < 80% |
| Hiring-Manager-Zufriedenheit | Von Hiring Managern nach der Einstellung bewertet | > 4/5 | 3–4/5 | < 3/5 |

---

## Häufige Recruiting-Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Mit dem Sourcing beginnen, bevor man weiß, wofür man einstellt**
`/interview-scorecard` erzwingt die Kompetenzdefinition vor jedem Outreach. Wenn du die Scorecard nicht schreiben kannst, weißt du noch nicht, wofür du einstellst.

**Fehler 2: Generische InMail-Nachrichten**
`/candidate-sourcer` erstellt Vorlagen, die eine personalisierte erste Zeile erfordern. Kein persönlicher Aufhänger = nicht senden.

**Fehler 3: Vergütungsüberraschungen im Angebotsstadium**
`/comp-benchmarker` erstellt das Band, bevor du mit dem Screening beginnst. Kandidaten, deren Erwartungen nicht mit deinem Band übereinstimmen, sollten im ersten Gespräch ausgesiebt werden, nicht beim Angebot.

**Fehler 4: Debrief durch Konsens (HiPPO-Effekt)**
Die Debrief-Struktur in `/interview-scorecard` verlangt, dass jeder Interviewer Punkte teilt, bevor offene Diskussion stattfindet. Das verhindert, dass die ranghöchste Person im Raum die Meinung aller ankert.

**Fehler 5: Kein Onboarding-Plan am ersten Tag bereit**
`/team-onboarding` generiert den 30-60-90-Plan, bevor der Kandidat anfängt — nicht in der Woche, in der er ankommt. Eine schlechte erste Woche ist ein vermeidbares frühes Flukturationssignal.

---

## Ressourcen

- [Erste Schritte mit Claude Code](./getting-started.md)
- [Interview-Scorecard-Skill](../skills/productivity/interview-scorecard.md)
- [Comp-Benchmarker-Skill](../skills/productivity/comp-benchmarker.md)
- [Candidate-Sourcer-Skill](../skills/productivity/candidate-sourcer.md)
- [Recruiting-Pipeline-Workflow](../workflows/recruiting-pipeline.md)
- [Team-Onboarding-Skill](../skills/productivity/team-onboarding.md)

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
