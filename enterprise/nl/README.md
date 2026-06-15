# Enterprise Edition

Claudient Enterprise Edition breidt Claude Code uit met productie-grade beveiligings-, compliance- en governancefuncties voor gereglementeerde industrie en high-security implementaties.

## Belangrijkste kenmerken vs. OSS

| Functie | OSS | Enterprise |
|---|---|---|
| Audit logging | Handmatige instellingen | Ingebouwde, versleutelde JSONL-uitvoer |
| Session replay | Nee | Volledige session audit trail met afspeelmogelijkheid |
| PII-detectie | Nee | Pre-tool scanning, regex + ML patronen |
| Kostenhandhaving | Nee | Per-session caps, budget alerts, overschrijdingsblokkades |
| RBAC | Nee | Gebruiker-/teamrollen, tool whitelist, stack-permissies |
| SSO-integratie | Nee | SAML 2.0, OIDC, Active Directory |
| Compliance artefacten | Nee | SOC 2 Type II rapporten, ISO 27001 attestatie |
| Beveiligingshardening | Basis | Air-gapped deployment, netwerk isolatie, secret scanning |
| Beheerde agenten | Basis | Enterprise Security Officer, Cost Controller agenten |
| SLA-garanties | Nee | 99.99% beschikbaarheid, 24/7 ondersteuning, incident response |

## Wie zou Enterprise moeten gebruiken

- **Financiële diensten**: Banken, fintech, verzekeringen — GDPR, SOX, PCI-DSS vereisten
- **Gezondheidszorg**: HIPAA-gereglementeerde systemen, EHR-integratie, audit trails
- **Overheidaannemers**: FedRAMP, CJIS, EAR compliance
- **Grote ondernemingen**: Multi-team deployments, cost control, beveiligingsgovernance
- **Data-gevoelige organisaties**: Medisch onderzoek, biotech, gevoelige IP-omgevingen

## Architectuur

Enterprise wordt geïmplementeerd als:
- **Lokale implementatie**: Air-gapped `.claude` hooks met versleutelde audit logs
- **Beheerde cloud**: Volledige session audit, role isolatie, compliance rapporten (Claudient Cloud)
- **Hybride**: Lokale compute + cloud audit backend (Q3 2026)

## Bestanden in deze map

- **README.md** — Dit bestand; functiebeschrijving en implementatieopties
- **AUDIT_TRAIL.md** — Audit log schema, gestructureerde logging format, session capture
- **SSO_SETUP.md** — SAML 2.0 en OIDC configuratie voor enterprise identity providers
- **COMPLIANCE.md** — Certificering notities: SOC 2 Type II, ISO 27001, GDPR alignment, EU AI Act compliance
- **RBAC.md** — Rolgebaseerde toegangsbeheer: gebruikersrollen, tool permissions, team stack management

## Quick Start

### Deploy audit logging (5 minuten)
```bash
cp hooks/enterprise/audit-logger.sh .claude/hooks/
chmod +x .claude/hooks/audit-logger.sh
# Add settings.json config (see enterprise/AUDIT_TRAIL.md)
```

### Enable PII scanning (3 minuten)
```bash
cp hooks/enterprise/pii-scanner.sh .claude/hooks/
# Add pre-tool-use hook to settings.json
```

### Set up SSO (30 minuten)
Volg SAML 2.0 of OIDC instructies in **SSO_SETUP.md** met uw IdP (Okta, Azure AD, Ping, etc.).

### Enforce cost caps (2 minuten)
```bash
cp hooks/enterprise/cost-cap-enforcer.sh .claude/hooks/
# Set MAX_SESSION_COST and ALERT_THRESHOLD in settings.json
```

## Ondersteuning & Certificering

- **SOC 2 Type II attestation**: Beschikbaar op aanvraag voor Claudient Cloud implementaties
- **ISO 27001 bereik**: Enterprise implementatieomgevingen
- **GDPR Data Processing Agreement**: Inbegrepen in enterprise licentie
- **Ondersteuning**: security@claudient.com, 24/7 incident response

## Licentie

Enterprise Edition is beschikbaar onder een commerciële licentie. Functies kunnen zijn:
- **Per werkstation**: Team prijzen, jaarlijkse vernieuwing
- **Implementatie**: On-prem, air-gapped (FedRAMP-ready)
- **Cloud**: Beheerde Claudient Cloud met compliance rapportage

Contacteer sales@claudient.com voor prijzen.

---

**Last updated**: 2026-06-15  
**Model guidance**: Haiku (documentation), Opus (security reviews)
