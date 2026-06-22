/**
 * NLP Goal Parser - Breaks down complex engineering goals into structured subtasks
 * Input: "Add OAuth2 + SAML across 15 microservices"
 * Output: { goal, subtasks: [...], dependencies: {...}, acceptance_criteria: [...] }
 */

const PATTERNS = {
  // "Add X to Y" / "Add X across Y"
  add: /^(?:add|implement|integrate|enable)\s+([^,]+?)\s+(?:to|across|on|in)\s+(.+)$/i,
  // "Implement Z across N services"
  distribute: /^(?:implement|deploy|integrate|add)\s+([^,]+?)\s+across\s+(\d+)\s+([^.]+?)(?:\.|$)/i,
  // "Integrate A and B"
  integrate: /^(?:integrate|combine|merge|add)\s+([^.]+?)\s+(?:and|with)\s+([^.]+?)(?:\s+(?:to|across|in|on)\s+(.+))?$/i,
  // "Build X for Y"
  build: /^(?:build|create|develop|implement)\s+([^,]+?)\s+for\s+(.+)$/i,
  // "Setup X with Y"
  setup: /^(?:setup|configure|install|enable)\s+([^,]+?)\s+with\s+(.+)$/i,
};

const KEYWORDS = {
  auth: ['oauth2', 'oauth', 'saml', 'ldap', 'oidc', 'jwt', 'mfa', '2fa', 'authentication', 'auth'],
  infrastructure: ['microservice', 'service', 'container', 'deployment', 'server', 'cluster', 'node', 'instance'],
  database: ['database', 'db', 'sql', 'postgres', 'mysql', 'mongodb', 'cache', 'redis'],
  api: ['api', 'endpoint', 'rest', 'graphql', 'grpc', 'websocket'],
  testing: ['test', 'unit test', 'integration test', 'e2e', 'qa', 'validation'],
  documentation: ['doc', 'documentation', 'readme', 'guide', 'wiki'],
  deployment: ['deploy', 'release', 'rollout', 'stage', 'production'],
};

/**
 * Extract quantifiers (numbers of services/components affected)
 */
function extractQuantifier(text) {
  const match = text.match(/(\d+)\s+([a-z]+)/i);
  if (match) {
    return { count: parseInt(match[1]), unit: match[2] };
  }
  return null;
}

/**
 * Identify keywords and categorize parts of the goal
 */
function categorizeKeywords(text) {
  const lower = text.toLowerCase();
  const categories = {};

  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    categories[category] = keywords.filter(kw => lower.includes(kw));
  }

  return Object.fromEntries(
    Object.entries(categories).filter(([_, v]) => v.length > 0)
  );
}

/**
 * Infer dependencies based on keywords and patterns
 */
function inferDependencies(goal, categories, quantifier) {
  const deps = {};

  // Auth implementation typically needs:
  if (categories.auth) {
    deps.infrastructure = 'Must establish/identify target services first';
    deps.database = 'May need user/credential storage';
    deps.api = 'Auth layer typically sits between API gateway and services';
    deps.testing = 'Security testing required post-implementation';
  }

  // Database changes need infrastructure setup
  if (categories.database && categories.infrastructure) {
    deps.infrastructure = 'Services must be ready before database changes';
  }

  // Distribution across N services requires infrastructure
  if (quantifier && quantifier.count > 1) {
    deps.infrastructure = `Affects ${quantifier.count} ${quantifier.unit}`;
    deps.testing = 'Integration testing across all units required';
    deps.deployment = 'Coordinated rollout strategy needed';
  }

  return deps;
}

/**
 * Generate subtasks based on goal structure
 */
function generateSubtasks(goal, categories, quantifier) {
  const subtasks = [];
  let order = 1;

  // Phase 1: Planning & Architecture
  if (categories.auth || categories.infrastructure) {
    subtasks.push({
      id: `task-${order++}`,
      phase: 'planning',
      title: 'Architecture & Design Review',
      description: 'Document architecture, security requirements, and integration points',
      priority: 'high',
      depends_on: [],
    });
  }

  // Phase 2: Core Implementation
  if (categories.auth) {
    subtasks.push({
      id: `task-${order++}`,
      phase: 'implementation',
      title: 'Implement Authentication/Authorization',
      description: 'Add auth provider integration and credential management',
      priority: 'high',
      depends_on: ['task-1'],
    });
  }

  if (categories.api) {
    subtasks.push({
      id: `task-${order++}`,
      phase: 'implementation',
      title: 'Update API Endpoints',
      description: 'Add auth enforcement to API routes',
      priority: 'high',
      depends_on: [`task-${order - 2}`],
    });
  }

  if (categories.database) {
    subtasks.push({
      id: `task-${order++}`,
      phase: 'implementation',
      title: 'Database Schema Updates',
      description: 'Add tables/fields for new feature',
      priority: 'high',
      depends_on: ['task-1'],
    });
  }

  // Phase 3: Distribution (if quantifier exists)
  if (quantifier && quantifier.count > 1) {
    subtasks.push({
      id: `task-${order++}`,
      phase: 'rollout',
      title: `Rollout across ${quantifier.count} ${quantifier.unit}`,
      description: `Systematically apply changes to all ${quantifier.count} instances`,
      priority: 'high',
      depends_on: subtasks.slice(0, -1).map(t => t.id),
    });
  }

  // Phase 4: Testing
  subtasks.push({
    id: `task-${order++}`,
    phase: 'testing',
    title: 'Security & Integration Testing',
    description: 'Unit, integration, and security testing across all affected components',
    priority: 'high',
    depends_on: subtasks.slice(0, -1).map(t => t.id),
  });

  // Phase 5: Documentation
  if (categories.documentation) {
    subtasks.push({
      id: `task-${order++}`,
      phase: 'documentation',
      title: 'Update Documentation',
      description: 'Document changes, deployment procedures, and usage guides',
      priority: 'medium',
      depends_on: [`task-${order - 2}`],
    });
  }

  // Phase 6: Deployment
  subtasks.push({
    id: `task-${order++}`,
    phase: 'deployment',
    title: 'Staged Deployment & Monitoring',
    description: 'Deploy to staging, validate, then production rollout',
    priority: 'high',
    depends_on: [`task-${order - 2}`],
  });

  return subtasks;
}

/**
 * Generate acceptance criteria based on goal content
 */
function generateAcceptanceCriteria(goal, categories, quantifier) {
  const criteria = [];

  // Common criteria
  criteria.push('All code changes peer-reviewed and approved');
  criteria.push('Automated tests pass (unit + integration)');

  // Auth-specific
  if (categories.auth) {
    criteria.push('Authentication mechanism verified working');
    criteria.push('Authorization policies enforced across all endpoints');
    criteria.push('Security audit completed and signed off');
    criteria.push('No unauthorized access vulnerabilities found');
  }

  // Database-specific
  if (categories.database) {
    criteria.push('Database migrations tested and reversible');
    criteria.push('Data integrity verified post-migration');
  }

  // API-specific
  if (categories.api) {
    criteria.push('All API endpoints tested and documented');
    criteria.push('Client compatibility confirmed');
  }

  // Distribution-specific
  if (quantifier && quantifier.count > 1) {
    criteria.push(`Deployed successfully to all ${quantifier.count} ${quantifier.unit}`);
    criteria.push(`Zero-downtime deployment verified`);
    criteria.push(`All instances in healthy state post-deployment`);
  }

  // Documentation
  criteria.push('Runbooks and troubleshooting guides documented');
  criteria.push('Team trained on new features/changes');

  // Monitoring
  criteria.push('Monitoring and alerting configured');
  criteria.push('Metrics baseline established');

  return criteria;
}

/**
 * Main parser function
 */
function parseGoal(goalText) {
  if (!goalText || typeof goalText !== 'string') {
    throw new Error('Goal must be a non-empty string');
  }

  const normalizedGoal = goalText.trim();

  // Try to match patterns
  let matchedPattern = null;
  let matches = null;

  for (const [patternName, pattern] of Object.entries(PATTERNS)) {
    matches = normalizedGoal.match(pattern);
    if (matches) {
      matchedPattern = patternName;
      break;
    }
  }

  // Extract components
  const quantifier = extractQuantifier(normalizedGoal);
  const categories = categorizeKeywords(normalizedGoal);
  const dependencies = inferDependencies(normalizedGoal, categories, quantifier);
  const subtasks = generateSubtasks(normalizedGoal, categories, quantifier);
  const acceptanceCriteria = generateAcceptanceCriteria(normalizedGoal, categories, quantifier);

  return {
    // Original goal
    goal: normalizedGoal,

    // Pattern matching result
    pattern: matchedPattern,

    // Extracted components
    components: {
      quantifier,
      categories,
      ...(matches && {
        primary_feature: matches[1]?.trim(),
        target: matches[2]?.trim(),
      }),
    },

    // Generated subtasks
    subtasks,

    // Inferred dependencies
    dependencies,

    // Acceptance criteria
    acceptance_criteria: acceptanceCriteria,

    // Metadata
    metadata: {
      complexity: subtasks.length > 5 ? 'high' : subtasks.length > 3 ? 'medium' : 'low',
      scope: quantifier ? `${quantifier.count} ${quantifier.unit}` : 'unspecified',
      estimated_phases: [...new Set(subtasks.map(t => t.phase))],
    },
  };
}

/**
 * Batch parse multiple goals
 */
function parseGoals(goals) {
  if (!Array.isArray(goals)) {
    throw new Error('Goals must be an array');
  }

  return goals.map((goal, idx) => ({
    index: idx,
    ...parseGoal(goal),
  }));
}

/**
 * Format parsed goal for readable output
 */
function formatGoal(parsed) {
  const lines = [];

  lines.push(`GOAL: ${parsed.goal}\n`);

  if (parsed.pattern) {
    lines.push(`Pattern: ${parsed.pattern}`);
  }

  if (Object.keys(parsed.components.categories).length > 0) {
    lines.push(`Categories: ${Object.keys(parsed.components.categories).join(', ')}`);
  }

  if (parsed.components.quantifier) {
    lines.push(`Scope: ${parsed.components.quantifier.count} ${parsed.components.quantifier.unit}`);
  }

  lines.push(`\nComplexity: ${parsed.metadata.complexity}`);
  lines.push(`Estimated phases: ${parsed.metadata.estimated_phases.join(' → ')}`);

  lines.push(`\nSUBTASKS (${parsed.subtasks.length}):`);
  parsed.subtasks.forEach(task => {
    lines.push(`  ${task.id}: [${task.phase}] ${task.title} (${task.priority})`);
    if (task.depends_on.length > 0) {
      lines.push(`    ↳ depends on: ${task.depends_on.join(', ')}`);
    }
  });

  if (Object.keys(parsed.dependencies).length > 0) {
    lines.push(`\nDEPENDENCIES:`);
    Object.entries(parsed.dependencies).forEach(([dep, desc]) => {
      lines.push(`  • ${dep}: ${desc}`);
    });
  }

  lines.push(`\nACCEPTANCE CRITERIA (${parsed.acceptance_criteria.length}):`);
  parsed.acceptance_criteria.forEach((criterion, idx) => {
    lines.push(`  ${idx + 1}. ${criterion}`);
  });

  return lines.join('\n');
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseGoal,
    parseGoals,
    formatGoal,
    PATTERNS,
    KEYWORDS,
  };
}

// Example usage
if (require.main === module) {
  const examples = [
    'Add OAuth2 + SAML across 15 microservices',
    'Implement rate limiting to the API gateway',
    'Integrate Redis cache across all services',
    'Deploy Kubernetes across 5 staging clusters',
    'Add JWT authentication to 12 backend services',
  ];

  console.log('='.repeat(70));
  examples.forEach((example, idx) => {
    try {
      const parsed = parseGoal(example);
      console.log(formatGoal(parsed));
      console.log('='.repeat(70));
    } catch (error) {
      console.error(`Error parsing goal ${idx + 1}: ${error.message}`);
    }
  });
}
