# Enterprise Edition

Claudient Enterprise Edition étend Claude Code avec des fonctionnalités de sécurité, conformité et gouvernance de qualité production pour les industries réglementées et les déploiements haute sécurité.

## Fonctionnalités clés vs. OSS

| Fonctionnalité | OSS | Enterprise |
|---|---|---|
| Audit logging | Configuration manuelle | Sortie JSONL chiffrée intégrée |
| Session replay | Non | Audit trail complet de session avec capacité de relecture |
| PII detection | Non | Scan pré-outil, modèles regex + ML |
| Cost enforcement | Non | Plafonds par session, alertes budget, blocages de dépassement |
| Role-based access (RBAC) | Non | Rôles utilisateur/équipe, whitelist outils, permissions stack |
| SSO integration | Non | SAML 2.0, OIDC, Active Directory |
| Compliance artifacts | Non | Rapports SOC 2 Type II, attestation ISO 27001 |
| Security hardening | Basique | Déploiement air-gapped, isolement réseau, secret scanning |
| Managed agents | Basique | Agents officer sécurité, contrôleur coût enterprise |
| SLA guarantees | Non | Disponibilité 99.99%, support 24/7, réponse incident |

## Qui doit utiliser Enterprise

- **Services financiers**: Banques, fintech, assurance — exigences GDPR, SOX, PCI-DSS
- **Santé**: Systèmes HIPAA, intégration EHR, audit trails
- **Contractors gouvernement**: Conformité FedRAMP, CJIS, EAR
- **Grandes entreprises**: Déploiements multi-équipes, contrôle coûts, gouvernance sécurité
- **Orgs sensibles données**: Recherche médicale, biotech, environnements IP sensibles

## Architecture

Enterprise est déployé comme:
- **Déploiement local**: Hooks air-gapped `.claude` avec audit logs chiffrés
- **Cloud géré**: Audit session complet, isolement rôle, rapports conformité (Claudient Cloud)
- **Hybride**: Compute local + backend audit cloud (Q3 2026)

## Fichiers dans ce répertoire

- **README.md** — Ce fichier; aperçu fonctionnalités et options déploiement
- **AUDIT_TRAIL.md** — Schéma audit log, format logging structuré, enabling session capture
- **SSO_SETUP.md** — Configuration SAML 2.0 et OIDC pour identity providers enterprise
- **COMPLIANCE.md** — Notes certification: SOC 2 Type II, ISO 27001, alignement GDPR, conformité EU AI Act
- **RBAC.md** — Role-based access control: rôles utilisateur, permissions outils, gestion stack équipes

## Quick Start

### Deploy audit logging (5 minutes)
```bash
cp hooks/enterprise/audit-logger.sh .claude/hooks/
chmod +x .claude/hooks/audit-logger.sh
# Add settings.json config (see enterprise/AUDIT_TRAIL.md)
```

### Enable PII scanning (3 minutes)
```bash
cp hooks/enterprise/pii-scanner.sh .claude/hooks/
# Add pre-tool-use hook to settings.json
```

### Set up SSO (30 minutes)
Follow SAML 2.0 or OIDC instructions in **SSO_SETUP.md** with your IdP (Okta, Azure AD, Ping, etc.).

### Enforce cost caps (2 minutes)
```bash
cp hooks/enterprise/cost-cap-enforcer.sh .claude/hooks/
# Set MAX_SESSION_COST and ALERT_THRESHOLD in settings.json
```

## Support & Certification

- **SOC 2 Type II attestation**: Disponible sur demande pour déploiements Claudient Cloud
- **ISO 27001 scope**: Environnements déploiement Enterprise
- **GDPR Data Processing Agreement**: Incluse avec license enterprise
- **Support**: security@claudient.com, réponse incident 24/7

## Licensing

Enterprise Edition est disponible sous license commerciale. Les fonctionnalités peuvent être:
- **Per-seat**: Tarification équipe, renouvellement annuel
- **Deployment**: On-prem, air-gapped (FedRAMP-ready)
- **Cloud**: Claudient Cloud géré avec rapports conformité

Contactez sales@claudient.com pour tarification.

---

**Last updated**: 2026-06-15  
**Model guidance**: Haiku (documentation), Opus (security reviews)
