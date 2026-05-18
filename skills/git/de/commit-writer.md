---
name: commit-writer
description: "Write conventional commit messages from staged diff — type, scope, subject, body, breaking changes"
---

> 🇩🇪 Deutsche Version. [Englische Version](../commit-writer.md).

# Skill: Commit-Nachrichten schreiben

## Wann aktivieren
- Sie haben gestagede Änderungen und benötigen eine gut strukturierte Commit-Nachricht
- Schreiben von Commit-Nachrichten in einem Team, das Conventional Commits verwendet
- Generieren von Commit-Nachrichten, die in automatisierte Changelogs einfließen
- Sie möchten, dass Claude das Diff analysiert und den richtigen Commit-Typ vorschlägt

## Wann NICHT verwenden
- Work in Progress / Entwurfs-Commits — verwenden Sie `git commit -m "wip"` und führen Sie später einen Squash durch
- Merge-Commits — lassen Sie git diese generieren
- Revert-Commits — `git revert` generiert die Nachricht automatisch

## Anweisungen

### Format der Conventional Commits
```
<type>(<scope>): <subject>

[body]

[footer]
```

**Typen:**

| Typ | Wann verwenden |
|-----|----------------|
| `feat` | Neue Funktion oder Fähigkeit, die für Benutzer sichtbar ist |
| `fix` | Fehlerbehebung |
| `docs` | Nur Dokumentation — keine Codeänderung |
| `style` | Formatierung, Leerzeichen — keine Logikänderung |
| `refactor` | Code-Umstrukturierung ohne Verhaltensänderung |
| `perf` | Leistungsverbesserung |
| `test` | Hinzufügen oder Korrigieren von Tests |
| `chore` | Build, Tooling, Dependency-Updates |
| `ci` | CI/CD-Konfigurationsänderungen |
| `revert` | Macht einen früheren Commit rückgängig |

**Regeln:**
- Betreff: Imperativ-Modus, Kleinbuchstaben, kein Punkt am Ende, max. 72 Zeichen — "add user auth" nicht "Added user auth"
- Scope: optional, in Klammern — das betroffene Modul, Paket oder der Dateibereich
- Textkörper: erklären Sie das *Warum*, nicht das *Was* (das Diff zeigt das Was)
- Breaking Changes: fügen Sie `BREAKING CHANGE:` im Footer hinzu, oder `!` nach dem Typ (`feat!:`)

### Arbeitsablauf

Führen Sie dies vor dem Aufrufen des Skills aus:
```bash
git diff --staged   # sehen, was Sie committen werden
```

Dann Claude anfragen:
```
Write a conventional commit message for these staged changes:

[paste git diff --staged output, or describe what changed]
```

Claude wird:
1. Den primären Änderungstyp identifizieren
2. Den Scope aus den geänderten Dateien ableiten
3. Eine Betreffzeile entwerfen (Imperativ, ≤72 Zeichen)
4. Einen Textkörper hinzufügen, wenn die Änderung eine Erklärung benötigt
5. Breaking Changes markieren, falls vorhanden

### Commits mit mehreren Änderungen
Wenn das Diff mehrere logische Änderungen enthält, wird Claude entweder:
- Einen Commit schreiben, der die primäre Änderung abdeckt (andere im Textkörper erwähnen)
- Vorschlagen, in separate Commits mit `git add -p` aufzuteilen

### Ausgabeformat
Claude gibt die Commit-Nachricht bereit zum Kopieren und Einfügen aus:
```bash
git commit -m "feat(auth): add JWT refresh token rotation

Implement sliding session windows by rotating refresh tokens on each use.
Previous tokens are invalidated immediately after rotation.

Closes #234"
```

## Beispiel

**Gestagedes Diff enthält:**
- `src/auth/tokens.py` — neue Funktion `rotate_refresh_token()`
- `tests/test_tokens.py` — Tests für die neue Funktion
- `CHANGELOG.md` — aktualisiert

**Erwartete Ausgabe:**
```
feat(auth): add refresh token rotation

Rotate refresh tokens on each use to implement sliding session windows.
Previous tokens are invalidated immediately, reducing the window for
token theft after a session is compromised.

Closes #234
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
