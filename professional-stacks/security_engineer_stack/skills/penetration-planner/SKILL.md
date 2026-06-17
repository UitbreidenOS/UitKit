# Penetration Planner

## When to activate

Use this skill when you need to:
- Design the scope and objectives of a penetration test engagement
- Identify and categorize target systems (in-scope, out-of-scope, restricted)
- Define rules of engagement (RoE) and testing boundaries
- Establish success metrics and KPIs for the engagement
- Coordinate testing windows and schedules with IT/infrastructure teams
- Document assumptions, constraints, and mitigation strategies
- Create executive summaries and stakeholder communication plans

Trigger scenarios:
- New engagement scope definition before test execution
- Scope refinement when client requirements change mid-engagement
- Multi-phase testing planning (reconnaissance → exploitation → post-exploitation)
- Cross-team coordination for sensitive infrastructure (production, payment systems, customer data)

## When NOT to use

Do not activate this skill when:
- You are actively conducting a penetration test (use execution-focused skills instead)
- Defining general security policies or hardening guidelines (not engagement-specific)
- Handling vendor risk assessments or third-party security compliance reviews
- Planning vulnerability scanning (differs from targeted penetration testing — see assessment-planner)
- The engagement scope is already frozen and approved — just execute per documented plan
- You need to analyze penetration test results or generate remediation reports

## Instructions

### Phase 1: Engagement Discovery

Before designing scope, gather critical context:

1. **Client/Stakeholder Intake**
   - What are the primary security concerns? (insider threats, supply chain, external attackers, compliance)
   - What systems are deemed "critical"? (production, customer-facing, payment, data stores)
   - What is the testing environment? (production, staging, isolated lab)
   - Are there regulatory or compliance drivers? (PCI-DSS, HIPAA, SOC 2, industry-specific)
   - Who are the key approvers and technical contacts?

2. **Asset Inventory & Mapping**
   - Enumerate all systems: applications, infrastructure, APIs, third-party integrations
   - Categorize by risk profile: high (customer data, payment), medium (internal tools), low (documentation, static content)
   - Identify dependency chains: what downstream systems depend on each target?
   - Note network topology: DMZ, internal segmentation, cloud vs. on-premise

3. **Constraint & Risk Assessment**
   - What are hard constraints? (production uptime requirements, business hours only, no DOS testing)
   - Identify sensitive data: PII, payment card data, credentials, secrets
   - Assess potential blast radius: could an attack on one system cascade to others?
   - Determine blackout periods: maintenance windows, high-traffic periods, compliance audits

### Phase 2: Scope Definition

Create a three-tier scope matrix:

**In-Scope (Full Testing)**
- Target systems where full penetration testing is approved
- Include: attack vectors, exploitation, credential testing, lateral movement
- Specify testing depth: shallow (authentication, basic access), medium (privilege escalation), deep (data exfiltration, persistence)

**Out-of-Scope (Do Not Test)**
- Systems explicitly prohibited: production payment processors, third-party SaaS, customer-owned infrastructure
- Data handling: no exfiltration of production customer data, PII, trade secrets
- Techniques: no physical penetration, social engineering of employees, supply chain testing (unless explicitly approved)

**Restricted/Conditional Scope (Limited Testing)**
- Systems requiring advance notice or IT coordination: databases, critical infrastructure
- Time-gated testing: off-hours only, specific scheduled windows
- Approval-gated testing: contact on-call team before attempting exploitation

### Phase 3: Rules of Engagement (RoE) Document

Structure the RoE as:

1. **Testing Objectives** (narrative, 1-2 sentences)
   - Example: "Assess the resilience of our API authentication layer to account takeover and credential stuffing attacks."

2. **Approved Testing Techniques**
   - Authentication attacks: credential spraying, brute force, session hijacking, MFA bypass research
   - API testing: fuzzing, injection, broken object-level authorization (BOLA), rate limiting bypass
   - Lateral movement: network scanning, credential reuse, trust exploitation
   - Data exfiltration: read-only access verification (do not extract actual data)
   - Infrastructure testing: cloud misconfiguration scanning, IAM policy analysis

3. **Prohibited Actions**
   - No data modification or deletion (read-only access only)
   - No denial-of-service or resource exhaustion attacks
   - No multi-day sleeping processes or persistent backdoors (exception: time-boxed persistence testing if pre-approved)
   - No testing of third-party integrations without explicit written approval
   - No social engineering of employees or contractors

4. **Communication Protocol**
   - On-call contact for access issues, emergencies, or anomaly detection
   - Notification requirements if a test triggers alerts or incident response
   - Escalation path if a test discovers critical vulnerability
   - Daily/weekly status syncs if multi-phase engagement

5. **Post-Test Cleanup**
   - Specify artifact removal deadlines (credentials, test accounts, logs)
   - Incident response playbook: what to do if legitimate systems are compromised
   - Evidence preservation: what logs/data must be retained for reporting

### Phase 4: Target System Prioritization

Create a prioritization matrix based on:

- **Risk Criticality**: How much customer/business impact if compromised?
- **Exploitability**: How likely are common attack vectors to succeed?
- **Attack Path Significance**: Does this system enable lateral movement or privilege escalation?
- **Resource Requirement**: Time and skill investment needed for effective testing

Prioritize high-criticality + high-exploitability systems first. Sequence testing to build on reconnaissance: scan → identify weak points → focused exploitation → lateral movement.

### Phase 5: Success Metrics & Deliverables

Define what "success" means for each phase:

**Reconnaissance Phase**
- Metric: Number of exposed attack surfaces identified (APIs, authentication endpoints, unpatched services)
- Deliverable: Attack surface map, endpoint inventory, technology stack analysis

**Exploitation Phase**
- Metric: Number of confirmed vulnerabilities with proof-of-concept
- Deliverable: Exploitation timeline, evidence (screenshots, logs), exploitation playbooks
- KPI: % of high-criticality systems with confirmed exploitable vulnerabilities

**Post-Exploitation Phase**
- Metric: Lateral movement depth (how far can an attacker move through the network?)
- Metric: Data access scope (what sensitive data is accessible from compromised systems?)
- Deliverable: Attack chain diagrams, lateral movement paths, privilege escalation chains
- KPI: Time-to-impact (how quickly can an attacker move from initial compromise to critical asset access?)

**Reporting Phase**
- Metric: Remediation clarity (can the client implement fixes without follow-up clarification?)
- Metric: Risk prioritization accuracy (do high-risk findings actually pose the greatest business risk?)
- Deliverable: Executive summary, detailed technical findings, remediation roadmap, risk dashboard

### Phase 6: Stakeholder Coordination

1. **IT/Ops Handoff Meeting**
   - Present testing schedule, estimated duration, resource requirements
   - Review monitoring/alerting: which alerts should be suppressed or escalated?
   - Establish communication channels: Slack, email, on-call rotation
   - Confirm cleanup procedures and artifact removal timeline

2. **Executive Briefing**
   - Communicate testing objectives and expected outcomes (not granular technical details)
   - Clarify scope limitations: what is *not* being tested and why
   - Present risk context: how do findings connect to business objectives?
   - Establish reporting frequency and stakeholder update cadence

3. **Legal/Compliance Sign-Off**
   - Ensure written approval of RoE and scope
   - Confirm no regulatory conflicts (e.g., GDPR, CCPA implications for testing)
   - Document approval trail for audit purposes

## Example

**Scenario**: A fintech startup conducting a pre-Series B security assessment of their API and web platform.

**Engagement Discovery**
- Client concern: Credential stuffing and account takeover on their mobile app
- Critical systems: User authentication API, payment processing service, customer data warehouse
- Environment: Production with 500K active users; 99.9% uptime SLA required
- Compliance: PCI-DSS Level 1 (payment processing), SOC 2 Type II (customer trust)

**Scope Definition**

*In-Scope (Full Testing):*
- Authentication API: /login, /register, /password-reset endpoints (read-only access, no credential harvest)
- Mobile app: API endpoint testing, credential reuse, session hijacking, MFA bypass research
- Admin dashboard: privilege escalation from user → admin roles, authorization logic flaws
- Backend infrastructure: API gateway configuration, IAM policies, cloud storage bucket permissions

*Out-of-Scope:*
- Payment processor integration (third-party, PCI-DSS certified)
- Customer data warehouse (production data, no read access)
- Third-party vendor integrations (Stripe, Auth0, AWS services — assess via configuration only)
- Physical security, social engineering, supply chain testing

*Restricted:*
- Load testing on authentication API (advance 24-hour notice to ops, off-hours only)
- Credential brute force testing (5-minute windows, max 100 requests, risk of account lockout)

**Rules of Engagement**
- Testing window: 2 weeks, Monday–Friday 10 AM–6 PM PT, excluding days with scheduled maintenance
- Prohibited: No DOS attacks, no customer data exfiltration, no modification of live data, no testing third-party APIs
- On-call contact: security@fintech.local, Slack #pentest-engagement, 24-hour response SLA
- Notification: Alert ops immediately if credential spray triggers authentication alerts
- Cleanup: All test credentials deleted, API logs preserved for 30 days post-engagement

**Success Metrics**
- Reconnaissance: Identify 100% of authentication endpoints, document API surface, map IAM policies
- Exploitation: Achieve proof-of-concept for each vulnerability class (auth bypass, BOLA, privilege escalation)
- Post-Exploitation: Demonstrate lateral movement paths from app tier to backend services
- KPI: Time-to-admin: How long to escalate from unauthenticated user to admin role?

**Stakeholder Coordination**
- IT sync: Authentication API limits 1000 req/min; ops can suppress credential spray alerts for testing window
- Executive briefing: Present risk dashboard showing % of authentication endpoints vulnerable to each attack class
- Legal sign-off: Written engagement letter, RoE approval, no regulatory conflicts confirmed
