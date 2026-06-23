#!/usr/bin/env node

/**
 * Skill Composition CLI
 *
 * Commands for managing workflows, templates, and executions:
 *   skill-composition create <name>         - Create new workflow
 *   skill-composition add-skill <wf>        - Add skill to workflow
 *   skill-composition add-conditional <wf>  - Add conditional node
 *   skill-composition add-loop <wf>         - Add loop node
 *   skill-composition build <wf>            - Build workflow
 *   skill-composition execute <wf> <data>   - Execute workflow
 *   skill-composition template save <name>  - Save workflow as template
 *   skill-composition template list         - List templates
 *   skill-composition template load <id>    - Load template
 *   skill-composition history list <wf>     - Show execution history
 *   skill-composition metrics <wf>          - Show workflow metrics
 *   skill-composition export <wf>           - Export workflow JSON
 *   skill-composition import <json>         - Import workflow JSON
 *   skill-composition ui <wf>               - Generate UI schema
 */

const fs = require('fs');
const path = require('path');
const composer = require('./skill-composition');

// ============================================================================
// CLI STATE & STORAGE
// ============================================================================

const WORKFLOWS_DIR = path.join(process.cwd(), '.workflows');
const workflows = new Map();

/**
 * Ensure workflows directory exists
 */
function ensureWorkflowsDir() {
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    fs.mkdirSync(WORKFLOWS_DIR, { recursive: true });
  }
}

/**
 * Save workflow to disk
 */
function saveWorkflow(name, workflow) {
  ensureWorkflowsDir();
  const filePath = path.join(WORKFLOWS_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
  workflows.set(name, workflow);
  return filePath;
}

/**
 * Load workflow from disk
 */
function loadWorkflow(name) {
  ensureWorkflowsDir();
  const filePath = path.join(WORKFLOWS_DIR, `${name}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Workflow not found: ${name}`);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  workflows.set(name, data);
  return data;
}

/**
 * List all workflows
 */
function listWorkflows() {
  ensureWorkflowsDir();
  const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => f.replace('.json', ''));
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

const commands = {
  /**
   * Create new workflow
   */
  create: (args) => {
    const name = args[0];
    if (!name) throw new Error('Usage: create <name>');

    const builder = composer.createBuilder();
    const workflow = builder.build(name);

    saveWorkflow(name, workflow);
    console.log(`✓ Created workflow: ${name}`);
    console.log(`  Path: ${path.join(WORKFLOWS_DIR, name + '.json')}`);
  },

  /**
   * Add skill to workflow
   */
  'add-skill': (args) => {
    const [wfName, skillName] = args;
    if (!wfName || !skillName) throw new Error('Usage: add-skill <workflow> <skill-name>');

    let workflow = workflows.get(wfName);
    if (!workflow) {
      try {
        workflow = loadWorkflow(wfName);
      } catch {
        throw new Error(`Workflow not found: ${wfName}`);
      }
    }

    // For CLI, we create a basic skill function
    const skillFunction = async (data) => {
      console.log(`  → Executing skill: ${skillName}`);
      return data;
    };

    const builder = composer.createBuilder();
    builder.nodes = workflow.nodes || [];
    builder.edges = workflow.edges || [];
    builder.nodeIdCounter = (workflow.nodes?.length || 0) + 1;

    const skillId = builder.addSkill(skillName, skillFunction);
    const updated = builder.build(wfName);

    saveWorkflow(wfName, updated);
    console.log(`✓ Added skill: ${skillName}`);
    console.log(`  ID: ${skillId}`);
  },

  /**
   * Add conditional to workflow
   */
  'add-conditional': (args) => {
    const [wfName, type] = args;
    if (!wfName || !type) throw new Error('Usage: add-conditional <workflow> <type>');

    const workflow = loadWorkflow(wfName);
    const builder = composer.createBuilder();
    builder.nodes = workflow.nodes || [];
    builder.edges = workflow.edges || [];
    builder.nodeIdCounter = (workflow.nodes?.length || 0) + 1;

    const condId = builder.addConditional(type, () => true);
    const updated = builder.build(wfName);

    saveWorkflow(wfName, updated);
    console.log(`✓ Added conditional: ${type}`);
    console.log(`  ID: ${condId}`);
  },

  /**
   * Add loop to workflow
   */
  'add-loop': (args) => {
    const [wfName, type] = args;
    if (!wfName || !type) throw new Error('Usage: add-loop <workflow> <type>');

    const workflow = loadWorkflow(wfName);
    const builder = composer.createBuilder();
    builder.nodes = workflow.nodes || [];
    builder.edges = workflow.edges || [];
    builder.nodeIdCounter = (workflow.nodes?.length || 0) + 1;

    const loopId = builder.addLoop(type, { condition: 5 });
    const updated = builder.build(wfName);

    saveWorkflow(wfName, updated);
    console.log(`✓ Added loop: ${type}`);
    console.log(`  ID: ${loopId}`);
  },

  /**
   * Build workflow
   */
  build: (args) => {
    const name = args[0];
    if (!name) throw new Error('Usage: build <workflow>');

    const workflow = loadWorkflow(name);
    const validation = composer.validateWorkflow(workflow.nodes, workflow.edges);

    console.log(`\n Workflow: ${name}`);
    console.log(`  Nodes: ${workflow.nodes.length}`);
    console.log(`  Edges: ${workflow.edges.length}`);
    console.log(`  Valid: ${validation.valid ? '✓ Yes' : '✗ No'}`);

    if (!validation.valid) {
      console.log('\n  Errors:');
      validation.errors.forEach(err => console.log(`    - ${err}`));
    } else {
      console.log(`  Sorted: ${workflow.sortedNodes.length} nodes in execution order`);
    }
  },

  /**
   * Execute workflow
   */
  execute: async (args) => {
    const [wfName, dataJson] = args;
    if (!wfName) throw new Error('Usage: execute <workflow> [data-json]');

    const workflow = loadWorkflow(wfName);
    let input = {};

    if (dataJson) {
      try {
        input = JSON.parse(dataJson);
      } catch {
        input = { data: dataJson };
      }
    }

    console.log(`\n Executing: ${wfName}`);
    console.log(`  Input: ${JSON.stringify(input)}`);
    console.log('  Progress:');

    const result = await composer.executeWorkflow(workflow, input);

    console.log('\n  Steps:');
    result.steps.forEach((step, idx) => {
      const status = step.status === 'success' ? '✓' : '✗';
      console.log(`    ${idx + 1}. ${status} ${step.nodeName} (${step.duration}ms)`);
    });

    console.log('\n  Result:');
    console.log(`    Status: ${result.status}`);
    console.log(`    Output: ${JSON.stringify(result.output, null, 6)}`);
    console.log(`\n  Metrics:`);
    console.log(`    Total duration: ${result.metrics.totalDuration}ms`);
    console.log(`    Success rate: ${result.metrics.successRate}%`);

    return result;
  },

  /**
   * Save workflow as template
   */
  'template': (args) => {
    const [subcommand, ...rest] = args;

    if (subcommand === 'save') {
      const [wfName, templateName] = rest;
      if (!wfName || !templateName) throw new Error('Usage: template save <workflow> <name>');

      const workflow = loadWorkflow(wfName);
      const templateId = composer.TemplateStorage.saveTemplate(templateName, workflow, {
        tags: ['imported'],
      });

      console.log(`✓ Saved template: ${templateName}`);
      console.log(`  ID: ${templateId}`);
    } else if (subcommand === 'list') {
      const templates = composer.TemplateStorage.listTemplates();

      console.log(`\n Total templates: ${templates.length}\n`);
      if (templates.length === 0) {
        console.log('  (none)');
      } else {
        templates.forEach(t => {
          console.log(`  - ${t.name}`);
          console.log(`    ID: ${t.id}`);
          console.log(`    Tags: ${t.tags.join(', ')}`);
          console.log(`    Saved: ${t.savedAt}`);
        });
      }
    } else if (subcommand === 'load') {
      const templateId = rest[0];
      if (!templateId) throw new Error('Usage: template load <id>');

      const template = composer.TemplateStorage.loadTemplate(templateId);
      console.log(`✓ Loaded template: ${template.name}`);
      console.log(`  Nodes: ${template.workflow.nodes.length}`);
      console.log(`  Edges: ${template.workflow.edges.length}`);
    } else {
      throw new Error('Unknown template subcommand');
    }
  },

  /**
   * Show execution history
   */
  history: (args) => {
    const [subcommand, wfName] = args;

    if (subcommand === 'list') {
      if (!wfName) {
        const all = composer.ExecutionHistory.listExecutions({ limit: 10 });
        console.log(`\n Total executions: ${all.length}\n`);
        all.forEach(exec => {
          console.log(`  - ${exec.id}`);
          console.log(`    Workflow: ${exec.workflowId}`);
          console.log(`    Status: ${exec.status}`);
          console.log(`    Duration: ${exec.metrics.totalDuration}ms`);
        });
      } else {
        const executions = composer.ExecutionHistory.listExecutions({
          workflowId: wfName,
          limit: 10,
        });

        console.log(`\n History for: ${wfName}\n`);
        if (executions.length === 0) {
          console.log('  (no executions)');
        } else {
          executions.forEach(exec => {
            console.log(`  - ${exec.id}`);
            console.log(`    Status: ${exec.status}`);
            console.log(`    Duration: ${exec.metrics.totalDuration}ms`);
          });
        }
      }
    } else {
      throw new Error('Unknown history subcommand');
    }
  },

  /**
   * Show workflow metrics
   */
  metrics: (args) => {
    const wfName = args[0];
    if (!wfName) throw new Error('Usage: metrics <workflow>');

    const metrics = composer.ExecutionHistory.getMetrics(wfName);

    console.log(`\n Metrics for: ${wfName}\n`);
    console.log(`  Total executions: ${metrics.totalExecutions}`);
    console.log(`  Successful: ${metrics.successCount}`);
    console.log(`  Failed: ${metrics.failureCount}`);
    console.log(`  Success rate: ${metrics.successRate}%`);
    console.log(`  Avg duration: ${metrics.avgDuration}ms`);
    console.log(`  Min duration: ${metrics.minDuration}ms`);
    console.log(`  Max duration: ${metrics.maxDuration}ms`);
  },

  /**
   * Export workflow to JSON
   */
  export: (args) => {
    const wfName = args[0];
    if (!wfName) throw new Error('Usage: export <workflow>');

    const workflow = loadWorkflow(wfName);
    console.log(JSON.stringify(workflow, null, 2));
  },

  /**
   * Import workflow from JSON
   */
  import: (args) => {
    const jsonFile = args[0];
    if (!jsonFile) throw new Error('Usage: import <json-file>');

    const data = fs.readFileSync(jsonFile, 'utf8');
    const workflow = JSON.parse(data);

    if (!workflow.id) {
      throw new Error('Invalid workflow: missing id');
    }

    saveWorkflow(workflow.id, workflow);
    console.log(`✓ Imported workflow: ${workflow.id}`);
  },

  /**
   * Generate UI schema
   */
  ui: (args) => {
    const wfName = args[0];
    if (!wfName) throw new Error('Usage: ui <workflow>');

    const workflow = loadWorkflow(wfName);
    const schema = composer.UIBuilder.generateUISchema(workflow);

    console.log(`\n Workflow UI Schema: ${wfName}\n`);
    console.log(`  Canvas: ${schema.canvas.width}x${schema.canvas.height}`);
    console.log(`  Nodes: ${schema.nodes.length}`);

    schema.nodes.forEach(node => {
      console.log(`    - ${node.label} at (${node.position.x}, ${node.position.y})`);
    });

    console.log(`  Edges: ${schema.edges.length}`);
    schema.edges.forEach(edge => {
      console.log(`    - ${edge.source} → ${edge.target}`);
    });

    console.log(`\n  Palette categories: ${schema.palette.length}`);
  },

  /**
   * List workflows
   */
  list: () => {
    const list = listWorkflows();
    console.log(`\n Total workflows: ${list.length}\n`);

    if (list.length === 0) {
      console.log('  (none)');
    } else {
      list.forEach(name => console.log(`  - ${name}`));
    }
  },

  /**
   * Show help
   */
  help: () => {
    console.log(`
 Skill Composition CLI

 WORKFLOW MANAGEMENT:
   create <name>              Create new workflow
   list                       List all workflows
   build <workflow>           Build and validate workflow
   export <workflow>          Export workflow to JSON
   import <json-file>         Import workflow from JSON

 WORKFLOW EDITING:
   add-skill <wf> <name>      Add skill node to workflow
   add-conditional <wf> <type> Add conditional node
   add-loop <wf> <type>       Add loop node

 WORKFLOW EXECUTION:
   execute <workflow> [data]  Execute workflow
   history list [workflow]    Show execution history
   metrics <workflow>         Show workflow metrics

 TEMPLATES:
   template list              List saved templates
   template save <wf> <name>  Save workflow as template
   template load <id>         Load template

 UI:
   ui <workflow>              Generate UI schema

 OTHER:
   help                       Show this help
`);
  },
};

// ============================================================================
// MAIN CLI
// ============================================================================

async function main() {
  const [, , command, ...args] = process.argv;

  if (!command || command === 'help') {
    commands.help();
    return;
  }

  const handler = commands[command];
  if (!handler) {
    console.error(`✗ Unknown command: ${command}`);
    console.error(`  Try 'skill-composition help' for usage information`);
    process.exit(1);
  }

  try {
    const result = await handler(args);
    if (result !== undefined) {
      console.log(result);
    }
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

module.exports = {
  saveWorkflow,
  loadWorkflow,
  listWorkflows,
  commands,
};
