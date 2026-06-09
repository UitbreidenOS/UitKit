# Commit-Konventionsregeln

## Geltungsbereich
Alle Git-Commits in allen Repositories.

## Regeln

1. **Folge dem Conventional Commits Format** — `<type>(<scope>): <subject>`. Der Typ ist erforderlich; der Scope ist optional, aber empfohlen. Der Subject ist imperativ, im Präsens, kleingeschrieben, ohne Punkt am Ende.

2. **Gültige Typen: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`** — `feat` ist ein benutzergerichtetes Feature, `fix` ist eine benutzergerichtete Fehlerbehebung. Tooling-, Abhängigkeits- und Konfigurationsänderungen sind `chore`. Erfinde keine Typen.

3. **Subject-Zeile unter 72 Zeichen** — Git log, GitHub und die meisten Tools schneiden bei 72 Zeichen ab. Wenn du die Änderung nicht in 72 Zeichen beschreiben kannst, ist der Commit wahrscheinlich zu groß.

4. **Verwende den Body, um zu erklären, warum, nicht was** — das Diff zeigt, was sich geändert hat. Der Body erklärt die Motivation, die Bedingung oder den Kompromiss. Weglassen des Body, wenn der Subject selbsterklärend ist.

5. **Scope sollte das Modul, Paket oder die Domain benennen** — `feat(auth): add refresh token rotation` nicht `feat(code): add thing`. Scopes machen Changelogs und `git log --grep` nützlich.

6. **Brechende Änderungen verwenden `!` und einen `BREAKING CHANGE:` Footer** — `feat(api)!: remove v1 endpoints` im Subject und einen `BREAKING CHANGE: v1 endpoints removed, migrate to v2` Footer im Body. Dies löst einen Major-Version-Bump in semantic-release aus.

7. **Eine logische Änderung pro Commit** — bündele nicht ein Feature, zwei Fehlerbehebungen und einen Dependency Bump. Wenn die Commit-Nachricht "und" enthält, sollte sie aufgeteilt werden.

8. **Committen Sie niemals mit `--no-verify`** — Pre-Commit-Hooks existieren, um Probleme zu erkennen. Das Umgehen bedeutet, Code zu pushen, der Linting-, Test- oder Formatierungsprüfungen nicht besteht. Behebe das Problem stattdessen.

9. **`fix:` Commits referenzieren das Issue oder Ticket** — `fix(payments): prevent double-charge on retry (#1234)`. Die Referenz verlinkt den Commit zum Kontext im Issue-Tracker.

10. **`revert:` Commits referenzieren den ursprünglichen Commit SHA** — `revert: feat(auth): add refresh token rotation` mit Body `Reverts commit abc1234`. Ermöglicht Bisect, korrekt zu funktionieren.

11. **Verwende keine Vergangenheitsform im Subject** — `feat: add user export` nicht `feat: added user export`. Der Subject vervollständigt den Satz "Wenn dieser Commit angewendet wird, werde ich... add user export."

12. **Quetsche Fixup-Commits vor dem Merge** — `fix typo`, `wip`, `address review comments` sind Rauschen in der permanenten Historie. Quetsche sie in den Commit, zu dem sie gehören, bevor der PR mergt.

13. **Merge-Commits sollten keine Code-Änderungen enthalten** — ein Merge-Commit, der auch einen Konflikt in der Logik behebt, ist eine versteckte Änderung. Löse Konflikte in einem separaten Commit vor dem Merge.

14. **Tag-Releases mit semantischer Versionierung** — `v1.2.3`, nicht `1.2.3`, nicht `release-jan-24`. Tooling (GitHub Releases, semantic-release, Helm Charts) erwartet das `v` Präfix.

15. **Konventionen durch Tooling durchsetzen** — verwende `commitlint` mit `@commitlint/config-conventional` in CI. Menschliche Überprüfung von Commit-Nachrichten skaliert nicht; automatisierte Durchsetzung tut es.


---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
