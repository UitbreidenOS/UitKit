---
description: Führe eine strukturierte git bisect durch, um den Commit zu finden, der eine Regression verursacht hat
argument-hint: "[fehlgeschlagener Test, Befehl oder Verhaltensbeschreibung]"
---
Finde den Commit, der diese Regression verursacht hat: $ARGUMENTS

Du führst eine binäre Suche über die git-Historie durch. Sei methodisch.

1. **Definiere das Test-Orakel** — bevor du git anfasst, definiere genau, wie man gut von schlecht unterscheidet:
   - Bevorzuge einen einzelnen Befehl, der bei gut mit 0 und bei schlecht mit nicht-null endet
   - Beispiele: `pytest tests/test_foo.py::test_bar`, `cargo test`, `node test.js`, `./check.sh`
   - Falls die Regression visuell oder verhaltensbedingt ist (kein Test), schreibe ein Skript, das das beobachtbare Symptom prüft
   - Das Orakel muss schnell (< 30s idealerweise) und deterministisch sein

2. **Identifiziere die bekannt-guten und bekannt-schlechten Commits**
   - Bekannt-schlecht: normalerweise HEAD oder der erste Commit, wo die Regression bemerkt wurde
   - Bekannt-gut: ein Commit oder Tag, wo das Verhalten korrekt war (aktueller Release-Tag, letzter Deploy, etc.)
   - Bestätige beide, indem du das Orakel gegen jeden testst, bevor du bisect startest

3. **Führe die bisect aus**
   ```
   git bisect start
   git bisect bad <bad-commit>
   git bisect good <good-commit>
   ```
   Dann für jeden Checkout das Orakel ausführen und markieren:
   ```
   git bisect good   # wenn Orakel erfolgreich ist
   git bisect bad    # wenn Orakel fehlschlägt
   ```
   Oder automatisiere es: `git bisect run <oracle-command>`

4. **Interpretiere das Ergebnis** — wenn bisect fertig ist, zeigt git auf den ersten schlechten Commit. Lese:
   - Die Commit-Nachricht und das Diff (`git show <sha>`)
   - Die spezifischen Zeilen, die geändert wurden und zur fehlgeschlagenen Oracle-Ausführung führen
   - Den Autor und alle verknüpften Issues/PRs für Kontext

5. **Bestätige das Ergebnis** — checke den Commit kurz vor dem schlechten aus, führe das Orakel aus,
   bestätige, dass es erfolgreich ist. Checke den schlechten Commit aus, bestätige, dass er fehlschlägt. Dies schließt ein fehleranfälliges Orakel aus.

6. **Räume auf**
   ```
   git bisect reset
   ```

7. **Berichte** — fasse zusammen:
   - Die offendierenden Commit-SHA und -Nachricht
   - Das spezifische Diff-Chunk, das die Regression verursacht hat
   - Ob die Änderung beabsichtigt war (die Lösung ist ein Revert oder ein Follow-up-Patch)

Falls die Test-Suite noch nicht existiert, besteht Schritt 1 darin, zuerst das Orakel zu schreiben, dann fortzufahren.
Überspringe nicht den Bestätigungsschritt — ein falsches Bisect-Ergebnis kostet mehr Zeit, als es spart.
