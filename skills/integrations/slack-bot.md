---
name: slack-bot
description: "Slack bot integration: Status updates for sandbox executions, feature usage analytics, performance alerts in Slack channels"
updated: 2026-06-22
---

# Slack Bot Integration Skill

## When to activate
- Setting up real-time status notifications for code execution in Slack
- Configuring usage analytics dashboards in Slack channels
- Creating performance monitoring alerts that post to Slack
- Integrating deployment/sandbox execution workflows with team notifications
- Building bot commands for triggering or querying execution status
- Tracking feature adoption metrics across teams via Slack

## When NOT to use
- Email-only notification requirements (use SMTP integrations)
- Internal systems without Slack (use WebHooks or custom alerting)
- High-frequency raw event logging (use dedicated logging platforms first)
- Interactive workflows requiring complex state management (use Slack App workflows instead)

## Instructions

### Bot setup and authentication

```
Set up a Slack bot for [workspace].

Workspace: [your-workspace-name]
Bot name: [e.g., execution-monitor, feature-tracker]

Step 1: Create Slack App
- Go to https://api.slack.com/apps
- Click "Create New App" → "From scratch"
- App name: [bot-name]
- Pick workspace: [your-workspace]
- Click "Create App"

Step 2: Add permissions
In "OAuth & Permissions":
- Scopes required for basic status updates:
  - chat:write (post messages)
  - channels:read (list channels)
  - users:read (user info)
- Scopes for advanced analytics:
  - reactions:read (track reactions)
  - messages:history (read message history)
  - files:read (access uploaded reports)

Step 3: Install app to workspace
- Click "Install to Workspace"
- Authorize requested permissions
- Copy "Bot User OAuth Token" (starts with xoxb-)

Step 4: Store credentials securely
export SLACK_BOT_TOKEN="xoxb-your-token-here"
export SLACK_SIGNING_SECRET="your-signing-secret"

Step 5: Set up event subscriptions (for listening to events)
- Enable Events
- Subscribe to bot events:
  - app_mention
  - message.channels
  - message.groups
  - message.im
- Request URL: https://your-domain.com/slack/events
```

### Status update patterns

```
Send execution status updates to Slack.

Channels: [#deployments / #sandbox-status / custom channel]

Pattern 1: Immediate sync status (for quick operations)
POST /slack/notify with:
{
  "channel": "#sandbox-status",
  "text": "Sandbox execution started",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Execution Status Update*\n*ID:* abc123\n*Service:* my-api\n*Status:* Running"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Started:*\n2026-06-22 14:23:45"
        },
        {
          "type": "mrkdwn",
          "text": "*Duration:*\n2m 15s"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Details" },
          "url": "https://dashboard.example.com/executions/abc123"
        }
      ]
    }
  ]
}

Pattern 2: Threaded updates (for multi-step execution)
- Post main message with execution ID
- Reply in thread with each step update
- Final reply with summary and results

Pattern 3: Status color indicators
Use emoji/color blocks:
:white_check_mark: Success
:hourglass_flowing_sand: Running
:warning: Warning
:x: Failed
```

### Analytics and metrics posting

```
Post feature usage analytics to Slack.

Metrics channel: [#analytics / #feature-metrics]
Update frequency: [hourly / daily / weekly]

Daily analytics template:
POST with:
{
  "channel": "#feature-metrics",
  "text": "Daily Feature Usage Report",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Feature Usage — 2026-06-22"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Top Features Today:*"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*API Calls:*\n2,847 (↑12%)"
        },
        {
          "type": "mrkdwn",
          "text": "*Active Users:*\n324 (↑8%)"
        },
        {
          "type": "mrkdwn",
          "text": "*Error Rate:*\n0.3% (↓2%)"
        },
        {
          "type": "mrkdwn",
          "text": "*Avg Response:*\n145ms (↑5ms)"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Feature Breakdown:*\n• Feature A: 1,203 calls\n• Feature B: 987 calls\n• Feature C: 657 calls"
      }
    }
  ]
}

Weekly trend report:
Include sparklines or linked charts:
POST chart image/link in message attachment
```

### Performance alerts

```
Configure performance threshold alerts.

Alert levels: [info / warning / critical]

Trigger conditions:
- Response time > [threshold]ms
- Error rate > [threshold]%
- Execution timeout (> max duration)
- Resource exhaustion (CPU/memory peaks)
- Deployment/sandbox start failure

Critical alert template (posts to #alerts channel):
{
  "channel": "#alerts",
  "text": "Performance Alert — High error rate",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":warning: *ALERT: High Error Rate*\nError rate: 5.2% (threshold: 1%)"
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "Service: api-gateway | Time: 2026-06-22 15:30:45 UTC"
        }
      ]
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Affected Executions:*\n23 (last 10 min)"
        },
        {
          "type": "mrkdwn",
          "text": "*Error Types:*\nTimeout: 18, Server: 5"
        }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Logs" },
          "url": "https://logs.example.com?service=api-gateway"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "Acknowledge" },
          "action_id": "alert_ack_23"
        }
      ]
    }
  ]
}

Warning alert (lower severity):
- Post to dedicated #warnings channel
- Mention team lead instead of full channel
- Include context but lower urgency styling
```

### Bot commands for execution control

```
Define slash commands for user interactions.

Command: /execute
Usage: /execute [service] [environment]
Response: Start sandbox execution and post status in thread

Command: /status [execution-id]
Response: Fetch and display current execution status

Command: /metrics [timerange]
Response: Post metrics summary for last [hour/day/week]

Command: /alert-config
Response: Interactive modal to adjust alert thresholds

Implementation pattern:
1. Register command in Slack app settings
2. Set request URL to your handler endpoint
3. Validate signing secret in handler
4. Respond within 3 seconds (use ack + background task)
5. Post detailed response in follow-up message or thread

Example handler (Node.js):
app.command('/execute', async ({ ack, body, client }) => {
  await ack();
  
  const { text, user_id, channel_id } = body;
  const [service, env] = text.split(' ');
  
  // Validate input
  if (!service || !env) {
    await client.chat.postMessage({
      channel: channel_id,
      text: 'Usage: /execute [service] [environment]'
    });
    return;
  }
  
  // Post status message
  const msg = await client.chat.postMessage({
    channel: channel_id,
    text: `Executing ${service} in ${env}...`,
    blocks: [/* status blocks */]
  });
  
  // Start execution in background
  startExecution(service, env, msg.ts, channel_id);
});
```

### Integration with execution pipelines

```
Connect Slack to your execution system.

Trigger points:
1. Pre-execution: Post preparation checklist
2. Start: Announce execution with details
3. Progress: Update in thread as steps complete
4. Completion: Final summary with results/artifacts
5. Failure: Alert with logs and retry options

Execution pipeline hook example:
// Before execution
await slack.postMessage({
  channel: '#sandbox-status',
  text: 'Sandbox execution queued',
  metadata: { execution_id: id }
});

// During execution (every step)
await slack.updateThread(execution_id, {
  text: `Step 3/10: Running tests... (${elapsed}s)`
});

// After execution
if (success) {
  await slack.postMessage({
    channel: '#sandbox-status',
    text: `✅ Execution completed in ${duration}s`,
    blocks: [
      section with results,
      links to artifacts
    ]
  });
} else {
  await slack.postMessage({
    channel: '#alerts',
    text: `❌ Execution failed`,
    blocks: [
      error details,
      links to logs,
      retry button
    ]
  });
}
```

### Analytics dashboard sync

```
Push analytics metrics to dashboard channel regularly.

Schedule: Every hour / Daily summary

Metrics to track:
- Total executions (daily/weekly/monthly)
- Success rate
- Average execution time
- Popular features
- Error distribution
- Performance trends

Automated post (using scheduled workflow):
function postDailyAnalytics() {
  const metrics = fetchMetrics('last_24h');
  
  slack.chat.postMessage({
    channel: '#analytics',
    blocks: [
      header('Daily Analytics'),
      metrics_summary_section(metrics),
      trend_indicators(metrics),
      chart_link_section(metrics),
      footer_with_timestamp()
    ]
  });
}

// Schedule daily at 9 AM
schedule.cron('0 9 * * *', postDailyAnalytics);
```

## Example

**User:** We want our team to get notified when sandbox executions complete, see a daily summary of feature usage, and get alerted if performance degrades.

**Setup:**

**Step 1 — Create bot (5 min):**
```bash
# Create Slack app at https://api.slack.com/apps
# Grant scopes: chat:write, channels:read, users:read
# Copy bot token
export SLACK_BOT_TOKEN="xoxb-your-token"
```

**Step 2 — Create channels:**
```bash
# In Slack, create:
# #sandbox-status (for execution updates)
# #analytics (for daily metrics)
# #alerts (for performance warnings)
```

**Step 3 — Post execution status:**
```javascript
const { WebClient } = require('@slack/web-api');
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function notifyExecution(executionId, status, duration) {
  await slack.chat.postMessage({
    channel: '#sandbox-status',
    text: `Execution ${executionId} ${status}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${status === 'success' ? '✅' : '❌'} Execution Complete*\n*ID:* ${executionId}\n*Duration:* ${duration}s`
        }
      },
      {
        type: 'actions',
        elements: [{
          type: 'button',
          text: { type: 'plain_text', text: 'View Details' },
          url: `https://dashboard.example.com/executions/${executionId}`
        }]
      }
    ]
  });
}

// After sandbox execution completes
await notifyExecution('abc-123', 'success', 42);
```

**Step 4 — Post daily metrics:**
```javascript
async function postDailyMetrics() {
  const metrics = await fetchMetricsForDay();
  
  await slack.chat.postMessage({
    channel: '#analytics',
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Daily Feature Usage' }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Executions:*\n${metrics.count}` },
          { type: 'mrkdwn', text: `*Success Rate:*\n${metrics.successRate}%` },
          { type: 'mrkdwn', text: `*Avg Time:*\n${metrics.avgDuration}s` },
          { type: 'mrkdwn', text: `*Error Rate:*\n${metrics.errorRate}%` }
        ]
      }
    ]
  });
}

// Schedule daily at 9 AM
schedule.cron('0 9 * * *', postDailyMetrics);
```

**Step 5 — Alert on performance issues:**
```javascript
async function checkPerformance() {
  const metrics = await getRollingMetrics('10m');
  
  if (metrics.errorRate > 1) {
    await slack.chat.postMessage({
      channel: '#alerts',
      text: ':warning: High error rate detected',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:warning: *ERROR RATE ALERT*\nCurrent: ${metrics.errorRate}% (threshold: 1%)`
          }
        }
      ]
    });
  }
}

// Check every minute
setInterval(checkPerformance, 60000);
```

Your team now has:
- Real-time execution status in #sandbox-status
- Daily metrics in #analytics at 9 AM
- Performance alerts in #alerts if error rate > 1%
- Easy links to view full details on dashboard
