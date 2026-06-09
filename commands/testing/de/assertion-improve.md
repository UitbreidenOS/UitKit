---
description: Schwache oder oberflächliche Assertions in bestehenden Tests verstärken
argument-hint: "[test file or directory]"
---
Überprüfen und verbessern Sie Assertions in: $ARGUMENTS

Schritte:

1. Lesen Sie die Zieldatei oder alle Testdateien im Zielverzeichnis.

2. Identifizieren Sie schwache Assertion-Muster — notieren Sie jede mit Dateipfad und Zeilennummer:

   **Zu breite Matcher**
   - `toBeTruthy` / `toBeFalsy` wenn ein spezifischer Wert überprüfbar ist
   - `toBeDefined` wenn die Form oder der Typ behauptet werden kann
   - `toContain` auf vollständigen Objekten, wenn ein genaue Übereinstimmung angebracht ist

   **Unvollständige Abdeckung**
   - Tests, die den Rückgabewert, aber nicht die Nebenwirkung behaupten (oder umgekehrt)
   - Fehlerpfade, die nur `throw` überprüfen, ohne die Fehlermeldung oder den Typ zu verifizieren
   - Asynchrone Funktionen, deren Ablehnungsfall nicht getestet wird

   **Übermäßige Snapshot-Verwendung**
   - Snapshots, die ganze große Komponentenbäume abdecken, wo gezielt Eigenschafts-Assertions stabiler und lesbarer wären
   - Snapshots, die irrelevante Implementierungsdetails codieren (z. B. interne CSS-Klassennamen)

   **Fehlende Grenztests**
   - Funktionen, die Arrays/Strings akzeptieren, aber keine Tests für leere Eingaben
   - Numerische Funktionen ohne Test bei Null, negativen oder maximalen Grenzen
   - Nullable Parameter ohne Null/undefined-Test

   **Assertion-Anzahl**
   - Tests mit Null-Assertions (falscher Pass)
   - Tests mit einem einzelnen `expect`, der nicht zwischen zwei ähnlichen Fehlermodi unterscheiden kann

3. Zeigen Sie für jeden Fund:
   - Die aktuelle Assertion
   - Warum sie schwach ist
   - Ein Ersatz, der spezifischer, bedeutungsvoller oder vollständiger ist

4. Wenden Sie alle Änderungen an, die eindeutig Verbesserungen sind — ändern Sie keine bestandenen Tests zu fehlgeschlagenen.

5. Fügen Sie keine neuen Testfälle hinzu; verbessern Sie nur Assertions in vorhandenen Tests.

6. Zusammenfassung: X Assertions überprüft, Y ersetzt, Z gekennzeichnet, aber nicht geändert (mit Grund).
