---
description: Scan de codebase op geheimen, inloggegevens en gevoelige waarden die zijn gecommit of hardcoded
argument-hint: "[path or git-ref]"
---
Scan `$ARGUMENTS` (standaard: volledige repo inclusief git-geschiedenis) op geheimen, inloggegevens en gevoelige waarden die niet in bronbeheer of geïmplementeerde artefacten mogen voorkomen.

**Fase 1 — Patroonscanning (bronbestanden)**

Zoek in alle niet-binaire bestanden naar:
- API-sleutels en tokens: patronen zoals `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, UUID's gebruikt als geheimen
- Persoonlijke sleutels: PEM-headers (`-----BEGIN * PRIVATE KEY-----`), SSH persoonlijke sleutelblokken
- Wachtwoorden: variabelen met naam `password`, `passwd`, `pwd`, `secret`, `token`, `api_key` toegewezen aan stringwaarden
- Verbindingsreeksen: DSN's met ingebedde inloggegevens (`postgres://user:pass@host`)
- JWT-geheimen: hardcoded ondertekensleutels
- OAuth-geheimen: `client_secret` letterlijke waarden
- Cloudprovider-inloggegevens: AWS, GCP, Azure, Terraform, Kubernetes service account tokens
- Webhook-URL's met ingebedde tokens (Slack, Discord, GitHub)
- `.env`-bestandsinhoud per ongeluk gecommit

**Fase 2 — Git-geschiedenisucan** (indien in een git-repo)

Voer uit: `git log --all --full-history -- '*.env' '*.pem' '*.key' '*.p12' '*.pfx'`
Controleer recente commits op per ongeluk gecommiteerde geheimen die mogelijk zijn "verwijderd" maar nog steeds in de geschiedenis aanwezig zijn.

**Fase 3 — Configuratie- en infrastructuurbestanden**

Onderzoek: `docker-compose.yml`, Kubernetes-manifesten, Helm-waarden, CI/CD-configuraties (`.github/`, `.circleci/`, `.travis.yml`, `Jenkinsfile`) op hardcoded omgevingswaarden.

**Fase 4 — Triage elk bevindingspunt**

Voor elke hit:
- Bestandspad en regelnummer
- Geheimtype (bijv. AWS Access Key, GitHub PAT)
- Of het een echte waarde of placeholder/voorbeeld lijkt te zijn (markering LIVE of EXAMPLE)
- Of het in git-geschiedenis voorkomt (markering HISTORY indien van toepassing)

**Uitvoerindeling**:
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

Druk nooit de volledige geheime waarde af — masker altijd tot de laatste 4 tekens.
