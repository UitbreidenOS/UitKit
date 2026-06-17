# Command: /terraform-plan

## Purpose

Review infrastructure changes before applying to production.

## Usage

```
/terraform-plan [module-path] [--json]
```

## Steps

1. Run terraform plan
2. Parse and summarize changes (adds/updates/deletes)
3. Flag breaking changes or policy violations
4. Generate approval checklist

## Example

```
/terraform-plan ./aws/prod-cluster --json
```
