# Service Level Agreement (SLA) Guarantees

This document defines the uptime SLAs, penalties, and escalation procedures for Claudient enterprise services.

---

## SLA Tiers by Service

### Matrix-Theme
- **Target Uptime**: 99.9%
- **Monthly Downtime Allowance**: 43.2 minutes
- **Quarterly Downtime Allowance**: 129.6 minutes
- **Annual Downtime Allowance**: 518.4 minutes

**Use Cases**: UI rendering, theme management, component library access.

### SVG-Inspector
- **Target Uptime**: 99.95%
- **Monthly Downtime Allowance**: 21.6 minutes
- **Quarterly Downtime Allowance**: 64.8 minutes
- **Annual Downtime Allowance**: 259.2 minutes

**Use Cases**: SVG analysis, asset validation, design system inspection.

### Swarm-Sandbox
- **Target Uptime**: 99.5%
- **Monthly Downtime Allowance**: 216 minutes
- **Quarterly Downtime Allowance**: 648 minutes
- **Annual Downtime Allowance**: 2,592 minutes (43.2 hours)

**Use Cases**: Distributed sandbox environments, multi-agent testing, experimental workloads.

---

## Uptime Definition

**Uptime** is measured as the percentage of time the service is accessible and responding to valid requests without errors within SLA parameters:

- HTTP(S) endpoints return status codes 200-299 or 3xx (except 304) within 5 seconds
- WebSocket connections remain stable for active sessions
- API response time remains under P95 latency thresholds (service-specific)
- No cascading failures affecting >10% of users simultaneously

**Downtime** begins when:
1. Automated monitoring detects service unavailability
2. Triggers are verified by manual oversight (within 5 minutes)
3. Ends when service fully recovers and validates data consistency

**Exclusions** (do not count toward SLA):
- Scheduled maintenance (announced >7 days in advance)
- Customer-side network or infrastructure failures
- DDoS attacks or force majeure events
- Beta or preview features (marked explicitly)
- Services in "experimental" mode

---

## Service Credits (Penalties)

Credits are applied to the customer's account for the following month. Credits are the exclusive remedy for SLA breaches.

### Matrix-Theme (99.9% SLA)

| Monthly Uptime | Credit |
|---|---|
| 99.0% to <99.9% | 10% of monthly fee |
| 98.0% to <99.0% | 25% of monthly fee |
| 95.0% to <98.0% | 50% of monthly fee |
| <95.0% | 100% of monthly fee |

### SVG-Inspector (99.95% SLA)

| Monthly Uptime | Credit |
|---|---|
| 99.5% to <99.95% | 10% of monthly fee |
| 99.0% to <99.5% | 25% of monthly fee |
| 97.0% to <99.0% | 50% of monthly fee |
| <97.0% | 100% of monthly fee |

### Swarm-Sandbox (99.5% SLA)

| Monthly Uptime | Credit |
|---|---|
| 99.0% to <99.5% | 10% of monthly fee |
| 97.0% to <99.0% | 25% of monthly fee |
| 95.0% to <97.0% | 50% of monthly fee |
| <95.0% | 100% of monthly fee |

**Credit Limits**:
- Maximum cumulative credits per month: 100% of fees for that service
- Credits expire if unused within 12 months
- Credits apply only to affected services (cross-service failures are evaluated per component)

---

## Escalation Procedures

### Level 1: Detection & Initial Response (0–30 minutes)

**Trigger**: Automated alerts detect service anomaly
- Incident ticket auto-created in customer dashboard
- Status page updated to "Investigating"
- Email notification sent to primary and secondary contacts
- Support team begins root cause analysis

**Customer Notification**: "We have detected an issue affecting [Service]. Our team is investigating."

**Target Resolution**: 15 minutes for severity P1 (complete outage)

---

### Level 2: Escalation (30–2 hours)

**Trigger**: Issue unresolved after 30 minutes

**Actions**:
- Escalation to on-call engineering lead
- Incident commander assigned
- Conference bridge opened (dial-in details sent via SMS + email)
- 15-minute status update cadence to customer (via dashboard + email)

**Customer Notification**: "This incident impacts [X%] of requests. Here is what we're doing: [action]. Estimated resolution: [time]."

**Target Resolution**: 90 minutes for severity P1, 4 hours for P2

---

### Level 3: Critical Escalation (2+ hours)

**Trigger**: Issue unresolved after 2 hours AND affects >50% of users OR critical business function

**Actions**:
- Executive escalation (VP/Director level)
- Customer technical account manager (TAM) joins call
- Fallback/failover procedures initiated (if available)
- Root cause analysis team assembled
- 5-minute update cadence via all channels

**Customer Notification**: "This is a critical incident. Here is our recovery plan with timeline. We will provide updates every 5 minutes."

**Post-Incident**: 
- RCA document due within 24 hours
- Executive briefing call within 48 hours
- Service credit confirmed within 3 business days

---

## Severity & Response SLAs

| Severity | Definition | First Response | Update Cadence | Escalation |
|---|---|---|---|---|
| **P1** | Service completely unavailable; affects all users or critical path | 5 minutes | Every 15 min | Level 1 @ 30 min, Level 2 @ 2 hrs |
| **P2** | Significant feature degradation; affects >10% of users | 15 minutes | Every 30 min | Level 1 @ 1 hr, Level 2 @ 4 hrs |
| **P3** | Minor feature impact; limited user effect | 1 hour | Every 2 hrs | Tracked but no auto-escalation |
| **P4** | Cosmetic issue; no functional impact | 4 hours | Daily | No escalation |

---

## Monitoring & Uptime Verification

### Synthetic Monitoring
- Third-party monitoring probes check service health every 60 seconds from 3 geographic regions
- Probes validate full transaction paths (auth, request, response)
- Results published in real-time on status page: `status.claudient.com`

### Customer Verification
Customers may verify uptime independently:
- Public API status endpoint: `GET /api/health`
- Detailed metrics: `GET /api/status` (authenticated)
- Historical data: `status.claudient.com/history/[service]`

### Dispute Resolution
If customers dispute uptime calculations:
1. Submit request within 30 days of incident
2. Provide evidence and reasoning
3. Joint engineering review within 5 business days
4. Final determination by CTO (binding)

---

## Customer Responsibilities

To maintain SLA coverage, customers must:

1. **Use production endpoints**: SLAs apply only to `https://api.claudient.com` and regional endpoints
2. **Implement retry logic**: Exponential backoff (1s, 2s, 4s, 8s, 16s max)
3. **Monitor your integration**: Integrate with `status.claudient.com` webhook for real-time alerts
4. **Notify us of abuse**: Report unusual traffic patterns or potential DDoS targeting
5. **Keep API keys secure**: Compromised keys are not covered by SLA

---

## Scheduled Maintenance

Scheduled maintenance is excluded from uptime calculations but counts against maintenance windows.

### Maintenance Windows
- **Standard Window**: Monthly, second Tuesday 02:00–04:00 UTC
- **Extended Window**: Quarterly, pre-announced 30 days in advance, max 4 hours
- **Emergency Maintenance**: Announced with 6 hours notice when required for security

### Maintenance Communication
- Scheduled maintenance appears on status page 7 days prior
- Pre-maintenance email: 72 hours before
- During maintenance: Live updates every 15 minutes
- Post-maintenance: Summary report within 2 hours

---

## Financial Terms

### Service Credit Request Process
1. Submit credit request within 30 days of incident via support dashboard
2. Include dates, times, evidence of impact (logs, revenue loss, etc.)
3. Claudient validates uptime data within 3 business days
4. Credit applied to next billing cycle

### Non-Transferable
- Credits cannot be transferred, refunded, or applied retroactively
- Credits do not carry over beyond 12 months

### Sole Remedy
Service credits are the **exclusive remedy** for SLA breaches. Customer waives:
- Consequential damages
- Loss of revenue claims
- Punitive damages
- Claims exceeding the annual service fees paid

---

## Exclusions & Force Majeure

The following events are not covered by SLA guarantees:

1. **Natural Disasters**: Earthquakes, floods, hurricanes, etc.
2. **Wars & Civil Unrest**: Military action, terrorism, civil disturbance
3. **Acts of Government**: Embargoes, sanctions, regulatory seizure
4. **ISP/Carrier Failure**: Backbone provider outages beyond our control
5. **Cyber Attacks**: DDoS, zero-day exploits, nation-state attacks (except we mitigate known vectors)
6. **Customer Misuse**: 
   - Exploitation of vulnerabilities
   - Reverse engineering
   - Excessive load testing without permission
   - Violation of terms of service
7. **Third-Party Dependencies**: Failures in CDN, DNS, cloud provider infrastructure we depend on

---

## Review & Amendments

This SLA is reviewed quarterly. Updates effective immediately unless otherwise specified.

- Last Updated: June 2026
- Next Review: September 2026
- Amendment History: Available in compliance portal
