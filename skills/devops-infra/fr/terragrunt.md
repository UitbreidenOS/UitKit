# Terragrunt

## Quand activer
Gestion de configurations Terraform sur plusieurs environnements (dev/staging/prod) qui partagent des modules mais nécessitent des valeurs de variables différentes. Réduction du code boilerplate dans des configurations AWS multi-compte ou multi-région. Orchestration de déploiements ordonnés de modules Terraform dépendants (VPC avant ECS avant RDS). Exécution d'opérations `run-all` sur une arborescence de répertoires. Configuration de pipelines de promotion d'environnement pour l'infrastructure.

## Quand ne pas utiliser
Configurations Terraform à un seul environnement où DRY n'est pas encore une préoccupation. Espaces de travail Terraform Cloud/Enterprise qui gèrent déjà l'état distant et la gestion des variables. Terragrunt ajoute une couche d'indirection — ne l'introduisez pas à moins d'avoir au moins 2 environnements ou 3+ modules qui partagent de la configuration.

## Instructions

### Structure de Répertoires

La disposition Terragrunt canonique sépare la configuration live des définitions de modules :

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

La config root fournit l'état distant partagé, la génération de provider et les variables qui se propagent vers le bas :

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

Chaque config de module est minimale — elle inclut la root, pointe sur la source du module, déclare les dépendances et fournit des remplacements spécifiques à l'environnement :

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

`mock_outputs` permettent à `plan` et `validate` de fonctionner sans appliquer d'abord les dépendances — critique pour les pipelines CI sur un environnement frais.

### `run-all` pour les Déploiements Multi-Module

Terragrunt résout automatiquement l'ordre des dépendances et applique les modules dans l'ordre topologique :

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

### Hooks pour les Actions Pré/Post

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

### Flux de Travail de Promotion d'Environnement

Promouvoir les modifications d'infrastructure dev → staging → prod avec des portes d'approbation explicites :

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

## Exemple

Mettez en place une structure Terragrunt à 3 environnements (dev/staging/prod) pour AWS VPC + ECS + RDS :

1. Root `terragrunt.hcl` définit l'état distant S3 avec des clés d'état par environnement (`dev/vpc/terraform.tfstate`), génère le provider AWS avec des tags d'environnement, passe `aws_region`, `env` et `account_id` comme entrées partagées.
2. Chaque environnement a `env.hcl` avec un type d'instance, une capacité ECS min/max et une classe d'instance RDS réglées par environnement.
3. Le module ECS dépend de VPC (pour les ID de sous-réseau) et RDS (pour le point de terminaison DB) via des blocs `dependency` avec des outputs fictifs pour les exécutions planifier-uniquement en CI.
4. `terragrunt run-all apply` sur `infra/live/dev` applique VPC d'abord, puis RDS et ECS en parallèle (puisqu'ils dépendent uniquement de VPC), respectant automatiquement l'ordre topologique.
5. Le pipeline GitHub Actions promeut dev → staging → prod avec des portes d'approbation manuelles à chaque étape.

---
