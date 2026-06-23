---
name: discord-bot
description: "Discord bot for Claudient: skill search, project showcase, feature announcements, role management, 24/7 support thread routing with volunteer assignment"
updated: 2026-06-22
---

# Claudient Discord Bot Skill

## When to activate

- Deploying a Claudient community server with integrated skill search
- Setting up 24/7 support with volunteer-routed threads
- Broadcasting feature announcements to community
- Showcasing community-built projects
- Managing contributor and volunteer roles
- Building community engagement around skills and agents

## When NOT to use

- Internal-only teams (use Slack integration instead)
- Small private projects without community needs
- Applications without need for community support routing
- Systems requiring custom command handlers beyond Discord.js

## Instructions

### Bot setup and authentication

```
Set up Claudient Discord bot.

Server: [your-server-name]
Bot name: Claudient (or custom name)

Step 1: Create Discord Application
- Go to https://discord.com/developers/applications
- Click "New Application"
- Name: Claudient (or custom)
- Accept terms and create

Step 2: Create bot user
- In "Bot" section, click "Add Bot"
- Under TOKEN, click "Copy" (save securely)
- Enable "Message Content Intent" (required for skill search)
- Enable "Server Members Intent" (for role management)
- Enable "Guild Messages Intent"

Step 3: Set permissions
In "OAuth2" → "URL Generator":
- Scopes: bot, applications.commands
- Permissions:
  - Manage Roles (for role assignment)
  - Manage Channels (for creating support/showcase channels)
  - Send Messages
  - Embed Links
  - Create Public Threads
  - Create Private Threads
  - Manage Threads

Copy generated URL and use to invite bot to server.

Step 4: Environment setup
Create .env file:
export DISCORD_TOKEN="your-bot-token-here"
export DISCORD_CLIENT_ID="your-client-id"

Step 5: Install dependencies
npm install discord.js dotenv

Step 6: Start bot
node scripts/discord-bot.js
```

### Slash command reference

```
/skill [query]
  - Search Claudient skills, agents, features
  - Query: keyword or category name
  - Returns: up to 5 matching skills with details
  - Autocomplete enabled

/help
  - Get quick reference for all bot commands
  - Shows links to docs, GitHub, community
  - Ephemeral reply (only visible to you)

/support [topic]
  - Create support thread with volunteer routing
  - Topic: brief description of issue
  - Creates thread in #support channel
  - Automatically registers with volunteer queue
  - Returns: thread link for immediate access

/project submit [title] [description] [url?]
  - Submit Claudient-powered project to showcase
  - Title: project name
  - Description: brief overview (200 chars ideal)
  - URL: optional GitHub/demo link
  - Posts to #project-showcase channel

/project list
  - Browse all submitted community projects
  - Shows recent projects from showcase channel
  - Ephemeral listing

/announce [feature] [description] [version?]
  - Broadcast feature announcement (moderators only)
  - Feature: name of new feature
  - Description: detailed announcement text
  - Version: optional version number
  - Posts to #announcements channel

/roles volunteer
  - Toggle volunteer role (for support thread routing)
  - Allows assignment to support threads
  - Manage your status anytime

/roles contributor
  - Toggle contributor role
  - Marks you as active community contributor
  - Visibility in member list
```

### Skill search configuration

```
Search behavior:
- Queries are case-insensitive
- Matches across title, description, category, and ID
- Returns up to 5 most relevant results
- Autocomplete shows 25 matching skills

Search examples:
/skill agent-construction
/skill claude-code
/skill security
/skill mcp

Results show:
- Skill title
- Full description
- Category (ai-engineering, backend, security, etc.)
- Tier (Gold, Silver, Bronze, Standard)
- Unique skill ID for documentation reference
```

### Support thread workflow

```
Thread lifecycle:

1. User creates thread with /support [topic]
   - Thread created in #support channel
   - Named: support-[username]-[random]
   - Auto-archive after 24 hours
   - Initial status: "Awaiting volunteer assignment"

2. Volunteer joins
   - Volunteer sees thread in #support
   - Clicks "Assign Volunteer" button
   - System confirms assignment
   - Volunteer notified: "You are now assigned"

3. Discussion
   - User and volunteer communicate in thread
   - Can share logs, code, troubleshooting steps
   - Escalation available if needed

4. Resolution
   - Volunteer clicks "Mark Resolved" button
   - Modal appears for resolution summary
   - Thread automatically archived
   - Summary posted for knowledge base

5. Knowledge base
   - All resolved threads remain searchable
   - Community can find similar issues
   - Common patterns become documentation

Volunteer queue:
- First volunteer to click "Assign" gets thread
- No limit on concurrent assignments
- @volunteer role required to assign
- Community-driven support model
```

### Project showcase workflow

```
Submit project:
1. Use /project submit [title] [description] [url?]
2. Project posted to #project-showcase channel
3. Rich embed shows:
   - Project title (large header)
   - Description
   - Author (your Discord username)
   - Category/tags
   - Links (GitHub, demo, docs)

Browse projects:
1. Use /project list to see recent submissions
2. Visit #project-showcase channel directly
3. React to projects you like
4. Click links to view full projects

Showcase embed includes:
- Color-coded category
- Author attribution
- Multiple link support (GitHub, demo, docs, etc.)
- Timestamp for sorting

Example projects:
- "AI Research Dashboard" - Built with claude-agent-sdk
- "Real-time Collaboration Tool" - Uses MCP for sync
- "Security Audit Framework" - Implements security-review skill
```

### Feature announcement system

```
Announcement structure:

Feature name
- Bold, attention-grabbing title

Description
- Detailed explanation of new capability
- Use cases and benefits
- Migration guide if breaking changes

Version & Status
- Version number (e.g., "1.1.0")
- Status: "Available Now", "Coming Soon", "Beta", etc.

Category
- Enhancement, New Feature, Bug Fix, Security, Performance

Highlights (optional)
- Key points in bullet format
- Performance improvements
- Breaking changes
- Deprecations

Distribution:
1. Moderator uses /announce [feature] [description] [version?]
2. Post created in #announcements channel
3. Bot automatically pings @everyone or role-specific mention
4. Searchable historical archive of all releases

Announcement best practices:
- Include actionable next steps
- Link to migration guide for upgrades
- Add code examples for major features
- Note date and timezone clearly
```

### Role management system

```
Available roles:
- volunteer: Can be assigned to support threads
- contributor: Community contributor status
- moderator: Can use /announce command

Join roles:
1. Use /roles [volunteer|contributor]
2. First use: adds role
3. Second use: removes role
4. Toggle on/off anytime

Role benefits:
- Volunteer: See support threads, receive assignments
- Contributor: Highlighted in member list, portfolio building
- Moderator: Post announcements, manage channels (admin only)

Permissions enforced:
- Only volunteers can assign to threads
- Only volunteer assigned can resolve thread
- Only moderators can use /announce
- All members can search skills and submit projects

Role visibility:
- All members can see who has roles
- Separate from Discord role hierarchy
- Community-driven trust system
```

### Auto-channel creation

```
Channels created automatically on first use:

#support
- Topic: "24/7 support with volunteer routing"
- Type: Text channel
- Purpose: Support thread hub
- Auto-archives threads after 24 hours

#project-showcase
- Topic: "Community projects built with Claudient"
- Type: Text channel
- Purpose: Project submissions and browsing
- Pinned announcement about submission process

#announcements
- Topic: "Claudient updates and feature releases"
- Type: Text channel
- Purpose: Official release announcements
- Managed by moderators

Channel management:
- Channels persist after creation
- Manual deletion resets (next use recreates)
- Admins can customize descriptions
- Bot respects existing channel if found

Customization:
- Rename channels as needed (bot uses hardcoded names)
- Set channel descriptions and topic
- Pin important guidelines
- Adjust archive duration per channel
```

### Skill index integration

```
Skill database:
- Reads from index.json (auto-generated)
- Contains 400+ skills, agents, and features
- Updated during npm run build

Search indexing:
- Title field (primary)
- Description field (secondary)
- Category field (exact or fuzzy)
- ID field (technical terms)

Tier system:
- Gold: Premium/advanced skills
- Silver: Intermediate level
- Bronze: Beginner-friendly
- Standard: General utilities

Autocomplete:
- Real-time suggestions as you type
- Covers all indexed skills
- 25-result limit
- Case-insensitive matching

Fallback:
- If index.json missing: bot starts with empty skill library
- Graceful degradation: search returns zero results
- Error logged to console
```

### Thread data structure

```
Support thread metadata:
{
  threadId: "Discord channel ID",
  userId: "Creator's user ID",
  userName: "Creator's username",
  topic: "Initial support topic",
  createdAt: "ISO timestamp",
  resolved: false,
  assignedVolunteer: "Volunteer's user ID or null"
}

Stored in memory (Collection):
- Persists during bot runtime
- Lost on restart (consider database for production)
- Fast lookup by thread ID or user ID

Query patterns:
- Get thread by ID: supportThreads.get(threadId)
- Get active threads: supportThreads.filter(t => !t.resolved)
- Get volunteer assignments: volunteerAssignments.get(volunteerId)
- Count open threads: supportThreads.filter(t => !t.resolved).size
```

### Embeds and formatting

```
Skill result embed:
- Title: Skill name
- Description: Full description text
- Color: Tier-based (Gold→yellow, Silver→gray, etc.)
- Fields: Category, Tier, ID
- Footer: "Claudient Skills Library"
- Timestamp: Current time

Project showcase embed:
- Title: Project name
- Description: Project overview
- Color: Category-specific or custom
- Fields: Author, Category, Links
- Image: Optional project screenshot
- Timestamp: Submission time

Feature announcement embed:
- Title: "New: [Feature Name]"
- Description: Announcement text
- Color: 0x00DD00 (bright green)
- Fields: Version, Status, Category, Highlights
- Footer: "Claudient Updates"
- Timestamp: Announcement time

Support thread embed:
- Title: "Support Thread Created" or status update
- Description: Greeting message
- Color: Status-based (00AA00 green for active, etc.)
- Fields: Topic, Status, Volunteer name
- Timestamp: Current time
```

### Error handling and recovery

```
Error scenarios:

1. Channel creation fails
   - Logs error to console
   - Returns null
   - Command notifies user: "Failed to create channel"

2. Role assignment fails
   - Checks if role exists
   - Reports specific issue to user
   - Suggests alternate action

3. Thread creation fails
   - Wrapped in try-catch
   - Error logged
   - User notified with friendly message

4. Command execution fails
   - Generic error response sent
   - Full error logged to console
   - User: "An error occurred while executing this command"

5. Missing environment variables
   - Bot exits on startup with clear message
   - Points to DISCORD_TOKEN requirement

6. Index.json missing
   - Bot starts normally
   - Skill search returns no results
   - No crash - graceful degradation

Recovery:
- Restart bot to clear runtime state
- Check bot permissions in server
- Verify token is still valid
- Ensure index.json exists in project root
```

## Example

**User:** Set up Claudient Discord bot for our community server with support threads and skill search.

**Setup (5 min):**

```bash
# Step 1: Create .env
cat > .env << 'EOF'
DISCORD_TOKEN=your-bot-token-here
DISCORD_CLIENT_ID=your-client-id-here
EOF

# Step 2: Install
npm install discord.js dotenv

# Step 3: Start bot
node scripts/discord-bot.js
# Output: ✓ Claudient bot ready as claudient#0000
```

**Community in action:**

```
User searches for Agent SDK:
/skill agent-sdk

Bot responds with:
┌─ Agent Sdk ─────────────────────────────────────────┐
│ Build AI agents using the Claude Agent SDK with     │
│ tool use, memory, and multi-step orchestration      │
│                                                      │
│ Category: ai-engineering                            │
│ Tier: Gold                                           │
│ ID: ai-engineering/agent-sdk                        │
│                                                      │
│ [Learn More] [Docs] [Examples]                       │
└──────────────────────────────────────────────────────┘
```

```
User needs help:
/support I'm building an agent with memory but having issues with context

Bot creates thread: #support-john-doe-1234
✓ Support thread created
  Topic: "I'm building an agent with memory..."
  Status: Awaiting volunteer assignment

Volunteer joins:
Clicks "Assign Volunteer" button
✓ Thread assigned to @jane-volunteer
  Jane can now help troubleshoot

Jane resolves:
Clicks "Mark Resolved"
Resolution: "Provided memory management patterns from agent-memory skill"
✓ Thread archived and documented
```

```
Moderator announces new feature:
/announce Agent Supervisor "New supervisor pattern for multi-agent orchestration" 1.1.0

Bot posts to #announcements:
┌─ New: Agent Supervisor ─────────────────────────┐
│ New supervisor pattern for multi-agent         │
│ orchestration. Enables fine-grained control    │
│ over agent teams and task delegation.          │
│                                                │
│ Version: 1.1.0                                 │
│ Status: Available Now                          │
│ Category: Enhancement                          │
│                                                │
│ [Changelog] [Migration Guide] [Examples]      │
└────────────────────────────────────────────────┘

Community sees announcement and checks /skill agent-supervisor
```

```
Developer showcases project:
/project submit "AI Code Reviewer" "Automated code reviews using Claudient security-review skill" https://github.com/user/ai-code-reviewer

Bot posts to #project-showcase:
┌─ AI Code Reviewer ──────────────────────┐
│ Automated code reviews using Claudient │
│ security-review skill                   │
│                                         │
│ Author: @developer-name                │
│ Category: Developer Tools               │
│ Links: [GitHub](https://github.com/...) │
│ [Demo] [Docs]                           │
│                                         │
│ Submitted 5 minutes ago                │
└─────────────────────────────────────────┘

Community reacts with ✨, clicks link to check out project
```

Your Claudient Discord community now has:
- Instant skill search with 400+ results
- 24/7 volunteer-routed support
- Feature announcement broadcasts
- Community project showcase
- Role-based member management
- Persistent thread-based knowledge base
