# ETL-Debugging

## Wann aktivieren

Pipeline schlägt fehl, Datenverlust tritt auf, oder Datensätze fehlen unerwartet oder sind dupliziert.

## Wann NICHT verwenden

Nicht für Designüberprüfung; nur für Fehler nach der Laufzeit.

## Anweisungen

1. Fehlerstufe isolieren
2. Protokolle und Metriken prüfen
3. Eingabedaten und Schema überprüfen
4. Transformationen end-to-end verfolgen

## Beispiel

Pipeline stoppt im Join-Schritt. Protokolle zeigen „key mismatch". Überprüfung: Linke Tabelle hat 1 Mio. Zeilen, rechte Tabelle hat 900K. Fehlende Schlüssel in rechter Tabelle identifiziert. Filter hinzufügen oder Outer Join verwenden.
