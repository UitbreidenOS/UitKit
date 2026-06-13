---
name: "Terragrunt"
description: "Managing Terraform configurations across multiple environments (dev/staging/prod) that share modules but need different variable values. Reducing boilerplate in multi-account AWS or multi-region setup"
---

# Terragrunt

## When to activate
Managing Terraform configurations across multiple environments (dev/staging/prod) that share modules but need different variable values. Reducing boilerplate in multi-account AWS or multi-region setups. Orchestrating ordered deployments of dependent Terraform modules (VPC before ECS before RDS). Running `run-all` operations across a directory tree. Setting up environment promotion pipelines for infrastructure.

## When NOT to use
Single-environment Terraform setups where DRY is not yet a concern. Terraform Cloud/Enterprise workspaces that already handle remote state and variable management. Terragrunt adds a layer of indirection — do not introduce it unless you have at least 2 environments or 3+ modules that share configuration.

## Instructions

### Directory Structure

The canonical Terragrunt layout separates live configuration from module definitions:

```
infra/
  modules/          # Reusable Terraform modules (vpc, ecs, rds)
  live/
    terragrunt.hcl  # Root config — remote state, provider, shared vars
    dev/
      terragrunt.hcl            # Environment-specific inputs
      vpc/
        terragrunt.hcl
      ecs/
        terragrunt.hcl
      rds/
        terragrunt.hcl
    staging/
      terragrunt.hcl
      vpc/ ecs/ rds/            # Same structure, different values
    prod/
      terragrunt.hcl
      vpc/ ecs/ rds/
```

### Root `terragrunt.hcl`

The root config provides shared remote state, provider generation, and variables that flow down:

```hcl
# infra/live/terragrunt.hcl

locals {
  account_vars = read_terragrunt_config(find_in_parent_folders("account.hcl"))
  env_vars     = read_terragrunt_config(find_in_parent_folders("env.hcl"))

  aws_region   = local.account_vars.locals.aws_region
  account_id   = local.account_vars.locals.account_id
  env          = local.env_vars.locals.env
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    bucket         = "my-tf-state-${local.account_id}"
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = local.aws_region
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "aws" {
  region = "${local.aws_region}"
  default_tags {
    tags = {
      Environment = "${local.env}"
      ManagedBy   = "terragrunt"
    }
  }
}
EOF
}

# Pass shared inputs down to all child modules
inputs = {
  aws_region = local.aws_region
  env        = local.env
  account_id = local.account_id
}
```

### Environment-Level `env.hcl`

```hcl
# infra/live/dev/env.hcl
locals {
  env           = "dev"
  instance_type = "t3.small"
  min_capacity  = 1
  max_capacity  = 3
}
```

```hcl
# infra/live/prod/env.hcl
locals {
  env           = "prod"
  instance_type = "c6i.xlarge"
  min_capacity  = 3
  max_capacity  = 20
}
```

### Module-Level `terragrunt.hcl`

Each module config is minimal — it includes the root, points at the module source, declares dependencies, and provides environment-specific overrides:

```hcl
# infra/live/dev/ecs/terragrunt.hcl

include "root" {
  path   = find_in_parent_folders()
  expose = true
}

locals {
  env_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))
}

terraform {
  source = "../../../../modules//ecs"
}

dependency "vpc" {
  config_path = "../vpc"
  mock_outputs = {
    vpc_id             = "vpc-00000000"
    private_subnet_ids = ["subnet-00000001", "subnet-00000002"]
  }
  mock_outputs_allowed_terraform_commands = ["validate", "plan"]
}

dependency "rds" {
  config_path = "../rds"
  mock_outputs = {
    db_endpoint = "localhost:5432"
  }
  mock_outputs_allowed_terraform_commands = ["validate", "plan"]
}

inputs = {
  vpc_id             = dependency.vpc.outputs.vpc_id
  private_subnet_ids = dependency.vpc.outputs.private_subnet_ids
  db_endpoint        = dependency.rds.outputs.db_endpoint
  instance_type      = local.env_vars.locals.instance_type
  min_capacity       = local.env_vars.locals.min_capacity
  max_capacity       = local.env_vars.locals.max_capacity
}
```

`mock_outputs` allow `plan` and `validate` to run without applying dependencies first — critical for CI pipelines on a fresh environment.

### `run-all` for Multi-Module Deployments

Terragrunt resolves dependency order automatically and applies modules in topological order:

```bash
# Plan all modules in dev, respecting dependency order
terragrunt run-all plan --terragrunt-working-dir infra/live/dev

# Apply all modules in dev
terragrunt run-all apply --terragrunt-working-dir infra/live/dev

# Apply only a subset
terragrunt run-all apply \
  --terragrunt-include-dir "**/vpc" \
  --terragrunt-include-dir "**/ecs" \
  --terragrunt-working-dir infra/live/prod

# Destroy in reverse dependency order
terragrunt run-all destroy --terragrunt-working-dir infra/live/dev
```

### Hooks for Pre/Post Actions

```hcl
terraform {
  source = "../../../../modules//rds"

  before_hook "validate_secrets" {
    commands = ["apply", "plan"]
    execute  = ["bash", "-c", "aws secretsmanager describe-secret --secret-id db-password-${local.env_vars.locals.env} > /dev/null"]
  }

  after_hook "notify_slack" {
    commands     = ["apply"]
    execute      = ["bash", "scripts/notify-slack.sh", "RDS apply complete in ${local.env_vars.locals.env}"]
    run_on_error = false
  }
}
```

### Environment Promotion Workflow

Promote infrastructure changes dev → staging → prod with explicit approval gates:

```yaml
# .github/workflows/infra-promote.yml
name: Infra Promote
on:
  push:
    branches: [main]
    paths: ["infra/**"]

jobs:
  plan-dev:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: terragrunt run-all plan --terragrunt-working-dir infra/live/dev
        env:
          AWS_ROLE_ARN: ${{ secrets.DEV_ROLE_ARN }}

  apply-dev:
    needs: plan-dev
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: terragrunt run-all apply --terragrunt-non-interactive --terragrunt-working-dir infra/live/dev

  apply-staging:
    needs: apply-dev
    environment: staging   # requires manual approval in GitHub
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: terragrunt run-all apply --terragrunt-non-interactive --terragrunt-working-dir infra/live/staging

  apply-prod:
    needs: apply-staging
    environment: production  # requires manual approval
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: terragrunt run-all apply --terragrunt-non-interactive --terragrunt-working-dir infra/live/prod
```

## Example

Set up a 3-environment (dev/staging/prod) Terragrunt structure for AWS VPC + ECS + RDS:

1. Root `terragrunt.hcl` defines S3 remote state with per-environment state keys (`dev/vpc/terraform.tfstate`), generates the AWS provider with environment tags, passes `aws_region`, `env`, and `account_id` as shared inputs.
2. Each environment has `env.hcl` with instance type, min/max ECS capacity, and RDS instance class tuned per environment.
3. ECS module depends on VPC (for subnet IDs) and RDS (for the DB endpoint) via `dependency` blocks with mock outputs for plan-only CI runs.
4. `terragrunt run-all apply` on `infra/live/dev` applies VPC first, then RDS and ECS in parallel (since they depend only on VPC), respecting topological order automatically.
5. GitHub Actions pipeline promotes dev → staging → prod with manual approval gates at each stage.

---
