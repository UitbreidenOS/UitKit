---
description: Veraltete lokale und Remote-Branches identifizieren und auflisten, die sicher gelöscht werden können
argument-hint: "[remote]"
---
Bestimmen Sie das Standard-Remote. Verwenden Sie $ARGUMENTS, falls angegeben, sonst erkennen Sie es aus `git remote show` oder fallen Sie auf `origin` zurück.

Führen Sie die folgenden Befehle aus und erfassen Sie ihre Ausgabe:
- `git branch -vv` — lokale Branches mit Upstream-Tracking-Info
- `git branch -r` — Remote-Branches
- `git log --oneline -1 HEAD` — bestätigen Sie den HEAD-Status
- `git for-each-ref --format='%(refname:short) %(upstream:track) %(committerdate:relative) %(subject)' refs/heads` — Branch-Metadaten

Klassifizieren Sie jeden lokalen Branch in eine der folgenden Kategorien:

**Sicher zu löschen:**
- Tracking-Branch, bei dem das Upstream `[gone]` ist (Remote-Branch gelöscht)
- Vollständig in den Standard-Branch gemergt (`git branch --merged <default>`)
- Letzter Commit älter als 90 Tage ohne Open-PR-Zuordnung

**Möglicherweise veraltet — zuerst überprüfen:**
- Letzter Commit vor 30–90 Tagen
- Nicht gemergt, kein Upstream-Tracking gesetzt
- Name passt zu einem Muster, das auf einen kurzlebigen Branch hindeutet (`fix/`, `hotfix/`, `wip/`, `tmp/`, `test-`)

**Behalten:**
- Aktueller HEAD-Branch
- `main`, `master`, `develop`, `staging`, `release/*` standardmäßig
- Alle Branches mit Commits, die nicht vom Standard-Branch erreichbar sind und deren letzter Commit innerhalb der letzten 30 Tage liegt

Geben Sie drei Abschnitte aus mit Branch-Name, Datum des letzten Commits und Grund für die Klassifizierung.

Geben Sie dann die exakten Befehle zum Löschen der sicheren Branches aus:
```
# Local
git branch -d <branch> ...

# Remote (if applicable)
git push <remote> --delete <branch> ...
```

Verwenden Sie `-d` (sicheres Löschen), nicht `-D`, es sei denn, der Branch ist bereits bestätigt gemergt. Führen Sie keine Löschbefehle aus — geben Sie sie nur aus, damit der Benutzer sie überprüfen und ausführen kann.
