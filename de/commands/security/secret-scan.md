---
description: Gescannte die Codebasis auf Geheimnisse, Anmeldedaten und empfindliche Werte, die in der Versionskontrolle oder bereitgestellten Artefakten nicht vorkommen dürfen
argument-hint: "[path or git-ref]"
---
Gescannte `$ARGUMENTS` (Standard: gesamtes Repo einschließlich Git-Verlauf) auf Geheimnisse, Anmeldedaten und empfindliche Werte, die nicht in der Quellkontrolle oder bereitgestellten Artefakten vorkommen dürfen.

**Phase 1 — Mustergescannte (Quelldateien)**

Suche in allen nicht-binären Dateien nach:
- API-Schlüssel und Token: Muster wie `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, UUIDs als Geheimnisse
- Private Schlüssel: PEM-Header (`-----BEGIN * PRIVATE KEY-----`), SSH-Private-Key-Blöcke
- Passwörter: Variablen mit Namen `password`, `passwd`, `pwd`, `secret`, `token`, `api_key` mit zugewiesenen String-Literalen
- Verbindungszeichenfolgen: DSNs mit eingebetteten Anmeldedaten (`postgres://user:pass@host`)
- JWT-Geheimnisse: hardcodierte Signaturschlüssel
- OAuth-Geheimnisse: `client_secret`-Literale
- Cloud-Provider-Anmeldedaten: AWS, GCP, Azure, Terraform, Kubernetes-Dienstkonto-Token
- Webhook-URLs mit eingebetteten Token (Slack, Discord, GitHub)
- `.env`-Dateiinhalte versehentlich eingecheckt

**Phase 2 — Git-Verlaufsgescannte** (falls sich in einem Git-Repo befindet)

Führe aus: `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Überprüfe aktuelle Commits auf versehentliche Secret-Commits, die möglicherweise "gelöscht" wurden, aber im Verlauf verbleiben.

**Phase 3 — Konfigurations- und Infrastrukturdateien**

Untersuche: `docker-compose.yml`, Kubernetes-Manifeste, Helm-Werte, CI/CD-Konfigurationen (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) auf hardcodierte Umgebungswerte.

**Phase 4 — Triage jeder Erkennung**

Für jeden Hit:
- Dateipfad und Zeilennummer
- Geheimnis-Typ (z.B. AWS Access Key, GitHub PAT)
- Ob es sich um ein echtes oder Placeholder/Beispiel handelt (kennzeichne als LIVE oder EXAMPLE)
- Ob es im Git-Verlauf angezeigt wird (kennzeichne als HISTORY falls ja)

**Ausgabeformat**:
```
## Secret-Gescannte-Ergebnisse

### LIVE-Geheimnisse (sofort rotieren)
[file:line] [type] — maskierte Vorschau: sk-...xxxx

### EXAMPLE / Platzhalter (überprüfen)
[file:line] [type] — Kontext: ...

### Verlaufslecks
[commit] [file] [type] — Hinweis: immer noch über Git zugänglich

### Behebung
1. Rotiere alle LIVE-Geheimnisse, bevor du etwas anderes tust.
2. Verwende git-filter-repo oder BFG, um Verlaufslecks zu bereinigen.
3. Füge erkannte Muster zu .gitignore und Pre-Commit-Hooks hinzu.
```

Drucke nie den vollständigen Wert des Geheimnisses — maskiere immer auf die letzten 4 Zeichen.
