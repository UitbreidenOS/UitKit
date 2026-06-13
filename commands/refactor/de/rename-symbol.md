---
description: Symbol konsistent über alle Dateien im Geltungsbereich umbenennen
argument-hint: "[alter-name] [neuer-name] [datei oder verzeichnis]"
---
Benenne das in $ARGUMENTS angegebene Symbol um — Format: `<alter-name> <neuer-name> <pfad>`.

1. Analysiere die Argumente: alter Name, neuer Name und die Datei oder das Verzeichnis, das bearbeitet werden soll.

2. Vor dem Umbenennen überprüfe:
   - Der neue Name folgt der Namenskonvention, die für diesen Symboltyp in dieser Codebasis verwendet wird (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, usw.)
   - Der neue Name existiert nicht bereits im gleichen Geltungsbereich
   - Der neue Name ist kein reserviertes Schlüsselwort und wird nicht von einer importierten Abhängigkeit verwendet

3. Finde jeden Verweis auf den alten Namen innerhalb des angegebenen Geltungsbereichs:
   - Deklaration (Funktionsdefinition, Klasse, Variable, Typ-Alias, Konstante, Enum-Member)
   - Alle Aufrufobjekte und Verwendungsstellen
   - Import-/Export-Anweisungen (benannte Importe, Re-Exporte)
   - String-Literale, die bekanntermaßen auf das Symbol verweisen (z. B. Ereignisnamen, dynamische `require()`, `keyof` String-Zugriff) — markiere diese, aber benenne sie nicht automatisch um, da sie möglicherweise API-Verträge sind
   - JSDoc-/Docstring-Verweise
   - Kommentare, die das Symbol benennen — aktualisiere diese, wenn die Umbenennung den Kommentar falsch macht

4. Wende die Umbenennung an jeder identifizierten Stelle an. Benenne nicht um:
   - Teilübereinstimmungen (z. B. Umbenennung von `user` darf nicht `username` oder `currentUser` ändern)
   - Nicht verwandte Symbole, die zufällig den Namen in einem anderen Geltungsbereich teilen
   - Externe Dateien außerhalb des angegebenen Pfads, es sei denn, das Symbol wird exportiert und diese Dateien befinden sich im Repo

5. Überprüfe nach der Umbenennung, dass alle Importpfade und Modul-Re-Exporte intern konsistent sind.

6. Ausgabe: Gesamtanzahl der aktualisierten Verweise, Liste der geänderten Dateien und alle Stellen, die für manuelle Überprüfung gekennzeichnet sind (String-Literale, dynamischer Zugriff).
