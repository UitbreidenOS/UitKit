# Infrastructure as Code (Terraform) — Project Structuur

> Voor platform- en DevOps-engineers die productie-AWS-infrastructuur met Terraform en Terragrunt beheren, optimaliserend de plan/apply-reviewcyclus en handhavend beveiligings- en taggingnormen in alle omgevingen.

## Stack

- **IaC:** Terraform 1.7+ (HCL), Terraform Cloud of lokale backend
- **AWS Provider:** hashicorp/aws ~> 5.0 (VPC, ECS, RDS, S3, CloudFront, ACM, Route53, IAM)
- **Externe state:** S3 backend + DynamoDB state locking (één bucket per regio)
- **DRY-configs:** Terragrunt 0.55+ (`terragrunt.hcl` hiërarchie, `read_terragrunt_config`)
- **Beveiligingsscanning:** Checkov 3.x (`checkov -d .`), tfsec 1.28+ (`tfsec .`)
- **Opmaak / validatie:** `terraform fmt`, `terraform validate`, `tflint 0.50+`
- **CI/CD:** GitHub Actions (`terraform-plan.yml` op PR, `terraform-apply.yml` op merge naar main)
- **Authenticatie:** AWS SSO (`aws sso login --profile <env>`) via `~/.aws/config` benoemde profielen
- **Secrets:** AWS Secrets Manager (geen secrets in state — alleen ARN-referenties opgeslagen in Terraform-outputs)
- **Module registry:** Lokale modules in `modules/` vastgezet via git tag (`source = "../../modules/vpc?ref=v1.4.0"`)

## Directorystructuur

```
infra/                                          # Repository root
├── .claude/
│   ├── CLAUDE.md                               # Repo-level instructies voor Claude Code
│   ├── settings.json                           # MCP servers, hooks, permissies
│   └── commands/
│       ├── new-resource.md                     # /new-resource — scaffold module + variabelen + outputs
│       ├── plan-env.md                         # /plan-env — terragrunt plan uitvoeren voor een gegeven omgeving
│       ├── checkov-fix.md                      # /checkov-fix — Checkov bevinding uitleggen en patchen
│       ├── tag-audit.md                        # /tag-audit — alle resources scannen op ontbrekende vereiste tags
│       └── rotate-secret.md                    # /rotate-secret — Secrets Manager bijwerken + redeploy triggeren
├── .github/
│   └── workflows/
│       ├── terraform-plan.yml                  # PR: fmt check, validate, tflint, checkov, tfsec, plan
│       └── terraform-apply.yml                 # Merge naar main: apply met OIDC-gebaseerde AWS-authenticatie
├── modules/                                    # Herbruikbare interne modules (semantisch geverseerd via git tags)
│   ├── vpc/
│   │   ├── main.tf                             # VPC, subnets (public/private), IGW, NAT gateway
│   │   ├── variables.tf                        # cidr_block, azs, enable_nat_gateway, single_nat_gateway
│   │   ├── outputs.tf                          # vpc_id, private_subnet_ids, public_subnet_ids
│   │   ├── versions.tf                         # required_providers: aws ~> 5.0, terraform ~> 1.7
│   │   └── README.md
│   ├── ecs-service/
│   │   ├── main.tf                             # ECS task definition, service, ALB target group, listener rule
│   │   ├── variables.tf                        # cluster_arn, container_image, cpu, memory, port, env_vars
│   │   ├── outputs.tf                          # service_name, task_definition_arn, alb_target_group_arn
│   │   ├── iam.tf                              # Task execution role, task role met least-privilege policies
│   │   ├── autoscaling.tf                      # Application Auto Scaling: CPU/memory target tracking
│   │   ├── versions.tf
│   │   └── README.md
│   ├── rds/
│   │   ├── main.tf                             # RDS instance of cluster (Aurora), subnet group, param group
│   │   ├── variables.tf                        # engine, engine_version, instance_class, multi_az, db_name
│   │   ├── outputs.tf                          # db_endpoint, db_port, db_secret_arn (GEEN username/password)
│   │   ├── security-group.tf                   # SG allowing verkeer alleen van ECS task SG + bastion SG
│   │   ├── versions.tf
│   │   └── README.md
│   ├── s3-bucket/
│   │   ├── main.tf                             # S3 bucket, versioning, encryption (SSE-S3 of KMS), lifecycle
│   │   ├── variables.tf                        # bucket_name_prefix, versioning_enabled, kms_key_arn, cors_rules
│   │   ├── outputs.tf                          # bucket_id, bucket_arn, bucket_domain_name
│   │   ├── policy.tf                           # Bucket policy: enforce TLS, block public access
│   │   ├── versions.tf
│   │   └── README.md
│   └── iam-role/
│       ├── main.tf                             # IAM role met assume_role_policy, inline of managed policies
│       ├── variables.tf                        # role_name, trusted_services, policy_arns, inline_policy_json
│       ├── outputs.tf                          # role_arn, role_name, instance_profile_arn
│       └── versions.tf
├── environments/
│   ├── terragrunt.hcl                          # Root config: remote state bucket, region, common inputs
│   ├── dev/
│   │   ├── terragrunt.hcl                      # Env-level: account_id, aws_profile, common tags
│   │   ├── vpc/
│   │   │   └── terragrunt.hcl                  # include root + env; inputs voor deze resource in dev
│   │   ├── ecs-service/
│   │   │   └── terragrunt.hcl                  # depends_on = [../vpc], inputs: container_image, cpu=256
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
│       ├── terragrunt.hcl                      # account_id wijst naar production AWS account
│       ├── vpc/
│       │   └── terragrunt.hcl                  # 3 AZs, enable_nat_gateway = true, single_nat_gateway = false
│       ├── ecs-service/
│       │   └── terragrunt.hcl                  # cpu=1024, memory=2048, desired_count=3
│       ├── rds/
│       │   └── terragrunt.hcl                  # multi_az = true, instance_class = db.r6g.large
│       ├── cloudfront/
│       │   └── terragrunt.hcl                  # CloudFront + ACM + Route53 (alleen prod)
│       └── s3-bucket/
│           └── terragrunt.hcl
├── scripts/
│   ├── init.sh                                 # Bootstrap: state bucket + DynamoDB tabel aanmaken als niet aanwezig
│   ├── format-check.sh                         # terraform fmt -recursive -check; exit 1 op diff
│   ├── checkov-scan.sh                         # checkov -d . --framework terraform --compact
│   └── sso-login.sh                            # aws sso login --profile $ENV; export AWS_PROFILE
├── .tflint.hcl                                 # tflint config: aws plugin, rules (aws_instance_invalid_type)
├── .checkov.yml                                # Checkov: skip list voor geaccepteerd risico + check categorieën
├── .terraform-version                          # tfenv / tofuenv pin: 1.7.5
├── .terragrunt-version                         # tgenv pin: 0.55.1
└── .gitignore                                  # .terraform/, *.tfstate, *.tfstate.backup, .terraform.lock.hcl
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `environments/terragrunt.hcl` | Root Terragrunt config: definieert het S3-bucket-sleutelpatroon voor externe state met `path_relative_to_include()`, stelt de AWS-regio in en injecteert `common_tags` (Environment, ManagedBy, Repository) in alle onderliggende modules |
| `environments/prod/terragrunt.hcl` | Environment-level config: stelt `aws_profile = "prod-admin"` in, `account_id`, en env-specifieke tags (Environment = "prod", CostCenter) die root defaults vervangen |
| `environments/prod/ecs-service/terragrunt.hcl` | Resource-level Terragrunt config: declareert `dependency` blokken op VPC en RDS om hun outputs te lezen; stelt production sizing in (`cpu=1024`, `desired_count=3`); bevat nooit secrets |
| `modules/rds/outputs.tf` | Outputs `db_secret_arn` (de ARN van het Secrets Manager secret met credentials) — outputtet nooit de werkelijke username, password, of connection string |
| `modules/iam-role/main.tf` | Enige bron van waarheid voor alle IAM role creatie; dwingt `path = "/app/"` prefix af en een verplichte `Name` tag; gebruikt door ECS task roles en Lambda execution roles |
| `.github/workflows/terraform-plan.yml` | Voert `fmt -check`, `validate`, `tflint`, `checkov`, `tfsec`, en `terragrunt plan` uit op elke PR; plaatst het plan diff als PR comment via `github-actions[bot]`; gebruikt OIDC voor AWS authenticatie (geen langlevende sleutels) |
| `.github/workflows/terraform-apply.yml` | Geactiveerd op merge naar `main`; voert `terragrunt apply -auto-approve` uit alleen in de gewijzigde environment directory; vereist handmatige goedkeuring via GitHub Environments voor `prod` |
| `scripts/init.sh` | Idempotente bootstrap: maakt de S3 state bucket (versioning + encryption enabled) en DynamoDB lock tabel aan als zij niet bestaan; veilig om meerdere keren uit te voeren |

## Snelle scaffold

```bash
# Vereisten: terraform 1.7+, terragrunt 0.55+, aws CLI v2, tflint, checkov, tfsec

# Clone of maak de repo aan
mkdir infra && cd infra
git init

# Maak de module directories aan
mkdir -p modules/vpc modules/ecs-service modules/rds modules/s3-bucket modules/iam-role

# Maak stub bestanden voor elke module aan
for module in vpc ecs-service rds s3-bucket iam-role; do
  touch modules/$module/main.tf \
        modules/$module/variables.tf \
        modules/$module/outputs.tf \
        modules/$module/versions.tf
done
touch modules/ecs-service/iam.tf modules/ecs-service/autoscaling.tf
touch modules/rds/security-group.tf
touch modules/s3-bucket/policy.tf

# Maak environment directory structuur aan
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

# Maak scripts aan
mkdir -p scripts
touch scripts/init.sh scripts/format-check.sh scripts/checkov-scan.sh scripts/sso-login.sh
chmod +x scripts/*.sh

# Maak GitHub Actions workflows aan
mkdir -p .github/workflows
touch .github/workflows/terraform-plan.yml
touch .github/workflows/terraform-apply.yml

# Maak config bestanden aan
touch .tflint.hcl .checkov.yml
echo "1.7.5" > .terraform-version
echo "0.55.1" > .terragrunt-version

# Maak .gitignore aan
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

# Maak Claude Code config aan
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-resource.md
touch .claude/commands/plan-env.md
touch .claude/commands/checkov-fix.md
touch .claude/commands/tag-audit.md
touch .claude/commands/rotate-secret.md

# Installeer Claudient skills
npx claudient add skill devops-infra/terraform-module
npx claudient add skill devops-infra/terragrunt-config
npx claudient add skill devops-infra/aws-iam-policy
npx claudient add skill devops-infra/checkov-remediation
npx claudient add skill devops-infra/github-actions-cicd
npx claudient add skill devops-infra/aws-secrets-manager

# Bootstrap externe state (eenmaal per environment/regio)
bash scripts/init.sh dev us-east-1
bash scripts/init.sh staging us-east-1
bash scripts/init.sh prod us-east-1

echo "Terraform repo scaffolded. Run: aws sso login --profile dev-admin"
```

## CLAUDE.md template

```markdown
# Infrastructure as Code (Terraform + Terragrunt)

Production AWS-infrastructuur beheerd met Terraform 1.7+ en Terragrunt 0.55+.
Alle infrastructuurwijzigingen gaan door GitHub Actions: plan op PR, apply op merge naar main.
Geen secrets worden opgeslagen in Terraform state — alleen AWS Secrets Manager ARNs.

## Stack

- Terraform 1.7.5 (vastgezet via .terraform-version)
- Terragrunt 0.55.1 (vastgezet via .terragrunt-version)
- AWS Provider 5.x — VPC, ECS, RDS, S3, CloudFront, ACM, Route53, IAM
- Externe state: S3 + DynamoDB locking (één bucket per environment/regio)
- Beveiliging: Checkov 3.x, tfsec 1.28+, tflint 0.50+
- Authenticatie: AWS SSO via benoemde profielen (dev-admin, staging-admin, prod-admin)
- CI/CD: GitHub Actions met OIDC-gebaseerde AWS-authenticatie (geen langlevende credentials in CI)

## Directory conventies

- `modules/` — herbruikbare modules, elk met main.tf, variables.tf, outputs.tf, versions.tf
- `environments/<env>/<resource>/terragrunt.hcl` — resource-level config voor een specifieke env
- `environments/<env>/terragrunt.hcl` — env-level config (account_id, aws_profile, env tags)
- `environments/terragrunt.hcl` — root config (state bucket key, region, common tags)

## Een nieuwe AWS resource toevoegen — exacte stappen

1. Bepaal of deze in een bestaande module hoort of een nieuwe nodig is
2. Indien nieuwe module: maak `modules/<name>/` aan met main.tf, variables.tf, outputs.tf, versions.tf
3. Voeg vereiste `tags = merge(var.common_tags, { Name = "..." })` toe aan elke taggable resource
4. Declareer `dependency` blokken in de Terragrunt config als de resource afhangt van VPC/RDS outputs
5. Maak eerst `environments/dev/<name>/terragrunt.hcl` aan; test met `terragrunt plan` in dev
6. Nadat dev pass, voeg staging en prod configs toe
7. Hardcode nooit account IDs, region, of AMI IDs — lees deze van variabelen of data sources
8. Gebruik `/new-resource` slash command om de module boilerplate aan te vullen

## Plan/apply workflow

```bash
# Authenticeer eerst
aws sso login --profile dev-admin

# Plan een enkele resource in dev
cd environments/dev/ecs-service
terragrunt plan

# Plan alle resources in dev (voert uit in afhankelijkheid volgorde)
cd environments/dev
terragrunt run-all plan

# Apply in dev (nooit auto-approve in staging/prod zonder CI review)
cd environments/dev/ecs-service
terragrunt apply

# Opmaak check voor het committen
bash scripts/format-check.sh

# Beveiligingsscan voor het committen
bash scripts/checkov-scan.sh
```

## Module versioning

- Modules worden vastgezet in Terragrunt configs met git tags: `source = "../../modules/vpc?ref=v1.4.0"`
- Bump de module tag in `modules/<name>/versions.tf` changelog opmerking wanneer breaking changes gemaakt worden
- Verwijs nooit naar een module per path zonder een `?ref=` tag — maakt side-by-side upgrades in envs mogelijk
- Verhoog module tags: `v1.x.0` voor breaking changes, `v1.1.x` voor backwards-compatibele toevoegingen

## State management

- State bucket: `<company>-terraform-state-<env>-<region>` (gemaakt door `scripts/init.sh`)
- DynamoDB lock table: `<company>-terraform-locks-<env>` (LockID als hash key)
- Voer nooit `terraform state mv`, `terraform state rm`, of `terraform import` lokaal uit in prod
  — open een PR waarin de wijziging gedocumenteerd is en voer dit uit in CI met een plan diff
- State bucket heeft versioning enabled — om van slechte apply te herstellen, herstel vorige state versie

## Secret handling — verplichte regels

- Secrets (DB passwords, API keys, TLS private keys) worden NOOIT gedeclareerd als Terraform variabelen
- Secrets worden buiten Terraform in AWS Secrets Manager aangemaakt, of via `aws_secretsmanager_secret`
  met `lifecycle { ignore_changes = [secret_string] }` zodat rotatie geen drift veroorzaakt
- Terraform outputtet alleen de ARN van het secret, nooit de waarde
- ECS task definitions verwijzen naar secrets via `secrets` block met `valueFrom = secret_arn`
- RDS module outputtet `db_secret_arn`; applicatie leest credentials bij runtime met SDK

## Tagging conventies — elke resource moet deze tags hebben

| Tag | Waarde | Ingesteld door |
|---|---|---|
| Environment | dev / staging / prod | env-level terragrunt.hcl |
| ManagedBy | terraform | root terragrunt.hcl |
| Repository | github.com/org/infra | root terragrunt.hcl |
| Service | vpc / ecs-service / rds / etc. | module input var `service_name` |
| CostCenter | platform / backend / data | env-level terragrunt.hcl |
| Owner | team-platform@company.com | env-level terragrunt.hcl |

Voer `/tag-audit` uit om resources te scannen op ontbrekende vereiste tags voordat een PR geopend wordt.

## Checkov / tfsec remediation

- Voeg geen `#checkov:skip` toe zonder een JIRA ticket in de opmerking: `#checkov:skip=CKV_AWS_18:PLAT-1234`
- Geaccepteerde skips worden gedocumenteerd in `.checkov.yml` met een rechtvaardigingsopmerking
- Voer `/checkov-fix` uit om een uitleg en voorgestelde patch voor een specifieke bevinding te krijgen
- Alle nieuwe modules moeten `checkov -d modules/<name>` passeren voordat zij gemerged worden

## Wat je niet moet doen

- Voer `terraform apply` niet direct uit in staging of prod — gebruik CI
- Sla AWS access keys niet op in enig bestand; gebruik AWS SSO profielen
- Output gevoelige waarden (passwords, private keys) niet van enige module
- Gebruik geen `count` voor resources die unieke logische identiteiten hebben — gebruik `for_each` met een map
- Maak geen IAM policies met `"Action": "*"` of `"Resource": "*"` — beperk hun scope
- Bewerk `.terraform.lock.hcl` niet met de hand — voer `terraform providers lock` uit om het bij te werken
```

## MCP servers

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

## Aanbevolen hooks

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

## Skills om in te stellen

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

## Gerelateerd

- [Terraform Module Authoring Guide](../guides/terraform-modules.md)
- [AWS Environment Promotion Workflow](../workflows/terraform-env-promotion.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
