# AI Ethics & Governance Officer Stack

A comprehensive collection of skills, frameworks, audits, and governance tools designed for ethics and governance leaders managing responsible AI deployment.

## Overview

This stack provides specialized tooling and guidance for:

- **Risk Assessment** — Domain-specific AI risk evaluation: fairness, safety, transparency, legal, reputational
- **Bias Auditing** — Quantifying demographic disparities; detecting discriminatory patterns
- **Compliance Tracking** — GDPR, HIPAA, local AI laws, industry standards, internal policies
- **Ethical Framework Design** — Building organizational AI ethics governance: principles, decision process, escalation
- **Governance Enforcement** — Pre/post-deployment validation; continuous fairness monitoring
- **Stakeholder Impact Analysis** — Documenting who benefits and who is harmed
- **Transparency Auditing** — Ensuring AI decisions are explainable and justifiable
- **Governance Reporting** — Compliance status, risk levels, audit trails

## Directory Structure

```
ai_ethics_governance_stack/
├── skills/                      # Ethics/governance-specific slash commands
│   ├── risk-framework-builder/
│   │   └── SKILL.md
│   ├── governance-auditor/
│   │   └── SKILL.md
│   ├── bias-assessor/
│   │   └── SKILL.md
│   ├── compliance-tracker/
│   │   └── SKILL.md
│   └── ethical-framework-designer/
│       └── SKILL.md
├── commands/                    # Custom CLI commands
│   ├── build-risk-framework.md
│   ├── audit-governance.md
│   └── track-compliance.md
├── hooks/                       # Event-triggered governance automations
│   ├── governance-enforcer.md
│   ├── bias-monitor.md
│   └── compliance-logger.sh
├── mcp/                         # MCP integrations
│   ├── connections.md
│   └── compliance-apis.md
├── CLAUDE.md                    # Identity, persona, governance framework
├── README.md                    # This file
└── session-log.md              # Template for governance session documentation
```

## Key Components

### Skills
Focused tools for specific ethics and governance tasks:

- **risk-framework-builder** — Comprehensive risk assessment across fairness, safety, transparency, legal, reputational domains
- **governance-auditor** — System audit against governance policies and regulatory requirements
- **bias-assessor** — Quantified fairness analysis; demographic disparities; mitigation documentation
- **compliance-tracker** — Track compliance status with GDPR, HIPAA, local AI laws, internal standards
- **ethical-framework-designer** — Design organizational AI ethics framework with decision authority and escalation paths

### Commands

- **/build-risk-framework** — Assess system risk across all governance domains; document mitigations
- **/audit-governance** — Audit system against policies and regulations; generate compliance report
- **/track-compliance** — Track compliance status; maintain audit trail of governance decisions

### Hooks

- **governance-enforcer** — Validates risk assessment and compliance before system moves to production
- **bias-monitor** — Continuously tracks fairness metrics; alerts on bias drift beyond thresholds
- **compliance-logger** — Logs all governance decisions, approvals, audit findings to version control

### MCP Integrations

- **compliance-apis** — Integration with regulatory databases and compliance tracking services
- **audit-tools** — Connections to bias auditing tools, fairness libraries, compliance checkers

## Standard Operating Procedures

1. **Risk Assessment Mandatory** — Every AI system must have documented risk assessment before deployment
2. **Bias Audit Required** — All decision systems must undergo fairness audit; quantified metrics required
3. **Compliance Verification** — Systems must meet all applicable regulatory and policy requirements
4. **Stakeholder Impact** — Document benefits and harms; ensure tradeoffs are acceptable
5. **Transparency First** — If a decision cannot be explained, it cannot be deployed
6. **Escalation Defined** — Pre-define conditions that trigger ethics board review
7. **Continuous Monitoring** — Post-deployment fairness metrics tracked; alerts on regression
8. **Auditable Governance** — Every governance decision logged with timestamp, approver, conditions

## Governance Templates

The stack includes production-grade templates for:

- **Risk Assessment** — Multi-domain risk evaluation with mitigation strategies
- **Bias Audit** — Fairness metric quantification and disparity analysis
- **Compliance Audit** — Regulatory and policy compliance checklist
- **Governance Decision Log** — Auditable record of all governance decisions
- **Monitoring Dashboard** — Post-deployment fairness and compliance metrics

## Compliance Standards Supported

- **GDPR** — Right to explanation, data protection, automated decision-making rules
- **HIPAA** — Healthcare AI governance, patient privacy, audit trail requirements
- **Fair Lending** — Disparate impact analysis, adverse action notification
- **AI Governance Laws** — EU AI Act, local regulations on high-risk AI systems
- **Industry Standards** — NIST AI Risk Management Framework, ISO/IEC 42001

## Integration Points

This stack integrates with:

- **Risk Management Systems** — Central risk registry and escalation workflows
- **Audit Platforms** — Automated compliance checking and continuous monitoring
- **Data Governance** — Integration with data catalogs and lineage tracking
- **Model Registries** — Connection to model metadata and version tracking
- **Legal/Compliance Teams** — Workflow integration for approval and escalation

## Quick Start

1. **Start a governance session:**
   ```
   /build-risk-framework --system "Credit Scoring Model v2.1"
   ```

2. **Run fairness audit:**
   ```
   /assess-bias --model "fraud-detection.pkl" --protected-attributes "race,gender,age"
   ```

3. **Track compliance:**
   ```
   /track-compliance --regulations "GDPR,HIPAA" --system "patient-recommendation-engine"
   ```

## Escalation & Authority

- **Green (Low Risk):** Governance lead approval required
- **Yellow (Medium Risk):** Director-level approval required; ethics board review recommended
- **Red (High Risk):** C-suite and ethics board approval required; public disclosure may be necessary

## Contact & Governance

For governance decisions, compliance questions, or risk escalation, contact:
- **Lead Ethics Officer:** [Name, email]
- **Compliance Team:** [Team contact]
- **Ethics Board Chair:** [Name, email]

## Related Resources

- [NIST AI Risk Management Framework](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [EU AI Act Regulatory Technical Standards](https://digital-strategy.ec.europa.eu/en/policies/ai-act)
- [Partnership on AI Governance Guidelines](https://partnershiponai.org/)
- [AI Incident Database](https://incidentdatabase.ai/)

---

Built with [Claudient](https://github.com/Claudients/Claudient) · [uitbreiden.com](https://uitbreiden.com/)
