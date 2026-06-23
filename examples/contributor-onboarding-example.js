#!/usr/bin/env node

/**
 * Contributor Onboarding Integration Example
 *
 * Demonstrates how to integrate the contributor onboarding system into:
 * - Automated workflows
 * - GitHub Actions
 * - Discord bots
 * - Community platforms
 */

const { RewardsProcessor, ACHIEVEMENT_TIERS, SWAG_REWARDS } = require('../scripts/process-contributor-rewards.js');

const Colors = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bright: '\x1b[1m',
  reset: '\x1b[0m',
};

/**
 * Example 1: Automated PR Merge Workflow
 *
 * Triggered when a contributor PR is merged on GitHub
 */
async function example1_AutomatedPRMergeWorkflow() {
  console.log(`\n${Colors.bright}${Colors.cyan}Example 1: Automated PR Merge Workflow${Colors.reset}\n`);

  const processor = new RewardsProcessor();

  // Simulate GitHub webhook data
  const prData = {
    githubHandle: 'jane-contributor',
    prNumber: 1234,
    prTitle: 'Add database migration skill',
    type: 'skill',
    merged: true,
  };

  console.log(`Processing merged PR from @${prData.githubHandle}...`);

  const result = processor.processMergedPR(prData.githubHandle, prData.prNumber, {
    title: prData.prTitle,
    type: prData.type,
  });

  console.log(`${Colors.green}✓${Colors.reset} Contribution recorded`);
  console.log(`  Contributions: ${result.contributor.contributions}`);
  console.log(`  Tier: ${result.newTier}`);

  if (result.tierChanged) {
    console.log(`\n${Colors.yellow}🎉 Tier Promotion!${Colors.reset}`);
    const reward = SWAG_REWARDS[result.newTier];
    console.log(`${reward.name}`);
    console.log(`Rewards:\n${reward.items.map(item => `  • ${item}`).join('\n')}`);
  }
}

/**
 * Example 2: Discord Notification Bot
 *
 * Sends tier achievement announcements to Discord
 */
async function example2_DiscordNotificationBot() {
  console.log(`\n${Colors.bright}${Colors.cyan}Example 2: Discord Notification Bot${Colors.reset}\n`);

  const processor = new RewardsProcessor();

  // Simulate multiple contributions
  const contributors = [
    { handle: 'alice', count: 5 },
    { handle: 'bob', count: 15 },
    { handle: 'charlie', count: 30 },
  ];

  for (const contributor of contributors) {
    for (let i = 0; i < contributor.count; i++) {
      processor.processMergedPR(contributor.handle, 5000 + i, { type: 'skill' });
    }
  }

  console.log('Checking for new tier achievements...\n');

  const leaderboard = processor.getLeaderboard(100);
  const promotedContributors = leaderboard.filter(c => c.tier !== ACHIEVEMENT_TIERS.BRONZE);

  for (const contributor of promotedContributors) {
    const reward = SWAG_REWARDS[contributor.tier];

    // Format Discord message
    const discordMessage = formatDiscordAnnouncement(contributor, reward);
    console.log(discordMessage);
  }
}

function formatDiscordAnnouncement(contributor, reward) {
  return `
${Colors.yellow}🏆 ACHIEVEMENT UNLOCKED!${Colors.reset}
@${contributor.handle} reached ${reward.name}!

Contributions: ${contributor.contributions}
Tier: ${Colors.bright}${contributor.tier.toUpperCase()}${Colors.reset}

Rewards:
${reward.items.map(item => `• ${item}`).join('\n')}

Swag is on the way!
---`;
}

/**
 * Example 3: Mentor Assignment Workflow
 *
 * Automatically assign mentors to new contributors
 */
async function example3_MentorAssignmentWorkflow() {
  console.log(`\n${Colors.bright}${Colors.cyan}Example 3: Mentor Assignment Workflow${Colors.reset}\n`);

  const mentors = [
    {
      name: 'Alex Chen',
      expertise: ['skill-creator', 'agent-builder'],
      capacity: 5,
      currentCount: 2,
      bio: 'Core maintainer, 50+ skills built',
    },
    {
      name: 'Jordan Rodriguez',
      expertise: ['translator', 'documenter'],
      capacity: 8,
      currentCount: 3,
      bio: 'Documentation lead, fluent in 6 languages',
    },
    {
      name: 'Sam Patel',
      expertise: ['tester', 'reviewer'],
      capacity: 6,
      currentCount: 4,
      bio: 'QA specialist, rigorous PR reviewer',
    },
  ];

  const newContributor = {
    name: 'Dev Contributor',
    roles: ['skill-creator', 'documenter'],
  };

  console.log(`Finding mentor for ${newContributor.name}...\n`);

  // Find compatible mentors with available capacity
  const compatibleMentors = mentors.filter(m => {
    const hasExpertise = m.expertise.some(e => newContributor.roles.includes(e));
    const hasCapacity = m.currentCount < m.capacity;
    return hasExpertise && hasCapacity;
  });

  if (compatibleMentors.length > 0) {
    // Sort by current load (least busy first)
    const selectedMentor = compatibleMentors.sort(
      (a, b) => a.currentCount - b.currentCount
    )[0];

    console.log(`${Colors.green}✓${Colors.reset} Mentor assigned!`);
    console.log(`  Name: ${selectedMentor.name}`);
    console.log(`  Expertise: ${selectedMentor.expertise.join(', ')}`);
    console.log(`  Bio: ${selectedMentor.bio}`);
    console.log(`  Current Mentees: ${selectedMentor.currentCount}/${selectedMentor.capacity}`);
  } else {
    console.log(`${Colors.yellow}⚠${Colors.reset} No mentors available, adding to waitlist`);
  }
}

/**
 * Example 4: Monthly Leaderboard Report
 *
 * Generate community engagement metrics
 */
async function example4_MonthlyLeaderboardReport() {
  console.log(`\n${Colors.bright}${Colors.cyan}Example 4: Monthly Leaderboard Report${Colors.reset}\n`);

  const processor = new RewardsProcessor();

  // Simulate contributions for the month
  const simulatedContributions = [
    { handle: 'user1', prs: 8 },
    { handle: 'user2', prs: 5 },
    { handle: 'user3', prs: 12 },
    { handle: 'user4', prs: 3 },
    { handle: 'user5', prs: 15 },
  ];

  for (const contributor of simulatedContributions) {
    for (let i = 0; i < contributor.prs; i++) {
      processor.processMergedPR(
        contributor.handle,
        8000 + Math.random() * 1000,
        { type: ['skill', 'agent', 'guide'][Math.floor(Math.random() * 3)] }
      );
    }
  }

  const leaderboard = processor.getLeaderboard(10);
  const month = new Date().toISOString().slice(0, 7);

  console.log(`Leaderboard for ${month}\n`);
  console.log(
    `${'Rank'.padEnd(6)} ${'Contributor'.padEnd(20)} ${'Contributions'.padEnd(15)} ${'Tier'.padEnd(12)}`
  );
  console.log('─'.repeat(60));

  leaderboard.forEach((entry, idx) => {
    const tierColor =
      entry.tier === ACHIEVEMENT_TIERS.LEGEND
        ? Colors.yellow
        : entry.tier === ACHIEVEMENT_TIERS.PLATINUM
          ? Colors.cyan
          : Colors.green;

    console.log(
      `${String(idx + 1).padEnd(6)} ${entry.handle.padEnd(20)} ${String(entry.contributions).padEnd(15)} ${tierColor}${entry.tier}${Colors.reset}`
    );
  });
}

/**
 * Example 5: Reward Fulfillment Tracking
 *
 * Manage swag order and shipping
 */
async function example5_RewardFulfillmentTracking() {
  console.log(`\n${Colors.bright}${Colors.cyan}Example 5: Reward Fulfillment Tracking${Colors.reset}\n`);

  const processor = new RewardsProcessor();

  // Create some contributors with rewards
  for (let i = 0; i < 5; i++) {
    processor.processMergedPR(`user${i}`, 9000 + i, { type: 'skill' });
  }

  // Get pending rewards
  const pending = processor.getPendingRewards();

  console.log(`Pending Fulfillments: ${pending.length}\n`);

  pending.forEach(item => {
    console.log(`${Colors.yellow}→${Colors.reset} @${item.handle}`);
    item.rewards.forEach(reward => {
      console.log(`  Status: ${reward.status}`);
      console.log(`  Items: ${reward.items.slice(0, 3).join(', ')}...`);

      // Simulate fulfillment
      const trackingNumber = `TRACK${Math.random().toString(36).substring(7).toUpperCase()}`;
      processor.fulfillReward(item.handle, reward.timestamp, trackingNumber);
      console.log(`  ${Colors.green}✓ Fulfilled (${trackingNumber})${Colors.reset}\n`);
    });
  });
}

/**
 * Example 6: Contributor Onboarding Journey
 *
 * Complete walkthrough of a new contributor's journey
 */
async function example6_ContributorOnboardingJourney() {
  console.log(`\n${Colors.bright}${Colors.cyan}Example 6: Complete Contributor Journey${Colors.reset}\n`);

  const processor = new RewardsProcessor();
  const contributorJourney = {
    handle: 'newcontributor',
    name: 'Sarah Developer',
    email: 'sarah@example.com',
    roles: ['skill-creator', 'documenter'],
  };

  console.log(`Welcome, ${contributorJourney.name}!`);
  console.log(`Roles: ${contributorJourney.roles.join(', ')}\n`);

  // Month 1: First contributions
  console.log(`${Colors.bright}Month 1: Getting Started${Colors.reset}`);
  for (let i = 0; i < 3; i++) {
    const result = processor.processMergedPR(contributorJourney.handle, 10000 + i, {
      type: i % 2 === 0 ? 'skill' : 'guide',
    });
    console.log(`  ${Colors.green}✓${Colors.reset} PR #${10000 + i} merged (${result.contributor.contributions} total)`);
  }

  // Month 2: More contributions
  console.log(`\n${Colors.bright}Month 2: Building Momentum${Colors.reset}`);
  for (let i = 3; i < 7; i++) {
    const result = processor.processMergedPR(contributorJourney.handle, 10000 + i, {
      type: i % 2 === 0 ? 'skill' : 'guide',
    });
    if (result.tierChanged) {
      console.log(
        `  ${Colors.yellow}🎉 Tier Up!${Colors.reset} ${SWAG_REWARDS[result.newTier].name} (${result.contributor.contributions} contributions)`
      );
    } else {
      console.log(`  ${Colors.green}✓${Colors.reset} PR #${10000 + i} merged (${result.contributor.contributions} total)`);
    }
  }

  // Check final status
  const finalStats = processor.getContributorStats(contributorJourney.handle);
  console.log(`\n${Colors.bright}Contributor Status${Colors.reset}`);
  console.log(`  Total Contributions: ${finalStats.contributions}`);
  console.log(`  Current Tier: ${finalStats.tier}`);
  console.log(`  Skills: ${finalStats.stats.skills} | Guides: ${finalStats.stats.guides}`);
  console.log(`  Rewards Earned: ${finalStats.rewards.length}`);
}

/**
 * Run Examples
 */
async function runExamples() {
  try {
    await example1_AutomatedPRMergeWorkflow();
    await example2_DiscordNotificationBot();
    await example3_MentorAssignmentWorkflow();
    await example4_MonthlyLeaderboardReport();
    await example5_RewardFulfillmentTracking();
    await example6_ContributorOnboardingJourney();

    console.log(`\n${Colors.bright}${Colors.cyan}All examples completed!${Colors.reset}\n`);
  } catch (error) {
    console.error('Error running examples:', error);
    process.exit(1);
  }
}

runExamples();
