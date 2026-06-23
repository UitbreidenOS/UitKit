#!/usr/bin/env node

/**
 * Contributor Rewards Processor
 *
 * Processes contribution events and updates contributor tiers/swag rewards.
 * Integrates with GitHub Actions for automated reward distribution.
 *
 * Usage:
 *   node scripts/process-contributor-rewards.js --github-handle janedev --pr-number 1234 --merged true
 *   node scripts/process-contributor-rewards.js --generate-report --month 2026-06
 */

const fs = require('fs');
const path = require('path');

const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gradientPink: '\x1b[38;2;236;72;153m',
};

const ACHIEVEMENT_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  LEGEND: 'legend',
};

const TIER_MILESTONES = {
  [ACHIEVEMENT_TIERS.BRONZE]: 1,
  [ACHIEVEMENT_TIERS.SILVER]: 5,
  [ACHIEVEMENT_TIERS.GOLD]: 15,
  [ACHIEVEMENT_TIERS.PLATINUM]: 30,
  [ACHIEVEMENT_TIERS.LEGEND]: 100,
};

const SWAG_REWARDS = {
  [ACHIEVEMENT_TIERS.BRONZE]: {
    name: 'Bronze Badge',
    items: ['Claudient Sticker Pack (5x)', 'Digital Certificate'],
    milestone: 1,
  },
  [ACHIEVEMENT_TIERS.SILVER]: {
    name: 'Silver Badge + Swag',
    items: ['Premium Sticker Set (10x)', 't-shirt (s/m/l/xl/xxl)', 'Digital Badge'],
    milestone: 5,
  },
  [ACHIEVEMENT_TIERS.GOLD]: {
    name: 'Gold Badge + Premium Swag',
    items: ['Exclusive Sticker Collection (20x)', 'Limited Edition t-shirt', 'Embroidered Cap', 'Digital Badge'],
    milestone: 15,
  },
  [ACHIEVEMENT_TIERS.PLATINUM]: {
    name: 'Platinum Badge + Collector Edition',
    items: ['Collector Sticker Set (50x)', 'Signature Series t-shirt', 'Hoodie', 'Pin Badge', 'Digital Badge'],
    milestone: 30,
  },
  [ACHIEVEMENT_TIERS.LEGEND]: {
    name: 'Legend Status + Exclusive Perks',
    items: ['All Previous Items', 'Limited Edition Jacket', 'Custom Badge', 'Mention in README', 'Special Discord Role'],
    milestone: 100,
  },
};

class RewardsProcessor {
  constructor() {
    this.contributorDir = path.join(process.cwd(), '.claude', 'contributors');
    this.leaderboardFile = path.join(this.contributorDir, 'leaderboard.json');
    this.reportsDir = path.join(this.contributorDir, 'reports');

    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.contributorDir)) {
      fs.mkdirSync(this.contributorDir, { recursive: true });
    }
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Update contributor tier based on contribution count
   */
  updateContributorTier(githubHandle, contributionCount) {
    let newTier = ACHIEVEMENT_TIERS.BRONZE;

    if (contributionCount >= TIER_MILESTONES[ACHIEVEMENT_TIERS.LEGEND]) {
      newTier = ACHIEVEMENT_TIERS.LEGEND;
    } else if (contributionCount >= TIER_MILESTONES[ACHIEVEMENT_TIERS.PLATINUM]) {
      newTier = ACHIEVEMENT_TIERS.PLATINUM;
    } else if (contributionCount >= TIER_MILESTONES[ACHIEVEMENT_TIERS.GOLD]) {
      newTier = ACHIEVEMENT_TIERS.GOLD;
    } else if (contributionCount >= TIER_MILESTONES[ACHIEVEMENT_TIERS.SILVER]) {
      newTier = ACHIEVEMENT_TIERS.SILVER;
    }

    return newTier;
  }

  /**
   * Process merged PR and update leaderboard
   */
  processMergedPR(githubHandle, prNumber, prDetails = {}) {
    const leaderboard = this.loadLeaderboard();
    const contributor = leaderboard[githubHandle] || {
      handle: githubHandle,
      contributions: 0,
      prs: [],
      tier: ACHIEVEMENT_TIERS.BRONZE,
      joinDate: new Date().toISOString(),
      rewards: [],
      lastUpdate: null,
      stats: {
        skills: 0,
        agents: 0,
        translations: 0,
        guides: 0,
        tests: 0,
        reviews: 0,
      },
    };

    // Update contribution count
    contributor.contributions += 1;

    // Update tier
    const previousTier = contributor.tier;
    contributor.tier = this.updateContributorTier(githubHandle, contributor.contributions);

    // Track PR
    contributor.prs.push({
      number: prNumber,
      mergedAt: new Date().toISOString(),
      title: prDetails.title || 'PR Title',
      type: prDetails.type || 'unknown',
      labels: prDetails.labels || [],
    });

    // Update stats based on PR type
    if (prDetails.type === 'skill') contributor.stats.skills += 1;
    else if (prDetails.type === 'agent') contributor.stats.agents += 1;
    else if (prDetails.type === 'translation') contributor.stats.translations += 1;
    else if (prDetails.type === 'guide') contributor.stats.guides += 1;
    else if (prDetails.type === 'test') contributor.stats.tests += 1;
    else if (prDetails.type === 'review') contributor.stats.reviews += 1;

    // Check if tier changed and new reward should be sent
    if (previousTier !== contributor.tier) {
      const reward = this.generateRewardNotification(githubHandle, contributor.tier);
      contributor.rewards.push(reward);
      this.logTierPromotion(githubHandle, previousTier, contributor.tier, contributor.contributions);
    }

    contributor.lastUpdate = new Date().toISOString();

    // Save updated leaderboard
    leaderboard[githubHandle] = contributor;
    this.saveLeaderboard(leaderboard);

    return {
      success: true,
      contributor: contributor,
      tierChanged: previousTier !== contributor.tier,
      newTier: contributor.tier,
      reward: contributor.tier !== previousTier ? SWAG_REWARDS[contributor.tier] : null,
    };
  }

  /**
   * Generate reward notification
   */
  generateRewardNotification(githubHandle, tier) {
    const reward = SWAG_REWARDS[tier];
    return {
      type: 'tier-promotion',
      tier: tier,
      githubHandle: githubHandle,
      timestamp: new Date().toISOString(),
      items: reward.items,
      message: `Congratulations! You've reached ${reward.name}!`,
      status: 'pending-fulfillment',
      fulfillmentDate: null,
      trackingNumber: null,
    };
  }

  /**
   * Log tier promotions for analytics
   */
  logTierPromotion(githubHandle, oldTier, newTier, totalContributions) {
    const logFile = path.join(this.reportsDir, 'tier-promotions.jsonl');
    const promotion = {
      timestamp: new Date().toISOString(),
      githubHandle,
      oldTier,
      newTier,
      totalContributions,
    };

    fs.appendFileSync(logFile, JSON.stringify(promotion) + '\n');
  }

  /**
   * Load leaderboard
   */
  loadLeaderboard() {
    if (!fs.existsSync(this.leaderboardFile)) {
      return {};
    }
    try {
      return JSON.parse(fs.readFileSync(this.leaderboardFile, 'utf8'));
    } catch (e) {
      console.error(`${Colors.red}Failed to load leaderboard${Colors.reset}`);
      return {};
    }
  }

  /**
   * Save leaderboard
   */
  saveLeaderboard(leaderboard) {
    fs.writeFileSync(this.leaderboardFile, JSON.stringify(leaderboard, null, 2));
  }

  /**
   * Generate monthly report
   */
  generateMonthlyReport(month) {
    const leaderboard = this.loadLeaderboard();
    const [year, monthStr] = month.split('-');
    const monthDate = new Date(`${year}-${monthStr}-01`);

    const report = {
      period: month,
      generatedAt: new Date().toISOString(),
      summary: {
        totalContributors: Object.keys(leaderboard).length,
        totalContributions: Object.values(leaderboard).reduce((sum, c) => sum + c.contributions, 0),
        tierDistribution: {},
        newContributors: [],
        tierPromotions: [],
        topContributors: [],
      },
      details: {},
    };

    // Calculate tier distribution
    Object.values(ACHIEVEMENT_TIERS).forEach(tier => {
      report.summary.tierDistribution[tier] = 0;
    });

    // Process contributors
    Object.entries(leaderboard).forEach(([handle, contributor]) => {
      report.summary.tierDistribution[contributor.tier]++;

      // Check if joined this month
      const joinDate = new Date(contributor.joinDate);
      if (
        joinDate.getFullYear() === parseInt(year) &&
        joinDate.getMonth() === parseInt(monthStr) - 1
      ) {
        report.summary.newContributors.push(handle);
      }

      // Check for tier promotions this month
      const promotions = contributor.rewards.filter(r => {
        const rewardDate = new Date(r.timestamp);
        return (
          rewardDate.getFullYear() === parseInt(year) &&
          rewardDate.getMonth() === parseInt(monthStr) - 1
        );
      });

      if (promotions.length > 0) {
        report.summary.tierPromotions.push({
          handle,
          promotions,
        });
      }

      report.details[handle] = {
        tier: contributor.tier,
        contributions: contributor.contributions,
        stats: contributor.stats,
        joinDate: contributor.joinDate,
      };
    });

    // Top contributors (by contribution count)
    report.summary.topContributors = Object.entries(leaderboard)
      .sort(([, a], [, b]) => b.contributions - a.contributions)
      .slice(0, 10)
      .map(([handle, data]) => ({
        handle,
        contributions: data.contributions,
        tier: data.tier,
      }));

    // Save report
    const reportFile = path.join(this.reportsDir, `report-${month}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    return report;
  }

  /**
   * Get contributor stats
   */
  getContributorStats(githubHandle) {
    const leaderboard = this.loadLeaderboard();
    return leaderboard[githubHandle] || null;
  }

  /**
   * Get leaderboard (top N contributors)
   */
  getLeaderboard(limit = 50) {
    const leaderboard = this.loadLeaderboard();
    return Object.entries(leaderboard)
      .sort(([, a], [, b]) => b.contributions - a.contributions)
      .slice(0, limit)
      .map(([handle, data]) => ({
        handle,
        contributions: data.contributions,
        tier: data.tier,
        stats: data.stats,
        joinDate: data.joinDate,
      }));
  }

  /**
   * Get pending rewards for fulfillment
   */
  getPendingRewards() {
    const leaderboard = this.loadLeaderboard();
    const pending = [];

    Object.entries(leaderboard).forEach(([handle, contributor]) => {
      const unfulfilled = contributor.rewards.filter(r => r.status === 'pending-fulfillment');
      if (unfulfilled.length > 0) {
        pending.push({
          handle,
          rewards: unfulfilled,
        });
      }
    });

    return pending;
  }

  /**
   * Mark reward as fulfilled
   */
  fulfillReward(githubHandle, rewardTimestamp, trackingNumber) {
    const leaderboard = this.loadLeaderboard();
    const contributor = leaderboard[githubHandle];

    if (!contributor) return false;

    const reward = contributor.rewards.find(r => r.timestamp === rewardTimestamp);
    if (reward) {
      reward.status = 'fulfilled';
      reward.fulfillmentDate = new Date().toISOString();
      reward.trackingNumber = trackingNumber;
      this.saveLeaderboard(leaderboard);
      return true;
    }

    return false;
  }

  /**
   * Print formatted output
   */
  printLeaderboard() {
    console.log(`\n${Colors.bright}${Colors.cyan}Contributor Leaderboard${Colors.reset}\n`);

    const leaderboard = this.getLeaderboard();

    console.log(`${Colors.cyan}Rank${Colors.reset} ${'Handle'.padEnd(20)} ${'Tier'.padEnd(12)} ${'Contributions'.padEnd(15)} Stats`);
    console.log('─'.repeat(80));

    leaderboard.forEach((entry, idx) => {
      const statsStr = `Skills: ${entry.stats.skills} | Agents: ${entry.stats.agents} | Guides: ${entry.stats.guides}`;
      console.log(
        `${String(idx + 1).padEnd(5)} ${entry.handle.padEnd(20)} ${entry.tier.padEnd(12)} ${String(entry.contributions).padEnd(15)} ${statsStr}`
      );
    });

    console.log();
  }

  /**
   * Print tier distribution
   */
  printTierDistribution() {
    const leaderboard = this.loadLeaderboard();
    const distribution = {};

    Object.values(ACHIEVEMENT_TIERS).forEach(tier => {
      distribution[tier] = 0;
    });

    Object.values(leaderboard).forEach(contributor => {
      distribution[contributor.tier]++;
    });

    console.log(`\n${Colors.bright}${Colors.cyan}Contributor Distribution by Tier${Colors.reset}\n`);

    Object.entries(distribution).forEach(([tier, count]) => {
      const bar = '█'.repeat(count);
      console.log(`${tier.padEnd(12)} ${bar} ${count}`);
    });

    console.log();
  }
}

/**
 * CLI Interface
 */
async function main() {
  const processor = new RewardsProcessor();
  const args = process.argv.slice(2);

  // Process merged PR
  if (args.includes('--github-handle')) {
    const handleIdx = args.indexOf('--github-handle');
    const prNumberIdx = args.indexOf('--pr-number');
    const mergedIdx = args.indexOf('--merged');

    if (handleIdx >= 0 && prNumberIdx >= 0) {
      const handle = args[handleIdx + 1];
      const prNumber = parseInt(args[prNumberIdx + 1]);
      const merged = args[mergedIdx + 1] === 'true';

      if (merged) {
        const typeIdx = args.indexOf('--type');
        const type = typeIdx >= 0 ? args[typeIdx + 1] : 'unknown';

        const result = processor.processMergedPR(handle, prNumber, { type });

        console.log(`${Colors.green}✓${Colors.reset} PR processed for ${handle}`);
        console.log(`  Contributions: ${result.contributor.contributions}`);
        console.log(`  Tier: ${result.newTier}`);

        if (result.tierChanged) {
          console.log(`\n${Colors.bright}${Colors.gradientPink}🏆 Tier Promotion!${Colors.reset}`);
          console.log(`${SWAG_REWARDS[result.newTier].name}`);
          console.log(`Rewards: ${SWAG_REWARDS[result.newTier].items.join(', ')}`);
        }
      }
    }
  }

  // Generate monthly report
  if (args.includes('--generate-report')) {
    const monthIdx = args.indexOf('--month');
    const month = monthIdx >= 0 ? args[monthIdx + 1] : new Date().toISOString().slice(0, 7);

    const report = processor.generateMonthlyReport(month);
    console.log(`${Colors.green}✓${Colors.reset} Report generated for ${month}`);
    console.log(JSON.stringify(report.summary, null, 2));
  }

  // Show leaderboard
  if (args.includes('--leaderboard')) {
    processor.printLeaderboard();
  }

  // Show tier distribution
  if (args.includes('--distribution')) {
    processor.printTierDistribution();
  }

  // Show pending rewards
  if (args.includes('--pending-rewards')) {
    const pending = processor.getPendingRewards();
    console.log(`\n${Colors.bright}${Colors.yellow}Pending Reward Fulfillments${Colors.reset}\n`);
    console.log(JSON.stringify(pending, null, 2));
  }

  // Show contributor stats
  if (args.includes('--stats')) {
    const handleIdx = args.indexOf('--stats');
    const handle = args[handleIdx + 1];

    if (handle) {
      const stats = processor.getContributorStats(handle);
      if (stats) {
        console.log(`\n${Colors.bright}${Colors.cyan}${handle}${Colors.reset}\n`);
        console.log(JSON.stringify(stats, null, 2));
      } else {
        console.log(`${Colors.red}Contributor not found: ${handle}${Colors.reset}`);
      }
    }
  }
}

main().catch(error => {
  console.error(`${Colors.red}Error:${Colors.reset}`, error.message);
  process.exit(1);
});

module.exports = { RewardsProcessor, SWAG_REWARDS, ACHIEVEMENT_TIERS };
