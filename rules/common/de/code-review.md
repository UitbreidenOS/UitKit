# Code-Review-Regeln

## Anwendung
Alle Pull-Request-Reviews — Verhalten von Autor und Reviewer.

## Regeln

### Als Autor

1. **PRs klein und fokussiert halten** — eine logische Änderung pro PR. Ein PR, der Authentifizierung, Abrechnung und Routing gleichzeitig berührt, sind drei PRs. Kleinere PRs erhalten bessere Reviews, werden schneller zusammengeführt und können sauber zurückgesetzt werden.

2. **PR-Beschreibung für den Reviewer, nicht für dich selbst schreiben** — erklären, was sich geändert hat, warum es sich geändert hat und welches Risiko damit verbunden ist. Ein Testplan einbeziehen. "Bug behoben" ist keine Beschreibung.

3. **Selbstbewertung vor Anforderung der Überprüfung** — lies dein eigenes Diff, als würde es nicht von dir stammen. Tippfehler, Debug-Artefakte, auskommentierter Code und fehlende Edge Cases vor dem Fragen anderer abfangen.

4. **Auf jeden Kommentar antworten** — bestätigen, auflösen oder diskutieren. Schweigen signalisiert Desinteresse. Wenn du nicht einverstanden bist, sage dies mit Begründung. Wenn du zustimmst, wende die Änderung an und markiere sie als gelöst.

5. **Nicht offensichtliche Entscheidungen kommentieren** — wenn du etwas Überraschendes getan hast und der Grund nicht in einem Code-Kommentar erfasst ist, erklär ihn in der PR-Beschreibung oder als Antwort auf die erwartete Frage "warum?".

### Als Reviewer

6. **Blockierer von Vorschlägen unterscheiden** — Kommentare deutlich kennzeichnen: `blocking:`, `nit:`, `question:`, `suggestion:`. Reviewer, die alles als blockierend markieren, verlangsamen die Bereitstellung. Blockierung für Korrektheit und Sicherheit reservieren.

7. **Die Absicht überprüfen, nicht nur die Zeilen** — erreicht die Änderung das, was die PR-Beschreibung verspricht? Gibt es Edge Cases, die die Tests nicht abdecken? Wäre ich komfortabel damit, diesen Code zu besitzen?

8. **Vorschlagen, nicht diktieren** — Style-Kommentare sollten auf eine dokumentierte Regel verweisen. "Ich hätte es so gemacht" ist kein blockierender Kommentar, es sei denn, die Regel existiert. Style ohne Regel ist Vorliebe.

9. **Genehmigen, wenn es gut genug ist, nicht perfekt** — die Kosten eines blockierten PR multiplizieren sich. Wenn verbleibende Nits gering und nicht blockierend sind, genehmige und lasse den Autor entscheiden. Perfekt ist der Feind des Versendens.

10. **Nicht veraltete PRs ohne Bestätigung des Rebase überprüfen** — wenn ein PR seit der letzten Überprüfung rebased wurde, vermerke es und überprüfe das Diff von vorne. Veraltete Reviews erzeugen falsches Vertrauen.

### Prozess

11. **Erste Überprüfung innerhalb eines Arbeitstages** — PRs verfallen. Der Kontext verblasst. Verzögerte Reviews demotivieren Autoren und blockieren abhängige Arbeiten. Teamerwartungen setzen und einhalten.

12. **Review-by-Committee auf jedem PR vermeiden** — ein erforderlicher Reviewer ist normalerweise ausreichend. Mehrere erforderliche Genehmigungen für jede Änderung erzeugen Engpässe. Mehrfach-Reviewer-Anforderungen für hochriskante Pfade (Authentifizierung, Zahlungen, Datenmigration) reservieren.

13. **Automatisierte Signale vor der Überprüfung überprüfen** — CI muss vor der menschlichen Überprüfung bestehen. Wenn Tests ausfallen oder das Linting kaputt ist, gib den PR an den Autor zurück. Überprüfe keinen Code, den die Maschine bereits abgelehnt hat.

14. **Nicht genehmigen, was du nicht verstehst** — "LGTM" auf Code, den du nicht erklären kannst, ist eine Haftung. Stelle Fragen, bis du die Änderung verstehst. Eine Frage ist kein Block.

15. **Muster dokumentieren, die es wiederholt sich lohnen** — wenn eine Überprüfung ein Muster ans Licht bringt, das breit durchgesetzt werden sollte, behebe es nicht nur in diesem PR. Melde eine Regel, füge ein Lint hinzu oder aktualisiere den Coding-Leitfaden.


---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen AI-Produkte und B2B-Lösungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
