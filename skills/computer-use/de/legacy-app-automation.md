---
name: legacy-app-automation
description: Automatisieren Sie Desktop- oder Legacy-Apps ohne API über Computer Use — langsame, verifizierte, sichere Interaktion mit Win32, VB6, Mainframe und dickschichtigen Client-Apps.
---

# Automatisierung von Legacy-Anwendungen über Computer Use

## Wann aktivieren

- Die Zielanwendung hat keine API, kein CLI, keine skriptierbare Schnittstelle und kein Web-Frontend
- App ist eine native Desktop-App: Win32, MFC, VB6, Delphi, PowerBuilder, Java Swing, Legacy Electron
- Der Benutzer muss Daten aus einer App extrahieren, die nur auf dem Bildschirm angezeigt werden
- Automatisierung wiederholter Formulareingaben in einer dickschichtigen ERP-, CRM- oder Line-of-Business-App
- Der Benutzer sagt "es gibt keinen anderen Weg, dies zu tun" oder "der Anbieter hat keine API"
- Mainframe-Terminal-Automatisierung (3270/5250), wo kein moderner Connector existiert
- Datenmigration aus einem Legacy-System, das nur über UI-gesteuerte Dialoge exportieren kann

## Wann nicht verwenden

- Die App hat eine API, Datenbankverbindung oder Export-Funktion — nutzen Sie diese stattdessen; Computer Use ist das letzte Mittel
- Die Automatisierung erfordert die Interaktion mit Anmeldungsbildschirmen (Login mit Passwort, MFA-Codes) — stoppen Sie und bitten Sie den Benutzer, sich zunächst manuell zu authentifizieren
- Der Bildschirm enthält Bestätigungsdialoge für Finanztransaktionen (Überweisungen, Zahlungseingaben) — fordern Sie explizite Benutzerbestätigung für jede Aktion
- Die App ist instabil oder bekanntermaßen anfällig für Abstürze — automatisieren Sie keine instabile Software; das Risiko, Daten in einem fehlerhaften Zustand zu hinterlassen, ist zu hoch
- Sie können das Ergebnis jeder Aktion nicht überprüfen (die App gibt kein visuelles Feedback) — blindes Klicken ist nicht akzeptabel
- Die Aufgabe erfordert Geschwindigkeit über Sicherheit — Legacy-App-Automatisierung muss langsam und verifiziert sein; wenn Geschwindigkeit das Ziel ist, finden Sie einen anderen Ansatz

## Anweisungen

### Baseline-Bewertung

Bevor Sie irgendetwas anfassen:

1. Machen Sie einen vollständigen Screenshot der App in ihrem Ausgangszustand.
2. Identifizieren und dokumentieren Sie:
   - App-Name und Version (sichtbar in der Titelleiste oder im Dialogfeld "About")
   - Aktueller Bildschirm/Ansicht
   - Welche Daten oder Aktion ist das Ziel
   - Alle Warnmeldungen oder Bestätigungsaufforderungen, die möglicherweise angezeigt werden
3. Fragen Sie den Benutzer: "Sind Sie bereits angemeldet? Gibt es Bestätigungsaufforderungen, die ich kennen sollte?"
4. Stellen Sie einen Wiederherstellungsplan auf: Was tut der Benutzer, wenn die Automatisierung die App in einen schlechten Zustand versetzt?

### Das Slow-and-Verify-Prinzip

Legacy-Apps sind fragil. Ein Klick auf das falsche Element, ein Tastendruck, der ankommt, während ein Dialog noch geladen wird, oder ein Fokusereignis auf das falsche Feld kann Daten beschädigen oder irreversible Aktionen auslösen.

Jede Aktion folgt dieser Sequenz — ohne Ausnahmen:

```
1. BEOBACHTEN — Screenshot, bestätigen Sie, dass sich die App im erwarteten Zustand befindet
2. LOKALISIEREN — identifizieren Sie das genaue Zielelement (nach Beschriftung, Position, Tab-Reihenfolge)
3. ERKLÄREN — beschreiben Sie, was Sie tun möchten und welches Ergebnis erwartet wird
4. HANDELN — führen Sie die einzelne, minimale Aktion aus
5. WARTEN — machen Sie eine Pause, damit die App reagiert (Legacy-Apps sind oft langsam; warten Sie auf visuelle Veränderung)
6. VERIFIZIEREN — Screenshot, bestätigen Sie, dass das Ergebnis der Erwartung entsprach
7. PROTOKOLLIEREN — notieren Sie das Ergebnis des Schritts, bevor Sie fortfahren
```

Verketten Sie niemals zwei Aktionen, ohne den Verifizierungsschritt für die erste abzuschließen.

### Interaktionsmuster für Legacy-Apps

**Tastatur-zuerst Ansatz**: Viele Legacy-Apps haben unzuverlässige Maus-Click-Ziele. Bevorzugen Sie Tastaturnavigation:
- Tab zum Durchlaufen von Feldern
- Enter zum Bestätigen
- Alt+[unterstrichener Buchstabe] für Menü-Beschleuniger
- Funktionstasten für häufige Aktionen (F3 Suche, F4 Neu, F8 Absenden — variiert je nach App)

**Timing**: Fügen Sie nach folgenden Ereignissen absichtliche Pausen ein:
- Öffnen eines neuen Bildschirms (warten Sie, bis der Bildschirm vollständig gerendert ist)
- Speichern eines Datensatzes (warten Sie auf die Bestätigungsanzeige)
- Ausführen einer Abfrage oder Suche (warten Sie, bis die Ergebnisse geladen werden)
- Jeder Netzwerkaufruf (die Statusleiste zeigt häufig Aktivität)

**Feldeingabe-Disziplin**:
1. Klicken oder tabben Sie zum Feld.
2. Dreifach-Klick zum Auswählen vorhandener Inhalte (nehmen Sie nicht an, dass das Feld leer ist).
3. Geben Sie den neuen Wert ein.
4. Machen Sie einen Screenshot, um zu bestätigen, dass der Wert korrekt eingegeben wurde, bevor Sie fortfahren.

**Bestätigungsdialoge**: Wenn ein Bestätigungsdialog angezeigt wird:
- Screenshot unmittelbar machen.
- Lesen Sie den genauen Text des Dialogs — machen Sie keine Annahmen.
- Wenn der Dialog für eine destruktive oder irreversible Aktion bestimmt ist, stoppen Sie und bitten Sie den Benutzer zu bestätigen, bevor Sie auf OK klicken.

### Sicherheitsregeln — verbindlich

- **Automatisieren Sie niemals Finanztransaktionen** (Zahlungen, Überweisungen, Buchungen, Rechnungen), ohne dass der Benutzer jede Transaktion explizit bestätigt, bevor Sie auf OK/Absenden klicken.
- **Geben Sie niemals Anmeldedaten ein oder interagieren Sie mit Anmeldedatenfeldern** (Passwörter, Tokens, PINs). Bitten Sie den Benutzer, sich manuell anzumelden, bevor Sie beginnen.
- **Interagieren Sie niemals mit Bildschirmen, die Gesundheitsdaten enthalten** (Patientenakten, Laberergebnisse, Rezepte), ohne zu bestätigen, dass der Benutzer die ordnungsgemäße Autorisierung hat und die Umgebung angemessen ist.
- **Stoppen Sie bei unerwarteten Bildschirmen**: Wenn ein Bildschirm angezeigt wird, der nicht Teil des geplanten Ablaufs ist (Fehler, unerwarteter Dialog, falsche Ansicht), stoppen Sie vollständig, machen Sie einen Screenshot und berichten Sie dem Benutzer, bevor Sie etwas anderes tun.
- **Keine Bulk-Irreversibel-Aktionen**: Automatisieren Sie keine Massenlöschungen, Bulk-Updates oder Batch-Einreichungen ohne einen menschlichen Review-Checkpoint nach einem kleinen Pilotbestand.

### Datenextraktionsmuster

Wenn das Ziel darin besteht, Daten aus einer Legacy-App zu lesen/zu exportieren:

1. Navigieren Sie zur Datenansicht.
2. Machen Sie einen Screenshot von jedem Datenbildschirm.
3. Wenn die App eine Druck- oder Exportfunktion hat (auch zu einem Druckerdialog), verwenden Sie sie — ein PDF-Export ist sicherer als manuelle Transkription.
4. Wenn Transkription unvermeidbar ist, transkribieren Sie sichtbare Felder nacheinander, machen Sie einen Screenshot jedes Datensatzes als Nachweis.
5. Validieren Sie nach der Extraktion eine Stichprobe extrahierter Werte gegen die Bildschirmquelle.

### Formulareingabemuster

Wenn das Ziel darin besteht, Daten in die Legacy-App einzugeben:

1. Der Benutzer stellt die Daten in einem strukturierten Format (CSV, Liste, JSON) zur Verfügung, bevor die Automatisierung beginnt.
2. Verarbeiten Sie einen Datensatz nach dem anderen.
3. Nachdem jeder Datensatz gespeichert ist, machen Sie einen Screenshot der Bestätigung und notieren Sie die Datensatz-ID oder Bestätigungsmeldung.
4. Wenn ein Datensatz fehlschlägt, stoppen Sie die Charge, melden Sie den Fehler und warten Sie auf Benutzeranweisungen, bevor Sie fortfahren.

### Wiederherstellung und Fehlerbehandlung

Wenn die App einen unerwarteten Zustand erreicht:

1. Klicken Sie nicht auf etwas. Machen Sie zuerst einen Screenshot.
2. Suchen Sie nach einer Escape-Taste oder Schaltfläche "Abbrechen", um die aktuelle Operation sicher zu beenden.
3. Überprüfen Sie, ob die Operation bereits abgeschlossen wurde (suchen Sie nach einer Erfolgs-/Fehlerstatus-Meldung).
4. Melden Sie den genauen Bildschirmzustand dem Benutzer und fragen Sie nach Anleitung.
5. Versuchen Sie nicht, einen unbekannten Zustand durch Raten zu "beheben" — stoppen Sie und melden Sie.

## Beispiel

**Szenario**: Exportieren Sie 50 Kundendatensätze aus einer Legacy VB6 CRM-App ohne Exportfunktion. Jeder Datensatz muss einzeln geöffnet und wichtige Felder transkribiert werden.

**App**: "CustomerBase 2.4" — VB6-App, Listenansicht zeigt Kundennummern, Doppelklick öffnet Detailbildschirm.

**Ausführung**:

1. Screenshot: Bestätigen Sie, dass die App in der Kundenlisten-Ansicht geöffnet ist. 50 Datensätze sichtbar.
2. Doppelklick auf ersten Datensatz (Kundennummer: 10042). Warten Sie auf Detailbildschirm.
3. Screenshot: Detailbildschirm geladen — Name, Telefon, E-Mail, Kontotyp sichtbar.
4. Transkribieren: `{"id": "10042", "name": "Acme Corp", "phone": "555-0192", "email": "billing@acme.com", "type": "Enterprise"}`.
5. Screenshot: Bestätigen Sie, dass transkribierte Werte mit Bildschirmwerten übereinstimmen.
6. Drücken Sie Escape, um zur Liste zurückzukehren. Screenshot: Listenansicht wiederhergestellt.
7. Wiederholen Sie für Datensatz 10043.

Nach 5 Datensätzen validieren Sie die extrahierten Daten gegen Screenshots — überprüfen Sie auf Transkriptionsfehler, bevor Sie mit der Charge fortfahren.

Nach allen 50 Datensätzen:
- Stellen Sie dem Benutzer die strukturierten Daten zur Verfügung.
- Fügen Sie eine Stichprobe von Screenshots als Genauigkeitsnachweis bei.
- Notieren Sie alle Datensätze, bei denen Daten unklar waren oder Felder leer waren.

**Was würde einen Stopp verursachen**:
- Der Detailbildschirm öffnet sich auf einem Tab "Zahlungsverlauf" mit Rechnungsbeträgen — stoppen, melden, fragen, ob dieser Bildschirm im Umfang liegt.
- Ein Dialog "Datensatz löschen" erscheint unerwartet — stoppen Sie sofort, klicken Sie auf nichts, machen Sie einen Screenshot und melden Sie.
- Die App wird nach dem Öffnen von Datensatz 23 nicht mehr responsiv — stoppen, melden Sie den Zustand, versuchen Sie nicht zu wiederholen, ohne Benutzerbestätigung.
