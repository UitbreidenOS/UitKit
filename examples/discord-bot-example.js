/**
 * Claudient Discord Bot — Usage Examples
 *
 * This file demonstrates how to extend and customize the Discord bot
 * with additional features and integrations.
 */

// ============================================================================
// EXAMPLE 1: Custom Command — Project Stats
// ============================================================================
// Add to discord-bot.js commands array to show project statistics

const projectStatsCommand = {
  data: new (require('discord.js')).SlashCommandBuilder()
    .setName('project-stats')
    .setDescription('Show project showcase statistics'),
  async execute(interaction) {
    await interaction.deferReply();

    const channel = await getOrCreateShowcaseChannel(interaction.guild);
    const messages = await channel.messages.fetch({ limit: 100 });

    const stats = {
      total: messages.size,
      thisWeek: 0,
      thisMonth: 0,
      topAuthors: {},
    };

    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const monthMs = 30 * 24 * 60 * 60 * 1000;

    messages.forEach(msg => {
      const age = now - msg.createdTimestamp;

      if (age < weekMs) stats.thisWeek++;
      if (age < monthMs) stats.thisMonth++;

      const author = msg.author.username;
      stats.topAuthors[author] = (stats.topAuthors[author] || 0) + 1;
    });

    const topAuthors = Object.entries(stats.topAuthors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => `${name}: ${count}`)
      .join('\n');

    const embed = new (require('discord.js')).EmbedBuilder()
      .setTitle('Project Showcase Statistics')
      .setColor(0x0099FF)
      .addFields([
        { name: 'Total Projects', value: String(stats.total), inline: true },
        { name: 'This Week', value: String(stats.thisWeek), inline: true },
        { name: 'This Month', value: String(stats.thisMonth), inline: true },
        { name: 'Top Contributors', value: topAuthors || 'No projects yet', inline: false }
      ])
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};

// ============================================================================
// EXAMPLE 2: Custom Command — Volunteer Stats
// ============================================================================
// Show support thread statistics and volunteer activity

const volunteerStatsCommand = {
  data: new (require('discord.js')).SlashCommandBuilder()
    .setName('volunteer-stats')
    .setDescription('Show volunteer support statistics (moderators only)')
    .setDefaultMemberPermissions(8), // ADMINISTRATOR
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const stats = {
      activeThreads: 0,
      resolvedThreads: 0,
      totalVolunteers: new Set(),
      avgResolutionTime: 0,
    };

    supportThreads.forEach(thread => {
      if (thread.resolved) {
        stats.resolvedThreads++;
      } else {
        stats.activeThreads++;
      }
      if (thread.assignedVolunteer) {
        stats.totalVolunteers.add(thread.assignedVolunteer);
      }
    });

    const embed = new (require('discord.js')).EmbedBuilder()
      .setTitle('Support System Statistics')
      .setColor(0x0099FF)
      .addFields([
        { name: 'Active Threads', value: String(stats.activeThreads), inline: true },
        { name: 'Resolved Threads', value: String(stats.resolvedThreads), inline: true },
        { name: 'Active Volunteers', value: String(stats.totalVolunteers.size), inline: true },
        { name: 'Total Support Threads', value: String(supportThreads.size), inline: false }
      ])
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};

// ============================================================================
// EXAMPLE 3: Scheduled Announcements
// ============================================================================
// Post daily feature highlight from skill library

const scheduleFeatureHighlight = () => {
  const schedule = require('node-schedule');

  // Every day at 9 AM
  schedule.scheduleJob('0 9 * * *', async () => {
    const client = require('./discord-bot');

    client.guilds.cache.forEach(async (guild) => {
      const channel = await getOrCreateAnnouncementsChannel(guild);
      if (!channel) return;

      // Pick random skill from index
      const randomSkill = skillIndex[Math.floor(Math.random() * skillIndex.length)];

      const embed = new (require('discord.js')).EmbedBuilder()
        .setTitle(`Daily Feature Highlight: ${randomSkill.title}`)
        .setDescription(randomSkill.description)
        .setColor(0x0099FF)
        .addFields([
          { name: 'Category', value: randomSkill.category, inline: true },
          { name: 'Learn More', value: `/skill ${randomSkill.title}`, inline: false }
        ])
        .setFooter({ text: 'Discover Claudient features daily' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    });
  });
};

// ============================================================================
// EXAMPLE 4: Support Escalation
// ============================================================================
// Escalate support thread to moderators if not resolved after 1 hour

const scheduleEscalationCheck = () => {
  setInterval(async () => {
    const oneHourMs = 60 * 60 * 1000;
    const now = Date.now();

    supportThreads.forEach(async (thread, threadId) => {
      if (thread.resolved) return;

      const age = now - thread.createdAt.getTime();
      if (age > oneHourMs && !thread.escalated) {
        // Mark as escalated and notify moderators
        thread.escalated = true;

        const client = require('./discord-bot');
        const threadChannel = await client.channels.fetch(threadId);

        const embed = new (require('discord.js')).EmbedBuilder()
          .setTitle('Thread Escalated')
          .setDescription('This thread has been open for over 1 hour and needs moderator attention.')
          .setColor(0xFF9900)
          .setTimestamp();

        await threadChannel.send({
          content: '@moderator', // Mention moderator role
          embeds: [embed]
        });
      }
    });
  }, 5 * 60 * 1000); // Check every 5 minutes
};

// ============================================================================
// EXAMPLE 5: Skill Usage Analytics
// ============================================================================
// Track which skills are searched most frequently

const skillAnalytics = new (require('discord.js')).Collection();

const trackSkillSearch = (skillTitle) => {
  skillAnalytics.set(
    skillTitle,
    (skillAnalytics.get(skillTitle) || 0) + 1
  );
};

const getSkillAnalyticsCommand = {
  data: new (require('discord.js')).SlashCommandBuilder()
    .setName('skill-analytics')
    .setDescription('Show most searched skills')
    .setDefaultMemberPermissions(8), // ADMINISTRATOR
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const topSkills = Array.from(skillAnalytics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => `${skill}: ${count}`)
      .join('\n');

    const embed = new (require('discord.js')).EmbedBuilder()
      .setTitle('Skill Search Analytics')
      .setDescription(topSkills || 'No searches yet')
      .setColor(0x0099FF)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};

// In /skill command, add tracking:
// trackSkillSearch(results[0].title);

// ============================================================================
// EXAMPLE 6: Volunteer Badges
// ============================================================================
// Track volunteer achievements and display badges

const volunteerBadges = new (require('discord.js')).Collection();

const awardBadge = (volunteerId, badge) => {
  if (!volunteerBadges.has(volunteerId)) {
    volunteerBadges.set(volunteerId, []);
  }
  volunteerBadges.get(volunteerId).push(badge);
};

const checkVolunteerMilestones = (volunteerId) => {
  const resolutionCount = Array.from(supportThreads.values())
    .filter(t => t.assignedVolunteer === volunteerId && t.resolved).length;

  if (resolutionCount === 5) {
    awardBadge(volunteerId, '🥉 Helper (5 threads resolved)');
  } else if (resolutionCount === 25) {
    awardBadge(volunteerId, '🥈 Expert (25 threads resolved)');
  } else if (resolutionCount === 100) {
    awardBadge(volunteerId, '🥇 Legend (100 threads resolved)');
  }
};

// ============================================================================
// EXAMPLE 7: Integration with External APIs
// ============================================================================
// Post Claudient updates from GitHub releases

const fetchLatestReleaseCommand = {
  data: new (require('discord.js')).SlashCommandBuilder()
    .setName('latest-release')
    .setDescription('Fetch latest Claudient release'),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await fetch(
        'https://api.github.com/repos/UitbreidenOS/Claudient/releases/latest'
      );
      const release = await response.json();

      const embed = new (require('discord.js')).EmbedBuilder()
        .setTitle(`Latest Release: ${release.tag_name}`)
        .setDescription(release.body)
        .setColor(0x0099FF)
        .setURL(release.html_url)
        .addFields([
          { name: 'Published', value: new Date(release.published_at).toLocaleDateString(), inline: true },
          { name: 'Downloads', value: String(release.download_count || 0), inline: true }
        ])
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Failed to fetch release:', err);
      await interaction.editReply('Failed to fetch latest release.');
    }
  }
};

// ============================================================================
// EXAMPLE 8: Custom Decorators for Thread Messages
// ============================================================================
// Add reaction-based quick actions to support threads

const setupThreadReactions = async (thread, threadId) => {
  const message = await thread.messages.fetch().then(msgs => msgs.first());

  if (message) {
    await message.react('👍'); // Accept/helpful
    await message.react('❓'); // Need clarification
    await message.react('✅'); // Resolved
    await message.react('🔗'); // Link to docs

    const filter = (reaction, user) => !user.bot;
    const collector = message.createReactionCollector({ filter });

    collector.on('collect', async (reaction, user) => {
      const threadData = supportThreads.get(threadId);

      if (reaction.emoji.name === '✅') {
        // Quick resolve
        await resolveSupportThread(threadId, thread, 'Marked as resolved by reaction');
      } else if (reaction.emoji.name === '❓') {
        // Request more info
        const embed = new (require('discord.js')).EmbedBuilder()
          .setTitle('More Information Needed')
          .setDescription(`<@${user.id}> has requested more details about your issue.`)
          .setColor(0xFF9900);

        await thread.send({ embeds: [embed] });
      }
    });
  }
};

// ============================================================================
// EXAMPLE 9: Database Persistence (Production)
// ============================================================================
// Store support threads in database instead of memory

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./bot-data.db');

// Initialize schema
db.run(`
  CREATE TABLE IF NOT EXISTS support_threads (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_name TEXT,
    topic TEXT,
    created_at DATETIME,
    resolved BOOLEAN,
    assigned_volunteer TEXT
  )
`);

const saveSupportThread = (threadId, threadData) => {
  db.run(
    `INSERT OR REPLACE INTO support_threads VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      threadId,
      threadData.userId,
      threadData.userName,
      threadData.topic,
      threadData.createdAt,
      threadData.resolved,
      threadData.assignedVolunteer
    ]
  );
};

const loadSupportThreads = () => {
  db.all('SELECT * FROM support_threads', (err, rows) => {
    if (err) {
      console.error('Failed to load threads:', err);
      return;
    }

    rows.forEach(row => {
      supportThreads.set(row.id, {
        userId: row.user_id,
        userName: row.user_name,
        topic: row.topic,
        createdAt: new Date(row.created_at),
        resolved: Boolean(row.resolved),
        assignedVolunteer: row.assigned_volunteer
      });
    });
  });
};

// ============================================================================
// EXAMPLE 10: Integration with Monitoring Service
// ============================================================================
// Send bot health metrics to monitoring platform

const sendBotMetrics = async () => {
  setInterval(async () => {
    const client = require('./discord-bot');

    const metrics = {
      timestamp: new Date(),
      guilds: client.guilds.cache.size,
      users: client.users.cache.size,
      uptime: client.uptime,
      activeThreads: supportThreads.filter(t => !t.resolved).size,
      resolvedThreads: supportThreads.filter(t => t.resolved).size
    };

    // Send to monitoring service (e.g., Datadog, New Relic)
    console.log('Bot metrics:', metrics);

    // Example: POST to webhook
    // await fetch('https://monitoring.example.com/metrics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(metrics)
    // });
  }, 60000); // Every minute
};

// ============================================================================
// USAGE NOTES
// ============================================================================
/*
These examples demonstrate:

1. PROJECT STATS — Track projects submitted and top contributors
2. VOLUNTEER STATS — Monitor support system performance
3. SCHEDULED ANNOUNCEMENTS — Daily feature highlights
4. ESCALATION — Automatic escalation after 1 hour
5. ANALYTICS — Track skill search trends
6. BADGES — Reward volunteer achievements
7. API INTEGRATION — Fetch external data (GitHub releases)
8. REACTIONS — Quick actions via emoji reactions
9. PERSISTENCE — Store data in SQLite database
10. MONITORING — Send metrics to external service

To use any example:

1. Copy the code into discord-bot.js
2. Add command to `commands` array (for slash commands)
3. Call setup function in client.once('ready', ...) (for scheduled tasks)
4. Install any additional dependencies (sqlite3, node-schedule, etc.)
5. Test in Discord server

All examples follow same patterns as main bot code and can be
mixed and matched based on your community needs.
*/

module.exports = {
  projectStatsCommand,
  volunteerStatsCommand,
  getSkillAnalyticsCommand,
  fetchLatestReleaseCommand,
  scheduleFeatureHighlight,
  scheduleEscalationCheck,
  checkVolunteerMilestones,
  setupThreadReactions,
  saveSupportThread,
  loadSupportThreads,
  sendBotMetrics
};
