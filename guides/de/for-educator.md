# Claude für Lehrkräfte und Kursersteller

Alles, was eine Lehrkraft, ein Professor, ein Instructional Designer oder ein Kursersteller benötigt, um KI-gestützte Unterrichtsplanung, Lehrplanentwicklung, Analyse von Schülerfeedback, Leistungsbeurteilung und Content-Erstellung in Claude Code durchzuführen.

---

## Für wen dieser Leitfaden gedacht ist

Sie sind Lehrkraft, Dozent, Instructional Designer, L&D-Fachkraft oder unabhängiger Kursersteller. Sie verbringen enorm viel Zeit mit Unterrichtsplanung, dem Schreiben von Prüfungen, der Content-Erstellung und der Auswertung von Schülerfeedback — Arbeit, die vor und nach dem Unterricht stattfindet, selten während der bezahlten Stunden. Claude Code komprimiert die Vorbereitungsarbeit, damit Sie mehr Zeit für das aufwenden können, was nur Sie tun können: echtes Unterrichten, Mentoring und das unmittelbare Eingehen auf Lernende.

**Vor Claude Code:** 3 Stunden für die Planung einer gut strukturierten Unterrichtsstunde von Grund auf. 2 Stunden für die Erstellung eines Quiz mit qualitativ hochwertigen Fragen. 90 Minuten, um 30 offene Feedback-Umfragen auszuwerten.

**Danach:** Unterrichtsplan in 20 Minuten. Quiz mit Antwortschlüssel in 15 Minuten. Feedback-Synthese in 10 Minuten.

---

## Installation in 30 Sekunden

```bash
# Lehrkraft-Skills installieren
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill small-business/online-course-creator
npx claudient add skill small-business/newsletter-publisher
npx claudient add skill productivity/lit-review

# Den wissenschaftlichen Forscher-Agenten installieren
npx claudient add agent roles/scientific-researcher
```

---

## Ihr Claude Code Lehrkraft-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/lesson-planner` | Vollständiger Unterrichtsplan: Lernziele, Aktivitäten, Beurteilungen, Differenzierung, Materialien | Bei jeder neuen Unterrichtsstunde oder Anpassung |
| `/student-feedback-analyzer` | Analyse von Umfrageergebnissen und Leistungsdaten: Themen, Lücken, Verbesserungen | Nach der Feedbackerhebung, nach Beurteilungen |
| `/online-course-creator` | Vollständige Kursstruktur: Module, Lernpfade, Video-Skripte, Quizze, Verkaufstexte | Beim Aufbau eines Kurses für eine Plattform (Teachable, Thinkific usw.) |
| `/newsletter-publisher` | Kurs-Newsletter oder E-Mail-Sequenz für Lernende — Drip-Content, Engagement | Community-Aufbau, laufende Lernendenkommunikation |
| `/lit-review` | Literatur- und Forschungsrecherche für Kursinhalte — evidenzbasiertes Lehren | Akademische Kurse, forschungsgestützter Lehrplan |

### Agent

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `scientific-researcher` | Opus | Tiefgehende Literaturrecherche, evidenzbasierte Lehrplanentwicklung, akademische Forschung |

---

## Täglicher Workflow

### Vor dem Unterricht (20–30 Minuten Vorbereitung)

**1. Unterrichtsplan — eine neue Stunde vorbereiten**
```
/lesson-planner

Erstelle eine Unterrichtsstunde zu [Thema] für [Zielgruppe].

Dauer: [X Minuten]
Format: [Präsenz / Online / Hybrid]
Vorwissen: [was sie bereits wissen]
Lernziele: [was sie danach können sollen — oder Claude diese entwerfen lassen]
Wesentliche Rahmenbedingungen: [verfügbare Technologie, Klassengröße, eventuelle Barrierefreiheitsbedürfnisse]

Erzeuge den vollständigen Unterrichtsplan mit Zeitplanung, Aktivitäten und einem Abschluss-Ticket.
```

**2. Beurteilungsdesign — für das Quiz oder den Projektauftrag von morgen**
```
/lesson-planner

Entwirf eine Beurteilung für [Unterrichtsthema].

Lernziele: [Liste aus dem Unterrichtsplan]
Beurteilungsform: [Quiz / Kurzantwort / Projekt / Präsentationsrubrik]
Erlaubte Zeit: [X Minuten / X Tage]
Bloom'sche Stufe: [Erinnern / Anwenden / Analysieren / Bewerten]

Erzeuge Fragen mit einem Antwortschlüssel und eine Rubrik für offene Teile.
```

---

### Nach dem Unterricht / am Ende einer Einheit

**3. Feedbackanalyse — Umfragedaten auswerten**
```
/student-feedback-analyzer

Analysiere Feedback aus [Kurs-/Stundenname].

Quantitative Bewertungen: [Umfragedurchschnitte einfügen]
Offene Antworten (anonymisiert): [alle Antworten einfügen]

Welche Muster gibt es? Was sollte ich beim nächsten Mal ändern? Was hat gut funktioniert?
```

**4. Beurteilungs-Nachbesprechung — was die Ergebnisse aussagen**
```
/student-feedback-analyzer

Meine Klasse hat gerade [Beurteilungsname] abgeschlossen.

Klassendurchschnitt: [X]%
Punkteverteilung: [einfügen]
Aufgabenweise Aufschlüsselung: [Korrektquote pro Aufgabe einfügen]
Geprüfte Lernziele: [Liste]

Wo liegen die Wissenslücken? Was muss ich wiederholen? Was wurde gemeistert?
```

---

### Kursentwicklung (längerfristige Arbeit)

**5. Online-Kursstruktur**
```
/online-course-creator

Erstelle die Kursstruktur für einen Kurs über [Thema].

Zielgruppe: [wer sie sind, Vorwissen]
Format: [selbstgesteuertes Video / kohorten-basiert / Bootcamp]
Länge: [X Wochen / X Stunden Inhalt]
Plattform: [Teachable / Thinkific / Udemy / internes LMS]
Lernziele: [Haupttransformation — was können sie danach?]

Erzeuge: Modulübersicht, Lektionsreihenfolge, Beurteilungspunkte, Abschlussaktivitäten.
```

**6. Literaturrecherche für Kursinhalte**
```
/lit-review

Recherchiere die Evidenzbasis für [Lehrmethode / Themenbereich].

Ich entwerfe einen Kurs über [Thema] und möchte sicherstellen, dass der Lehrplan evidenzbasiert ist.
Was sagt die Forschung über [spezifischen Aspekt Ihres Lehrplans]?
Gibt es wegweisende Studien oder Konsensbefunde, die ich kennen sollte?
```

---

### Community und Lernenden-Engagement

**7. E-Mail-Sequenz für Lernende**
```
/newsletter-publisher

Schreibe eine E-Mail-Sequenz für eingeschriebene Lernende in [Kursname].

Zweck der Sequenz: [Onboarding / wöchentlicher Check-in / Re-Engagement / Würdigung]
Tonalität: [ermutigend / professionell / gesprächig]
Schlüsselbotschaften für [diese E-Mail oder diese Woche]: [beschreiben]
Länge: [kurz — 150 Wörter / vollständig — 300 Wörter]
```

---

## 30-Tage-Einstiegsplan (neue Lehrkräfte oder neuer Kurs)

### Woche 1 — Grundlagen der Unterrichtsplanung
- Alle Lehrkraft-Skills installieren: `npx claudient add skill productivity/[name]`
- `/lesson-planner` nutzen, um die nächsten 3 Unterrichtsstunden zu planen — mit dem vergleichen, was Sie normalerweise tun würden
- Den Lernzielschreiber für jede Stunde ausführen — vage Ziele in messbare Ergebnisse schärfen
- Erstes Abschluss-Ticket erstellen und im Unterricht einsetzen

### Woche 2 — Beurteilung und Feedback
- `/lesson-planner` nutzen, um eine Beurteilung zu entwerfen — Fragen und Rubrik erstellen
- Nach der Beurteilung die Ergebnisse in `/student-feedback-analyzer` einfügen — Dateninterpretation üben
- Eine Abschluss-Ticket-Analyse durchführen — was sollten Sie zu Beginn der nächsten Stunde ansprechen?

### Woche 3 — Feedback und Verbesserung
- Eine Zwischenkurs-Feedback-Umfrage versenden (maximal 5 Fragen)
- `/student-feedback-analyzer` nutzen, um die Ergebnisse auszuwerten
- Mindestens eine sichtbare Änderung aufgrund des Feedbacks vornehmen — und den Lernenden mitteilen, dass Sie sie vorgenommen haben (baut Vertrauen auf und erhöht die Antwortquoten bei zukünftigen Umfragen)

### Woche 4 — Kursentwicklung
- `/online-course-creator` nutzen, wenn Sie einen Kurs aufbauen, oder `/lesson-planner` für die nächste Einheit
- `/lit-review` nutzen, um einen wesentlichen Lehransatz in Ihrem Lehrplan als evidenzbasiert zu verifizieren
- Zeit tracken: Wie lange dauert die Unterrichtsplanung jetzt im Vergleich zu vorher?

---

## Content-Erstellungs-Workflows

### Ein Quiz erstellen (von Anfang bis Ende)

```
/lesson-planner

Entwirf ein Quiz für [Stunden-/Einheitsthema].

Geprüfte Lernziele:
1. [Lernziel]
2. [Lernziel]
3. [Lernziel]

Benötigte Fragetypen: [MCQ / Kurzantwort / Wahr-Falsch / Lückentext / fallbasiert]
Schwierigkeitsgrad: [Einführung / Mittelstufe / Fortgeschritten]
Gesamtfragen: [N]
Erlaubte Zeit: [X Minuten]
Zu abdeckende Bloom'sche Stufen: [Erinnern: X Fragen / Anwenden: X Fragen / Analysieren: X Fragen]

Erzeuge: das Quiz mit Antwortschlüssel, Distraktoren für MCQs, die auf häufige Missverständnisse abzielen, und eine Beurteilungsrubrik für offene Fragen.
```

### Eine Rubrik erstellen

```
/lesson-planner

Entwirf eine Beurteilungsrubrik für [Aufgabentyp: Aufsatz / Projekt / Präsentation / Laborbericht].

Geprüfte Lernziele: [Liste]
Aufgabenbeschreibung: [kurze Beschreibung dessen, was Lernende einreichen]
Punkteskala: [4-Punkte / Prozentsatz / Buchstabenote / standardbasiert]

Erzeuge eine Rubrik mit:
- 4–5 Dimensionen (Kriterien)
- 4 Leistungsstufen pro Dimension (ausgezeichnet / kompetent / in Entwicklung / beginnend)
- Klaren, verhaltensbeschreibenden Deskriptoren für jede Zelle — keine vage Sprache wie "zeigt Verständnis"
```

### Sprechernotizen für Folienpräsentationen schreiben

```
Ich habe eine Präsentation zu [Thema] mit diesen Folien:

Folie 1: [Titel und Kernaussage]
Folie 2: [Titel und Kernaussage]
[Fortsetzung]

Schreibe für jede Folie:
- 2–3 Sätze Sprechernotizen (was gesagt werden soll, nicht was auf der Folie steht)
- Eine Diskussionsfrage, die nach dieser Folie an die Klasse gestellt wird
- Ein häufiges Missverständnis, das präventiv angesprochen werden soll
```

### Workshop-Moderationsanleitung

```
Schreibe eine Moderationsanleitung für einen [X-stündigen] Workshop zu [Thema].

Zielgruppe: [wer sie sind]
Ziel: [was sie danach tun oder anders denken sollen]
Format: [Präsenz / virtuell / hybrid]
Gruppengröße: [N Teilnehmende]

Erzeuge:
1. Vorbereitungsaufgaben (falls vorhanden)
2. Raum-/Plattformeinrichtungsanweisungen
3. Eisbrecher oder Einstieg (thematisch mit dem Workshop verbunden)
4. Hauptaktivitäten mit Moderationshinweisen
5. Diskussionsfragen für jeden Abschnitt
6. Häufige Moderationsherausforderungen und wie damit umzugehen ist
7. Abschlussreflexion und Aktionsverpflichtung
8. Post-Workshop-E-Mail an Teilnehmende
```

---

## Tool-Integrationen

### Google Classroom / Canvas / Blackboard
Claude erstellt Unterrichtspläne, Quizfragen, Rubriken und Ankündigungen als Text → Sie fügen diese in Ihr LMS ein. Für Quizfragen speziell: Claude-Output als nummerierte Fragen formatieren → über die Massenimportfunktion Ihres LMS importieren.

### Google Forms / Microsoft Forms
Claude schreibt Ihre Feedback-Umfragefragen → in Forms einfügen → sammeln → CSV exportieren → Antworten zurück in `/student-feedback-analyzer` einfügen. Der gesamte Prozess dauert nach der Datenerhebung etwa 15 Minuten.

### Notion (für die Kursorganisation)
Kursstruktur in Notion aufbauen — eine Seite pro Unterrichtsstunde. Claude erstellt Unterrichtsplaninhalte → in jede Seite einfügen. Notions Datenbank nutzen, um zu verfolgen, welche Stunden Abschluss-Ticket-Daten und erhobenes Feedback haben.

### Canva (für visuelle Materialien)
Claude schreibt die Inhalte von Folien, Handouts und Infografiken → Design in Canva. Claude nutzen, um spezifische, klare Stichpunkte zu schreiben — Canva funktioniert am besten, wenn der Text bereits prägnant ist.

### Zoom / Google Meet
Nach Online-Synchronsitzungen Chat-Transkripte oder Sitzungsnotizen in `/meeting-to-action` einfügen, um Diskussionspunkte und unbeantwortete Fragen für die Nachbereitung zu extrahieren.

---

## Kennzahlen zum Verfolgen

| Aktivität | Manuelle Zeit | Mit Claude |
|---|---|---|
| Unterrichtsplan (neues Thema) | 3 Stunden | 20–30 Min. |
| Quiz mit Antwortschlüssel | 90 Min. | 15 Min. |
| Aufgabenrubrik | 45 Min. | 10 Min. |
| Analyse der Feedback-Umfrage | 90 Min. | 15 Min. |
| Beurteilungsdatenanalyse | 60 Min. | 20 Min. |
| Workshop-Moderationsanleitung | 3 Stunden | 30 Min. |

**Was mit der gesparten Zeit anfangen:** Mehr individuelle Lernenden-Unterstützung, reaktionsschnelleres Feedback zu Lernenden-Arbeiten, tiefere Unterrichtspersonalisierung, professionelles Lesen und Weiterbildung.

---

## Häufige Fehler (und wie Claude Code sie verhindert)

**Fehler 1: Vage Lernziele**
`/lesson-planner` erzwingt Verben der Bloom'schen Taxonomie — kein "verstehen" oder "schätzen" mehr. Lernziele werden messbar.

**Fehler 2: Beurteilungen, die Erinnern testen, obwohl Lernziele Anwenden erfordern**
`/lesson-planner` ordnet Beurteilungsfragen Lernzielen nach Bloom'scher Stufe zu. Fehlausrichtung wird sichtbar.

**Fehler 3: Feedbackdaten, die nie zu Änderungen führen**
`/student-feedback-analyzer` endet mit spezifischen, umsetzbaren Empfehlungen. Das Ergebnis ist eine To-do-Liste, kein Bericht.

**Fehler 4: Unterrichtsstunden ohne Lernstandskontrolle**
Jeder Unterrichtsplan von `/lesson-planner` enthält ein Abschluss-Ticket. Ist die Stunde zu kurz, ist es eine formative Frage, die in die Aktivität eingebettet ist.

**Fehler 5: Jahr für Jahr auf dieselbe Weise unterrichten, weil die Neugestaltung zu lange dauert**
Mit Claude dauert eine Kursauffrischung, die früher eine Woche in Anspruch nahm, einen Tag. Die Aktivierungsenergie für Verbesserungen sinkt erheblich.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [Unterrichtsplaner-Skill](../skills/productivity/lesson-planner.md)
- [Schülerfeedback-Analyse-Skill](../skills/productivity/student-feedback-analyzer.md)
- [Online-Kursersteller-Skill](../skills/small-business/online-course-creator.md)
- [Literaturrecherche-Skill](../skills/productivity/lit-review.md)

---
