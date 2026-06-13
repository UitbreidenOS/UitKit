---
name: terraform
description: "Terraform modules, state management, workspaces, provider config, plan/apply workflow, remote backends"
updated: 2026-06-13
---

# Terraform Skill

## When to activate
- Writing Terraform modules for AWS, GCP, or Azure infrastructure
- Defining VPCs, subnets, security groups, and networking resources
- Provisioning compute resources (EC2, GKE, AKS, ECS, Lambda)
- Managing database infrastructure (RDS, Cloud SQL, Aurora)
- Setting up IAM roles, policies, and service accounts
- Writing remote state configuration (S3 backend, GCS, Terraform Cloud)
- Refactoring existing Terraform to use modules
- Writing CI/CD pipelines for `terraform plan` and `terraform apply`
- Importing existing infrastructure into Terraform state

## When NOT to use
- Pulumi, CDK, or Crossplane — different IaC tools, different patterns
- Helm chart configuration (use the Kubernetes skill instead)
- Application-level config (Kubernetes ConfigMaps, app env vars)
- One-off CLI operations that won't be repeated

## Instructions

### Module structure
Every Terraform project must follow this structure:
```
infrastructure/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   └── compute/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── production/
│   │   ├── main.tf          ← calls modules
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── staging/
│       └── ...
└── versions.tf              ← root provider versions
```

### State management — always remote
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "production/networking/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```
- Never use local state for anything shared
- Enable encryption and state locking (DynamoDB for S3 backend)
- Separate state files per environment and per module (not one giant state)

### Variable and output discipline
```hcl
# variables.tf — always include description and type
variable "environment" {
  description = "Deployment environment (production, staging, development)"
  type        = string
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be production, staging, or development."
  }
}

# outputs.tf — output everything a consuming module might need
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}
```

### Secrets — never in state or code
- Never put secrets in `terraform.tfvars` or hardcode them in `.tf` files
- Use `data "aws_secretsmanager_secret_version"` or `data "google_secret_manager_secret_version"` to read secrets at apply time
- Sensitive outputs: mark with `sensitive = true` to suppress in plan output
- `.gitignore` must include: `*.tfvars`, `*.tfstate`, `*.tfstate.backup`, `.terraform/`

### Resource naming conventions
```hcl
# Consistent naming: {project}-{environment}-{resource}-{suffix}
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  tags = {
    Name        = "${var.project}-${var.environment}-vpc"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```
Always tag every resource with `Environment` and `ManagedBy = "terraform"`.

### Plan before apply — always
- CI/CD pipeline: `terraform plan -out=tfplan` on PR, `terraform apply tfplan` on merge
- Never run `terraform apply` without a saved plan in production
- Use `-target` sparingly — it creates drift between real state and plan

### Common pitfalls
- `terraform destroy` with no `-target` destroys everything — always confirm scope
- Changing a resource attribute that forces replacement (e.g., VPC CIDR) deletes and recreates — check plan carefully
- Provider version pinning is mandatory: use `~> 5.0` not `>= 5.0`
- `count` vs `for_each`: use `for_each` with maps — `count` causes index drift when items are removed

## Example

**User:** Create a Terraform module for a private RDS PostgreSQL instance on AWS with Multi-AZ, encrypted storage, and a dedicated security group.

**Expected output structure:**
- `modules/rds/main.tf` — `aws_db_instance`, `aws_db_subnet_group`, `aws_security_group`
- `modules/rds/variables.tf` — instance class, engine version, db name, VPC/subnet IDs, ingress CIDR
- `modules/rds/outputs.tf` — endpoint, port, security group ID
- Security group: allows PostgreSQL (5432) only from app security group, no public access
- `storage_encrypted = true`, `multi_az = true`, `deletion_protection = true` for production
- Password via `aws_secretsmanager_secret` reference, never hardcoded

---
