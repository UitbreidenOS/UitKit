---
name: pm-sprint-review
description: "Sprint-Review: Velocity, Geliefert vs. Geplant, Blocker, Erkenntnisse, Prioritäten für den nächsten Sprint"
---

# Skill: PM-Sprint-Review

## Wann aktivieren
- Sprint-Abschluss-Review und Retrospektive durchführen
- Das Sprint-Review-Deck oder den asynchronen Bericht für Stakeholder vorbereiten
- Velocity berechnen und gelieferten vs. geplanten Scope vergleichen
- Blocker und Ursachen aus einem schiefgelaufenen Sprint extrahieren
- Prioritäten für den nächsten Sprint auf Basis der gewonnenen Erkenntnisse setzen
- Sprint-Zusammenfassung für die Führungsebene oder Investoren-Updates verfassen

## Wann NICHT verwenden
- Backlog-Pflege — für Story-Erstellung `/user-story-writer` verwenden
- Quartalsweise Roadmap-Planung — `/product-roadmap` verwenden
- Post-Launch-Nutzerforschung — `/product-analytics` oder `/ux-researcher` verwenden
- Bug-Triage — das ist ein Rhythmus-Tool, kein Debugging-Framework

## Anweisungen

### Kern-Sprint-Review-Prompt

```
Sprint-Review für [TEAMNAME] — Sprint [N], [DATEN] durchführen.

Sprint-Ziel: [was das angegebene Ziel für diesen Sprint war]
Sprint-Dauer: [1 / 2 Wochen]
Team: [N Engineers, N Designer, N QA]
Velocity-Kontext: durchschnittliche Velocity der letzten 3 Sprints: [N Story Points]

Sprint-Daten (Ticket-Liste oder Zusammenfassung einfügen):
Geplante Tickets: [Liste mit Story Points und Status: erledigt / teilweise / nicht begonnen / blockiert]
Ungeplante Arbeit im Sprint hinzugefügt: [Liste]
Gesamte geplante Punkte: [X] | Gesamte gelieferte: [X] | Velocity dieses Sprints: [X]

Erstellen:

## 1. Sprint-Ziel-Ergebnis
Haben wir das Sprint-Ziel erreicht? [Ja / Teilweise / Nein]
Einzeilige Bewertung: was in verständlichem Deutsch erreicht wurde.

## 2. Geliefert vs. Geplant (Tabelle)
| Feature / Story | Punkte | Status | Anmerkungen |
|---|---|---|---|
| [Ticket] | [X] | Erledigt / Teilweise / Verschoben | [Anmerkung] |

## 3. Was verschoben wurde und warum
Für jedes unvollendete Element: warum? (unterschätzt / blockiert / Scope-Creep / mid-Sprint deprioritisiert)
Ursachen-Muster: Gibt es ein gemeinsames Thema? (z. B. „3 von 4 Verschiebungen waren durch externe API-Änderungen blockiert")

## 4. Analyse ungeplanter Arbeit
Wie viel ungeplante Arbeit wurde hinzugefügt? War sie gerechtfertigt?
Regel: ungeplante Arbeit > 20% der Sprint-Kapazität deutet auf ein Planungs- oder Kommunikationsproblem hin.

## 5. Velocity-Trend
3-Sprint-Velocity-Trend: [Sprint N-2: X] [Sprint N-1: X] [Sprint N: X]
Verbessert, stabil oder sinkend? Was treibt das?

## 6. Retrospektiven-Highlights
Was gut lief (Top 2): spezifisch, nicht generisch
Was nicht (Top 2 mit Ursache): ehrlich, mit Verantwortlichem
Eine Maßnahme für den nächsten Sprint: eine einzige, konkrete Prozessänderung

## 7. Nächste Sprint-Prioritäten
Basierend auf was verschoben wurde und was noch in der Queue ist — empfohlene Top 5 Punkte für den nächsten Sprint.
```

### Velocity-Analyse

```
Velocity für [TEAM] über die letzten [N] Sprints analysieren.

Sprint-Daten:
Sprint 1: geplant [X] Pkt, geliefert [X] Pkt, Sprint-Ziel: [erreicht/verfehlt]
Sprint 2: geplant [X] Pkt, geliefert [X] Pkt, Sprint-Ziel: [erreicht/verfehlt]
Sprint 3: geplant [X] Pkt, geliefert [X] Pkt, Sprint-Ziel: [erreicht/verfehlt]
[...]

Diagnostizieren:
1. Durchschnittliche Velocity: [X Pkt]
2. Vorhersagbarkeit: Wie hoch ist die Standardabweichung? Hohe Abweichung = Planungsproblem
3. Muster: Übernimmt sich das Team konsistent? Liefert es bei bestimmten Arbeitstypen zu wenig?
4. Sprint-Ziel-Erfolgsrate: [X / N Sprints] — wenn unter 70%, muss der Planungsprozess überarbeitet werden
5. Empfohlene Kapazität für den nächsten Sprint basierend auf dem nachlaufenden 3-Sprint-Durchschnitt (nicht dem optimistischen Bestwert)

Regel: 80% der nachlaufenden durchschnittlichen Velocity als realistische nächste Sprint-Kapazität verwenden. 20% für ungeplante Arbeit, Bugs und Meetings reservieren.

Empfehlung: Sollten Sprint-Länge, Teamgröße oder Planungsprozess angepasst werden?
```

### Retrospektiven-Moderation

```
Sprint-Retrospektive für Sprint [N] moderieren.

Format: [synchron / asynchron]
Team: [N Personen, Rollen]
Sprint-Ergebnis: [Ziel erreicht / teilweise / verfehlt]
Bekannte heikle Themen: [Spannungen oder wiederkehrende Probleme, die anzusprechen sind]

Retrospektiven-Struktur:

1. WAS GUT LIEF (10 Min)
Prompt: „Was würdest du im nächsten Sprint ohne Zögern genauso machen?"
Gutes Signal: Spezifität. Wenn jemand sagt „Kommunikation war gut", nachfragen: „Gib mir ein konkretes Beispiel, wo sie besonders gut war."
Festhalten: Top 2-3 Themen mit Beispielen.

2. WAS NICHT FUNKTIONIERT HAT (10 Min)
Prompt: „Was hat uns verlangsamt, dich frustriert, oder was du ändern würdest, wenn du den Sprint wiederholen könntest?"
Regeln:
- Keine Schuldzuweisung an Einzelpersonen — Prozesse und Systeme verantwortlich machen
- „Der Prozess X war langsam" nicht „Jana war langsam bei X"
- Jedes Problem bekommt eine Schwere: wäre-schön-zu-beheben vs. verursacht-echten-Schaden

3. URSACHEN-ANALYSE (10 Min)
Für die Top 2 „was nicht funktioniert hat": 5-Warum-Methode anwenden
Beispiel:
Problem: „3 Tickets verschoben, weil Backend-API blockiert war"
Warum? → API war nicht bereit, als Frontend sie brauchte
Warum? → API-Scope war vor Sprint-Start nicht vereinbart
Warum? → Discovery fand parallel zur Implementierung statt
Warum? → Wir haben keine „Definition of Ready" für Frontend-abhängige Arbeit
Grundursache: wir beginnen Frontend-Arbeit bevor der Backend-Vertrag finalisiert ist
Lösung: „API-Vertrag genehmigt" als Teil der Definition of Ready für alle Frontend-Tickets hinzufügen

4. MASSNAHMEN (10 Min)
Regel: maximal 2 Maßnahmen pro Retro. Mehr als 2 und keine wird umgesetzt.
Format: [WAS] wird von [WER] bis [DATUM] erledigt
Beispiel: „Jonas wird eine Definition-of-Ready-Checkliste entwerfen und bis nächsten Montag in Slack teilen"

Retro-Struktur erstellen und jeden Abschnitt mit den von mir gelieferten Daten moderieren.
```

### Stakeholder-Sprint-Zusammenfassung

```
Sprint-Zusammenfassungs-E-Mail/-Dokument für [ZIELGRUPPE] verfassen.

Zielgruppe: [Führungsebene / Investoren / andere Teams / gesamtes Unternehmen]
Sprint: [N] | Daten: [Start-Ende]
Sprint-Ziel: [angeben]

Ton-Regeln:
- Führungsebene / Investoren: max. 3 Absätze, mit Ergebnis führen, datengestützt, kein Jargon
- Gesamtes Unternehmen: Erfolge mit Namen feiern, Verschiebungen ohne Schuldzuweisung erklären, Erwartungen setzen
- Andere Teams: was geliefert wurde und sie betrifft, was als nächstes kommt, etwaige Anfragen

Vorlage für Führungszusammenfassung:

Sprint [N] lieferte [X Story Points] von [Y geplanten], [erreichte / teilweise erreichte / verfehlte] das Sprint-Ziel von „[Ziel]".

Gelieferte Schlüsselinhalte: [2-4 Stichpunkte — spezifische Feature-Namen, keine generischen Beschreibungen]
[Feature]: [was es tut, welche Kunden danach gefragt haben oder was es freischaltet]
[Feature]: [...]

Was verschoben wurde: [1-2 Sätze — was und warum, ohne Beschönigung]

Nächste Sprint-Priorität: [das Wichtigste, das in Sprint N+1 geliefert wird, und warum es wichtig ist]

Zusammenfassung für meine Zielgruppe mit meinen Sprint-Daten erstellen.
```

### Sprint-Planungs-Prompt (Eingabe für nächsten Sprint)

```
Sprint [N+1] basierend auf diesem Sprint-Review planen.

Kapazität:
- Team: [N Engineers, N Designer]
- Sprint-Tage: [10 / 5 Arbeitstage]
- Feiertage oder Urlaub: [Abwesenheiten auflisten]
- Erwartete Kapazität: [N% der normalen — z. B. 80% wegen 2 Urlaubstagen]

Zu berücksichtigende Backlog-Punkte:
[Top 10-15 Kandidaten mit Story-Point-Schätzungen einfügen]

Einschränkungen:
- Aus Sprint N verschoben (muss übernommen werden): [Liste]
- Zugesagte Liefertermine (externe Abhängigkeiten, Kundenzusagen): [Liste]
- Nice-to-have (kann bei knapper Kapazität entfallen): [Liste]

Sprint-Ziel-Kandidaten:
Option A: [Ziel] — Begründung
Option B: [Ziel] — Begründung
Option C: [Ziel] — Begründung

Anhand der nachlaufenden 3-Sprint-Velocity von [X Pkt] und der 80%-Kapazitätsregel empfehlen:
1. Das Sprint-Ziel (welche Option und warum)
2. Genau welche Punkte in diesem Sprint committen
3. Was im Backlog lassen
4. Risiko: welche Punkte in diesem Plan wahrscheinlich verschoben werden und warum
```

## Beispiel

**Nutzer:** Sprint 23, 2-Wochen-Sprint. Ziel: „CSV-Export launchen, damit Enterprise-Nutzer ihre Daten herunterladen können." Team von 4 Engineers, 1 Designer. Geplant 42 Pkt. Geliefert: CSV-Export (erledigt, 13 Pkt), Massenauswahl-UI (erledigt, 8 Pkt), API-Rate-Limiting (teilweise — 5/8 Pkt geliefert), 3 Bug-Fixes (erledigt, 7 Pkt), neues Onboarding-Flow (nicht gestartet, 14 Pkt, Grund: Design nicht finalisiert). Sprint-22-Velocity: 38. Sprint 21: 40.

**Ausgabe:**

```markdown
# Sprint 23 Review — Woche bis 6. Juni

## Sprint-Ziel-Ergebnis
TEILWEISE — Wir haben das Headline-Feature (CSV-Export) geliefert, aber der Onboarding-Flow hat nicht begonnen, da das Design vor Sprint-Kickoff nicht finalisiert war. Das Kernziel für Enterprise-Kunden wurde erreicht.

## Geliefert vs. Geplant
| Element | Punkte | Status | Anmerkungen |
|---|---|---|---|
| CSV-Export | 13 | Erledigt | Sprint-Ziel erreicht |
| Massenauswahl-UI | 8 | Erledigt | Ermöglicht CSV-Export-UX |
| API-Rate-Limiting | 8 | Teilweise (5 geliefert) | Edge-Case-Behandlung noch offen |
| Bug-Fixes (3) | 7 | Erledigt | |
| Neuer Onboarding-Flow | 14 | Nicht gestartet | Design vor Sprint-Start nicht finalisiert |
| **Gesamt** | **50** | **33 geliefert** | **66% Abschlussrate** |

## Was verschoben wurde und warum
Onboarding-Flow (14 Pkt): Design war vor dem Sprint-Planning nicht finalisiert. Das ist kein Sprint-Ausführungsproblem — es ist ein Prozessproblem. Das Team hat sich zu Arbeit verpflichtet, die noch nicht bereit war.
Grundursache: Wir haben keine „Definition of Ready" — Tickets haben das Sprint-Planning ohne Design-Abnahme betreten.

API-Rate-Limiting (3 Pkt verbleibend): Edge Cases unterschätzt. Kein systemisches Problem.

## Ungeplante Arbeit
Keine Arbeit mid-Sprint hinzugefügt. Gute Disziplin in diesem Sprint.

## Velocity-Trend
Sprint 21: 40 Pkt | Sprint 22: 38 Pkt | Sprint 23: 33 Pkt
Velocity sinkt. Die 14 Pkt nicht gestarteter Arbeit verdeckt ein echtes Kapazitätsproblem —
das Team stellt keine Design-Bereitschaft sicher, bevor es sich verpflichtet.

## Retrospektiven-Highlights
Gut gelaufen:
1. CSV-Export pünktlich geliefert, kein Rework — gutes Upfront-Scoping durch den Engineering-Lead.
2. Bug-Fix-Batch war effektiv — 3 Bugs in einer konzentrierten Sitzung geschlossen.

Nicht gut gelaufen:
1. Onboarding-Flow ohne Design-Bereitschaft committed. Hat die Sprint-Planning-Diskussion verschwendet.
   Maßnahme: Sarah entwirft bis nächsten Montag eine „Definition of Ready"-Checkliste und fügt sie unserer Sprint-Vorlage hinzu.

2. API-Rate-Limiting wurde unterschätzt. Wir schätzen Backend-Komplexität falsch ein.
   Maßnahme: Backend-Schätzungen künftig +2 Pkt Puffer für Edge Cases einschließen.

## Nächste Sprint-Prioritäten
1. Onboarding-Flow (14 Pkt) — nur committen, wenn Design abgezeichnet ist (Definition of Ready)
2. Verbleibende API-Rate-Limiting-Edge-Cases (3 Pkt) — übernehmen, klein
3. [Nächste Punkte aus dem Backlog basierend auf Roadmap-Prioritäten]

Empfohlene Sprint-24-Kapazität: 37 Pkt (80% des 3-Sprint-Durchschnitts von 39 Pkt)
```

---
