# Compliance Framework Designer

## When to activate

When designing or updating an AI governance framework, establishing organizational policies for AI deployment, defining roles and responsibilities, or aligning AI practices with regulatory requirements (GDPR, AI Act, HIPAA, CCPA, etc.).

## When NOT to use

For one-off compliance questions or tactical risk assessments. Use this skill when building or restructuring governance infrastructure, not for answering isolated compliance questions.

## Instructions

### Framework Design Process

1. **Regulatory Landscape Identification**
   - Identify all applicable regulations based on industry, geography, and use case
   - Document regulatory requirements for each rule
   - Map regulatory requirements to specific control families
   - Identify conflicting or overlapping requirements

2. **Governance Architecture**
   - Define AI governance roles: Chief AI Officer, Compliance Officer, Model Owner, Data Steward, etc.
   - Document decision authority: Who approves models for production? Who can modify deployed models?
   - Create escalation procedures for issues at Medium/High/Critical risk levels
   - Define approval chains for new models, data sources, and regulatory changes

3. **Control Family Design**
   - **Regulatory Controls:** Compliance with GDPR, AI Act, sector-specific rules
   - **Risk Management Controls:** Risk assessment, monitoring, incident response
   - **Fairness & Bias Controls:** Bias audits, demographic monitoring, disparity tracking
   - **Data Governance Controls:** Consent tracking, lineage, retention, PII handling
   - **Explainability Controls:** Model interpretability, decision transparency, user communication
   - **Operational Controls:** Access management, change control, monitoring, rollback procedures
   - **Documentation Controls:** Model cards, decision logs, audit trails, incident records

4. **Policy Development**
   - Write governance policies addressing each control family
   - Include specific procedures and templates (checklists, audit procedures, incident response)
   - Define metrics for evaluating control effectiveness
   - Establish review cycles (annual, quarterly, or event-driven)

5. **Implementation Roadmap**
   - Prioritize control implementations based on risk and regulatory urgency
   - Define quick wins (high-impact, low-effort controls)
   - Establish timeline and resource requirements
   - Identify dependencies and critical path items

### Framework Documentation Template

Structure your framework as:
- Executive Summary: Purpose, scope, key principles
- Regulatory Mapping: Applicable regulations and coverage
- Governance Structure: Roles, responsibilities, decision authority
- Control Families: 6-8 core control areas with procedures
- Policies: Specific written policies (1-2 pages each)
- Operating Procedures: Detailed step-by-step procedures
- Templates: Pre-built checklists, audit procedures, decision logs
- Metrics: Key indicators of control effectiveness

## Example

**Scenario:** A healthcare AI startup needs to deploy a patient risk prediction model. They operate in the US and EU, must comply with HIPAA, GDPR, and emerging AI Act requirements, and have limited compliance infrastructure.

**Framework Design Output:**

```
# AI Governance Framework - Healthcare AI Startup

## Regulatory Landscape
- **HIPAA Privacy Rule** — Patient data protection; requires de-identification, access controls, breach notification
- **HIPAA Security Rule** — Technical controls for PHI; audit logs, encryption, role-based access
- **GDPR** — Data minimization, consent, right to explanation, DPA with vendors
- **EU AI Act** — High-risk classification for medical AI; human oversight, documentation, bias monitoring
- **FDA Guidance** — Software as Medical Device (SaMD) regulatory expectations

## Governance Structure
- **Chief AI Officer** (executive sponsor)
  - Approves production deployment
  - Sets risk tolerance
  - Owns escalation above compliance
  
- **Compliance Officer** (day-to-day)
  - Maintains compliance checklist
  - Conducts pre-deployment audits
  - Manages vendor assessments
  
- **Model Owner** (ML team)
  - Owns model development and performance
  - Documents model card and decision log
  - Responds to incidents
  
- **Data Officer** (data governance)
  - Maintains consent records
  - Ensures data lineage tracking
  - Manages retention and deletion

## Control Families

### 1. Regulatory Compliance Control
**Requirement:** All AI systems must demonstrate compliance with HIPAA, GDPR, and AI Act.
**Procedure:**
- Map model to applicable regulations (HIPAA, GDPR, AI Act)
- Identify specific requirements for each regulation
- Design specific controls to address each requirement
- Document control design and evidence of implementation

**Evidence:** Regulatory mapping matrix, control documentation, audit checklist

### 2. Risk Assessment Control
**Requirement:** Every model must have completed risk assessment before production.
**Procedure:**
- Identify failure modes (accuracy failure, fairness drift, security attack, etc.)
- Quantify probability and impact
- Identify current controls and residual risk
- Document mitigation strategies and owners
- Escalate high/critical risks to leadership for approval

**Evidence:** Risk register, sign-off documentation, ongoing monitoring dashboard

### 3. Fairness & Bias Control
**Requirement:** Models must be audited for demographic disparities; disparities must be documented and mitigated.
**Procedure:**
- Identify protected classes (age, gender, race, ethnicity, disability status)
- Measure performance metrics by demographic group
- Analyze disparities > 5%; document root cause
- Design mitigations (data rebalancing, fairness constraints, sampling adjustments)
- Monitor fairness metrics in production

**Evidence:** Bias audit report, fairness dashboard, mitigation plan

### 4. Data Governance Control
**Requirement:** All training data must be sourced with proper consent; data lineage must be tracked; retention and deletion procedures must be in place.
**Procedure:**
- Audit data sources for consent (explicit consent vs. legitimate interest vs. contract)
- Document data lineage: source → transformation → model → inference
- Create data inventory with retention requirements
- Implement automated deletion procedures
- Log all data access

**Evidence:** Consent audit, data lineage diagram, deletion logs

### 5. Explainability Control
**Requirement:** Users and regulators must be able to understand model decisions.
**Procedure:**
- Document model architecture and training approach in model card
- Implement feature importance or SHAP analysis
- Prepare user-facing transparency disclosures
- Create decision log with explanations for key inferences
- Establish escalation procedure for unexplained decisions

**Evidence:** Model card, decision log, user transparency materials

### 6. Operational Control
**Requirement:** Access to models and data is restricted; changes are tracked; incidents are handled; systems can roll back.
**Procedure:**
- Define role-based access control (RBAC): who can deploy, modify, access data?
- Implement change control: all deployments logged and approved
- Establish monitoring dashboard for model performance and fairness drift
- Document rollback procedure; test quarterly
- Escalate incidents based on severity and regulatory impact

**Evidence:** Access control matrix, change log, monitoring dashboard, incident response plan

## Policies

### Policy 1: Model Deployment Approval
- All models require compliance checklist completion before production
- Compliance Officer conducts pre-deployment audit
- Model Owner certifies model card and documentation
- Chief AI Officer approves deployment
- No model reaches production without all three sign-offs

### Policy 2: Data Governance
- All training data must be sourced with documented consent
- Data lineage must be tracked from source to inference
- Data retention follows HIPAA (6 years) and GDPR (minimum necessary)
- Automated deletion procedures executed annually
- All data access logged and auditable

### Policy 3: Incident Response
- Model accuracy < 80%: notify Model Owner; assess in 24 hours
- Demographic disparities > 10%: escalate to Compliance Officer; develop mitigation in 48 hours
- Security breach or unauthorized access: escalate immediately to CISO; follow HIPAA breach notification rules
- Regulatory inquiry: escalate to General Counsel immediately; preserve audit trail

## Implementation Roadmap
- **Q1:** Establish governance roles, write core policies, create compliance checklist
- **Q2:** Implement risk assessment process for deployed models; audit fairness and data governance
- **Q3:** Build monitoring dashboard, establish incident response procedures
- **Q4:** Conduct full framework audit, document lessons learned, iterate

## Metrics
- **Compliance rate:** % of models with completed compliance checklist
- **Risk coverage:** % of identified risks with documented mitigations
- **Audit completion:** % of models audited for fairness and data governance
- **Incident response time:** time from incident detection to escalation (target: < 4 hours)
- **Documentation completeness:** all models have model card, risk register, decision log
```

---

## Framework Components Checklist

When designing a framework, ensure you include:

- [ ] Regulatory mapping (all applicable regulations identified and documented)
- [ ] Governance structure (roles, responsibilities, decision authority)
- [ ] Control families (6-8 core areas: compliance, risk, fairness, data, explainability, operations, documentation, vendor management)
- [ ] Specific policies (written governance policies; 2-3 pages each)
- [ ] Operating procedures (step-by-step procedures with templates)
- [ ] Escalation matrix (response procedures and timeline by risk level)
- [ ] Compliance checklist (pre-deployment validation)
- [ ] Metrics and KPIs (how to measure control effectiveness)
- [ ] Implementation roadmap (timeline, dependencies, resource requirements)
- [ ] Training plan (how to communicate framework to organization)

---

## Success Criteria

A complete compliance framework should:

1. **Address all applicable regulations** — Every regulation mapped to specific controls
2. **Clarify decision authority** — No ambiguity about who approves models, changes, escalations
3. **Provide templates and procedures** — Checklists, audit procedures, incident response runbooks ready-to-use
4. **Enable measurement** — Metrics and dashboards to track control effectiveness
5. **Support continuous improvement** — Regular reviews, updating for regulatory changes, incident learning
