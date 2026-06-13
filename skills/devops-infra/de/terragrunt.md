# Terragrunt

## Wann aktivieren
Verwaltung von Terraform-Konfigurationen über mehrere Umgebungen (dev/staging/prod), die Module teilen aber unterschiedliche Variablenwerte benötigen. Reduzierung von Boilerplate in Multi-Account-AWS- oder Multi-Region-Setups. Orchestrierung von geordneten Deployments abhängiger Terraform-Module (VPC vor ECS vor RDS). Ausführung von `run-all`-Operationen über eine Verzeichnisstruktur. Einrichtung von Environment Promotion Pipelines für Infrastruktur.

## Wann nicht verwenden
Single-Environment-Terraform-Setups, bei denen DRY noch nicht relevant ist. Terraform Cloud/Enterprise Workspaces, die bereits Remote State und Variablenverwaltung handhaben. Terragrunt fügt eine Indirektionsebene hinzu — führen Sie es nur ein, wenn Sie mindestens 2 Umgebungen oder 3+ Module haben, die Konfiguration teilen.

## Anweisungen

### Verzeichnisstruktur

Das kanonische Terragrunt-Layout trennt Live-Konfiguration von Moduldefinitionen:

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

Die Root-Konfiguration bietet gemeinsam genutzten Remote State, Provider-Generierung und Variablen, die nach unten fließen:

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

Jede Modulkonfiguration ist minimal — sie beinhaltet die Root, zeigt auf die Modulquelle, deklariert Abhängigkeiten und stellt umgebungsspezifische Überrides bereit:

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

`mock_outputs` ermöglichen es `plan` und `validate`, ohne vorherige Abhängigkeitsanwendung zu laufen — entscheidend für CI-Pipelines in einer frischen Umgebung.

### `run-all` für Multi-Module-Deployments

Terragrunt löst die Abhängigkeitsreihenfolge automatisch auf und wendet Module in topologischer Reihenfolge an:

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

### Hooks für Pre/Post-Aktionen

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

Fördern Sie Infrastrukturänderungen dev → staging → prod mit expliziten Genehmigungsgattern:

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

## Beispiel

Richten Sie eine 3-Umgebungs-Terragrunt-Struktur (dev/staging/prod) für AWS VPC + ECS + RDS ein:

1. Root `terragrunt.hcl` definiert S3 Remote State mit Per-Environment State Keys (`dev/vpc/terraform.tfstate`), generiert AWS Provider mit Environment Tags, übergibt `aws_region`, `env` und `account_id` als gemeinsame Eingaben.
2. Jede Umgebung hat `env.hcl` mit Instance-Typ, min/max ECS-Kapazität und RDS-Instanzklasse pro Umgebung abgestimmt.
3. ECS-Modul hängt von VPC (für Subnet-IDs) und RDS (für DB-Endpunkt) über `dependency` Blöcke mit Mock-Outputs für Plan-Only CI-Läufe ab.
4. `terragrunt run-all apply` auf `infra/live/dev` wendet VPC zuerst an, dann RDS und ECS parallel (da diese nur von VPC abhängen), respektiert topologische Reihenfolge automatisch.
5. GitHub Actions Pipeline fördert dev → staging → prod mit manuellen Genehmigungsgattern bei jeder Stufe.

---
