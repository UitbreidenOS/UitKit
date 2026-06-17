# Design Terraform Command

## When to activate

When starting a new Terraform project, refactoring module architecture, planning multi-environment infrastructure, or establishing state management strategy.

## When NOT to use

For modifying existing Terraform code; use `/write-k8s-manifest` for Kubernetes or ask me to code specific modules directly.

## Instructions

### Terraform Project Design Process

```
/design-terraform --project <name> --provider <aws|gcp|azure> --environments <dev,staging,prod>
```

This command guides you through:

1. **Architecture phase:**
   - Identify infrastructure components (compute, storage, networking, databases, security)
   - Design module boundaries (reusable, independently manageable)
   - Plan resource dependencies

2. **Variable taxonomy:**
   - Required inputs (no defaults): region, environment, vpc_cidr
   - Optional inputs (with defaults): instance_type=t3.medium, replicas=3
   - Type constraints: string, number, bool, list, object, map
   - Validation rules: CIDR blocks, port ranges, enum values

3. **Output design:**
   - What data do consumers need? (VPC ID, security group IDs, database endpoints)
   - Naming convention: resource_type + identifier (vpc_id, security_group_ids, rds_endpoint)
   - Documentation for each output

4. **State strategy:**
   - Backend selection: S3 + DynamoDB (AWS), GCS + Firestore (GCP), Azure Storage
   - Encryption at rest and in transit
   - State locking mechanism
   - Separate state files per environment

5. **Directory structure:**
   - Module organization: `modules/<component>/`
   - Environment configurations: `environments/<env>/`
   - Shared configurations: `global/`
   - Naming: kebab-case for directories and files

6. **Versioning:**
   - Provider version pinning: `~> 5.0` for AWS
   - Terraform version requirement: `>= 1.5`
   - Module versioning strategy: git tags or registry versions

7. **Documentation:**
   - Architecture diagram: components, dependencies, data flow
   - README for each module: purpose, inputs, outputs, examples
   - Runbook for deployment: prerequisites, deployment steps, rollback

### Example Output

**Project:** Production Kubernetes Platform on AWS

**Architecture:**
```
┌─────────────────────────────────────────────┐
│          AWS Account (prod)                  │
├─────────────────────────────────────────────┤
│  VPC (10.0.0.0/16, 3 AZs)                  │
│  ├── Public Subnets (ALB)                   │
│  ├── Private Subnets (EKS Workers)          │
│  └── Database Subnets (RDS, ElastiCache)   │
├─────────────────────────────────────────────┤
│  EKS Cluster (v1.27, 3-9 nodes)             │
│  ECS Task Execution Role (IAM)              │
│  Security Groups (ALB, Workers, DB)         │
├─────────────────────────────────────────────┤
│  RDS PostgreSQL (Multi-AZ, Encrypted)       │
│  ElastiCache Redis (3 nodes, Encrypted)     │
│  S3 Buckets (Logs, Backups, Artifacts)      │
├─────────────────────────────────────────────┤
│  CloudWatch Logs, Monitoring, Alarms        │
│  VPC Flow Logs, GuardDuty Security          │
└─────────────────────────────────────────────┘
```

**Modules:**
- `modules/vpc/` — VPC, subnets, NAT gateways, route tables
- `modules/eks/` — EKS cluster, node groups, IAM roles
- `modules/rds/` — RDS instance, subnet groups, parameter groups
- `modules/elasticache/` — ElastiCache cluster, subnet groups
- `modules/security-groups/` — All security groups (ALB, workers, database)
- `modules/kms/` — KMS keys for encryption
- `modules/iam/` — IAM roles and policies
- `modules/monitoring/` — CloudWatch, alarms, log groups

**Variable Taxonomy:**
```
Required:
  - aws_region: string (validation: valid AWS region)
  - environment: string (enum: dev, staging, prod)
  - vpc_cidr: string (validation: valid CIDR block)
  - cluster_version: string (validation: valid EKS version)
  - db_instance_class: string (enum: db.t3.medium, db.r5.large, etc.)

Optional:
  - cluster_node_desired_size: number = 3
  - cluster_node_max_size: number = 9
  - cluster_node_min_size: number = 1
  - rds_backup_retention_days: number = 30
  - rds_multi_az: bool = true
  - enable_monitoring: bool = true
  - tags: map(string) = {}
```

**Outputs:**
```
vpc_id → For subnet/resource creation
private_subnet_ids → For worker node placement
eks_cluster_name → For kubectl config
eks_cluster_endpoint → For API access
rds_endpoint → For app database connection
elasticache_endpoint → For cache connection
kms_key_arns → For encryption policies
security_group_ids → For network rules
```

**State Strategy:**
```
Backend: S3 + DynamoDB
Bucket: my-terraform-state
Encryption: AES-256
Versioning: Enabled
State files:
  - prod/kubernetes.tfstate
  - prod/databases.tfstate
  - prod/security.tfstate
```

**Directory Structure:**
```
terraform/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── eks/
│   ├── rds/
│   ├── elasticache/
│   ├── security-groups/
│   ├── kms/
│   ├── iam/
│   └── monitoring/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tfvars
│   │   ├── backend.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── staging/
│   └── prod/
├── global/
│   └── main.tf
├── versions.tf
├── main.tf
├── variables.tf
├── outputs.tf
├── README.md
└── .gitignore (ignore .tfstate, .tfvars with secrets, .terraform/)
```

**Deployment Workflow:**
```
1. Design phase: Terraform architecture approved
2. Code phase: Modules implemented, formatted, validated
3. Plan phase: terraform plan -out=tfplan
4. Review phase: Plan reviewed for security, cost, compliance
5. Approval phase: Approved by infrastructure team
6. Deploy phase: terraform apply tfplan
7. Verify phase: Post-deploy testing, monitoring checks
```

## Next Steps

1. Use `/terraform-design` output to create module structure
2. Implement modules following the templates in CLAUDE.md
3. Run `/test-infrastructure` to validate Terraform
4. Define OPA policies with `/define-policy`
5. Deploy through GitOps pipeline with approval gates
