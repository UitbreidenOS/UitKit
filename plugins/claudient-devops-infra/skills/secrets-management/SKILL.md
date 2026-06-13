---
name: "secrets-management"
description: "Secrets management: HashiCorp Vault setup, AWS/Azure/GCP secret stores, secret rotation automation, Kubernetes secrets injection, CI/CD integration, and secret leak response"
---

# Secrets Management Skill

## When to activate
- Setting up a secrets management infrastructure (Vault, AWS Secrets Manager, etc.)
- Designing secret injection for Kubernetes workloads or CI/CD pipelines
- Implementing automated secret rotation for database credentials or API keys
- Auditing secret access patterns for SOC 2 or ISO 27001
- Responding to a secret leak that requires immediate rotation and revocation
- Migrating from `.env` files to a proper secrets store

## When NOT to use
- Local `.env` file management on a developer machine — use .gitignore + dotenv
- Code review for hardcoded secrets — use the security-audit skill to find them
- Application-level encryption of user data at rest — different concern

## Instructions

### Secrets store selection

```
Choose the right secrets management approach.

Team size: [X engineers]
Infrastructure: [AWS / Azure / GCP / on-prem / hybrid / Kubernetes]
Compliance: [SOC 2 / ISO 27001 / HIPAA / none]
Secrets volume: [X secrets, X applications]
Budget: [$0 / managed service OK / enterprise]

Selection guide:

CLOUD-NATIVE (recommended for cloud-first teams):
AWS Secrets Manager:
  - Native integration: Lambda, ECS, RDS rotation, CloudFormation
  - Cost: $0.40/secret/month + $0.05/10K API calls
  - Auto-rotation: built-in for RDS, DocumentDB, Redshift
  - Best for: AWS-only shops, teams wanting zero ops

Azure Key Vault:
  - Native integration: App Service, AKS, Key Vault references in app settings
  - Cost: $0.03/10K operations (secrets), $0.03/10K (certificates)
  - Best for: Azure-only or Microsoft shops

GCP Secret Manager:
  - Native integration: Cloud Run, GKE, Cloud Functions
  - Cost: $0.06/10K access operations
  - Best for: GCP-native workloads

SELF-HOSTED (recommended for multi-cloud or compliance-driven teams):
HashiCorp Vault:
  - Supports: dynamic secrets, PKI CA, SSH OTP, Kubernetes, multiple cloud backends
  - Cost: open source free; Enterprise for namespaces, replication
  - Ops overhead: must deploy, unseal, and maintain
  - Best for: multi-cloud, on-prem, complex rotation requirements

HCP Vault (managed):
  - Vault as a service from HashiCorp
  - No cluster ops; Vault Dedicated starts ~$700/month
  - Best for: teams wanting Vault capabilities without the ops

Recommendation for my setup: [option + rationale]
```

### Vault setup patterns

```
Set up HashiCorp Vault for [environment].

Deployment: [Kubernetes / Docker Compose / cloud VM / HCP managed]
Storage backend: [Raft (integrated) / Consul / DynamoDB]
Auto-unseal: [AWS KMS / Azure Key Vault / GCP KMS / manual]
Scale: [dev single-node / HA 3-node / production HA]

Production HA configuration:

# docker-compose.yml (3-node Raft cluster)
version: '3.8'
services:
  vault-1:
    image: hashicorp/vault:1.17
    environment:
      VAULT_LOCAL_CONFIG: |
        storage "raft" {
          path    = "/vault/data"
          node_id = "vault-1"
          retry_join { leader_api_addr = "http://vault-2:8200" }
          retry_join { leader_api_addr = "http://vault-3:8200" }
        }
        listener "tcp" {
          address     = "0.0.0.0:8200"
          tls_disable = false
          tls_cert_file = "/vault/certs/vault.crt"
          tls_key_file  = "/vault/certs/vault.key"
        }
        seal "awskms" {
          region     = "us-east-1"
          kms_key_id = "alias/vault-unseal"
        }
        api_addr = "https://vault-1:8200"
        cluster_addr = "https://vault-1:8201"
        ui = true
    cap_add: [IPC_LOCK]
    volumes:
      - vault-1-data:/vault/data
      - ./certs:/vault/certs:ro

Auth methods (configure after init):
# AppRole for machine-to-machine (services, CI runners)
vault auth enable approle
vault write auth/approle/role/my-service \
  token_ttl=1h \
  token_max_ttl=4h \
  secret_id_num_uses=1 \    # single-use secret IDs
  token_policies=my-service-read

# Kubernetes for pod authentication
vault auth enable kubernetes
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

Generate the Vault configuration for my specific infrastructure.
```

### Secret rotation

```
Implement automated secret rotation for [credential type].

Credential type: [database password / API key / TLS certificate / SSH key]
Rotation frequency: [30 days / 90 days / on-demand]
Applications using this secret: [list — how they consume the secret]

Database password rotation (AWS Secrets Manager):

# Automatic rotation using AWS-provided Lambda
aws secretsmanager create-secret \
  --name "prod/myapp/db-password" \
  --secret-string '{"username":"myapp","password":"initial-password"}'

aws secretsmanager rotate-secret \
  --secret-id "prod/myapp/db-password" \
  --rotation-lambda-arn "arn:aws:lambda:us-east-1:ACCOUNT:function:SecretsManagerRDSPostgreSQLRotationSingleUser" \
  --rotation-rules AutomaticallyAfterDays=30

# Application reads secret by name (not hardcoded value):
import boto3
import json

def get_db_password():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='prod/myapp/db-password')
    secret = json.loads(response['SecretString'])
    return secret['password']

# KEY PATTERN: Application always reads at runtime, never caches indefinitely
# Handle rotation: catch auth failures, refresh secret, retry once

Database rotation pattern for zero downtime:
Phase 1: Create new password in DB (old password still works)
Phase 2: Update Secrets Manager with new password
Phase 3: Applications read new password on next secret fetch
Phase 4: Remove old password from DB (after grace period)

Vault dynamic secrets (better than rotation — never store long-lived creds):
# Each application request generates a unique, time-limited credential
vault secrets enable database
vault write database/config/postgresql \
  plugin_name="postgresql-database-plugin" \
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/mydb" \
  allowed_roles="my-role" \
  username="vault-admin" \
  password="vault-admin-password"

vault write database/roles/my-role \
  db_name="postgresql" \
  creation_statements="CREATE ROLE '{{name}}' LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO '{{name}}';" \
  default_ttl="1h" \
  max_ttl="24h"

# App gets: a unique credential valid for 1 hour, auto-expired by Vault
vault read database/creds/my-role

Generate the rotation setup for my credential type.
```

### Kubernetes secrets injection

```
Inject secrets into Kubernetes workloads.

Cluster: [EKS / AKS / GKE / self-managed]
Secrets store: [Vault / AWS Secrets Manager / Azure Key Vault / GCP Secret Manager]

Option 1 — Vault Agent sidecar (most flexible):
# Kubernetes auth configured in Vault first (see setup above)
# Pod spec with Vault Agent sidecar:

apiVersion: v1
kind: Pod
spec:
  serviceAccountName: my-app   # must have Vault auth binding
  initContainers:
    - name: vault-agent-init
      image: hashicorp/vault:1.17
      args: ["agent", "-config=/vault/config/config.hcl"]
      # Writes secrets to shared volume before app starts
  containers:
    - name: app
      volumeMounts:
        - name: secrets-vol
          mountPath: /vault/secrets
          readOnly: true
      # App reads: /vault/secrets/db-password (plaintext file)
  volumes:
    - name: secrets-vol
      emptyDir: {}

Option 2 — External Secrets Operator (recommended for cloud-native):
# Syncs AWS Secrets Manager / Azure Key Vault / GCP Secret Manager → Kubernetes Secret
# Install: helm install external-secrets external-secrets/external-secrets

apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-store
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: my-app-secrets
spec:
  refreshInterval: 1h        # sync every hour
  secretStoreRef:
    name: aws-store
    kind: SecretStore
  target:
    name: my-app-secrets     # creates this Kubernetes Secret
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: prod/myapp/db-password
        property: password

Configure the secrets injection for my cluster and secrets store.
```

### Secret leak response

```
Respond to a secret leak for [credential type].

Leaked credential: [describe — API key / DB password / private key / JWT secret]
Exposure: [public GitHub repo / logs / Slack / unknown]
Time since leak: [minutes / hours / days]
Systems affected: [list]

IMMEDIATE RESPONSE (first 30 minutes):

STEP 1 — Revoke the credential NOW:
# API key (service-specific):
# Stripe: Dashboard → Developers → API Keys → Roll key
# GitHub token: Settings → Developer settings → Personal access tokens → Delete
# AWS access key: IAM → Users → Security credentials → Deactivate

# Database password:
ALTER USER myapp PASSWORD 'new-secure-password-here';
# Update Secrets Manager / Vault simultaneously

# JWT signing secret:
# Change the secret → all existing tokens instantly invalid
# Warning: all logged-in users will be logged out

STEP 2 — Assess blast radius:
□ When was the credential created? (sets the exposure window)
□ What can it access? (scope determines severity)
□ Is there any evidence of misuse? (check access logs for the service)

STEP 3 — Audit access logs:
# AWS CloudTrail: filter by the access key ID
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=AKIA... \
  --start-time $(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%SZ)

# Check for: unusual regions, unusual operations, data exfiltration signs

STEP 4 — Remove from source:
□ If in Git: remove, force push, but remember — it's in history
  Use BFG Repo Cleaner or git-filter-repo to scrub history
  But: if it was public, assume it's captured — rotation is the only fix
□ If in logs: purge log entries, check log forwarding destinations
□ If in Slack: delete the message + any copies

STEP 5 — Notify:
□ Security team and management
□ If customer data was accessible: legal + DPO review (GDPR 72-hour notification rule)
□ If the service has a responsible disclosure policy: follow it

STEP 6 — Root cause and prevent recurrence:
□ How did the secret get exposed? (committed to git / logged / hardcoded)
□ Pre-commit hook to prevent secret commits: install git-secrets or gitleaks
□ Rotate all other secrets of the same type as a precaution

Generate the incident response runbook for my specific leak scenario.
```

## Example

**User:** We found an AWS access key committed to a public GitHub repo 3 days ago. The key has AdministratorAccess. What do we do?

**Claude's response:**

This is a critical incident. Administrator access key public for 3 days = assume it was found and used. Move fast.

**Next 5 minutes:**
```bash
# 1. Deactivate the key immediately (do not delete yet — you need the key ID for log analysis)
aws iam update-access-key \
  --access-key-id AKIA... \
  --status Inactive \
  --user-name leaked-user

# 2. Check if there are multiple keys for this user
aws iam list-access-keys --user-name leaked-user
```

**Next 30 minutes — investigate:**
```bash
# Check CloudTrail for all activity with this key (last 90 days)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA... \
  --start-time 2026-04-20T00:00:00Z \
  --output json | jq '.Events[] | {time: .EventTime, action: .EventName, region: .CloudTrailEvent}'

# Look for: CreateUser, CreateRole, AttachPolicy (privilege escalation), S3 GetObject (data theft), EC2 RunInstances (crypto mining)
```

**After investigation:**
- If no suspicious activity → still treat as compromised, proceed with full rotation
- If suspicious activity found → declare a security incident, involve legal/DPO, investigate each action

**Complete remediation:**
1. Delete the leaked key (after log analysis complete)
2. Audit all IAM policies the leaked user had — were any applied during the window?
3. Review CloudTrail for any resources created with this key — delete orphaned resources
4. If this user had AdministratorAccess: check for any new IAM users, roles, or policies created
5. Enable GuardDuty if not already on (would have alerted on this)
6. Set up AWS Config rule to alert on public access keys being created
7. Add `git-secrets` or `gitleaks` pre-commit hook to all repos

---
