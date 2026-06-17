# Hook: pre-deploy

## Trigger

Fires before applying infrastructure or deployment changes.

## Config Entry

```json
{
  "hooks": {
    "pre-deploy": {
      "script": "hooks/pre-deploy.sh",
      "required": true
    }
  }
}
```

## Checks

- Validate Terraform syntax
- Check Kubernetes manifest YAML
- Verify secrets are not hardcoded
- Confirm approvals in place

## Behavior

Exit code 0 = proceed; non-zero = block deployment and report errors.
