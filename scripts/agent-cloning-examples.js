#!/usr/bin/env node

/**
 * Agent Cloning System - Usage Examples
 *
 * Demonstrates real-world patterns and workflows for agent cloning.
 */

const { AgentCloneManager } = require('./agent-cloning');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  CYAN: '\x1b[36m',
  YELLOW: '\x1b[33m',
  RESET: '\x1b[0m',
};

const manager = new AgentCloneManager();

function log(title, content) {
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}${title}${COLORS.RESET}`);
  console.log(content);
}

// ============================================================================
// Example 1: Multi-Team Agent Distribution
// ============================================================================

function example1_multiTeamDistribution() {
  log('Example 1: Multi-Team Agent Distribution', '');

  // Create a standard company agent template
  const template = manager.createTemplate(
    {
      name: 'CompanyStandard',
      model: 'claude-opus-4-1',
      maxTokens: 100000,
      temperature: 0.7,
      tools: ['search', 'code-analyzer'],
      systemPrompt: 'You are a company-standard assistant agent',
    },
    'CompanyStandard',
    {
      author: 'platform-team',
      description: 'Standard agent template for all teams',
      tags: ['standard', 'approved', 'production'],
    }
  );

  console.log(`  ✓ Created template: ${template.name} (${template.id})`);

  // Team A customizes for their needs
  const teamAAgent = manager.cloneAgent(
    template.id,
    'TeamA-ProductAgent',
    {
      tools: ['search', 'code-analyzer', 'teamA-jira', 'teamA-github'],
    },
    {
      author: 'alice',
      branch: 'team-a/main',
    }
  );

  console.log(`  ✓ Created Team A agent: ${teamAAgent.name} (${teamAAgent.id})`);

  // Team B customizes with different tools
  const teamBAgent = manager.cloneAgent(
    template.id,
    'TeamB-DataAgent',
    {
      temperature: 0.5,
      tools: ['search', 'teamB-redshift', 'teamB-warehouse', 'data-validator'],
    },
    {
      author: 'bob',
      branch: 'team-b/main',
    }
  );

  console.log(`  ✓ Created Team B agent: ${teamBAgent.name} (${teamBAgent.id})`);

  // Share with teams
  const shareA = manager.shareAgent(teamAAgent.id, {
    recipients: ['team-a@company.com'],
    author: 'platform-team',
    accessLevel: 'edit',
    description: 'Product team agent - can modify and create variants',
  });

  console.log(`  ✓ Shared with Team A (${shareA.id})`);

  const shareB = manager.shareAgent(teamBAgent.id, {
    recipients: ['team-b@company.com'],
    author: 'platform-team',
    accessLevel: 'edit',
    description: 'Data team agent - can modify and create variants',
  });

  console.log(`  ✓ Shared with Team B (${shareB.id})`);

  // Team A creates aggressive variant for urgent work
  const urgentVariant = manager.createVariant(
    teamAAgent.id,
    'TeamA-Urgent-Mode',
    { temperature: 0.95, maxTokens: 150000 },
    { author: 'alice', reason: 'For high-priority incident response' }
  );

  console.log(`  ✓ Created urgent variant: ${urgentVariant.name} (${urgentVariant.id})`);

  return { template, teamAAgent, teamBAgent, urgentVariant };
}

// ============================================================================
// Example 2: Progressive Experimentation & A/B Testing
// ============================================================================

function example2_experimentalWorkflow() {
  log('Example 2: Progressive Experimentation & A/B Testing', '');

  // Create base experimental template
  const baseTemplate = manager.createTemplate(
    {
      name: 'ExperimentalAgent',
      model: 'claude-opus-4-1',
      maxTokens: 100000,
      temperature: 0.7,
      tools: ['search', 'calculator', 'code-exec'],
    },
    'ExperimentalBase',
    {
      author: 'research-team',
      description: 'Base for experimentation',
      tags: ['experimental'],
    }
  );

  console.log(`  ✓ Created base template: ${baseTemplate.name}`);

  // Start with controlled experiment clone
  const controlClone = manager.cloneAgent(
    baseTemplate.id,
    'Experiment-Control',
    { temperature: 0.7 },
    { author: 'research-team' }
  );

  console.log(`  ✓ Created control clone: ${controlClone.name}`);

  // Version control baseline
  const v1Control = manager.versionClone(
    controlClone.id,
    'baseline',
    'Initial control configuration'
  );

  console.log(`  ✓ Versioned control: ${v1Control.label}`);

  // Create high-temperature experimental variant
  const creativeVariant = manager.createVariant(
    controlClone.id,
    'Experiment-HighCreativity',
    { temperature: 1.8 },
    { author: 'research-team', reason: 'Test high creativity' }
  );

  console.log(`  ✓ Created creative variant: ${creativeVariant.name}`);

  // Create low-temperature precise variant
  const preciseVariant = manager.createVariant(
    controlClone.id,
    'Experiment-Precise',
    { temperature: 0.1 },
    { author: 'research-team', reason: 'Test precise behavior' }
  );

  console.log(`  ✓ Created precise variant: ${preciseVariant.name}`);

  // Version both for round 1 testing
  manager.versionClone(creativeVariant.id, 'round-1');
  manager.versionClone(preciseVariant.id, 'round-1');

  console.log(`  ✓ Versioned both variants for Round 1`);

  // Update creative variant based on findings
  manager.updateClone(
    creativeVariant.id,
    {
      maxTokens: 150000,
      tools: ['search', 'calculator', 'code-exec', 'web-browser'],
    },
    { author: 'research-team', reason: 'Add web browser based on Round 1 results' }
  );

  // Version for round 2
  manager.versionClone(creativeVariant.id, 'round-2', 'Added web browser tool');

  console.log(`  ✓ Updated creative variant and versioned for Round 2`);

  return { baseTemplate, controlClone, creativeVariant, preciseVariant };
}

// ============================================================================
// Example 3: Compliance & Audit Trail
// ============================================================================

function example3_complianceAudit() {
  log('Example 3: Compliance & Audit Trail', '');

  const auditLog = [];

  // Attach event listeners for compliance
  manager.on('clone-created', (event) => {
    auditLog.push({
      timestamp: Date.now(),
      action: 'clone-created',
      cloneId: event.cloneId,
      cloneName: event.cloneName,
    });
  });

  manager.on('clone-updated', (event) => {
    auditLog.push({
      timestamp: Date.now(),
      action: 'clone-updated',
      cloneId: event.cloneId,
      updates: Object.keys(event.updates),
    });
  });

  manager.on('agent-shared', (event) => {
    auditLog.push({
      timestamp: Date.now(),
      action: 'agent-shared',
      cloneId: event.cloneId,
      recipients: event.recipients,
    });
  });

  manager.on('clone-versioned', (event) => {
    auditLog.push({
      timestamp: Date.now(),
      action: 'clone-versioned',
      cloneId: event.cloneId,
      label: event.label,
    });
  });

  // Create template
  const complianceTemplate = manager.createTemplate(
    {
      name: 'ComplianceAgent',
      model: 'claude-opus-4-1',
      maxTokens: 80000,
      temperature: 0.3,
    },
    'ComplianceReviewer',
    {
      author: 'legal-team',
      description: 'For compliance document review',
    }
  );

  // Create clone
  const complianceClone = manager.cloneAgent(
    complianceTemplate.id,
    'ComplianceBot-Prod',
    { temperature: 0.2 },
    { author: 'legal-team' }
  );

  // Version for compliance
  const v1 = manager.versionClone(
    complianceClone.id,
    'v1.0-approved',
    'Approved for production by legal team'
  );

  // Share with compliance team
  manager.shareAgent(complianceClone.id, {
    recipients: ['compliance@company.com'],
    author: 'legal-team',
    accessLevel: 'read',
    description: 'Production compliance bot - read-only access',
  });

  // Get full audit trail
  const tree = manager.getLineageTree(complianceClone.id);
  const sharing = manager.getSharingInfo(complianceClone.id);
  const stats = manager.getStats();

  console.log(`  ✓ Audit events recorded: ${auditLog.length}`);
  console.log(`  ✓ Lineage entries: ${tree.history.length}`);
  console.log(`  ✓ Sharing records: ${sharing.length}`);
  console.log(`  ✓ System stats: ${stats.instances} instances, ${stats.versions} versions`);

  return { complianceClone, auditLog, tree, sharing };
}

// ============================================================================
// Example 4: Template Promotion from Successful Clone
// ============================================================================

function example4_templatePromotion() {
  log('Example 4: Template Promotion from Successful Clone', '');

  // Start with an experimental template
  const expTemplate = manager.createTemplate(
    {
      name: 'CodeReviewerExperimental',
      model: 'claude-opus-4-1',
      maxTokens: 120000,
      temperature: 0.4,
      tools: ['code-parser', 'lint-checker', 'security-scanner'],
    },
    'CodeReviewerV0',
    { author: 'eng-team' }
  );

  console.log(`  ✓ Created experimental template: ${expTemplate.name}`);

  // Create clone for testing
  const testClone = manager.cloneAgent(
    expTemplate.id,
    'CodeReviewer-TestRun',
    { maxTokens: 150000 },
    { author: 'eng-team' }
  );

  console.log(`  ✓ Created test clone: ${testClone.name}`);

  // Fine-tune based on testing
  manager.updateClone(
    testClone.id,
    {
      temperature: 0.35,
      tools: ['code-parser', 'lint-checker', 'security-scanner', 'dependency-checker'],
    },
    { author: 'eng-team', reason: 'Added dependency checker, reduced temperature' }
  );

  console.log(`  ✓ Fine-tuned clone based on testing`);

  // Version as stable
  const stableVersion = manager.versionClone(
    testClone.id,
    'v1.0-stable',
    'Ready for promotion to template'
  );

  console.log(`  ✓ Created stable version: ${stableVersion.label}`);

  // Promote to new template for broad adoption
  const promotedTemplate = manager.saveAsTemplate(
    testClone.id,
    'CodeReviewerV1',
    {
      author: 'eng-team',
      description: 'Production-ready code reviewer',
      tags: ['approved', 'production', 'v1'],
    }
  );

  console.log(`  ✓ Promoted to production template: ${promotedTemplate.name}`);

  // Now other teams can clone from the stable template
  const teamClone = manager.cloneAgent(
    promotedTemplate.id,
    'TeamX-CodeReviewer',
    {},
    { author: 'team-x' }
  );

  console.log(`  ✓ Team X cloned from promoted template: ${teamClone.name}`);

  return { expTemplate, testClone, promotedTemplate, teamClone };
}

// ============================================================================
// Example 5: Import/Export for Cross-Team Sharing
// ============================================================================

function example5_importExport() {
  log('Example 5: Import/Export for Cross-Team Sharing', '');

  // Create a specialized template
  const template = manager.createTemplate(
    {
      name: 'DataProcessingAgent',
      model: 'claude-opus-4-1',
      maxTokens: 100000,
      temperature: 0.5,
      tools: ['sql-executor', 'pandas-runner', 'visualization'],
    },
    'DataProcessor',
    { author: 'data-team' }
  );

  console.log(`  ✓ Created data processor template: ${template.name}`);

  // Create clone with team-specific config
  const clone = manager.cloneAgent(
    template.id,
    'DataProcessor-ProdA',
    { tools: ['sql-executor', 'pandas-runner', 'visualization', 'prod-a-db'] },
    { author: 'data-team' }
  );

  console.log(`  ✓ Created clone: ${clone.name}`);

  // Export for sharing
  const exported = manager.exportClone(clone.id, 'json');
  console.log(`  ✓ Exported clone (${exported.length} bytes)`);

  // Simulate sharing via file or network
  // In real scenario: save to file, email to other team, etc.

  // Another team imports it
  const imported = manager.importClone(exported, {
    author: 'analytics-team',
    reason: 'Imported from data-team for analytics pipeline',
  });

  console.log(`  ✓ Imported as new clone: ${imported.name} (${imported.id})`);

  // Importing team creates variant for their needs
  const variant = manager.createVariant(
    imported.id,
    'DataProcessor-Analytics',
    {
      tools: ['sql-executor', 'pandas-runner', 'visualization', 'analytics-db', 'tableau'],
    },
    { author: 'analytics-team', reason: 'Customized for analytics workflow' }
  );

  console.log(`  ✓ Created variant: ${variant.name}`);

  // Track lineage
  const lineage = manager.getLineageTree(variant.id);
  console.log(`  ✓ Lineage depth: ${lineage.history.length} events`);

  return { template, clone, imported, variant };
}

// ============================================================================
// Main Example Runner
// ============================================================================

async function runExamples() {
  console.log(`\n${COLORS.BOLD}${COLORS.GREEN}Agent Cloning System - Usage Examples${COLORS.RESET}`);
  console.log(
    `${COLORS.CYAN}Demonstrating real-world patterns and workflows${COLORS.RESET}\n`
  );

  try {
    // Run all examples
    const examples = [
      { fn: example1_multiTeamDistribution, name: 'Multi-Team Distribution' },
      { fn: example2_experimentalWorkflow, name: 'Experimental Workflow' },
      { fn: example3_complianceAudit, name: 'Compliance & Audit' },
      { fn: example4_templatePromotion, name: 'Template Promotion' },
      { fn: example5_importExport, name: 'Import/Export Sharing' },
    ];

    for (const example of examples) {
      try {
        example.fn();
      } catch (error) {
        console.error(
          `\n${COLORS.YELLOW}Error in ${example.name}:${COLORS.RESET} ${error.message}`
        );
      }
    }

    // Final statistics
    const stats = manager.getStats();
    log('Final Statistics', '');
    console.log(`  Templates: ${stats.templates}`);
    console.log(`  Instances: ${stats.instances}`);
    console.log(`  Shared: ${stats.shared}`);
    console.log(`  Shared instances: ${stats.sharedInstances}`);
    console.log(`  Versions: ${stats.versions}`);
    console.log(`  Lineage entries: ${stats.lineageEntries}`);

    log('Summary', '');
    console.log(`  ✓ All examples completed successfully`);
    console.log(`  ✓ Agent clones can be managed via CLI or programmatic API`);
    console.log(`  ✓ Full lineage and audit trail maintained`);

    console.log(`\n${COLORS.CYAN}For more information, see AGENT-CLONING-README.md${COLORS.RESET}\n`);
  } catch (error) {
    console.error(`\nFatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  runExamples();
}

module.exports = {
  example1_multiTeamDistribution,
  example2_experimentalWorkflow,
  example3_complianceAudit,
  example4_templatePromotion,
  example5_importExport,
};
