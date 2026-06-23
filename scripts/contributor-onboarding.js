#!/usr/bin/env node

/**
 * Contributor Onboarding System
 *
 * Guided workflow for new Claudient contributors:
 * - Fork repository walkthrough
 * - Create first skill tutorial
 * - Submit PR guidance
 * - Merge preparation
 * - Mentorship matching with senior contributors
 * - Gamification with swag rewards (stickers, t-shirts, limited edition badges)
 * - Progress tracking and achievements
 *
 * Usage: node scripts/contributor-onboarding.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Gradients
  gradientPurple: '\x1b[38;2;147;51;234m',
  gradientPink: '\x1b[38;2;236;72;153m',
  gradientCyan: '\x1b[38;2;34;211;238m',
  success: '\x1b[38;2;34;197;94m',
  warning: '\x1b[38;2;251;146;60m',
};

const CONTRIBUTOR_ROLES = {
  SKILL_CREATOR: 'skill-creator',
  AGENT_BUILDER: 'agent-builder',
  TRANSLATOR: 'translator',
  DOCUMENTER: 'documenter',
  TESTER: 'tester',
  REVIEWER: 'reviewer',
};

const ACHIEVEMENT_TIERS = {
  BRONZE: 'bronze',      // First contribution
  SILVER: 'silver',      // 5 contributions
  GOLD: 'gold',          // 15 contributions
  PLATINUM: 'platinum',  // 30+ contributions
  LEGEND: 'legend',      // Maintainer status
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let contributorProfile = {
  name: '',
  email: '',
  githubHandle: '',
  roles: [],
  firstContributionDate: null,
  contributions: [],
  achievements: [],
  mentor: null,
  tier: ACHIEVEMENT_TIERS.BRONZE,
  progressData: {},
};

/**
 * State Management
 */
const stateFile = path.join(process.cwd(), '.claude/contributor-state.json');

function loadContributorState() {
  if (fs.existsSync(stateFile)) {
    try {
      return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    } catch (e) {
      console.error(`${Colors.red}Failed to load contributor state${Colors.reset}`);
    }
  }
  return contributorProfile;
}

function saveContributorState() {
  const dir = path.dirname(stateFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(stateFile, JSON.stringify(contributorProfile, null, 2));
}

/**
 * UI Components
 */
function clearScreen() {
  console.clear();
}

function printHeader(title) {
  console.log(`\n${Colors.bright}${Colors.gradientPurple}╔═══════════════════════════════════════════════════════╗${Colors.reset}`);
  console.log(`${Colors.bright}${Colors.gradientPurple}║${Colors.reset}  ${Colors.bright}${title.padEnd(51)}${Colors.reset}  ${Colors.bright}${Colors.gradientPurple}║${Colors.reset}`);
  console.log(`${Colors.bright}${Colors.gradientPurple}╚═══════════════════════════════════════════════════════╝${Colors.reset}\n`);
}

function printSection(title) {
  console.log(`\n${Colors.cyan}${Colors.bright}→ ${title}${Colors.reset}\n`);
}

function printSuccess(message) {
  console.log(`${Colors.success}✓${Colors.reset} ${message}`);
}

function printWarning(message) {
  console.log(`${Colors.warning}⚠${Colors.reset} ${message}`);
}

function printInfo(message) {
  console.log(`${Colors.cyan}ℹ${Colors.reset} ${message}`);
}

function printMilestone(message) {
  console.log(`\n${Colors.bright}${Colors.gradientPink}🏆 ${message}${Colors.reset}\n`);
}

/**
 * Async prompt wrapper
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(`${Colors.cyan}?${Colors.reset} ${question}: `, resolve);
  });
}

function promptYesNo(question) {
  return new Promise((resolve) => {
    rl.question(`${Colors.cyan}?${Colors.reset} ${question} (y/n): `, (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Stage 1: Welcome & Onboarding
 */
async function stageWelcome() {
  clearScreen();
  printHeader('Welcome to Claudient Contributors!');

  console.log(`${Colors.bright}We're excited to have you join our community!${Colors.reset}`);
  console.log(`\nThis onboarding guide will help you:`);
  console.log(`  • Set up your development environment`);
  console.log(`  • Create your first contribution`);
  console.log(`  • Connect with mentors`);
  console.log(`  • Earn exclusive swag rewards\n`);

  const isReturning = fs.existsSync(stateFile);
  if (isReturning) {
    const existing = loadContributorState();
    const continueWithExisting = await promptYesNo(`Welcome back, ${existing.name}! Continue where you left off?`);
    if (continueWithExisting) {
      contributorProfile = existing;
      return 'returning';
    }
  }

  return 'new';
}

/**
 * Stage 2: Profile Creation
 */
async function stageProfileSetup() {
  clearScreen();
  printHeader('Create Your Contributor Profile');

  printInfo('We\'ll use this info to track contributions and match mentors');

  const name = await prompt('Your name');
  const email = await prompt('Email address');
  const githubHandle = await prompt('GitHub username (without @)');

  contributorProfile.name = name;
  contributorProfile.email = email;
  contributorProfile.githubHandle = githubHandle;
  contributorProfile.firstContributionDate = new Date().toISOString();

  printSuccess(`Profile created for ${name}!`);
  saveContributorState();
}

/**
 * Stage 3: Role Selection
 */
async function stageRoleSelection() {
  clearScreen();
  printHeader('Choose Your Contribution Path(s)');

  console.log('You can contribute in multiple ways:\n');

  const roleDescriptions = {
    [CONTRIBUTOR_ROLES.SKILL_CREATOR]: 'Create reusable skills and commands for Claude Code',
    [CONTRIBUTOR_ROLES.AGENT_BUILDER]: 'Build specialized agents for specific domains',
    [CONTRIBUTOR_ROLES.TRANSLATOR]: 'Translate skills and guides to French, German, Dutch, Spanish',
    [CONTRIBUTOR_ROLES.DOCUMENTER]: 'Write guides, examples, and technical documentation',
    [CONTRIBUTOR_ROLES.TESTER]: 'Test features, write tests, report bugs',
    [CONTRIBUTOR_ROLES.REVIEWER]: 'Review PRs and provide technical feedback',
  };

  let idx = 1;
  for (const [role, desc] of Object.entries(roleDescriptions)) {
    console.log(`${Colors.cyan}${idx}.${Colors.reset} ${Colors.bright}${role}${Colors.reset}`);
    console.log(`   ${desc}\n`);
    idx++;
  }

  const selection = await prompt('Enter role numbers (comma-separated, e.g., 1,3,5)');
  const indices = selection.split(',').map(s => parseInt(s.trim()) - 1);
  const roles = Object.keys(roleDescriptions);

  contributorProfile.roles = indices
    .filter(i => i >= 0 && i < roles.length)
    .map(i => roles[i]);

  console.log(`\n${Colors.success}Selected:${Colors.reset} ${contributorProfile.roles.join(', ')}\n`);
  saveContributorState();
}

/**
 * Stage 4: Fork & Setup Guide
 */
async function stageForkSetup() {
  clearScreen();
  printHeader('Step 1: Fork the Repository');

  printInfo('You need to create your own copy of the Claudient repository.');

  console.log(`\n${Colors.bright}Manual Fork Steps:${Colors.reset}`);
  console.log(`1. Go to: ${Colors.cyan}https://github.com/Claudient/Claudient${Colors.reset}`);
  console.log(`2. Click the ${Colors.bright}"Fork"${Colors.reset} button (top-right)`);
  console.log(`3. Select your account as the destination`);
  console.log(`4. Wait for the fork to complete\n`);

  const forked = await promptYesNo('Have you completed the fork?');

  if (!forked) {
    printWarning('Please fork the repository and come back when done.');
    return false;
  }

  console.log('\n${Colors.bright}Clone Your Fork:${Colors.reset}');
  const localPath = await prompt('Where should we clone your fork? (e.g., ~/projects/Claudient)');

  try {
    console.log(`\n${Colors.dim}Cloning...${Colors.reset}`);
    const cloneCmd = `git clone https://github.com/${contributorProfile.githubHandle}/Claudient.git "${localPath}"`;
    execSync(cloneCmd, { stdio: 'inherit' });
    printSuccess(`Repository cloned to ${localPath}`);

    process.chdir(localPath);

    // Add upstream remote
    console.log(`\n${Colors.dim}Adding upstream remote...${Colors.reset}`);
    execSync('git remote add upstream https://github.com/Claudient/Claudient.git');
    printSuccess('Upstream remote added');

  } catch (error) {
    printWarning(`Clone failed. Please clone manually and try again.`);
    return false;
  }

  return true;
}

/**
 * Stage 5: Create First Skill
 */
async function stageCreateSkill() {
  clearScreen();
  printHeader('Create Your First Skill');

  if (!contributorProfile.roles.includes(CONTRIBUTOR_ROLES.SKILL_CREATOR)) {
    printInfo('Skipping skill creation (not in your selected roles)');
    return true;
  }

  printSection('Skill Creation Walkthrough');

  console.log(`${Colors.bright}A skill is a reusable command or workflow.${Colors.reset}\n`);
  console.log('Examples:');
  console.log('  • Database migration helper');
  console.log('  • API documentation generator');
  console.log('  • Security audit tool\n');

  const skillName = await prompt('What will your skill do?');
  const skillDescription = await prompt('Brief description (1-2 sentences)');
  const skillKeywords = await prompt('Keywords (comma-separated, e.g., api, docs, helper)');

  // Generate skill file
  const skillFileName = skillName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') + '.md';

  const skillContent = generateSkillTemplate(skillName, skillDescription, skillKeywords);
  const skillPath = path.join(process.cwd(), 'skills', skillFileName);

  // Ensure skills directory exists
  fs.mkdirSync(path.dirname(skillPath), { recursive: true });
  fs.writeFileSync(skillPath, skillContent);

  printSuccess(`Skill template created at: skills/${skillFileName}`);
  printInfo('Open this file and fill in the Instructions and Examples sections');

  contributorProfile.contributions.push({
    type: 'skill',
    name: skillName,
    file: skillPath,
    status: 'draft',
    date: new Date().toISOString(),
  });

  saveContributorState();
  return true;
}

/**
 * Stage 6: PR Submission Guide
 */
async function stageSubmitPR() {
  clearScreen();
  printHeader('Prepare Your Pull Request');

  printSection('Pre-submission Checklist');

  const checklist = [
    { item: 'Commit your changes with clear messages', done: false },
    { item: 'Push to your fork', done: false },
    { item: 'Create PR from your fork to main repo', done: false },
    { item: 'Add PR title and description', done: false },
    { item: 'Link any related issues', done: false },
  ];

  for (const item of checklist) {
    const response = await promptYesNo(`${item.item}?`);
    if (response) {
      printSuccess(item.item);
    } else {
      printWarning(`Please complete: ${item.item}`);
    }
  }

  console.log(`\n${Colors.bright}PR Template:${Colors.reset}\n`);

  const prTemplate = `## Description
[What does this PR do?]

## Type of Change
- [ ] New skill
- [ ] New agent
- [ ] Bug fix
- [ ] Documentation
- [ ] Translation

## Testing
[How was this tested?]

## Contributor Info
- Name: ${contributorProfile.name}
- Role: ${contributorProfile.roles.join(', ')}
- First contribution: ${new Date(contributorProfile.firstContributionDate).toLocaleDateString()}

## Checklist
- [ ] I have read the CONTRIBUTING.md
- [ ] My code follows the style guidelines
- [ ] I have added/updated relevant documentation
- [ ] I have added tests if applicable
- [ ] My changes don't break existing functionality`;

  console.log(prTemplate);

  const prUrl = await prompt('\nPaste your PR URL (github.com/Claudient/Claudient/pull/XXX)');

  if (prUrl.includes('github.com')) {
    printSuccess(`PR submitted: ${prUrl}`);
    contributorProfile.contributions[contributorProfile.contributions.length - 1].prUrl = prUrl;
    contributorProfile.contributions[contributorProfile.contributions.length - 1].status = 'submitted';
  }

  saveContributorState();
}

/**
 * Stage 7: Mentorship Matching
 */
async function stageMentorMatch() {
  clearScreen();
  printHeader('Mentorship Matching');

  const mentors = [
    {
      name: 'Alex Chen',
      expertise: ['skill-creator', 'agent-builder'],
      contributions: 127,
      badge: 'Legend',
      bio: 'Core maintainer, 50+ skills built',
    },
    {
      name: 'Jordan Rodriguez',
      expertise: ['translator', 'documenter'],
      contributions: 45,
      badge: 'Gold',
      bio: 'Documentation lead, fluent in 6 languages',
    },
    {
      name: 'Sam Patel',
      expertise: ['tester', 'reviewer'],
      contributions: 38,
      badge: 'Gold',
      bio: 'QA specialist, rigorous PR reviewer',
    },
    {
      name: 'Taylor Kim',
      expertise: ['agent-builder', 'skill-creator'],
      contributions: 92,
      badge: 'Platinum',
      bio: 'AI specialist, expert in agent design',
    },
  ];

  console.log('${Colors.bright}We can match you with an experienced mentor!${Colors.reset}\n');

  // Find compatible mentors
  const compatibleMentors = mentors.filter(m =>
    m.expertise.some(e => contributorProfile.roles.includes(e))
  );

  console.log(`${Colors.cyan}Available mentors for your role(s):${Colors.reset}\n`);

  compatibleMentors.forEach((mentor, idx) => {
    console.log(`${Colors.yellow}${idx + 1}.${Colors.reset} ${Colors.bright}${mentor.name}${Colors.reset} (${mentor.badge})`);
    console.log(`   ${mentor.bio}`);
    console.log(`   Expertise: ${mentor.expertise.join(', ')}`);
    console.log(`   Contributions: ${mentor.contributions}\n`);
  });

  const mentorChoice = await prompt(`Select a mentor (1-${compatibleMentors.length}) or press Enter to skip`);

  if (mentorChoice && !isNaN(mentorChoice)) {
    const selectedMentor = compatibleMentors[parseInt(mentorChoice) - 1];
    if (selectedMentor) {
      contributorProfile.mentor = selectedMentor.name;
      printMilestone(`${selectedMentor.name} is now your mentor!`);
      console.log(`They'll help guide your contributions and answer questions.\n`);
    }
  }

  saveContributorState();
}

/**
 * Stage 8: Achievements & Rewards
 */
async function stageAchievements() {
  clearScreen();
  printHeader('Track Your Progress & Rewards');

  const currentTier = calculateTier(contributorProfile.contributions.length);

  console.log(`${Colors.bright}Contribution Milestone Progress:${Colors.reset}\n`);

  Object.entries(ACHIEVEMENT_TIERS).forEach((tier) => {
    const tierData = SWAG_REWARDS[tier[0]];
    const progress = contributorProfile.contributions.length;
    const percentage = Math.min(100, (progress / tierData.milestone) * 100);

    const barLength = 20;
    const filled = Math.round((barLength * percentage) / 100);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    const marker = currentTier === tier[0] ? Colors.gradientPink + '→' + Colors.reset : ' ';
    console.log(`${marker} ${Colors.bright}${tierData.name}${Colors.reset} (${tierData.milestone} contributions)`);
    console.log(`   [${bar}] ${progress}/${tierData.milestone}`);
    console.log(`   Rewards: ${tierData.items.join(', ')}\n`);
  });

  if (currentTier !== ACHIEVEMENT_TIERS.BRONZE) {
    printMilestone(`You've reached ${SWAG_REWARDS[currentTier].name}!`);
    console.log('Your swag will be shipped soon:');
    SWAG_REWARDS[currentTier].items.forEach(item => {
      printSuccess(item);
    });
    console.log();
  }

  contributorProfile.tier = currentTier;
  saveContributorState();
}

/**
 * Helper Functions
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
**Author**: ${contributorProfile.name}
**Created**: ${timestamp}
**Keywords**: ${keywords}
**Description**: ${description}`;
}

function calculateTier(contributionCount) {
  if (contributionCount >= 100) return ACHIEVEMENT_TIERS.LEGEND;
  if (contributionCount >= 30) return ACHIEVEMENT_TIERS.PLATINUM;
  if (contributionCount >= 15) return ACHIEVEMENT_TIERS.GOLD;
  if (contributionCount >= 5) return ACHIEVEMENT_TIERS.SILVER;
  return ACHIEVEMENT_TIERS.BRONZE;
}

/**
 * Main Flow
 */
async function runOnboarding() {
  try {
    // Load existing state if returning
    if (fs.existsSync(stateFile)) {
      contributorProfile = loadContributorState();
    }

    const mode = await stageWelcome();

    if (mode === 'new') {
      await stageProfileSetup();
      await stageRoleSelection();
    }

    // Main workflow
    clearScreen();
    printHeader(`Welcome, ${contributorProfile.name}!`);

    let currentStep = 0;
    const steps = [
      { name: 'Fork Repository', fn: stageForkSetup },
      { name: 'Create Skill', fn: stageCreateSkill },
      { name: 'Submit PR', fn: stageSubmitPR },
      { name: 'Find Mentor', fn: stageMentorMatch },
      { name: 'View Progress', fn: stageAchievements },
    ];

    console.log('${Colors.bright}Onboarding Steps:${Colors.reset}\n');
    steps.forEach((step, idx) => {
      const status = idx < currentStep ? '✓' : idx === currentStep ? '→' : ' ';
      console.log(`${Colors.cyan}${status}${Colors.reset} ${idx + 1}. ${step.name}`);
    });

    const stepChoice = await prompt('\nEnter step number or "exit" to quit');

    if (stepChoice.toLowerCase() === 'exit') {
      printInfo('Progress saved. Come back anytime to continue!');
      rl.close();
      return;
    }

    const chosenStep = parseInt(stepChoice) - 1;
    if (chosenStep >= 0 && chosenStep < steps.length) {
      await steps[chosenStep].fn();

      // Offer next step
      const continueOnboarding = await promptYesNo('\nContinue to next step?');
      if (continueOnboarding && chosenStep < steps.length - 1) {
        await steps[chosenStep + 1].fn();
      }
    }

    printSuccess('Onboarding session complete! Progress saved.');
    rl.close();

  } catch (error) {
    console.error(`${Colors.red}Error during onboarding:${Colors.reset}`, error.message);
    rl.close();
    process.exit(1);
  }
}

// Run onboarding
runOnboarding();
