---
description: Schwache oder oberflächliche Assertions in bestehenden Tests verstärken
argument-hint: "[Testdatei oder Verzeichnis]"
---
Überprüfen und verbessern Sie Assertions in: $ARGUMENTS

Schritte:

1. Lesen Sie die Zieldatei oder alle Testdateien im Zielverzeichnis.

2. Identifizieren Sie schwache Assertion-Muster – notieren Sie jeden mit Dateipfad und Zeilennummer:

   **Zu breite Matcher**
   - `toBeTruthy` / `toBeFalsy`, wenn ein spezifischer Wert überprüfbar ist
   - `toBeDefined`, wenn die Form oder der Typ überprüft werden kann
   - `toContain` auf vollständigen Objekten, wenn ein exakter Match angemessen ist

   **Unvollständige Abdeckung**
   - Tests, die den Rückgabewert überprüfen, aber nicht die Nebenwirkung (oder umgekehrt)
   - Fehlerpfade, die nur `throw` überprüfen, ohne die Fehlermeldung oder den Fehlertyp zu verifizieren
   - Asynchrone Funktionen, deren Ablehnungsfall nicht getestet wird

   **Übernutzung von Snapshots**
   - Snapshots, die gesamte große Komponentenbäume abdecken, wo gezielt platzierte Property-Assertions stabiler und lesbarer wären
   - Snapshots, die irrelevante Implementierungsdetails codieren (z. B. interne CSS-Klassennamen)

   **Fehlende Grenzwertprüfungen**
   - Funktionen, die Arrays/Strings akzeptieren, aber keinen Test für leere Eingabe durchführen
   - Numerische Funktionen ohne Test bei Null, Negativ- oder Maximalwert
   - Nullable-Parameter ohne Test für Null/Undefined

   **Assertion-Anzahl**
   - Tests mit null Assertions (Fehlpass)
   - Tests mit einer einzelnen `expect`, die nicht zwischen zwei ähnlichen Fehlermodi unterscheiden kann

3. Zeigen Sie für jeden Befund:
   - Die aktuelle Assertion
   - Warum sie schwach ist
   - Eine Ersetzung, die spezifischer, aussagekräftiger oder vollständiger ist

4. Wenden Sie alle Änderungen an, die eindeutig Verbesserungen darstellen – ändern Sie nicht bestandene Tests in fehlgeschlagene um.

5. Fügen Sie keine neuen Testfälle hinzu; verbessern Sie nur Assertions innerhalb bestehender Tests.

6. Zusammenfassung: X Assertions überprüft, Y ersetzt, Z gekennzeichnet aber nicht geändert (mit Grund).
