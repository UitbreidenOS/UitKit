/**
 * Real-world examples of goal-parser usage
 * Copy-paste ready code snippets
 */

const { parseGoal, formatGoal, parseGoals } = require('./goal-parser');

// ============================================================================
// EXAMPLE 1: Parse a complex multi-service authentication goal
// ============================================================================
function exampleAuthGoal() {
  console.log('\n=== Example 1: OAuth2 Rollout ===\n');

  const goal = parseGoal('Add OAuth2 + SAML across 15 microservices');

  console.log(`Goal: ${goal.goal}`);
  console.log(`Complexity: ${goal.metadata.complexity}`);
  console.log(`Estimated timeline: ${goal.metadata.estimated_phases.join(' → ')}`);
  console.log(`Affected systems: ${goal.metadata.scope}`);

  console.log('\nSubtasks by phase:');
  const phases = {};
  goal.subtasks.forEach(task => {
    if (!phases[task.phase]) phases[task.phase] = [];
    phases[task.phase].push(task);
  });

  Object.entries(phases).forEach(([phase, tasks]) => {
    console.log(`\n  ${phase.toUpperCase()}:`);
    tasks.forEach(task => {
      console.log(`    • ${task.title}`);
    });
  });

  console.log('\nCritical dependencies:');
  Object.entries(goal.dependencies).forEach(([key, value]) => {
    console.log(`  • ${key}: ${value}`);
  });
}

// ============================================================================
// EXAMPLE 2: Extract work items for team distribution
// ============================================================================
function exampleDistributeWork() {
  console.log('\n=== Example 2: Extract Subtasks for Assignment ===\n');

  const goal = parseGoal('Integrate Redis cache across all services');
  const subtasks = goal.subtasks;

  // Group by phase for different teams
  const teamAssignments = {
    architects: [],
    engineers: [],
    qa: [],
    devops: [],
  };

  subtasks.forEach(task => {
    if (task.phase === 'planning') {
      teamAssignments.architects.push(task);
    } else if (task.phase === 'implementation') {
      teamAssignments.engineers.push(task);
    } else if (task.phase === 'testing') {
      teamAssignments.qa.push(task);
    } else if (task.phase === 'deployment') {
      teamAssignments.devops.push(task);
    }
  });

  Object.entries(teamAssignments).forEach(([team, tasks]) => {
    if (tasks.length > 0) {
      console.log(`${team.toUpperCase()}:`);
      tasks.forEach(task => {
        console.log(`  ☐ ${task.title}`);
      });
    }
  });
}

// ============================================================================
// EXAMPLE 3: Generate requirements checklist
// ============================================================================
function exampleGenerateChecklist() {
  console.log('\n=== Example 3: Acceptance Criteria Checklist ===\n');

  const goal = parseGoal('Add JWT authentication to 12 backend services');

  console.log(`Project: ${goal.goal}\n`);
  console.log('Acceptance Criteria Checklist:\n');

  goal.acceptance_criteria.forEach((criterion, idx) => {
    console.log(`  [ ] ${idx + 1}. ${criterion}`);
  });

  console.log(`\nTotal items: ${goal.acceptance_criteria.length}`);
}

// ============================================================================
// EXAMPLE 4: Identify critical path
// ============================================================================
function exampleCriticalPath() {
  console.log('\n=== Example 4: Critical Path Analysis ===\n');

  const goal = parseGoal('Deploy Kubernetes across 5 staging clusters');

  // Build dependency graph
  const graph = {};
  goal.subtasks.forEach(task => {
    graph[task.id] = {
      title: task.title,
      duration: 1, // assume 1 unit each
      dependencies: task.depends_on,
    };
  });

  console.log('Critical Path:');

  function findCriticalPath(taskId, visited = new Set()) {
    if (visited.has(taskId)) return 0;
    visited.add(taskId);

    const task = graph[taskId];
    if (!task) return 0;

    if (task.dependencies.length === 0) {
      return task.duration;
    }

    const maxDepPath = Math.max(
      ...task.dependencies.map(depId => findCriticalPath(depId, new Set(visited)))
    );

    return maxDepPath + task.duration;
  }

  const criticalLength = Math.max(...goal.subtasks.map(t => findCriticalPath(t.id)));

  console.log(`Minimum project duration: ${criticalLength} phases`);
  console.log('\nPhase breakdown:');

  goal.metadata.estimated_phases.forEach((phase, idx) => {
    console.log(`  ${idx + 1}. ${phase}`);
  });
}

// ============================================================================
// EXAMPLE 5: Batch parse multiple initiatives
// ============================================================================
function exampleBatchParsing() {
  console.log('\n=== Example 5: Portfolio Prioritization ===\n');

  const initiatives = [
    'Add OAuth2 + SAML across 15 microservices',
    'Implement rate limiting on API gateway',
    'Migrate database to PostgreSQL across 3 regions',
    'Deploy monitoring stack to 20 services',
  ];

  const results = parseGoals(initiatives);

  // Sort by complexity
  const sorted = results.sort((a, b) => {
    const complexityOrder = { low: 0, medium: 1, high: 2 };
    return complexityOrder[b.metadata.complexity] - complexityOrder[a.metadata.complexity];
  });

  console.log('Portfolio Summary (sorted by complexity):\n');

  sorted.forEach((result, idx) => {
    console.log(
      `${idx + 1}. [${result.metadata.complexity.toUpperCase()}] ${result.goal}`
    );
    console.log(`   Phases: ${result.metadata.estimated_phases.join(' → ')}`);
    console.log(`   Tasks: ${result.subtasks.length} | Criteria: ${result.acceptance_criteria.length}\n`);
  });
}

// ============================================================================
// EXAMPLE 6: Risk assessment
// ============================================================================
function exampleRiskAssessment() {
  console.log('\n=== Example 6: Risk Assessment ===\n');

  const goal = parseGoal('Add OAuth2 + SAML across 15 microservices');

  console.log(`Goal: ${goal.goal}\n`);

  console.log('Risk Factors:');

  // High complexity = high risk
  if (goal.metadata.complexity === 'high') {
    console.log('  ⚠️  HIGH: Project has many interdependent phases');
  }

  // Large scope = coordination risk
  if (goal.components.quantifier?.count > 10) {
    console.log(`  ⚠️  MEDIUM: Scope affects ${goal.components.quantifier.count} components`);
  }

  // Auth changes = security risk
  if (goal.components.categories.auth) {
    console.log('  ⚠️  HIGH: Security-critical changes require rigorous testing');
  }

  // Multi-phase = timeline risk
  if (goal.metadata.estimated_phases.length > 4) {
    console.log(`  ⚠️  MEDIUM: ${goal.metadata.estimated_phases.length} phases needed for full rollout`);
  }

  console.log('\nMitigation strategies:');
  console.log('  • Schedule phased rollout with canary deployments');
  console.log('  • Allocate time for security audits and testing');
  console.log('  • Document rollback procedures');
  console.log('  • Set up monitoring and alerting before rollout');
}

// ============================================================================
// EXAMPLE 7: Create a Markdown project template
// ============================================================================
function exampleMarkdownTemplate() {
  console.log('\n=== Example 7: Auto-Generated Markdown Template ===\n');

  const goal = parseGoal('Implement rate limiting to the API gateway');

  const markdown = `# ${goal.goal}

## Overview

**Complexity:** ${goal.metadata.complexity}
**Scope:** ${goal.metadata.scope}
**Estimated Duration:** ${goal.metadata.estimated_phases.join(' → ')}

## Phases

${goal.metadata.estimated_phases
  .map(
    (phase, idx) =>
      `### ${idx + 1}. ${phase.charAt(0).toUpperCase() + phase.slice(1)}`
  )
  .join('\n\n')}

## Subtasks

${goal.subtasks
  .map(
    task =>
      `- [ ] **${task.title}** (${task.phase})\n  - ${task.description}`
  )
  .join('\n\n')}

## Dependencies

${Object.entries(goal.dependencies)
  .map(([dep, desc]) => `- **${dep}**: ${desc}`)
  .join('\n')}

## Acceptance Criteria

${goal.acceptance_criteria.map((criterion, idx) => `${idx + 1}. [ ] ${criterion}`).join('\n')}
`;

  console.log(markdown);
}

// ============================================================================
// EXAMPLE 8: Extract metrics and KPIs
// ============================================================================
function exampleMetricsExtraction() {
  console.log('\n=== Example 8: Project Metrics ===\n');

  const goal = parseGoal('Add OAuth2 + SAML across 15 microservices');

  const metrics = {
    totalTasks: goal.subtasks.length,
    totalCriteria: goal.acceptance_criteria.length,
    phases: goal.metadata.estimated_phases.length,
    affectedSystems: goal.components.quantifier?.count || 1,
    categories: Object.keys(goal.components.categories).length,
  };

  console.log(`Project: ${goal.goal}`);
  console.log(`\nMetrics:`);
  console.log(`  Tasks: ${metrics.totalTasks}`);
  console.log(`  Phases: ${metrics.phases}`);
  console.log(`  Acceptance Criteria: ${metrics.totalCriteria}`);
  console.log(`  Affected Systems: ${metrics.affectedSystems}`);
  console.log(`  Domains: ${metrics.categories}`);

  // Calculate task distribution
  const tasksByPhase = {};
  goal.subtasks.forEach(task => {
    tasksByPhase[task.phase] = (tasksByPhase[task.phase] || 0) + 1;
  });

  console.log(`\nTask Distribution by Phase:`);
  Object.entries(tasksByPhase).forEach(([phase, count]) => {
    const bar = '█'.repeat(count);
    console.log(`  ${phase.padEnd(15)} ${bar} ${count}`);
  });
}

// ============================================================================
// Run all examples
// ============================================================================
function runAllExamples() {
  exampleAuthGoal();
  exampleDistributeWork();
  exampleGenerateChecklist();
  exampleCriticalPath();
  exampleBatchParsing();
  exampleRiskAssessment();
  exampleMarkdownTemplate();
  exampleMetricsExtraction();
}

// Export for use as module
module.exports = {
  exampleAuthGoal,
  exampleDistributeWork,
  exampleGenerateChecklist,
  exampleCriticalPath,
  exampleBatchParsing,
  exampleRiskAssessment,
  exampleMarkdownTemplate,
  exampleMetricsExtraction,
};

// Run all examples if executed directly
if (require.main === module) {
  runAllExamples();
}
