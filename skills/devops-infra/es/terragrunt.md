# Terragrunt

## Cuándo activar
Gestión de configuraciones de Terraform en múltiples entornos (dev/staging/prod) que comparten módulos pero necesitan diferentes valores de variables. Reducción de código boilerplate en configuraciones de AWS de múltiples cuentas o múltiples regiones. Orquestación de despliegues ordenados de módulos de Terraform dependientes (VPC antes que ECS antes que RDS). Ejecución de operaciones `run-all` en un árbol de directorios. Configuración de pipelines de promoción de entorno para infraestructura.

## Cuándo no usar
Configuraciones Terraform de un solo entorno donde DRY no es aún una preocupación. Espacios de trabajo de Terraform Cloud/Enterprise que ya manejan estado remoto y gestión de variables. Terragrunt agrega una capa de indirección — no lo introduzca a menos que tenga al menos 2 entornos o 3+ módulos que compartan configuración.

## Instrucciones

### Estructura de Directorios

El diseño canónico de Terragrunt separa la configuración live de las definiciones de módulos:

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

La configuración raíz proporciona estado remoto compartido, generación de proveedor y variables que fluyen hacia abajo:

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

Cada configuración de módulo es mínima — incluye la raíz, apunta a la fuente del módulo, declara dependencias y proporciona anulaciones específicas del entorno:

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

`mock_outputs` permite que `plan` y `validate` se ejecuten sin aplicar primero las dependencias — crítico para ejecuciones de plan solamente en CI en un entorno fresco.

### `run-all` para Despliegues Multi-Módulo

Terragrunt resuelve automáticamente el orden de dependencias y aplica módulos en orden topológico:

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

### Hooks para Acciones Pre/Post

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

### Flujo de Trabajo de Promoción de Entorno

Promueva cambios de infraestructura dev → staging → prod con puertas de aprobación explícitas:

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

## Ejemplo

Configure una estructura Terragrunt de 3 entornos (dev/staging/prod) para AWS VPC + ECS + RDS:

1. Root `terragrunt.hcl` define estado remoto de S3 con claves de estado por entorno (`dev/vpc/terraform.tfstate`), genera el proveedor de AWS con etiquetas de entorno, pasa `aws_region`, `env` e `account_id` como entradas compartidas.
2. Cada entorno tiene `env.hcl` con tipo de instancia, capacidad ECS min/max y clase de instancia RDS ajustadas por entorno.
3. El módulo ECS depende de VPC (para IDs de subred) y RDS (para punto de terminación de base de datos) a través de bloques `dependency` con salidas mock para ejecuciones de plan solamente en CI.
4. `terragrunt run-all apply` en `infra/live/dev` aplica VPC primero, luego RDS y ECS en paralelo (ya que solo dependen de VPC), respeta automáticamente el orden topológico.
5. El pipeline de GitHub Actions promueve dev → staging → prod con puertas de aprobación manuales en cada etapa.

---
