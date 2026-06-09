---
description: Verstärke schwache oder fehlende Typannotationen in einer Datei
argument-hint: "[file]"
---
Verstärke die Typen in $ARGUMENTS.

1. Lies die Datei. Identifiziere jede Stelle, an der Typen schwächer sind, als sie sein sollten:
   - `any` in TypeScript — ersetze durch den engsten korrekten Typ, Union oder Generic
   - Nicht typisierte Funktionsparameter oder Rückgabewerte
   - Übermäßig breite Typen (`object`, `Record<string, any>`, `dict`, `interface{}`), wenn eine konkrete Form bekannt ist
   - Optional (`T | undefined`, `T | None`) verwendet, wo der Wert immer vorhanden ist
   - Nicht optional verwendet, wo der Wert legitim abwesend sein kann — füge optional hinzu und handle es bei Aufrufen
   - Enums oder Union-Typen, die bloße `string`- oder `number`-Literale ersetzen könnten
   - `as` Casts / Type Assertions, die durch ordnungsgemäße Typ-Narrowing oder Guards ersetzt werden könnten

2. Für jeden gefundenen schwachen Typ:
   - Inferiere den korrekten Typ aus Verwendung, umgebendem Kontext und bestehender Dokumentation
   - Wende den stärkeren Typ an der Deklarationsstelle an
   - Behebe alle nachgelagerten Typfehler, die die Verstärkung aufdeckt — hinterlasse keine fehlerhaften Aufrufe
   - Wenn die Verstärkung einen neuen Type Alias oder eine Interface erfordert, definiere ihn in der Nähe des Dateianfangs (oder in einer bestehenden Types-Datei, wenn das Projekt eine hat)

3. Ändere nicht das Laufzeitverhalten. Nur Typänderungen.

4. Füge nicht einfach Typen hinzu — wenn der Typ einer lokalen Variable offensichtlich aus einer Literal-Zuordnung ist und die Sprache ihn korrekt inferiert, lasse die Inferenz unverändert.

5. Wenn der Rückgabetyp einer Funktion derzeit inferiert wird und die Inferenz korrekt und stabil ist, lasse ihn. Annotiere nur, wenn der inferierte Typ übermäßig breit ist oder wahrscheinlich abweicht.

6. Nach allen Änderungen verifiziere konzeptionell, dass die Datei den Type-Checker des Projekts bestehen würde (`tsc --noEmit`, `mypy`, `cargo check`, usw.). Wenn du nicht verifizieren kannst, kennzeichne jede Änderung, die einen Typfehler einführen könnte.

7. Ausgabe: Liste aller verstärkten Typen, ursprünglicher Typ, neuer Typ und Ort.
