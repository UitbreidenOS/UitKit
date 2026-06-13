# Slack App

## Wanneer activeren
Slack bots of apps bouwen, of wanneer de gebruiker Bolt SDK, Slack slash commands, Block Kit of Slack workflows noemt.

## Wanneer NIET gebruiken
- Alleen outgoing webhooks (geen interactiviteit nodig) — gebruik `@slack/webhook` rechtstreeks
- Slack-gegevens lezen voor analytics zonder bot-interactie
- Microsoft Teams of Discord integraties

## Instructies

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

**Socket Mode versus HTTP:**
- Socket Mode: development, internal tools, geen ngrok vereist — gebruikt WebSocket-verbinding
- HTTP Mode: production, distributiebare apps — vereist openbaar HTTPS-eindpunt

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
Gebruik altijd Block Kit voor rijke berichten — platte tekst degradeert slecht op mobiel:
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

Verwerk `ratelimited` fouten door de `Retry-After` header te lezen en te wachten. Bolt probeert automatisch opnieuw wanneer de ingebouwde client wordt gebruikt.

### conversations.history Paginering
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

### OAuth voor Distributiebare Apps
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

## Voorbeeld

Een `/standup` slash command die een modal opent voor input, een geformatteerde standup-update naar een kanaal post en reageert met een vinkje:

```
/standup
→ Modal opens with: "What did you do?", "What will you do?", "Blockers?"
→ User submits
→ Bot posts Block Kit message to #standup with sections for each answer
→ Bot adds :white_check_mark: reaction to its own message
→ Response is ephemeral to the poster until they confirm share
```

---
