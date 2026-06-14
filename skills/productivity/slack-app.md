---
name: slack-app
description: Building Slack bots or apps, or when the user mentions Bolt SDK, Slack slash commands, Block Kit, or Slack workflows.
updated: 2026-06-13
---

# Slack App

## When to activate
Building Slack bots or apps, or when the user mentions Bolt SDK, Slack slash commands, Block Kit, or Slack workflows.

## When NOT to use
- Outgoing webhooks only (no interactivity needed) — use `@slack/webhook` directly
- Reading Slack data for analytics without bot interaction
- Microsoft Teams or Discord integrations

## Instructions

### Setup: Bolt for JavaScript
```ts
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // Use socketMode for development — no public URL required
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN, // xapp- token
});

(async () => {
  await app.start();
  console.log('Bolt app running');
})();
```

**Socket Mode vs HTTP:**
- Socket Mode: development, internal tools, no ngrok required — uses WebSocket connection
- HTTP Mode: production, distributable apps — requires a public HTTPS endpoint

### Slash Command Handler
```ts
app.command('/deploy', async ({ command, ack, respond }) => {
  await ack(); // Must ack within 3 seconds

  const environment = command.text.trim();
  if (!environment) {
    await respond({ text: 'Usage: /deploy <environment>', response_type: 'ephemeral' });
    return;
  }

  await respond({
    response_type: 'ephemeral', // Only visible to the user who ran it
    text: `Deploying to ${environment}...`,
  });

  // Kick off async work here — respond() closes the 3s window, not the work
});
```

### Interactive Components: Actions
```ts
app.action('approve_button', async ({ action, ack, say, body }) => {
  await ack();
  const userId = body.user.id;
  await say(`<@${userId}> approved the request.`);
});
```

### Modals
```ts
app.shortcut('open_modal', async ({ shortcut, ack, client }) => {
  await ack();
  await client.views.open({
    trigger_id: shortcut.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'modal_submit',
      title: { type: 'plain_text', text: 'Deploy' },
      submit: { type: 'plain_text', text: 'Submit' },
      blocks: [
        {
          type: 'input',
          block_id: 'environment_block',
          element: {
            type: 'plain_text_input',
            action_id: 'environment_input',
          },
          label: { type: 'plain_text', text: 'Environment' },
        },
      ],
    },
  });
});

app.view('modal_submit', async ({ view, ack, respond }) => {
  await ack();
  const environment = view.state.values.environment_block.environment_input.value;
  // Process modal submission
});
```

### Event API
```ts
app.event('app_mention', async ({ event, say }) => {
  await say(`Hi <@${event.user}>! You mentioned me.`);
});

app.message('help', async ({ message, say }) => {
  await say({ text: 'Here is what I can do...', thread_ts: message.ts });
});
```

### Block Kit UI Patterns
Always use Block Kit for rich messages — plain text degrades poorly on mobile:
```ts
const blocks = [
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*Deploy request* from <@U123>' },
  },
  {
    type: 'actions',
    elements: [
      { type: 'button', text: { type: 'plain_text', text: 'Approve' }, action_id: 'approve_button', style: 'primary' },
      { type: 'button', text: { type: 'plain_text', text: 'Deny' }, action_id: 'deny_button', style: 'danger' },
    ],
  },
];
await say({ blocks });
```

### Rate Limits
- Tier 1 (info/lookups): 1+ req/min — `users.info`, `channels.info`
- Tier 2 (common): 20+ req/min — `chat.postMessage`
- Tier 3 (less common): 50+ req/min — `conversations.list`
- Tier 4 (special): 100+ req/min — special endpoints

Handle `ratelimited` errors by reading the `Retry-After` header and waiting. Bolt retries automatically when using the built-in client.

### conversations.history Pagination
```ts
let cursor: string | undefined;
const messages = [];
do {
  const result = await client.conversations.history({
    channel: channelId,
    cursor,
    limit: 200,
  });
  messages.push(...(result.messages ?? []));
  cursor = result.response_metadata?.next_cursor;
} while (cursor);
```

### OAuth for Distributable Apps
```ts
const app = new App({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: ['chat:write', 'commands'],
  installationStore: {
    storeInstallation: async (installation) => { /* persist to DB */ },
    fetchInstallation: async (installQuery) => { /* load from DB */ },
  },
});
```

## Example

A `/standup` slash command that opens a modal for input, posts a formatted standup update to a channel, and reacts with a checkmark:

```
/standup
→ Modal opens with: "What did you do?", "What will you do?", "Blockers?"
→ User submits
→ Bot posts Block Kit message to #standup with sections for each answer
→ Bot adds :white_check_mark: reaction to its own message
→ Response is ephemeral to the poster until they confirm share
```

---
