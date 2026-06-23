# Claudient Discord Bot — Deployment Checklist

Complete, production-ready deployment guide for the Claudient Discord bot.

## Pre-Deployment Checklist

### Code Review
- [ ] All slash commands tested locally
- [ ] Error handling covers all edge cases
- [ ] Bot permissions verified in code
- [ ] No hardcoded secrets or tokens
- [ ] Environment variables configured in `.env.example`
- [ ] All imports and dependencies listed in package.json
- [ ] Code follows ESM syntax (import/export)
- [ ] No console.log spam (use strategic logging)

### Bot Configuration
- [ ] Discord bot created in Developer Portal
- [ ] Bot token securely stored
- [ ] Correct intents enabled:
  - [x] Message Content Intent
  - [x] Server Members Intent
  - [x] Guild Messages Intent
- [ ] Permissions set in OAuth2:
  - [x] Manage Roles
  - [x] Manage Channels
  - [x] Send Messages
  - [x] Embed Links
  - [x] Create/Manage Threads
- [ ] Bot invited to server with generated OAuth2 URL

### Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] `DISCORD_TOKEN` set correctly
- [ ] `DISCORD_CLIENT_ID` set correctly
- [ ] `.env` added to `.gitignore`
- [ ] All required npm packages installed

### Documentation
- [ ] README.md reviewed and updated
- [ ] CLAUDE.md checked for project rules
- [ ] Skill skill registered in index.json
- [ ] Setup guide reviewed
- [ ] Examples documented with usage

## Deployment Steps

### Step 1: Local Testing (30 min)

```bash
# Install dependencies
npm install discord.js dotenv

# Create .env file
cp .env.example .env
# Edit with your token and client ID

# Test bot locally
node scripts/discord-bot.js
```

Verify:
- Bot appears online in Discord server
- `/help` command shows all commands
- `/skill agent` returns results
- Can create support thread with `/support`
- Volunteer can assign to thread
- Volunteer can resolve thread
- Project can be submitted with `/project submit`
- Announcements can be posted (admin only)
- All error messages are helpful

### Step 2: Permissions Verification

In Discord server settings:

**Bot Permissions:**
- [ ] Message: Send Messages ✓
- [ ] Message: Embed Links ✓
- [ ] Manage: Manage Roles ✓
- [ ] Manage: Manage Channels ✓
- [ ] Manage: Create Private Threads ✓
- [ ] Manage: Create Public Threads ✓
- [ ] Manage: Manage Threads ✓

**Channel Permissions:**
- [ ] #support — Bot can create threads
- [ ] #project-showcase — Bot can post messages
- [ ] #announcements — Bot can post messages

### Step 3: Channel Setup

Bot auto-creates these channels on first use:
- `#support` — Support thread hub
- `#project-showcase` — Project submissions
- `#announcements` — Feature releases

Alternatively, manually create and let bot use them:

```bash
# In Discord server:
1. Create #support channel
2. Create #project-showcase channel
3. Create #announcements channel

# Bot will automatically find and use existing channels
```

### Step 4: Role Setup

Bot auto-creates these roles on first use:
- `volunteer` — Can assign to support threads
- `contributor` — Community contributor
- `moderator` — Can post announcements

Alternatively, manually create roles with appropriate permissions.

### Step 5: Production Deployment

#### Option A: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start scripts/discord-bot.js --name claudient-bot

# Configure auto-restart
pm2 startup
pm2 save

# Verify running
pm2 status
pm2 logs claudient-bot
```

#### Option B: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY scripts/discord-bot.js ./scripts/
COPY .env ./
ENV NODE_ENV=production
CMD ["node", "scripts/discord-bot.js"]
```

```bash
# Build
docker build -t claudient-bot .

# Run
docker run --name claudient-bot -d claudient-bot

# Check logs
docker logs -f claudient-bot
```

#### Option C: Cloud Hosting (Heroku, Railway, Render, etc.)

1. Connect GitHub repository
2. Set environment variables:
   - `DISCORD_TOKEN=your-token`
   - `DISCORD_CLIENT_ID=your-id`
   - `NODE_ENV=production`
3. Set build command: `npm install`
4. Set start command: `node scripts/discord-bot.js`
5. Deploy branch: `main`

#### Option D: Systemd Service (Linux Server)

Create `/etc/systemd/system/claudient-bot.service`:

```ini
[Unit]
Description=Claudient Discord Bot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/claudient
EnvironmentFile=/opt/claudient/.env
ExecStart=/usr/bin/node /opt/claudient/scripts/discord-bot.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable claudient-bot
sudo systemctl start claudient-bot

# Check status
sudo systemctl status claudient-bot

# View logs
sudo journalctl -u claudient-bot -f
```

### Step 6: Post-Deployment Verification

```bash
# ✓ Bot is online (green dot)
# ✓ Activity shows "Claudient skills | /help"
# ✓ All commands respond
# ✓ Channels created if needed
# ✓ Roles created if needed
# ✓ Error logs are clean
# ✓ Database/persistence working (if applicable)
```

## Monitoring & Maintenance

### Daily

- [ ] Bot status online
- [ ] No error logs
- [ ] Support threads being created
- [ ] Volunteers responding

### Weekly

- [ ] Review support thread stats
- [ ] Check skill search trends
- [ ] Verify announcements posted
- [ ] Monitor volunteer activity

### Monthly

- [ ] Archive old support threads
- [ ] Review and optimize code
- [ ] Update documentation
- [ ] Plan feature improvements
- [ ] Review permissions and security

### Quarterly

- [ ] Update Discord.js version
- [ ] Security audit
- [ ] Performance profiling
- [ ] Community feedback review

## Scaling Guide

### 50-500 Members

Current setup handles this.

**Config:**
- Use PM2 or Docker for persistence
- Keep index.json in memory (fast)
- Thread storage in memory (fine for <1000 threads)

### 500-5,000 Members

**Upgrades needed:**
- Add database for thread persistence
- Implement caching layer
- Add monitoring and alerting
- Setup log aggregation

**Database schema:**

```sql
CREATE TABLE support_threads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT,
  topic TEXT,
  created_at DATETIME,
  resolved BOOLEAN,
  assigned_volunteer TEXT
);

CREATE INDEX idx_resolved ON support_threads(resolved);
CREATE INDEX idx_volunteer ON support_threads(assigned_volunteer);
```

**Cache setup:**

```javascript
// Add Redis for volunteer queue
const redis = require('redis');
const cache = redis.createClient();

// Cache recent skills
cache.setex('skills:index', 3600, JSON.stringify(skillIndex));
```

### 5,000+ Members

**Production setup:**
- PostgreSQL with read replicas
- Redis cluster for caching
- Load balancer for multiple bot instances
- Message queue for events
- Elasticsearch for thread search
- Prometheus/Grafana monitoring
- ELK stack for logging
- CDN for assets
- Bot sharding for Discord API limits

## Backup & Recovery

### Backup Strategy

**Daily backups:**
```bash
# Backup support threads
pg_dump claudient_bot > backups/threads_$(date +%Y%m%d).sql

# Backup configuration
cp .env backups/.env.$(date +%Y%m%d)
```

**Archive old threads:**
```javascript
// Run weekly
const archive = await db.query(
  'SELECT * FROM support_threads WHERE resolved AND created_at < NOW() - INTERVAL 30 days'
);
fs.writeFileSync(`archives/threads_${date}.json`, JSON.stringify(archive));
await db.query('DELETE FROM support_threads WHERE resolved AND created_at < NOW() - INTERVAL 90 days');
```

### Recovery Procedures

**Bot crashes:**
1. Check error logs
2. Verify token is valid
3. Check Discord status
4. Restart bot (automatic with PM2)

**Data corruption:**
1. Restore from latest backup
2. Rebuild database schema
3. Import archived threads
4. Verify data integrity

**Discord outage:**
1. Bot auto-reconnects when Discord recovers
2. Check Discord status page
3. Monitor logs for reconnection
4. No manual intervention needed

## Security Hardening

### Code Security

- [ ] No hardcoded tokens or secrets
- [ ] All inputs validated
- [ ] Rate limiting implemented (Discord provides)
- [ ] Permissions checked before operations
- [ ] Error messages don't expose secrets
- [ ] Dependencies kept up-to-date
- [ ] Regular security audits

### Infrastructure Security

- [ ] TLS/SSL for all connections
- [ ] Environment variables for secrets
- [ ] Database credentials secured
- [ ] Firewall restricts access
- [ ] Regular backups encrypted
- [ ] Server hardened (no unnecessary services)
- [ ] SSH key-based auth only
- [ ] Monitoring for suspicious activity

### Application Security

- [ ] Command validation
- [ ] Rate limiting per user
- [ ] Thread ownership verified before operations
- [ ] Volunteer role required for assignments
- [ ] Admin role required for announcements
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (Discord handles this)

## Incident Response

### Issue: Bot Offline

```bash
# Check status
pm2 status claudient-bot

# Restart if needed
pm2 restart claudient-bot

# Check logs
pm2 logs claudient-bot --err

# If still offline, check:
# 1. Network connectivity
# 2. Discord API status
# 3. Bot token validity
# 4. Server permissions
```

### Issue: Commands Not Responding

```bash
# Verify bot is online (green dot)
# Check bot permissions in server

# Check command registration
# Discord takes up to 1 hour to sync slash commands
# Force refresh: remove and re-invite bot

# Check for errors
pm2 logs claudient-bot

# Verify index.json exists
ls -la index.json
```

### Issue: Support Threads Not Creating

```bash
# Check bot has:
# - Manage Channels permission
# - Create Public Threads permission
# - Manage Threads permission

# Check channel exists or bot can create it
# Check Discord rate limits

# Check logs for specific error
pm2 logs claudient-bot | grep "Failed to create"
```

### Issue: High Memory Usage

```bash
# Monitor
pm2 monit

# If memory growing:
# 1. Check for thread leaks
# 2. Archive old threads to database
# 3. Clear thread cache periodically
# 4. Implement garbage collection

# Restart if needed
pm2 restart claudient-bot
```

## Performance Optimization

### Skill Search

- Pre-compile regex patterns
- Use fuzzy matching library if needed
- Index by category for faster lookups
- Cache common searches

### Thread Management

- Store in database for large volumes
- Implement pagination for listing
- Archive old threads regularly
- Use indexes on frequently queried fields

### Memory Usage

- Stream large result sets
- Implement cache eviction
- Monitor collection sizes
- Use WeakMaps for auto-cleanup

### API Rate Limits

Discord.js handles rate limiting automatically, but:
- Batch operations where possible
- Stagger thread creation
- Cache embed data
- Reuse message objects

## Cost Analysis

### Monthly costs (typical setup):

| Component | Service | Cost |
|-----------|---------|------|
| Bot hosting | PM2 (your server) | $0-10 |
| Database | PostgreSQL (local/free tier) | $0-15 |
| Monitoring | Prometheus (free) | $0 |
| Logs | Syslog (free) | $0 |
| CDN | Not needed | $0 |
| **Total** | | **$0-25** |

### High-volume setup (5000+ members):

| Component | Service | Cost |
|-----------|---------|------|
| Bot hosting | Heroku/Railway | $7-50 |
| Database | PostgreSQL | $15-100 |
| Caching | Redis | $0-50 |
| Monitoring | Datadog/New Relic | $20-100 |
| Logs | Loggly/Papertrail | $10-50 |
| CDN | Cloudflare | $0-20 |
| **Total** | | **$52-370** |

## Rollback Procedures

### Rollback recent changes:

```bash
# If new version breaks bot:
git log --oneline | head -5
git revert <commit-hash>

# Or use previous version
git checkout v1.0.0

# Restart bot
pm2 restart claudient-bot
```

### Database migrations:

```bash
# Backup before migration
pg_dump claudient_bot > backup.sql

# Run migration
npm run migrate:up

# If failed, rollback
npm run migrate:down

# Restore from backup if needed
psql claudient_bot < backup.sql
```

## Success Metrics

Track these KPIs:

- **Uptime:** ≥ 99.5% (expect ~4 hours downtime/month)
- **Response time:** < 200ms for /skill command
- **Support threads:** > 1 per day (indicates active community)
- **Volunteer response:** < 30 minutes average
- **Resolution rate:** > 80% of threads resolved
- **User satisfaction:** > 4/5 stars in feedback
- **Project submissions:** > 2 per week (community engagement)

## Documentation

Keep updated:
- [ ] README.md — Setup instructions
- [ ] DISCORD_BOT_SETUP.md — Detailed guide
- [ ] DISCORD_BOT_README.md — Full reference
- [ ] DISCORD_BOT_DEPLOYMENT.md — This file
- [ ] Runbooks for common issues
- [ ] Architecture diagrams
- [ ] API documentation

## Sign-Off Checklist

**Project Manager:**
- [ ] Requirements met
- [ ] All features working
- [ ] Documentation complete
- [ ] Performance acceptable

**Developer:**
- [ ] Code reviewed
- [ ] Tests passing
- [ ] No security issues
- [ ] Error handling implemented

**DevOps:**
- [ ] Infrastructure ready
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Runbooks written

**QA:**
- [ ] Functionality tested
- [ ] Edge cases covered
- [ ] Load tested
- [ ] Security scanned

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Status:** [ ] Ready [ ] In Progress [ ] Complete

**Emergency Contact:** _____________  
**Escalation Path:** _____________
