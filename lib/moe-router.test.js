#!/usr/bin/env node

import assert from 'assert';
import MoeRouter, {
  classifyTask,
  routeByDomain,
  createCascadeRunner,
  createParallelPanel,
  budgetGovernedRouter,
  TIERS,
} from './moe-router.js';

console.log('Running MoE Router tests...\n');

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.error(`  ${err.message}\n`);
    failed++;
  }
};

// Test 1: Tier Router — Haiku classification
test('Tier Router: format task → Haiku', () => {
  const result = classifyTask('format the JSON file');
  assert.strictEqual(result.tier, TIERS.HAIKU);
  assert(result.confidence > 0.6);
});

// Test 2: Tier Router — Opus classification
test('Tier Router: security review → Opus', () => {
  const result = classifyTask('review the security audit and identify vulnerabilities');
  assert.strictEqual(result.tier, TIERS.OPUS);
  assert(result.confidence > 0.6);
});

// Test 3: Tier Router — Sonnet (default)
test('Tier Router: refactor code → Sonnet', () => {
  const result = classifyTask('refactor the authentication module');
  assert.strictEqual(result.tier, TIERS.SONNET);
  assert(result.confidence > 0.4);
});

// Test 4: Domain Router — security file
test('Domain Router: security file → Opus', () => {
  const result = routeByDomain(['src/security/auth.ts'], 'refactor');
  assert.strictEqual(result.tier, TIERS.OPUS);
  assert.strictEqual(result.domain, 'security');
});

// Test 5: Domain Router — documentation file
test('Domain Router: documentation → Haiku', () => {
  const result = routeByDomain(['README.md'], 'improve');
  assert.strictEqual(result.tier, TIERS.HAIKU);
  assert.strictEqual(result.domain, 'documentation');
});

// Test 6: Domain Router — data/ML file
test('Domain Router: Python data file → Sonnet', () => {
  const result = routeByDomain(['src/data/pipeline.py'], 'optimize');
  assert.strictEqual(result.tier, TIERS.SONNET);
  assert.strictEqual(result.domain, 'data/ml');
});

// Test 7: Budget Governor — critical budget
test('Budget Governor: critical budget (< 15%) → Haiku', () => {
  const governor = budgetGovernedRouter({ totalBudget: 100000 });
  const result = governor.route('any complex task', 10000);
  assert.strictEqual(result.tier, TIERS.HAIKU);
  assert(result.budgetRatio === '0.10');
});

// Test 8: Budget Governor — adequate budget for Opus
test('Budget Governor: good budget (60%) → allows Opus', () => {
  const governor = budgetGovernedRouter({ totalBudget: 100000 });
  const result = governor.route('design system architecture', 60000);
  assert.strictEqual(result.tier, TIERS.OPUS);
  assert(result.budgetRatio === '0.60');
});

// Test 9: Cascade Escalator — escalates low confidence
test('Cascade Escalator: escalates when confidence < threshold', async () => {
  const cascadeRunner = createCascadeRunner({ confidenceThreshold: 0.9 });
  const result = await cascadeRunner('simple format task', null);
  assert(result.escalations > 0);
  assert(result.selectedTier !== result.originalTier);
});

// Test 10: Parallel Panel — voting aggregation
test('Parallel Expert Panel: voting aggregation', async () => {
  const panel = createParallelPanel({ votingStrategy: 'majority' });
  const panelResults = await panel.run('classify this text', null);
  assert(Array.isArray(panelResults));
  assert(panelResults.length >= 3);
  const aggregated = panel.aggregate(panelResults);
  assert(aggregated.consensus);
  assert(aggregated.strategy === 'majority');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
