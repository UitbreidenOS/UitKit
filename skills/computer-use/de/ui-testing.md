---
name: ui-testing
description: Native oder Web-UI steuern, um Benutzerflows end-to-end via Computernutzung zu testen — Screenshot machen, klicken, überprüfen und berichten.
---

# UI-Testen via Computernutzung

## Wann aktivieren

- Der Benutzer möchte einen Benutzerflow in einer laufenden App (Web oder native) ohne vorhandenes Test-Framework testen
- Die App hat keine testbare API-Oberfläche und die UI ist die einzige Schnittstelle
- Ein Playwright- oder Cypress-Suite existiert, aber der Benutzer möchte eine schnelle Plausibilitätsprüfung ohne vollständige Test-Suite
- Benutzer sagt "teste diesen Flow manuell", "klick dich durch und überprüfe" oder "stelle sicher, dass die UI funktioniert"
- Sie müssen überprüfen, ob ein neu bereitgestellter Build sich korrekt für eine bestimmte Journey verhält
- Die App verwendet ein Framework, das schwer zu instrumentieren ist (Electron, Tauri, Qt, native macOS/Windows-Apps)
- Der Benutzer fordert explizit an, Computernutzung gegenüber Playwright aus einem bestimmten Grund zu bevorzugen (Geschwindigkeit, keine Test-Infrastruktur, CI nicht verfügbar)

## Wann NICHT verwenden

- Ein Playwright-, Cypress- oder Selenium-Suite deckt den Flow bereits ab — führen Sie die vorhandenen Tests zuerst aus
- Die App erfordert Anmeldung mit echten Anmeldedaten aus einem Passwort-Manager — klicken Sie nicht in Anmeldedatenbildschirme
- Der Flow berührt Zahlungsformulare, Krankenakten oder einen Bildschirm mit personenbezogenen Daten — stoppen Sie und fragen Sie den Benutzer
- Sie befinden sich in einer Produktionsumgebung — Computernutzung in der Produktion ist risikobehaftet; bestätigen Sie die Umgebung zuerst
- Der Bildschirm ist nicht sichtbar oder die App wird nicht ausgeführt — versuchen Sie nicht, blind zu agieren
- Der Benutzer möchte ein persistentes, reproduzierbares Test-Artefakt — schreiben Sie stattdessen einen Playwright-Test

## Anweisungen

### Vorflug-Checkliste

1. Bestätigen Sie, dass die Ziel-App vor einer Aktion läuft und auf dem Bildschirm sichtbar ist.
2. Fragen Sie, welche Umgebung (lokal dev, staging, prod). Wenn prod, warnen Sie und fordern Sie explizite Bestätigung an.
3. Identifizieren Sie den zu testenden Benutzerflow: Startzustand, Handlungsfolge, Erfolgsbedingung.
4. Machen Sie einen ersten Screenshot, um den Ausgangszustand festzustellen.

### Sicherheitsregeln

- Interagieren Sie niemals mit Bildschirmen, die zeigen: Passwörter, API-Schlüssel, Kreditkartenfelder, SSN-Felder, Krankenakten, Kontoständen.
- Beschreiben Sie vor jedem Klick, was Sie tun werden und was Sie erwarten.
- Nach jeder Aktion einen Screenshot machen und überprüfen, ob sich der Bildschirm wie erwartet geändert hat, bevor Sie fortfahren.
- Wenn der Bildschirm einen unerwarteten Zustand zeigt (Fehler, falsche Seite, Modal) — stoppen und berichten Sie — klicken Sie nicht blind weiter.
- Begrenzen Sie jede Test-Sitzung auf einen klar definierten Flow. Verketten Sie nicht mehrere unzusammenhängende Flows.

### Test-Schleife

Für jeden Schritt im Benutzerflow:

1. **Beschreiben** — Geben Sie an, welche Aktion Sie ausführen und welches Ergebnis Sie erwarten.
2. **Handeln** — Führen Sie die einzelne Aktion aus (klicken, tippen, scrollen, Tasten drücken).
3. **Screenshot** — Erfassen Sie den Bildschirm sofort nach der Aktion.
4. **Überprüfen** — Überprüfen Sie den Screenshot auf den erwarteten Zustand:
   - Korrekte Seite/Ansicht geladen
   - Erwartete UI-Elemente sind sichtbar (Button-Label, Überschriftstext, Formularfeld)
   - Keine Fehlerbanner, Toast-Meldungen mit Fehlertext oder gebrochene Layouts
5. **Aufzeichnen** — Notieren Sie Bestanden/Nicht bestanden für diesen Schritt mit Screenshot-Referenz.

Wiederholen Sie, bis die Erfolgsbedingung erreicht oder ein Fehler erkannt wird.

### Wann Computernutzung gegenüber Playwright bevorzugt wird

| Situation | Bevorzugt |
|---|---|
| Keine Test-Infrastruktur vorhanden, schnelle einmalige Prüfung | Computernutzung |
| App ist Electron / native / kein DOM-Zugriff | Computernutzung |
| Reproduktion eines Layout-Fehlers, der von Benutzer gemeldet wurde | Computernutzung |
| Test-Datei nötig, die teilbar und ausführbar ist | Playwright |
| Flow wird bei jedem Deploy getestet | Playwright |
| CI-Pipeline verfügbar | Playwright |

### Ergebnisse berichten

Nach Abschluss des Flows einen prägnanten Bericht erstellen:

```
Flow: [Name]
Umgebung: [lokal/staging/prod]
Getestete Schritte: [n]
Bestanden: [n]
Fehlgeschlagen: [n]

Schritt für Schritt:
1. [Aktion] → BESTANDEN — [was beobachtet wurde]
2. [Aktion] → FEHLGESCHLAGEN — [was beobachtet wurde vs. erwartet]

Screenshots: [Liste erfasster Screenshots]
Empfehlung: [Fehler X bei Schritt 2 beheben / alles klar]
```

### Häufige Fallstricke

- Klicken auf Koordinaten, die beim Scrollen verschieben — erst zum Element scrollen, dann klicken
- Animationen verzögern das Erscheinen von Elementen — auf die Stabilität des Elements warten, bevor Sie überprüfen
- Shadow DOM oder Canvas-Elemente, die interaktiv aussehen, aber nicht sind — als schreibgeschützte visuelle Überprüfungen behandeln
- Modals blockieren die zugrundeliegende UI — Modals immer schließen oder verwerfen, bevor Sie den Seitenzustand überprüfen

## Beispiel

**Szenario**: Testen Sie den Anmeldeflow für eine lokale Next.js-App unter `http://localhost:3000`.

**Flow vom Benutzer definiert**: Navigieren Sie zu /signup, geben Sie E-Mail und Passwort ein, klicken Sie auf "Konto erstellen", überprüfen Sie die Umleitung zu /dashboard mit Willkommensmeldung.

**Ausführung**:

1. Screenshot machen — bestätigen Sie, dass der Browser auf `/signup` ist, Formular sichtbar.
2. Klicken Sie auf das E-Mail-Eingabefeld. Geben Sie `testuser@example.com` ein. Screenshot — Feld enthält E-Mail.
3. Klicken Sie auf das Passwort-Feld. Geben Sie `TestPass123!` ein. Screenshot — Feld zeigt maskierte Zeichen.
4. Klicken Sie auf "Konto erstellen"-Button. Screenshot — überprüfen Sie auf Lade-Zustand.
5. Warten Sie auf Umleitung. Screenshot — URL-Leiste zeigt `/dashboard`.
6. Überprüfen Sie: Überschrift "Willkommen, testuser" ist auf dem Bildschirm sichtbar. BESTANDEN.

**Bericht**:
```
Flow: Anmeldung → Dashboard
Umgebung: lokal
Getestete Schritte: 5
Bestanden: 5 / Fehlgeschlagen: 0

Alle Schritte bestanden. Benutzer kann sich anmelden und das Dashboard erreichen.
```

Wenn Schritt 5 stattdessen ein "Etwas ist schiefgelaufen"-Toast zeigte, würde der Bericht FEHLGESCHLAGEN bei Schritt 5 mit dem Screenshot markieren und stoppen — keine weiteren Klicks.
