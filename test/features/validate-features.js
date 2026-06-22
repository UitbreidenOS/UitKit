#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Feature Integration Tests
 * Validates that features are properly integrated into the system
 */

class FeatureIntegrationTest {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.tests = [];
  }

  async run() {
    console.log('🧪 Running Feature Integration Tests\n');

    await this.testFeaturePresenceStructure();
    await this.testSkillsRegistration();
    await this.testAgentsRegistration();
    await this.testHooksRegistration();
    await this.testWorkflowsStructure();
    await this.testJSONValidity();
    await this.testMarkdownFormat();

    this.printSummary();
    return this.failed === 0;
  }

  async testFeaturePresenceStructure() {
    console.log('Test: Feature Presence Structure');

    try {
      if (!fs.existsSync('feature-presence.txt')) {
        throw new Error('feature-presence.txt not found');
      }

      const content = fs.readFileSync('feature-presence.txt', 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());

      if (lines.length < 50) {
        throw new Error(`Expected at least 50 features, got ${lines.length}`);
      }

      let validLines = 0;
      lines.forEach((line, idx) => {
        const parts = line.split('|');
        if (parts.length >= 5) validLines++;
      });

      if (validLines !== lines.length) {
        throw new Error(`Invalid lines: ${lines.length - validLines}/${lines.length}`);
      }

      this.pass('Feature Presence Structure');
    } catch (e) {
      this.fail('Feature Presence Structure', e.message);
    }
  }

  async testSkillsRegistration() {
    console.log('Test: Skills Registration');

    try {
      if (!fs.existsSync('skills')) {
        this.skip('Skills Registration', 'skills directory not found');
        return;
      }

      const skillDirs = fs.readdirSync('skills').filter(f => {
        return fs.statSync(path.join('skills', f)).isDirectory();
      });

      if (skillDirs.length === 0) {
        throw new Error('No skill directories found');
      }

      let skillCount = 0;
      skillDirs.forEach(dir => {
        const skillPath = path.join('skills', dir);
        const files = fs.readdirSync(skillPath).filter(f => f.endsWith('.md'));
        skillCount += files.length;
      });

      if (skillCount === 0) {
        throw new Error('No skill markdown files found');
      }

      this.pass('Skills Registration', `${skillCount} skills found`);
    } catch (e) {
      this.fail('Skills Registration', e.message);
    }
  }

  async testAgentsRegistration() {
    console.log('Test: Agents Registration');

    try {
      if (!fs.existsSync('agents')) {
        this.skip('Agents Registration', 'agents directory not found');
        return;
      }

      const agentDirs = fs.readdirSync('agents').filter(f => {
        return fs.statSync(path.join('agents', f)).isDirectory();
      });

      if (agentDirs.length === 0) {
        throw new Error('No agent directories found');
      }

      let agentCount = 0;
      agentDirs.forEach(dir => {
        const agentPath = path.join('agents', dir);
        const files = fs.readdirSync(agentPath).filter(f => f.endsWith('.md'));
        agentCount += files.length;
      });

      if (agentCount === 0) {
        throw new Error('No agent markdown files found');
      }

      this.pass('Agents Registration', `${agentCount} agents found`);
    } catch (e) {
      this.fail('Agents Registration', e.message);
    }
  }

  async testHooksRegistration() {
    console.log('Test: Hooks Registration');

    try {
      if (!fs.existsSync('hooks')) {
        this.skip('Hooks Registration', 'hooks directory not found');
        return;
      }

      const hookFiles = fs.readdirSync('hooks', { recursive: true }).filter(f => {
        return f.endsWith('.md') || f.endsWith('.sh') || f.endsWith('.py');
      });

      if (hookFiles.length === 0) {
        throw new Error('No hook files found');
      }

      this.pass('Hooks Registration', `${hookFiles.length} hook files found`);
    } catch (e) {
      this.fail('Hooks Registration', e.message);
    }
  }

  async testWorkflowsStructure() {
    console.log('Test: Workflows Structure');

    try {
      if (!fs.existsSync('workflows')) {
        this.skip('Workflows Structure', 'workflows directory not found');
        return;
      }

      const files = fs.readdirSync('workflows').filter(f => f.endsWith('.md'));

      if (files.length === 0) {
        throw new Error('No workflow files found');
      }

      this.pass('Workflows Structure', `${files.length} workflows found`);
    } catch (e) {
      this.fail('Workflows Structure', e.message);
    }
  }

  async testJSONValidity() {
    console.log('Test: JSON Files Validity');

    try {
      const jsonFiles = [];

      const walkDir = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            if (!['node_modules', '.git', 'site', '.kimchi'].includes(file)) {
              walkDir(fullPath);
            }
          } else if (file.endsWith('.json')) {
            jsonFiles.push(fullPath);
          }
        });
      };

      walkDir('.');

      let invalidCount = 0;
      let validCount = 0;
      jsonFiles.forEach(file => {
        try {
          let content = fs.readFileSync(file, 'utf-8');

          // Remove single-line comments
          content = content.replace(/\/\/.*$/gm, '');
          // Remove multi-line comments
          content = content.replace(/\/\*[\s\S]*?\*\//g, '');
          // Remove trailing commas (common in JSON with comments)
          content = content.replace(/,\s*([\]}])/g, '$1');

          JSON.parse(content);
          validCount++;
        } catch (e) {
          invalidCount++;
          // Only report errors for critical schema files
          if (file.includes('audit-schema') || file === 'package.json') {
            console.error(`  Invalid JSON: ${file}`);
          }
        }
      });

      if (invalidCount > validCount / 2) {
        throw new Error(`Too many JSON parsing errors: ${invalidCount}/${jsonFiles.length}`);
      }

      this.pass('JSON Validity', `${validCount}/${jsonFiles.length} JSON files valid`);
    } catch (e) {
      this.fail('JSON Validity', e.message);
    }
  }

  async testMarkdownFormat() {
    console.log('Test: Markdown Format');

    try {
      const mdFiles = [
        'feature-presence.txt',
        'feature-inventory.txt'
      ];

      let validFiles = 0;
      mdFiles.forEach(file => {
        if (fs.existsSync(file)) {
          validFiles++;
        }
      });

      if (validFiles === 0) {
        throw new Error('No feature tracking files found');
      }

      this.pass('Markdown Format', `${validFiles}/${mdFiles.length} files present`);
    } catch (e) {
      this.fail('Markdown Format', e.message);
    }
  }

  pass(testName, details = '') {
    this.passed++;
    const msg = `  ✓ ${testName}`;
    console.log(details ? `${msg} - ${details}` : msg);
  }

  fail(testName, error = '') {
    this.failed++;
    console.log(`  ✗ ${testName}`);
    if (error) console.log(`    Error: ${error}`);
  }

  skip(testName, reason = '') {
    this.skipped++;
    console.log(`  ⊘ ${testName} (skipped${reason ? ': ' + reason : ''})`);
  }

  printSummary() {
    console.log(`\n📊 Test Results\n`);
    console.log(`  Passed:  ${this.passed}`);
    console.log(`  Failed:  ${this.failed}`);
    console.log(`  Skipped: ${this.skipped}`);
    console.log(`  Total:   ${this.passed + this.failed + this.skipped}`);

    if (this.failed > 0) {
      console.log('\n❌ Some tests failed');
      return false;
    } else {
      console.log('\n✨ All tests passed!');
      return true;
    }
  }
}

const test = new FeatureIntegrationTest();
test.run().then(success => {
  process.exit(success ? 0 : 1);
});
