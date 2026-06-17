# publish-batch Command

Schedule multiple content pieces across channels simultaneously.

## Usage

```
/publish-batch --items 3 --channels "email,social,blog" --schedule "2026-06-15 10:00"
```

## Parameters

- `--items` — Number of content pieces to schedule
- `--channels` — Comma-separated destination channels
- `--schedule` — ISO 8601 publish datetime

## Output

Batch deployment confirmation with channel-specific links.
