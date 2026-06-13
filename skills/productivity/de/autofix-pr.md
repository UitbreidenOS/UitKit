# /autofix-pr — Automatische Anwendung von PR-Fixes

## Wann aktivieren
Benutzer möchte, dass Claude Code-Review-Vorschläge automatisch ohne manuelle Eingriffe anwendet; Benutzer erwähnt `/autofix-pr`; Benutzer möchte Hands-off-PR-Verfeinerung nach dem Pushen von Code und Empfangen von Reviewer-Kommentaren.

## Wann NICHT verwenden
Benutzer möchte jede Änderung vor der Anwendung überprüfen; Repos ohne GitHub-Integration; PRs mit komplexen architektonischen Review-Kommentaren, die Urteilsvermögen erfordern; Situationen, bei denen auto-commits zum Branch die Team-Richtlinie verletzen würden.

## Anweisungen

**Was es macht :**
`/autofix-pr` ermöglicht die automatische Anwendung von nicht-destruktiven PR-Review-Vorschlägen. Claude liest die offenen Review-Kommentare auf dem aktuellen PR und wendet Fixes an, die die Auto-Apply-Kriterien erfüllen, ohne auf manuelle Bestätigung zu warten.

**Was Claude automatisch anwendet :**
- Formatierungsfehlerbehebungen (Einrückung, Leerzeichen am Ende, Leerzeilen)
- Tippfehlerkorrektionen in Code und Kommentaren
- Einfache Variablenumbenennungen, wo der Reviewer den neuen Namen explizit angegeben hat
- Offensichtliche Refaktorisierungen mit klarer, eindeutiger Beschreibung ("extrahiere dies in eine Helper-Funktion namens X")
- Linting-Regel-Fixes (ungenutzte Importe, fehlende Semikola, const vs let)

**Was Claude NICHT automatisch anwendet :**
- Architektonische Änderungen (Dateien verschieben, Module umstrukturieren)
- Logik-Umschreibungen oder Algorithmus-Änderungen
- Alles, das Urteil über Kompromisse erfordert
- Vorschläge, die als Fragen formuliert sind ("vielleicht erwägen…?")
- Mehrdeutige Vorschläge, bei denen mehrere gültige Interpretationen existieren

**Umgang mit mehrdeutigen Kommentaren :**
Claude zeigt dir den Kommentar, erklärt, warum er mehrdeutig ist, und fragt vor der Anwendung. Du antwortest, Claude wendet an, wechselt zum nächsten.

**Anforderungen :**
- Repo muss mit Claude Code verbunden sein (gleiche Session, die PR öffnete, oder Session im gleichen lokalen Repo)
- GitHub-Integration muss aktiv sein
- PR muss offen sein und Reviewer-Kommentare haben

**Sichtbarkeit :**
Jeder automatisch angewendete Fix erscheint als Commit in der PR-Timeline mit einer Notiz, dass er automatisch angewendet wurde. Reviewer sehen genau, was sich geändert hat und warum.

**Umschalten :**
- `/autofix-pr` — für diese Session aktivieren
- `/autofix-pr off` — deaktivieren

## Beispiel

PR hat 12 Review-Kommentare. 9 sind: "verwende `const` statt `let`", "füge fehlende Semikolons auf Zeile 47 hinzu", "Variablenname sollte `userId` sein, nicht `user_id`", "entferne ungenutzte Importe". Claude wendet automatisch alle 9 an, committed sie als einen einzigen Aufräum-Commit, und zeigt die verbleibenden 3 architektonischen Kommentare zur manuellen Überprüfung: "Die folgenden 3 Kommentare erfordern deine Eingabe, bevor ich sie anwenden kann."

---
