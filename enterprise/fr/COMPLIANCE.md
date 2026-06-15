# Compliance & Certifications

Ce document outline la posture compliance de Claudient Enterprise Edition, certifications, et alignement avec frameworks régulatoires.

## SOC 2 Type II

**Status**: Attestation disponible pour déploiements Claudient Cloud

Claudient Cloud est audité annuellement par une firm CPA tierce. Le rapport couvre:

- **CC6 — Logical and Physical Access Controls**: User authentication (SSO), API key management, audit log access
- **CC7 — System Monitoring**: Continuous logging de tous tool calls, cost enforcement, anomaly detection
- **CC8 — Change Management**: File write audit trail, approval workflows, rollback capabilities
- **CC9 — Risk Mitigation**: Cost caps préviennent runaway spend; PII scanning prévient data exposure

**Comment accéder**: Requêtez `SOC 2 Type II Report` depuis sales@claudient.com (NDA requise)

**Scope**: Infrastructure Claudient Cloud et managed deployments seulement. On-prem `.claude/` hooks sont customer-managed.

## ISO 27001

**Status**: Certification en cours (Q3 2026)

Claudient implémente ISO 27001 Information Security Management System (ISMS) couvrant:

- **A.5**: Organization de information security (rôles, responsabilités)
- **A.6**: Human resource security (staff screening, awareness training)
- **A.7**: Asset management (inventory, classification)
- **A.9**: Access control (RBAC, authentication, encryption)
- **A.10**: Cryptography (data at rest, in transit)
- **A.12**: Operations security (change management, backup)
- **A.13**: Communications security (TLS 1.3, mutual auth)
- **A.14**: System acquisition and development (code review, secure SDLC)
- **A.15**: Supplier relationships (third-party audits)
- **A.16**: Information security incident management (incident response, RTO/RPO)

**Target**: August 2026 certification

## GDPR Compliance

### Data Processing Agreement (DPA)

Quand utilisant Claudient Cloud, un Data Processing Addendum (DPA) s'applique:

- Claudient agit comme **Data Processor** (vous êtes le Controller)
- EU Standard Contractual Clauses (SCCs) incluses
- Sub-processors listés et approuvés
- Data transfers à US requièrent additional safeguards (Adequacy Decision, BCRs, ou SCCs)

**Comment obtenir**: Incluse avec enterprise license. Requêtez depuis sales@claudient.com.

### Your Responsibilities

Comme controller utilisant Claude Code + Claudient Cloud:

1. **Data minimization**: Évitez processing personal data inutilement. Audit logs sont minimisés (voir AUDIT_TRAIL.md sanitization rules).
2. **Consent**: Assurez-vous employees/users consentent à Claude Code processing leur travail (via employment agreement ou separate notice).
3. **Right to erasure**: Users peuvent requêter deletion de leurs audit logs. Claudient Cloud supporte bulk deletion via API.
4. **Data retention**: Set audit log retention pour match votre policy (défaut: 7 ans pour compliance, mais configurable down to 30 jours).
5. **Breach notification**: Si Claude Code process PII et une breach occur, notifiez votre DPA dans 72 heures. Claudient aidera avec forensiques.

### Key Features pour GDPR

- **Audit logging**: Satisfait accountability principle (Article 5.2)
- **PII scanning**: Prévient accidental exposure (Article 32 security measures)
- **Data deletion API**: Support right to erasure (Article 17)
- **Role-based access**: Restrict qui peut access audit logs (principle of least privilege, Article 32)
- **Encryption**: Data in transit (TLS 1.3) et at rest (AES-256-GCM) sur Cloud
- **DPA**: Standard contract terms pour lawful processing (Article 28)

## HIPAA

**Status**: HIPAA compliance disponible pour Claudient Cloud (Business Associate Agreement requise)

Si processing Protected Health Information (PHI):

1. **Requêtez BAA**: Claudient signera Business Associate Agreement per 45 CFR §164.308(b)
2. **Activez encryption**: 
   - Audit logs chiffrés at rest (AES-256-GCM)
   - TLS 1.3 in transit
   - Set `encryption_at_rest: true` dans settings.json
3. **Audit trail**: Tous access à PHI est loggé. Set audit log retention pour match votre policy (typiquement 6 ans pour covered entities).
4. **Access controls**: Utilisez RBAC pour limit qui peut access Claude Code. Enforcer MFA + SAML SSO.
5. **Incident response**: Claudient supporte forensic log export pour breach notification analysis.

**Non couvrir**: On-prem deployments (vous êtes responsible pour HIPAA compliance de vos `.claude/` hooks et logs).

### Checklist pour HIPAA Deployments

- [ ] BAA signé avec Claudient
- [ ] Claudient Cloud activé (non on-prem)
- [ ] Encryption at rest activée
- [ ] TLS 1.3 pour tous network traffic
- [ ] SAML SSO configuré (MFA requise)
- [ ] Audit logging activé avec 6-year retention
- [ ] PII scanning activé (détecter PHI dans inputs)
- [ ] Cost cap enforcer déployé (prévenir accidental bulk operations)
- [ ] Staff training: seulement submit PHI nécessaire à Claude Code
- [ ] Incident response plan: escalation path si Claude Code process unauthorized PHI

## PCI-DSS

**Status**: Non in scope pour Claudient (Claude Code ne devrait jamais process cardholder data)

Si vous travaillez avec payment data:

1. **Ne processez PAS cardholder data** dans Claude Code sessions. Claude Code + Claudient logs ne sont pas PCI-DSS compliant.
2. **Utilisez PII scanning**: Activez pour détecter et block card numbers (regex: `\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b`)
3. **Tokenization**: Remplacez card numbers avec tokens avant sending à Claude Code.
4. **Auditez séparément**: Si un file contenant PII est accidentally processé, audit logs sont disponibles pour incident response (voir AUDIT_TRAIL.md).

## FedRAMP (Government Contractors)

**Status**: FedRAMP Authorized deployment Q4 2026

Pour US government contractors:

- Claudient Cloud poursuit **FedRAMP Moderate** authorization
- Air-gapped on-prem deployment disponible maintenant (aucun external network calls)
- Supporte NIST SP 800-53 controls (AC-2, AU-2, AU-12, etc.)

**Current capabilities** (disponible today):
- Local audit logging (aucun cloud dependency)
- Encrypted audit logs via `.claude/` hooks
- SAML 2.0 integration avec on-prem IdP
- Aucun external API calls (hooks sont local bash scripts)
- Cost enforcement via local hooks

**Future** (Q4 2026):
- FedRAMP Authorized Cloud environment
- FISMA compliance dashboard
- Incident response integration avec FedRAMP portal

## EU AI Act Compliance

**Status**: Alignment avec EU AI Regulation (2024/1689)

Claude Code est un **AI system** sous la regulation. Claudient implémente:

### High-Risk Categories (Annex III)

Claude Code n'est **pas** high-risk lui-même (c'est un development tool, non autonomous decision-making). Cependant, si vous l'utilisez pour build high-risk AI systems:

1. **Transparency**: Audit logs documenten toutes decisions Claude durant development
2. **Human oversight**: RBAC ensure security officer reviews avant deployment
3. **Data quality**: PII scanning prévient training sur personal data
4. **Documentation**: Audit trail serves comme compliance documentation

### Obligations pour Users

Si vous utilisez Claude Code pour développer un high-risk AI system:

- [ ] Menez impact assessment (DPIA equivalent)
- [ ] Documentez Claude Code's role dans system development
- [ ] Maintenez audit trail pour regulatory inspection
- [ ] Fournissez transparency à end-users ("Ce système a été développé avec AI assistance")

### Key Features

- **Audit trail** (AI Act Article 5.2a): Complete log de Claude Code decisions
- **Transparency** (Article 6): Expliquez pourquoi specific tools ont été utilisés
- **Data governance** (Article 10): PII scanning prévient biased/non-consented data
- **Bias monitoring** (Article 15): Cost allocation et access control préviennent discrimination

## SOX (Sarbanes-Oxley)

**Status**: Utile pour finance/audit teams

Si votre compagnie est publicly traded:

1. **IT General Controls (ITGCs)**: Claudient satisfait change management (audit trail de file edits), access control (RBAC), et segregation of duties (cost controller agent).
2. **Financial system changes**: Loggez tous changes à accounting systems. Audit trail inclut qui a run quelle commande quand.
3. **Documentation**: Exportez audit logs pour audit committee review (voir AUDIT_TRAIL.md querying examples).

**Rapports utiles**:
- **Change log**: `jq 'select(.tool_name == "Write" or .tool_name == "Edit")' .claude/logs/audit.log`
- **Who changed what**: Groupez par user_id, filtrez par tool
- **Cost attribution**: Track quel team member's code coûte combien

## PII Detection Rules

Le built-in PII scanner de Claudient détecte:

| Type | Regex | Action |
|------|-------|--------|
| Email | `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` | Block / Flag |
| Phone | `(\+?1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}` | Block / Flag |
| SSN | `\d{3}-\d{2}-\d{4}` | Block / Flag |
| Credit Card | `\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b` | Block / Flag |
| Passport | `[A-Z0-9]{6,9}` | Flag (high false positive) |
| API Key | `(api|secret|token)[-_]?key[-_]?[=:]\s*[A-Za-z0-9_-]{20,}` | Block |

Configurez dans settings.json:

```json
{
  "security": {
    "pii_scanning": {
      "enabled": true,
      "action": "block",
      "custom_patterns": [
        {
          "name": "company_employee_id",
          "regex": "EMP[0-9]{6}",
          "action": "flag"
        }
      ]
    }
  }
}
```

## Compliance Audit Checklist

Utilisez quand préparant pour external audit:

- [ ] SSO configuré (audit identity management)
- [ ] Audit logging activé (7+ year retention)
- [ ] Encryption activée (TLS 1.3, AES-256 at rest)
- [ ] RBAC configuré (rôles, permissions, team assignments)
- [ ] PII scanning activé (détecte sensitive data)
- [ ] Cost caps enforced (prévient resource abuse)
- [ ] Incident response plan documenté (escalation, forensiques)
- [ ] Staff training complétée (data handling, compliance requirements)
- [ ] DPA/BAA signé (si utilisant Claudient Cloud)
- [ ] Audit logs retenue par policy (export, archive, delete sur schedule)

---

**Last updated**: 2026-06-15  
**Contact**: compliance@claudient.com  
**Related files**: `AUDIT_TRAIL.md`, `RBAC.md`, `SSO_SETUP.md`
