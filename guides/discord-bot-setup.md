# Claudient Discord Bot Setup Guide

Quick start for deploying the Claudient Discord bot in your community server.

## Prerequisites

- Node.js 18+
- Discord server (admin access)
- 5 minutes

## Step 1: Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name: "Claudient" (or custom)
4. Accept terms → Create

## Step 2: Create Bot User

1. Left sidebar → "Bot"
2. Click "Add Bot"
3. Under TOKEN section, click "Copy" (save this securely in .env)
4. Scroll down to "Intents"
5. Enable:
   - ✓ Message Content Intent
   - ✓ Server Members Intent
   - ✓ Guild Messages Intent

## Step 3: Set Permissions

1. Left sidebar → "OAuth2"
2. Click "URL Generator"
3. **Scopes:**
   - ✓ bot
   - ✓ applications.commands
4. **Permissions:**
   - ✓ Manage Roles
   - ✓ Manage Channels
   - ✓ Send Messages
   - ✓ Embed Links
   - ✓ Create Public Threads
   - ✓ Create Private Threads
   - ✓ Manage Threads
5. Copy the generated URL at bottom

## Step 4: Invite Bot

1. Open the copied URL in browser
2. Select your server from dropdown
3. Click "Authorize"
4. Complete any CAPTCHA
5. Bot is now in your server

## Step 5: Environment Setup

In your Claudient project directory:

```bash
# Create .env file
cat > .env << 'EOF'
DISCORD_TOKEN=your-bot-token-here
DISCORD_CLIENT_ID=your-client-id-here
EOF
```

Get your Client ID from "General Information" in Discord Developer Portal.

## Step 6: Install & Run

```bash
# Install dependencies
npm install discord.js dotenv

# Start bot
node scripts/discord-bot.js

# Expected output:
# ✓ Claudient bot ready as Claudient#0000
```

The bot will automatically create channels on first use:
- `#support` — Support thread hub
- `#project-showcase` — Project submissions
- `#announcements` — Feature releases

## Verification

In your Discord server, try:

```
/help
→ Should show all available commands

/skill agent
→ Should list skills matching "agent"

/roles volunteer
→ Should add volunteer role to you
```

## Deployment Options

### Option A: Local Machine (Development)

```bash
# SSH or tmux session on your machine
node scripts/discord-bot.js
```

Pros: Simple, no setup
Cons: Offline when you close terminal

### Option B: Persistent Server

Deploy to any Node.js hosting (Heroku, Railway, Render, etc.):

```bash
# Create start script
echo "node scripts/discord-bot.js" > start.sh
chmod +x start.sh

# Set DISCORD_TOKEN as environment variable in hosting platform
```

### Option C: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY scripts/discord-bot.js ./scripts/
CMD ["node", "scripts/discord-bot.js"]
```

```bash
# Build and run
docker build -t claudient-bot .
docker run -e DISCORD_TOKEN=$DISCORD_TOKEN claudient-bot
```

### Option D: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start scripts/discord-bot.js --name claudient-bot

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 logs claudient-bot
pm2 monit
```

## Features

### Slash Commands

All commands support autocomplete and instant feedback:

| Command | Purpose | Example |
|---------|---------|---------|
| `/skill` | Search 400+ skills | `/skill agent` |
| `/help` | Show all commands | `/help` |
| `/support` | Create support thread | `/support I can't find the security-review skill` |
| `/project submit` | Share your project | `/project submit "My Bot" "Built with Claudient"` |
| `/project list` | Browse projects | `/project list` |
| `/announce` | Post announcements (mods) | `/announce "New Feature" "Agent Supervisor"` |
| `/roles` | Toggle role | `/roles volunteer` |

### Auto-Channels

Created automatically on first use, can be customized:

- **#support** — Volunteer-routed support threads
- **#project-showcase** — Community projects
- **#announcements** — Feature releases and updates

### Volunteer System

Community-driven 24/7 support:

1. User creates thread with `/support`
2. Volunteer joins and clicks "Assign Volunteer"
3. Volunteer helps in thread
4. Volunteer clicks "Mark Resolved" when done
5. Thread archived with resolution summary

## Troubleshooting

### Bot doesn't respond to commands

- Check bot is online (green dot in member list)
- Ensure bot has permissions in channel
- Verify "Message Content Intent" is enabled
- Check bot role is higher than any message-based roles

### "Token not set" error

```bash
# Verify .env has correct token
cat .env
# Should show: DISCORD_TOKEN=xoxb-your-token...

# Or set as environment variable
export DISCORD_TOKEN=your-token
node scripts/discord-bot.js
```

### Can't create channels/threads

- Check bot has "Manage Channels" and "Create Public Threads" permissions
- Verify server isn't at channel limit
- Try manually creating one channel; bot will use existing

### Skills not showing in search

- Check index.json exists in project root
- Run `npm run build-index` to regenerate
- Verify `index.json` has "skills" array

### Volunteer can't assign to thread

- Verify user has `volunteer` role (use `/roles volunteer`)
- Check user is in server
- Try reassigning to different volunteer

### Bot goes offline

If using development setup, bot stops when terminal closes.

Solution: Deploy to persistent host or use PM2.

## Configuration

### Customize Channel Names

Edit `scripts/discord-bot.js` and replace hardcoded names:

```javascript
// Around line 150-160
const getOrCreateSupportChannel = async (guild) => {
  const existing = guild.channels.cache.find(
    ch => ch.name === 'my-support-channel' // Change this
  );
  // ...
};
```

### Adjust Skill Search

Change result count (default: 5 max):

```javascript
// Line ~80
return skillIndex
  .filter(skill => /* ... */)
  .slice(0, 10); // Change to 10 results
```

### Modify Embed Colors

Update color codes (hex format):

```javascript
// Gold tier (currently 0xFFD700)
.setColor(0xFFD700)

// Support active (currently 0x00AA00)
.setColor(0x00AA00)

// Feature announcement (currently 0x00DD00)
.setColor(0x00DD00)
```

Hex color picker: https://www.colorhexa.com/

## Best Practices

### For Community Managers

1. Pin announcement about `/support` in #support channel
2. Welcome new volunteers with `/roles volunteer`
3. Regularly feature projects in #announcements
4. Monitor `/skill` usage to identify knowledge gaps

### For Volunteer Coordinators

1. Create volunteer training thread with skill-by-skill guides
2. Set up weekly sync call with all volunteers
3. Review resolved threads for common patterns
4. Create FAQ docs from frequently asked questions

### For Moderators

1. Use `/announce` for major releases and features
2. Link to skills in announcements
3. Pin "Getting Started" announcement
4. Set channel descriptions clearly

## Monitoring

Check bot health:

```bash
# See bot status (with PM2)
pm2 status

# Watch logs real-time
pm2 logs claudient-bot

# Check memory usage
pm2 monit
```

Monitor key metrics:

- Support threads created per day
- Average volunteer response time
- Skills most frequently searched
- Projects submitted
- Volunteer satisfaction

## Next Steps

1. **Invite your community** to the server
2. **Post welcome message** in #support channel
3. **Share `/skill` command** in a pinned message
4. **Recruit volunteers** with `/roles volunteer`
5. **Monitor and iterate** based on community feedback

## Support

For issues:

1. Check bot permissions in server settings
2. Verify `index.json` exists and is valid JSON
3. Check console output for error messages
4. Search skill library: `/skill discord-bot`
5. Create support thread: `/support Bot not responding`

## Examples

### Recruiting volunteers

Post in #announcements:

> 👋 Looking for volunteers to help community members!
> 
> Use `/roles volunteer` to join our volunteer team.
> You'll help answer questions in support threads.
> No experience necessary — just enthusiasm!

### Announcing a feature

Post in #announcements:

```
/announce Agent Teams "Orchestrate multi-agent workflows in Claude Code"
```

### Featuring a project

Post in #project-showcase manually (or via `/project submit`):

> 🎉 Check out this amazing project by @username:
> 
> **AI Code Reviewer** — Automated code reviews using Claudient
> 
> [GitHub](link) • [Demo](link) • [Docs](link)

## Security Notes

- Keep .env and DISCORD_TOKEN private
- Don't commit .env to git
- Rotate token if exposed
- Use environment variables in production (not .env file)
- Audit bot access regularly
- Limit moderator role to trusted members

## Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers)
- [Claudient Skills Library](https://claudient.dev)
- [Claude Code Documentation](https://claude.com/docs)

---

**Last updated:** 2026-06-22  
**Bot Version:** 1.0.0
