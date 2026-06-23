#!/usr/bin/env node

/**
 * Claudient Discord Bot
 *
 * Features:
 * - Skill search & quick help
 * - Project showcase
 * - Feature announcements
 * - Role management
 * - 24/7 support thread routing
 *
 * Setup:
 * 1. npm install discord.js dotenv
 * 2. Create .env with DISCORD_TOKEN and DISCORD_CLIENT_ID
 * 3. Create bot at https://discord.com/developers/applications
 * 4. Grant intents: SERVER_MEMBERS, MESSAGE_CONTENT, GUILDS, GUILD_MESSAGES
 * 5. node scripts/discord-bot.js
 */

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  Collection
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// Load index.json for skills
let skillIndex = [];
try {
  const indexPath = path.join(__dirname, '../index.json');
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  skillIndex = indexData.skills || [];
} catch (err) {
  console.error('Failed to load index.json:', err.message);
}

// Support thread manager
const supportThreads = new Collection();
const volunteerAssignments = new Collection();

// ===== UTILITY FUNCTIONS =====

/**
 * Search skills by query
 */
function searchSkills(query) {
  const lowerQuery = query.toLowerCase();
  return skillIndex
    .filter(skill =>
      skill.title?.toLowerCase().includes(lowerQuery) ||
      skill.description?.toLowerCase().includes(lowerQuery) ||
      skill.id?.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 5);
}

/**
 * Create skill result embed
 */
function createSkillEmbed(skill) {
  return new EmbedBuilder()
    .setTitle(skill.title)
    .setDescription(skill.description)
    .setColor(skill.tier === 'Gold' ? 0xFFD700 : skill.tier === 'Silver' ? 0xC0C0C0 : 0xCD7F32)
    .addFields([
      { name: 'Category', value: skill.category || 'Uncategorized', inline: true },
      { name: 'Tier', value: skill.tier || 'Standard', inline: true },
      { name: 'ID', value: `\`${skill.id}\``, inline: false }
    ])
    .setFooter({ text: 'Claudient Skills Library' })
    .setTimestamp();
}

/**
 * Create support thread
 */
async function createSupportThread(user, channel, topic) {
  try {
    const thread = await channel.threads.create({
      name: `support-${user.username}-${Date.now().toString().slice(-4)}`,
      autoArchiveDuration: 1440,
      reason: `Support thread for ${user.tag} - ${topic}`
    });

    supportThreads.set(thread.id, {
      userId: user.id,
      userName: user.username,
      topic: topic,
      createdAt: new Date(),
      resolved: false,
      assignedVolunteer: null
    });

    const embed = new EmbedBuilder()
      .setTitle('Support Thread Created')
      .setDescription(`Welcome ${user}! A volunteer will assist you shortly.`)
      .setColor(0x00AA00)
      .addFields([
        { name: 'Topic', value: topic, inline: false },
        { name: 'Status', value: 'Awaiting volunteer assignment', inline: false }
      ])
      .setTimestamp();

    await thread.send({ embeds: [embed] });
    return thread;
  } catch (err) {
    console.error('Failed to create support thread:', err);
    throw err;
  }
}

/**
 * Assign volunteer to thread
 */
async function assignVolunteer(threadId, volunteerId, thread) {
  try {
    const threadData = supportThreads.get(threadId);
    if (!threadData) return false;

    threadData.assignedVolunteer = volunteerId;
    volunteerAssignments.set(volunteerId, threadId);

    const embed = new EmbedBuilder()
      .setTitle('Volunteer Assigned')
      .setDescription(`<@${volunteerId}> has been assigned to assist you.`)
      .setColor(0x0099FF)
      .setTimestamp();

    await thread.send({ embeds: [embed] });
    return true;
  } catch (err) {
    console.error('Failed to assign volunteer:', err);
    return false;
  }
}

/**
 * Resolve support thread
 */
async function resolveSupportThread(threadId, thread, resolution) {
  try {
    const threadData = supportThreads.get(threadId);
    if (!threadData) return false;

    threadData.resolved = true;

    const embed = new EmbedBuilder()
      .setTitle('Thread Resolved')
      .setDescription(`This support thread has been resolved.\n\n**Resolution:** ${resolution}`)
      .setColor(0x00AA00)
      .setTimestamp();

    await thread.send({ embeds: [embed] });
    await thread.setArchived(true);

    return true;
  } catch (err) {
    console.error('Failed to resolve thread:', err);
    return false;
  }
}

/**
 * Get or create showcase channel
 */
async function getOrCreateShowcaseChannel(guild) {
  try {
    const existing = guild.channels.cache.find(
      ch => ch.name === 'project-showcase' && ch.type === ChannelType.GuildText
    );
    if (existing) return existing;

    return await guild.channels.create({
      name: 'project-showcase',
      type: ChannelType.GuildText,
      topic: 'Community projects built with Claudient'
    });
  } catch (err) {
    console.error('Failed to get/create showcase channel:', err);
    return null;
  }
}

/**
 * Get or create announcements channel
 */
async function getOrCreateAnnouncementsChannel(guild) {
  try {
    const existing = guild.channels.cache.find(
      ch => ch.name === 'announcements' && ch.type === ChannelType.GuildText
    );
    if (existing) return existing;

    return await guild.channels.create({
      name: 'announcements',
      type: ChannelType.GuildText,
      topic: 'Claudient updates and feature releases'
    });
  } catch (err) {
    console.error('Failed to get/create announcements channel:', err);
    return null;
  }
}

/**
 * Get or create support channel
 */
async function getOrCreateSupportChannel(guild) {
  try {
    const existing = guild.channels.cache.find(
      ch => ch.name === 'support' && ch.type === ChannelType.GuildText
    );
    if (existing) return existing;

    return await guild.channels.create({
      name: 'support',
      type: ChannelType.GuildText,
      topic: '24/7 support with volunteer routing'
    });
  } catch (err) {
    console.error('Failed to get/create support channel:', err);
    return null;
  }
}

/**
 * Get or create roles
 */
async function getOrCreateRoles(guild) {
  try {
    const roles = {};
    const roleNames = ['contributor', 'volunteer', 'moderator'];

    for (const name of roleNames) {
      const existing = guild.roles.cache.find(r => r.name === name);
      if (existing) {
        roles[name] = existing;
      } else {
        roles[name] = await guild.roles.create({
          name: name,
          reason: `Claudient bot auto-created role: ${name}`
        });
      }
    }

    return roles;
  } catch (err) {
    console.error('Failed to create roles:', err);
    return {};
  }
}

/**
 * Create rich project showcase embed
 */
function createProjectShowcaseEmbed(project) {
  const embed = new EmbedBuilder()
    .setTitle(project.title)
    .setDescription(project.description)
    .setColor(project.color || 0x0099FF)
    .addFields([
      { name: 'Author', value: project.author || 'Community', inline: true },
      { name: 'Category', value: project.category || 'General', inline: true },
      { name: 'Links', value: project.links?.map(l => `[${l.name}](${l.url})`).join(' • ') || 'No links', inline: false }
    ])
    .setTimestamp();

  if (project.image) embed.setImage(project.image);
  return embed;
}

/**
 * Create feature announcement embed
 */
function createFeatureAnnouncementEmbed(feature) {
  return new EmbedBuilder()
    .setTitle(`New: ${feature.name}`)
    .setDescription(feature.description)
    .setColor(0x00DD00)
    .addFields([
      { name: 'Version', value: feature.version, inline: true },
      { name: 'Status', value: feature.status || 'Available', inline: true },
      { name: 'Category', value: feature.category || 'Enhancement', inline: false },
      ...(feature.highlights ? [{ name: 'Highlights', value: feature.highlights, inline: false }] : [])
    ])
    .setFooter({ text: 'Claudient Updates' })
    .setTimestamp();
}

// ===== SLASH COMMANDS =====

client.commands = new Collection();

const commands = [
  {
    data: new SlashCommandBuilder()
      .setName('skill')
      .setDescription('Search Claudient skills')
      .addStringOption(opt => opt
        .setName('query')
        .setDescription('Skill name or category to search')
        .setRequired(true)
        .setAutocomplete(true)
      ),
    async execute(interaction) {
      await interaction.deferReply();
      const query = interaction.options.getString('query');
      const results = searchSkills(query);

      if (results.length === 0) {
        return interaction.editReply({
          embeds: [new EmbedBuilder()
            .setTitle('No Skills Found')
            .setDescription(`Could not find skills matching "${query}"`)
            .setColor(0xFF0000)
          ]
        });
      }

      const embeds = results.map(createSkillEmbed);
      await interaction.editReply({ embeds });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Get quick help about Claudient features'),
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle('Claudient Help')
        .setDescription('The Claude Code knowledge system with 400+ skills, 182+ agents, and comprehensive ecosystem support.')
        .setColor(0x0099FF)
        .addFields([
          {
            name: '/skill',
            value: 'Search for skills, agents, and features by keyword',
            inline: false
          },
          {
            name: '/support',
            value: 'Create a support thread for custom assistance (24/7)',
            inline: false
          },
          {
            name: '/project',
            value: 'Submit or view community projects',
            inline: false
          },
          {
            name: '/announce',
            value: 'Broadcast feature announcements (moderators only)',
            inline: false
          },
          {
            name: '/roles',
            value: 'Manage contributor and volunteer roles',
            inline: false
          },
          {
            name: 'Resources',
            value: '[GitHub](https://github.com/UitbreidenOS/Claudient) • [Docs](https://claudient.dev) • [Discord](https://discord.gg/claudient)',
            inline: false
          }
        ])
        .setFooter({ text: 'Use /skill [query] to find specific features' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('support')
      .setDescription('Create a support thread (24/7 volunteer routing)')
      .addStringOption(opt => opt
        .setName('topic')
        .setDescription('Brief description of your issue')
        .setRequired(true)
      ),
    async execute(interaction) {
      await interaction.deferReply({ ephemeral: true });

      const channel = await getOrCreateSupportChannel(interaction.guild);
      if (!channel) {
        return interaction.editReply('Failed to create support channel.');
      }

      try {
        const thread = await createSupportThread(
          interaction.user,
          channel,
          interaction.options.getString('topic')
        );

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('assign_volunteer')
              .setLabel('Assign Volunteer')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('resolve_thread')
              .setLabel('Mark Resolved')
              .setStyle(ButtonStyle.Success)
          );

        await thread.send({ components: [row] });

        await interaction.editReply({
          content: `Support thread created: <#${thread.id}>`,
          ephemeral: true
        });
      } catch (err) {
        console.error('Support command error:', err);
        await interaction.editReply('Failed to create support thread.');
      }
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('project')
      .setDescription('Submit or browse community projects')
      .addSubcommand(sub => sub
        .setName('submit')
        .setDescription('Submit your Claudient-powered project')
        .addStringOption(opt => opt.setName('title').setDescription('Project title').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Brief description').setRequired(true))
        .addStringOption(opt => opt.setName('url').setDescription('GitHub/demo URL').setRequired(false))
      )
      .addSubcommand(sub => sub
        .setName('list')
        .setDescription('Browse submitted projects')
      ),
    async execute(interaction) {
      await interaction.deferReply();

      if (interaction.options.getSubcommand() === 'submit') {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const url = interaction.options.getString('url');

        const channel = await getOrCreateShowcaseChannel(interaction.guild);
        if (!channel) {
          return interaction.editReply('Failed to access showcase channel.');
        }

        const embed = createProjectShowcaseEmbed({
          title: title,
          description: description,
          author: interaction.user.username,
          color: 0x0099FF,
          links: url ? [{ name: 'Project', url: url }] : []
        });

        await channel.send({ embeds: [embed] });

        await interaction.editReply({
          content: `✅ Project "${title}" submitted to <#${channel.id}>!`,
          ephemeral: true
        });
      } else if (interaction.options.getSubcommand() === 'list') {
        const channel = await getOrCreateShowcaseChannel(interaction.guild);
        if (!channel) {
          return interaction.editReply('Showcase channel not found.');
        }

        const messages = await channel.messages.fetch({ limit: 10 });
        if (messages.size === 0) {
          return interaction.editReply('No projects submitted yet. Be the first with `/project submit`!');
        }

        await interaction.editReply({
          content: `Found ${messages.size} projects in <#${channel.id}>`,
          ephemeral: true
        });
      }
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('announce')
      .setDescription('Broadcast feature announcements (moderators only)')
      .addStringOption(opt => opt.setName('feature').setDescription('Feature name').setRequired(true))
      .addStringOption(opt => opt.setName('description').setDescription('Feature description').setRequired(true))
      .addStringOption(opt => opt.setName('version').setDescription('Version number').setRequired(false))
      .setDefaultMemberPermissions(8), // ADMINISTRATOR
    async execute(interaction) {
      await interaction.deferReply();

      const channel = await getOrCreateAnnouncementsChannel(interaction.guild);
      if (!channel) {
        return interaction.editReply('Failed to access announcements channel.');
      }

      const embed = createFeatureAnnouncementEmbed({
        name: interaction.options.getString('feature'),
        description: interaction.options.getString('description'),
        version: interaction.options.getString('version') || 'Latest',
        status: 'Available Now'
      });

      await channel.send({ embeds: [embed] });

      await interaction.editReply({
        content: `✅ Announcement posted to <#${channel.id}>`,
        ephemeral: true
      });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('roles')
      .setDescription('Manage contributor and volunteer roles')
      .addSubcommand(sub => sub
        .setName('volunteer')
        .setDescription('Join as a support volunteer')
      )
      .addSubcommand(sub => sub
        .setName('contributor')
        .setDescription('Join as a contributor')
      ),
    async execute(interaction) {
      await interaction.deferReply({ ephemeral: true });

      const roles = await getOrCreateRoles(interaction.guild);
      const roleName = interaction.options.getSubcommand();
      const role = roles[roleName];

      if (!role) {
        return interaction.editReply(`Could not find ${roleName} role.`);
      }

      if (interaction.member.roles.has(role.id)) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`Removed ${roleName} role.`);
      } else {
        await interaction.member.roles.add(role);
        await interaction.editReply(`Added ${roleName} role.`);
      }
    }
  }
];

commands.forEach(cmd => {
  client.commands.set(cmd.data.name, cmd);
});

// ===== AUTOCOMPLETE =====

client.on('interactionCreate', async (interaction) => {
  if (interaction.isAutocomplete()) {
    const { name, options } = interaction;

    if (name === 'skill') {
      const focusedOption = options.getFocused(true);
      if (focusedOption.name === 'query') {
        const results = searchSkills(focusedOption.value)
          .map(s => ({ name: s.title, value: s.title }))
          .slice(0, 25);

        await interaction.respond(results);
      }
    }
  }
});

// ===== BUTTON INTERACTIONS =====

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'assign_volunteer') {
    if (!interaction.member.roles.cache.some(r => r.name === 'volunteer')) {
      return interaction.reply({
        content: 'Only volunteers can assign themselves. Use `/roles volunteer` to join.',
        ephemeral: true
      });
    }

    const threadId = interaction.channelId;
    if (await assignVolunteer(threadId, interaction.user.id, interaction.channel)) {
      await interaction.reply({
        content: 'You have been assigned to this support thread.',
        ephemeral: true
      });
    }
  } else if (interaction.customId === 'resolve_thread') {
    const threadId = interaction.channelId;
    const threadData = supportThreads.get(threadId);

    if (!threadData || threadData.assignedVolunteer !== interaction.user.id) {
      return interaction.reply({
        content: 'Only the assigned volunteer can resolve this thread.',
        ephemeral: true
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('resolve_modal')
      .setTitle('Resolve Support Thread')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('resolution_input')
            .setLabel('Resolution Summary')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'resolve_modal') {
    await interaction.deferReply({ ephemeral: true });

    const resolution = interaction.fields.getTextInputValue('resolution_input');
    const threadId = interaction.channelId;

    if (await resolveSupportThread(threadId, interaction.channel, resolution)) {
      await interaction.editReply('Thread resolved and archived.');
    } else {
      await interaction.editReply('Failed to resolve thread.');
    }
  }
});

// ===== SLASH COMMAND HANDLER =====

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error('Command error:', err);
    const reply = {
      content: 'An error occurred while executing this command.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// ===== READY EVENT =====

client.once('ready', () => {
  console.log(`✓ Claudient bot ready as ${client.user.tag}`);
  client.user.setActivity('Claudient skills | /help', { type: 'WATCHING' });
});

// ===== ERROR HANDLING =====

client.on('error', err => {
  console.error('Client error:', err);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
});

// ===== STARTUP =====

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Error: DISCORD_TOKEN not set in .env');
  process.exit(1);
}

client.login(token).catch(err => {
  console.error('Failed to login:', err);
  process.exit(1);
});

module.exports = client;
