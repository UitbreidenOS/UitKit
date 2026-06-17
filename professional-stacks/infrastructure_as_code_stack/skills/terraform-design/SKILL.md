# Terraform Design Skill

## When to activate

When designing new Terraform projects, refactoring module structure, establishing variable taxonomy, planning remote state configuration, or architecting multi-environment infrastructure with Terraform.

## When NOT to use

For one-off infrastructure scripts or temporary testing environments that don't require modularity, versioning, or team collaboration.

## Instructions

### Design Phase

Start with infrastructure requirements and decompose into modules:

1. **Identify module boundaries:** Groups of resources that are logically cohesive, reusable, and independently managed
   - Core infrastructure: VPC, subnets, route tables, NAT gateways
   - Compute: ECS clusters, Kubernetes worker nodes, Lambda layers
   - Databases: RDS instances, DynamoDB tables, Elasticache clusters
   - Security: IAM roles, policies, KMS keys, security groups
   - Observability: CloudWatch, Prometheus, ELK stack

2. **Design variable taxonomy:**
   - Required inputs: CIDR blocks, instance types, database sizes
   - Optional inputs with sensible defaults: environment tags, replica counts
   - Use `type` constraints: `string`, `number`, `list(string)`, `object({...})`
   - Add `validation` blocks for non-obvious constraints
   - Document with `description` and `sensitive` flags

3. **Design outputs:**
   - Export only what consumers need: VPC ID, security group IDs, database endpoints
   - Use descriptive names: `vpc_id`, `private_subnet_ids`, `rds_endpoint`
   - Add `description` to every output

4. **Plan state management:**
   - Local state only for dev/local testing
   - Remote state for all production infrastructure:
     - Backend: S3 + DynamoDB for AWS, Cloud Storage + Firestore for GCP, Storage Account for Azure
     - Encryption at rest and in transit
     - State locking to prevent concurrent modifications
   - Separate state files per environment: dev, staging, prod
   - Never commit state files; use `.gitignore`

5. **Design directory structure:**
   ```
   terraform/
   ├── modules/                    # Reusable modules
   │   ├── vpc/
   │   ├── rds/
   │   ├── security_group/
   │   └── iam/
   ├── environments/               # Environment-specific configs
   │   ├── dev/
   │   │   ├── main.tf
   │   │   ├── variables.tfvars
   │   │   └── backend.tf
   │   ├── staging/
   │   └── prod/
   ├── global/                     # Shared infrastructure
   │   ├── main.tf
   │   └── variables.tf
   ├── main.tf                     # Root module
   ├── variables.tf
   ├── outputs.tf
   ├── versions.tf
   ├── terraform.tfvars            # Shared variables (non-sensitive)
   └── README.md
   ```

### Module Implementation

```hcl
# modules/vpc/main.tf
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "project_name" {
  type        = string
  description = "Project name for resource naming"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for VPC"
  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "vpc_cidr must be a valid CIDR block"
  }
}

variable "enable_nat_gateway" {
  type        = bool
  default     = true
  description = "Enable NAT Gateway for private subnet egress"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Common tags for all resources"
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-vpc"
    }
  )
}

resource "aws_subnet" "private" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 2, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-private-subnet-${count.index + 1}"
      Tier = "Private"
    }
  )
}

output "vpc_id" {
  value       = aws_vpc.main.id
  description = "VPC ID"
}

output "vpc_cidr_block" {
  value       = aws_vpc.main.cidr_block
  description = "VPC CIDR block"
}

output "private_subnet_ids" {
  value       = aws_subnet.private[*].id
  description = "Private subnet IDs"
}
```

### Remote State Configuration

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### Environment Variables

```hcl
# environments/prod/variables.tfvars
project_name        = "myapp"
vpc_cidr             = "10.0.0.0/16"
enable_nat_gateway   = true
tags = {
  environment = "prod"
  owner       = "platform-team"
  cost_center = "engineering"
}
```

## Example

**Scenario:** Design Terraform for a microservices platform with VPC, EKS cluster, RDS database, and observability stack.

**Solution:**

1. **Module structure:**
   - `modules/vpc/` — VPC, subnets, NAT, route tables
   - `modules/eks/` — EKS cluster, worker nodes, node groups
   - `modules/rds/` — RDS instance, subnet group, parameter group
   - `modules/kms/` — Encryption keys
   - `modules/monitoring/` — CloudWatch, application logs

2. **Variables taxonomy:**
   - Required: `environment`, `vpc_cidr`, `cluster_version`, `db_instance_class`
   - Optional: `enable_nat_gateway=true`, `enable_monitoring=true`, `replica_count=3`
   - All inputs validated: CIDR format, EKS version compatibility, instance type whitelist

3. **Outputs:**
   - `eks_cluster_name` — For kubectl config
   - `rds_endpoint` — For application config
   - `kms_key_arn` — For encryption policies
   - `nat_gateway_ips` — For firewall rules

4. **State strategy:**
   - Prod state in S3 with encryption, versioning, locking
   - Separate state files: `prod/kubernetes.tfstate`, `prod/databases.tfstate`
   - State locked during terraform apply

5. **Directory layout:**
   ```
   terraform/
   ├── modules/
   │   ├── vpc/
   │   ├── eks/
   │   ├── rds/
   │   ├── kms/
   │   └── monitoring/
   ├── environments/prod/
   │   ├── main.tf        # Root module composition
   │   ├── variables.tfvars
   │   ├── backend.tf
   │   └── outputs.tf
   └── versions.tf        # Provider versions (shared)
   ```

This design ensures:
- Modules are reusable across environments
- Variables parameterize all infrastructure
- State is safe and versioned
- Directory structure scales to 100+ resources
- New team members understand the layout
