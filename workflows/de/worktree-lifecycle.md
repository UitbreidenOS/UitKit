# Worktree-Lebenszyklus

Kompletter Vier-Befehls-Workflow für Verwaltung paralleler Claude Code-Arbeit mit Git Worktrees. Jeder Worktree ist ein isoliertes Arbeitsverzeichnis auf seinem eigenen Branch — mehrere Claude-Sitzungen können gleichzeitig ausgeführt werden, ohne sich gegenseitig zu stören.

---

## Wann es verwenden

- Laufend mehrere Claude Code-Sitzungen in Parallele auf dem gleichen Repo
- Isolierung experimenteller Arbeit von einem stabilen Main-Branch
- Überprüfung der Arbeit eines anderen Branch, ohne deine aktive Sitzung zu stören
- Jeder Workflow, wo du saubere Branch-Isolierung ohne Overhead mehrerer Repo-Klone möchtest

---

## Befehle

### Init — erstelle einen Worktree aus einer Aufgabenbeschreibung

**Eingabe:** Aufgabenbeschreibung (freitext)

**Schritte:**
1. Leite einen kebab-case Branch-Namen von der Aufgabenbeschreibung ab (entferne Artikel, verbinde bedeutende Wörter mit `-`, max 5 Wörter)
2. Ausführen:
   ```bash
   git worktree add -b {branch} .worktrees/{branch} main
   ```
3. Erstelle `.worktree-task.md` im neuen Worktree:
   ```markdown
   # Aufgabe
   {originale Aufgabenbeschreibung}

   ## Branch
   {branch}

   ## Erstellt
   {ISO-Zeitstempel}
   ```
4. Gib den Start-Befehl aus:
   ```bash
   cd .worktrees/{branch} && claude
   ```

**Beispiel:**
```
Init: "Stripe Webhook-Behandlung für Abonnement-Ereignisse hinzufügen"
Branch: add-stripe-webhook-subscription
Worktree: .worktrees/add-stripe-webhook-subscription
```

---

### Check — Status aller aktiven Worktrees

**Schritte:**
1. Ausführung `git worktree list --porcelain` und Parse-Output
2. Für jeden Worktree (ausschließlich main):
   - Branch-Name und HEAD-Commit-Hash + Nachricht
   - Ob `.worktree-task.md` existiert (zeigt aktive verwaltete Aufgabe an)
   - `git diff --stat {main}...{branch}` — Dateien geändert seit Branch-Erstellung
3. Compact-Tabelle ausgeben:

```
Branch                              Letzter Commit             Task-Datei  Änderungen
add-stripe-webhook-subscription     abc1234 add webhook        ja          3 Dateien (+180/-0)
refactor-auth-middleware            def5678 wip                ja          7 Dateien (+92/-61)
hotfix-null-pointer                 ghi9012 fix null           nein        1 Datei  (+3/-1)
```

---

### Deliver — commit, push und erstelle PR von einem Worktree

**Vorbedingung:** `.worktree-task.md` muss im aktuellen Verzeichnis existieren (bestätigt, dass du in einem verwalteten Worktree bist, nicht main).

**Schritte:**
1. Lies Aufgabenbeschreibung von `.worktree-task.md`
2. Entferne `.worktree-task.md` — es ist ein Arbeits-Artefakt, kein Projekt-Code und sollte nicht in der PR-Differenz erscheinen
3. Stage alle Änderungen: `git add -A`
4. Bestimme den konventionellen Commit-Typ aus der Differenz:
   - Nur neue Dateien → `feat:`
   - Löschungen und Änderungen → `fix:` oder `refactor:`
   - Config/Tooling nur → `chore:`
5. Leite Commit-Nachricht von der Aufgabenbeschreibung ab (imperativ, ≤72 Zeichen)
6. Commit: `git commit -m "{type}: {message}"`
7. Push: `git push -u origin {branch}`
8. Erstelle PR:
   ```bash
   gh pr create --title "{type}: {message}" --body "{task description}"
   ```
9. Gib PR-URL aus

---

### Cleanup — entferne verschmolzene Worktrees

**Schritte:**
1. Liste alle verwalteten Worktrees auf: `git worktree list`
2. Für jeden Branch, überprüfe, ob er zu main verschmolzen ist: `git branch --merged main`
3. Melde, was entfernt werden würde (zeige das immer vor dem Handeln)

**Flaggen:**
- `--dry-run` — liste verschmolzene Worktrees und Branches auf, ergreife keine Maßnahmen
- `--force-all` — fordere Bestätigung an, dann entferne alle verschmolzenen Worktrees:
  ```bash
  git worktree remove .worktrees/{branch}
  git branch -d {branch}
  ```

**Dry-Run-Ausgabe:**
```
Würde entfernen:
  .worktrees/add-stripe-webhook-subscription  (verschmolzen zu main bei abc1234)
  .worktrees/hotfix-null-pointer              (verschmolzen zu main bei def5678)

Führe mit --force-all aus zum Entfernen.
```

---

## Verzeichnis-Konventionen

```
.worktrees/           # alle verwalteten Worktrees leben hier
  {branch-name}/      # ein Verzeichnis pro Worktree
    .worktree-task.md # von Init erstellt, von Deliver entfernt
```

Füge `.worktrees/` zu `.gitignore` hinzu — diese Verzeichnisse sind lokaler Dateisystem-Zustand, kein verfolgter Inhalt.

---

## Notizen

- `.worktree-task.md` ist das einzige Signal, dass ein Worktree von diesem Workflow verwaltet wird. Worktrees, die manuell erstellt sind (ohne Init), zeigen "keine Task-Datei" in Check-Ausgabe und werden von Cleanup übersprungen, es sei denn, `--force-all` wird übergeben.
- Führe niemals `git worktree remove` auf einem Worktree mit unverpflichteten Änderungen aus, es sei denn, du beabsichtigst, sie zu verwerfen. Check zeigt immer die Differenz-Statistik vor jeder destruktiven Aktion.
- Worktrees teilen das gleiche `.git`-Verzeichnis wie das Haupt-Repo. Operationen wie `git fetch` und `git log` in jedem Worktree sehen alle Branches.

---
