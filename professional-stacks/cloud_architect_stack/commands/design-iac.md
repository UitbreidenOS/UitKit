# /design-iac Command

Design infrastructure-as-code architecture, including platform choice, module structure, state management, and CI/CD integration.

## Input Parameters

Provide:
- **System name** — What are you building? (e.g., "customer portal", "data pipeline")
- **Scale** — Compute, storage, network requirements
- **Cloud platform(s)** — AWS, Azure, GCP, or multi-cloud
- **Team expertise** — Terraform/CloudFormation/Bicep experience level
- **Time to production** — When do you need this deployed?

## Output Deliverable

Complete IaC architecture including:
1. **Platform recommendation** — Terraform/CloudFormation/Bicep with rationale
2. **Repository structure** — Directory layout, module design
3. **Environment strategy** — Dev/staging/prod separation (tfvars approach)
4. **State management** — Remote backend, locking, encryption
5. **CI/CD pipeline** — GitHub Actions / GitLab CI / Azure DevOps workflow
6. **Module design** — 3-5 key modules to build
7. **Code quality gates** — fmt, validate, lint, security scanning
8. **Deployment runbook** — Step-by-step deploy procedures

## Example: E-commerce Platform IaC Design

**Input:**
```
System: E-commerce product catalog (REST API)
Scale: 10K requests/sec peak, 50 GB database
Platform: AWS multi-region
Team: 3 infrastructure engineers, Terraform experts
Timeline: 8 weeks to production
```

**Output:**

### 1. Platform Recommendation

**Terraform** (selected over CloudFormation)

Rationale:
- Multi-cloud flexibility (easier to add Azure later)
- Large module ecosystem (VPC, EKS, RDS pre-built)
- State management: Terraform Cloud for locking + cost estimation
- Team experienced with HCL syntax

Cost: Terraform Cloud free tier sufficient for team of 3

### 2. Repository Structure

```
infrastructure/
├── terraform.tf                 # Backend, versions, terraform cloud config
├── variables.tf                 # All inputs
├── outputs.tf                   # All outputs
├── main.tf                      # Resource definitions
├── locals.tf                    # Local variable calculations
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── rds/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── ecs/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   └── security/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── README.md
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
├── .github/workflows/
│   ├── plan.yml                 # PR validation
│   └── apply.yml                # Merge → deploy
├── .gitignore
├── .terraform-docs.yml          # Auto-generate docs
└── README.md
```

### 3. Environment Strategy

**Single .tf code, multiple environments via tfvars:**

```hcl
# environments/dev.tfvars
environment         = "dev"
aws_region          = "us-east-1"
instance_count      = 1
instance_type       = "t3.micro"
database_class      = "db.t3.micro"
database_storage_gb = 20
enable_backup       = false
enable_monitoring   = false

# environments/prod.tfvars
environment         = "prod"
aws_region          = "us-east-1"
instance_count      = 5
instance_type       = "m5.2xlarge"
database_class      = "db.r6g.2xlarge"
database_storage_gb = 500
enable_backup       = true
enable_monitoring   = true
backup_retention    = 30
```

Deploy: `terraform apply -var-file="environments/prod.tfvars"`

### 4. State Management

**Terraform Cloud backend:**

```hcl
terraform {
  cloud {
    organization = "mycompany"
    
    workspaces {
      name = terraform.workspace
    }
  }
  
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

**Benefits:**
- Remote state (no local .tfstate files)
- Locking (prevents concurrent applies)
- Cost estimation (shows cost delta before apply)
- VCS integration (plan on PR, apply on merge)
- Audit logging (who applied what, when)

### 5. CI/CD Pipeline

**GitHub Actions workflow:**

```yaml
name: Infrastructure Deploy

on:
  pull_request:
    paths: [infrastructure/**]
  push:
    branches: [main]
    paths: [infrastructure/**]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
          cli_config_credentials_token: ${{ secrets.TF_CLOUD_TOKEN }}
      
      - run: cd infrastructure && terraform init
      
      - run: cd infrastructure && terraform fmt -check
      
      - run: cd infrastructure && terraform validate
      
      - run: cd infrastructure && terraform plan -var-file=environments/prod.tfvars -out=tfplan

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          scan-ref: 'infrastructure/'
          
      - uses: bridgecrewio/checkov-action@master
        with:
          directory: infrastructure/
          framework: terraform
          
  apply:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: [validate, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
          cli_config_credentials_token: ${{ secrets.TF_CLOUD_TOKEN }}
      
      - run: cd infrastructure && terraform init
      
      - run: cd infrastructure && terraform apply -var-file=environments/prod.tfvars -auto-approve
      
      - run: cd infrastructure && terraform output -json > outputs.json
      
      - uses: actions/upload-artifact@v3
        with:
          name: tf-outputs
          path: infrastructure/outputs.json
```

### 6. Key Modules

**VPC Module:**
```hcl
module "vpc" {
  source = "./modules/vpc"
  
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  
  tags = merge(
    var.common_tags,
    { Name = "${var.environment}-vpc" }
  )
}
```

**RDS Module:**
```hcl
module "rds" {
  source = "./modules/rds"
  
  environment      = var.environment
  instance_class   = var.database_class
  allocated_storage = var.database_storage_gb
  multi_az         = var.enable_backup
  subnet_ids       = module.vpc.private_subnet_ids
  security_groups  = [aws_security_group.database.id]
  
  tags = merge(
    var.common_tags,
    { Name = "${var.environment}-rds" }
  )
}
```

**ECS Module:**
```hcl
module "ecs" {
  source = "./modules/ecs"
  
  environment    = var.environment
  cluster_name   = "${var.environment}-cluster"
  instance_count = var.instance_count
  instance_type  = var.instance_type
  subnet_ids     = module.vpc.private_subnet_ids
  
  tags = merge(
    var.common_tags,
    { Name = "${var.environment}-ecs" }
  )
}
```

### 7. Code Quality Gates

**Terraform format check:**
```bash
terraform fmt -recursive -check infrastructure/
```

**Validation:**
```bash
terraform validate
```

**Linting (TFLint):**
```bash
tflint --init
tflint --format compact infrastructure/
```

**Security scanning (Checkov):**
```bash
checkov -d infrastructure/ --framework terraform
```

**Cost estimation (Infracost):**
```bash
infracost breakdown --path infrastructure/
```

### 8. Deployment Runbook

**Step 1: Prepare**
```bash
cd infrastructure
terraform init
terraform plan -var-file=environments/prod.tfvars -out=tfplan
```

**Step 2: Review**
```
Review the plan:
- New resources being created?
- Expected resource counts?
- Cost change estimate?
```

**Step 3: Apply**
```bash
terraform apply tfplan
```

**Step 4: Verify**
```bash
terraform output
# Check: VPC ID, subnet IDs, RDS endpoint, ECS cluster, security groups
```

**Step 5: Test**
```bash
# Smoke tests
curl -v https://api.example.com/health
mysql -h <rds-endpoint> -u admin -p -e "SELECT 1;"
```

**Step 6: Rollback (if needed)**
```bash
# Keep previous state
terraform state list
terraform state show 'aws_rds_cluster.prod'

# If critical failure, restore:
terraform destroy -var-file=environments/prod.tfvars
# OR manually fix and re-apply
```

---

**Estimated implementation time:** 4-6 weeks (architecture design + module development + CI/CD setup + testing)

**Success criteria:**
- All infrastructure defined as code
- Automated plan/apply via GitHub Actions
- Diff visible before every change
- Cost estimation in PRs
- Zero manual infrastructure changes
- Reproducible deployments across environments
