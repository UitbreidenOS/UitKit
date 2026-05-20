---
name: cloud-security
description: "Cloud security posture: IAM privilege escalation detection, S3 public exposure audit, security group review, IaC security scanning — AWS, Azure, and GCP misconfigurations"
---

# Cloud Security Skill

## When to activate
- Auditing AWS/Azure/GCP for security misconfigurations
- Finding IAM privilege escalation paths before an attacker does
- Checking S3/Blob Storage/GCS buckets for unintended public access
- Reviewing security group / firewall rules for over-permissive network access
- Scanning Terraform or CloudFormation templates for security issues before deploy
- Running a cloud security baseline assessment

## When NOT to use
- Active cloud incident response — use the incident-commander agent
- Application-level penetration testing — use the security-pen-testing skill (or red-team agent for authorized engagements)
- Compliance certification readiness (SOC 2, ISO 27001) — use those specific skills
- SIEM or threat detection — different tooling and process

## Instructions

### IAM privilege escalation audit

```
Audit IAM for privilege escalation risks.

Cloud: [AWS / Azure / GCP]
Scope: [all IAM entities / specific roles / specific user]
Access to: [IAM console read access / exported policy JSONs]

Common IAM privilege escalation paths (AWS):

DIRECT ESCALATION (single action grants admin):
□ iam:CreatePolicyVersion — create new policy version with AdministratorAccess
□ iam:SetDefaultPolicyVersion — flip to a previously created permissive version
□ iam:AttachUserPolicy / iam:AttachRolePolicy — attach AdministratorAccess to self
□ iam:AddUserToGroup — add self to admin group
□ iam:CreateAccessKey — create access key for another user with more privileges
□ iam:UpdateLoginProfile — reset password for a higher-privilege user
□ iam:PassRole + [service]:* — pass an admin role to a service (Lambda, EC2, ECS)

INDIRECT ESCALATION (via services):
□ lambda:CreateFunction + iam:PassRole (admin role) → deploy Lambda that runs as admin
□ ec2:RunInstances + iam:PassRole (admin role) → launch EC2 with admin instance profile
□ sts:AssumeRole + permissive trust policy → assume a higher-privilege role

CHECK procedure:
1. List all IAM policies attached to the target (user/role/group)
2. For each policy, look for any of the above actions on Resource: "*"
3. Check if any of the above actions exist with condition-free wildcards
4. Check role trust policies: who can assume this role? (too-broad "*" in Principal)

Immediate red flags:
🔴 Action: iam:* Resource: * (full IAM control = de facto admin)
🔴 Action: sts:AssumeRole Resource: * (can assume any role in the account)
🔴 Any wildcard action (*) on Resource: * (full service control)
🔴 PassRole permission to * resources (can escalate via any service)

AWS CLI commands to run:
# List all policies for a user
aws iam list-attached-user-policies --user-name USERNAME
aws iam list-user-policies --user-name USERNAME

# Get policy details
aws iam get-policy-version --policy-arn POLICY_ARN --version-id v1

# Check who can assume a role
aws iam get-role --role-name ROLE_NAME --query 'Role.AssumeRolePolicyDocument'

Output: list of escalation paths found, affected principal, specific action + resource.
```

### S3 public access audit

```
Audit S3 buckets for unintended public access.

Scope: [all buckets / specific bucket names]
Concern: [public read / public write / public ACLs]

S3 public access attack surface:

BUCKET-LEVEL CHECKS:
□ Public access block settings — are all 4 settings enabled?
  aws s3api get-public-access-block --bucket BUCKET_NAME
  All 4 should be true: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets

□ Bucket ACL — is the grantee "AllUsers" or "AuthenticatedUsers"?
  aws s3api get-bucket-acl --bucket BUCKET_NAME
  Look for: "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
  🔴 AllUsers with READ = anyone can list/download files
  🔴 AllUsers with WRITE = anyone can upload/delete files

□ Bucket policy — does the policy allow s3:GetObject with Principal: "*"?
  aws s3api get-bucket-policy --bucket BUCKET_NAME
  🔴 Principal: "*" + Action: s3:GetObject = public read

OBJECT-LEVEL CHECKS:
□ Individual objects with public ACLs (if bucket ACL block not set)
  aws s3api list-object-versions --bucket BUCKET_NAME | grep -i "public"

COMMON LEGITIMATE PATTERNS (verify intentional):
- Static website hosting buckets: intentionally public, should be restricted to CloudFront
- Public download buckets: policy should restrict to specific prefixes, not all objects

Remediation for accidentally public bucket:
# Enable public access block (safe for all buckets)
aws s3api put-public-access-block \
  --bucket BUCKET_NAME \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Remove public bucket policy
aws s3api delete-bucket-policy --bucket BUCKET_NAME

Output: per-bucket risk rating + specific misconfiguration + remediation command.
```

### Security group / firewall audit

```
Audit security groups for over-permissive network access.

Cloud: [AWS security groups / Azure NSGs / GCP firewall rules]
Scope: [all security groups / production VPC only]

Critical rules to flag:

🔴 SSH (port 22) open to 0.0.0.0/0 — internet-facing SSH is a critical finding
🔴 RDP (port 3389) open to 0.0.0.0/0 — internet-facing RDP is a critical finding
🔴 Database ports open to 0.0.0.0/0:
   - MySQL: 3306
   - PostgreSQL: 5432
   - MongoDB: 27017
   - Redis: 6379
   - Elasticsearch: 9200
🔴 All traffic (port 0, protocol -1) from 0.0.0.0/0

🟡 HTTP (port 80) or HTTPS (port 443) from 0.0.0.0/0 — usually intentional for web services; verify
🟡 Custom management ports (8080, 8443, 9090) from 0.0.0.0/0 — should be behind VPN
🟡 Overly broad internal rules (entire VPC CIDR where only specific SG needed)

AWS CLI audit:
# Find security groups with SSH open to internet
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

# Find security groups with all traffic open
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.protocol,Values=-1" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName]'

Remediation for SSH:
# Replace 0.0.0.0/0 with your bastion/VPN IP
aws ec2 revoke-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr YOUR_VPN_CIDR

Output: security group ID, rule, risk level, remediation command.
```

### IaC security scan

```
Scan Infrastructure-as-Code for security misconfigurations.

IaC tool: [Terraform / CloudFormation / Pulumi / Bicep]
Files to scan: [directory path or file list]

Use these tools for automated scanning:

Terraform:
  tfsec .                          # Fastest; checks common misconfigs
  checkov -d .                     # Broader coverage; CIS benchmark checks
  terrascan scan -t terraform      # NIST, PCI, SOC 2 mapped checks

CloudFormation:
  cfn-nag scan --input-filename template.yaml
  checkov -f template.yaml --framework cloudformation

Key misconfigurations to flag:

COMPUTE:
🔴 EC2/ECS metadata endpoint not restricted (IMDSv2 not enforced)
🔴 User data containing secrets or credentials
🟡 Instances without IMDSv2 hop limit = 1

STORAGE:
🔴 S3 bucket without public access block
🔴 S3 bucket without server-side encryption
🔴 S3 bucket without versioning (data loss risk)
🟡 S3 bucket without access logging

DATABASE:
🔴 RDS publicly accessible = true
🔴 RDS without encryption at rest
🔴 RDS without deletion protection (in prod)
🟡 RDS without automated backups
🟡 RDS Multi-AZ disabled (in prod)

IAM:
🔴 IAM policy with Action: * Resource: *
🔴 IAM role with over-broad trust policy
🟡 IAM access key rotation not enforced

NETWORK:
🔴 Security group allowing all inbound traffic
🔴 VPC flow logs not enabled
🟡 Default security group in use

Generate: annotated list of findings with IaC file + line reference + fix.
```

## Example

**User:** Our startup has been running on AWS for 18 months. We've never done a security audit. Where do we start?

**Claude's 30-minute baseline audit:**

Run these 5 commands — they surface 80% of the critical risks:

```bash
# 1. Find internet-exposed SSH (critical — run first)
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.from-port,Values=22" \
            "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].[GroupId,GroupName,Description]' \
  --output table

# 2. Find public S3 buckets
aws s3api list-buckets --query 'Buckets[*].Name' --output text | \
  xargs -I{} aws s3api get-public-access-block --bucket {} 2>/dev/null || echo "Check manually"

# 3. Find IAM users with AdministratorAccess
aws iam list-attached-user-policies \
  --user-name $(aws iam list-users --query 'Users[*].UserName' --output text) 2>/dev/null

# 4. Find root account access keys (should be ZERO)
aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent'
# If output is 1 or more: delete root access keys immediately

# 5. Check if CloudTrail is enabled (your audit log)
aws cloudtrail describe-trails --query 'trailList[*].[Name,S3BucketName,IsMultiRegionTrail]'
```

**Most common findings in 18-month-old AWS accounts:**
1. SSH open to the internet on a dev/staging instance someone forgot about
2. Root access keys still active (should be zero — root should use console only)
3. CloudTrail not enabled in all regions (gaps in audit logging)
4. IAM users with long-lived access keys never rotated
5. S3 bucket with public access block not enabled (even if no public bucket policy)

Fix root access keys and internet SSH first — these are the two most commonly exploited misconfigs.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
