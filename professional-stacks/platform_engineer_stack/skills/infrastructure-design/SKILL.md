# Infrastructure Design

## When to activate

When designing cloud infrastructure for new services, scaling existing systems, planning disaster recovery, optimizing costs, or conducting infrastructure reviews. Also when evaluating trade-offs between compute options, networking topologies, storage strategies, or disaster recovery approaches.

## When NOT to use

For minor configuration tweaks or troubleshooting existing infrastructure. Use this skill when designing from scratch or making major architectural decisions.

## Instructions

### 1. Gather Requirements

Before designing, establish:

**Application Requirements:**
- Expected traffic volume (requests/sec, peak vs average)
- Data volume (GB/TB), growth rate
- Latency requirements (p99 target)
- Availability target (99.9%, 99.95%, 99.99%)
- Compliance requirements (HIPAA, PCI-DSS, SOC2, etc.)

**Operational Requirements:**
- Team size and skill level (Kubernetes expertise, automation capability)
- On-call support model (24/7, business hours, hybrid)
- Disaster recovery targets (RTO, RPO)
- Budget constraints

**Technology Stack:**
- Programming languages and frameworks
- Database types (SQL, NoSQL, time-series)
- Message queues or event systems
- Caching requirements

### 2. Design Core Architecture

Define the foundational layers:

**Compute Layer:**
- Platform: Kubernetes, ECS, Lambda, Heroku, or self-managed VMs
- Instance sizing: CPU, memory requirements per container
- Horizontal scaling: Min/max replicas, scaling triggers
- Vertical scaling: Reserved capacity, spot instances
- Network location: Single region, multi-region, edge

**Data Layer:**
- Primary database: PostgreSQL, MySQL, DynamoDB, BigQuery
- Backup strategy: Frequency, retention, tested recovery
- Replication: Synchronous vs asynchronous, read replicas
- Encryption: At-rest and in-transit, key management
- Schema design: Normalized, sharded, or partitioned

**Networking:**
- VPC/VNet: CIDR ranges, subnet layout (public/private)
- Load balancing: Application vs network load balancer
- Service mesh: Istio, Linkerd, or native load balancing
- Security groups/NACLs: Ingress/egress rules
- DNS: Internal service discovery, external domains
- CDN: For static content and API response caching

**Storage:**
- Object storage: S3, GCS, Azure Blob
- Bucket structure: By data type, tenant, or time period
- Lifecycle policies: Transition to cold storage, deletion
- Encryption and access control
- Backup and versioning

### 3. Define Resilience

Plan for failures:

**High Availability:**
- Multi-zone deployments: Replicas across availability zones
- Load balancer health checks: Endpoint, frequency, failure threshold
- Graceful shutdown: Connection draining, in-flight request completion
- Circuit breakers: Fail fast when downstream is unavailable

**Disaster Recovery:**
- RTO (Recovery Time Objective): How long can you be down?
- RPO (Recovery Point Objective): How much data loss is acceptable?
- Backup strategy: Daily snapshots? Continuous replication? Point-in-time recovery?
- Failover procedure: Automated or manual? How long to execute?
- Testing schedule: Monthly, quarterly, or annual DR drills

**Cost Optimization:**
- Identify non-critical workloads suitable for spot instances
- Reserved capacity for baseline traffic
- Auto-scaling policies to shed load during peak
- Metrics to track cost per request/transaction

### 4. Plan Security

Establish security posture:

**Authentication & Authorization:**
- Service-to-service auth: mTLS, API keys, or OAuth2
- User authentication: IAM, OIDC, or custom
- Secrets management: Vault, AWS Secrets Manager, or encrypted configs

**Network Security:**
- Firewall rules: Only necessary ports and protocols
- Egress filtering: Which external services can instances reach?
- VPN or private connectivity for sensitive data

**Compliance & Audit:**
- Encryption requirements: TLS 1.2+, AES-256
- Audit logging: Who accessed what, when
- Data retention: How long to keep logs and backups
- Penetration testing: Schedule and scope

### 5. Document Architecture

Create diagrams and docs:

**Architecture Diagram:**
- Show compute, data, networking, and external services
- Label connections and data flows
- Indicate redundancy and failover paths

**Decision Log:**
- Why Kubernetes vs ECS?
- Why PostgreSQL vs DynamoDB?
- Why multi-region vs single region?
- What was rejected and why?

**Cost Projection:**
- Baseline monthly cost estimate
- Cost at 2x and 10x traffic
- Cost optimization opportunities

**Deployment Procedure:**
- Steps to provision infrastructure
- Terraform/CloudFormation files
- Helm charts for Kubernetes
- Testing checklist before production

## Example

### Design: User Onboarding Service

**Requirements:**
- 1,000 requests/sec average, 5,000 peak
- 99.9% availability (1,000 minutes error budget per month)
- GDPR compliance required
- Multi-region deployment desired

**Compute:**
- Kubernetes on EKS (multi-region)
- Deployment: 3 replicas per region, minimum
- Auto-scaling: Scale up at 70% CPU, down at 30%
- Instance type: t3.large for staging, c5.xlarge for production

**Data:**
- PostgreSQL RDS: Multi-AZ primary with read replicas in other regions
- Backups: Daily snapshots, 30-day retention
- Replication: Asynchronous to read replicas (5 second lag acceptable)
- Sharding: Not needed until 10,000+ requests/sec

**Networking:**
- VPC CIDR: 10.0.0.0/16
- Private subnets: 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24 (one per AZ)
- Public subnets: 10.0.101.0/24, 10.0.102.0/24, 10.0.103.0/24 (NAT gateways)
- Load balancer: Application Load Balancer (ALB) with TLS termination
- Service mesh: Istio for observability and circuit breaking

**Security:**
- TLS 1.3 for all connections
- mTLS for service-to-service communication
- Secrets managed in AWS Secrets Manager, rotated every 90 days
- RBAC: Separate IAM roles for each service
- Network policies: Only permit necessary traffic between services

**Disaster Recovery:**
- RTO: 15 minutes (acceptable for non-critical onboarding)
- RPO: 1 hour (we can accept losing up to 1 hour of signups)
- Backup strategy: Continuous replication to standby region
- Failover: Automated DNS switch to secondary region if primary becomes unavailable
- Testing: Quarterly DR drills with failover simulation

**Cost Estimate:**
- EKS cluster: $73/month
- EC2 instances (6 nodes at c5.xlarge): $2,100/month
- RDS Multi-AZ: $2,500/month
- NAT Gateway: $32/month
- Data transfer: $200/month
- **Total: ~$4,900/month**

**Decision Log:**
- Why EKS + Kubernetes? Need multi-region, automatic scaling, and observability
- Why PostgreSQL? Structured data, ACID transactions required, known scaling patterns
- Why not DynamoDB? Requires application-level partitioning, operational complexity for this scale
- Why multi-region? Reduce latency for global users, survive region-level outages

---

## Success Criteria

A well-designed infrastructure:

1. **Meets SLOs:** Achieves target availability, latency, and error rates
2. **Scales horizontally:** Can handle 10x traffic by adding resources, not rewriting code
3. **Recoverable:** RTO/RPO targets are documented and tested quarterly
4. **Secure:** Encryption, authentication, and audit logging in place before production
5. **Observable:** Metrics, logs, and traces enable rapid issue diagnosis
6. **Documented:** Architecture decisions recorded; runbooks exist for common issues
7. **Cost-optimized:** No obvious waste; costs track with revenue or usage metrics

---
