# Command: /log-interaction

Record customer interaction (call, email, meeting) with context.

## Syntax

```
/log-interaction --customer=<name> --type=call|email|meeting --duration=<mins> [--notes=<text>]
```

## Output

Confirmation and timestamp added to session-log.md.

## Example

```
/log-interaction --customer=acme-corp --type=call --duration=45 --notes="Discussed Q3 expansion roadmap"
```
