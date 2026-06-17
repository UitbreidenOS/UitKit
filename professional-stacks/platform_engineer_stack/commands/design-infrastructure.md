# /design-infrastructure

## When to activate

Use this command when designing cloud infrastructure for a new service or major redesign of existing infrastructure. Provides guidance on compute, networking, storage, disaster recovery, cost, and security planning.

## When NOT to use

For minor configuration tweaks, troubleshooting existing systems, or operational changes. For those, use infrastructure audit or runbook skills.

## Instructions

When you invoke this command, follow this workflow:

### 1. Gather Requirements (5 minutes)

Ask the user:
- **Traffic:** Requests/sec (average and peak)
- **Data volume:** GB/TB, growth rate
- **Latency target:** p99 acceptable latency
- **Availability target:** 99.9%, 99.95%, 99.99%?
- **Compliance:** HIPAA, PCI-DSS, SOC2, GDPR?
- **Team:** Size, Kubernetes expertise level?
- **Budget:** Monthly cost constraints?
- **Global vs Single Region:** Geographic redundancy needed?

### 2. Design Layers (30 minutes)

Create architecture covering:

**Compute Layer:**
- Platform: EKS, ECS, Lambda, self-managed?
- Instance sizing and scaling policy
- Multi-region strategy

**Data Layer:**
- Primary database selection and schema
- Backup/replication strategy
- Encryption

**Networking:**
- VPC/subnet design
- Load balancer configuration
- Security groups/NACLs

**Storage:**
- Object storage (S3, GCS) layout
- Retention policies
- Encryption

### 3. Define Resilience

**High Availability:**
- Multi-zone deployment
- Health check design
- Graceful shutdown

**Disaster Recovery:**
- RTO/RPO targets
- Backup strategy
- Failover procedure

### 4. Estimate Costs

Provide monthly cost breakdown:
- Compute (instances/pods)
- Database
- Storage
- Network (data transfer)
- Total

### 5. Document Architecture

Create:
- ASCII diagram of data flow
- Decision log (why this choice over alternatives)
- Deployment procedure checklist
- Security checklist

## Example Invocation

**User:** "I'm building a real-time data processing service. 500 req/sec average, 2000 peak. Need 99.95% uptime. GDPR compliant. Two engineers, no Kubernetes experience yet."

**You should:**

1. Recommend ECS Fargate (managed Kubernetes is complex for 2 engineers)
2. Design for horizontal scaling (Lambda less suitable for 500 req/sec baseline)
3. Multi-AZ RDS PostgreSQL with read replicas
4. S3 for data lake with Glacier for archives
5. Cost estimate: ~$4,000/month
6. Document everything in plain language (no deep Kubernetes expertise)
7. Provide deployment checklist they can follow

## Success Criteria

A well-designed infrastructure plan:

1. **Meets SLOs** — Clearly shows how architecture achieves availability targets
2. **Scales horizontally** — Explains how to handle 10x traffic
3. **Documented** — Architecture decisions written down
4. **Costed** — Users understand monthly spend
5. **Secure** — Encryption, authentication plan in place
6. **Recoverable** — RTO/RPO targets clear, backup strategy defined
7. **Operationally feasible** — Team can actually implement and maintain it

---
