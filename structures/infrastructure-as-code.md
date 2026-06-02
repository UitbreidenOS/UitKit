# Infrastructure as Code (Terraform) — Project Structure

> For platform and DevOps engineers managing production AWS infrastructure with Terraform and Terragrunt, optimizing the plan/apply review loop and enforcing security and tagging standards across environments.

## Stack

- **IaC:** Terraform 1.7+ (HCL), Terraform Cloud or local backend
- **AWS Provider:** hashicorp/aws ~> 5.0 (VPC, ECS, RDS, S3, CloudFront, ACM, Route53, IAM)
- **Remote state:** S3 backend + DynamoDB state locking (one bucket per region)
- **DRY configs:** Terragrunt 0.55+ (`terragrunt.hcl` hierarchy, `read_terragrunt_config`)
- **Security scanning:** Checkov 3.x (`checkov -d .`), tfsec 1.28+ (`tfsec .`)
- **Formatting / validation:** `terraform fmt`, `terraform validate`, `tflint 0.50+`
- **CI/CD:** GitHub Actions (`terraform-plan.yml` on PR, `terraform-apply.yml` on merge to main)
- **Auth:** AWS SSO (`aws sso login --profile <env>`) via `~/.aws/config` named profiles
- **Secrets:** AWS Secrets Manager (no secrets in state — only ARN refs stored in Terraform outputs)
- **Module registry:** Local modules in `modules/` pinned by git tag (`source = "../../modules/vpc?ref=v1.4.0"`)

## Directory tree

```
infra/                                          # Repository root
├── .claude/
│   ├── CLAUDE.md                               # Repo-level instructions for Claude Code
│   ├── settings.json                           # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-resource.md                     # /new-resource — scaffold module + variables + outputs
│       ├── plan-env.md                         # /plan-env — run terragrunt plan for a given environment
│       ├── checkov-fix.md                      # /checkov-fix — explain and patch a Checkov finding
│       ├── tag-audit.md                        # /tag-audit — scan all resources for missing required tags
│       └── rotate-secret.md                    # /rotate-secret — update Secrets Manager + trigger redeploy
├── .github/
│   └── workflows/
│       ├── terraform-plan.yml                  # PR: fmt check, validate, tflint, checkov, tfsec, plan
│       └── terraform-apply.yml                 # Merge to main: apply with OIDC-based AWS auth
├── modules/                                    # Reusable internal modules (semantic versioned via git tags)
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
│   │   ├── iam.tf                              # Task execution role, task role with least-privilege policies
│   │   ├── autoscaling.tf                      # Application Auto Scaling: CPU/memory target tracking
│   │   ├── versions.tf
│   │   └── README.md
│   ├── rds/
│   │   ├── main.tf                             # RDS instance or cluster (Aurora), subnet group, param group
│   │   ├── variables.tf                        # engine, engine_version, instance_class, multi_az, db_name
│   │   ├── outputs.tf                          # db_endpoint, db_port, db_secret_arn (NO username/password)
│   │   ├── security-group.tf                   # SG allowing traffic only from ECS task SG + bastion SG
│   │   ├── versions.tf
│   │   └── README.md
│   ├── s3-bucket/
│   │   ├── main.tf                             # S3 bucket, versioning, encryption (SSE-S3 or KMS), lifecycle
│   │   ├── variables.tf                        # bucket_name_prefix, versioning_enabled, kms_key_arn, cors_rules
│   │   ├── outputs.tf                          # bucket_id, bucket_arn, bucket_domain_name
│   │   ├── policy.tf                           # Bucket policy: enforce TLS, block public access
│   │   ├── versions.tf
│   │   └── README.md
│   └── iam-role/
│       ├── main.tf                             # IAM role with assume_role_policy, inline or managed policies
│       ├── variables.tf                        # role_name, trusted_services, policy_arns, inline_policy_json
│       ├── outputs.tf                          # role_arn, role_name, instance_profile_arn
│       └── versions.tf
├── environments/
│   ├── terragrunt.hcl                          # Root config: remote state bucket, region, common inputs
│   ├── dev/
│   │   ├── terragrunt.hcl                      # Env-level: account_id, aws_profile, common tags
│   │   ├── vpc/
│   │   │   └── terragrunt.hcl                  # include root + env; inputs for this resource in dev
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
│       ├── terragrunt.hcl                      # account_id points to production AWS account
│       ├── vpc/
│       │   └── terragrunt.hcl                  # 3 AZs, enable_nat_gateway = true, single_nat_gateway = false
│       ├── ecs-service/
│       │   └── terragrunt.hcl                  # cpu=1024, memory=2048, desired_count=3
│       ├── rds/
│       │   └── terragrunt.hcl                  # multi_az = true, instance_class = db.r6g.large
│       ├── cloudfront/
│       │   └── terragrunt.hcl                  # CloudFront + ACM + Route53 (prod only)
│       └── s3-bucket/
│           └── terragrunt.hcl
├── scripts/
│   ├── init.sh                                 # Bootstrap: create state bucket + DynamoDB table if not exist
│   ├── format-check.sh                         # terraform fmt -recursive -check; exit 1 on diff
│   ├── checkov-scan.sh                         # checkov -d . --framework terraform --compact
│   └── sso-login.sh                            # aws sso login --profile $ENV; export AWS_PROFILE
├── .tflint.hcl                                 # tflint config: aws plugin, rules (aws_instance_invalid_type)
├── .checkov.yml                                # Checkov: skip list for accepted risk + check categories
├── .terraform-version                          # tfenv / tofuenv pin: 1.7.5
├── .terragrunt-version                         # tgenv pin: 0.55.1
└── .gitignore                                  # .terraform/, *.tfstate, *.tfstate.backup, .terraform.lock.hcl
```

## Key files explained

| Path | Purpose |
|---|---|
| `environments/terragrunt.hcl` | Root Terragrunt config: defines the remote state S3 bucket key pattern using `path_relative_to_include()`, sets the AWS region, and injects `common_tags` (Environment, ManagedBy, Repository) into every child module |
| `environments/prod/terragrunt.hcl` | Environment-level config: sets `aws_profile = "prod-admin"`, `account_id`, and env-specific tags (Environment = "prod", CostCenter) that override root defaults |
| `environments/prod/ecs-service/terragrunt.hcl` | Resource-level Terragrunt config: declares `dependency` blocks on VPC and RDS to read their outputs; sets production sizing (`cpu=1024`, `desired_count=3`); never contains secrets |
| `modules/rds/outputs.tf` | Outputs `db_secret_arn` (the ARN of the Secrets Manager secret holding credentials) — never outputs the actual username, password, or connection string |
| `modules/iam-role/main.tf` | Single source of truth for all IAM role creation; enforces `path = "/app/"` prefix and a mandatory `Name` tag; used by ECS task roles and Lambda execution roles |
| `.github/workflows/terraform-plan.yml` | Runs `fmt -check`, `validate`, `tflint`, `checkov`, `tfsec`, and `terragrunt plan` on every PR; posts the plan diff as a PR comment via `github-actions[bot]`; uses OIDC for AWS auth (no long-lived keys) |
| `.github/workflows/terraform-apply.yml` | Triggered on merge to `main`; runs `terragrunt apply -auto-approve` in the changed environment directory only; requires manual approval via GitHub Environments for `prod` |
| `scripts/init.sh` | Idempotent bootstrap: creates the S3 state bucket (versioning + encryption enabled) and DynamoDB lock table if they do not exist; safe to run multiple times |

## Quick scaffold

```bash
# Prerequisites: terraform 1.7+, terragrunt 0.55+, aws CLI v2, tflint, checkov, tfsec

# Clone or create the repo
mkdir infra && cd infra
git init

# Create the module directories
mkdir -p modules/vpc modules/ecs-service modules/rds modules/s3-bucket modules/iam-role

# Create stub files for each module
for module in vpc ecs-service rds s3-bucket iam-role; do
  touch modules/$module/main.tf \
        modules/$module/variables.tf \
        modules/$module/outputs.tf \
        modules/$module/versions.tf
done
touch modules/ecs-service/iam.tf modules/ecs-service/autoscaling.tf
touch modules/rds/security-group.tf
touch modules/s3-bucket/policy.tf

# Create environment directory structure
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

# Create scripts
mkdir -p scripts
touch scripts/init.sh scripts/format-check.sh scripts/checkov-scan.sh scripts/sso-login.sh
chmod +x scripts/*.sh

# Create GitHub Actions workflows
mkdir -p .github/workflows
touch .github/workflows/terraform-plan.yml
touch .github/workflows/terraform-apply.yml

# Create config files
touch .tflint.hcl .checkov.yml
echo "1.7.5" > .terraform-version
echo "0.55.1" > .terragrunt-version

# Create .gitignore
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

# Create Claude Code config
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-resource.md
touch .claude/commands/plan-env.md
touch .claude/commands/checkov-fix.md
touch .claude/commands/tag-audit.md
touch .claude/commands/rotate-secret.md

# Install Claudient skills
npx claudient add skill devops-infra/terraform-module
npx claudient add skill devops-infra/terragrunt-config
npx claudient add skill devops-infra/aws-iam-policy
npx claudient add skill devops-infra/checkov-remediation
npx claudient add skill devops-infra/github-actions-cicd
npx claudient add skill devops-infra/aws-secrets-manager

# Bootstrap remote state (run once per environment/region)
bash scripts/init.sh dev us-east-1
bash scripts/init.sh staging us-east-1
bash scripts/init.sh prod us-east-1

echo "Terraform repo scaffolded. Run: aws sso login --profile dev-admin"
```

## CLAUDE.md template

```markdown
# Infrastructure as Code (Terraform + Terragrunt)

Production AWS infrastructure managed with Terraform 1.7+ and Terragrunt 0.55+.
All infrastructure changes go through GitHub Actions: plan on PR, apply on merge to main.
No secrets are stored in Terraform state — only AWS Secrets Manager ARNs.

## Stack

- Terraform 1.7.5 (pinned via .terraform-version)
- Terragrunt 0.55.1 (pinned via .terragrunt-version)
- AWS Provider 5.x — VPC, ECS, RDS, S3, CloudFront, ACM, Route53, IAM
- Remote state: S3 + DynamoDB locking (one bucket per environment/region)
- Security: Checkov 3.x, tfsec 1.28+, tflint 0.50+
- Auth: AWS SSO via named profiles (dev-admin, staging-admin, prod-admin)
- CI/CD: GitHub Actions with OIDC-based AWS auth (no long-lived credentials in CI)

## Directory conventions

- `modules/` — reusable modules, each with main.tf, variables.tf, outputs.tf, versions.tf
- `environments/<env>/<resource>/terragrunt.hcl` — resource-level config for a specific env
- `environments/<env>/terragrunt.hcl` — env-level config (account_id, aws_profile, env tags)
- `environments/terragrunt.hcl` — root config (state bucket key, region, common tags)

## Adding a new AWS resource — exact steps

1. Decide if it belongs in an existing module or needs a new one
2. If new module: create `modules/<name>/` with main.tf, variables.tf, outputs.tf, versions.tf
3. Add required `tags = merge(var.common_tags, { Name = "..." })` to every taggable resource
4. Declare `dependency` blocks in the Terragrunt config if the resource depends on VPC/RDS outputs
5. Create `environments/dev/<name>/terragrunt.hcl` first; test with `terragrunt plan` in dev
6. After dev passes, add staging and prod configs
7. Never hardcode account IDs, region, or AMI IDs — read from variables or data sources
8. Use `/new-resource` slash command to scaffold the module boilerplate

## Plan/apply workflow

```bash
# Authenticate first
aws sso login --profile dev-admin

# Plan a single resource in dev
cd environments/dev/ecs-service
terragrunt plan

# Plan all resources in dev (runs in dependency order)
cd environments/dev
terragrunt run-all plan

# Apply in dev (never auto-approve in staging/prod without CI review)
cd environments/dev/ecs-service
terragrunt apply

# Format check before committing
bash scripts/format-check.sh

# Security scan before committing
bash scripts/checkov-scan.sh
```

## Module versioning

- Modules are pinned in Terragrunt configs using git tags: `source = "../../modules/vpc?ref=v1.4.0"`
- Bump the module tag in `modules/<name>/versions.tf` changelog comment when making breaking changes
- Never reference a module by path without a `?ref=` tag — allows side-by-side upgrades across envs
- Increment module tags: `v1.x.0` for breaking changes, `v1.1.x` for backwards-compatible additions

## State management

- State bucket: `<company>-terraform-state-<env>-<region>` (created by `scripts/init.sh`)
- DynamoDB lock table: `<company>-terraform-locks-<env>` (LockID as hash key)
- Never run `terraform state mv`, `terraform state rm`, or `terraform import` locally in prod
  — open a PR documenting the change and run it in CI with a plan diff
- State bucket has versioning enabled — to recover from bad apply, restore previous state version

## Secret handling — mandatory rules

- Secrets (DB passwords, API keys, TLS private keys) are NEVER declared as Terraform variables
- Secrets are created in AWS Secrets Manager outside Terraform, or via `aws_secretsmanager_secret`
  with `lifecycle { ignore_changes = [secret_string] }` so rotation does not cause drift
- Terraform outputs only the ARN of the secret, never the value
- ECS task definitions reference secrets via `secrets` block with `valueFrom = secret_arn`
- RDS module outputs `db_secret_arn`; application reads credentials at runtime using SDK

## Tagging conventions — every resource must have these tags

| Tag | Value | Set by |
|---|---|---|
| Environment | dev / staging / prod | env-level terragrunt.hcl |
| ManagedBy | terraform | root terragrunt.hcl |
| Repository | github.com/org/infra | root terragrunt.hcl |
| Service | vpc / ecs-service / rds / etc. | module input var `service_name` |
| CostCenter | platform / backend / data | env-level terragrunt.hcl |
| Owner | team-platform@company.com | env-level terragrunt.hcl |

Run `/tag-audit` to scan for resources missing required tags before opening a PR.

## Checkov / tfsec remediation

- Do not add `#checkov:skip` without a JIRA ticket in the comment: `#checkov:skip=CKV_AWS_18:PLAT-1234`
- Accepted skips are documented in `.checkov.yml` with a justification comment
- Run `/checkov-fix` to get an explanation and proposed patch for a specific finding
- All new modules must pass `checkov -d modules/<name>` before merging

## What not to do

- Do not run `terraform apply` directly in staging or prod — use CI
- Do not store AWS access keys in any file; use AWS SSO profiles
- Do not output sensitive values (passwords, private keys) from any module
- Do not use `count` for resources that have unique logical identities — use `for_each` with a map
- Do not create IAM policies with `"Action": "*"` or `"Resource": "*"` — scope them down
- Do not edit `.terraform.lock.hcl` by hand — run `terraform providers lock` to update it
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

## Recommended hooks

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

## Skills to install

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

## Related

- [Terraform Module Authoring Guide](../guides/terraform-modules.md)
- [AWS Environment Promotion Workflow](../workflows/terraform-env-promotion.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
