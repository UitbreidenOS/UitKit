---
description: Ein Symbol konsistent über alle Dateien im Geltungsbereich umbenennen
argument-hint: "[old-name] [new-name] [file or directory]"
---
Benennen Sie das in $ARGUMENTS angegebene Symbol um — Format: `<old-name> <new-name> <path>`.

1. Analysieren Sie die Argumente: alter Name, neuer Name und die Datei oder das Verzeichnis, auf die sich die Operation bezieht.

2. Validieren Sie vor dem Umbenennen:
   - Der neue Name befolgt die Namenskonvention, die für diesen Symboltyp in dieser Codebasis verwendet wird (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, usw.)
   - Der neue Name existiert nicht bereits im selben Geltungsbereich
   - Der neue Name ist kein reserviertes Schlüsselwort und wird nicht von einer importierten Abhängigkeit verwendet

3. Finden Sie jeden Verweis auf den alten Namen innerhalb des angegebenen Geltungsbereichs:
   - Deklaration (Funktionsdefinition, Klasse, Variable, Typ-Alias, Konstante, Enum-Mitglied)
   - Alle Aufrufstellen und Verwendungsstellen
   - Import-/Export-Anweisungen (benannte Importe, Wiederexporte)
   - String-Literale, die bekanntermaßen auf das Symbol verweisen (z. B. Ereignisnamen, dynamische `require()`, `keyof` String-Zugriff) — markieren Sie diese, benennen Sie sie aber nicht automatisch um, da sie API-Verträge sein können
   - JSDoc-/Docstring-Verweise
   - Kommentare, die das Symbol nennen — aktualisieren Sie diese, wenn die Umbenennung den Kommentar ungültig macht

4. Führen Sie die Umbenennung an jeder identifizierten Stelle durch. Benennen Sie nicht um:
   - Teilübereinstimmungen (z. B. das Umbenennen von `user` darf nicht `username` oder `currentUser` berühren)
   - Nicht verwandte Symbole, die zufällig denselben Namen in einem anderen Geltungsbereich haben
   - Externe Dateien außerhalb des angegebenen Pfads, es sei denn, das Symbol wird exportiert und diese Dateien befinden sich im Repo

5. Überprüfen Sie nach dem Umbenennen, dass alle Importpfade und Modul-Wiederexporte intern konsistent sind.

6. Ausgabe: Gesamtzahl der aktualisierten Verweise, Liste der geänderten Dateien und alle Stellen, die zur manuellen Überprüfung markiert werden (String-Literale, dynamischer Zugriff).
