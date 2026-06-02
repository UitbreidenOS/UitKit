---
name: qbr-builder
description: "Quarterly Business Review Builder: Zusammenfassung der Kundenzustandheit, erbrachter ROI, Ziele fur das nachste Quartal, Rahmen fur Verlangerungs- und Expansionsdiskussionen"
---

# QBR Builder Skill

## Wann aktivieren
- Sie haben ein QBR in den nachsten 2 Wochen geplant und mussen die Prasentation und Gesprachspunkte aufbauen
- Sie mussen den erbrachten ROI fur einen Kunden vor einem Verlangerungsgesprach quantifizieren
- Vorbereitung auf ein Review auf Executive-Ebene mit dem C-Suite eines Kunden
- Aufbau einer QBR-Vorlage, die Ihr gesamtes CS-Team konsistent verwenden kann
- Eine Beziehung vor einem QBR wiederherstellen — Sie wissen, dass der Kunde unzufrieden ist, und benotigen eine Strategie

## Wann NICHT verwenden
- Onboarding-Calls oder monatliche Check-ins — diese haben unterschiedliche Strukturen, verwenden Sie `/customer-success`
- Verkaufsprasentationen fur Interessenten — anderes Werkzeug, anderes Ziel
- Interne Geschaftspruifungen (nicht kundenseitig) — anderen Workflow verwenden
- QBRs, bei denen Sie keine Nutzungsdaten oder Ergebnisse prasentieren konnen — zuerst Daten sammeln

## Anweisungen

### Vollstandiger QBR-Builder-Prompt

```
Erstelle ein vollstandiges QBR fur meinen Kunden.

Kunde: [Unternehmensname]
Tier: [Strategisch / Enterprise / Wachstum / Standard]
ARR: $[X]
Verlangerungsdatum: [Datum — wie viele Monate entfernt?]
CSM: [Name]
Teilnehmende Kundenkontakte: [Titel des Executive Sponsors, Champion-Titel, weitere]
Meine teilnehmenden Kontakte: [CSM, AE, VP CS bei strategischen]
Dauer: [30 / 45 / 60 / 90 Minuten]
Primares Ziel fur dieses QBR: [binden / erweitern / Case Study / Beziehungswiederherstellung]

Ihr Geschaftskontext:
- In welcher Branche sind sie? [X]
- Was waren ihre genannten Erfolgskriterien bei Vertragsbeginn? [X, Y, Z]
- Gab es Veranderungen in ihrem Unternehmen? [Fuhrungswechsel / Fusion / Headcount / Budget]
- Was ist ihr primarer Anwendungsfall fur unser Produkt? [X]

Unser Produktkontext:
- Nutzungsdaten: [Logins, aktive Nutzer, Kernfunktionsnutzung — beschreiben, was Sie haben]
- Fur sie relevante Produktanderungen in diesem Quartal: [ausgelieferte Funktionen, behobene Fehler]
- Offene Support-Tickets oder ungeloste Probleme: [beschreiben]
- Haben sie an Beta-Funktionen oder -Anfragen teilgenommen? [ja/nein]

Kommerzieller Kontext:
- Aktueller MRR/ARR: $[X]
- Expansionsmoglichkeit: [zusatzliche Sitze / Add-ons / hoherer Tier] — $[X] Potenzial
- Wettbewerbsbedrohung: [sind Sie sich einer Wettbewerbsevaluierung bewusst?]
- Verlangerungsgesundheit: [grun / gelb / rot — und warum]

Erstellen:

## QBR-AGENDA (fur 60-minutige Session)

[5 Min] Eroffnung und Beziehungs-Check
[15 Min] Ihr Geschaft — was sich seit letztem Quartal geandert hat
[20 Min] Erbrachter Wert — was sie mit unserem Produkt erreicht haben
[10 Min] Roadmap — was kommt, das fur sie wichtig ist
[10 Min] Ziele des nachsten Quartals und Erfolgskriterien

## GESPRACHSPUNKTE FUR JEDEN ABSCHNITT

Fur jeden Agenda-Abschnitt:
- 2-3 Fragen zum Stellen (zuhoren, bevor Sie sprechen)
- Wesentliche Datenpunkte zum Teilen
- Worauf zu achten ist (Signale: positiv = Expansion; negativ = Abwanderungsrisiko)
- Wie zu reagieren, wenn sie unzufrieden sind

## ROI-FOLIE (die wichtigste Folie in jedem QBR)
- Ergebnis 1: [spezifisches Ergebnis gebunden an ihre genannten Erfolgskriterien]
- Ergebnis 2: [spezifisches Ergebnis]
- Ergebnis 3: [spezifisches Ergebnis]
- Wenn harter ROI nicht verfugbar: fuhrende Indikatoren verwenden (gesparte Zeit, reduzierte Fehler, Akzeptanzrate)
- Nie sagen "wir haben Ihnen geholfen" — sagen "Sie haben X erreicht, und hier ist, wie unser Produkt das ermoglicht hat"

## VERLANGERUNGS- UND EXPANSIONSDISKUSSION
- Wann anzusprechen: nicht bevor Sie den Wertabschnitt geliefert haben
- Wie zu rahmen: "Basierend auf dem, was Sie erreicht haben, wurde ich folgendes fur das nachste Quartal empfehlen..."
- Expansionsnarrativ: [spezifisch fur ihre Situation und Nutzungssignale]
- Einwandbehandlung: [wahrscheinliche Einwande gegeben ihrem aktuellen Gesundheitszustand]

## PRE-QBR-CHECKLISTE
□ Agenda 5 Tage im Voraus gesendet
□ Teilnahme des Executive Sponsors bestatigt
□ Alle Nutzungsdaten aus der Produktanalytik gezogen
□ Alle Support-Tickets der letzten 90 Tage gepruift
□ ROI-Quantifizierung vorbereitet
□ AE oder VP uber kommerzielle Situation informiert
□ Das eine Ding kennen, das schiefgehen konnte, und einen Plan haben
```

### ROI-Quantifizierungsrahmen

```
Quantifiziere den ROI, den dieser Kunde in diesem Quartal von unserem Produkt erhalten hat.

Kunde: [Unternehmen]
Produkt: [beschreiben, was es macht]
Ihr Anwendungsfall: [spezifischer Workflow, fur den sie es nutzen]
Vertragswert: $[X] ARR

ROI-Rahmen — verwenden Sie die zutreffenden Dimensionen:

ZEITEINSPARUNGEN
- Prozess vor unserem Produkt: [manuelle Schritte beschreiben]
- Gesparte Zeit pro Aufgabe: [X Stunden]
- Haufigkeit: [X Mal pro Woche/Monat]
- Teamgrosse fur diese Aufgabe: [N Personen]
- Jahrlich gesparte Stunden: [X Stunden/Woche × N Personen × 52 Wochen]
- Wert bei $[X]/Stunde Vollkostenansatz: $[X] jahrlicher Wert
- ROI-Mehrfacher: $[X Wert] / $[X ARR] = [X:1] ROI

FEHLERREDUKTION / QUALITAT
- Fehlerrate vorher: [X%] Fehler pro [Aufgabe]
- Fehlerrate jetzt: [X%]
- Kosten pro Fehler (Nacharbeit, Kundenauswirkung, Reputation): $[X]
- Jahrliche Einsparungen durch Fehlerreduktion: $[X]

UMSATZAUSWIRKUNG
- Hat unser Produkt ihnen geholfen, mehr Deals abzuschliessen, Kunden zu binden oder Umsatz zu steigern?
- Beeinflusster oder gesicherter Umsatz: $[X]
- Zurechnung: [wie wissen Sie, dass unser Produkt das angetrieben hat?]

VERMIEDENER PERSONALAUFWAND
- Hatten sie [N] zusatzliche Mitarbeiter ohne unser Produkt einstellen mussen?
- Gehalt + Sozialleistungen pro Einstellung: $[X]
- Vermiedene Personalkosten: $[X]

MARKTGESCHWINDIGKEIT
- Wie viel schneller liefern / schliessen sie Arbeit ab?
- Vorher: [X Tage] → Nachher: [X Tage]
- Wettbewerblicher Wert der Geschwindigkeit: [qualitativ oder quantitativ]

GESAMT ERBRACHTER WERT DIESES QUARTALS: $[X]
VERTRAGSKOSTEN DIESES QUARTALS: $[X ARR / 4] = $[X]
ROI-MEHRFACHER: [X:1]

Wenn Sie keine harten Daten haben: verwenden Sie die eigenen Worte des Kunden aus Support-Tickets, NPS-Umfragen oder fruheren Gesprachen. "Sie haben uns beim letzten Check-in erfahlt, dass [X]" ist besser als kein Beleg.

Das als IHRE Leistung prasentieren, nicht als unsere.
```

### Executive-Abstimmungsgesprach

```
Bereite mich auf den Executive-Teil eines QBR vor.

Kunden-Exec: [Titel, was Sie uber ihre Prioritaten wissen]
Risikostufe: [strategischer Account gefahrdet / gesund und expandierend / unbekannt]
Meine Bitte aus diesem Gesprach: [Verlangerungsunterschrift / Expansionsdiskussion / Case Study / Referenz]

Executive-Gesprachsrahmen:

BEGINNEN SIE NICHT MIT DEM PRODUKT. Beginnen Sie mit ihrem Geschaft.

Eroffnungsfragen (2 wahlen):
- "Was sind Ihre Top-3-Prioritaten fur [Unternehmen] in den nachsten 12 Monaten?"
- "Wie sieht Erfolg fur Ihr Team bis Ende des Jahres aus?"
- "Was ist das grosste Hindernis zwischen dem, wo Sie jetzt sind, und dem, wo Sie sein mochten?"
- "Was wurde Sie sicher machen, dass Sie in die richtigen Werkzeuge fur das nachste Jahr investieren?"

Brucke von ihren Prioritaten zu Ihrem Produkt:
"Basierend auf dem, was Sie beschrieben haben — [ihre Prioritat] — hier ist, wie [Ihr Produkt] das direkt unterstutzt..."
Dann Ihre ROI-Aussage in einem Satz liefern.

Umgang mit Executive-Desinteresse:
- Wenn sie auf ihr Telefon schauen: sofort eine direkte Frage stellen — "Gibt es etwas Spezifisches, das Sie in der heutigen Session besprochen haben mochten?"
- Wenn sie nicht der echte Entscheider sind: "Wer sonst sollte an diesem Gesprach fur die Planung des nachsten Quartals beteiligt sein?"

Umgang mit Executive-Unzufriedenheit:
- Nicht defensiv werden. Anerkennen und fragen.
- "Danke fur Ihre Offenheit — das ist, was ich horen muss. Konnen Sie mir helfen zu verstehen, was das Wichtigste ist, das wir beheben mussen?"
- Dann vollstandig zuhoren, bevor Sie antworten.
- Am selben Tag schriftliche Zusammenfassung dessen folgen lassen, was Sie gehort haben, und einen konkreten Aktionsplan.

Expansionsbrucke (nur verwenden, wenn die Beziehung stark und der Wert etabliert ist):
"Angesichts dessen, was Sie in diesem Quartal erreicht haben, und was Sie mir uber [ihre Prioritat] erfahlt haben, mochte ich Ihnen zeigen, was moglich ist, wenn wir unsere Zusammenarbeit auf [neuer Anwendungsfall / zusatzliche Sitze / nachster Tier] ausdehnen."

NIE: Expansion pitchen, bevor Sie den Wert etabliert haben. Die Reihenfolge ist wichtig.

Gesprachspunkte auf meinen spezifischen Exec und meine Situation zugeschnitten erstellen.
```

### QBR-Rettungsplan (gefahrdeter Kunde)

```
Mein QBR-Kunde ist unzufrieden. Helfen Sie mir, ein Rettungs-QBR vorzubereiten.

Kunde: [Unternehmen]
Gesundheit: ROT
Hauptbeschwerde: [was sie gesagt oder signalisiert haben]
Grundursache (Ihre Einschatzung): [Produktlucke / Onboarding-Fehler / Support-Fehler / falscher Champion / falsch verkauft]
Verlangerung: [X Monate entfernt]
Ihre Alternative: [Abwanderung / Wechsel zu Wettbewerber / Umfangsreduzierung]

Rettungs-QBR-Rahmen:

VOR DEM CALL
- Warten Sie nicht auf das QBR, um das Problem anzusprechen. Senden Sie 3 Tage vorher eine E-Mail:
  "Ich mochte dieses QBR zum produktivsten Gesprach machen, das wir hatten. Ich weiss, dass [spezifisches Problem] nicht dort war, wo es sein muss, und ich mochte echte Zeit dafur widmen, es direkt anzusprechen."
- Ihren VP of CS oder einen Geschaftsfuhrer mitbringen — signalisiert, dass Sie es ernst nehmen
- Vorab einen schriftlichen Aktionsplan vorbereiten — nicht improvisieren

EROFFNUNG (erste 5 Minuten)
- Nicht mit Ihrer Agenda beginnen. Mit Anerkennung beginnen:
  "Bevor wir die Agenda durchgehen, mochte ich [Problem] direkt ansprechen. Wir haben nicht geliefert, was wir in [Bereich] zugesagt haben, und ich mochte Zeit damit verbringen, wie wir das beheben."
- Pause. Sie antworten lassen. Vollstandig zuhoren.

DAS RETTUNGSANGEBOT
- Was wird sich konkret andern? [3 konkrete Aktionen mit Eigentumern und Daten auflisten]
- Was konnen Sie als Geste anbieten? [dedizierter Support / Produkt-Fix-ETA / Rabatt / Service-Gutschrift]
- Wie sieht Erfolg in 60 Tagen aus? [gemeinsam definieren]
- "Wenn wir diese drei Dinge bis [Datum] liefern, wurden Sie bereit sein, sich zur Verlangerung zu verpflichten?"

WAS NICHT TUN
- Ihr Produktteam, Support-Team oder Kollegen im Call nicht beschuldigen
- Keine Funktionen versprechen, die Sie nicht liefern konnen
- Den Call nicht darauf ausrichten, den Vertrag zu retten — darauf ausrichten, sie erfolgreich zu machen
- Ihre Beschwerde nicht mit Daten, die ihrer Erfahrung widersprechen, kleinreden

NACH DEM CALL INNERHALB VON 24 STUNDEN
- Schriftliche Zusammenfassung der eingegangenen Verpflichtungen
- Genannter Eigentumer fur jede Aktion
- Nachstes Check-in-Datum innerhalb von 2 Wochen (nicht nachstes Quartal)

Den spezifischen Rettungs-QBR-Plan fur meinen Kunden erstellen.
```

## Beispiel

**Benutzer:** Ich habe nachsten Dienstag ein QBR mit Acme Corp. Sie sind $180K ARR, verlangern in 3 Monaten. Ihr CFO und Head of Ops werden dabei sein. Sie hatten einige Beschwerden uber langsame Support-Reaktionszeiten in Q2, aber die Nutzung ist um 40% JuJ gestiegen. Wie strukturiere ich das?

**QBR-Plan von Claude:**

**Strategische Prioritat: $180K-Verlangerung schutzen, Expansionsgesprach aufbauen.**

**Agenda fur Acme Corp QBR — 60 Minuten:**

- [0:00] Eroffnung: "Bevor wir mit unserer Agenda beginnen — ich mochte direkt nachfragen. Wir hatten in Q2 einige rauere Momente bei den Support-Reaktionszeiten. Ich mochte verstehen, ob das gelost wurde oder ob es noch ein Anliegen ist." [Zuhoren — das bringt das Risiko ans Licht, bevor es Sie uberrascht]

- [0:10] Ihr Geschaft: "Heading into Q4 and renewal planning — what are your top priorities as an operations leader heading into next year?" Dem CFO fragen: "Wo sehen Sie gerade den grossten Druck auf Kosten oder Effizienz?" [Reden lassen. Das enthullt Expansionssignale.]

- [0:20] Erbrachter Wert: "Hier ist, was Ihr Team in diesem Quartal erreicht hat..." Mit 40% Nutzungswachstum als Signal fur Akzeptanzgesundheit beginnen. Das in ROI umwandeln: Bei 40% mehr Nutzung, welche Arbeit erledigen sie jetzt, die sie vorher nicht gemacht haben? In Stunden oder reduzierten Fehlern quantifizieren.

- [0:35] Support-Anerkennung: "Ich mochte offen uber den Support in Q2 sein. Die Reaktionszeiten lagen im Durchschnitt bei 36 Stunden gegenuber unserem 12-Stunden-SLA. Das ist nicht akzeptabel. Hier ist, was wir geandert haben: [spezifische Lösung]. Hier ist unser aktueller Durchschnitt: [aktuelle Daten]. Ich werde Ihnen einen monatlichen SLA-Bericht senden."

- [0:45] Roadmap: 2 Funktionen zeigen, die speziell fur Ops relevant sind — kein Produktdatenladen.

- [0:55] Nachste Schritte: "Basierend auf Ihren Prioritaten fur nachstes Jahr — [was sie sagten] — mochte ich vorschlagen, dass wir [Expansions-Anwendungsfall] als Teil Ihrer Verlangerung besprechen. Konnen wir 30 Minuten mit [Ihrem AE] vor Ende des Monats planen?"

**Hauptrisiko:** Wenn der CFO die Supportqualitat als Verlangerungsbedingung anspricht, halten Sie eine Service-Gutschrift bereit — nicht freiwillig angeboten, aber bereit, wenn sie darauf bestehen.

---

> **Arbeiten Sie mit uns:** Claudient wird unterstuetzt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Losungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
