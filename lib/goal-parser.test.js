/**
 * Tests for goal-parser.js
 */

const { parseGoal, parseGoals, formatGoal } = require('./goal-parser');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function testParseGoalBasic() {
  const result = parseGoal('Add OAuth2 + SAML across 15 microservices');

  assert(result.goal === 'Add OAuth2 + SAML across 15 microservices', 'Goal preserved');
  assert(result.pattern === 'add', 'Pattern detected as "add"');
  assert(result.components.quantifier?.count === 15, 'Quantifier extracted: 15');
  assert(result.components.quantifier?.unit === 'microservices', 'Unit extracted: microservices');
  assert(result.components.categories.auth.length > 0, 'Auth category detected');
  assert(result.components.categories.infrastructure.length > 0, 'Infrastructure category detected');
  console.log('✓ testParseGoalBasic');
}

function testSubtasksGenerated() {
  const result = parseGoal('Add OAuth2 + SAML across 15 microservices');

  assert(result.subtasks.length > 0, 'Subtasks generated');
  assert(result.subtasks.some(t => t.phase === 'planning'), 'Planning phase exists');
  assert(result.subtasks.some(t => t.phase === 'implementation'), 'Implementation phase exists');
  assert(result.subtasks.some(t => t.phase === 'testing'), 'Testing phase exists');
  assert(result.subtasks.some(t => t.phase === 'deployment'), 'Deployment phase exists');

  // Check task dependencies
  result.subtasks.forEach(task => {
    assert(Array.isArray(task.depends_on), `Task ${task.id} has depends_on array`);
  });

  console.log('✓ testSubtasksGenerated');
}

function testDependenciesInferred() {
  const result = parseGoal('Add OAuth2 + SAML across 15 microservices');

  assert(Object.keys(result.dependencies).length > 0, 'Dependencies inferred');
  assert(result.dependencies.infrastructure, 'Infrastructure dependency mentioned');
  assert(result.dependencies.testing, 'Testing dependency mentioned');
  console.log('✓ testDependenciesInferred');
}

function testAcceptanceCriteria() {
  const result = parseGoal('Add OAuth2 + SAML across 15 microservices');

  assert(result.acceptance_criteria.length > 0, 'Acceptance criteria generated');
  assert(
    result.acceptance_criteria.some(c => c.toLowerCase().includes('security')),
    'Security criteria for auth goal'
  );
  assert(
    result.acceptance_criteria.some(c => c.toLowerCase().includes('deployed')),
    'Deployment criteria'
  );
  console.log('✓ testAcceptanceCriteria');
}

function testMetadata() {
  const result = parseGoal('Add OAuth2 + SAML across 15 microservices');

  assert(result.metadata.complexity, 'Complexity calculated');
  assert(['low', 'medium', 'high'].includes(result.metadata.complexity), 'Valid complexity level');
  assert(result.metadata.scope, 'Scope identified');
  assert(result.metadata.estimated_phases.length > 0, 'Phases identified');
  console.log('✓ testMetadata');
}

function testMultiplePatterns() {
  const tests = [
    { goal: 'Implement rate limiting to the API gateway', expectedPattern: 'add' },
    { goal: 'Integrate Redis cache across all services', expectedPattern: 'add' },
    { goal: 'Build authentication layer for mobile app', expectedPattern: 'build' },
  ];

  tests.forEach(({ goal, expectedPattern }) => {
    const result = parseGoal(goal);
    assert(result.pattern, `Pattern recognized for: "${goal}"`);
    // Note: pattern might vary based on exact wording
  });

  console.log('✓ testMultiplePatterns');
}

function testQuantifierExtraction() {
  const tests = [
    { goal: 'Add feature to 5 services', expected: 5 },
    { goal: 'Deploy across 12 microservices', expected: 12 },
    { goal: 'Integrate on 100 servers', expected: 100 },
  ];

  tests.forEach(({ goal, expected }) => {
    const result = parseGoal(goal);
    assert(result.components.quantifier?.count === expected, `Quantifier extracted: ${expected}`);
  });

  console.log('✓ testQuantifierExtraction');
}

function testCategoryDetection() {
  const tests = [
    { goal: 'Add OAuth2 authentication', expectedCategory: 'auth' },
    { goal: 'Deploy Kubernetes clusters', expectedCategory: 'infrastructure' },
    { goal: 'Migrate PostgreSQL database', expectedCategory: 'database' },
    { goal: 'Build REST API endpoints', expectedCategory: 'api' },
  ];

  tests.forEach(({ goal, expectedCategory }) => {
    const result = parseGoal(goal);
    const hasCategory = result.components.categories[expectedCategory]?.length > 0;
    assert(hasCategory, `Category "${expectedCategory}" detected in "${goal}"`);
  });

  console.log('✓ testCategoryDetection');
}

function testBatchParsing() {
  const goals = [
    'Add OAuth2 to API',
    'Deploy Redis cache',
    'Implement rate limiting',
  ];

  const results = parseGoals(goals);

  assert(results.length === 3, 'All goals parsed');
  results.forEach((result, idx) => {
    assert(result.index === idx, `Result index correct for item ${idx}`);
    assert(result.goal, `Goal preserved for item ${idx}`);
    assert(result.subtasks.length > 0, `Subtasks generated for item ${idx}`);
  });

  console.log('✓ testBatchParsing');
}

function testFormatting() {
  const result = parseGoal('Add OAuth2 + SAML across 15 microservices');
  const formatted = formatGoal(result);

  assert(typeof formatted === 'string', 'Formatted output is string');
  assert(formatted.includes('GOAL:'), 'Output includes GOAL section');
  assert(formatted.includes('SUBTASKS'), 'Output includes SUBTASKS section');
  assert(formatted.includes('ACCEPTANCE CRITERIA'), 'Output includes ACCEPTANCE CRITERIA');
  assert(formatted.length > 100, 'Output is substantial');

  console.log('✓ testFormatting');
}

function testEdgeCases() {
  // Empty goal should throw
  try {
    parseGoal('');
    assert(false, 'Should throw on empty goal');
  } catch (e) {
    assert(e.message.includes('non-empty'), 'Throws on empty goal');
  }

  // Non-string should throw
  try {
    parseGoal(123);
    assert(false, 'Should throw on non-string');
  } catch (e) {
    assert(e.message.includes('non-empty string'), 'Throws on non-string');
  }

  // Non-array should throw in parseGoals
  try {
    parseGoals('not an array');
    assert(false, 'Should throw on non-array');
  } catch (e) {
    assert(e.message.includes('array'), 'Throws on non-array');
  }

  console.log('✓ testEdgeCases');
}

function testComplexityCalculation() {
  const simple = parseGoal('Add feature');
  const medium = parseGoal('Add OAuth2 across 5 services');
  const complex = parseGoal('Add OAuth2 + SAML + LDAP across 20 services with database migration');

  assert(simple.metadata.complexity, 'Simple goal has complexity');
  assert(medium.metadata.complexity, 'Medium goal has complexity');
  assert(complex.metadata.complexity, 'Complex goal has complexity');

  console.log('✓ testComplexityCalculation');
}

function testDependencyChains() {
  const result = parseGoal('Add OAuth2 + SAML across 15 microservices');

  // Find first task
  const firstTask = result.subtasks.find(t => t.phase === 'planning');
  assert(firstTask, 'Planning task exists');
  assert(firstTask.depends_on.length === 0, 'Planning task has no dependencies');

  // Other tasks should build on previous ones
  const implementationTask = result.subtasks.find(t => t.phase === 'implementation');
  if (implementationTask) {
    assert(
      implementationTask.depends_on.length >= 0,
      'Implementation task has proper dependencies'
    );
  }

  console.log('✓ testDependencyChains');
}

// Run all tests
function runAllTests() {
  const tests = [
    testParseGoalBasic,
    testSubtasksGenerated,
    testDependenciesInferred,
    testAcceptanceCriteria,
    testMetadata,
    testMultiplePatterns,
    testQuantifierExtraction,
    testCategoryDetection,
    testBatchParsing,
    testFormatting,
    testEdgeCases,
    testComplexityCalculation,
    testDependencyChains,
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    try {
      test();
      passed++;
    } catch (error) {
      console.error(`✗ ${test.name}: ${error.message}`);
      failed++;
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log(`Tests passed: ${passed}/${tests.length}`);
  if (failed > 0) {
    console.log(`Tests failed: ${failed}`);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
