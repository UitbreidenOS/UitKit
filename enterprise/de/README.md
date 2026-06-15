# Enterprise Edition

Claudient Enterprise Edition erweitert Claude Code um produktionsreife Sicherheits-, Compliance- und Governance-Funktionen für regulierte Industrien und hochsichere Bereitstellungen.

## Wichtigste Funktionen im Vergleich zu OSS

| Funktion | OSS | Enterprise |
|---|---|---|
| Audit Logging | Manuelle Einrichtung | Integrierte, verschlüsselte JSONL-Ausgabe |
| Session Replay | Nein | Vollständige Session-Audit-Trail mit Replay-Funktion |
| PII-Erkennung | Nein | Pre-Tool-Scanning, Regex + ML-Muster |
| Kostendurchsetzung | Nein | Pro-Session-Limits, Budget-Warnungen, Überschreitungssperren |
| Rollenbasierter Zugriff (RBAC) | Nein | Benutzer-/Team-Rollen, Tool-Whitelist, Stack-Berechtigungen |
| SSO-Integration | Nein | SAML 2.0, OIDC, Active Directory |
| Compliance-Artefakte | Nein | SOC 2 Type II Reports, ISO 27001 Attestation |
| Sicherheitshärtung | Grundlegend | Air-Gapped Deployment, Netzwerk-Isolierung, Secret Scanning |
| Verwaltete Agenten | Grundlegend | Enterprise Security Officer, Cost Controller Agenten |
| SLA-Garantien | Nein | 99.99% Verfügbarkeit, 24/7 Support, Incident Response |

## Wer sollte Enterprise verwenden

- **Finanzdienstleistungen**: Banken, Fintech, Versicherung — GDPR, SOX, PCI-DSS Anforderungen
- **Gesundheitswesen**: HIPAA-regulierte Systeme, EHR-Integration, Audit-Trails
- **Regierungsauftragnehmer**: FedRAMP, CJIS, EAR Compliance
- **Große Unternehmen**: Multi-Team-Bereitstellungen, Kostenkontrolle, Sicherheitsgovernance
- **Datensensible Organisationen**: Medizinische Forschung, Biotech, Sensitive-IP-Umgebungen

## Architektur

Enterprise wird bereitgestellt als:
- **Lokale Bereitstellung**: Air-gapped `.claude` Hooks mit verschlüsselten Audit-Logs
- **Verwaltete Cloud**: Vollständige Session-Audit, Rollen-Isolierung, Compliance-Berichte (Claudient Cloud)
- **Hybrid**: Lokale Compute + Cloud-Audit-Backend (Q3 2026)

## Dateien in diesem Verzeichnis

- **README.md** — Diese Datei; Funktionsübersicht und Bereitstellungsoptionen
- **AUDIT_TRAIL.md** — Audit-Log-Schema, strukturiertes Logging-Format, Session-Erfassungserweiterung
- **SSO_SETUP.md** — SAML 2.0 und OIDC-Konfiguration für Enterprise-Identity-Provider
- **COMPLIANCE.md** — Zertifizierungsnotizen: SOC 2 Type II, ISO 27001, GDPR-Ausrichtung, EU AI Act Compliance
- **RBAC.md** — Rollenbasierte Zugriffskontrolle: Benutzerrollen, Tool-Berechtigungen, Team-Stack-Verwaltung

## Quick Start

### Deploy Audit Logging (5 Minuten)
```bash
cp hooks/enterprise/audit-logger.sh .claude/hooks/
chmod +x .claude/hooks/audit-logger.sh
# Add settings.json config (see enterprise/AUDIT_TRAIL.md)
```

### Enable PII Scanning (3 Minuten)
```bash
cp hooks/enterprise/pii-scanner.sh .claude/hooks/
# Add pre-tool-use hook to settings.json
```

### Set up SSO (30 Minuten)
Folgen Sie den SAML 2.0 oder OIDC Anweisungen in **SSO_SETUP.md** mit Ihrem IdP (Okta, Azure AD, Ping, etc.).

### Enforce Cost Caps (2 Minuten)
```bash
cp hooks/enterprise/cost-cap-enforcer.sh .claude/hooks/
# Set MAX_SESSION_COST and ALERT_THRESHOLD in settings.json
```

## Support & Zertifizierung

- **SOC 2 Type II Attestation**: Auf Anfrage für Claudient Cloud Bereitstellungen verfügbar
- **ISO 27001 Scope**: Enterprise Bereitstellungsumgebungen
- **GDPR Data Processing Agreement**: In Enterprise-Lizenz enthalten
- **Support**: security@claudient.com, 24/7 Incident Response

## Lizenzierung

Enterprise Edition ist unter einer kommerziellen Lizenz erhältlich. Funktionen können folgende sein:
- **Pro Arbeitsplatz**: Team-Preise, jährliche Erneuerung
- **Bereitstellung**: On-Prem, Air-Gapped (FedRAMP-ready)
- **Cloud**: Verwaltetes Claudient Cloud mit Compliance-Berichten

Kontaktieren Sie sales@claudient.com für Preise.

---

**Last updated**: 2026-06-15  
**Model guidance**: Haiku (documentation), Opus (security reviews)
