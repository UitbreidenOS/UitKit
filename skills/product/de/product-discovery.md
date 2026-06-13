---
name: product-discovery
description: "Produktentdeckung: Kundeninterviews, Problemvalidierung, Opportunity-Bewertung, Jobs-to-be-Done-Framework, Definieren, was als nächstes gebaut werden soll und warum"
---

# Kompetenz Produktentdeckung

## Wann aktivieren
- Entscheidung treffen, was als nächstes mit wenig Beweisen gebaut werden soll
- Eine Produktidee vor der Investition in die Entwicklung validieren
- Kundeninterviews führen und Erkenntnisse synthetisieren
- Anwenden des Jobs-to-be-Done (JTBD) Frameworks zum Verstehen von Benutzermotivationen
- Schreiben einer Problemaussage oder eines Opportunity-Briefs
- Bewertung und Priorisierung einer Reihe von potenziellen Funktionen

## Wann nicht verwenden
- Nach der Entscheidung zu bauen — das ist Produktspezifikation und Bereitstellung
- UX/UI-Design — verwenden Sie ein Designwerkzeug oder einen Design-Sprint-Prozess
- A/B-Test-Design — verwenden Sie die experiment-designer Kompetenz
- Marktgrößenschätzung für Investoren — das ist ein Finanzmodell, keine Entdeckung

## Anweisungen

### Kundeninterview-Leitfaden

```
Schreiben Sie einen Kundeninterview-Leitfaden für [Problembereich/Produktbereich].

Was wir lernen möchten: [spezifische Unsicherheit oder Hypothese zum Validieren]
Interview-Ziel: [wen interviewen — Rolle, Unternehmenstyp, Kontext]
Geplante Anzahl von Interviews: [X]

Interview-Struktur (45-60 Minuten):

1. Aufwärmphase (5 Min):
   - „Erzählen Sie mir von Ihrer Rolle und wie eine typische [Woche / Projekt] aussieht"
   - „Wie lange machen Sie das schon?"
   - Ziel: Rapport aufbauen, Kontext verstehen — stellen Sie JETZT KEINE Fragen zum Produkt

2. Aktuelle Situation (10 Min):
   - „Durchlaufen Sie das letzte Mal, als Sie [die Sache, die wir lösen] tun mussten"
   - „Wie sieht dieser Prozess heute aus?"
   - „Wer ist sonst noch beteiligt?"
   - Regel: Fragen zum vergangenen Verhalten stellen, nicht zum hypothetischen zukünftigen Verhalten

3. Schmerz und Reibung (15 Min):
   - „Was ist der schwierigste Teil dieses Prozesses?"
   - „Wie lange dauert das? Wie oft?"
   - „Was haben Sie versucht, um das zu beheben? Was ist passiert?"
   - „Wie lösen Sie das heute? Was ist falsch an dieser Lösung?"

4. Motivation und Ergebnis (10 Min):
   - „Warum ist das für Sie / Ihr Team / Ihr Unternehmen wichtig?"
   - „Was wäre anders, wenn das vollständig gelöst würde?"
   - „Was kostet es, das nicht zu lösen?" (Zeit, Geld, Risiko, Emotion)

5. Schlusswort (5 Min):
   - „Gibt es etwas, das ich nicht gefragt habe, das mir helfen würde, das besser zu verstehen?"
   - „Mit wem sollte ich sprechen?"

Regeln:
- Fragen Sie nie „Würden Sie X verwenden?" — Menschen sagen ja zu allem Hypothetischem
- Zeigen Sie nie das Produkt oder Mockup, bevor Sie das Problem verstehen
- Fragen Sie ständig „Erzählen Sie mir mehr" und „Warum"
- Notieren Sie sich exakte Wörter (Vokabeln sind wichtig für Messaging)

Erstellen Sie den Leitfaden für meinen spezifischen Problembereich mit maßgeschneiderten Fragen.
```

### Jobs-to-be-Done-Analyse

```
Wenden Sie das Jobs-to-be-Done Framework an, um [Produkt/Funktion] zu verstehen.

Kontext: [beschreiben Sie das Produkt und den Benutzer, der den Job macht]

JTBD-Framework:

1. Definieren Sie den Job:
   Format: Wenn [Situation], möchte ich [Motivation], damit ich [Ergebnis].
   
   Beispiel: „Wenn ich einen neuen Ingenieur in die Codebasis einarbeite, möchte ich ihn schnell produktiv machen, damit ich die Team-Geschwindigkeit aufrechterhalten kann, ohne ein Engpass zu werden."
   
   Job für meinen Kontext: [Schreiben Sie die Job-Aussage]

2. Zerlegen Sie den Job in Schritte (Job Map):
   Schritt 1 — Definieren: Was tut der Benutzer, um die Aufgabe zu rahmen oder zu begrenzen?
   Schritt 2 — Lokalisieren: Welche Informationen oder Ressourcen muss er finden?
   Schritt 3 — Vorbereiten: Wie bereitet er sich vor, um den Job zu machen?
   Schritt 4 — Ausführen: Was ist die Kernjobaktion?
   Schritt 5 — Überwachen: Wie verfolgt er Fortschritt oder Qualität?
   Schritt 6 — Ändern: Was passt er an, wenn Dinge nicht nach Plan laufen?
   Schritt 7 — Abschließen: Wie beendet und übergibt er?

3. Ergebnisse identifizieren (womit der Benutzer Erfolg misst):
   - Geschwindigkeit: Wie schnell kann er [Schritt X] machen?
   - Genauigkeit: Wie zuverlässig produziert [Schritt X] das richtige Ergebnis?
   - Aufwand: Wie viel kognitiven/physischen Aufwand erfordert [Schritt X]?
   - Risiko: Wie sicher ist er, dass [Schritt X] nicht fehlschlägt?

4. Unterversorgte Ergebnisse finden (die Gelegenheit):
   Rate jeden Ergebnis: Wichtigkeit vs. aktuelle Zufriedenheit (1-10 Skala)
   Opportunity-Score = Wichtigkeit + (Wichtigkeit - Zufriedenheit)
   Score > 10: Starke Gelegenheit zu adressieren

Wenden Sie an für: [spezifischer Benutzer und Job in meinem Produkt].
```

### Opportunity-Bewertung

```
Bewerten und priorisieren Sie Produktchancen.

Zu bewertende Chancen: [Liste — können Features, Probleme zu lösen oder Segmente zu bedienen sein]
Verfügbare Daten: [Kundeninterviews / Support-Tickets / NPS-Kommentare / Analytik / keine]

Opportunity-Bewertungs-Framework (RICE oder gewichtete Kriterien):

RICE-Bewertung:
Reach: Wie viele betroffene Benutzer pro Quartal? [X]
Impact: Wie sehr verbessert es ihr Ergebnis? [riesig=3 / hoch=2 / mittel=1 / niedrig=0.5]
Confidence: Wie sicher sind wir über Reichweite und Auswirkung? [hoch=100% / mittel=80% / niedrig=50%]
Effort: Engineering-Wochen zum Bauen? [X]
RICE = (Reach × Impact × Confidence) / Effort

Alternatif: Gewichtete Kriterien (wenn Sie strategische Passung einbeziehen möchten):
| Gelegenheit | Nutzerschmerz (30%) | Strategische Passung (20%) | Häufigkeit (20%) | Aufwand (30%) | Gesamt |
|---|---|---|---|---|---|
| [A] | 8 | 7 | 9 | 5 | 7.2 |
| [B] | 6 | 9 | 4 | 8 | 6.8 |

Was in die Bewertung einzubeziehen ist:
- Nutzerschmerz-Schweregrad: Wie schlecht ist das Problem heute?
- Häufigkeit: Wie oft trifft der Benutzer dies?
- Strategische Ausrichtung: Fördert dies unsere Kernthese?
- Machbarkeit: Können wir es wirklich gut bauen?
- Marktdifferenzierung: Macht ein Konkurrent das schon gut?

Bewerten Sie meine [X] Gelegenheiten und erstellen Sie eine priorisierte Liste mit Begründung.
```

### Problembrief

```
Schreiben Sie einen Problembrief für [Gelegenheit].

Kontext: [Was wir über dieses Problem aus der Forschung wissen]
Beweis: [Interview-Zitate, Support-Ticket-Volumen, Analytik-Daten]
Betroffenes Segment: [Wer erlebt dies, wie viele Benutzer]

Problembrief-Struktur:

## Das Problem
[2-3 Sätze, die die spezifische Situation, Reibung und Auswirkungen beschreiben. Keine Lösung noch.]

## Wer es erlebt
[Benutzer-Persona + Quantifizierung: „X% unserer [Segment] Benutzer stehen damit konfrontiert wenn..."]

## Beweis
- Interview-Einblick: „[Genaues Zitat eines Benutzers]" — [Rolle, Unternehmen]
- Analytik: [relevanter Datenpunkt]
- Support: [Volumen oder Muster aus Support]

## Aktuelle Workarounds
[Wie Benutzer dies heute lösen — und warum diese Lösungen unzureichend sind]

## Warum das wichtig ist
[Geschäftsszenario: Auswirkung auf Kundenbindung, Erwerb, Umsatz oder strategische Position]

## Wie Erfolg aussieht
[Messbares Ergebnis — nicht eine Funktion, sondern das geänderte Verhalten oder Resultat des Benutzers]

## Was das NICHT ist
[Einschränkungen und Außerbereichs-Klarstellungen — was wir nicht versuchen werden zu lösen]

---
Offene Fragen, bevor wir bauen:
- [Frage 1 — Was wissen wir noch nicht?]
- [Frage 2]
Discovery-Besitzer: [Name]
Nächster Schritt: [X weitere Interviews / Prototyp-Test / Bauen?]

Schreiben Sie einen Problembrief für meine Gelegenheit mit den Beweisen, die ich bereitstelle.
```

## Beispiel

**Benutzer:** Wir sind ein Projektmanagement-Tool für Engineering-Teams. Wir hören ständig „unsere Ingenieure aktualisieren die Tickets nicht." Sollten wir bessere Jira-Synchronisation, mehr Erinnerungen oder Erzwingung von Ticket-Updates bauen? Zuerst Entdeckung.

**Claudees Entdeckungsplan:**

Nicht bauen noch. „Ingenieure aktualisieren Tickets nicht" ist ein Symptom mit mindestens 3 verschiedenen Grundursachen — jede erfordert eine andere Lösung.

**3 Hypothesen zum Testen in Interviews:**
1. **Reibungs-Hypothese:** Ingenieure wissen, dass sie aktualisieren sollten, aber der Workflow ist zu langsam (→ mit besserer UI, Tastaturkürzeln, Slack-Integration beheben)
2. **Vertrauens-Hypothese:** Ingenieure denken, dass Ticket-Daten nicht zählen, weil PMs sie nicht wirklich lesen (→ mit besseren Sichtbarkeitswerkzeugen für PMs beheben, nicht Ingenieur-Flows)
3. **Irrelevanz-Hypothese:** Tickets veraltern, weil Anforderungen sich während des Sprints ändern und niemand die Quelle der Wahrheit aktualisiert (→ mit leichtem Umplanungs-Flow beheben, nicht Erinnerungen)

**5 Interview-Fragen zu stellen (an Ingenieure, nicht PMs):**
1. „Durchlaufen Sie das letzte Ticket, an dem Sie gearbeitet haben — wann haben Sie es zuerst angesehen, wann zuletzt aktualisiert?"
2. „Wenn Sie eine Aufgabe beenden, was tun Sie als Nächstes?" (Hören: erwähnen nie Tickets)
3. „Was passiert, wenn Sie Ihr Ticket nicht aktualisieren?" (Hören: nichts / PM fragt mich / Sprint-Review ist verwirrend)
4. „Haben Sie jemals ein Ticket aktualisiert und nichts ist passiert?" (Validiert die Vertrauens-Hypothese)
5. „Was würde Sie wirklich dazu bringen, Tickets aktualisieren zu wollen?" (Offen, ohne zu projizieren zuhören)

Führen Sie 5 Interviews durch. Sie werden wissen, welche Hypothese wahr ist — und Sie werden wahrscheinlich 2-3 Monate sparen, indem Sie das Falsche bauen.

---
