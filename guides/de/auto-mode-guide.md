# Claude Code Auto Mode — Tiefgehendes Referenzhandbuch (März 2026, Stabil)

Die stabile Version von Auto Mode vom März 2026 ersetzte die früheren heuristikgestützten Berechtigungsstufen durch einen trainierten ML-Klassifizierer. Das praktische Ergebnis: 84 % weniger Berechtigungsaufforderungen im Durchschnitt bei Codebases, mit einer Hard-Deny-Schicht, die immun gegen Konfigurationsüberschreibungen ist. Dieses Handbuch behandelt, wie der Klassifizierer funktioniert, alle `defaultMode`-Optionen, teamübergreifende Konfigurationsmuster, die Unterscheidung `bypassPermissions` vs `--auto`, und einen systematischen Ansatz zur Diagnose blockierter Aktionen.

---

## Der ML-Berechtigungsklassifizierer

### Was es ist

Vor März 2026 verwendete Auto Mode eine statische Regelstaffel — Lesevorgänge auto-genehmigt, Schreibvorgänge einmal abfragen, destruktive Operationen immer abfragen. Das Problem: diese Regelstaffel hatte keinen Kontext. `git push` zu einem persönlichen Fork in einem Sandbox löste die gleiche Aufforderung aus wie `git push --force origin main` auf einem gemeinsamen Repository. Jeder `npm run` rief eine Bestätigung auf, unabhängig davon, was das Skript tat.

Der Klassifizierer vom März 2026 ersetzt statische Staffeln durch ein Modell, das jeden vorgeschlagenen Toolaufzug gegen drei Achsen evaluiert:

1. **Reversibilität** — kann diese Aktion ohne Datenverlust rückgängig gemacht werden?
2. **Auswirkungsradius** — wie viele Systeme oder Mitarbeiter sind betroffen, wenn dies schiefgeht?
3. **Autorisierungssignal** — zeigt der aktuelle Sitzungskontext (Projektkonfiguration, vorherige Genehmigungen, Benutzeridentität) an, dass dies vorautorisiert wurde?

Der Klassifizierer gibt eines von drei Labels aus: `auto`, `ask` oder `deny`. Das `deny`-Label hat zwei Subtypen: `deny-soft` (durch explizite Benutzerkonfiguration überwindbar) und `deny-hard` (unter keinen Umständen überwindbar).

### Wie es die 84%-Reduktion von Aufforderungen erreicht

Die Reduktion ergibt sich hauptsächlich aus drei Verbesserungen gegenüber dem statischen Staffelsystem:

**Kontextbewusstsein für Git.** Der Klassifizierer kennt das Ziel-Remote, ob es die kanonische Upstream-Branch oder eine persönliche/Fork-Branch ist, ob `--force` vorhanden ist, ob die Branch offene PRs hat, und ob das Repository ein gemeinsames Team-Repo oder ein privater Sandbox ist. Ein `git push` zu `origin feature/my-branch` in einem Solo-Projekt wird als `auto` klassifiziert; der gleiche Befehl auf `main` in einem Repo mit Branch-Schutz wird als `ask` klassifiziert.

**Script-Fingerabdruck.** Wenn Claude `npm run <script>` vorschlägt, liest der Klassifizierer die Script-Definition aus `package.json`, bevor er den Aufzug beschriftet. Ein `build`-Script, das nur `tsc` oder `vite build` ausführt, ist `auto`. Ein `deploy`-Script mit `aws s3 sync` oder `kubectl apply` ist `ask`. Ein `purge`-Script mit `rm -rf dist/ && ...` ist `deny-soft`.

**Sitzungsspeicher.** Sobald ein Aufrufmuster in einer Sitzung genehmigt ist, werden semantisch äquivalente Aufrufe für den Rest dieser Sitzung zu `auto`. Sie genehmigen `git commit` einmal; nachfolgende `git commit`-Aufrufe werden nicht erneut abgefragt. Dies ist auf die Sitzung begrenzt — es bleibt nicht erhalten, wenn Sie es nicht in `settings.json` kodieren.

### Klassifizierer-Konfidenz und Fallback

Wenn der Konfidenzwert des Klassifizierers unter 0,72 (der Standardschwelle) fällt, wird er unabhängig von dem vorhergesagten Label zu `ask` zurückgesetzt. Sie können dies im ausführlichen Modus beobachten:

```bash
claude --auto --verbose "Refactor the auth module"
```

Eine Entscheidung mit niedriger Konfidenz erscheint in der Ausgabe als:

```
[classifier] git push origin feature/auth-refactor → ask (confidence: 0.61, fallback from: auto)
```

Die Schwelle ist konfigurierbar, aber nicht empfohlen zu ändern — sie ist der primäre Schutz vor Klassifiziererfehlern, die unbeabsichtigte Automatisierung verursachen.

---

## `defaultMode`-Optionen

`defaultMode` ist das Top-Level-`settings.json`-Feld, das steuert, wie Auto Mode sich verhält, wenn keine spezifischere Regel passt.

### Die drei Werte

```json
{
  "defaultMode": "auto" | "ask" | "deny"
}
```

**`"ask"` (das Standard)**

Jeder Toolaufzug, der nicht mit einer expliziten `allow`-Regel übereinstimmt, generiert eine Aufforderung. Dies ist die Standard-interaktive Erfahrung. Der ML-Klassifizierer ist immer noch aktiv — er informiert die Benutzeroberfläche (z. B. Vorauswahl von "Allow" für sicher als hochvertrauenswürdig eingestufte Aufrufe), aber unterdrückt die Aufforderung nicht.

**`"auto"`**

Toolaufzüge, die vom ML-Klassifizierer als `auto` klassifiziert werden, laufen ohne Aufforderung durch. Aufzüge, die als `ask` klassifiziert werden, generieren eine Aufforderung. Aufzüge, die als `deny-soft` klassifiziert werden, werden blockiert, können aber durch explizite `allow`-Regeln entsperrt werden. Aufzüge, die als `deny-hard` klassifiziert werden, werden unabhängig von jeglicher Konfiguration blockiert.

Dies ist der Modus, der für Entwickler-Workstations mit erweiterten Sitzungen vorgesehen ist.

**`"deny"`**

Nur Toolaufzüge, die von expliziten `allow`-Regeln in `settings.json` abgedeckt sind, laufen durch. Alles andere wird blockiert. Dies ist der richtige Modus für eingeschränkte Agents — CI-Pipelines, produktionsnahe Automatisierung, eingeschränkte Auftragnehmer-Umgebungen.

### Pro Bereich setzen

`defaultMode` kann an drei Bereichen gesetzt werden. Niedrigere Bereiche überschreiben höhere:

| Bereich | Datei | Typische Verwendung |
|---|---|---|
| Global | `~/.claude/settings.json` | Persönlicher Standard des Entwicklers |
| Projekt | `.claude/settings.json` | Gemeinsame Team-Baseline |
| Lokal | `.claude/settings.local.json` | Pro-Entwickler-Überschreibung, gitignoriert |

```json
// ~/.claude/settings.json — persönlicher Standard: auto für alle Projekte
{
  "defaultMode": "auto"
}
```

```json
// .claude/settings.json — Projekt-Überschreibung: ask auf diesem gemeinsamen Repo
{
  "defaultMode": "ask"
}
```

```json
// .claude/settings.local.json — Entwickler-Überschreibung: auto sogar auf gemeinsamen Repo
{
  "defaultMode": "auto"
}
```

Ein Entwickler kann seinen globalen Standard auf `"auto"` setzen, während das Projekt `"ask"` erzwingt, und seine `settings.local.json` wählt `"auto"` für die Workstation wieder ab. Dies ist das empfohlene Team-Muster.

---

## Konfigurieren von Auto Mode für Teams

### Die gestaffelte Konfigurationsstrategie

Für ein Team jeder Größe ist der empfohlene Ansatz:

1. **Projekt `.claude/settings.json`** definiert die sichere Baseline — typischerweise `"ask"` mit expliziten `allow`-Regeln für die Operationen, die jeder Entwickler ständig ausführt (read, search, test).
2. **Entwickler `~/.claude/settings.json`** setzt persönliche Präferenz — die meisten Entwickler setzen `"auto"` hier.
3. **Entwickler `.claude/settings.local.json`** behandelt projektspezifische Überschreibungen — nützlich, wenn ein Entwickler `"auto"` auf einem Projekt benötigt, das `"ask"` beauftragt.

Dies gibt Teams Auditierbarkeit (die gemeinsame Konfiguration wird eingecheckt), während Entwickler-Workflows nicht eingeschränkt werden.

### Baseline-Team-Konfiguration

Ein vernünftiger Ausgangspunkt für ein TypeScript/Node.js-Projekt:

```json
// .claude/settings.json
{
  "defaultMode": "ask",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git show*)",
      "Bash(npm run lint)",
      "Bash(npm run test*)",
      "Bash(npm run typecheck)",
      "Bash(npm run build)",
      "Bash(tsc*)",
      "Bash(find . *)",
      "Bash(ls*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push origin main*)",
      "Bash(git push origin master*)",
      "Bash(npm publish*)",
      "Bash(rm -rf*)",
      "Bash(* | sudo *)",
      "Bash(sudo *)"
    ]
  }
}
```

Diese Konfiguration bedeutet: Mit `defaultMode: "ask"` fordert Claude die meisten Dinge auf, aber die aufgelisteten Read- und Test-Operationen unterbrechen niemals den Ablauf, und die aufgelisteten destruktiven Operationen werden hart auf Projektebene geleugnet, unabhängig von den persönlichen Einstellungen des Entwicklers.

### CI/CD-Konfiguration

In CI, verwenden Sie `"deny"` als Standard und zählen Sie genau auf, was die Pipeline benötigt:

```json
// .claude/settings.ci.json (über --config-Flag übergeben)
{
  "defaultMode": "deny",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm ci)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Write(dist/*)",
      "Write(.claude/tasks.jsonl)"
    ]
  }
}
```

```bash
# In CI
claude --config .claude/settings.ci.json --dangerously-skip-permissions \
  "Work through .claude/tasks.jsonl and run the test suite"
```

`--dangerously-skip-permissions` ist in diesem Kontext sicher: der `"deny"`-Standard und die explizite Whitelist bedeuten, dass die einzigen Operationen, die Claude durchführen kann, die in der `allow`-Array sind. Das Flag entfernt nur die UI-Schicht — das Berechtigungsmodell wird immer noch durch die Konfiguration durchgesetzt.

### Onboarding neuer Teammitglieder

Beziehen Sie Folgendes in Ihre Projekt-README oder Onboarding-Dokumentation ein:

```bash
# Auto Mode global aktivieren (empfohlen für alle Entwickler)
# Zu ~/.claude/settings.json hinzufügen:
{
  "defaultMode": "auto"
}

# Die Projekt-.claude/settings.json erzwingt automatisch sichere Baselines.
# Ihre globale "auto"-Einstellung wird durch die Projektkonfiguration herunterskaliert.
# Um weiter nur für dieses Projekt zu überschreiben, erstellen Sie (gitignoriert):
touch .claude/settings.local.json
```

Ein häufiger Onboarding-Fehler: `defaultMode: "auto"` in der gemeinsamen `.claude/settings.json` des Projekts setzen. Dies zwingt jeden Entwickler in Auto Mode auf CI und in Kontexten, in denen ein Mensch möglicherweise nicht beobachtet. Halten Sie die gemeinsame Konfiguration konservativ.

---

## Hard Deny-Regeln

### Was Hard Deny bedeutet

`deny-hard`-Labels vom ML-Klassifizierer können von keiner `allow`-Regel in irgendeinem `settings.json` bei irgendeinem Bereich überschrieben werden. Sie können nicht mit `--dangerously-skip-permissions` umgangen werden. Sie können nicht mit `bypassPermissions` entsperrt werden. Sie werden in der Claude Code-Binärdatei selbst durchgesetzt, nicht in der Konfiguration.

Die stabile Version vom März 2026 wurde mit dem folgenden Hard Deny-Set verschifft:

| Muster | Grund |
|---|---|
| `Bash(* --no-verify *)` bei `git commit` oder `git push` | Umgeht Pre-Commit- und Pre-Push-Hooks, die Sicherheitskontrollen sind |
| `Bash(rm -rf /)`, `Bash(rm -rf /*)` | Dateisystem-Zerstörung |
| `Bash(dd if=* of=/dev/*)` | Raw-Festplattenschreibvorgänge |
| `Bash(mkfs*)` | Dateisystem-Erstellung (zerstörerisch für vorhandene Daten) |
| `Bash(chmod -R 777 *)` auf Systempfaden | Berechtigungssteigerung |
| Jeder Befehl, der `/etc/sudoers` oder `/etc/passwd` ändert | Berechtigungssteigerung |
| `Bash(curl * | bash)`, `Bash(wget * | bash)` | Remote-Codeausführung über Pipe |
| `Bash(python -c "import os; os.system*")` und ähnliche Eval-Ketten | Sandbox-Escape-Muster |

### Soft Deny vs Hard Deny in der Praxis

Wenn ein `deny-soft`-Aufzug blockiert wird, enthält die Ausgabe von Claude das Label und den Pfad zum Entsperren:

```
Action blocked: Bash(rm -rf dist/)
Classification: deny-soft
To allow: add "Bash(rm -rf dist/)" to permissions.allow in .claude/settings.json
```

Wenn ein `deny-hard`-Aufzug blockiert wird:

```
Action blocked: Bash(git commit --no-verify)
Classification: deny-hard
This action cannot be enabled via configuration. It is blocked at the binary level.
Reason: bypasses pre-commit hooks (security control)
```

Wenn Sie auf einen Hard Deny stoßen, der einen legitimen Use-Case blockiert (z. B. `--no-verify` während eines absichtlichen Hook-Bypasses in einem kontrollierten Skript), müssen Sie diesen Befehl selbst im Terminal ausführen, anstatt ihn Claude zu delegieren. Claude wird ihn unter keiner Konfiguration ausführen.

### Hard Deny-Labels vor der Ausführung identifizieren

Verwenden Sie `--dry-run`, um die Klassifizierer-Labels für jeden vorgeschlagenen Toolaufzug vor der Ausführung zu sehen:

```bash
claude --auto --dry-run "Clean up the build artifacts and push to the release branch"
```

Die Ausgabe enthält eine Pro-Call-Aufschlüsselung:

```
[dry-run] Bash(rm -rf dist/)         → deny-soft  (confidence: 0.97)
[dry-run] Bash(git push origin main) → ask        (confidence: 0.89)
[dry-run] Read(package.json)         → auto        (confidence: 0.99)
```

Dies ermöglicht es Ihnen, Ihre Task-Eingabeaufforderung oder `settings.json` anzupassen, bevor Sie Token für eine Sitzung ausgeben, die stecken bleibt.

---

## `bypassPermissions` vs `--auto`

Dies ist die am häufigsten missverstandene Unterscheidung in Auto Mode.

### Was jede tut

**`--auto` (oder `defaultMode: "auto"`)**

Teilt dem Klassifizierer mit, Aufforderungen für Aufzüge zu unterdrücken, die er als `auto` beschriftet. Das Berechtigungsmodell wird immer noch ausgeführt. Aufzüge mit `ask` werden immer noch aufgefordert. Aufzüge mit `deny-soft` werden immer noch blockiert (es sei denn, Sie haben eine explizite `allow`-Regel). Aufzüge mit `deny-hard` werden immer blockiert.

Auto Mode ist eine UI-Optimierung. Es entfernt Reibung für Operationen, bei denen der Klassifizierer zuversichtlich ist. Das Sicherheitsnetz bleibt intakt.

**`bypassPermissions: true` / `--dangerously-skip-permissions`**

Deaktiviert die UI-Schicht der Aufforderung vollständig. Claude führt alle Toolaufzüge aus, ohne anzuhalten und zu fragen. Aber — und dies ist die kritische Unterscheidung — `deny-hard`-Regeln werden immer noch durchgesetzt. Der Unterschied ist, dass `deny-soft`-Blöcke auch umgangen werden.

`bypassPermissions` ist ein CI/Sandbox-Flag. Es setzt voraus, dass Sie Ihre Sicherheitseinschränkungen vollständig in `deny`-Regeln und dem Hard Deny-Set kodiert haben. Wenn Sie dies nicht korrekt getan haben, kann Claude destruktive Operationen ohne Bestätigung ausführen.

### Das richtige mentale Modell

```
User prompt
    │
    ▼
ML Classifier
    │ auto ──────────────────────────────────────────── execute (no prompt)
    │ ask  ──── [bypassPermissions?] ──── yes ────────── execute (no prompt)
    │            │                                        │
    │            no                                       │
    │            │                                        │
    │            ▼                                        │
    │         prompt user ──── approved ──────────────── execute
    │ deny-soft ── [explicit allow rule?] ── yes ──────── execute (no prompt)
    │               │                                     │
    │               no                                    │
    │               ▼                                     │
    │            blocked (overridable via config)         │
    │ deny-hard ─────────────────────────────────────────── always blocked
```

### Wann jede zu verwenden ist

Verwenden Sie `--auto` (oder `defaultMode: "auto"`), wenn:
- Ein Mensch ist verfügbar, um gelegentliche `ask`-Aufforderungen zu beantworten
- Sie einen glatteren Ablauf ohne Kompromisse beim Sicherheitsnetz wünschen
- Laufen auf einer Entwickler-Workstation

Verwenden Sie `--dangerously-skip-permissions`, wenn:
- Laufen in einer sandgekapstelten CI-Umgebung mit einer vorkonfigurierten `deny`-Liste
- Die Umgebung ist wegwerfbar (Container, VM, ephemerer Workspace)
- Sie haben verifiziert, dass die `settings.json` `deny`-Regeln alle destruktiven Operationen abdecken
- Kein Mensch beobachtet und Sie benötigen vollständig nicht-interaktive Ausführung

Verwenden Sie niemals `--dangerously-skip-permissions` auf einer Entwickler-Workstation ohne eine gesperrte `deny`-Liste. Die Kombination von `defaultMode: "auto"` und `--dangerously-skip-permissions` ohne explizite `deny`-Regeln ist effektiv kein Berechtigungsmodell.

### Praktisches Beispiel: Der Unterschied zählt

```bash
# Diese Sitzung wird bei "git push origin main" pausieren und auf Genehmigung warten
claude --auto "Implement the feature from TICKET-442 and push when tests pass"

# Diese Sitzung wird NICHT pausieren — sie wird ohne Bestätigung zu main pushen
# Sicher nur, wenn .claude/settings.json "Bash(git push origin main)" leugnet
claude --dangerously-skip-permissions "Implement the feature from TICKET-442 and push when tests pass"
```

Für die meisten Entwicklungs-Workflows ist `--auto` die richtige Wahl. `--dangerously-skip-permissions` ist für Pipelines.

---

## Troubleshooting blockierter Aktionen

### Schritt 1: Die Klassifizierung identifizieren

Führen Sie mit `--verbose` aus, um die Klassifizierer-Ausgabe für den blockierten Aufruf zu sehen:

```bash
claude --auto --verbose "Run the deployment script"
```

Suchen Sie nach Zeilen wie:

```
[classifier] Bash(./scripts/deploy.sh) → deny-soft (confidence: 0.94)
[classifier] reason: script contains 'kubectl apply' — blast radius: cluster
```

Wenn die Ausgabe keine Klassifizierer-Zeilen enthält, prüfen Sie, dass `--verbose` aktiv ist und dass die Blockierung auf der Berechtigungsschicht (nicht einen Laufzeitfehler) stattfindet.

### Schritt 2: Überprüfen Sie auf Script-Fingerabdruck-Missklassifizierung

Der Klassifizierer liest Script-Inhalte aus `package.json` und häufigen Script-Dateien, kann aber fehlklassifizieren, wenn:

- Das Script ein Wrapper ist, der ein anderes Script dynamisch aufruft
- Der Script-Pfad wird zur Laufzeit konstruiert (z. B. `bash ${SCRIPT_DIR}/run.sh`)
- Die Script-Datei ist außerhalb des Projektstammverzeichnisses

Zur Diagnose: Führen Sie `claude --auto --dry-run` aus und inspizieren Sie den Konfidenzwert. Niedrige Konfidenz (< 0,72) löst einen Fallback zu `ask` oder `deny-soft` aus. Wenn ein Script fehlklassifiziert wird, fügen Sie eine explizite `allow`-Regel in `settings.json` hinzu:

```json
{
  "permissions": {
    "allow": [
      "Bash(./scripts/deploy-staging.sh)"
    ]
  }
}
```

Anmerkung: die `allow`-Regel muss mit dem genauen Befehlsstring übereinstimmen, den Claude produzieren wird. Verwenden Sie `--dry-run`, um den genauen String vor dem Schreiben der Regel zu sehen.

### Schritt 3: Unterscheiden Sie Soft Deny von Hard Deny

Die Ausgabe von Claude gibt explizit an, ob eine Blockierung soft oder hard ist. Wenn soft, teilt die Ausgabe Ihnen die genaue `allow`-Regel mit. Wenn hard, keine Konfigurationsänderung hilft — Sie müssen den Befehl selbst ausführen.

Häufige Missidentifikation: Entwickler nehmen an, dass `--force`-Commits hart geleugnet werden. Das tun sie nicht. `git commit --amend` ist `deny-soft`. `git commit --no-verify` ist `deny-hard`. Die Unterscheidung ist: `--amend` schreibt Geschichte um (reversible mit Reflog), während `--no-verify` Sicherheits-Hooks umgeht (der Bypass selbst ist das Problem, nicht der Commit).

### Schritt 4: Überprüfen Sie die Einstellungsbereich-Vorrang

Ein häufiges Problem: Ein Entwickler fügt eine `allow`-Regel zu `settings.local.json` hinzu, aber die Projekt-`settings.json` hat eine `deny`-Regel für das gleiche Muster. `deny`-Regeln in niedrigeren Bereichsdateien überschreiben keine `deny`-Regeln in höheren Bereichsdateien — aber `allow`-Regeln bei jedem Bereich können `deny-soft`-Regeln aus höheren Bereichen überschreiben, es sei denn, die Projektkonfiguration verwendet `forcePermissions`.

Überprüfen Sie die wirksame Konfiguration:

```bash
claude --print-config
```

Die Ausgabe zeigt die zusammengeführte Berechtigungsmenge mit Quellanmerkungen:

```
permissions.allow:
  "Read"                          [global]
  "Bash(npm run test)"            [project]
  "Bash(./scripts/deploy.sh)"     [local]

permissions.deny:
  "Bash(git push --force*)"       [project] [forced]
  "Bash(rm -rf*)"                 [project] [forced]
```

Regeln gekennzeichnet mit `[forced]` können von niedrigeren Bereich-`allow`-Regeln nicht überschrieben werden. Der Projekt-Administrator setzt diese mit dem `forcePermissions`-Schlüssel:

```json
// .claude/settings.json
{
  "forcePermissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(npm publish*)"
    ]
  }
}
```

### Schritt 5: Klassifizierer-Schwellen-Tuning

Wenn der Klassifizierer konsistent `ask`-Aufforderungen auf Operationen anwendet, die Sie als sicher erachten — und die Konfidenzwerte liegen um 0,65–0,75 — können Sie die Konfidenz-Schwelle auf eigenes Risiko senken:

```json
// ~/.claude/settings.json
{
  "classifier": {
    "confidenceThreshold": 0.65
  }
}
```

Dies ist eine persönliche Einstellung, nicht eine Team-Einstellung. Setzen Sie sie nicht in die Projektkonfiguration. Niedrigere Schwellen bedeuten mehr Automatisierung, aber auch mehr Potenzial für fehlklassifizierte Aufzüge, um stillschweigend ausgeführt zu werden.

### Schritt 6: Debug mit Sitzungstranskripten

Jede Claude Code-Sitzung schreibt ein Transkript zu `~/.claude/sessions/`. Für eine blockierte oder verzögerte Auto Mode-Sitzung überprüfen Sie das neueste Transkript:

```bash
ls -t ~/.claude/sessions/ | head -1 | xargs -I{} cat ~/.claude/sessions/{}
```

Suchen Sie nach `[blocked]`-Einträgen mit der angehängten Klassifizierer-Ausgabe. Dies gibt Ihnen den genauen Aufzug-String, das Label und den Konfidenzwert — die drei Eingaben, die Sie benötigen, um eine gezielte `allow`-Regel zu schreiben oder eine Missklassifizierung zu diagnostizieren.

### Häufige Muster und Fixes

| Symptom | Wahrscheinliche Ursache | Fix |
|---|---|---|
| `npm run deploy` fordert immer auf | Script fingerabgedruckt als Bereitstellung | Explizite `allow`-Regel für das exakte Script hinzufügen |
| `git push` zu persönlichem Fork fordert auf | Klassifizierer kann Fork-Status nicht verifizieren | `allow` für dieses spezifische Remote-Muster hinzufügen |
| Alles fordert trotz `defaultMode: "auto"` auf | Projekt-`settings.json` hat `defaultMode: "ask"` und `forcePermissions` | Überprüfen Sie `--print-config` auf erzwungene Regeln |
| Hard Deny auf einem Befehl, den Sie kontrollieren | Befehl passt zu einem Hard Deny-Muster | Strukturieren Sie den Befehl um, um das Muster zu vermeiden |
| Sitzung steckt stillschweigend fest | `ask`-Aufforderung ausgestellt, aber Terminal nicht beobachtet | Verwenden Sie `--max-turns`, um den Ausstieg zu erzwingen; überprüfen Sie Transkript |
| Niedrige Konfidenz bei allen Aufzügen | Projekt verwendet ungewöhnliches Werkzeug, das der Klassifizierer nicht kennt | Explizite `allow`-Regeln für Ihre Toolchain hinzufügen |

---

## Referenz: Wichtige Einstellungsfelder

```json
{
  "defaultMode": "auto",                    // auto | ask | deny
  "permissions": {
    "allow": ["..."],                       // patterns that always proceed
    "deny": ["..."]                         // patterns that are blocked (soft)
  },
  "forcePermissions": {
    "deny": ["..."]                         // deny rules that lower scopes cannot override
  },
  "classifier": {
    "confidenceThreshold": 0.72,            // below this → fallback to ask
    "verbose": false                        // log classifier decisions to console
  },
  "maxTurns": 200,                          // hard cap on turns per session
  "bypassPermissions": false               // set true only in sandboxed CI
}
```

---

## Quick-Start-Checkliste

- [ ] Setzen Sie `defaultMode: "auto"` in `~/.claude/settings.json` für lokale Entwicklung
- [ ] Fügen Sie explizite `deny`-Regeln für destruktive Operationen in Projekt-.claude/settings.json hinzu
- [ ] Verwenden Sie `forcePermissions.deny` für Regeln, die auch gelten müssen, wenn Entwickler überschreiben
- [ ] Testen Sie Ihre Konfiguration mit `--dry-run`, bevor Sie eine lange autonome Sitzung ausführen
- [ ] Verwenden Sie `--dangerously-skip-permissions` nur in CI mit einer gesperrten `deny`-Liste
- [ ] Überwachen Sie die `--print-config`-Ausgabe beim Onboarding neuer Entwickler, um Bereichskonflikte zu erkennen
- [ ] Überprüfen Sie `~/.claude/sessions/`-Transkripte nach jeglicher festgefahrener Sitzung

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
