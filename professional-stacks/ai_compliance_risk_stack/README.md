# AI Compliance & Risk Officer Stack

A comprehensive collection of skills, workflows, and governance tools for managing AI system compliance, risk, and regulatory requirements in production environments.

## Overview

This stack provides specialized capabilities for:

- **Compliance Framework Design** — Building AI governance structures aligned with GDPR, AI Act, SEC, HIPAA, and sector-specific regulations
- **Risk Assessment & Management** — Identifying AI failure modes, quantifying impact, designing mitigations, and maintaining risk registers
- **Model Auditing** — Conducting bias assessments, fairness audits, explainability reviews, and performance evaluations
- **Data Governance** — Ensuring training data compliance, consent records, lineage tracking, and retention policies
- **Regulatory Mapping** — Identifying applicable regulations for specific AI systems and designing controls
- **Incident Response** — Planning and executing response procedures for AI-related incidents with proper escalation and communication
- **Documentation & Audit Trails** — Maintaining compliance evidence, decision logs, and audit records for regulatory inspection
- **Third-Party Risk Management** — Assessing vendor models, external services, and third-party AI dependencies

## Directory Structure

```
ai_compliance_risk_stack/
├── skills/                      # Compliance & risk-specific slash commands
│   ├── compliance-framework-designer/
│   ├── risk-assessment-conductor/
│   ├── model-auditor/
│   ├── data-governance-validator/
│   ├── regulatory-mapping-tool/
│   └── ... (language subdirectories: fr/, de/, es/, nl/)
├── commands/                    # Direct command invocations
│   ├── design-compliance-framework.md
│   ├── conduct-risk-assessment.md
│   └── audit-model.md
├── hooks/                       # Event-triggered automations for compliance workflows
│   ├── compliance-checkpoint.md
│   └── incident-logger.md
├── mcp/                         # External service integrations
│   ├── connections.md
│   └── audit-trail-integration.md
├── session-log.md              # Session template for compliance work
├── CLAUDE.md                   # Stack identity, principles, and operating procedures
└── README.md                   # This file
```

## Key Components

### Skills

Specialized tools for compliance and governance tasks:

- **compliance-framework-designer** — Design comprehensive AI governance framework addressing regulatory requirements, organizational structure, and control architecture
- **risk-assessment-conductor** — Conduct structured risk assessments identifying failure modes, impact, control gaps, and mitigation strategies
- **model-auditor** — Audit AI models for bias, fairness, explainability, and performance disparities across demographic groups
- **data-governance-validator** — Validate data governance practices: lineage, consent records, retention policies, PII handling
- **regulatory-mapping-tool** — Map AI systems to applicable regulations and design specific controls for each requirement
- **incident-response-planner** — Develop incident response procedures with clear escalation, communication, and remediation protocols
- **third-party-risk-assessor** — Assess risks from vendor models, external services, and third-party dependencies
- **documentation-standards-enforcer** — Ensure compliance documentation meets regulatory standards: model cards, risk registers, decision logs

### Commands

Quick-access commands for common compliance tasks:

```
/design-compliance-framework     # Create governance framework
/conduct-risk-assessment         # Identify and quantify AI risks
/audit-model                     # Perform fairness and bias audit
/validate-data-governance        # Check data compliance practices
/map-regulatory-requirements     # Identify applicable regulations
/plan-incident-response          # Develop incident procedures
/assess-third-party-risk         # Review vendor AI systems
/enforce-documentation-standards # Verify audit documentation
```

### Hooks

Automated compliance checks triggered during workflows:

- **compliance-checkpoint** — Pre-deployment validation ensuring all compliance requirements are met before model goes to production
- **incident-logger** — Automatically logs AI incidents to audit trail with escalation to compliance team
- **regulatory-change-monitor** — Monitors regulatory environment for changes relevant to deployed systems (scheduled daily)

### MCP Integrations

External service connections for governance work:

- **Audit Trail Integration** — Connect to centralized audit logging systems (Splunk, ELK, Cloudtrail)
- **Regulatory Intelligence** — Subscribe to regulatory updates and compliance databases
- **Risk Management Tools** — Integration with enterprise risk management platforms (ServiceNow, Alteryx)

## Core Principles

1. **Governance is continuous, not static** — Set up monitoring, periodic reviews, and escalation procedures. Compliance is a process, not a one-time event.

2. **Risk is measurable** — Every risk is named, quantified (probability × impact), and tied to specific mitigations. Vague risks are unmanaged risks.

3. **Regulations are binding** — Identify all applicable regulations before designing controls. Do not assume one regulation covers your use case.

4. **Documentation is evidence** — Maintain audit trails, decision logs, and incident records. In a regulatory investigation, "we thought about it" is worthless without documentation.

5. **Fairness is auditable** — Measure and document bias across demographic groups. If you cannot measure it, you cannot manage it.

6. **Explainability is non-negotiable** — If you cannot explain a model decision to a regulator or user, the model cannot be deployed.

7. **Incident response is pre-written** — Do not develop escalation procedures during an incident. Incident response plans are written, tested, and rehearsed before deployment.

## Usage

### Running a Compliance Audit

```
/audit-model
- Model name: [Your model]
- Training data: [Path or reference]
- Key performance metrics: [Accuracy, F1, etc.]
```

### Designing a Governance Framework

```
/design-compliance-framework
- Industry: [Healthcare, Finance, Consumer, etc.]
- Primary regulations: [GDPR, AI Act, HIPAA, etc.]
- Organization size: [Number of deployed models, team size]
```

### Conducting a Risk Assessment

```
/conduct-risk-assessment
- System: [Model name or AI system]
- Business context: [Use case, stakeholders, failure impact]
- Current controls: [What mitigations are already in place?]
```

## Pre-Deployment Checklist

Every production model must pass:

- [ ] Regulatory mapping completed (all applicable regulations identified)
- [ ] Risk assessment completed and approved
- [ ] Bias audit conducted; disparities documented and within tolerance
- [ ] Data governance validated (consent, lineage, retention)
- [ ] Explainability mechanism implemented or documented
- [ ] Incident response plan written and tested
- [ ] Model card and decision log prepared
- [ ] Compliance checklist signed off by leadership

See `CLAUDE.md` for complete checklist and risk register templates.

## Regulatory Scope

This stack addresses:

- **GDPR** — Right to explanation, data minimization, privacy impact assessments
- **EU AI Act** — Risk classification, documentation, audit requirements, high-risk controls
- **SEC** — Disclosure requirements for AI in financial services
- **HIPAA** — Privacy and security in healthcare AI applications
- **CCPA/CPRA** — Consumer privacy rights and transparency obligations
- **Sector-specific** — Banking, insurance, healthcare, employment, criminal justice

Adapt guidance to your specific regulatory environment.

## Common Workflows

### 1. Pre-Production Compliance Review

1. Map model to applicable regulations using `/map-regulatory-requirements`
2. Conduct risk assessment using `/conduct-risk-assessment`
3. Perform bias audit using `/audit-model`
4. Validate data governance using `/validate-data-governance`
5. Complete compliance checklist (see CLAUDE.md)
6. Obtain sign-off from compliance, legal, and leadership

### 2. Incident Response

1. Incident detected (fairness alert, unexpected behavior, user complaint)
2. Incident logged automatically via `incident-logger` hook
3. Use `/plan-incident-response` to trigger response procedures
4. Execute: identify, escalate, communicate, remediate, document
5. Post-incident review and risk register update

### 3. Regulatory Audit

1. Gather documentation: model cards, risk registers, decision logs, audit trails
2. Run `/audit-model` for current fairness assessment
3. Prepare incident history and remediation evidence
4. Prepare for examiner interviews

### 4. Third-Party Model Integration

1. Obtain vendor documentation (model card, training data, performance)
2. Use `/assess-third-party-risk` to evaluate vendor compliance and security
3. Define SLAs, audit rights, and liability allocation in contract
4. Set up monitoring dashboard for vendor model performance
5. Establish escalation procedures for vendor incidents

## Translation

All skills, commands, workflows, and guides are available in:
- English (en/)
- French (fr/)
- German (de/)
- Spanish (es/)
- Dutch (nl/)

Each language subdirectory mirrors the English structure. Hook scripts remain English-only.

## Contributing

When adding to this stack:

1. **Follow naming conventions** — Files use `kebab-case.md`, directories use `kebab-case/`
2. **Include translations** — All non-hook files must be translated to fr/, de/, es/, nl/
3. **Match the established format** — Skills and commands follow the standard structure
4. **Reference real regulations** — Cite specific regulatory provisions, not generalities
5. **Include templates** — Provide ready-to-use checklists, registers, and audit procedures
6. **Write for senior compliance teams** — Assume regulatory and governance knowledge; focus on executable procedures

## Integration with Claude Code

This stack integrates with Claude Code through:

- **Slash commands** — Activate skills with `/compliance-framework-designer`
- **Agent delegation** — Spawn specialized agents with `@compliance-officer`
- **Hooks** — Automated compliance checkpoints and incident logging
- **MCP servers** — Connect to audit trails, regulatory databases, risk management tools

## Resources

- [CLAUDE.md](./CLAUDE.md) — Stack identity, principles, and operating procedures
- [GDPR Compliance Guidance](https://gdpr-info.eu/)
- [EU AI Act Text](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [NIST AI Risk Management Framework](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993)

## Status

This stack is production-grade and actively maintained. Ensure regulatory guidance is current for your jurisdiction.

---

**Last updated:** 2026-06-15
