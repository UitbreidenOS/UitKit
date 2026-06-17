# on-publish Hook

Triggered when content is published to trigger distribution across channels.

## Event

`content.published`

## settings.json Entry

```json
{
  "hooks": {
    "on-publish": {
      "trigger": "content.published",
      "script": "hooks/on-publish.sh",
      "channels": ["email", "social", "slack"]
    }
  }
}
```

## Behavior

- Syncs content to distribution channels
- Updates channel-specific metadata
- Logs publication events

## Setup

Configure destination channels in hook config.
