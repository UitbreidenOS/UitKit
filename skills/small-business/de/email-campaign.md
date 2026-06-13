---
name: email-campaign
description: "E-Mail-Marketing für kleine Unternehmen: Kampagnenstruktur, Betreffzeilen, Kopievarianten nach Segment, A/B-Test-Setup, Wiederbestätigungssequenzen und Leistungsanalyse"
---

# Email Campaign

## When to activate
- Planung einer Werbekampagne und Bedarf, verschiedene Kundensegmente mit unterschiedlichen Botschaften zu erreichen
- Ihre E-Mail-Öffnungsquoten liegen unter 20% und Sie möchten verstehen, warum und reparieren
- Sie haben eine Liste inaktiver Abonnenten und benötigen eine Wiederbestätigungssequenz vor Ihrer nächsten Kampagne
- Sie möchten einen A/B-Test einrichten, sind aber unsicher, was getestet werden soll oder wie Ergebnisse gelesen werden

## When NOT to use
- E-Mail-Plattformkonfiguration, Automatisierungssetup oder Vorlage Design — verwenden Sie Ihre ESP-Dokumentation (Klaviyo, Mailchimp, ActiveCampaign) dafür
- Listenwachstumsstrategie — diese Kompetenz verwaltet, was zu senden ist, nicht wie die Liste wächst
- Transaktions-E-Mails (Bestellbestätigungen, Passwortzurückstellungen) — diese haben andere Compliance-Anforderungen und gehören in den Flow Builder Ihrer Plattform

## Instructions

### Campaign planning

Bevor Sie ein Wort schreiben, definieren Sie die Kampagnenstruktur. Sagen Sie Claude:
- Das Angebot oder die Nachricht, die Sie kommunizieren möchten (seien Sie spezifisch — « 20% Rabatt auf alle Schuhe dieses Wochenende » ist nutzbar; « wir haben eine Ausverkauf » nicht)
- Ihre Listensegmente (neue Abonnenten, kürzliche Käufer, schlafende Kunden, VIPs, etc.)
- Das Kampagnenziel — ein Ziel, nicht drei (Käufe treiben, Termine buchen, RSVPs abrufen, Nachrichten ankündigen)
- Ihre Zeitachse (Startdatum, Enddatum, falls es ein Ausverkauf ist)
- Wie viele E-Mails Sie bereit sind, für diese Kampagne zu senden (die meisten Small-Business-Kampagnen sind 2-3 E-Mails)

Claude erstellt die Kampagnenkarte: welche E-Mails zu welchen Segmenten gehen, was ist die Aufgabe jeder E-Mail, vorgeschlagene Sendezeitpunkte basierend auf Zielgruppentyp, und die Sequenzlogik (z.B. « E-Mail 2 geht nur an Öffner von E-Mail 1, oder an jeden? »).

---

### Subject lines

Betreffzeilen bestimmen die Öffnungsrate mehr als jeder andere Faktor. Sagen Sie Claude:
- Der Inhalt der E-Mail
- Das Zielgruppensegment
- Das Kampagnenziel
- Ihre Markenstimme (verspiell, direkt, warm, professionell)

Claude generiert 8 Betreffzeilenoptionen über vier Stile:
- 2 direkt: einfache Aussage des Angebots oder der Nachricht
- 2 neugiergetrieben: öffne eine Schleife, die die E-Mail schließt
- 2 Dringlichkeitsbasiert: Frist- oder Knappheitsrahmen (verwenden Sie diese nur, wenn die Dringlichkeit real ist)
- 2 Vorteilsfokussiert: mit dem gewinnen, was der Leser gewinnt

Claude kennzeichnet, welche zwei zu A/B testen sind. Normalerweise die direkteste Option versus die stärkste Neugier- oder Vorteilsoption. Testen Sie nicht zwei ähnliche Stile — testen Sie wirklich unterschiedliche Ansätze, um etwas Nützliches zu lernen.

Benchmarks: Öffnungsquoten über 20% sind gesund für die meisten kleinen Unternehmen. Über 28% ist stark. Unter 15% bedeutet, dass Ihre Betreffzeilen oder Absenderruf Arbeit braucht. Falls Ihre Liste nicht länger als 12 Monate gereinigt wurde, könnten niedrige Öffnungsquoten ein Zustellbarkeitsproblem, nicht ein Kopieproblem sein.

---

### Email copy

Eine E-Mail, eine Aufgabe. Sagen Sie Claude:
- Die Betreffzeile, die Sie gewählt haben
- Das Zielgruppensegment und was sie über Sie wissen
- Das Angebot oder die Nachricht
- Der einzelne Call to Action (ein Link oder Button, nicht drei)

Claude schreibt drei Abschnitte:

**Haken** — die ersten 1-2 Sätze des E-Mail-Textes. Dies ist das, was im Vorschaubereich neben der Betreffzeile erscheint. Es muss den Klick verdienen. Claude schreibt es, um den Schwung der Betreffzeile fortzusetzen, nicht zu wiederholen.

**Körper** — 3-4 kurze Absätze. Die meisten Small-Business-E-Mails werden in unter 30 Sekunden gelesen. Claude schreibt für Scanner: kurze Absätze, konkrete Sprache, kein Filler.

**CTA** — eine klare Aktion mit spezifischem Button- oder Linktext. « Kaufen Sie den Ausverkauf » ist besser als « Klick hier. » « Buchen Sie Ihren kostenlosen Anruf » ist besser als « Mehr erfahren. »

Segmentvarianten: treue Kunden erhalten Wertschätzungsrahmen (« Sie sind seit Anfang bei uns, also erhalten Sie frühen Zugriff... »). Neue Abonnenten erhalten Vorteilsrahmen (« Hier ist, was wir versprochen haben, als Sie sich anmeldeten... »). Schlafende Kunden erhalten ehrlichen Wiederbestätigungsrahmen (« Es ist schon eine Weile. Hier ist, was sich geändert hat. »).

---

### A/B test setup

Sagen Sie Claude, was Sie testen möchten. Eine Variable pro Test — Betreffzeile versus CTA im selben Test zu testen sagt Ihnen nichts.

Gute Dinge für kleine Business E-Mail-Listen zu testen:
- Betreffzeile (am wirkungsvollsten, beeinflusst Öffnungsrate)
- CTA-Text (beeinflusst Klickrate)
- E-Mail-Länge — kurz (150 Wörter) versus mittel (350 Wörter)
- Sendezeitpunkt — Dienstag Morgen versus Donnerstag Nachmittag

Claude schreibt beide Varianten und sagt Ihnen: was ist der Unterschied zwischen ihnen, welche Metrik zu beobachten, welche Stichprobengröße Sie benötigen um ein bedeutungsvolles Ergebnis zu sehen, und wie lange, um den Test auszuführen bevor Sie ihn lesen.

Nach dem Test: Fügen Sie Ihre Ergebnisse ein (Variante A Öffnungsrate X%, Variante B Öffnungsrate Y%, Sendegröße Z). Claude sagt Ihnen, was die Ergebnisse bedeuten, ob der Unterschied bedeutsam oder Rauschen ist, und was als nächstes zu tun ist.

---

### Re-engagement sequences

Für Abonnenten, die 90 oder mehr Tage nicht geöffnet haben.

Sagen Sie Claude: Ihre Listengröße, wie viele inaktiv sind (90+ Tage kein Öffnen), was Sie zuletzt an sie gesendet haben, und was Ihr Unternehmen jetzt anbietet, das die Wiederbestätigung wert ist.

Claude schreibt eine 3-E-Mail-Sequenz:

**E-Mail 1 — « Noch da? »** Erkenne das Schweigen an, biete etwas wirklich Nützliches an (eine kostenlose Ressource, frühen Zugriff, ein relevantes Update). Keine Schuld, keine Manipulation.

**E-Mail 2 — Werterinnerung.** Wofür sie sich anmeldeten und warum es immer noch wert ist, auf Ihrer Liste zu sein. Ein konkreter Nachweis: ein kürzliches Kundenergebnis, ein beliebtes Stück Inhalts, ein Produkt, das sie möglicherweise verpasst haben.

**E-Mail 3 — Finales Abmeldeangebot.** Ehrlicher Rahmen: « Wenn dies nicht mehr relevant ist, ist kein Problem — melden Sie sich unten ab. Wenn Sie bleiben möchten, müssen Sie nichts tun. » Dies ist der Sunset-Schritt.

Nach der Sequenz: Sagen Sie Claude, wie viele sich wiederbestätigt haben (haben eine der 3 E-Mails geöffnet oder angeklickt). Claude verfasst die abschließende Nachricht für alle, die nicht — eine saubere Abmeldebestätigung. Die Entfernung inaktiver Abonnenten verbessert die Zustellbarkeit für alle anderen.

---

### Performance analysis

Nach einer Kampagne fügen Sie Ihre Statistiken ein: Sendegröße, Öffnungsrate, Klickrate, Abmelderate, generierte Einnahmen (falls nachverfolgbar). Sagen Sie Claude, was Sie erwartet haben.

Claude sagt Ihnen:
- Ob jede Metrik über oder unter dem Benchmark für Ihre Industrie und Listengröße liegt
- Was das Muster bedeutet (hohe Öffnung, niedriger Klick = Betreffzeile funktioniert aber E-Mail nicht liefernd; niedrige Öffnung, hoher Klick unter Öffnern = Betreffzeilenproblem, kein Kopieproblem)
- Eine spezifische Sache, die Sie in Ihrer nächsten Kampagne basierend auf den Daten ändern können

---

### Prompt template — campaign

```
Bitte planen Sie eine [X]-E-Mail-Kampagne.

Angebot: [spezifisches Angebot, mit Daten falls zutreffend]
Ziel: [ein Ziel]
Segmente:
- [Segment 1]: [Größe, Beziehung zu Ihrem Geschäft]
- [Segment 2]: [Größe]

Zeitachse: [Startdatum] zu [Enddatum]
Markenstimme: [verspiell/direkt/warm/professionell]

Bitte geben Sie mir:
1. Kampagnenkarte (welche E-Mail zu welchem Segment, in welcher Reihenfolge)
2. 8 Betreffzeilenoptionen für die erste E-Mail (2 direkt, 2 Neugier, 2 Dringlichkeit, 2 Vorteil)
3. Markieren Sie, welche 2 zu A/B testen sind
4. Entsenden Sie die erste E-Mail für [Hauptsegment]
```

## Example

Ein Frauenboutique führt einen 3-tägigen Sommerschlussverkauf durch. Der Inhaber sagt Claude das Angebot (25% Rabatt auf alle Sommerkleider), die Liste (2.400 insgesamt: 800 gekauft in den letzten 60 Tagen, 1.100 gekauft 61-180 Tage, 500 inaktiv 180+ Tage) und das Ziel (Käufe vor dem Schlussverkauf am Sonntag treiben).

Claude erstellt:

Kampagnenkarte: E-Mail 1 (Donnerstag, Gesamtliste) — Schlussverkaufsankündigung, alle Segmente. E-Mail 2 (Freitag, Öffner von E-Mail 1 nur) — Best-Seller mit sozialen Nachweis hervorgehoben. E-Mail 3 (Sonntagmorgen, Nichtpurchaser, die eine beliebige E-Mail geöffnet haben) — letzte Chance, Tagesendurgenz.

Betreffzeilen für E-Mail 1 (direkt): « 25% Rabatt auf Sommerkleider — dieses Wochenende nur. » (Neugier): « Ihre Garderobe fehlt etwas. » (Dringlichkeit): « 3 Tage. 25% Rabatt. Kein Code erforderlich. » (Vorteil): « Das Kleid, auf das Sie gehofft haben, ist gerade billiger geworden. »

A/B-Test-Empfehlung: « 25% Rabatt auf Sommerkleider — dieses Wochenende nur » versus « Das Kleid, auf das Sie gehofft haben, ist gerade billiger geworden » — direkter Rahmen versus Vorteilsrahmen.

Ergebnisse nach Ausführung der Kampagne: 31% Öffnungsrate auf E-Mail 1, 8,2% Klickrate, $4.100 in verfolgten Einnahmen zur Kampagne. Frühere Kampagnen zeigten durchschnittlich 19% Öffnung und 4,1% Klick. Claude-Analyse: die Betreffzeile mit Vorteilsrahmen übertraf die direkte Version um 4 Prozentpunkte in der Öffnungsrate — verwenden Sie Vorteilsrahmen als Standard für Werbekampagnen künftig.

---
