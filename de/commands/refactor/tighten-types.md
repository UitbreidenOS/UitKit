---
description: Schwache oder fehlende Typannotationen in einer Datei stärken
argument-hint: "[file]"
---
Verschärfe die Typen in $ARGUMENTS.

1. Lese die Datei. Identifiziere jede Stelle, an der Typen schwächer sind als nötig:
   - `any` in TypeScript — ersetze mit dem engsten korrekten Typ, Union oder Generics
   - Nicht typisierte Funktionsparameter oder Rückgabewerte
   - Überbreite Typen (`object`, `Record<string, any>`, `dict`, `interface{}`) wenn eine konkrete Form bekannt ist
   - Optional (`T | undefined`, `T | None`) wo der Wert immer vorhanden ist
   - Nicht-optional wo der Wert legitim abwesend sein kann — füge optional hinzu und behandle es an Call Sites
   - Enums oder Union-Typen die nackte `string` oder `number` Literale ersetzen könnten
   - `as` Casts / Type Assertions die durch richtige Type Narrowing oder Guards ersetzt werden könnten

2. Für jeden schwachen Typ der gefunden wird:
   - Leite den korrekten Typ aus Verwendung, umgebendem Kontext und bestehender Dokumentation ab
   - Wende den engeren Typ an der Deklarationsstelle an
   - Behebe alle nachgelagerten Typfehler die die Verschärfung offenlegt — lasse keine fehlerhaften Call Sites
   - Wenn Verschärfung einen neuen Type Alias oder eine Interface erfordert, definiere ihn oben in der Datei (oder in einer bestehenden Types-Datei wenn das Projekt eine hat)

3. Ändere nicht das Runtime-Verhalten. Nur Typänderungen.

4. Füge Typen nicht nur hinzu um Typen hinzuzufügen — wenn der Typ einer lokalen Variable von einer literalen Zuweisung offensichtlich ist und die Sprache ihn korrekt ableitet, lasse die Inferenz unverändert.

5. Wenn der Rückgabetyp einer Funktion aktuell abgeleitet wird und die Inferenz korrekt und stabil ist, lasse ihn. Annotiere nur wenn der abgeleitete Typ überbreitet ist oder wahrscheinlich abweicht.

6. Nach allen Änderungen überprüfe konzeptionell, dass die Datei den Type Checker des Projekts bestehen würde (`tsc --noEmit`, `mypy`, `cargo check`, etc.). Wenn du nicht überprüfen kannst, flagge jede Änderung die einen Type Error einführen könnte.

7. Ausgabe: Liste aller verschärften Typen, ursprünglicher Typ, neuer Typ und Ort.
