---
name: screenshot-verify
description: Capture und überprüfen Sie, dass sich eine Codeänderung tatsächlich korrekt gerendert hat — die "sehen Sie es funktionieren"-Schleife nach einer Bearbeitung.
---

# Screenshot-Verifikation

## Wann aktivieren

- Der Benutzer sagt "überprüfen Sie, ob das richtig aussieht", "überprüfen Sie, dass sich die Änderung gerendert hat" oder "funktioniert es visuell"
- Sie haben gerade eine Codeänderung vorgenommen und möchten bestätigen, dass die Änderung in der laufenden App sichtbar ist, bevor Sie fertig melden
- Ein Build wurde neu geladen und der Benutzer möchte eine Bestätigung, dass die neue Version live ist
- Sie müssen die Schleife nach einer CSS-, Layout- oder Komponentenänderung schließen — die Bearbeitung allein ist kein Beweis
- Der Benutzer fragt "können Sie es funktionieren sehen" oder "zeigen Sie mir einen Screenshot nach der Fehlerbehebung"
- Debugging einer Änderung, die "funktionieren sollte" — bestätigen, ob der neue Code tatsächlich ausgeführt wird
- Überprüfung eines Feature-Flags, einer Umgebungsvariablen oder einer Konfigurationsänderung, die visuell wirksam wurde

## Wann NICHT verwenden

- Die Änderung ist rein Backend/API ohne visuelle Ausgabe — verwenden Sie stattdessen Testausführung oder Protokolle
- Die App läuft nicht und kann nicht ohne vom Benutzer bereitgestellte Anmeldeinformationen oder Umgebungssetup gestartet werden
- Der visuelle Status kann nicht erreicht werden, ohne sich durch einen sensiblen Authentifizierungsbildschirm anzumelden
- Der Benutzer sagt explizit "führen Sie einfach die Tests aus, überprüfen Sie nicht visuell"
- Die Änderung befindet sich in einer Komponente ohne gerenderte Ausgabe (Utility-Funktion, Typendefinition, serverseitige Logik)

## Anleitung

### Die Verifikationsschleife

Die Verifikationsschleife ist der minimale Zyklus, um die Lücke zwischen "ich habe eine Änderung vorgenommen" und "ich kann sehen, dass die Änderung funktioniert" zu schließen:

```
BEARBEITEN → NEULADEN → NAVIGIEREN → SCREENSHOT → ÜBERPRÜFEN → BERICHT
```

Jede Phase wird unten beschrieben.

### Phase 1: BEARBEITEN

Bestätigen Sie, dass die Änderung auf die Festplatte gespeichert wurde. Wenn Sie die Bearbeitung vorgenommen haben, wird sie gespeichert. Wenn der Benutzer die Bearbeitung vorgenommen hat, fragen Sie: "Ist die Datei gespeichert?" bevor Sie fortfahren.

Notieren Sie die genaue Datei und Zeile, die geändert wurde, damit Sie wissen, welche visuelle Ausgabe zu erwarten ist.

### Phase 2: NEULADEN

Aktivieren Sie ein Neuladen der laufenden Anwendung:

**Web-App (Browser)**:
- Wenn Hot Module Replacement (HMR) aktiv ist, hat sich die Änderung möglicherweise bereits neu geladen. Überprüfen Sie die Browser-Konsole auf HMR-Aktivität.
- Wenn nicht, aktivieren Sie ein hartes Neuladen: Cmd+Shift+R (macOS) oder Ctrl+Shift+F5 (Windows).
- Warten Sie, bis der Netzwerkaktivitätsindikator stoppt, bevor Sie einen Screenshot machen.

**Native / Electron-App**:
- Überprüfen Sie, ob Live-Reload konfiguriert ist. Wenn ja, warten Sie auf den Reload-Indikator.
- Wenn kein Live-Reload vorhanden ist, fragen Sie den Benutzer, die App neu zu starten oder die eigene Reload-Verknüpfung der App zu verwenden.

**Server-seitig gerenderte App**:
- Bestätigen Sie, dass der Dev-Server die Änderung aufgegriffen hat (beobachten Sie Dateiänderungsprotokoll im Terminal).
- Hartes Neuladen des Browsers.

**Lokal bereitgestellte statische Datei**:
- Bestätigen Sie, dass die Datei von der Festplatte aus bereitgestellt wird (nicht eine zwischengespeicherte Version). Hartes Neuladen mit Cache-Bypass.

### Phase 3: NAVIGIEREN

Navigieren Sie zur genauen Ansicht, in der die Änderung sichtbar sein sollte:

1. Notieren Sie die URL oder den Bildschirmpfad vor der Navigation.
2. Machen Sie einen Screenshot in der Zielansicht, bevor Sie überprüfen — dies ist Ihr Beweis, dass der richtige Bildschirm geladen ist.
3. Wenn die Änderung nur nach einer Benutzerinteraktion (Klick, Hover, Eingabe) angezeigt wird, führen Sie die Mindestinteraktion durch, die erforderlich ist, um sie anzuzeigen.

Machen Sie keinen Screenshot einer Seite, die noch geladen wird — warten Sie, bis der Ladeindikator verschwindet.

### Phase 4: SCREENSHOT

Erfassen Sie den Bildschirm mit Präzision:

- Scrollen Sie zum Bereich, in dem das geänderte Element sichtbar ist, falls erforderlich.
- Wenn sich die Änderung in einer bestimmten Komponente befindet, zoomen Sie nach dem Vollseiten-Screenshot auf diese Komponente.
- Wenn Sie einen Zustand vorher vergleichen, erfassen Sie in der gleichen Scroll-Position und Viewport-Breite wie der Vorher-Screenshot.
- Benennen Sie den Screenshot mit dem Kontext: `[component]-[state]-after.png` — verwenden Sie keine allgemeinen Namen wie `screenshot1.png`.

### Phase 5: ÜBERPRÜFEN

Untersuchen Sie den Screenshot und überprüfen Sie die spezifische Änderung:

Für eine **CSS-Änderung** (Farbe, Schriftart, Abstände, Layout):
- Wird der neue Wert sichtbar angewendet? Beschreiben Sie, was Sie sehen.
- Ist es in allen Instanzen der Komponente auf diesem Bildschirm konsistent?
- Gibt es benachbarte Elemente, die als Nebenwirkung beschädigt aussehen?

Für eine **Text-/Inhaltsänderung**:
- Wird der neue Text genau wie in der Bearbeitung geschrieben angezeigt?
- Befindet es sich an der richtigen Stelle (nicht zu einem anderen Element verschoben)?
- Ist der alte Text weg?

Für eine **neue Komponente oder Funktion**:
- Wird die Komponente gerendert und ist sichtbar?
- Befindet sich die Komponente an der richtigen Stelle im Layout?
- Antwortet sie auf die erwartete Interaktion (sichtbarer aktiver Zustand, Beschriftung, Symbol)?

Für einen **Bugfix**:
- Ist der zuvor beschädigte Zustand weg?
- Ist der korrigierte Zustand vorhanden?
- Beschreiben Sie sowohl das alte Problem als auch den neuen Zustand in der Überprüfung.

Für eine **Konfigurations- oder Feature-Flag-Änderung**:
- Wird der bedingte Inhalt wie erwartet angezeigt/ausgeblendet?
- Überprüfen Sie auch die gegenteilige Bedingung, falls möglich — bestätigen Sie, dass er nicht angezeigt wird, wenn er nicht sollte.

### Phase 6: BERICHT

Erstellen Sie eine prägnante Verifikationsaussage nach der Screenshot-Überprüfung:

**Erfolgsformat**:
```
Verifiziert: [was wurde geändert]
Screenshot zeigt: [spezifische Beobachtung, die die Änderung bestätigt]
Keine Regressionen in benachbarten Elementen beobachtet.
Status: BESTÄTIGT
```

**Fehlerformat**:
```
Verifikation fehlgeschlagen: [was wurde geändert]
Erwartet: [was der Screenshot anzeigen sollte]
Beobachtet: [was der Screenshot tatsächlich anzeigt]
Mögliche Ursache: [wahrscheinlichster Grund — falsche Datei gespeichert, falscher Selektor, HMR nicht aktiv, zwischengespeicherter Build]
Nächster Schritt: [spezifische Aktion zur Untersuchung]
Status: NICHT BESTÄTIGT
```

### Häufige Fehlermodi und deren Diagnose

| Symptom | Wahrscheinliche Ursache | Überprüfung |
|---|---|---|
| Änderung nicht sichtbar nach Neuladen | Datei nicht gespeichert oder falsche Datei bearbeitet | Bestätigen Sie Dateipfad und Inhalt |
| Alte Version wird noch angezeigt | Browser-Cache | Hartes Neuladen mit Cmd+Shift+R |
| Änderung sichtbar an der falschen Stelle | CSS-Selektor zu breit | Inspizieren Sie Selektor-Bereich |
| Komponente wird überhaupt nicht gerendert | Importfehler, bedingte Wiedergabe, Feature-Flag aus | Überprüfen Sie Browser-Konsole auf Fehler |
| Änderung sichtbar in dev aber nicht nach Build | Build-Schritt erforderlich, nicht nur Dev-Server | Führen Sie den Build-Schritt aus |
| App zeigt leeren Bildschirm nach Bearbeitung | Syntaxfehler in bearbeiteter Datei | Überprüfen Sie Terminal/Konsole auf Kompilierungsfehler |

### Verifikation in mehreren Zuständen

Einige Änderungen werden nur in bestimmten Zuständen angezeigt. Führen Sie für jeden relevanten Zustand die Verifikationsschleife unabhängig durch:

- **Standardzustand** — initiales Rendern ohne Benutzerinteraktion
- **Aktiv-/Hover-Zustand** — nach Mausinteraktion (Screenshot machen, während Sie hovern, falls möglich)
- **Fehlerzustand** — mit ungültiger Eingabe oder fehlgeschlagenem Abruf
- **Leerer Zustand** — ohne geladene Daten
- **Ladezustand** — unmittelbar nach Auslösung eines Datenabrufs

### Sicherheitsregeln

- Interagieren Sie nicht mit Formularen, die Daten als Nebenwirkung der Navigation zur Verifikation einer visuellen Änderung absenden könnten.
- Wenn der Navigationspfad zur geänderten Ansicht durch einen sensiblen Bildschirm führt (Zahlung, Authentifizierung, Gesundheit), stoppen Sie und bitten Sie den Benutzer, dorthin manuell zu navigieren und dann von dort aus einen Screenshot zu machen.
- Verifikation ist beobachtende Lesefähigkeit — nehmen Sie während einer Verifikationsschleife keine zusätzlichen Bearbeitungen vor. Wenn eine Regression entdeckt wird, melden Sie sie und warten Sie auf Anweisung.

## Beispiel

**Szenario**: Developer hat die primäre Schaltflächenfarbe in einer Tailwind-Konfiguration von Blau zu Indigo geändert. Möchte eine Bestätigung, dass die Änderung in der gesamten App live ist.

**Vorgenommene Bearbeitung**: `tailwind.config.js` — `primary` Farbe aktualisiert von `#3B82F6` zu `#6366F1`.

**Verifikationsschleife**:

1. **NEULADEN**: Browser HMR ist aktiv. Überprüfen Sie Terminal — "Tailwind-Konfiguration geändert, wird neu erstellt..." Nachricht sichtbar. Warten Sie auf die Meldung "Neuaufbau abgeschlossen".

2. **NAVIGIEREN**: Gehe zu `http://localhost:3000` — Homepage mit einer sichtbaren primären Schaltfläche "Los geht's".

3. **SCREENSHOT**: Erfassen Sie die gesamte Seite. Notieren Sie die primäre Schaltfläche.

4. **ÜBERPRÜFEN**: Die Schaltflächenhintergrundfarbe ist visuell indigo (mit purpur-Neigung), nicht blau. Entspricht dem erwarteten `#6366F1` Ton. Keine anderen Elemente scheinen beschädigt zu sein. Benachbarte sekundäre Schaltflächen bleiben grau.

5. Navigieren Sie zu `/pricing` — eine weitere primäre CTA-Schaltfläche vorhanden. Screenshot. Gleiche Indigofarbe angewendet. Konsistent.

**Bericht**:
```
Verifiziert: Primäre Schaltflächenfarbe geändert von Blau (#3B82F6) zu Indigo (#6366F1)
Screenshot zeigt: Sowohl Homepage CTA als auch Pricing-Seite CTA zeigen die neue Indigofarbe an
Keine Regressionen beobachtet — sekundäre und tertiäre Schaltflächen unverändert
Status: BESTÄTIGT
```

**Wenn die Schaltfläche noch blau war**:
```
Verifikation fehlgeschlagen: Primäre Schaltflächenfarbe geändert
Erwartet: Indigo (#6366F1) Schaltflächenhintergrund
Beobachtet: Schaltfläche zeigt noch Blau (#3B82F6)
Mögliche Ursache: Tailwind JIT hat Konfigurationsänderung nicht aufgegriffen oder Browser hat altes CSS zwischengespeichert
Nächster Schritt: Überprüfen Sie Terminal auf Neuaufbau-Fehler; versuchen Sie hartes Neuladen mit Cmd+Shift+R; bestätigen Sie, dass tailwind.config.js in den Inhaltspfaden liegt
Status: NICHT BESTÄTIGT
```
