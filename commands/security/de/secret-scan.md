---
description: Durchsuchen Sie die Codebasis nach Geheimnissen, Anmeldedaten und sensiblen Werten, die committed oder hardcodiert sind
argument-hint: "[path or git-ref]"
---
Scannen Sie `$ARGUMENTS` (Standard: gesamtes Repo einschließlich Git-Verlauf) nach Geheimnissen, Anmeldedaten und sensiblen Werten, die nicht in der Quellcodeverwaltung oder in bereitgestellten Artefakten erscheinen dürfen.

**Phase 1 — Musteranalyse (Quelldateien)**

Suchen Sie in allen nicht-binären Dateien nach:
- API-Schlüssel und Token: Muster wie `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, als Geheimnisse verwendete UUIDs
- Private Schlüssel: PEM-Header (`-----BEGIN * PRIVATE KEY-----`), SSH-Private-Key-Blöcke
- Passwörter: Variablen mit Namen `password`, `passwd`, `pwd`, `secret`, `token`, `api_key`, denen Zeichenkettenliterale zugewiesen sind
- Verbindungszeichenfolgen: DSNs mit eingebetteten Anmeldedaten (`postgres://user:pass@host`)
- JWT-Geheimnisse: hardcodierte Signaturschlüssel
- OAuth-Geheimnisse: `client_secret`-Literale
- Cloud-Provider-Anmeldedaten: AWS, GCP, Azure, Terraform, Kubernetes-Service-Account-Token
- Webhook-URLs mit eingebetteten Token (Slack, Discord, GitHub)
- `.env`-Dateiinhalte, die versehentlich committed wurden

**Phase 2 — Git-Verlauf-Scan** (falls sich in einem Git-Repo befindet)

Führen Sie aus: `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Prüfen Sie aktuelle Commits auf versehentliche Secret-Commits, die möglicherweise "gelöscht" wurden, aber im Verlauf bestehen bleiben.

**Phase 3 — Konfigurierungs- und Infrastrukturdateien**

Untersuchen Sie: `docker-compose.yml`, Kubernetes-Manifeste, Helm-Werte, CI/CD-Konfigurationen (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) auf hardcodierte Env-Werte.

**Phase 4 — Triage für jeden Fund**

Für jeden Hit:
- Dateipfad und Zeilennummer
- Secret-Typ (z. B. AWS Access Key, GitHub PAT)
- Ob es sich um einen echten Wert oder einen Platzhalter/ein Beispiel handelt (als LIVE oder EXAMPLE kennzeichnen)
- Ob es im Git-Verlauf auftaucht (als HISTORY kennzeichnen, falls vorhanden)

**Ausgabeformat**:
```
## Secret Scan Results

### LIVE Secrets (rotate immediately)
[file:line] [type] — masked preview: sk-...xxxx

### EXAMPLE / Placeholder (verify)
[file:line] [type] — context: ...

### History Leaks
[commit] [file] [type] — note: still accessible via git

### Remediation
1. Rotate all LIVE secrets before doing anything else.
2. Use git-filter-repo or BFG to purge history leaks.
3. Add detected patterns to .gitignore and pre-commit hooks.
```

Geben Sie niemals den vollständigen Geheimnis-Wert aus — maskieren Sie immer auf die letzten 4 Zeichen.
