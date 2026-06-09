---
description: Starten Sie einen TDD-Zyklus — schreiben Sie zuerst fehlgeschlagene Tests, dann implementieren Sie
argument-hint: "[function, class, or feature to build]"
---
Starten Sie einen TDD-Zyklus für: $ARGUMENTS

Schritte:

1. Klären Sie das Ziel aus dem Argument:
   - Wenn eine Funktionssignatur oder Beschreibung: leiten Sie Input-/Output-Kontrakte ab
   - Wenn ein Klassen- oder Modulname: folgern Sie Verantwortungen aus dem Namen und vorhandenem Code-Kontext
   - Wenn eine Feature-Beschreibung: identifizieren Sie die kleinste Verhaltenseinheit zum Starten

2. Überprüfen Sie auf vorhandene Implementierung oder partiellen Code. Falls vorhanden, lesen Sie ihn, ändern Sie ihn aber noch nicht.

3. Schreiben Sie zuerst fehlgeschlagene Tests — noch kein Implementierungscode.

   Für jeden Test:
   - Benennen Sie ihn im Format: `[unit] [scenario] [expected result]`
   - Decken Sie in dieser Reihenfolge ab: Happy Path → Grenzfälle → Fehlerpfade
   - Schreiben Sie die minimale Anzahl von Tests, die den Kontrakt vollständig spezifizieren (vermeiden Sie Redundanz)
   - Verwenden Sie das vorhandene Test-Framework und den Assertion-Stil des Projekts

   Minimale Testfälle zum Schreiben vor dem Stopp:
   - Mindestens 1 Happy-Path-Test
   - Mindestens 1 Grenzfall- oder Edge-Case-Test
   - Mindestens 1 Fehler-/Ungültige-Eingabe-Test (wenn das Ziel fehlschlagen kann)

4. Führen Sie die Tests aus. Bestätigen Sie, dass sie aus dem richtigen Grund fehlschlagen (nicht ein Syntaxfehler oder Importfehler — ein echtes Assertion-Fehler gegen fehlende Logik).

5. Schreiben Sie die minimale Implementierung, die die Tests bestehen lässt:
   - Keine Logik über das hinaus, was die Tests erfordern
   - Keine spekulativen Behandlungen von Fällen, die noch nicht getestet wurden
   - Folgen Sie dem vorhandenen Code-Stil des Projekts

6. Führen Sie die Tests erneut aus. Wenn alle bestanden, melden Sie Erfolg.

7. Wenn ein Test nach der Implementierung immer noch fehlschlägt, zeigen Sie die Fehlerausgabe an und diagnostizieren Sie die Lücke, bevor Sie einen Fix versuchen.

8. Beenden Sie mit:
   - Erstellte oder geänderte Dateien
   - Testzahl und Pass-/Fail-Status
   - Nächster vorgeschlagener Test zum Schreiben (einen Schritt weiter im TDD-Zyklus)
