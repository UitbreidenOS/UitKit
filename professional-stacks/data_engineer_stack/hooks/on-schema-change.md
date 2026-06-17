# Hook: on-schema-change

Triggered when table schema changes.

## settings.json

```json
{
  "hooks": {
    "on-schema-change": {
      "script": "hooks/on-schema-change.sh",
      "condition": "schema_version_changed"
    }
  }
}
```

## Behavior

Validates backwards compatibility, updates documentation, triggers downstream tests.

## Implementation

(Script stub — validates and logs schema change)
