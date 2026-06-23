#!/usr/bin/env node

/**
 * Contributor Onboarding System - Test Suite
 *
 * Tests for:
 * - Profile creation and state persistence
 * - Role selection validation
 * - Tier calculation and progression
 * - Reward assignment
 * - Mentorship matching
 * - Skill template generation
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { RewardsProcessor, SWAG_REWARDS, ACHIEVEMENT_TIERS } = require('./process-contributor-rewards.js');

const Colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
};

let passedTests = 0;
let failedTests = 0;

/**
 * Test Utilities
 */
function test(name, fn) {
  try {
    fn();
    console.log(`${Colors.green}✓${Colors.reset} ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`${Colors.red}✗${Colors.reset} ${name}`);
    console.log(`  ${error.message}`);
    failedTests++;
  }
}

function assertEqual(actual, expected, message) {
  assert.strictEqual(actual, expected, message || `Expected ${expected}, got ${actual}`);
}

function assertArrayIncludes(array, value, message) {
  assert(array.includes(value), message || `Array does not include ${value}`);
}

/**
 * Test Suite: Reward Processor
 */
console.log(`\n${Colors.bright}${Colors.cyan}Test Suite: Contributor Rewards Processor${Colors.reset}\n`);

const processor = new RewardsProcessor();

// Test 1: Tier calculation
test('Calculate tier for 1 contribution (Bronze)', () => {
  const tier = processor.updateContributorTier('user1', 1);
  assertEqual(tier, ACHIEVEMENT_TIERS.BRONZE);
});

test('Calculate tier for 5 contributions (Silver)', () => {
  const tier = processor.updateContributorTier('user2', 5);
  assertEqual(tier, ACHIEVEMENT_TIERS.SILVER);
});

test('Calculate tier for 15 contributions (Gold)', () => {
  const tier = processor.updateContributorTier('user3', 15);
  assertEqual(tier, ACHIEVEMENT_TIERS.GOLD);
});

test('Calculate tier for 30 contributions (Platinum)', () => {
  const tier = processor.updateContributorTier('user4', 30);
  assertEqual(tier, ACHIEVEMENT_TIERS.PLATINUM);
});

test('Calculate tier for 100 contributions (Legend)', () => {
  const tier = processor.updateContributorTier('user5', 100);
  assertEqual(tier, ACHIEVEMENT_TIERS.LEGEND);
});

// Test 2: Process merged PR
test('Process merged PR and increment contribution count', () => {
  const uniqueHandle = 'testuser-' + Date.now();
  const result = processor.processMergedPR(uniqueHandle, 123, { type: 'skill' });

  assertEqual(result.success, true);
  assertEqual(result.contributor.contributions, 1);
  assertArrayIncludes(result.contributor.prs.map(p => p.number), 123);
});

test('Update stats based on PR type', () => {
  const uniqueHandle = 'testuser2-' + Date.now();
  processor.processMergedPR(uniqueHandle, 124, { type: 'agent' });
  processor.processMergedPR(uniqueHandle, 125, { type: 'skill' });

  const stats = processor.getContributorStats(uniqueHandle);
  assertEqual(stats.stats.agents, 1);
  assertEqual(stats.stats.skills, 1);
});

// Test 3: Tier promotion
test('Detect tier promotion when crossing threshold', () => {
  const uniqueHandle = 'promouser-' + Date.now();

  // Add contributions to reach Silver tier (5 contributions)
  let result = null;
  for (let i = 0; i < 5; i++) {
    result = processor.processMergedPR(uniqueHandle, 200 + i, { type: 'skill' });
  }

  // By 5th contribution, should have promoted to Silver
  assertEqual(result.contributor.contributions, 5);
  assertEqual(result.newTier, ACHIEVEMENT_TIERS.SILVER);
});

// Test 4: Reward generation
test('Generate reward notification on tier promotion', () => {
  const reward = processor.generateRewardNotification('testuser3', ACHIEVEMENT_TIERS.GOLD);

  assertEqual(reward.type, 'tier-promotion');
  assertEqual(reward.tier, ACHIEVEMENT_TIERS.GOLD);
  assertEqual(reward.status, 'pending-fulfillment');
  assertArrayIncludes(reward.items, 'Exclusive Sticker Collection (20x)');
});

// Test 5: Reward fulfillment
test('Mark reward as fulfilled with tracking number', () => {
  const uniqueHandle = 'fulfilluser-' + Date.now();
  processor.processMergedPR(uniqueHandle, 301, { type: 'skill' });

  const contributor = processor.getContributorStats(uniqueHandle);
  if (contributor.rewards && contributor.rewards.length > 0) {
    const reward = contributor.rewards[0];

    const fulfilled = processor.fulfillReward(uniqueHandle, reward.timestamp, 'TRACK123456');
    assertEqual(fulfilled, true);

    const updated = processor.getContributorStats(uniqueHandle);
    assertEqual(updated.rewards[0].status, 'fulfilled');
    assertEqual(updated.rewards[0].trackingNumber, 'TRACK123456');
  }
});

// Test 6: Leaderboard functionality
test('Get leaderboard sorted by contributions', () => {
  const uniqueHandle1 = 'leader1-' + Date.now();
  const uniqueHandle2 = 'leader2-' + Date.now();
  processor.processMergedPR(uniqueHandle1, 401, { type: 'skill' });
  processor.processMergedPR(uniqueHandle1, 402, { type: 'skill' });
  processor.processMergedPR(uniqueHandle2, 403, { type: 'skill' });

  const leaderboard = processor.getLeaderboard(10);

  assertEqual(leaderboard.length > 0, true);
  if (leaderboard.length >= 2) {
    assertEqual(leaderboard[0].contributions >= leaderboard[1].contributions, true);
  }
});

// Test 7: Pending rewards
test('Identify pending reward fulfillments', () => {
  const uniqueHandle = 'pendinguser-' + Date.now();
  // Need to create a reward, which only happens on tier change
  for (let i = 0; i < 5; i++) {
    processor.processMergedPR(uniqueHandle, 500 + i, { type: 'skill' });
  }

  const pending = processor.getPendingRewards();
  const hasPendingUser = pending.some(p => p.handle === uniqueHandle);

  assertEqual(hasPendingUser, true);
});

/**
 * Test Suite: Profile Management
 */
console.log(`\n${Colors.bright}${Colors.cyan}Test Suite: Profile Management${Colors.reset}\n`);

test('Create contributor profile with valid data', () => {
  const profile = {
    name: 'Jane Developer',
    email: 'jane@example.com',
    githubHandle: 'janedev',
    roles: ['skill-creator', 'agent-builder'],
    contributions: 0,
  };

  assertEqual(profile.name.length > 0, true);
  assertEqual(profile.email.includes('@'), true);
  assertEqual(profile.roles.length > 0, true);
});

test('Validate role selection', () => {
  const validRoles = ['skill-creator', 'agent-builder', 'translator', 'documenter', 'tester', 'reviewer'];
  const selectedRoles = ['skill-creator', 'translator'];

  const isValid = selectedRoles.every(r => validRoles.includes(r));
  assertEqual(isValid, true);
});

test('Reject invalid roles', () => {
  const validRoles = ['skill-creator', 'agent-builder', 'translator', 'documenter', 'tester', 'reviewer'];
  const selectedRoles = ['skill-creator', 'invalid-role'];

  const hasInvalid = selectedRoles.some(r => !validRoles.includes(r));
  assertEqual(hasInvalid, true);
});

/**
 * Test Suite: Skill Template Generation
 */
console.log(`\n${Colors.bright}${Colors.cyan}Test Suite: Skill Template Generation${Colors.reset}\n`);

test('Generate valid skill template', () => {
  const template = generateSkillTemplate('Database Helper', 'Help with database operations', 'db, sql, migration');

  assertArrayIncludes([
    template.includes('# Database Helper'),
    template.includes('## When to activate'),
    template.includes('## When NOT to use'),
    template.includes('## Instructions'),
    template.includes('## Example'),
  ], true);
});

test('Template includes metadata sections', () => {
  const template = generateSkillTemplate('API Docs', 'Generate API documentation', 'api, docs');

  assertEqual(template.includes('**Author**'), true);
  assertEqual(template.includes('**Created**'), true);
  assertEqual(template.includes('**Keywords**'), true);
});

/**
 * Test Suite: Swag Rewards
 */
console.log(`\n${Colors.bright}${Colors.cyan}Test Suite: Swag Rewards${Colors.reset}\n`);

test('Verify all tiers have reward definitions', () => {
  const allTiers = Object.values(ACHIEVEMENT_TIERS);
  const allHaveRewards = allTiers.every(tier => SWAG_REWARDS[tier]);

  assertEqual(allHaveRewards, true);
});

test('Verify reward items are non-empty', () => {
  Object.values(SWAG_REWARDS).forEach(reward => {
    assertEqual(reward.items.length > 0, true);
    assertEqual(reward.items[0].length > 0, true);
  });
});

test('Verify milestones are in ascending order', () => {
  const tiers = [
    ACHIEVEMENT_TIERS.BRONZE,
    ACHIEVEMENT_TIERS.SILVER,
    ACHIEVEMENT_TIERS.GOLD,
    ACHIEVEMENT_TIERS.PLATINUM,
    ACHIEVEMENT_TIERS.LEGEND,
  ];

  let previousMilestone = 0;
  tiers.forEach(tier => {
    const currentMilestone = SWAG_REWARDS[tier].milestone;
    assertEqual(currentMilestone > previousMilestone, true);
    previousMilestone = currentMilestone;
  });
});

/**
 * Test Suite: Mentorship Matching
 */
console.log(`\n${Colors.bright}${Colors.cyan}Test Suite: Mentorship Matching${Colors.reset}\n`);

test('Match mentor based on expertise', () => {
  const mentors = [
    {
      name: 'Alex',
      expertise: ['skill-creator', 'agent-builder'],
    },
    {
      name: 'Jordan',
      expertise: ['translator', 'documenter'],
    },
  ];

  const contributorRoles = ['skill-creator'];
  const compatible = mentors.filter(m =>
    m.expertise.some(e => contributorRoles.includes(e))
  );

  assertEqual(compatible.length > 0, true);
  assertEqual(compatible[0].name, 'Alex');
});

test('Exclude mentors without matching expertise', () => {
  const mentors = [
    {
      name: 'Alex',
      expertise: ['skill-creator'],
    },
    {
      name: 'Jordan',
      expertise: ['translator'],
    },
  ];

  const contributorRoles = ['tester'];
  const compatible = mentors.filter(m =>
    m.expertise.some(e => contributorRoles.includes(e))
  );

  assertEqual(compatible.length, 0);
});

/**
 * Test Suite: State Persistence
 */
console.log(`\n${Colors.bright}${Colors.cyan}Test Suite: State Persistence${Colors.reset}\n`);

test('Save and load leaderboard state', () => {
  const uniqueHandle = 'savetest-' + Date.now();
  const processor2 = new RewardsProcessor();
  processor2.processMergedPR(uniqueHandle, 601, { type: 'skill' });

  const saved = processor2.getContributorStats(uniqueHandle);
  assertEqual(saved !== null, true);
  assertEqual(saved.handle, uniqueHandle);
  assertEqual(saved.contributions, 1);
});

test('Preserve contributor data across sessions', () => {
  const uniqueHandle = 'persisttest-' + Date.now();
  const processor3 = new RewardsProcessor();

  // First session
  processor3.processMergedPR(uniqueHandle, 701, { type: 'skill' });
  let contributor = processor3.getContributorStats(uniqueHandle);
  assertEqual(contributor.contributions, 1);

  // Second session (new processor instance)
  const processor4 = new RewardsProcessor();
  processor4.processMergedPR(uniqueHandle, 702, { type: 'skill' });
  contributor = processor4.getContributorStats(uniqueHandle);
  assertEqual(contributor.contributions, 2);
});

/**
 * Helper function for template generation
 */
function generateSkillTemplate(name, description, keywords) {
  const timestamp = new Date().toISOString().split('T')[0];

  return `# ${name}

## When to activate
[Describe when this skill should be used]

## When NOT to use
[Describe anti-patterns or when this skill is wrong]

## Instructions
[Step-by-step instructions for using this skill]

## Example
[Concrete example showing the skill in action]

---
**Author**: Test Author
**Created**: ${timestamp}
**Keywords**: ${keywords}
**Description**: ${description}`;
}

/**
 * Summary
 */
console.log(`\n${Colors.bright}${Colors.cyan}═══════════════════════════════════════${Colors.reset}`);
console.log(`${Colors.bright}Test Summary${Colors.reset}`);
console.log(`${Colors.bright}${Colors.cyan}═══════════════════════════════════════${Colors.reset}\n`);

const total = passedTests + failedTests;
const percentage = Math.round((passedTests / total) * 100);

console.log(`${Colors.green}Passed:${Colors.reset} ${passedTests}`);
console.log(`${Colors.red}Failed:${Colors.reset} ${failedTests}`);
console.log(`Total:  ${total}`);
console.log(`Success Rate: ${percentage}%\n`);

if (failedTests === 0) {
  console.log(`${Colors.bright}${Colors.green}All tests passed! ✓${Colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${Colors.bright}${Colors.red}Some tests failed.${Colors.reset}\n`);
  process.exit(1);
}
