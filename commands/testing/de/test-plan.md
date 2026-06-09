---
description: Erstellen Sie einen strukturierten Testplan für ein Feature, Modul oder PR
argument-hint: "[feature, file, or PR description]"
---
Erstellen Sie einen strukturierten Testplan für: $ARGUMENTS

Schritte:

1. Analysieren Sie das Argument, um den Umfang zu bestimmen:
   - Falls ein Dateipfad: Lesen Sie die Datei und extrahieren Sie öffentliche Funktionen, Klassen, Routen oder Komponenten
   - Falls eine Feature-Beschreibung: Identifizieren Sie die Domäne und leiten Sie betroffene Oberflächen ab
   - Falls ein PR oder Diff im Kontext vorhanden ist: Verwenden Sie geänderte Dateien als Umfang

2. Für den identifizierten Umfang listen Sie Testkategorien in dieser Reihenfolge auf:
   a. Unit-Tests — einzelne Funktionen, Methoden oder reine Logik
   b. Integrationstests — Modulgrenzen, Service-Interaktionen, Datenbankabfragen
   c. Komponenten-/UI-Tests — falls der Umfang Frontend-Code enthält
   d. End-to-End-Tests — falls benutzergerichtete Workflows betroffen sind
   e. Vertragstests — falls der Umfang API-Endpunkte enthält, die von externen Clients verbraucht werden

3. Für jede Kategorie listen Sie spezifische Testfälle auf. Jeder Testfall-Eintrag muss enthalten:
   - Eine einzeilige Beschreibung im Format: `[Subjekt] [Aktion/Status] → [erwartetes Ergebnis]`
   - Priorität: P0 (muss versendet werden), P1 (sollte versendet werden), P2 (nice to have)
   - Typ: Happy Path | Edge Case | Error Path | Regression

4. Identifizieren Sie:
   - Alle vorhandenen Tests, die überlappenden Bereich abdecken (prüfen Sie Testverzeichnisse)
   - Lücken, wo derzeit keine Tests vorhanden sind
   - Externe Abhängigkeiten, die zum Mocken erforderlich sind (APIs, Datenbanken, Zeit, Zufallswerte)

5. Kennzeichnen Sie Fälle, die hohen Aufwand oder geringen Wert haben — erwähnen Sie sie nicht stillschweigend; notieren Sie den Kompromiss.

6. Geben Sie den Plan als Markdown-Tabelle oder verschachtelte Liste aus. Schreiben Sie keinen Testcode.

7. Beenden Sie mit einer Zusammenfassungszeile: Gesamtanzahl der Testfälle nach Priorität (z. B. „P0: 4, P1: 7, P2: 3").
