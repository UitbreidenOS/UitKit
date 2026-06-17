# Ethical Framework Designer

## When to activate

When designing, building, or revising an organization's AI ethics governance framework. Use when establishing ethical decision authority, escalation paths, approval processes, or when implementing responsible AI governance across teams.

## When NOT to use

When assessing existing systems (use risk-framework-builder or governance-auditor). When auditing fairness of specific models (use bias-assessor). When performing code reviews or technical audits.

## Instructions

The Ethical Framework Designer builds comprehensive organizational AI governance frameworks. Follow this structured approach:

### 1. Organizational Context & Governance Philosophy

Define the ethical foundation:

```
Organizational AI Governance Framework

1. Mission & Values
   - What are the organization's core values? How do they apply to AI?
   - What is our commitment to responsible AI?
   - What harms do we most want to prevent?
   - Who are our most vulnerable stakeholders?

   Example: 
   "We build AI systems that empower users while protecting privacy, 
   preventing discrimination, and maintaining transparency. We believe 
   affected communities should have voice in AI decisions."

2. Scope
   - Which systems require ethics governance? (All AI? Just decision systems? Just those with significant impact?)
   - What departments/teams are involved?
   - What's our governance coverage? (Risk assessment, fairness, transparency, etc.)

   Example:
   "All AI systems affecting user decisions or outcomes require 
   full governance: risk assessment, fairness audit, compliance check. 
   Internal analytics systems require lighter review."

3. Governance Principles
   - What are our core principles?
   - What tensions do we prioritize? (Accuracy vs. fairness? Speed vs. caution?)
   
   Example Principles:
   - Fairness: No system should systematically harm protected groups
   - Transparency: Affected individuals deserve explanation
   - Accountability: Someone is responsible for each system's ethics
   - Beneficence: AI should benefit intended users and stakeholders
   - Autonomy: Humans retain decision authority in high-stakes contexts
```

### 2. Governance Process Design

Define decision authority and escalation:

```
Governance Decision Architecture:

System Classification:
┌─────────────────────────────────────────────────────────┐
│ GREEN (Low Risk)                                        │
│ Examples: Content recommendations, performance tracking │
│ Risk Profile: No significant individual harm possible   │
│ Approval: Governance Lead signature                    │
│ Timeline: <1 week to approval                           │
│ Monitoring: Quarterly review                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ YELLOW (Medium Risk)                                    │
│ Examples: Hiring screeners, fraud detection, loan apps  │
│ Risk Profile: Significant impact on individuals         │
│ Approval: Director-level + Ethics Board review         │
│ Timeline: 2-3 weeks to approval                         │
│ Monitoring: Weekly review of key metrics               │
│ Conditions: Fairness audit <3% disparity required      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ RED (High Risk)                                         │
│ Examples: Medical diagnosis, parole decisions, etc.     │
│ Risk Profile: Significant harm if wrong; protected groups│
│ Approval: C-suite + Ethics Board consensus             │
│ Timeline: 4+ weeks; potential public review            │
│ Monitoring: Daily fairness metrics; escalation alerts   │
│ Conditions: Human review layer required; strong explainability
└─────────────────────────────────────────────────────────┘

Decision Authority Matrix:

┌──────────────────┬─────────────┬────────────┬───────────┐
│ Risk Level       │ Can Approve │ Can Reject │ Can Waive │
├──────────────────┼─────────────┼────────────┼───────────┤
│ GREEN            │ Lead (Y/N)  │ Lead (Y/N) │ Lead (Y/N)│
│ YELLOW           │ Director    │ Director   │ Executive │
│ RED              │ C-suite     │ C-suite    │ CEO       │
│ Legal waiver     │ Legal team  │ Legal team │ N/A       │
└──────────────────┴─────────────┴────────────┴───────────┘

Required Governance Reviews:

For all systems:
  1. Risk Assessment (fairness, safety, transparency, legal, reputational)
  2. Stakeholder Impact Analysis (who benefits, who is harmed)
  3. Governance Decision Log (all approvals auditable)

For YELLOW+ systems:
  4. Fairness Audit (quantified metrics, <3% disparity or mitigation)
  5. Compliance Review (applicable regulations)
  6. Ethics Board Review (recommended for YELLOW, required for RED)

For RED systems:
  7. Human Review Layer (person-in-the-loop for final decision)
  8. Explainability Audit (users can understand decision logic)
  9. Community Stakeholder Consultation (affected communities heard)
```

### 3. Ethics Board Design

Define the ethics governance body:

```
Ethics Board Charter

Purpose:
Review high-risk AI systems; ensure responsible AI alignment with 
organizational values; make governance decisions on escalated systems.

Composition:
- Chair: Chief Ethics Officer (or equivalent)
- Members:
  * Risk Lead (3-5 years governance experience)
  * Fairness Lead (ML fairness expertise)
  * Compliance Officer (Legal/regulatory)
  * Privacy Lead (Data governance)
  * Affected Community Representative (rotating)
  * Technical Lead (ML/AI system design)

Total: 6-7 members (diverse perspectives)

Voting Rules:
- Consensus preferred; documented dissent allowed
- Simple majority for approval (4/7 yes votes)
- RED systems require supermajority (5/7 yes votes)
- All votes logged; reasoning documented

Meeting Cadence:
- Weekly review of escalated systems (30-60 min)
- Monthly full governance review (2-3 hours)
- Quarterly strategic review (2-3 hours)

Escalation Triggers:
- Systems with fairness disparity >5%
- Systems flagged as non-compliant with regulation
- Systems with unresolved safety concerns
- Systems involving vulnerable populations
- Media/public controversy
- Regulatory inquiry

Decision Authority:
- GREEN systems: No ethics board review required
- YELLOW systems: Ethics board review recommended (not required)
- RED systems: Ethics board approval required for deployment
- Waivers: Only ethics board can approve waivers to governance requirements

Monitoring Authority:
- Post-deployment: Ethics board can recommend system changes or de-provisioning
- If monitoring shows material harm: Can recommend immediate moratorium
- Appeal process: Teams can appeal ethics board decisions; CEO is final authority
```

### 4. Fairness Standards & Metrics

Define organizational fairness commitments:

```
Fairness Standards

Core Commitment:
"We measure and monitor fairness across protected groups. No AI system 
should systematically disadvantage any group."

Fairness Metrics (required for decision systems):

1. Demographic Parity
   - Acceptable: <3% disparity in positive outcome rate
   - Concerning: 3-5% disparity (requires mitigation or escalation)
   - Unacceptable: >5% disparity (requires remediation before deployment)

2. Equalized Odds
   - Acceptable: <3% disparity in TPR/FPR across groups
   - Concerning: 3-5% (requires mitigation)
   - Unacceptable: >5% (requires remediation)

3. Adverse Impact Ratio (Fair Lending standard)
   - Acceptable: ≥0.80 (4/5 rule met)
   - Unacceptable: <0.80 (disparate impact)

4. Calibration (Predictive Parity)
   - Acceptable: <5% precision gap across groups
   - Concerning: 5-10% (requires investigation)
   - Unacceptable: >10%

Protected Attributes (assess all applicable):
- Race/ethnicity
- Gender
- Age
- Disability
- National origin
- Religion
- Sexual orientation
- Veteran status
- Any other attribute identified in risk assessment

Fairness Waiver Process:

If fairness metrics exceed thresholds, waiver requires:
1. Documented business justification (cannot be avoided)
2. Harm mitigation strategy (monitoring, appeals, human review)
3. Ethics board approval (for disparities >5%)
4. Affected community notice (for RED systems)
5. Continuous monitoring + escalation triggers
6. Annual waiver review (can it be removed?)

No waivers allowed for:
- Intentional discrimination
- Systems without monitoring
- Systems without escalation plan
```

### 5. Transparency & Explainability Standards

Define how systems explain decisions:

```
Transparency Framework

Core Requirement:
"If we cannot explain why an AI system made a decision, we cannot deploy it."

Transparency Levels:

Level 1 (Most Transparent):
- Interpretable model (logistic regression, decision tree, rule-based)
- Feature importance documented
- Decision logic explainable to non-technical stakeholders
- Example: "We declined your loan because your debt-to-income ratio 
  (1.2) exceeds our threshold (1.0)"

Level 2 (Moderately Transparent):
- Complex model with explainability layer (SHAP, LIME, attention)
- Key factors identified for each decision
- Technical explanation available; lay summary for users
- Example: "We declined your loan because of income level and debt amount"

Level 3 (Low Transparency):
- Black-box model
- Only overall decision available; no factor explanation
- Can only verify fairness retrospectively
- NOT ACCEPTABLE for high-stakes decisions

Required Transparency Level by Decision Type:

┌─────────────────────────────────────────┬──────────┐
│ Decision Domain                         │ Min Lvl  │
├─────────────────────────────────────────┼──────────┤
│ Content recommendation                  │ Level 3  │
│ Fraud detection (expert review)         │ Level 2  │
│ Hiring screening                        │ Level 2  │
│ Credit/lending decision                 │ Level 1  │
│ Medical diagnosis/recommendation        │ Level 1  │
│ Criminal justice (parole, sentencing)   │ Level 1  │
└─────────────────────────────────────────┴──────────┘

User-Facing Disclosure Requirements:

For all automated decisions:
1. Inform user: "An automated system helped make this decision"
2. Explain factors: Key factors that influenced decision
3. Provide appeal: User can request human review
4. Offer access: User can request copy of data used

GDPR Art. 22 requires:
- Right to human review of significant automated decisions
- Right to explanation of decision
- Right to challenge decision

Implementation:
- Standard disclosure language in decision notification
- Dashboard showing user's key factors
- Appeal request mechanism (within 30 days)
- Human review process (decision within 5 business days)
```

### 6. Monitoring & Escalation Framework

Define what gets monitored and when teams escalate:

```
Continuous Monitoring Framework

All Production Systems:

Daily Monitoring:
- System uptime and error rates
- Input data quality checks
- Output volume and distribution

YELLOW+ Systems (Weekly):
- Fairness metrics (demographic parity, equalized odds)
- Accuracy metrics (no significant degradation)
- User feedback and appeal rate

RED Systems (Daily):
- Fairness metrics
- Accuracy metrics
- Model drift detection
- User appeals and outcomes

Escalation Triggers:

┌─────────────────────────────────┬──────────────┬───────────┐
│ Condition                       │ Alert Level  │ Escalate  │
├─────────────────────────────────┼──────────────┼───────────┤
│ Fairness disparity >5%          │ CRITICAL     │ Ethics Bd │
│ Fairness disparity 3-5%         │ HIGH         │ Director  │
│ Accuracy drop >5%               │ HIGH         │ Director  │
│ Regulatory compliance failure   │ CRITICAL     │ Legal+CEO │
│ User appeal rate >10%/day       │ MEDIUM       │ Director  │
│ Unplanned offline >1 hour       │ CRITICAL     │ Director  │
│ Data breach or security issue   │ CRITICAL     │ CISO+CEO  │
│ Media/public controversy        │ HIGH         │ PR+CEO    │
└─────────────────────────────────┴──────────────┴───────────┘

Escalation Process:

1. Alert triggered (automated)
2. Notify on-call monitor (within 15 min)
3. Initial assessment (within 1 hour)
4. Escalation to authority (within 2-4 hours)
5. Investigation + remediation planning (within 24 hours)
6. Remediation execution (timeline depends on severity)
7. Verification + documentation (within 5 business days)
8. Post-incident review (within 2 weeks)

Remediation Options:
- Adjust decision threshold (temporary)
- Retrain model with fairness constraints
- Add human review layer
- Adjust monitoring thresholds
- De-provision system (last resort)
```

### 7. Governance Roles & Training

Define roles and accountability:

```
Governance Roles & Responsibilities

Role: Chief Ethics Officer
- Responsibility: Oversee AI ethics governance; chair ethics board
- Authority: Approve GREEN systems; recommend YELLOW; escalate RED
- Training: 2-3 years ethics/governance experience; specialized training
- Accountability: Ethics policy compliance; timely escalations; board effectiveness

Role: Risk Assessment Owner (per system)
- Responsibility: Conduct risk assessment; document all risks
- Authority: Can approve GREEN systems if trained
- Training: Risk framework, fairness metrics, compliance basics
- Accountability: Assessment accuracy; completeness; timeliness

Role: Ethics Board Member
- Responsibility: Review escalated systems; make governance decisions
- Authority: Co-decide on RED system approvals
- Training: 1-2 days annual ethics training; governance framework review
- Accountability: Meeting attendance; decision documentation

Role: Fairness Auditor
- Responsibility: Conduct bias audits; quantify fairness metrics
- Authority: Can recommend fairness waivers (not approve)
- Training: ML fairness methods; statistical testing; compliance standards
- Accountability: Audit rigor; metric accuracy; documentation

Role: Compliance Officer
- Responsibility: Verify regulatory compliance; track remediation
- Authority: Can block deployment if critical compliance gaps
- Training: GDPR, HIPAA, Fair Lending, state AI laws; evolving regulations
- Accountability: Compliance verification accuracy; remediation tracking

Role: System Owner (per system)
- Responsibility: Responsible for system ethics throughout lifecycle
- Authority: Accountable to ethics governance; must comply with requirements
- Training: System-specific governance training
- Accountability: Governance compliance; monitoring; escalation response

Required Governance Training:

All staff: 1 hour/year governance overview
Risk assessment owners: 8 hours/year (risk framework, metrics, compliance)
Ethics board members: 16 hours/year (ethics, governance, regulatory)
Chief Ethics Officer: Continuous professional development
```

## Example

### Organizational Framework: Tech Company Building Recommendation Systems

**Company:** Mid-size SaaS platform with 500+ AI systems  
**Challenge:** Scalable governance framework for 50+ new recommendation systems/year  

#### 1. Governance Philosophy

"We build recommendation systems that help users discover what matters to them, while preventing algorithmic harms like filter bubbles, manipulation, and discrimination. Our framework ensures fairness, transparency, and accountability at scale."

#### 2. Classification & Approval Process

**System Classification for Recommendation Systems:**

**GREEN (Standard Recommendation):**
- Examples: Product recommendations, article suggestions, music playlists
- Risk: Low (user ignores recommendation; switches to alternative)
- Approval: Product Lead signature
- Timeline: <1 week
- Monitoring: Monthly review of user satisfaction

**YELLOW (Personalization with Behavioral Impact):**
- Examples: Job recommendations, educational content, news feeds
- Risk: Medium (system shapes user behavior and knowledge)
- Approval: Product Director + brief ethics board review
- Timeline: 2 weeks
- Monitoring: Weekly metrics on engagement and diversity
- Fairness Requirement: No documented demographic bias

**RED (High-Stakes Personalization):**
- Examples: Healthcare information, financial products, legal resources
- Risk: High (poor recommendation causes material harm)
- Approval: VP + full ethics board review
- Timeline: 4+ weeks
- Monitoring: Daily fairness/accuracy metrics
- Fairness Requirement: <3% demographic disparity; documented audit

#### 3. Fairness Requirements for Recommendations

- "No recommendation system should show systematically lower-quality results to any demographic group"
- Measure: Coverage (% of users receiving recommendations), Diversity (variety of options shown)
- Threshold: <5% disparity in coverage between demographic groups
- Monitoring: Weekly analysis of recommendation quality by user demographic

#### 4. Ethics Board Composition

- Chief Product Officer (Chair)
- Head of Data Science (Model expertise)
- Compliance Officer (Regulatory knowledge)
- User Research Lead (Stakeholder voice)
- Accessibility Lead (User needs perspective)
- External AI ethics advisor (Annual rotation)

#### 5. Escalation Triggers

- Fairness disparity >5% between demographic groups → Director review
- Fairness disparity >10% → Ethics board emergency session
- User complaint about manipulation or bias → Immediate investigation
- Media coverage → PR + ethics board coordination
- Regulatory inquiry → Legal + ethics board + CEO

#### 6. Monitoring & Post-Deployment

```
Standard Monitoring (all systems, weekly):
- Recommendation coverage by user demographic
- Click-through rate by demographic group
- User satisfaction by demographic group
- Diversity of recommendations (novelty, domain variety)

Alert Rules:
- If coverage disparity exceeds 5% → investigate
- If user satisfaction drops >10% → investigate
- If diversity drops >15% → investigate

Governance Log:
- Every system has documented fairness baseline
- Weekly monitoring results logged
- Any alert investigation documented
- Remediation actions tracked through completion
```

---

Built with [Claudient](https://github.com/Claudients/Claudient)
