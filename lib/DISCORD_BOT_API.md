# Claudient Discord Bot — API Reference

Complete API documentation for the Claudient Discord bot. All endpoints are Discord slash commands.

## Command Reference

### User Commands

#### /skill

Search Claudient skills, agents, and features.

**Syntax:**
```
/skill [query]
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Skill name, category, or keyword to search |

**Returns:**
- Up to 5 skill results as embeds
- Each result shows: title, description, category, tier, ID

**Autocomplete:**
- Suggests matching skills as you type
- Shows up to 25 suggestions
- Case-insensitive matching

**Examples:**
```
/skill agent-construction
→ Returns Agent Construction skill (Gold tier)

/skill security
→ Returns 5 security-related skills

/skill oauth
→ Returns OAuth2 Implementation skill
```

**Response Format:**
```
┌─ Skill Title ────────────────────┐
│ Full skill description           │
│                                  │
│ Category: category-name          │
│ Tier: Gold                       │
│ ID: `category/skill-name`        │
│                                  │
│ Claudient Skills Library         │
│ 2026-06-22T14:30:00Z            │
└──────────────────────────────────┘
```

**Error Responses:**
- No skills found: "Could not find skills matching 'query'"
- Invalid query: Autocomplete handles validation
- Rate limited: Discord handles rate limiting

---

#### /help

Get quick reference for all bot commands.

**Syntax:**
```
/help
```

**Parameters:**
- None

**Returns:**
- Embed with all available commands
- Brief description for each
- Links to resources (GitHub, Docs, Discord)

**Ephemeral:**
- Response only visible to command user
- Auto-deletes after 5 minutes

**Example:**
```
/help
→ Shows all commands with descriptions and links
```

---

#### /support

Create a support thread for volunteer routing.

**Syntax:**
```
/support [topic]
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Brief description of your issue |

**Returns:**
- Confirmation message with thread link
- Support thread created in #support channel
- Thread name: `support-[username]-[random]`

**Ephemeral:**
- Confirmation only visible to you
- Thread itself is public

**Thread Contents:**
- Embed greeting
- Topic and status
- "Assign Volunteer" button
- "Mark Resolved" button (volunteer only)

**Auto-Archive:**
- Thread archived after 24 hours if not resolved
- Can be manually unarchived if needed

**Examples:**
```
/support I can't find the agent-memory skill
→ Thread created in #support
→ Awaiting volunteer assignment

/support My bot keeps going offline
→ Thread created for bot troubleshooting
→ Volunteers can now see and help
```

**Buttons:**
- **Assign Volunteer**: Volunteer assigns themselves to help
- **Mark Resolved**: Volunteer confirms issue resolved

---

#### /project submit

Submit a Claudient-powered project to showcase channel.

**Syntax:**
```
/project submit [title] [description] [url?]
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Project name (max 100 chars) |
| `description` | string | Yes | Project description (max 500 chars) |
| `url` | string | No | GitHub, demo, or docs URL |

**Returns:**
- Project posted to #project-showcase
- Confirmation message to user (ephemeral)

**Embed Format:**
```
┌─ Project Title ──────────────────┐
│ Project description              │
│                                  │
│ Author: @your-username           │
│ Category: General                │
│ Links: [Project](url)            │
│                                  │
│ Submitted 5 minutes ago          │
└──────────────────────────────────┘
```

**Examples:**
```
/project submit "AI Code Reviewer" "Automated code reviews using Claudient security-review skill" https://github.com/user/ai-code-reviewer
→ Project posted to #project-showcase
→ Community can see and react

/project submit "Real-time Chat" "Chat app using MCP for synchronization"
→ Posted without URL (no problem)
```

---

#### /project list

Browse community-submitted projects.

**Syntax:**
```
/project list
```

**Parameters:**
- None

**Returns:**
- Number of projects found
- Link to #project-showcase channel
- Ephemeral message (only visible to you)

**Example:**
```
/project list
→ "Found 12 projects in #project-showcase"
```

**To see projects:**
- Visit #project-showcase channel directly
- React to projects you like
- Click links to view full projects

---

### Moderator Commands

#### /announce

Broadcast feature announcement to community (moderators only).

**Syntax:**
```
/announce [feature] [description] [version?]
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `feature` | string | Yes | New feature name |
| `description` | string | Yes | Detailed announcement |
| `version` | string | No | Version number (e.g., "1.1.0") |

**Permissions:**
- Requires: Administrator role
- Command visible only to admins

**Returns:**
- Announcement posted to #announcements
- Confirmation to user (ephemeral)

**Embed Format:**
```
┌─ New: Feature Name ──────────────┐
│ Detailed announcement text       │
│                                  │
│ Version: 1.1.0                   │
│ Status: Available Now            │
│ Category: Enhancement            │
│                                  │
│ Claudient Updates                │
│ 2026-06-22T14:30:00Z            │
└──────────────────────────────────┘
```

**Examples:**
```
/announce Agent Teams "New orchestrator pattern for multi-agent workflows" 1.1.0
→ Announcement posted to #announcements
→ Community notified of new feature

/announce Security Audit "Enhanced security review capabilities"
→ Posted without version number
```

---

#### /roles

Manage community roles (volunteer, contributor).

**Syntax:**
```
/roles [volunteer|contributor]
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `role` | choice | Yes | `volunteer` or `contributor` |

**Behavior:**
- First use: Adds role to user
- Second use: Removes role
- Toggle on/off anytime

**Volunteer Role Benefits:**
- Can assign yourself to support threads
- See support threads in #support
- Contribution to community
- Listed in member profiles

**Contributor Role Benefits:**
- Marked as community contributor
- Highlighted in member list
- Portfolio building
- Eligibility for recognition

**Examples:**
```
/roles volunteer
→ ✓ Added volunteer role
→ You can now help in support threads

/roles volunteer (again)
→ Removed volunteer role

/roles contributor
→ ✓ Added contributor role
```

---

## Button Interactions

### Support Thread Buttons

#### Assign Volunteer

**ID:** `assign_volunteer`

**Location:** Support thread initial message

**Behavior:**
- Only available to users with `volunteer` role
- Assigns volunteer to thread
- Updates thread header with volunteer name
- Notifies volunteer they're assigned

**Error Cases:**
- "Only volunteers can assign themselves"
  → User needs `/roles volunteer` first

**Example Flow:**
```
1. User creates support thread
   → Thread appears in #support

2. Volunteer sees thread
   → Clicks "Assign Volunteer" button

3. System confirms
   → "@volunteer-name has been assigned to assist you"

4. Volunteer can now help in thread
```

---

#### Mark Resolved

**ID:** `resolve_thread`

**Location:** Support thread initial message

**Behavior:**
- Only available to assigned volunteer
- Shows resolution modal
- Archives thread after resolution
- Stores resolution summary

**Error Cases:**
- "Only the assigned volunteer can resolve this thread"
  → Only volunteer assigned to thread can use this

**Modal:**
- Title: "Resolve Support Thread"
- Text field: "Resolution Summary"
- Required: Yes

**Example Flow:**
```
1. Volunteer helped user resolve issue
2. Clicks "Mark Resolved" button
3. Modal appears: "How was this resolved?"
4. Volunteer enters: "Provided link to agent-memory skill"
5. System confirms and archives thread
```

---

## Data Structures

### Skill Object

```javascript
{
  id: "ai-engineering/agent-construction",
  category: "ai-engineering",
  lang: "en",
  title: "Agent Construction",
  description: "Multi-agent architecture patterns, tool design, orchestration",
  tier: "Gold",                    // Gold, Silver, Bronze, Standard
  file: "skills/ai-engineering/agent-construction.md"
}
```

### Support Thread Object

```javascript
{
  threadId: "123456789",
  userId: "987654321",
  userName: "john-doe",
  topic: "Can't find the agent-memory skill",
  createdAt: "2026-06-22T14:30:00Z",
  resolved: false,
  assignedVolunteer: "123456789" // or null if unassigned
}
```

### Embed Object (Skill Result)

```javascript
{
  title: "Agent Construction",
  description: "Multi-agent architecture patterns...",
  color: 0xFFD700,              // Gold tier
  fields: [
    { name: "Category", value: "ai-engineering", inline: true },
    { name: "Tier", value: "Gold", inline: true },
    { name: "ID", value: "`ai-engineering/agent-construction`", inline: false }
  ],
  footer: { text: "Claudient Skills Library" },
  timestamp: "2026-06-22T14:30:00Z"
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to create support channel" | Bot missing permissions | Add "Manage Channels" permission |
| "Could not find skills matching 'query'" | No matching skills | Try different keyword |
| "Only volunteers can assign themselves" | User missing volunteer role | Use `/roles volunteer` |
| "Failed to create support thread" | Thread creation failed | Check bot permissions |
| "An error occurred while executing this command" | Unexpected error | Check bot logs, try again |

### Error Response Format

All errors return messages like:
```
"An error occurred while executing this command."
(ephemeral, visible only to command user)
```

Detailed errors logged to:
- Bot console: `pm2 logs claudient-bot`
- Sentry (if configured)
- Application logs

---

## Rate Limiting

Discord applies rate limiting to all bots:

### Limits
- **Commands**: 10 per 10 seconds per user
- **Message creation**: 5 per 5 seconds per channel
- **Embed creation**: No limit (Discord.js handles)
- **Thread creation**: 2 per 10 minutes per channel

### Behavior
- Exceeded limits: Discord returns 429 (Too Many Requests)
- Discord.js automatically retries with backoff
- User sees temporary slowdown
- No permanent errors or data loss

### Mitigation
- Stagger thread creation in production
- Batch operations where possible
- Cache commonly accessed data

---

## Authentication & Permissions

### Slash Command Visibility

All slash commands visible to all server members.

**Exception:** `/announce` hidden from non-admins
- Parameter `setDefaultMemberPermissions(8)` restricts to administrators

### Role-Based Access

| Feature | Required Role | Check |
|---------|---------------|-------|
| Assign volunteer to thread | `volunteer` | Checked in button handler |
| Resolve support thread | Assigned volunteer | Checked in button handler |
| Post announcements | `Administrator` | Checked by Discord.js |
| Use /roles command | None | All members can toggle own roles |

### Permission Verification

```javascript
// Volunteer assignment example
if (!interaction.member.roles.cache.some(r => r.name === 'volunteer')) {
  return interaction.reply({
    content: 'Only volunteers can assign themselves.',
    ephemeral: true
  });
}
```

---

## Webhooks & Events

Currently implemented events:

| Event | Trigger | Action |
|-------|---------|--------|
| `ready` | Bot connected to Discord | Set activity, log ready message |
| `interactionCreate` (slash) | User runs slash command | Execute command handler |
| `interactionCreate` (button) | User clicks button | Execute button handler |
| `interactionCreate` (autocomplete) | Autocomplete triggered | Return suggestions |
| `interactionCreate` (modal) | Modal submitted | Process resolution |

Future webhook opportunities:

- Thread creation: Notify external logging system
- Volunteer assignment: Update metrics
- Thread resolution: Archive to knowledge base
- Skill search: Track analytics

Implement with:
```javascript
client.on('interactionCreate', async (interaction) => {
  if (interaction.commandName === 'skill') {
    // Send to webhook
    fetch('https://webhooks.example.com/skill-search', {
      method: 'POST',
      body: JSON.stringify({
        query: interaction.options.getString('query'),
        user: interaction.user.id,
        timestamp: new Date()
      })
    });
  }
});
```

---

## Embedding in Other Systems

### Get all skills (programmatic)

```javascript
// Load index.json directly
const fs = require('fs');
const index = JSON.parse(fs.readFileSync('./index.json'));
const skills = index.skills; // Array of 400+ skills
```

### Query support threads

```javascript
// Get active threads
const active = Array.from(supportThreads.values())
  .filter(t => !t.resolved);

// Get volunteer assignments
const volunteerThreads = Array.from(supportThreads.values())
  .filter(t => t.assignedVolunteer === volunteerId);
```

### Post to #announcements from external system

```bash
# Using Discord webhook (if configured)
curl -X POST https://discordapp.com/api/webhooks/[id]/[token] \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "New feature available",
    "embeds": [{...}]
  }'
```

---

## Extending the Bot

### Add Custom Command

```javascript
// Create command definition
const customCmd = {
  data: new SlashCommandBuilder()
    .setName('mycmd')
    .setDescription('My custom command')
    .addStringOption(opt =>
      opt.setName('param').setDescription('Param').setRequired(true)
    ),
  async execute(interaction) {
    const param = interaction.options.getString('param');
    await interaction.reply(`You entered: ${param}`);
  }
};

// Add to commands array
commands.push(customCmd);

// After client is ready, register
client.commands.set(customCmd.data.name, customCmd);
```

### Add Button Handler

```javascript
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'my_button_id') {
      // Handle custom button
      await interaction.reply('Button clicked!');
    }
  }
});
```

### Add Scheduled Task

```javascript
const schedule = require('node-schedule');

// Run every day at 9 AM
schedule.scheduleJob('0 9 * * *', async () => {
  // Your task here
  console.log('Daily task executed');
});
```

---

## Versioning

**Current Version:** 1.0.0

**Version Format:** MAJOR.MINOR.PATCH

**Semantic Versioning:**
- MAJOR: Breaking changes (new command structure)
- MINOR: New features (new slash command)
- PATCH: Bug fixes (error handling)

**Release Checklist:**
- [ ] Code reviewed and tested
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Tagged release in git
- [ ] Changelog included in release notes

---

## Support

For API questions or issues:

1. Check this documentation
2. Review examples/discord-bot-example.js
3. Check Discord.js documentation
4. Create GitHub issue with:
   - Discord.js version
   - Bot version
   - Steps to reproduce
   - Error logs

---

**Last Updated:** 2026-06-22  
**API Version:** 1.0.0  
**Status:** Production Ready
