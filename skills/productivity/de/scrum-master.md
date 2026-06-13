---
name: scrum-master
description: "Scrum-Facilitation: Sprint-Zeremonien, retrospektive Formate, Blockadeabbau, Velocity-Coaching, Skalierung von Scrum über mehrere Teams — praktische Scrum-Master-Muster"
---

# Scrum-Master-Skill

## Wann aktivieren
- Erleichterung von Sprint-Zeremonien (Planung, Standup, Review, Retro)
- Durchführung von Retrospektiven, die echte Probleme aufdecken (nicht nur „was ist gut gelaufen")
- Unterstützung eines Teams, das mit Geschwindigkeit, Umfang oder Verpflichtung kämpft
- Skalierung von einem Team auf mehrere Teams (Scrum of Scrums, SAFe Grundlagen)
- Coaching eines neuen Teams in Scrum-Praktiken
- Schreiben von Agenden für Sprint-Zeremonien

## Wann NICHT verwenden
- Jira-Konfiguration — verwenden Sie die jira-expert Skill
- Produktroadmap-Entscheidungen — das ist die Domäne des PM
- Technische Ingenieurentscheidungen — nicht von Scrum-Master Belang
- Einen echten Scrum-Master für Teams im Konflikt ersetzen — menschliche Erleichterung erforderlich

## Anweisungen

### Sprint-Retrospektive

```
Entwerfen Sie eine Retrospektive für [Team-Kontext].

Team-Größe: [X Personen]
Sprint-Länge: [2 Wochen]
Team-Gesundheit: [gesund / etwas Spannung / kämpft]
Letzte Retro: [welches Format / was kam dabei heraus]
Bemerkenswerte Veranstaltung dieses Sprints: [Incident / Lieferdruck / Team-Wechsel / keiner]

Wählen Sie ein retrospektives Format basierend auf Kontext:

1. Start / Stop / Continue (Standard, alle Team-Kontexte):
   - Start: was sollten wir beginnen?
   - Stop: was sollten wir stoppen?
   - Continue: was funktioniert und sollten wir schützen?
   Dauer: 60 min für einen 2-Wochen-Sprint

2. 4Ls (nach einem schweren Sprint):
   - Mochte: was hast du genossen?
   - Gelernt: was hast du entdeckt?
   - Fehlte: was fehlte?
   - Ersehnte: was hättest du dir anders gewünscht?

3. Segelboot (für Teams, die sich orientierungslos fühlen):
   - Wind (uns vorwärts treibend): was hilft uns, vorwärts zu gehen?
   - Anker (uns verlangsamend): was hält uns auf?
   - Felsen (kommende Risiken): was könnte uns versenken?
   - Sonne (Ziel): wo segeln wir hin?

4. Zeitleiste (nach Vorfällen oder großen Lieferungen):
   - Sprint auf einer Zeitleiste abbilden
   - Höhen und Tiefen als Team markieren
   - Besprechen, was jeden Höhe- und Tiefpunkt verursacht hat
   - Muster identifizieren

Erleichterungsleitfaden für [gewähltes Format]:
1. Das Spielfeld bereiten (5 min): psychologische Sicherheitsrahmen
2. Daten sammeln (15 min): stille Notizen auf dem Board
3. Erkenntnisse (20 min): Notizen in Themen gruppieren, besprechen
4. Entscheiden, was zu tun ist (15 min): über die top 2-3 Aktionselemente abstimmen
5. Schließen (5 min): Besitzer und Fälligkeitsdaten für jede Aktion bestätigen

Regel: Keine Retro endet ohne genannten Besitzer und Fälligkeitsdatum für jedes Aktionselement. „Das Team wird..." = niemand wird es.

Generieren Sie die vollständige Agenda für meinen spezifischen Kontext.
```

### Standup-Erleichterung

```
Verbessern Sie unser tägliches Standup.

Aktuelles Standup: [beschreiben — wie lange, Format, Probleme]
Team-Größe: [X Personen]
Entfernt / vor Ort / Hybrid: [spezifizieren]
Häufige Probleme: [dauert zu lange / Leute sind nicht präsent / keine Blockaden geteilt / Statusbericht statt Sync]

Standup-Formate:

3 klassische Fragen (pro Person):
1. Was habe ich gestern getan?
2. Was mache ich heute?
3. Gibt es Blockaden?
Problem: wird zu Statusbericht — Leute sprechen ZUM Scrum-Master, nicht miteinander.

Walking the Board (besser für In-Progress-Fokus):
- Schauen Sie sich jedes „In Progress" Element an, nicht jede Person
- „Wer arbeitet daran? Gibt es Blockaden?"
- Konzentriert sich auf Beendigung, nicht Beginn
- Besser für Kanban-nahe Teams

Zwei-Fragen-Modell (dünner):
1. Woran arbeite ich?
2. Brauche ich Hilfe?
Kein „gestern" = reduziert Standup auf < 10 Minuten mit < 10 Personen

Remote Standup Tipps:
- Verwenden Sie ein freigegebenes Board (Jira, Linear) auf dem Bildschirm — verhindert abstrakte Statusberichte
- Pünktlich starten, pünktlich beenden — verspätete Ankömmlinge treten ohne Zusammenfassung bei
- Blockaden gehen in Slack async; Standup ist für Koordination, nicht Problemlösung

Häufige Standup-Antimuster zum Beheben:
- Jeden Tag "Keine Blockaden" → Blockaden existieren; Menschen sind nicht wohl darin, zu teilen
  Beheben: stattdessen fragen „was würde dich schneller machen?"
- Eine Person spricht 5+ Minuten → nutzen Sie einen Timer (2 min/Person)
- Niemand bewegt seine Tickets danach → Blockaden oder Tickets sind falsch

Gestalten Sie mein Standup für meinen Team-Kontext neu.
```

### Velocity-Coaching

```
Helfen Sie, die Team-Geschwindigkeit zu verbessern.

Aktuelle Velocity: [X Story Points / Sprint-Durchschnitt letzter 3 Sprints]
Sprint-Länge: [2 Wochen]
Team-Größe: [X Ingenieure]
Bekannte Probleme: [Scope Creep / unrealistische Schätzungen / Unterbrechungen / technische Schulden / unklar Stories]

Velocity-Diagnose-Rahmen:

Schritt 1 — Unterscheiden Sie Arten von Velocity-Problemen:
a) Verpflichtungsproblem: Team verpflichtet sich zu X, liefert Y < X → Planung ist kaputt
b) Schätzungsproblem: Team liefert X, aber Stories werden ständig während des Sprints höher neu geschätzt
c) Unterbrechungsproblem: ungeplante Arbeit (Fehler, Vorfälle, Slack-Anfragen) aufzehrend Kapazität
d) Lieferproblem: Stories sitzen während des Sprints überwiegend „In Progress"

Schritt 2 — Messen Sie das echte Problem:
- Unterbrechungsrate: Verfolgung ungeplanter Arbeiten, die während des Sprints für 3 Sprints hinzugefügt werden. Wenn > 20% der verpflichteten Arbeit, ist das das Problem — nicht Schätzung.
- Zykluszeit: wenn Stories durchschnittlich > 5 Tage dauern, ist WIP-Limit zu hoch
- Verpflichtungsquote: verpflichtet / geliefert über letzte 3 Sprints

Schritt 3 — Interventionen nach Problemtyp:
a) Verpflichtung: führen Sie Sprint-Planung mit dem Team durch, nicht für sie. Hören Sie auf, sich zu unrefined Stories zu verpflichten.
b) Schätzung: führen Sie eine Pointing-Kalibrierungssession durch (vergleichen Sie vergangene Schätzungen mit aktuellen)
c) Unterbrechungen: Budget für Unterbrechungen (Reserve 20% der Velocity für ungeplante Arbeit)
d) Zykluszeit: erzwingen Sie WIP-Limit von maximal 2 Stories pro Ingenieur

Schritt 4 — Velocity nicht direkt optimieren:
Velocity ist ein Planungstool, keine Leistungsmetrik. Ein Team, das 40 Punkte bedeutungsvoller Arbeit leistet, ist besser als eines, das 60 Punkte von niedriger Arbeit leistet.

Diagnostizieren Sie mein Teams Velocity-Problem und empfehlen Sie den einzelnen hochsten Leverage-Change.
```

### Scrum-Zeremonien-Kalender

```
Entwerfen Sie den Sprint-Zeremonien-Kalender für [Team].

Team: [X Personen — Ingenieure, PM, Designer, QA]
Sprint-Länge: [2 Wochen]
Zeitzone: [alle gleich / verteilt]
Arbeitsstunden-Überschneidung: [X Stunden/Tag Überschneidung]

Zwei-Wochen-Sprint-Zeremonien-Zeitplan:

Montag, Sprint-Start:
- 10:00 — Sprint-Planung (2 Stunden)
  Wer: Gesamtes Team
  Ziel: Sprint-Backlog vereinbart, Sprint-Ziel gesetzt

Täglich Montag–Freitag:
- 09:30 — Tägliches Standup (max 15 min)
  Wer: Gesamtes Team
  Format: Board durchgehen

Freitag der Woche 1:
- 15:00 — Backlog-Verfeinerung (1 Stunde)
  Wer: PM + 2-3 Ingenieure (wechselnd)
  Ziel: Top 10 Backlog-Elemente geschätzt und geklärt

Donnerstag der Woche 2 (Tag vor Sprint-Ende):
- 14:00 — Sprint-Review (1 Stunde)
  Wer: Gesamtes Team + Stakeholder
  Ziel: Abgeschlossene Arbeiten vorführen, Feedback sammeln
- 15:30 — Retrospektive (1 Stunde)
  Wer: Nur Team (keine Stakeholder)
  Ziel: 2-3 umsetzbare Verbesserungen für nächsten Sprint

Freitag der Woche 2 (Sprint-Ende):
- Team vollendet verbleibende Arbeit
- PM schließt Sprint in Jira, bereitet Velocity-Diagramm vor

Entwerfen Sie den Kalender für meine Team-Größe, Zeitzone und meinen Arbeitsstil.
```

## Beispiel

**Benutzer:** Unsere Retrospektiven enden immer mit denselben 3 Aktionselementen („bessere Tickets schreiben", „mehr kommunizieren", „Scope Creep reduzieren") und es ändert sich nie. Wie behebe ich das?

**Claudies Diagnose:**

Diese 3 Aktionselemente sind Prozess-Plattitüden — sie benennen Symptome, ohne Ursachen zu adressieren, und sie haben keinen Besitzer. Deshalb ändert sich nichts. Die Retro macht die richtige Zeremonie, aber das falsche Ding.

**Grundursache von „bessere Tickets schreiben":**
Das bedeutet: Tickets, die in den Sprint gehen, sind unterspezifiziert, was Rework oder falsche Implementierung verursacht.
Echte Frage zu stellen: „Welches Ticket in den letzten 3 Sprints verursachte die meiste Überarbeitung? Warum war es unklar? Wer hat es geschrieben? Was fehlte?"
Spezifische Aktion: „Vor der nächsten Sprint-Planung überprüft der PM alle Tickets mit dem Ingenieur, der sie besitzt — dauert jeden Donnerstag 30 min."

**Grundursache von „mehr kommunizieren":**
Das ist normalerweise ein Symptom unkarer Eigentumsrechte, kein Kommunikationsfehler.
Echte Frage zu stellen: „Wann im letzten Sprint wusstest du nicht, was zu tun ist und musstest jemanden fragen? Warum wurde dir nicht früher mitgeteilt?"
Spezifische Aktion: „Fügen Sie einen „Abhängigkeitsfeld" zu jeder Story > 3 Punkte hinzu — wer sonst muss beteiligt sein?"

**Grundursache von „Scope Creep reduzieren":**
Das bedeutet: Elemente werden während des Sprints hinzugefügt, ohne andere zu entfernen.
Echte Frage zu stellen: „Wer hat die Mid-Sprint-Additions in den letzten 3 Sprints genehmigt? War es dringend oder vermeidbar?"
Spezifische Aktion: „Neues Element, das während des Sprints hinzugefügt wird, erfordert explizite Genehmigung von PM + tech lead UND Entfernung äquivalenter Punkte."

**Retro-Format-Änderung:**
Hören Sie auf, Start/Stop/Continue zu verwenden. Wechseln Sie zu einer Timeline-Retro — gehen Sie den letzten Sprint Tag für Tag zurück. Dies zwingt spezifische Beispiele anstelle von allgemeinen Beschwerden, und spezifische Beispiele haben spezifische Ursachen.

---
