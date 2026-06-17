# Terraform Modules

## When to activate

Creating or modifying infrastructure via Terraform, reviewing `.tf` files, or planning state changes.

## When NOT to use

For ad-hoc cloud CLI commands without IaC — use AWS/GCP documentation instead.

## Instructions

1. Parse and validate Terraform syntax (`terraform fmt`)
2. Generate and review plan (`terraform plan`)
3. Check for drift and breaking changes
4. Apply with runbook approval

## Example

Provision an RDS instance with Multi-AZ failover and automated backups.
