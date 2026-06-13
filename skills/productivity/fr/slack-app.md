---
name: slack-app
description: "Application Slack : construire des bots et des apps Slack avec Bolt SDK, slash commands, Block Kit et workflows interactifs"
---

# Slack App

## Quand activer
Construire des bots ou des apps Slack, ou quand l'utilisateur mentionne Bolt SDK, slash commands Slack, Block Kit ou workflows Slack.

## Quand ne PAS utiliser
- Les webhooks sortants uniquement (aucune interactivité nécessaire) — utiliser `@slack/webhook` directement
- Lire les données Slack pour l'analyse sans interaction bot
- Les intégrations Microsoft Teams ou Discord

## Instructions

### Setup: Bolt pour JavaScript
```ts
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // Utiliser socketMode pour le développement — aucune URL publique requise
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN, // xapp- token
});

(async () => {
  await app.start();
  console.log('Bolt app running');
})();
```

**Socket Mode vs HTTP:**
- Socket Mode: développement, outils internes, aucun ngrok requis — utilise la connexion WebSocket
- HTTP Mode: production, apps distribuables — nécessite un point de terminaison HTTPS public

### Gestionnaire de slash command
```ts
app.command('/deploy', async ({ command, ack, respond }) => {
  await ack(); // Doit ack dans les 3 secondes

  const environment = command.text.trim();
  if (!environment) {
    await respond({ text: 'Usage: /deploy <environment>', response_type: 'ephemeral' });
    return;
  }

  await respond({
    response_type: 'ephemeral', // Visible seulement pour l'utilisateur qui l'a exécuté
    text: `Déploiement vers ${environment}...`,
  });

  // Lancer le travail asynchrone ici — respond() ferme la fenêtre 3s, pas le travail
});
```

### Composants interactifs : Actions
```ts
app.action('approve_button', async ({ action, ack, say, body }) => {
  await ack();
  const userId = body.user.id;
  await say(`<@${userId}> a approuvé la demande.`);
});
```

### Modaux
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
          label: { type: 'plain_text', text: 'Environnement' },
        },
      ],
    },
  });
});

app.view('modal_submit', async ({ view, ack, respond }) => {
  await ack();
  const environment = view.state.values.environment_block.environment_input.value;
  // Traiter la soumission modale
});
```

### Event API
```ts
app.event('app_mention', async ({ event, say }) => {
  await say(`Salut <@${event.user}>! Vous m'avez mentionné.`);
});

app.message('help', async ({ message, say }) => {
  await say({ text: 'Voici ce que je peux faire...', thread_ts: message.ts });
});
```

### Modèles Block Kit UI
Toujours utiliser Block Kit pour les messages riches — le texte brut se dégrade mal sur mobile :
```ts
const blocks = [
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*Demande de déploiement* de <@U123>' },
  },
  {
    type: 'actions',
    elements: [
      { type: 'button', text: { type: 'plain_text', text: 'Approuver' }, action_id: 'approve_button', style: 'primary' },
      { type: 'button', text: { type: 'plain_text', text: 'Refuser' }, action_id: 'deny_button', style: 'danger' },
    ],
  },
];
await say({ blocks });
```

### Limites de débit
- Tier 1 (info/lookups): 1+ req/min — `users.info`, `channels.info`
- Tier 2 (commun): 20+ req/min — `chat.postMessage`
- Tier 3 (moins courant): 50+ req/min — `conversations.list`
- Tier 4 (spécial): 100+ req/min — points de terminaison spéciaux

Gérer les erreurs `ratelimited` en lisant l'en-tête `Retry-After` et en attendant. Bolt réessaie automatiquement quand on utilise le client intégré.

### Pagination conversations.history
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

### OAuth pour apps distribuables
```ts
const app = new App({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: ['chat:write', 'commands'],
  installationStore: {
    storeInstallation: async (installation) => { /* persister en DB */ },
    fetchInstallation: async (installQuery) => { /* charger à partir de DB */ },
  },
});
```

## Exemple

Un slash command `/standup` qui ouvre un modal pour l'entrée, poste une mise à jour de standup formatée à un canal et réagit avec une coche :

```
/standup
→ Modal s'ouvre avec: « Qu'avez-vous fait? », « Que ferez-vous? », « Blocages? »
→ L'utilisateur soumet
→ Le bot poste le message Block Kit à #standup avec des sections pour chaque réponse
→ Le bot ajoute la réaction :white_check_mark: à son propre message
→ La réponse est éphémère pour l'afficheur jusqu'à ce qu'ils confirment le partage
```

---
