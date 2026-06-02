# Claude für Executive Assistants und Chiefs of Staff

Alles, was ein EA, Senior EA oder Chief of Staff benötigt, um KI-gestützte Führungskräfteunterstützung durchzuführen — Briefings, Meeting-Management, Stakeholder-Kommunikation, Board-Vorbereitung und Projektverfolgung in Claude Code.

---

## Für wen dieser Leitfaden gedacht ist

Sie sind Executive Assistant oder Chief of Staff und unterstützen eine C-Suite-Führungskraft. Ihre Aufgabe ist es, Ihre Führungskraft effektiver zu machen, indem Sie kontrollieren, was diese erreicht, sie auf das Wesentliche vorbereiten und alles erledigen, das nicht ihre direkte Aufmerksamkeit erfordert. Ihre Tage verbringen Sie in einem permanenten Zustand des Kontextwechsels — Board-Vorbereitung, Stakeholder-Kommunikation, Briefings, Logistik und alles, was durch die Ritzen fällt.

Claude Code wird Ihre Vorbereitungsmaschine: Briefings in Minuten erstellt, sensible Kommunikation überprüft, bevor sie auf dem Schreibtisch Ihrer Führungskraft landet, und Board-Decks strukturiert, bevor die Führungskraft Hand anlegt.

**Vor Claude Code:** 90 Minuten für die Vorbereitung eines soliden Executive Briefings. 45 Minuten für den Entwurf einer sensiblen Gesamtunternehmens-Ankündigung. 2 Stunden für die Erstellung eines Board-Vorbereitungsdokuments von Grund auf.

**Danach:** Executive Briefing in 20 Minuten. Ankündigugnsentwurf in 15 Minuten. Board-Vorbereitung in 30 Minuten.

---

## Installation in 30 Sekunden

```bash
# EA- und CoS-Skills installieren
npx claudient add skill small-business/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/board-deck-builder
npx claudient add skill productivity/confluence-expert
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Den Chief-of-Staff-Agenten installieren
npx claudient add agent advisors/chief-of-staff
```

---

## Ihr Claude Code EA- und CoS-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/exec-briefing` | Vorbesprechungs-Briefing: Teilnehmerprofile, Gesprächspunkte, Agenda, gewünschte Ergebnisse, wozu NICHT verpflichtet werden soll | Jedes hochkarätige Meeting |
| `/stakeholder-comms` | Unternehmensankündigungen, sensible Updates, All-Hands-Vorbereitung, Board-Kommunikation, Krisenmanagement | Jeder bedeutende Kommunikationsentwurf |
| `/meeting-to-action` | Transkript oder Notizen → Aktionspunkte, Entscheidungen, Verantwortliche, Fristen | Nach jedem wichtigen Meeting |
| `/monday-brief` | Wöchentliches Briefing-Dokument für die Führungskraft — Prioritäten, wichtige Meetings, Beobachtungsliste | Jeden Montagmorgen |
| `/board-deck-builder` | Board-Meeting-Deck-Struktur, Narrativ und Inhaltsvorbereitung | Monatliche oder vierteljährliche Board-Meetings |
| `/confluence-expert` | Dokumentenmanagement, Wiki-Struktur, Team-Wissensbasis | Dokumentation und Wissensmanagement |

### Agent

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `chief-of-staff` | Sonnet | Komplexe strategische Planung, Multi-Stakeholder-Koordination, Betriebsrhythmus-Design |

---

## Täglicher Workflow

### Morgen (30 Minuten)

**1. Monday Brief — was Ihre Führungskraft diese Woche wissen muss**

Jeden Montagmorgen ausführen, bevor die Führungskraft ihren Tag beginnt:

```
/monday-brief

Wöchentliches Briefing für [Name der Führungskraft] — Woche vom [Datumsbereich].

WICHTIGE MEETINGS DIESE WOCHE:
- [Tag, Uhrzeit]: [Meeting-Name] — [kurzer Kontext — wer, was steht auf dem Spiel]
- [Tag, Uhrzeit]: [Meeting-Name] — [kurzer Kontext]
- [Tag, Uhrzeit]: [Meeting-Name] — [Kontext]

LIEFERUNGEN, DIE DIESE WOCHE VON DER FÜHRUNGSKRAFT FÄLLIG SIND:
- [Punkt] — fällig am [Datum] — [wer es braucht]
- [Punkt]

DINGE, DIE SIE WISSEN MÜSSEN (aber wahrscheinlich noch nicht wissen):
- [Wichtige Entwicklung — Wettbewerbernachrichten, Teamsituation, Stakeholder-Stimmung]
- [Punkt]

AUSSTEHENDE ENTSCHEIDUNGEN (Führungskraft muss diese Woche entscheiden):
- [Entscheidung] — Kontext: [kurz] — Frist: [Datum]

ZU BEOBACHTEN:
[Alles, was sich entwickelt und noch nicht dringend ist, es aber wird, wenn es nicht gemanagt wird]

Format: maximal 1 Seite. Stichpunkte. Kein Fülltext. Die Führungskraft liest dies in 3 Minuten.
```

**2. Vorbesprechungs-Briefings — Vorbereitung für denselben Tag**

Für jedes hochkarätige Meeting heute:

```
/exec-briefing

[Führungskraft] hat ein Meeting mit [Teilnehmer] um [Uhrzeit].

Meeting-Zweck: [worum es bei diesem Meeting geht]
Teilnehmer: [Name, Titel, Unternehmen — wichtige Fakten für jeden]
Was wir von diesem Meeting wollen: [Ergebnis]
Was sie von uns wollen: [ihr Ziel]
Hintergrund: [relevante Vorgeschichte]
Wozu NICHT verpflichtet werden soll: [eventuelle Einschränkungen]

Erstelle das Briefing. Ich brauche es bis [Uhrzeit — 1–2 Stunden vor dem Meeting].
```

---

### Nach dem Meeting (15 Minuten nach wichtigen Meetings)

**3. Meeting zu Aktionspunkten**

```
/meeting-to-action

Extrahiere Aktionspunkte aus diesem Meeting.

Meeting: [Name]
Datum: [Datum]
Teilnehmer: [Liste]

[Notizen, Transkript oder Ihre Zusammenfassung einfügen]

Extrahiere:
- Getroffene Entscheidungen
- Aktionspunkte (wer besitzt was bis wann)
- Offene Fragen (keine Entscheidung getroffen, Follow-up nötig)
- Erforderliche Follow-up-Kommunikation
```

---

### Kommunikationsentwurf (auf Abruf)

**4. Sensible Unternehmenskommunikation**

```
/stakeholder-comms

Entwurf: [Art der Kommunikation]
Von: [Name und Titel der Führungskraft]
An: [Zielgruppe]

Die Nachricht: [was passiert]
Warum es passiert: [Begründung]
Was es für die Zielgruppe bedeutet: [Auswirkung]
Tonalität: [einfühlsam / direkt / feierlich / vorsichtig]
Einschränkungen: [was Rechts-/HR-Abteilung gesagt hat, das wir nicht einschließen dürfen]

Überprüfen auf: Tonalität, Klarheit, alles, was missverstanden werden könnte, was fehlt.
```

**5. Board-Kommunikation**

```
/stakeholder-comms

Board [Art: Meeting-Zusammenfassung / außerordentliches Update / Anfrage / Meilenstein-Ankündigung].

Was passiert ist oder was passiert: [Fakten]
Was der Board wissen oder tun muss: [Maßnahme oder Information]
Zeitplan: [wann Entscheidung benötigt wird oder wann mehr Informationen verfügbar sind]

Unter 400 Wörter. Direkt. Fakten zuerst.
```

---

### Board-Meeting-Vorbereitung (monatlich oder vierteljährlich)

**6. Board-Deck-Vorbereitung**

```
/board-deck-builder

Erstelle die Board-Meeting-Deck-Struktur für [Unternehmensname] — [Q? Monat] [Jahr].

Board-Meeting-Datum: [Datum]
Board-Zusammensetzung: [wichtige Mitglieder auflisten]
Wichtige Themen dieses Quartals: [Agenda-Punkte auflisten]
Zu präsentierende Leistungshöhepunkte: [Kennzahlen und Meilensteine]
Ehrlich zu präsentierende Herausforderungen: [was nicht wie geplant verlaufen ist]
Vom Board benötigte Entscheidungen: [Liste]

Erstellen Sie: Deck-Übersicht, foliengenaue Inhaltsstruktur, Gesprächspunkte pro Abschnitt, erwartete Board-Fragen.
```

---

### Wöchentlicher Abschluss (Freitag)

**7. Wochenendzusammenfassung**

```
/monday-brief

Wochenendzusammenfassung für [Führungskraft].

WAS DIESE WOCHE ERLEDIGT WURDE:
[Wichtige abgeschlossene Punkte auflisten]

OFFENE PUNKTE, DIE IN DIE NÄCHSTE WOCHE ÜBERTRAGEN WERDEN:
[Liste]

WAS VOR MONTAG DIE AUFMERKSAMKEIT DER FÜHRUNGSKRAFT BENÖTIGT:
[Dringende Punkte, die vor Wochenschluss erledigt werden müssen]

VORSCHAU AUF DIE NÄCHSTE WOCHE:
[Wichtige Meetings, Lieferungen und Situationen, die beobachtet werden sollen]
```

---

## 30-Tage-Einstiegsplan (neuer EA oder CoS)

### Woche 1 — Die Landschaft erkunden
- Alle EA/CoS-Skills installieren: `npx claudient add skill productivity/[name]`
- Den Kalender der Führungskraft kennenlernen: welche Meetings wiederkehren, welche hochkarätig sind, welche sie fürchten
- Das Monday-Brief-Format mit der Führungskraft besprechen — möchten Sie mehr oder weniger Details? anderen Fokus?
- Die 5 wichtigsten Stakeholder in der Welt der Führungskraft identifizieren und Profile mit `/exec-briefing` erstellen

### Woche 2 — Kommunikations-Workflow
- Das nächste Board-Update oder eine bedeutende Ankündigung mit `/stakeholder-comms` entwerfen
- Der Führungskraft den Entwurf vor und nach zeigen — die Zeitersparnis und Qualität sichtbar machen
- Den Kommunikationsüberprüfungsprozess etablieren: wer überprüft sensible Entwürfe, bevor sie rausgehen?
- `/meeting-to-action` eine Woche lang bei jedem Meeting nutzen — verfolgen, was erledigt wird vs. was nicht

### Woche 3 — Board- und Stakeholder-Vorbereitung
- `/exec-briefing` nutzen, um die Führungskraft auf das nächste bedeutende externe Meeting vorzubereiten
- `/board-deck-builder` für das bevorstehende Board-Meeting nutzen
- Das Ergebnis mit der Führungskraft besprechen — Detailniveau kalibrieren und was aus internem Wissen ergänzt werden soll

### Woche 4 — Systeme und Automatisierung
- Den wöchentlichen Rhythmus dokumentieren — welche Claude-Skills an welchen Tagen eingesetzt werden
- Eine Bibliothek wiederverwendbarer Prompts für die häufigsten Aufgaben aufbauen
- Identifizieren, wofür immer noch zu viel Zeit aufgewendet wird — es gibt wahrscheinlich einen Claude-Workflow dafür
- Benchmarks setzen: Wie lange dauert jede Aufgabe? Verbesserung über die nächsten 90 Tage verfolgen

---

## Grundsätze für hochkarätige Kommunikation

Diese gelten für alles, was Sie für Ihre Führungskraft entwerfen:

**1. Mit der Nachricht beginnen, nicht mit dem Kontext**
"Wir schließen das Londoner Büro zum 1. März." Nicht "Da wir unseren Immobilienbestand weiterhin im Kontext unserer sich entwickelnden hybriden Arbeitsstrategie evaluieren..."

**2. Schwieriges klar ansprechen**
Euphemismen mildern schlechte Nachrichten nicht — sie signalisieren, dass die Führungsebene dem Publikum nicht mit Ehrlichkeit vertraut, was mehr Vertrauen zerstört als die Nachricht selbst.

**3. Maximal drei Punkte**
Menschen erinnern sich an drei Dinge aus jeder Kommunikation. Haben Sie sieben Punkte, wählen Sie drei. Der Rest kommt in den Anhang oder die Nachbereitung.

**4. Sagen Sie, was als nächstes passiert**
Jede bedeutende Ankündigung sollte mit einem konkreten nächsten Schritt enden — ein Follow-up-Meeting, eine Kontaktperson, ein Datum für weitere Informationen.

**5. Rechtsüberprüfung ist für sensible Kommunikation nicht optional**
Claude entwirft effizient und erkennt Tonalitätsprobleme. Es ersetzt nicht die HR- und Rechtsüberprüfung für: Entlassungen, Leistungsmaßnahmen, Regulierungsangelegenheiten, materielle Geschäftsänderungen.

---

## Tool-Integrationen

### Google Calendar
Claude kann den Kalender Ihrer Führungskraft nicht direkt lesen (es sei denn, Sie verwenden einen Kalender-MCP), aber Sie können die Meetings der Woche als Text einfügen. Verwenden Sie dieses Format:
```
Montag 9:00 Uhr: [Meeting-Titel] — [Teilnehmer] — [Dauer] — [Ziel]
Montag 11:00 Uhr: [Meeting] ...
```
Dann `/monday-brief` mit diesem als Kontext ausführen.

### Slack / Teams
Sensible Nachrichten oder Ankündigungen in Claude entwerfen → überprüfen → in Slack einfügen. Für wiederkehrende All-Hands-Zusammenfassungen die Stichpunkte aus `/meeting-to-action` in Ihren Team-Channel einfügen.

### Notion / Confluence
`/confluence-expert` nutzen, um Dokumentationsseiten zu strukturieren. Claude entwirft den Inhalt — Sie fügen ihn in Ihr Wiki ein. Für wiederkehrende Dokumente (Board-Updates, wöchentliche Briefings) Vorlagen in Notion erstellen und mit Claude-Outputs befüllen.

### Board-Portal (Diligent, Boardvantage)
Claude erstellt Board-Kommunikation als Text → formatieren und in Ihr Board-Portal hochladen. Für Deck-Inhalte liefert Claude die Struktur und Gesprächspunkte — Ihr Designer erstellt die visuelle Version.

---

## Kennzahlen zum Verfolgen

| Aktivität | Zeit vor Claude | Zeit mit Claude |
|---|---|---|
| Executive Briefing-Dokument | 90 Min. | 20 Min. |
| Unternehmensweiter Ankündigungsentwurf | 45 Min. | 15 Min. |
| Board-Meeting-Vorbereitung | 3 Stunden | 45 Min. |
| Meeting-Aktionspunkte | 30 Min. | 8 Min. |
| Monday Brief | 30 Min. | 10 Min. |
| Sensible Kommunikationsentwurf | 60 Min. | 20 Min. |

---

## Häufige Fehler (und wie Claude Code sie verhindert)

**Fehler 1: Briefings, die zu lang sind**
`/exec-briefing` ist so strukturiert, dass es prägnante, übersichtliche Dokumente erzeugt. Führungskräfte lesen keine langen Briefings — sie bekommen eine Zusammenfassung, ob Sie eine schreiben oder nicht. Machen Sie es absichtlich.

**Fehler 2: Ankündigungen, die die Nachricht vergraben**
`/stakeholder-comms` ist so geplant, dass die Nachricht im ersten Satz steht. Wenn Claude sie vergräbt, darauf hinweisen und eine Umschreibung mit der Nachricht in Satz 1 anfordern.

**Fehler 3: Meeting-Aktionspunkte, die nicht erledigt werden**
`/meeting-to-action` strukturiert Aktionspunkte mit Verantwortlichem, Fälligkeitsdatum und Erfolgskriterium. Vage Aktionen werden nicht erledigt. Spezifische schon.

**Fehler 4: Sensible Kommunikation, die das emotionale Register verfehlt**
Claude prüft auf Klarheit und Tonalitätsprobleme, aber Sie kennen Ihre Führungskraft und Ihre Kultur. Überprüfen Sie jede sensible Kommunikation, bevor sie Ihren Schreibtisch verlässt — Claude ist der erste Lektor, nicht der letzte.

**Fehler 5: Board-Materialien, die berichten statt informieren**
`/board-deck-builder` ist so konzipiert, dass Materialien um Entscheidungen herum strukturiert werden, nicht nur um Daten. Boards müssen Entscheidungen treffen. Machen Sie es ihnen leicht.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [Executive-Briefing-Skill](../skills/productivity/exec-briefing.md)
- [Stakeholder-Kommunikations-Skill](../skills/productivity/stakeholder-comms.md)
- [Meeting-zu-Aktionspunkten-Skill](../skills/small-business/meeting-to-action.md)
- [Board-Deck-Builder-Skill](../skills/productivity/board-deck-builder.md)

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
