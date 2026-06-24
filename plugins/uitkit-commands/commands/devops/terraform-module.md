---
description: Scaffold a reusable Terraform module for the described infrastructure component
argument-hint: "[component: e.g. vpc, rds, ecs-service, s3-bucket]"
---
Scaffold a production-grade Terraform module for: $ARGUMENTS

Target provider: infer from context (AWS/GCP/Azure) or default to AWS if ambiguous. Use the latest stable provider version.

Generate the following file structure:
```
modules/<name>/
  main.tf
  variables.tf
  outputs.tf
  versions.tf
  README.md  (minimal — inputs/outputs table only)
```

Standards to follow:

`versions.tf`:
- Pin Terraform `required_version` to `>= 1.5`
- Pin provider version with a `~>` constraint to the latest minor

`variables.tf`:
- Every variable has a `description` and `type` — no `any` types
- Use `validation` blocks for values with known constraints (CIDR ranges, allowed instance types, tag formats)
- Sensitive variables marked `sensitive = true`
- Provide `default` only where a safe, broadly applicable value exists — leave required inputs without defaults

`main.tf`:
- Apply standard tags/labels: `Name`, `Environment`, `ManagedBy = "terraform"`, `Module`
- Use `for_each` over `count` for multi-instance resources
- No hardcoded region, account ID, or ARN — derive from data sources (`aws_caller_identity`, `aws_region`)
- Enable encryption at rest on all storage resources
- Enable deletion protection on stateful resources (RDS, DynamoDB) — expose as a variable defaulting to `true`

`outputs.tf`:
- Export the resource ID, ARN (if applicable), and any endpoint/DNS names consumers will need
- Mark sensitive outputs `sensitive = true`

After the file content, output:
1. Example `module {}` block showing how a root module would call this
2. Any IAM permissions the Terraform execution role needs to manage these resources
3. Known destroy-time gotchas (e.g., non-empty S3 buckets, RDS snapshot requirements)
