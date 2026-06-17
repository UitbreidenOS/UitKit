# Security & Compliance Audit

## When to activate

When designing security architecture, planning zero-trust networks, auditing IAM policies, or preparing for compliance certifications (SOC2, HIPAA, PCI-DSS).

## When NOT to use

For non-critical or development-only systems where security is not a concern.

## Instructions

Security is not a feature; it's a requirement. Follow this framework to design defense-in-depth architecture:

### 1. Zero-Trust Security Model

Traditional (perimeter-based): "Trust everything inside the network"
Zero-trust: "Verify every request, regardless of source"

**Principles:**

```
1. Verify identity     → Every user, every service authenticated
2. Least privilege    → Minimal permissions for each principal
3. Assume breach      → Design for containment, not just prevention
4. Encrypt always     → TLS in transit, CMK at rest
5. Audit everything   → Log all access, changes, anomalies
```

**Architecture:**

```
┌─────────────────────────────────────────┐
│         External User                   │
│ (phone, browser, laptop, VPN)          │
└──────────────┬──────────────────────────┘
               │
               ↓ (Identity verification)
        ┌──────────────┐
        │ Entra ID /   │
        │ IAM / Okta   │
        └──────┬───────┘
               │
               ↓ (MFA required)
        ┌──────────────┐
        │ VPN / SSH    │
        │ MFA (TOTP)   │
        └──────┬───────┘
               │
               ↓ (Authorization check)
        ┌──────────────┐
        │ Authorization│
        │ Service      │
        │ (Athena)     │
        └──────┬───────┘
               │
               ↓ (Allowed access)
        ┌──────────────┐
        │ Application  │
        │ (mTLS, logs) │
        └──────────────┘
```

### 2. Identity & Access Management (IAM)

**AWS IAM structure:**

```
Organization
├── Root account (billing only, no resources)
└── Member accounts (dev, staging, prod)
    ├── IAM Roles (assume-only, no credentials)
    │   ├── Developer role (dev account permissions)
    │   ├── DevOps role (infrastructure permissions)
    │   └── DBA role (database admin permissions)
    ├── IAM Policies (least privilege)
    │   ├── ReadOnlyEC2 (read EC2, RDS, logs only)
    │   ├── DeployToECS (push images, update services)
    │   └── ManageVPC (VPC, subnets, security groups)
    └── Service roles (for applications)
        ├── Lambda execution role
        ├── ECS task execution role
        └── EC2 instance profile
```

**Least privilege policy example:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeNetworkInterfaces"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "us-east-1"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:GetLogEvents",
        "logs:FilterLogEvents"
      ],
      "Resource": "arn:aws:logs:us-east-1:ACCOUNT_ID:log-group:/aws/lambda/*"
    }
  ]
}
```

**Azure RBAC:**

```yaml
# Custom role: application deployment
apiVersion: authorization.azure.com/v1
kind: RoleDefinition
metadata:
  name: "Application Deployer"
permissions:
  - actions:
      - "Microsoft.ContainerRegistry/registries/push/read"
      - "Microsoft.ContainerService/managedClusters/agentPools/read"
      - "Microsoft.ContainerService/managedClusters/deploy/action"
    notActions: []
assignableScopes:
  - "/subscriptions/SUBSCRIPTION_ID"
```

### 3. Network Segmentation

**VPC/VNET design (security zones):**

```
┌─────────────────────────────────────────┐
│           VPC (10.0.0.0/16)             │
├─────────────────────────────────────────┤
│  Public Subnet (10.0.1.0/24)            │
│  └─ ALB (internet-facing)               │
│  └─ NAT Gateway (egress)                │
├─────────────────────────────────────────┤
│  Private Subnet A (10.0.2.0/24)         │
│  └─ Application servers (no internet)   │
│  └─ Outbound via NAT Gateway only       │
├─────────────────────────────────────────┤
│  Private Subnet B (10.0.3.0/24)         │
│  └─ Database (10.0.3.100/32 only)       │
│  └─ No internet access                  │
├─────────────────────────────────────────┤
│  Management Subnet (10.0.4.0/24)        │
│  └─ Bastion/jump host                   │
│  └─ Monitoring servers                  │
└─────────────────────────────────────────┘
```

**Security group rules (stateful firewall):**

```yaml
# ALB security group (public, allows HTTP/HTTPS from internet)
ingress:
  - protocol: tcp
    port: 80
    cidr: 0.0.0.0/0     # Allow from anyone
  - protocol: tcp
    port: 443
    cidr: 0.0.0.0/0

# Application security group (private, allows from ALB only)
ingress:
  - protocol: tcp
    port: 8080
    security_group_id: sg-alb  # Only from ALB

# Database security group (private, allows from app only)
ingress:
  - protocol: tcp
    port: 5432
    security_group_id: sg-app  # Only from application
```

**Network policies (zero-trust within cluster):**

```yaml
# Default deny all
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress

# Allow specific traffic
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
spec:
  podSelector:
    matchLabels:
      tier: api
  ingress:
    - from:
        - podSelector:
            matchLabels:
              tier: frontend
      ports:
        - protocol: TCP
          port: 8080
```

### 4. Encryption

**In-transit (TLS 1.3+):**

```
All traffic encrypted:
- Client → ALB: TLS 1.3
- ALB → Application: TLS 1.3
- Application → Database: TLS 1.3
- Application → Cache: TLS 1.3
- Service → Service mesh: mTLS (automatic)

Certificate management:
- Public certs: ACM (AWS Certificate Manager), free
- Internal certs: Vault, Cert-Manager
- Expiration monitoring: CloudWatch alerts
```

**At-rest (Customer Managed Keys):**

```yaml
# AWS KMS key for encryption
apiVersion: v1
kind: Secret
metadata:
  name: database-password
  namespace: production
  annotations:
    aws/kms-key-id: arn:aws:kms:us-east-1:ACCOUNT_ID:key/12345678
type: Opaque
data:
  password: base64_encoded_password
```

Encrypt everything:
- [ ] EBS volumes → KMS encryption
- [ ] RDS database → KMS encryption
- [ ] S3 objects → Server-side encryption (SSE-S3 or SSE-KMS)
- [ ] Secrets → Secrets Manager (encrypted with KMS)
- [ ] Backups → Encryption enabled
- [ ] EFS → Encryption at rest

### 5. Secrets Management

**Never commit secrets to version control.**

**Use a vault:**

```hcl
# Terraform with AWS Secrets Manager
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "prod/database/password"
}

resource "aws_rds_cluster" "prod" {
  master_username = "admin"
  master_password = data.aws_secretsmanager_secret_version.db_password.secret_string
}
```

**Rotation:**

```bash
# Automatic rotation (every 30 days)
aws secretsmanager rotate-secret \
  --secret-id prod/database/password \
  --rotation-rules AutomaticallyAfterDays=30
```

**Least privilege access:**

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:prod/database/*",
      "Condition": {
        "StringEquals": {
          "secretsmanager:VersionStage": "AWSCURRENT"
        }
      }
    }
  ]
}
```

### 6. Audit Logging

**What to log (CloudTrail, CloudWatch, Azure Monitor):**

```
✓ API calls (who, what, when)
✓ IAM changes (role modifications, policy updates)
✓ Database access (queries, schema changes)
✓ Data access (S3 gets, database reads)
✓ Configuration changes (security groups, network policies)
✓ Failed authentication attempts
✓ Privilege escalation attempts
✓ Sensitive data access (PII, credentials, keys)

Retention: 1 year minimum (compliance requirement)
Storage: S3 with glacier transition (7+ years)
Access: Log reads require MFA + audit
```

**CloudTrail setup (AWS):**

```hcl
resource "aws_cloudtrail" "prod" {
  name                          = "prod-trail"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_logs.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true
  
  event_selector {
    include_management_events = true
    
    read_write_type = "All"
  }
}

resource "aws_s3_bucket_versioning" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id
  
  versioning_configuration {
    status = "Enabled"
  }
}
```

### 7. Compliance Checklists

**SOC2 Type II (controls over time):**

- [ ] Access controls: Authentication, authorization, audit
- [ ] Change management: Only authorized changes, testing before deploy
- [ ] Incident response: Detection, containment, recovery, documentation
- [ ] Encryption: All data encrypted in transit and at rest
- [ ] Backup & recovery: RTO/RPO defined, tested regularly
- [ ] Monitoring: Alerts for anomalies, alerting on failures
- [ ] Training: Team understands security policies
- [ ] Documentation: Policies, procedures, controls documented

**HIPAA (healthcare data):**

- [ ] Authentication: MFA for all access
- [ ] Encryption: TLS in transit, AES-256 at rest
- [ ] Access controls: Role-based, least privilege
- [ ] Audit logging: 6+ year retention
- [ ] Data protection: Encryption, pseudonymization
- [ ] Breach response: 30-day notification procedure
- [ ] Business associate agreements (BAAs): Signed with all vendors
- [ ] Risk assessment: Annual security risk analysis

**PCI-DSS (payment card data):**

- [ ] Network segmentation: Cardholder data isolated
- [ ] Access controls: Strong authentication, no shared accounts
- [ ] Encryption: TLS 1.2+, AES-256 at rest
- [ ] Vulnerability scanning: Monthly scans, annual penetration test
- [ ] Logging: 1+ year retention, 3-month online
- [ ] Vendor assessment: Document all system vendors
- [ ] Policies: Security policy, incident response plan
- [ ] Training: Annual security training for all staff

### 8. Vulnerability Management

**Scanning:**

```bash
# Container image scanning (ECR)
aws ecr describe-image-scan-findings \
  --repository-name myapp \
  --image-id imageTag=latest

# Infrastructure scanning (Checkov)
checkov -d infrastructure/

# Dependency scanning (Snyk)
snyk test --file=requirements.txt

# SAST (Semgrep)
semgrep --config=p/security-audit src/
```

**Remediation:**

```
Priority 1 (Critical):  Fix immediately, rollback if in production
Priority 2 (High):      Fix within 7 days
Priority 3 (Medium):    Fix within 30 days
Priority 4 (Low):       Fix in next sprint
```

### 9. Security Monitoring

**Real-time alerts:**

```yaml
# Alert on suspicious activity
CloudWatch Rule: "AWS API calls from unusual IP"
→ SNS notification → Incident response team

Rule: "Failed RDP login attempts > 5 in 10 minutes"
→ Automatically disable user account, notify security

Rule: "S3 bucket policy changed to public"
→ Auto-revert, notify, create incident
```

### 10. Disaster Recovery for Security

**What if credentials leak?**

```
1. Detect: CloudTrail alert on unusual access pattern
2. Contain: Revoke compromised API key, disable user
3. Assess: Determine scope (what was accessed?)
4. Notify: Customers (if data accessed), regulatory (if required)
5. Recover: Restore from backup, validate integrity
6. Remediate: Rotate all credentials, strengthen access
7. Learn: RCA, update controls
```

---

## Example

### Startup SaaS Security Architecture

**Compliance requirement:** SOC2 Type II (customer requirement)

**Current risks:**
- Single AWS account (all environments mixed)
- No encryption at rest
- Secrets in .env files
- Manual backups
- No audit logging
- Shared user accounts

**Target architecture:**

```
Organization
├── Root account (billing only)
├── Dev account (development, lower security)
├── Staging account (pre-production)
└── Prod account (production, high security)
    ├── VPC (10.0.0.0/16)
    │   ├── Public subnet (ALB only)
    │   ├── Private subnets (apps, database)
    │   └── Security groups (least privilege)
    ├── IAM roles (per team, least privilege)
    ├── Secrets Manager (passwords, API keys)
    ├── KMS (encryption keys)
    ├── RDS with encryption (database)
    ├── S3 with encryption (backups)
    ├── CloudTrail (audit logging)
    └── CloudWatch (monitoring, alerts)
```

**Implementation timeline:**

| Week | Task | Owner |
|------|------|-------|
| 1-2 | Set up organization, accounts, IAM | Security |
| 3-4 | Implement encryption (KMS, TLS) | Infra |
| 5-6 | Migrate secrets to Secrets Manager | Backend |
| 7-8 | Enable CloudTrail, configure logging | Ops |
| 9-10 | Network segmentation, security groups | Infra |
| 11-12 | Testing, documentation, SOC2 prep | All |

**Cost:**

```
CloudTrail: $2/100K events = $50/month
KMS: $1/month per key = $5/month
Secrets Manager: $0.40/secret/month = $8/month
VPC Flow Logs: $0.50/GB = $10/month
CloudWatch logs: $0.50/GB = $20/month
Total: ~$100/month additional
```

**Audit results (3-month review):**

```
✓ CloudTrail capturing all API calls
✓ No unencrypted data found
✓ 100% of secrets in Secrets Manager
✓ All backups encrypted
✓ IAM policies follow least privilege
✓ SOC2 Type II readiness: 85% (documentation pending)

Action items:
- Complete security policy documentation (2 weeks)
- Annual penetration test (4 weeks)
- Annual risk assessment (2 weeks)
```

---

**Version:** 1.0  
**Last updated:** 2026-06-15
