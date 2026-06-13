# Aplicación de Slack

## Cuándo activar
Construyendo bots o aplicaciones de Slack, o cuando el usuario menciona Bolt SDK, comandos slash de Slack, Block Kit, o flujos de trabajo de Slack.

## Cuándo NO usar
- Solo webhooks salientes (sin interactividad necesaria) — usar `@slack/webhook` directamente
- Lectura de datos de Slack para análisis sin interacción de bot
- Integraciones de Microsoft Teams o Discord

## Instrucciones

### Configuración: Bolt para JavaScript
```ts
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // Usar socketMode para desarrollo — no requiere URL pública
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN, // token xapp-
});

(async () => {
  await app.start();
  console.log('App Bolt ejecutándose');
})();
```

**Socket Mode vs HTTP:**
- Socket Mode: desarrollo, herramientas internas, no requiere ngrok — usa conexión WebSocket
- HTTP Mode: producción, aplicaciones distribuibles — requiere endpoint HTTPS público

### Manejador de Comando Slash
```ts
app.command('/deploy', async ({ command, ack, respond }) => {
  await ack(); // Debe reconocer dentro de 3 segundos

  const environment = command.text.trim();
  if (!environment) {
    await respond({ text: 'Uso: /deploy <environment>', response_type: 'ephemeral' });
    return;
  }

  await respond({
    response_type: 'ephemeral', // Solo visible para el usuario que lo ejecutó
    text: `Desplegando en ${environment}...`,
  });

  // Iniciar trabajo asincrónico aquí — respond() cierra la ventana de 3s, no el trabajo
});
```

### Componentes Interactivos: Acciones
```ts
app.action('approve_button', async ({ action, ack, say, body }) => {
  await ack();
  const userId = body.user.id;
  await say(`<@${userId}> aprobó la solicitud.`);
});
```

### Modales
```ts
app.shortcut('open_modal', async ({ shortcut, ack, client }) => {
  await ack();
  await client.views.open({
    trigger_id: shortcut.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'modal_submit',
      title: { type: 'plain_text', text: 'Desplegar' },
      submit: { type: 'plain_text', text: 'Enviar' },
      blocks: [
        {
          type: 'input',
          block_id: 'environment_block',
          element: {
            type: 'plain_text_input',
            action_id: 'environment_input',
          },
          label: { type: 'plain_text', text: 'Ambiente' },
        },
      ],
    },
  });
});

app.view('modal_submit', async ({ view, ack, respond }) => {
  await ack();
  const environment = view.state.values.environment_block.environment_input.value;
  // Procesar envío modal
});
```

### API de Eventos
```ts
app.event('app_mention', async ({ event, say }) => {
  await say(`¡Hola <@${event.user}>! Me mencionaste.`);
});

app.message('help', async ({ message, say }) => {
  await say({ text: 'Aquí está lo que puedo hacer...', thread_ts: message.ts });
});
```

### Patrones de UI de Block Kit
Siempre usar Block Kit para mensajes ricos — el texto plano se degrada mal en móvil:
```ts
const blocks = [
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*Solicitud de despliegue* de <@U123>' },
  },
  {
    type: 'actions',
    elements: [
      { type: 'button', text: { type: 'plain_text', text: 'Aprobar' }, action_id: 'approve_button', style: 'primary' },
      { type: 'button', text: { type: 'plain_text', text: 'Negar' }, action_id: 'deny_button', style: 'danger' },
    ],
  },
];
await say({ blocks });
```

### Límites de Velocidad
- Tier 1 (info/lookups): 1+ req/min — `users.info`, `channels.info`
- Tier 2 (común): 20+ req/min — `chat.postMessage`
- Tier 3 (menos común): 50+ req/min — `conversations.list`
- Tier 4 (especial): 100+ req/min — endpoints especiales

Manejar errores `ratelimited` leyendo el encabezado `Retry-After` y esperando. Bolt reintenta automáticamente cuando usa el cliente integrado.

### Paginación de conversations.history
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

### OAuth para Aplicaciones Distribuibles
```ts
const app = new App({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: ['chat:write', 'commands'],
  installationStore: {
    storeInstallation: async (installation) => { /* persistir en BD */ },
    fetchInstallation: async (installQuery) => { /* cargar de BD */ },
  },
});
```

## Ejemplo

Un comando slash `/standup` que abre un modal para entrada, publica una actualización de standup formateada en un canal, y reacciona con una marca de verificación:

```
/standup
→ Modal se abre con: "¿Qué hiciste?", "¿Qué harás?", "¿Bloqueadores?"
→ El usuario envía
→ Bot publica mensaje Block Kit a #standup con secciones para cada respuesta
→ Bot agrega reacción :white_check_mark: a su propio mensaje
→ La respuesta es efímera para el autor hasta que confirma compartir
```

---
