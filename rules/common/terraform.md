# Terraform Rules

## Apply to
All Terraform files (`*.tf`, `*.tfvars`) and OpenTofu configurations.

## Rules

1. **Use remote state with state locking** — never store `terraform.tfstate` in version control. Use S3 + DynamoDB, GCS, or Terraform Cloud. State contains plaintext secrets and concurrent applies corrupt local state.

2. **Pin provider and module versions** — `version = "~> 5.0"` not `version = "latest"`. Unpinned providers break applies silently on upstream releases. Run `terraform init -upgrade` deliberately, not accidentally.

3. **Never commit `*.tfvars` files containing secrets** — use environment variables (`TF_VAR_*`), a secrets manager integration, or Vault. Add `*.tfvars` to `.gitignore` for environments with sensitive values.

4. **Separate state per environment** — `dev/`, `staging/`, `prod/` each get their own state backend configuration. A `terraform destroy` in dev should never touch production.

5. **Use modules for reusable infrastructure patterns** — a module should represent one coherent unit (VPC, EKS cluster, RDS instance). Don't copy-paste resource blocks across environments; parameterize them.

6. **Always run `terraform plan` in CI before `apply`** — the plan output is the changeset. Review it. Fail the pipeline if the plan shows unexpected deletions.

7. **Mark sensitive outputs with `sensitive = true`** — prevents values from appearing in `terraform plan`/`apply` output and in CI logs.

8. **Use `lifecycle { prevent_destroy = true }` on stateful resources** — databases, S3 buckets with data, and KMS keys should not be accidentally destroyed by a plan. Make destruction a deliberate action.

9. **Name resources with environment prefix and a consistent suffix convention** — `prod-payments-rds` not `database`. Unambiguous names survive across AWS consoles, logs, and billing breakdowns.

10. **Use `data` sources for pre-existing resources, `resource` for managed ones** — importing a VPC you didn't create with Terraform into a `resource` block makes Terraform the source of truth for something it doesn't fully own.

11. **Validate and format in CI** — `terraform validate` catches configuration errors. `terraform fmt -check` enforces canonical formatting. Both should fail the build if they fail.

12. **Use `for_each` over `count` for resource collections** — `count` uses positional index; deleting index 0 shifts all others. `for_each` uses stable map keys and avoids unintended replacements.

13. **Document variables with `description` and set types explicitly** — `type = string` not implicit. `description` appears in `terraform-docs` output and in the Terraform Cloud UI.

14. **Review `terraform plan` output for `forces replacement`** — a resource replacement destroys and recreates. For stateful resources (databases, IPs), this is almost always wrong and requires explicit handling.

15. **Use `moved` blocks when refactoring resource addresses** — renaming a resource without a `moved` block causes a destroy + create. The `moved` block instructs Terraform to migrate state safely.


---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
