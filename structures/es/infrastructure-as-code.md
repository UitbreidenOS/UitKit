# Infrastructure as Code (Terraform) — Estructura del Proyecto

> Para ingenieros de plataforma y DevOps que gestionan infraestructura de AWS en producción con Terraform y Terragrunt, optimizando el ciclo de revisión de plan/apply e imponiendo estándares de seguridad y etiquetado en todos los entornos.

## Stack

- **IaC:** Terraform 1.7+ (HCL), Terraform Cloud o backend local
- **AWS Provider:** hashicorp/aws ~> 5.0 (VPC, ECS, RDS, S3, CloudFront, ACM, Route53, IAM)
- **Estado remoto:** Backend S3 + bloqueo de estado DynamoDB (un bucket por región)
- **Configuraciones DRY:** Terragrunt 0.55+ (jerarquía `terragrunt.hcl`, `read_terragrunt_config`)
- **Escaneo de seguridad:** Checkov 3.x (`checkov -d .`), tfsec 1.28+ (`tfsec .`)
- **Formato / validación:** `terraform fmt`, `terraform validate`, `tflint 0.50+`
- **CI/CD:** GitHub Actions (`terraform-plan.yml` en PR, `terraform-apply.yml` al fusionar a main)
- **Autenticación:** AWS SSO (`aws sso login --profile <env>`) vía perfiles con nombre en `~/.aws/config`
- **Secretos:** AWS Secrets Manager (sin secretos en el estado — solo referencias ARN almacenadas en salidas de Terraform)
- **Registro de módulos:** Módulos locales en `modules/` fijados por etiqueta de git (`source = "../../modules/vpc?ref=v1.4.0"`)

## Árbol de directorios

```
infra/                                          # Raíz del repositorio
├── .claude/
│   ├── CLAUDE.md                               # Instrucciones a nivel de repositorio para Claude Code
│   ├── settings.json                           # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── new-resource.md                     # /new-resource — scaffold módulo + variables + outputs
│       ├── plan-env.md                         # /plan-env — ejecutar terragrunt plan para un entorno dado
│       ├── checkov-fix.md                      # /checkov-fix — explicar y parchear un hallazgo de Checkov
│       ├── tag-audit.md                        # /tag-audit — escanear todos los recursos para etiquetas faltantes requeridas
│       └── rotate-secret.md                    # /rotate-secret — actualizar Secrets Manager + disparar redeploy
├── .github/
│   └── workflows/
│       ├── terraform-plan.yml                  # PR: verificación de formato, validación, tflint, checkov, tfsec, plan
│       └── terraform-apply.yml                 # Fusión a main: aplicar con autenticación AWS basada en OIDC
├── modules/                                    # Módulos internos reutilizables (versionados semánticamente vía etiquetas de git)
│   ├── vpc/
│   │   ├── main.tf                             # VPC, subnets (público/privado), IGW, puerta de enlace NAT
│   │   ├── variables.tf                        # cidr_block, azs, enable_nat_gateway, single_nat_gateway
│   │   ├── outputs.tf                          # vpc_id, private_subnet_ids, public_subnet_ids
│   │   ├── versions.tf                         # required_providers: aws ~> 5.0, terraform ~> 1.7
│   │   └── README.md
│   ├── ecs-service/
│   │   ├── main.tf                             # Definición de tarea ECS, servicio, grupo objetivo ALB, regla de escucha
│   │   ├── variables.tf                        # cluster_arn, container_image, cpu, memory, port, env_vars
│   │   ├── outputs.tf                          # service_name, task_definition_arn, alb_target_group_arn
│   │   ├── iam.tf                              # Rol de ejecución de tarea, rol de tarea con políticas de menor privilegio
│   │   ├── autoscaling.tf                      # Escalado automático de aplicación: seguimiento de destino CPU/memoria
│   │   ├── versions.tf
│   │   └── README.md
│   ├── rds/
│   │   ├── main.tf                             # Instancia o cluster RDS (Aurora), grupo de subnet, grupo de parámetros
│   │   ├── variables.tf                        # engine, engine_version, instance_class, multi_az, db_name
│   │   ├── outputs.tf                          # db_endpoint, db_port, db_secret_arn (SIN usuario/contraseña)
│   │   ├── security-group.tf                   # SG permitiendo tráfico solo desde SG de tarea ECS + SG de bastión
│   │   ├── versions.tf
│   │   └── README.md
│   ├── s3-bucket/
│   │   ├── main.tf                             # Bucket S3, versionado, encriptación (SSE-S3 o KMS), ciclo de vida
│   │   ├── variables.tf                        # bucket_name_prefix, versioning_enabled, kms_key_arn, cors_rules
│   │   ├── outputs.tf                          # bucket_id, bucket_arn, bucket_domain_name
│   │   ├── policy.tf                           # Política de bucket: aplicar TLS, bloquear acceso público
│   │   ├── versions.tf
│   │   └── README.md
│   └── iam-role/
│       ├── main.tf                             # Rol IAM con assume_role_policy, políticas en línea o gestionadas
│       ├── variables.tf                        # role_name, trusted_services, policy_arns, inline_policy_json
│       ├── outputs.tf                          # role_arn, role_name, instance_profile_arn
│       └── versions.tf
├── environments/
│   ├── terragrunt.hcl                          # Configuración raíz: bucket de estado remoto, región, entradas comunes
│   ├── dev/
│   │   ├── terragrunt.hcl                      # Nivel de entorno: account_id, aws_profile, etiquetas comunes
│   │   ├── vpc/
│   │   │   └── terragrunt.hcl                  # incluir raíz + entorno; entradas para este recurso en dev
│   │   ├── ecs-service/
│   │   │   └── terragrunt.hcl                  # depends_on = [../vpc], entradas: container_image, cpu=256
│   │   ├── rds/
│   │   │   └── terragrunt.hcl                  # depends_on = [../vpc]; instance_class = db.t3.micro
│   │   └── s3-bucket/
│   │       └── terragrunt.hcl
│   ├── staging/
│   │   ├── terragrunt.hcl
│   │   ├── vpc/
│   │   │   └── terragrunt.hcl
│   │   ├── ecs-service/
│   │   │   └── terragrunt.hcl                  # cpu=512, desired_count=2
│   │   ├── rds/
│   │   │   └── terragrunt.hcl                  # multi_az = false, instance_class = db.t3.small
│   │   └── s3-bucket/
│   │       └── terragrunt.hcl
│   └── prod/
│       ├── terragrunt.hcl                      # account_id apunta a cuenta AWS de producción
│       ├── vpc/
│       │   └── terragrunt.hcl                  # 3 AZs, enable_nat_gateway = true, single_nat_gateway = false
│       ├── ecs-service/
│       │   └── terragrunt.hcl                  # cpu=1024, memory=2048, desired_count=3
│       ├── rds/
│       │   └── terragrunt.hcl                  # multi_az = true, instance_class = db.r6g.large
│       ├── cloudfront/
│       │   └── terragrunt.hcl                  # CloudFront + ACM + Route53 (solo prod)
│       └── s3-bucket/
│           └── terragrunt.hcl
├── scripts/
│   ├── init.sh                                 # Bootstrap: crear bucket de estado + tabla DynamoDB si no existen
│   ├── format-check.sh                         # terraform fmt -recursive -check; salir con 1 en diff
│   ├── checkov-scan.sh                         # checkov -d . --framework terraform --compact
│   └── sso-login.sh                            # aws sso login --profile $ENV; export AWS_PROFILE
├── .tflint.hcl                                 # Configuración tflint: plugin aws, reglas (aws_instance_invalid_type)
├── .checkov.yml                                # Checkov: lista de omisión para riesgo aceptado + categorías de verificación
├── .terraform-version                          # Fijación tfenv / tofuenv: 1.7.5
├── .terragrunt-version                         # Fijación tgenv: 0.55.1
└── .gitignore                                  # .terraform/, *.tfstate, *.tfstate.backup, .terraform.lock.hcl
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `environments/terragrunt.hcl` | Configuración raíz de Terragrunt: define el patrón de clave de bucket S3 de estado remoto usando `path_relative_to_include()`, establece la región de AWS e inyecta `common_tags` (Environment, ManagedBy, Repository) en cada módulo hijo |
| `environments/prod/terragrunt.hcl` | Configuración a nivel de entorno: establece `aws_profile = "prod-admin"`, `account_id` y etiquetas específicas del entorno (Environment = "prod", CostCenter) que anulan los valores predeterminados de raíz |
| `environments/prod/ecs-service/terragrunt.hcl` | Configuración Terragrunt a nivel de recurso: declara bloques de `dependency` en VPC y RDS para leer sus salidas; establece dimensionamiento de producción (`cpu=1024`, `desired_count=3`); nunca contiene secretos |
| `modules/rds/outputs.tf` | Salidas `db_secret_arn` (el ARN del secreto de Secrets Manager que contiene las credenciales) — nunca emite el nombre de usuario, contraseña o cadena de conexión real |
| `modules/iam-role/main.tf` | Única fuente de verdad para toda creación de rol IAM; impone prefijo `path = "/app/"` y etiqueta `Name` obligatoria; utilizado por roles de tarea ECS y roles de ejecución Lambda |
| `.github/workflows/terraform-plan.yml` | Ejecuta `fmt -check`, `validate`, `tflint`, `checkov`, `tfsec` y `terragrunt plan` en cada PR; publica el diff del plan como comentario de PR vía `github-actions[bot]`; utiliza OIDC para autenticación AWS (sin claves de larga duración) |
| `.github/workflows/terraform-apply.yml` | Se dispara en fusión a `main`; ejecuta `terragrunt apply -auto-approve` solo en el directorio de entorno cambiado; requiere aprobación manual vía Entornos de GitHub para `prod` |
| `scripts/init.sh` | Bootstrap idempotente: crea el bucket de estado S3 (versionado + encriptación habilitada) y tabla de bloqueo DynamoDB si no existen; seguro ejecutar múltiples veces |

## Andamiaje rápido

```bash
# Requisitos previos: terraform 1.7+, terragrunt 0.55+, aws CLI v2, tflint, checkov, tfsec

# Clonar o crear el repositorio
mkdir infra && cd infra
git init

# Crear los directorios de módulos
mkdir -p modules/vpc modules/ecs-service modules/rds modules/s3-bucket modules/iam-role

# Crear archivos stub para cada módulo
for module in vpc ecs-service rds s3-bucket iam-role; do
  touch modules/$module/main.tf \
        modules/$module/variables.tf \
        modules/$module/outputs.tf \
        modules/$module/versions.tf
done
touch modules/ecs-service/iam.tf modules/ecs-service/autoscaling.tf
touch modules/rds/security-group.tf
touch modules/s3-bucket/policy.tf

# Crear estructura de directorio de entorno
for env in dev staging prod; do
  mkdir -p environments/$env/vpc \
            environments/$env/ecs-service \
            environments/$env/rds \
            environments/$env/s3-bucket
  for resource in vpc ecs-service rds s3-bucket; do
    touch environments/$env/$resource/terragrunt.hcl
  done
  touch environments/$env/terragrunt.hcl
done
mkdir -p environments/prod/cloudfront
touch environments/prod/cloudfront/terragrunt.hcl
touch environments/terragrunt.hcl

# Crear scripts
mkdir -p scripts
touch scripts/init.sh scripts/format-check.sh scripts/checkov-scan.sh scripts/sso-login.sh
chmod +x scripts/*.sh

# Crear flujos de trabajo de GitHub Actions
mkdir -p .github/workflows
touch .github/workflows/terraform-plan.yml
touch .github/workflows/terraform-apply.yml

# Crear archivos de configuración
touch .tflint.hcl .checkov.yml
echo "1.7.5" > .terraform-version
echo "0.55.1" > .terragrunt-version

# Crear .gitignore
cat > .gitignore << 'EOF'
.terraform/
*.tfstate
*.tfstate.backup
.terraform.lock.hcl
*.tfvars
!*.tfvars.example
.env
crash.log
override.tf
override.tf.json
*_override.tf
*_override.tf.json
EOF

# Crear configuración de Claude Code
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-resource.md
touch .claude/commands/plan-env.md
touch .claude/commands/checkov-fix.md
touch .claude/commands/tag-audit.md
touch .claude/commands/rotate-secret.md

# Instalar habilidades de Claudient
npx claudient add skill devops-infra/terraform-module
npx claudient add skill devops-infra/terragrunt-config
npx claudient add skill devops-infra/aws-iam-policy
npx claudient add skill devops-infra/checkov-remediation
npx claudient add skill devops-infra/github-actions-cicd
npx claudient add skill devops-infra/aws-secrets-manager

# Bootstrap de estado remoto (ejecutar una vez por entorno/región)
bash scripts/init.sh dev us-east-1
bash scripts/init.sh staging us-east-1
bash scripts/init.sh prod us-east-1

echo "Repositorio de Terraform andamiado. Ejecutar: aws sso login --profile dev-admin"
```

## Plantilla CLAUDE.md

```markdown
# Infrastructure as Code (Terraform + Terragrunt)

Infraestructura AWS de producción gestionada con Terraform 1.7+ y Terragrunt 0.55+.
Todos los cambios de infraestructura pasan por GitHub Actions: plan en PR, apply en fusión a main.
Ningún secreto se almacena en el estado de Terraform — solo ARNs de AWS Secrets Manager.

## Stack

- Terraform 1.7.5 (fijado vía .terraform-version)
- Terragrunt 0.55.1 (fijado vía .terragrunt-version)
- AWS Provider 5.x — VPC, ECS, RDS, S3, CloudFront, ACM, Route53, IAM
- Estado remoto: S3 + bloqueo DynamoDB (un bucket por entorno/región)
- Seguridad: Checkov 3.x, tfsec 1.28+, tflint 0.50+
- Autenticación: AWS SSO vía perfiles con nombre (dev-admin, staging-admin, prod-admin)
- CI/CD: GitHub Actions con autenticación AWS basada en OIDC (sin credenciales de larga duración en CI)

## Convenciones de directorio

- `modules/` — módulos reutilizables, cada uno con main.tf, variables.tf, outputs.tf, versions.tf
- `environments/<env>/<resource>/terragrunt.hcl` — configuración a nivel de recurso para un entorno específico
- `environments/<env>/terragrunt.hcl` — configuración a nivel de entorno (account_id, aws_profile, etiquetas de entorno)
- `environments/terragrunt.hcl` — configuración raíz (clave de bucket de estado, región, etiquetas comunes)

## Agregar un nuevo recurso de AWS — pasos exactos

1. Decidir si pertenece a un módulo existente o necesita uno nuevo
2. Si nuevo módulo: crear `modules/<name>/` con main.tf, variables.tf, outputs.tf, versions.tf
3. Agregar `tags = merge(var.common_tags, { Name = "..." })` obligatorio a cada recurso etiquetable
4. Declarar bloques de `dependency` en la configuración de Terragrunt si el recurso depende de salidas de VPC/RDS
5. Crear primero `environments/dev/<name>/terragrunt.hcl`; probar con `terragrunt plan` en dev
6. Después de que dev pase, agregar configuraciones de staging y prod
7. Nunca codificar IDs de cuenta, región o IDs de AMI — leerlos de variables o fuentes de datos
8. Usar comando de barra oblicua `/new-resource` para scaffold del código estándar del módulo

## Flujo de trabajo plan/apply

```bash
# Autenticarse primero
aws sso login --profile dev-admin

# Planificar un único recurso en dev
cd environments/dev/ecs-service
terragrunt plan

# Planificar todos los recursos en dev (se ejecuta en orden de dependencia)
cd environments/dev
terragrunt run-all plan

# Aplicar en dev (nunca auto-approve en staging/prod sin revisión de CI)
cd environments/dev/ecs-service
terragrunt apply

# Verificación de formato antes de comprometer
bash scripts/format-check.sh

# Escaneo de seguridad antes de comprometer
bash scripts/checkov-scan.sh
```

## Versionado de módulos

- Los módulos se fijan en configuraciones de Terragrunt usando etiquetas de git: `source = "../../modules/vpc?ref=v1.4.0"`
- Aumentar la etiqueta del módulo en comentario del registro de cambios de `modules/<name>/versions.tf` al hacer cambios que rompan compatibilidad
- Nunca referenciar un módulo por ruta sin una etiqueta `?ref=` — permite actualizaciones lado a lado entre entornos
- Incrementar etiquetas de módulos: `v1.x.0` para cambios que rompen compatibilidad, `v1.1.x` para adiciones compatibles hacia atrás

## Gestión de estado

- Bucket de estado: `<company>-terraform-state-<env>-<region>` (creado por `scripts/init.sh`)
- Tabla de bloqueo DynamoDB: `<company>-terraform-locks-<env>` (LockID como clave hash)
- Nunca ejecutar `terraform state mv`, `terraform state rm` o `terraform import` localmente en prod
  — abrir un PR documentando el cambio y ejecutarlo en CI con un diff de plan
- El bucket de estado tiene versionado habilitado — para recuperarse de una aplicación incorrecta, restaurar versión anterior de estado

## Manejo de secretos — reglas obligatorias

- Los secretos (contraseñas de BD, claves de API, claves privadas TLS) NUNCA se declaran como variables de Terraform
- Los secretos se crean en AWS Secrets Manager fuera de Terraform, o vía `aws_secretsmanager_secret`
  con `lifecycle { ignore_changes = [secret_string] }` para que la rotación no cause desviación
- Las salidas de Terraform solo emiten el ARN del secreto, nunca el valor
- Las definiciones de tarea ECS referencian secretos vía bloque `secrets` con `valueFrom = secret_arn`
- El módulo RDS emite `db_secret_arn`; la aplicación lee credenciales en tiempo de ejecución usando SDK

## Convenciones de etiquetado — cada recurso debe tener estas etiquetas

| Etiqueta | Valor | Establecer por |
|---|---|---|
| Environment | dev / staging / prod | terragrunt.hcl a nivel de entorno |
| ManagedBy | terraform | terragrunt.hcl raíz |
| Repository | github.com/org/infra | terragrunt.hcl raíz |
| Service | vpc / ecs-service / rds / etc. | variable de entrada del módulo `service_name` |
| CostCenter | platform / backend / data | terragrunt.hcl a nivel de entorno |
| Owner | team-platform@company.com | terragrunt.hcl a nivel de entorno |

Ejecutar `/tag-audit` para escanear recursos sin etiquetas requeridas antes de abrir un PR.

## Remediación Checkov / tfsec

- No agregar `#checkov:skip` sin un ticket JIRA en el comentario: `#checkov:skip=CKV_AWS_18:PLAT-1234`
- Las omisiones aceptadas se documentan en `.checkov.yml` con un comentario de justificación
- Ejecutar `/checkov-fix` para obtener una explicación y parche propuesto para un hallazgo específico
- Todos los módulos nuevos deben pasar `checkov -d modules/<name>` antes de fusionarse

## Qué no hacer

- No ejecutar `terraform apply` directamente en staging o prod — usar CI
- No almacenar claves de acceso de AWS en ningún archivo; usar perfiles de AWS SSO
- No emitir valores sensibles (contraseñas, claves privadas) desde ningún módulo
- No usar `count` para recursos que tienen identidades lógicas únicas — usar `for_each` con un mapa
- No crear políticas IAM con `"Action": "*"` o `"Resource": "*"` — reducir su alcance
- No editar `.terraform.lock.hcl` a mano — ejecutar `terraform providers lock` para actualizarlo
```

## Servidores MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/infra"
      ]
    },
    "aws": {
      "command": "npx",
      "args": ["-y", "@aws/mcp-server-aws-resources"],
      "env": {
        "AWS_PROFILE": "dev-admin",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## Hooks recomendados

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.tf ]]; then terraform fmt \"$f\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.tf ]]; then dir=$(dirname \"$f\"); checkov -d \"$dir\" --compact --quiet 2>/dev/null | grep FAILED && echo \"[HOOK] Checkov findings above — run /checkov-fix\" >&2 || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"terragrunt apply|terraform apply\"; then env=$(echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -oP \"environments/\\K[^/]+\" || echo \"unknown\"); if [[ \"$env\" == \"prod\" ]]; then echo \"[HOOK] Applying to PROD — ensure CI approval is complete\" >&2; fi; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades para instalar

```bash
npx claudient add skill devops-infra/terraform-module
npx claudient add skill devops-infra/terragrunt-config
npx claudient add skill devops-infra/aws-iam-policy
npx claudient add skill devops-infra/checkov-remediation
npx claudient add skill devops-infra/tfsec-remediation
npx claudient add skill devops-infra/github-actions-cicd
npx claudient add skill devops-infra/aws-secrets-manager
npx claudient add skill devops-infra/aws-vpc-design
npx claudient add skill devops-infra/ecs-service-deploy
```

## Relacionados

- [Guía de Creación de Módulos de Terraform](../guides/terraform-modules.md)
- [Flujo de Trabajo de Promoción de Entorno de AWS](../workflows/terraform-env-promotion.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
