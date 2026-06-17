# Infrastructure-as-Code Design

## When to activate

When designing cloud infrastructure using Terraform, CloudFormation, or Bicep; planning repository structure, module organization, state management, or CI/CD integration for infrastructure deployments.

## When NOT to use

For manual infrastructure provisioning, ad-hoc script writing, or tasks that don't require version control or reproducibility.

## Instructions

Infrastructure-as-code (IaC) is the foundation of reliable, auditable cloud architecture. Follow these principles:

### 1. Platform Choice

**Terraform:**
- Multi-cloud (AWS, Azure, GCP, Kubernetes, etc.)
- Declarative, human-readable syntax
- Large community and module ecosystem
- State management: remote backend (S3, Azure Storage, Terraform Cloud)

**CloudFormation:**
- AWS-native, integrated with CloudFormation Designer
- YAML/JSON templates, stack updates
- Change sets for safer deployments
- No external state backend needed

**Bicep:**
- Azure-native, domain-specific language
- Simpler syntax than ARM templates
- Integrated into Azure CLI and DevOps
- Community module ecosystem

**Decision framework:**
- Multi-cloud → Terraform
- AWS-only, minimal modules → CloudFormation
- Azure-only, modern syntax → Bicep

### 2. Repository Structure

```
infrastructure/
├── terraform.tf                 # Backend, provider configs
├── variables.tf                 # Input variables
├── outputs.tf                   # Outputs
├── main.tf                      # Root module
├── modules/
│   ├── vpc/                     # VPC/networking module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── rds/                     # Database module
│   ├── eks/                     # Kubernetes module
│   └── security/                # Security/IAM module
├── environments/
│   ├── dev.tfvars               # Development values
│   ├── staging.tfvars           # Staging values
│   └── prod.tfvars              # Production values
├── .github/workflows/
│   ├── plan.yml                 # PR validation
│   └── apply.yml                # Merge → apply
├── .gitignore                   # Exclude .tfstate, secrets
└── README.md                    # Documentation
```

### 3. Module Design

Every module must:
- **Be single-purpose** — VPC module creates VPC + subnets + route tables, not entire infrastructure
- **Have inputs** — Variables for customization (region, CIDR, tags, etc.)
- **Have outputs** — VPC ID, subnet IDs, security group IDs for dependent modules
- **Include documentation** — inputs.tf with descriptions, README with examples
- **Support versioning** — Use git tags for module versions
- **Be tested** — Terraform validate, fmt, lint

Example module structure:
```hcl
# vpc/variables.tf
variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for VPC"
  default     = "10.0.0.0/16"
}

# vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-vpc"
    Environment = var.environment
  }
}

# vpc/outputs.tf
output "vpc_id" {
  value       = aws_vpc.main.id
  description = "VPC ID"
}
```

### 4. State Management

**Best practices:**
- **Remote backend:** Use S3/Azure Storage/Terraform Cloud (NEVER local state in Git)
- **State locking:** DynamoDB (AWS), Blob container (Azure), Terraform Cloud
- **Encryption:** Enable server-side encryption on state bucket
- **Access control:** Restrict who can read/write state
- **Backup:** Enable versioning on state bucket

Backend configuration:
```hcl
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

### 5. Environment Separation

Use tfvars files to separate environments without duplicating code:

```hcl
# environments/dev.tfvars
environment         = "dev"
instance_count      = 1
instance_type       = "t3.micro"
enable_backup       = false
backup_retention    = 7

# environments/prod.tfvars
environment         = "prod"
instance_count      = 3
instance_type       = "t3.large"
enable_backup       = true
backup_retention    = 30
```

Deploy with: `terraform apply -var-file="environments/prod.tfvars"`

### 6. CI/CD Integration

GitHub Actions workflow for Terraform:

```yaml
name: Infrastructure
on:
  pull_request:
    paths: [infrastructure/**]
  push:
    branches: [main]

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: hashicorp/setup-terraform@v2
      - run: terraform init
      - run: terraform fmt -check
      - run: terraform validate
      - run: terraform plan -var-file="environments/prod.tfvars" -out=tfplan
      - uses: actions/upload-artifact@v3
        with:
          name: tfplan
          path: infrastructure/tfplan

  apply:
    needs: plan
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: hashicorp/setup-terraform@v2
      - uses: actions/download-artifact@v3
        with:
          name: tfplan
      - run: terraform apply -auto-approve tfplan
```

### 7. Drift Detection

Regularly detect when manual changes (pets) diverge from code (cattle):

```bash
# Run manually weekly
terraform plan -out=tfplan

# Or schedule with AWS Systems Manager
aws ssm send-command \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=['cd /opt/terraform && terraform plan']"
```

### 8. Code Quality

```bash
# Format code
terraform fmt -recursive

# Validate syntax
terraform validate

# Lint (TFLint)
tflint --init
tflint

# Security scan (Checkov)
checkov -d infrastructure/
```

### 9. Documentation

Every module README should include:
- Purpose
- Inputs (variables)
- Outputs
- Example usage
- Dependencies
- Cost notes

Example:
```markdown
# VPC Module

Creates a VPC with public and private subnets across multiple AZs.

## Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| environment | string | - | Environment name |
| vpc_cidr | string | "10.0.0.0/16" | CIDR block for VPC |
| availability_zones | list | ["a", "b", "c"] | AZ suffixes |

## Outputs

| Name | Description |
|------|-------------|
| vpc_id | VPC ID |
| subnet_ids | List of subnet IDs |

## Example

```hcl
module "vpc" {
  source = "./modules/vpc"
  environment = "prod"
  vpc_cidr = "10.10.0.0/16"
}
```

## Cost

- VPC: Free
- NAT Gateway: $32/month per AZ
```

### 10. Secrets Management

**NEVER commit secrets.** Use:

**Terraform Cloud/Enterprise:** Store sensitive vars in workspace
**AWS:** Use Secrets Manager, reference with data source
**Azure:** Use Key Vault, reference in Bicep
**Local dev:** Use .tfvars.local (git-ignored)

```hcl
# variables.tf
variable "db_password" {
  type        = string
  description = "Database password"
  sensitive   = true
}

# terraform.tfvars.local (git-ignored)
db_password = "secret-password-here"

# In CI/CD: pass as environment variable
export TF_VAR_db_password="secret-from-vault"
terraform apply
```

---

## Example

### Complete Terraform Project

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "acme-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones

  tags = {
    Project     = "acme"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  environment     = var.environment
  instance_class  = var.rds_instance_class
  allocated_storage = var.rds_storage_gb
  subnet_ids      = module.vpc.private_subnet_ids

  tags = {
    Project     = "acme"
    Environment = var.environment
  }
}

# Security Group
resource "aws_security_group" "app" {
  vpc_id = module.vpc.vpc_id
  name   = "${var.environment}-app-sg"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-app-sg"
  }
}

# Output
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "rds_endpoint" {
  value = module.rds.endpoint
}
```

```bash
# Deploy
terraform init
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"

# Check state
terraform state list
terraform state show 'aws_vpc.main'

# Destroy (if needed)
terraform destroy -var-file="environments/prod.tfvars"
```

---

**Version:** 1.0  
**Last updated:** 2026-06-15
