---
description: Extrahieren Sie einen markierten Block oder die beschriebene Logik in eine benannte Funktion mit korrekter Signatur und Aufrufssite-Updates
argument-hint: "[file] [line-range or description]"
---
Sie führen einen chirurgischen Extract-Function-Refactor auf $ARGUMENTS durch.

Schritte:
1. Lesen Sie die Zieldatei. Identifizieren Sie den zu extrahierenden Codeblock — entweder der angegebene Zeilenbereich oder die Logik, die der Beschreibung entspricht.
2. Bestimmen Sie den minimalen Satz von Eingaben, die die extrahierte Funktion benötigt (Parameter), und was sie zurückgeben muss (Rückgabewerte oder Mutationen).
3. Wählen Sie einen Namen, der präzise und verbauswahl-zentriert ist (z. B. `computeRetryDelay`, `parseHeaderToken`, `buildQueryString`). Verwenden Sie keine vagen Namen wie `helper` oder `util`.
4. Schreiben Sie die extrahierte Funktion mit:
   - Der korrekten Signatur, die den Konventionen der Host-Sprache entspricht (Typannotationen, wenn die Sprache diese unterstützt)
   - Nur ein einzeiliger Docstring/Kommentar, wenn der Zweck nicht offensichtlich ist
   - Keine Nebenwirkungen außer denen, die der ursprüngliche Code hatte
5. Ersetzen Sie den ursprünglichen Block durch einen Aufruf der neuen Funktion, übergeben Sie die identifizierten Argumente und erfassen Sie Rückgabewerte.
6. Überprüfen Sie:
   - Die Aufrufssite wird sauber kompiliert/geparst (überprüfen Sie auf nicht verwendete Variablen, die zurückgelassen wurden, fehlende Rückgaben, unterbrochene Kontrollflüsse)
   - Keine Variable aus dem äußeren Bereich wird jetzt in der Funktion referenziert, die nicht explizit übergeben wurde
   - Wenn die Sprache typisiert ist, sind die Typen durchgehend konsistent
7. Wenn die extrahierte Logik an anderer Stelle in der Datei mehr als einmal vorkommt, ersetzen Sie auch diese Vorkommen und notieren Sie, wie viele Aufrufsites aktualisiert wurden.
8. Geben Sie den Diff aus. Schreiben Sie nicht verwandte Code nicht um.

Einschränkungen:
- Bewahren Sie das bestehende Verhalten genau — dies ist ein Refactor, keine Umschreibung.
- Ändern Sie nicht die Logik des extrahierten Blocks, sondern nur seinen Standort und seine Aufrufe.
- Wenn die Extraktion nicht sicher ist (z. B. der Block ändert mehrere äußere Variablen auf verflochtene Weise), erklären Sie dies und schlagen Sie stattdessen eine sicherere Grenze vor.
