---
name: persona-builder
description: "Nutzer-Persona-Builder aus Forschungsdaten: Demografie, Ziele, Schmerzpunkte, Verhaltensweisen, Zitate"
---

# Skill: Persona-Builder

## Wann aktivieren
- Nutzerforschungsdaten (Interviews, Umfragen, Support-Tickets, Analytics) liegen vor und sollen in umsetzbare Personas destilliert werden
- Ein Design- oder Produktteam startet eine neue Initiative und braucht ein gemeinsames Verständnis darüber, für wen gebaut wird
- Annahmen über Nutzer anhand datengestützter Archetypen hinterfragen oder validieren
- Personas erstellen, um Roadmap-Priorisierung, Texttton oder Feature-Scope-Entscheidungen zu leiten
- Neue Teammitglieder einarbeiten, die schnell die Nutzerbasis verstehen müssen

## Wann NICHT verwenden
- Keine tatsächlichen Nutzerdaten vorhanden — zuerst die Forschung durchführen; synthetische Personas aus Annahmen sind schädlich
- Eine Marketing-Persona für Targeting/Segmentierung wird benötigt — anderes Ziel und anderer Aufbau als eine UX-Persona
- Journey Mapping gewünscht — dafür `/ux-researcher` nach Definition der Personas verwenden
- Ein detailliertes Verhaltensprofil für einen bestimmten Power-User wird benötigt — das ist ein User-Archetype oder ein Job-Story, keine Persona

## Anweisungen

### Vollständige Persona-Erstellung aus Forschungsdaten

```
Nutzer-Personas aus diesen Forschungsdaten erstellen.

## Eingabedaten
Verfügbare Datenquellen: [Nutzerinterviews (N) / Umfrageergebnisse (N Antworten) / Analytics-Segmente / Support-Tickets / Usability-Sitzungen / alle]
Produkt: [Name und 1-Satz-Beschreibung]
Nutzerbasis: [wer dieses Produkt nutzt — die Bandbreite der Nutzertypen klar beschreiben]

## Zu analysierende Rohdaten
[Interview-Notizen, Umfrage-Antwort-Themen, Analytics-Segmente, Schlüsselzitate, Support-Ticket-Themen oder eine Kombination davon einfügen]

## Persona-Anforderungen
Benötigte Anzahl Personas: [2-4 — empfohlener Bereich; weniger ist besser]
Primärer Verwendungszweck: [Produktdesign-Entscheidungen / Roadmap-Priorisierung / Engineering-Scoping / Stakeholder-Kommunikation]

## Für jede Persona erstellen:

---

### Persona [N]: [Archetyp-Name]
[Der Name sollte ein Rollenbeschreiber sein, kein fiktiver Vorname — z. B. „Der überforderte Ops-Manager", „Der Power-User-Automatisierungs-Builder", „Der vorsichtige Beschaffungs-Leiter"]

**Tagline:** [Ein Satz, der die definierende Frustration oder das Ziel einfängt — das ist das Erste, was Leser sehen, und sollte einprägsam sein]

---

#### Rolle und Kontext
- **Jobtitel / Funktion:** [realistische Titelspanne — nicht nur ein Titel]
- **Branche / Unternehmenstyp:** [wo sie arbeiten]
- **Unternehmensgröße:** [KMU / Mid-Market / Enterprise — und warum das für das Produkt wichtig ist]
- **Technische Kompetenz:** [1-5-Skala mit klartextlicher Beschreibung]
- **Wie sie das Produkt verwenden:** [tägliches Arbeitsmittel / gelegentlich / teamintern vorgeschrieben / Workaround für etwas anderes]
- **Wen sie beeinflussen oder mit wem sie arbeiten:** [ihre Stakeholder — relevant für B2B-Produkte]

#### Ziele (wie Erfolg für sie aussieht)
- **Primäres Ziel:** [die Aufgabe, die sie erledigen wollen — wo möglich Jobs-to-be-Done-Framing verwenden]
- **Sekundäres Ziel:** [ein unterstützendes Ziel, das oft mit dem Primären konkurriert]
- **Erfolgsmetrik, die ihnen wichtig ist:** [die Zahl oder das Ergebnis, woran sie gemessen werden — das treibt ihr Verhalten]

#### Frustrationen (mit aktuellen Lösungen — evidenzbasiert)
Für jede Frustration den Beweis angeben (Zitat oder Datenpunkt aus der Forschung):

1. **[Frustrations-Titel]:** [Spezifische Beschreibung des Schmerzes]
   Beweis: „[Wörtliches oder nahezu wörtliches Zitat aus der Forschung]" — [Quelle, z. B. Interview P3, oder 34% der Umfrageteilnehmer]

2. **[Frustrations-Titel]:** [...]
   Beweis: [...]

3. **[Frustrations-Titel]:** [...]
   Beweis: [...]

#### Verhaltensmuster
- **Wie sie Tools entdecken:** [Mundpropaganda / Manager-Vorgabe / Test / Recherche / Peer-Empfehlung]
- **Bewertungsprozess:** [wie sie entscheiden, ob sie adopten — Test, Demo, Peer-Review, Beschaffung usw.]
- **Nutzungsmuster:** [wie sie das Produkt tatsächlich täglich verwenden]
- **Workarounds, die sie heute nutzen:** [was sie tun, wenn das Produkt das Problem nicht löst — entscheidend für das Design]
- **Kommunikationsstil:** [Slack / E-Mail / asynchron / synchron — relevant für In-App-Messaging]

#### Das Zitat, das diese Persona definiert
„[Ein einziges wörtliches oder nahezu wörtliches Zitat aus der Forschung, das die Weltanschauung dieser Persona einfängt. Das sollte das Zitat sein, das man auf ein Poster drucken würde.]"

#### Was sie vom Produkt brauchen (entscheidungstreibende Bedürfnisse)
- [Bedürfnis 1 — spezifisch genug, um eine Design-Entscheidung zu treffen]
- [Bedürfnis 2]
- [Bedürfnis 3]

#### Was sie zum Abwandern bringt (Abwanderungstreiber)
- [Risiko 1 — die Bedingung, unter der diese Persona das Produkt aufgibt]
- [Risiko 2]

#### Design-Implikationen (direkte Übersetzung in Produktentscheidungen)
- [Implikation 1 — „Weil diese Persona X tut, sollte das Produkt Y"]
- [Implikation 2]
- [Implikation 3]

---

### Persona-Vergleichstabelle (nach allen Personas)

| Dimension | Persona 1 | Persona 2 | Persona 3 |
|---|---|---|---|
| Technische Kompetenz | Niedrig | Hoch | Mittel |
| Entscheidungsmacht | Keine | Beeinflusser | Käufer |
| Hauptschmerz | [Schmerz] | [Schmerz] | [Schmerz] |
| Resonierendes Wertversprechen | [Prop] | [Prop] | [Prop] |
| Feature-Priorität | [Features] | [Features] | [Features] |
| Abwanderungsrisiko | Hoch | Niedrig | Mittel |

### Persona-Priorisierung
Für welche Persona zuerst entwerfen — und warum:
[Explizite Empfehlung basierend auf Geschäftsauswirkung und strategischer Passung — nicht nur „häufigster Nutzer"]
```

### Schnellskizze einer Persona (aus minimalen Daten)

```
Eine schnelle Persona-Skizze aus begrenzten Daten erstellen.

Ich habe: [welche Daten verfügbar sind — z. B. „5 Support-Tickets und unsere NPS-Umfrage-Verbatims"]
Produkt: [Name]
Nutzertyp, den ich verstehen möchte: [z. B. „die Nutzer, die in den ersten 30 Tagen abwandern"]

Eine arbeitende Hypothesen-Persona erstellen — klar als HYPOTHESE markieren, nicht als validiert.

Format:
- Archetyp-Name und Tagline
- 3 definierende Eigenschaften
- Primäre Frustration (mit verfügbarem Beweis)
- 2 Design-Implikationen
- Die 3 Fragen, die diese Persona aufwirft und die echte Forschung zur Validierung benötigen

Jede Annahme klar kennzeichnen. Eine Hypothesen-Persona ist ein Ausgangspunkt für Forschung, kein Ersatz dafür.
```

### Persona-Validierungs-Checkliste

```
Diese bestehende Persona gegen neue Daten validieren.

Bestehende Persona: [Persona einfügen]
Neue Daten: [neue Interview-Notizen, Umfrageergebnisse oder Analytics einfügen]

Prüfen:
1. Bestätigen oder widersprechen die neuen Daten dem Primärziel? [Bestätigt / Widerlegt / Teilweise unterstützt]
2. Sind die genannten Frustrationen noch vorhanden? [Auflisten, welche in neuen Daten erscheinen]
3. Gibt es neue Frustrationen, die nicht in der aktuellen Persona sind? [Auflisten]
4. Hat sich das Verhaltensmuster verändert? [Was ist anders?]
5. Ist das repräsentative Zitat noch repräsentativ, oder gibt es ein besseres aus neuen Daten?

Ausgabe: Aktualisierte Persona mit [NEU]-Markierungen bei geänderten Feldern und Änderungszusammenfassung.
```

### Anti-Pattern-Erkennung

```
Diese Persona überprüfen und häufige Persona-Anti-Patterns kennzeichnen.

[Bestehende Persona einfügen]

Auf diese Fehlermuster prüfen:
1. DEMOGRAFISCHER FÜLLSTOFF — Gibt es irrelevante demografische Details (Alter, Geschlecht, Ort, Hobbys), die keine Produktentscheidungen treiben? Kennzeichnen und Entfernung empfehlen.
2. ANNAHME OHNE BEWEIS — Werden Behauptungen ohne Zitation von Forschungsdaten gemacht? Jede einzelne kennzeichnen.
3. EINZELNER NUTZER-ARCHETYP — Repräsentiert diese Persona mehrere verschiedene Nutzertypen, die separate Personas benötigen? Falls ja, kennzeichnen.
4. ASPIRATIVER BIAS — Beschreibt die Persona, wer das Team sich als Nutzer wünscht, statt wer die Nutzer tatsächlich sind? Nach Sprache suchen, die zu positiv ist oder gängigen Support-Mustern widerspricht.
5. VERWECHSLUNG MIT MARKETING-PERSONA — Beschreibt diese Persona Kaufverhalten statt Produktnutzungsverhalten? Sie dienen unterschiedlichen Zwecken.
6. VERMISCHTE ROLLEN — Bei B2B-Produkten: ist diese Persona eine Mischung aus dem Champion (täglicher Nutzer) und dem Economic Buyer? Sie müssen getrennt sein.

Für jedes gefundene Anti-Pattern: erklären, warum es ein Problem ist, und eine spezifische Behebung empfehlen.
```

## Beispiel

**Nutzer:** Wir haben 8 Nutzer unseres Projektmanagement-Tools interviewt. Hier sind die Themen: Die meisten sind Teamleiter in Unternehmen mit 50-200 Mitarbeitern. Sie schätzen Transparenz über Projekte, ohne ihr Team um Updates bitten zu müssen. Sie sind frustriert, dass unser aktuelles Reporting zu manuell ist — sie müssen ihre eigenen Dashboards erstellen. Drei von ihnen sagten, sie machen Screenshots unseres Tools und fügen sie in Folien für ihr Montag-Exec-Standup ein. Zwei sagten, sie haben unser Reporting-Feature ausprobiert und nach 15 Minuten aufgegeben.

**Ausgabe:**

```markdown
### Persona 1: Der sichtbarkeitsgehungerte Teamleiter

**Tagline:** „Ich verbringe die halbe Woche damit, das Folien-Deck zu erstellen, das sich selbst erstellen sollte."

---

#### Rolle und Kontext
- **Jobtitel / Funktion:** Teamleiter, Engineering Manager, Ops Manager oder ähnliche personalleitende Rolle
- **Unternehmensgröße:** 50-200 Mitarbeiter (Mid-Market; zu groß, um alles aus dem Gedächtnis zu verfolgen, zu klein für ein dediziertes PMO)
- **Technische Kompetenz:** 3/5 — vertraut mit Tools, aber keine Zeit für Konfiguration
- **Wie sie das Produkt verwenden:** Tägliche Check-ins zu eigenen Aufgaben, aber ihr eigentlicher Bedarf ist eine teamübergreifende Statusansicht, die sie nach oben teilen können
- **Wen sie beeinflussen:** Ihr direktes Team (5-15 Personen) und ihr eigener Manager (der Exec, dem sie wöchentlich berichten)

#### Ziele
- **Primäres Ziel:** Den Status aller aktiven Projekte kennen, ohne das Team unterbrechen zu müssen
- **Sekundäres Ziel:** Eine Montag-Standup-Folie in unter 10 Minuten erstellen
- **Erfolgsmetrik, die ihnen wichtig ist:** Ihr Manager sagt „tolles Update" ohne Nachfragen

#### Frustrationen
1. **Reporting ist manuell und verlustbehaftet:** Sie müssen benutzerdefinierte Dashboards oder Exporte erstellen, und bis sie fertig sind, sind sie bereits veraltet.
   Beweis: „Ich mache einen Screenshot des Boards und füge ihn jede Woche in Folien ein. Es fühlt sich lächerlich an." — Interview P3

2. **Reporting-Feature ist zu komplex einzurichten:** Das Tool hat Reporting-Funktionen, aber sie erfordern zu viel Konfiguration für jemanden, der nur eine wöchentliche Statusansicht braucht.
   Beweis: 2/8 Teilnehmer haben das Reporting-Feature ausprobiert; beide haben es innerhalb von 15 Minuten aufgegeben. Kein Teilnehmer hatte zum Zeitpunkt des Interviews einen funktionierenden Bericht.

3. **Kein executive-freundlicher Export:** Ausgaben sind für Projektmitarbeiter formatiert, nicht für Führungskräfte, die eine 3-Folien-Zusammenfassung benötigen.
   Beweis: 3/8 Teilnehmer erwähnten explizit Screenshots für Exec-Standups.

#### Das Zitat, das diese Persona definiert
„Ich verbringe die halbe Woche damit, das Folien-Deck zu erstellen, das sich selbst erstellen sollte."

#### Was sie vom Produkt brauchen
- Eine automatisch generierte wöchentliche Statuszusammenfassung, die sie ohne Änderungen mit ihrem Manager teilen können
- Teamübergreifende Transparenz aus einer einzigen Ansicht — kein Pro-Projekt-Board
- Ein Exportformat, das in Google Slides oder PowerPoint funktioniert

#### Design-Implikationen
- Weil der primäre Workflow dieser Persona Upward-Reporting ist, braucht das Produkt eine „Manager-Ansicht", die sich von der Aufgaben-Worker-Ansicht unterscheidet
- Weil sie heute Screenshots machen, ist der Weg des geringsten Widerstands für die Adoption, diesen Screenshot durch einen Ein-Klick-Export zu ersetzen
- Weil sie das Reporting-Setup aufgegeben haben, muss jede Reporting-Lösung ohne Konfiguration für den üblichen Fall (wöchentlicher Projektstatus) funktionieren
```

---

> **Mit uns arbeiten:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
