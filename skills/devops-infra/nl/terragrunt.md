# Terragrunt

## Wanneer activeren
Beheren van Terraform-configuraties over meerdere omgevingen (dev/staging/prod) die modules delen maar verschillende variable values nodig hebben. Reduceren van boilerplate in multi-account AWS of multi-region setups. Orchestreren van geordende deployments van afhankelijke Terraform-modules (VPC voordat ECS voordat RDS). Uitvoeren van `run-all` operaties over directory tree. Instellen van environment promotion pipelines voor infrastructuur.

## Wanneer niet gebruiken
Single-environment Terraform setups waar DRY nog geen aandacht is. Terraform Cloud/Enterprise workspaces die al remote state en variabele beheer afhandelen. Terragrunt voegt een indirectie laag toe — introduceer het niet tenzij u minstens 2 omgevingen of 3+ modules hebt die configuratie delen.

## Instructies

### Directory Structuur

De canonieke Terragrunt layout scheidt live configuratie van module definities:

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

De root config voorziet shared remote state, provider generation en variabelen die omlaag stromen:

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

Elke module config is minimaal — het bevat de root, wijst op de module bron, declareert dependencies en voorziet environment-specifieke overrides:

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

`mock_outputs` stellen `plan` en `validate` in staat zonder eerst dependencies toe te passen — kritiek voor CI pipelines op een frisse omgeving.

### `run-all` voor Multi-Module Deployments

Terragrunt lost dependency order automatisch op en past modules in topologische volgorde toe:

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

### Hooks voor Pre/Post Acties

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

Promoveer infrastructuur wijzigingen dev → staging → prod met expliciete approvaalgatters:

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

## Voorbeeld

Stel een 3-environment Terragrunt structuur (dev/staging/prod) in voor AWS VPC + ECS + RDS:

1. Root `terragrunt.hcl` definieert S3 remote state met per-environment state keys (`dev/vpc/terraform.tfstate`), genereert AWS provider met environment tags, geeft `aws_region`, `env` en `account_id` door als shared inputs.
2. Elke omgeving heeft `env.hcl` met instance type, min/max ECS capaciteit en RDS instance class per omgeving afgestemd.
3. ECS module hangt af van VPC (voor subnet IDs) en RDS (voor DB endpoint) via `dependency` blokken met mock outputs voor plan-only CI runs.
4. `terragrunt run-all apply` op `infra/live/dev` past VPC eerst toe, dan RDS en ECS in parallel (omdat deze alleen van VPC afhangen), respecteert topologische volgorde automatisch.
5. GitHub Actions pipeline promoveert dev → staging → prod met handmatige approvaalgatters bij elk stadium.

---
