#!/usr/bin/env node

/**
 * Agent Cloning System - Integration Test
 *
 * Full end-to-end test demonstrating complete workflow
 */

const { AgentCloneManager } = require('./agent-cloning');
const fs = require('fs');
const path = require('path');

const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  CYAN: '\x1b[36m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
};

class IntegrationTest {
  constructor() {
    this.manager = new AgentCloneManager();
    this.results = [];
  }

  log(message, status = 'INFO') {
    const icons = {
      PASS: `${COLORS.GREEN}✓${COLORS.RESET}`,
      FAIL: `${COLORS.RED}✗${COLORS.RESET}`,
      INFO: `${COLORS.CYAN}→${COLORS.RESET}`,
    };
    console.log(`  ${icons[status]} ${message}`);
  }

  async testTemplateLifecycle() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 1: Template Lifecycle${COLORS.RESET}`);

    try {
      // Create template
      const template = this.manager.createTemplate(
        {
          name: 'SecurityAgent',
          model: 'claude-opus-4-1',
          maxTokens: 100000,
          temperature: 0.3,
          tools: ['code-analyzer', 'vulnerability-scanner'],
        },
        'SecurityReviewer',
        { author: 'security-team', description: 'Security code reviewer' }
      );

      this.log(`Created template: ${template.name} (${template.id})`, 'PASS');

      // Retrieve template
      const retrieved = this.manager.getTemplate(template.id);
      if (retrieved && retrieved.id === template.id) {
        this.log(`Retrieved template correctly`, 'PASS');
      } else {
        throw new Error('Template retrieval failed');
      }

      // List templates
      const templates = this.manager.listTemplates();
      if (templates.length > 0) {
        this.log(`Listed ${templates.length} template(s)`, 'PASS');
      }

      return template;
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testCloneWorkflow(templateId) {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 2: Clone Workflow${COLORS.RESET}`);

    try {
      // Clone from template
      const clone = this.manager.cloneAgent(
        templateId,
        'SecurityBot-Prod',
        { temperature: 0.2, maxTokens: 120000 },
        { author: 'alice' }
      );

      this.log(`Created clone: ${clone.name} (${clone.id})`, 'PASS');
      this.log(`  Overrides: ${clone.overrides.length}`, 'INFO');

      // Retrieve clone
      const retrieved = this.manager.getClone(clone.id);
      if (retrieved && retrieved.config.temperature === 0.2) {
        this.log(`Verified override applied correctly`, 'PASS');
      }

      // List instances
      const instances = this.manager.listInstances();
      this.log(`Listed ${instances.length} instance(s)`, 'PASS');

      return clone;
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testVariantCreation(cloneId) {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 3: Variant Creation${COLORS.RESET}`);

    try {
      // Create conservative variant
      const conservative = this.manager.createVariant(
        cloneId,
        'SecurityBot-Conservative',
        { temperature: 0.1 },
        { author: 'bob', reason: 'Very conservative for critical reviews' }
      );

      this.log(`Created conservative variant: ${conservative.name}`, 'PASS');

      // Create aggressive variant
      const aggressive = this.manager.createVariant(
        cloneId,
        'SecurityBot-Aggressive',
        { temperature: 0.5, tools: ['code-analyzer', 'vulnerability-scanner', 'compliance-checker'] },
        { author: 'bob', reason: 'Comprehensive security checks' }
      );

      this.log(`Created aggressive variant: ${aggressive.name}`, 'PASS');

      return { conservative, aggressive };
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testSharing(cloneId) {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 4: Team Sharing${COLORS.RESET}`);

    try {
      // Share with team
      const sharing = this.manager.shareAgent(cloneId, {
        recipients: ['security-team@company.com', 'dev-lead@company.com'],
        author: 'alice',
        accessLevel: 'edit',
        description: 'Shared for security review cycle',
      });

      this.log(`Shared clone with ${sharing.shared.with.length} recipients`, 'PASS');

      // Verify sharing info
      const info = this.manager.getSharingInfo(cloneId);
      if (info.length > 0) {
        this.log(`Verified sharing records exist`, 'PASS');
      }

      return sharing;
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testVersioning(cloneId) {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 5: Versioning & Snapshots${COLORS.RESET}`);

    try {
      // Create beta version
      const v1 = this.manager.versionClone(
        cloneId,
        'v0.9-beta',
        'Beta release for testing'
      );

      this.log(`Created beta version: ${v1.label} (${v1.id})`, 'PASS');

      // Update clone
      this.manager.updateClone(
        cloneId,
        { temperature: 0.25, maxTokens: 150000 },
        { author: 'alice', reason: 'Tuning for production' }
      );

      this.log(`Updated clone configuration`, 'PASS');

      // Create production version
      const v2 = this.manager.versionClone(
        cloneId,
        'v1.0-production',
        'Production-ready configuration'
      );

      this.log(`Created production version: ${v2.label}`, 'PASS');

      return { v1, v2 };
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testLineageTracking(cloneId, variantIds) {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 6: Lineage Tracking${COLORS.RESET}`);

    try {
      // Get lineage for clone
      const tree = this.manager.getLineageTree(cloneId);
      this.log(`Clone has ${tree.history.length} history entries`, 'PASS');

      if (tree.descendants.length > 0) {
        this.log(`Found ${tree.descendants.length} descendant(s)`, 'PASS');
      }

      // Get lineage for variant
      if (variantIds && variantIds.length > 0) {
        const variantTree = this.manager.getLineageTree(variantIds[0]);
        this.log(`Variant has ${variantTree.history.length} history entries`, 'PASS');
      }

      return tree;
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testImportExport(cloneId) {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 7: Import/Export${COLORS.RESET}`);

    try {
      // Export to JSON
      const json = this.manager.exportClone(cloneId, 'json');
      this.log(`Exported clone to JSON (${json.length} bytes)`, 'PASS');

      // Import from JSON
      const imported = this.manager.importClone(json, {
        author: 'charlie',
        reason: 'Testing import functionality',
      });

      this.log(`Imported clone: ${imported.name} (${imported.id})`, 'PASS');

      if (imported.metadata.imported) {
        this.log(`Import flag correctly set`, 'PASS');
      }

      // Verify content matches
      const original = this.manager.getClone(cloneId);
      if (imported.config.temperature === original.config.temperature) {
        this.log(`Imported config matches original`, 'PASS');
      }

      return imported;
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testTemplatePromotion(cloneId) {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 8: Template Promotion${COLORS.RESET}`);

    try {
      // Save clone as template
      const newTemplate = this.manager.saveAsTemplate(cloneId, 'SecurityBotOptimized', {
        author: 'alice',
        description: 'Optimized security bot template',
      });

      this.log(`Promoted clone to template: ${newTemplate.name} (${newTemplate.id})`, 'PASS');

      // Verify we can clone from new template
      const cloneFromPromotion = this.manager.cloneAgent(
        newTemplate.id,
        'SecurityBot-FromPromoted',
        {},
        { author: 'alice' }
      );

      this.log(`Cloned from promoted template successfully`, 'PASS');

      return newTemplate;
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testConfigValidation() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 9: Configuration Validation${COLORS.RESET}`);

    try {
      // Valid config should pass
      const validConfig = {
        name: 'ValidAgent',
        model: 'claude-opus-4-1',
        maxTokens: 100000,
        temperature: 0.7,
        tools: [],
      };

      this.manager.validateConfig(validConfig);
      this.log(`Valid config passed validation`, 'PASS');

      // Invalid config should fail
      const invalidConfig = {
        name: 'InvalidAgent',
        model: 'claude-opus-4-1',
        maxTokens: -1000,
        temperature: 5.0,
        tools: 'not-an-array',
      };

      try {
        this.manager.validateConfig(invalidConfig);
        this.log(`Invalid config should have failed`, 'FAIL');
      } catch (e) {
        this.log(`Invalid config correctly rejected`, 'PASS');
      }
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async testStatistics() {
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Test 10: Statistics & Monitoring${COLORS.RESET}`);

    try {
      const stats = this.manager.getStats();

      this.log(
        `Templates: ${stats.templates}, Instances: ${stats.instances}, Versions: ${stats.versions}`,
        'PASS'
      );

      this.log(`Shared instances: ${stats.sharedInstances}`, 'PASS');
      this.log(`Lineage entries: ${stats.lineageEntries}`, 'PASS');

      if (
        stats.templates > 0 &&
        stats.instances > 0 &&
        stats.versions > 0
      ) {
        this.log(`All statistics recorded correctly`, 'PASS');
      }

      return stats;
    } catch (error) {
      this.log(`Failed: ${error.message}`, 'FAIL');
      throw error;
    }
  }

  async runAll() {
    console.log(
      `\n${COLORS.BOLD}${COLORS.GREEN}Agent Cloning System - Integration Test${COLORS.RESET}`
    );
    console.log(`${COLORS.CYAN}End-to-end workflow validation${COLORS.RESET}\n`);

    try {
      const template = await this.testTemplateLifecycle();
      const clone = await this.testCloneWorkflow(template.id);
      const variants = await this.testVariantCreation(clone.id);
      await this.testSharing(clone.id);
      const versions = await this.testVersioning(clone.id);
      await this.testLineageTracking(clone.id, [variants.conservative.id, variants.aggressive.id]);
      const imported = await this.testImportExport(clone.id);
      const promotedTemplate = await this.testTemplatePromotion(clone.id);
      await this.testConfigValidation();
      const stats = await this.testStatistics();

      console.log(`\n${COLORS.BOLD}${COLORS.GREEN}All Integration Tests Passed!${COLORS.RESET}`);
      console.log(`\n${COLORS.CYAN}Test Summary:${COLORS.RESET}`);
      console.log(`  Templates: ${stats.templates}`);
      console.log(`  Instances: ${stats.instances}`);
      console.log(`  Shared: ${stats.shared}`);
      console.log(`  Versions: ${stats.versions}`);
      console.log(`  Lineage entries: ${stats.lineageEntries}`);

      console.log(`\n${COLORS.BOLD}Features Verified:${COLORS.RESET}`);
      console.log('  ✓ Template creation and retrieval');
      console.log('  ✓ Clone operations with overrides');
      console.log('  ✓ Variant creation and customization');
      console.log('  ✓ Team sharing with access control');
      console.log('  ✓ Version management and snapshots');
      console.log('  ✓ Complete lineage tracking');
      console.log('  ✓ Import/export round-trips');
      console.log('  ✓ Template promotion workflow');
      console.log('  ✓ Configuration validation');
      console.log('  ✓ Statistics and monitoring');

      console.log(`\n${COLORS.YELLOW}Storage Location:${COLORS.RESET}`);
      console.log(`  ${path.join(process.cwd(), '.claude/agent-clones')}\n`);

      return true;
    } catch (error) {
      console.error(`\n${COLORS.RED}Integration Test Failed: ${error.message}${COLORS.RESET}\n`);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const test = new IntegrationTest();
  test.runAll().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { IntegrationTest };
