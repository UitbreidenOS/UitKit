---
description: Führe eine strukturierte Git-Bisect durch, um den Commit zu finden, der eine Regression eingeführt hat
argument-hint: "[failing test, command, or behavior description]"
---
Finde den Commit, der diese Regression eingeführt hat: $ARGUMENTS

Sie führen eine binäre Suche durch die Git-Historie durch. Seien Sie methodisch.

1. **Etablieren Sie das Test-Oracle** — bevor Sie Git anfassen, definieren Sie genau, wie man gut vs. schlecht bestimmt:
   - Bevorzugen Sie einen einzigen Befehl, der bei guten Ergebnissen mit 0 und bei schlechten mit nicht-null endet
   - Beispiele: `pytest tests/test_foo.py::test_bar`, `cargo test`, `node test.js`, `./check.sh`
   - Wenn die Regression visuell oder verhaltensbedingt ist (nicht ein Test), schreiben Sie ein Skript, das das beobachtbare Symptom überprüft
   - Das Oracle muss schnell sein (< 30s idealerweise) und deterministisch

2. **Identifizieren Sie die bekannten guten und bekannten schlechten Commits**
   - Bekannt-schlecht: normalerweise HEAD oder der erste Commit, in dem die Regression bemerkt wurde
   - Bekannt-gut: ein Commit oder Tag, in dem das Verhalten korrekt war (aktuelles Release-Tag, letzter Deploy, usw.)
   - Bestätigen Sie beide, indem Sie das Oracle gegen jeden ausführen, bevor Sie bisect starten

3. **Führen Sie die Bisect aus**
   ```
   git bisect start
   git bisect bad <bad-commit>
   git bisect good <good-commit>
   ```
   Führen Sie dann für jeden Checkout das Oracle aus und markieren Sie:
   ```
   git bisect good   # if oracle passes
   git bisect bad    # if oracle fails
   ```
   Oder automatisieren Sie es: `git bisect run <oracle-command>`

4. **Interpretieren Sie das Ergebnis** — wenn bisect beendet ist, zeigt Git auf den ersten schlechten Commit. Lesen Sie:
   - Die Commit-Nachricht und das Diff (`git show <sha>`)
   - Die spezifischen Zeilen, die sich ändern und sich auf das fehlgeschlagene Oracle beziehen
   - Den Autor und alle verknüpften Issues/PRs für Kontext

5. **Bestätigen Sie das Ergebnis** — checken Sie den Commit direkt vor dem schlechten aus, führen Sie das Oracle aus,
   bestätigen Sie, dass es bestanden wird. Checken Sie den schlechten Commit aus, bestätigen Sie, dass er fehlschlägt. Dies schließt ein fehlerhaftes Oracle aus.

6. **Bereinigung**
   ```
   git bisect reset
   ```

7. **Bericht** — fassen Sie zusammen:
   - Den SHA des angreifenden Commits und die Nachricht
   - Der spezifischen Diff-Chunk, der die Regression eingeführt hat
   - Ob die Änderung beabsichtigt war (die Behebung ist eine Reversion oder ein Folgepatch)

Wenn die Test-Suite noch nicht existiert, ist Schritt 1, das Oracle zuerst zu schreiben und dann fortzufahren.
Überspringen Sie nicht den Bestätigungsschritt — ein falsches Bisect-Ergebnis kostet mehr Zeit als es spart.
