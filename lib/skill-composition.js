/**
 * Skill Composition Engine
 *
 * Compose skills into reusable workflows with:
 * - Drag-drop UI builder for skill chains
 * - Error handling and recovery between skills
 * - Conditional routing (if/else/switch)
 * - Loop support (for/while/until)
 * - Template storage and versioning
 * - Execution history & metrics
 *
 * Usage:
 *   const composer = require('./skill-composition');
 *   const builder = composer.createBuilder();
 *   builder.addSkill('validateInput', {...});
 *   builder.addConditional('if', {...});
 *   builder.addSkill('processData', {...});
 *   const workflow = builder.build();
 *   const result = await composer.executeWorkflow(workflow, data);
 */

const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const NODE_TYPES = {
  SKILL: 'skill',
  CONDITIONAL: 'conditional',
  LOOP: 'loop',
  PARALLEL: 'parallel',
  MERGE: 'merge',
  ERROR_HANDLER: 'error_handler',
};

const CONTROL_FLOW = {
  IF: 'if',
  ELSE: 'else',
  ELSE_IF: 'else_if',
  SWITCH: 'switch',
  FOR: 'for',
  WHILE: 'while',
  UNTIL: 'until',
  FOREACH: 'foreach',
};

const ERROR_STRATEGIES = {
  FAIL_FAST: 'fail_fast',
  CONTINUE: 'continue',
  RETRY: 'retry',
  FALLBACK: 'fallback',
  SKIP: 'skip',
};

// ============================================================================
// WORKFLOW BUILDER
// ============================================================================

/**
 * Create workflow builder instance
 */
function createBuilder(config = {}) {
  const builder = {
    nodes: [],
    edges: [],
    config: {
      timeout: config.timeout || 30000,
      retryCount: config.retryCount || 3,
      parallelLimit: config.parallelLimit || 5,
      ...config,
    },
    nodeIdCounter: 0,
    edgeIdCounter: 0,

    /**
     * Add skill node to workflow
     */
    addSkill(skillName, skillFn, options = {}) {
      const node = {
        id: `skill_${this.nodeIdCounter++}`,
        type: NODE_TYPES.SKILL,
        name: skillName,
        fn: skillFn,
        timeout: options.timeout || this.config.timeout,
        retries: options.retries || 0,
        errorStrategy: options.errorStrategy || ERROR_STRATEGIES.FAIL_FAST,
        fallback: options.fallback,
        metadata: options.metadata || {},
        inputs: options.inputs || [],
        outputs: options.outputs || [],
      };

      this.nodes.push(node);
      return node.id;
    },

    /**
     * Add conditional (if/else/switch) node
     */
    addConditional(type, condition, options = {}) {
      if (!Object.values(CONTROL_FLOW).includes(type)) {
        throw new Error(`Invalid control flow type: ${type}`);
      }

      const node = {
        id: `cond_${this.nodeIdCounter++}`,
        type: NODE_TYPES.CONDITIONAL,
        controlFlow: type,
        condition,
        branches: options.branches || {},
        defaultBranch: options.defaultBranch,
        metadata: options.metadata || {},
      };

      this.nodes.push(node);
      return node.id;
    },

    /**
     * Add loop node
     */
    addLoop(type, options = {}) {
      if (![CONTROL_FLOW.FOR, CONTROL_FLOW.WHILE, CONTROL_FLOW.UNTIL, CONTROL_FLOW.FOREACH].includes(type)) {
        throw new Error(`Invalid loop type: ${type}`);
      }

      const node = {
        id: `loop_${this.nodeIdCounter++}`,
        type: NODE_TYPES.LOOP,
        loopType: type,
        condition: options.condition,
        iterator: options.iterator,
        maxIterations: options.maxIterations || 1000,
        variable: options.variable,
        metadata: options.metadata || {},
      };

      this.nodes.push(node);
      return node.id;
    },

    /**
     * Add parallel execution node
     */
    addParallel(options = {}) {
      const node = {
        id: `parallel_${this.nodeIdCounter++}`,
        type: NODE_TYPES.PARALLEL,
        limit: options.limit || this.config.parallelLimit,
        mergeStrategy: options.mergeStrategy || 'all', // 'all', 'first', 'last', 'array'
        metadata: options.metadata || {},
      };

      this.nodes.push(node);
      return node.id;
    },

    /**
     * Add error handler node
     */
    addErrorHandler(fn, options = {}) {
      const node = {
        id: `error_${this.nodeIdCounter++}`,
        type: NODE_TYPES.ERROR_HANDLER,
        fn,
        errorTypes: options.errorTypes || ['Error'],
        strategy: options.strategy || ERROR_STRATEGIES.FAIL_FAST,
        metadata: options.metadata || {},
      };

      this.nodes.push(node);
      return node.id;
    },

    /**
     * Connect two nodes
     */
    connect(fromNodeId, toNodeId, options = {}) {
      const edge = {
        id: `edge_${this.edgeIdCounter++}`,
        from: fromNodeId,
        to: toNodeId,
        label: options.label,
        condition: options.condition,
        metadata: options.metadata || {},
      };

      this.edges.push(edge);
      return edge.id;
    },

    /**
     * Build workflow from nodes and edges
     */
    build(workflowName = `workflow_${Date.now()}`) {
      // Validate workflow structure
      const validation = validateWorkflow(this.nodes, this.edges);
      if (!validation.valid) {
        throw new Error(`Workflow validation failed: ${validation.errors.join(', ')}`);
      }

      // Topologically sort nodes
      const sortedNodes = topologicalSort(this.nodes, this.edges);

      return {
        id: workflowName,
        version: '1.0.0',
        nodes: this.nodes,
        edges: this.edges,
        sortedNodes,
        config: this.config,
        createdAt: new Date().toISOString(),
        metadata: {
          nodeCount: this.nodes.length,
          edgeCount: this.edges.length,
        },
      };
    },

    /**
     * Export workflow as JSON
     */
    exportJSON() {
      return JSON.stringify({
        nodes: this.nodes.map(n => ({
          ...n,
          fn: n.fn?.toString?.() || undefined,
        })),
        edges: this.edges,
        config: this.config,
      }, null, 2);
    },

    /**
     * Clear builder state
     */
    clear() {
      this.nodes = [];
      this.edges = [];
      this.nodeIdCounter = 0;
      this.edgeIdCounter = 0;
      return { status: 'cleared' };
    },
  };

  return builder;
}

/**
 * Validate workflow structure
 */
function validateWorkflow(nodes, edges) {
  const errors = [];

  // Empty workflows are valid (can be built incrementally)

  // Check for missing node references
  edges.forEach(edge => {
    const fromExists = nodes.some(n => n.id === edge.from);
    const toExists = nodes.some(n => n.id === edge.to);

    if (!fromExists) errors.push(`Edge references non-existent source node: ${edge.from}`);
    if (!toExists) errors.push(`Edge references non-existent target node: ${edge.to}`);
  });

  // Check for orphaned nodes (nodes with no connections)
  nodes.forEach(node => {
    if (node.type === NODE_TYPES.SKILL) {
      const hasConnection = edges.some(e => e.from === node.id || e.to === node.id);
      if (!hasConnection && nodes.length > 1) {
        errors.push(`Node ${node.id} has no connections`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Topologically sort workflow nodes
 */
function topologicalSort(nodes, edges) {
  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  function visit(nodeId) {
    if (visited.has(nodeId)) return;
    if (visiting.has(nodeId)) throw new Error('Circular dependency detected');

    visiting.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    sorted.push(node);

    edges
      .filter(e => e.from === nodeId)
      .forEach(edge => visit(edge.to));

    visiting.delete(nodeId);
    visited.add(nodeId);
  }

  nodes.forEach(node => visit(node.id));
  return sorted;
}

// ============================================================================
// WORKFLOW EXECUTION
// ============================================================================

/**
 * Execute workflow
 */
async function executeWorkflow(workflow, input, options = {}) {
  const startTime = performance.now();
  const execution = {
    id: `exec_${Date.now()}`,
    workflowId: workflow.id,
    input,
    steps: [],
    output: null,
    errors: [],
    metrics: {},
    status: 'running',
  };

  const context = {
    data: input,
    variables: options.variables || {},
    history: [],
    execution,
  };

  try {
    for (const node of workflow.sortedNodes) {
      const stepResult = await executeNode(node, context, workflow);

      execution.steps.push({
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        status: stepResult.status,
        duration: stepResult.duration,
        output: stepResult.output,
        error: stepResult.error,
      });

      if (stepResult.status === 'error') {
        execution.errors.push({
          nodeId: node.id,
          error: stepResult.error,
          strategy: node.errorStrategy,
        });

        if (node.errorStrategy === ERROR_STRATEGIES.FAIL_FAST) {
          throw new Error(`Workflow failed at node ${node.id}: ${stepResult.error.message}`);
        }
      }

      // Update context with output
      context.data = stepResult.output || context.data;
    }

    execution.status = 'completed';
    execution.output = context.data;
  } catch (error) {
    execution.status = 'failed';
    execution.errors.push({ error: error.message, timestamp: new Date().toISOString() });
  }

  const duration = performance.now() - startTime;
  execution.metrics = {
    totalDuration: parseFloat(duration.toFixed(2)),
    stepCount: execution.steps.length,
    errorCount: execution.errors.length,
    successRate: ((execution.steps.filter(s => s.status === 'success').length / execution.steps.length) * 100).toFixed(2),
    timestamp: new Date().toISOString(),
  };

  return execution;
}

/**
 * Execute single workflow node
 */
async function executeNode(node, context, workflow) {
  const startTime = performance.now();
  const result = {
    status: 'success',
    output: null,
    error: null,
    duration: 0,
  };

  try {
    switch (node.type) {
      case NODE_TYPES.SKILL:
        result.output = await executeSkill(node, context);
        break;

      case NODE_TYPES.CONDITIONAL:
        result.output = await executeConditional(node, context);
        break;

      case NODE_TYPES.LOOP:
        result.output = await executeLoop(node, context);
        break;

      case NODE_TYPES.PARALLEL:
        result.output = await executeParallel(node, context, workflow);
        break;

      case NODE_TYPES.ERROR_HANDLER:
        result.output = await executeErrorHandler(node, context);
        break;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  } catch (error) {
    result.status = 'error';
    result.error = error;

    if (node.errorStrategy === ERROR_STRATEGIES.RETRY && node.retries > 0) {
      result.status = 'retrying';
      for (let attempt = 1; attempt <= node.retries; attempt++) {
        try {
          result.output = await executeSkill(node, context);
          result.status = 'success';
          break;
        } catch (retryError) {
          if (attempt === node.retries) {
            result.error = retryError;
            result.status = 'error';
          }
        }
      }
    } else if (node.errorStrategy === ERROR_STRATEGIES.FALLBACK && node.fallback) {
      result.output = await node.fallback(context.data, error);
      result.status = 'fallback';
    }
  }

  result.duration = parseFloat((performance.now() - startTime).toFixed(2));
  return result;
}

/**
 * Execute skill node
 */
async function executeSkill(node, context) {
  return await node.fn(context.data, context.variables);
}

/**
 * Execute conditional node
 */
async function executeConditional(node, context) {
  const { controlFlow, condition } = node;

  switch (controlFlow) {
    case CONTROL_FLOW.IF:
    case CONTROL_FLOW.ELSE_IF:
      return await evaluateCondition(condition, context.data)
        ? true
        : false;

    case CONTROL_FLOW.SWITCH:
      return Object.entries(node.branches).find(([key]) => {
        return evaluateExpression(key, context.data);
      })?.[0];

    default:
      return null;
  }
}

/**
 * Execute loop node
 */
async function executeLoop(node, context) {
  const { loopType, maxIterations } = node;
  let iterations = 0;
  const results = [];

  switch (loopType) {
    case CONTROL_FLOW.FOR:
      for (let i = 0; i < node.condition; i++) {
        if (iterations++ >= maxIterations) break;
        results.push(context.data);
      }
      break;

    case CONTROL_FLOW.WHILE:
      while (evaluateCondition(node.condition, context.data)) {
        if (iterations++ >= maxIterations) break;
        results.push(context.data);
      }
      break;

    case CONTROL_FLOW.FOREACH:
      const items = getValueByPath(context.data, node.iterator);
      if (Array.isArray(items)) {
        for (const item of items) {
          if (iterations++ >= maxIterations) break;
          context.variables[node.variable] = item;
          results.push(item);
        }
      }
      break;

    case CONTROL_FLOW.UNTIL:
      while (!evaluateCondition(node.condition, context.data)) {
        if (iterations++ >= maxIterations) break;
        results.push(context.data);
      }
      break;
  }

  return {
    iterations,
    results,
    lastResult: results[results.length - 1] || null,
    data: context.data,  // Pass context data through loop
  };
}

/**
 * Execute parallel nodes
 */
async function executeParallel(node, context, workflow) {
  const parallelNodes = workflow.nodes.filter(n => n.type === NODE_TYPES.SKILL);
  const limit = node.limit || 5;
  const results = [];

  for (let i = 0; i < parallelNodes.length; i += limit) {
    const batch = parallelNodes.slice(i, i + limit);
    const batchResults = await Promise.all(
      batch.map(n => executeNode(n, context, workflow))
    );
    results.push(...batchResults);
  }

  switch (node.mergeStrategy) {
    case 'first':
      return results[0]?.output;
    case 'last':
      return results[results.length - 1]?.output;
    case 'array':
      return results.map(r => r.output);
    case 'all':
    default:
      return results.reduce((acc, r) => ({ ...acc, ...r.output }), {});
  }
}

/**
 * Execute error handler node
 */
async function executeErrorHandler(node, context) {
  return await node.fn(context.data);
}

/**
 * Evaluate condition
 */
async function evaluateCondition(condition, data) {
  if (typeof condition === 'function') {
    return await condition(data);
  }

  // Parse simple expressions: "data.field > 10"
  if (typeof condition === 'string') {
    return evaluateExpression(condition, data);
  }

  return Boolean(condition);
}

/**
 * Evaluate expression string
 */
function evaluateExpression(expr, data) {
  try {
    // Safe evaluation with data context
    const fn = new Function('data', `return ${expr}`);
    return fn(data);
  } catch (error) {
    return false;
  }
}

/**
 * Get value from data by path
 */
function getValueByPath(data, path) {
  return path.split('.').reduce((obj, key) => obj?.[key], data);
}

// ============================================================================
// TEMPLATE MANAGEMENT
// ============================================================================

/**
 * Template storage for reusable workflows
 */
const TemplateStorage = {
  templates: new Map(),

  /**
   * Save workflow as template
   */
  saveTemplate(name, workflow, metadata = {}) {
    const template = {
      id: `tmpl_${Date.now()}`,
      name,
      workflow,
      metadata: {
        ...metadata,
        savedAt: new Date().toISOString(),
        version: '1.0.0',
      },
      tags: metadata.tags || [],
    };

    this.templates.set(template.id, template);
    return template.id;
  },

  /**
   * Load template
   */
  loadTemplate(templateId) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    return template;
  },

  /**
   * List all templates
   */
  listTemplates(filter = {}) {
    let templates = Array.from(this.templates.values());

    if (filter.tag) {
      templates = templates.filter(t => t.tags.includes(filter.tag));
    }

    if (filter.name) {
      templates = templates.filter(t => t.name.toLowerCase().includes(filter.name.toLowerCase()));
    }

    return templates.map(t => ({
      id: t.id,
      name: t.name,
      tags: t.tags,
      savedAt: t.metadata.savedAt,
    }));
  },

  /**
   * Update template
   */
  updateTemplate(templateId, updates) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const updated = {
      ...template,
      ...updates,
      metadata: {
        ...template.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    this.templates.set(templateId, updated);
    return updated;
  },

  /**
   * Delete template
   */
  deleteTemplate(templateId) {
    const had = this.templates.has(templateId);
    this.templates.delete(templateId);
    return { deleted: had, templateId };
  },

  /**
   * Export template to JSON
   */
  exportTemplate(templateId) {
    const template = this.loadTemplate(templateId);
    return JSON.stringify(template, null, 2);
  },

  /**
   * Import template from JSON
   */
  importTemplate(jsonString, overwrite = false) {
    const template = JSON.parse(jsonString);

    if (this.templates.has(template.id) && !overwrite) {
      throw new Error(`Template already exists: ${template.id}`);
    }

    this.templates.set(template.id, template);
    return template.id;
  },

  /**
   * Clone template
   */
  cloneTemplate(templateId, newName) {
    const template = this.loadTemplate(templateId);
    const cloned = {
      ...template,
      id: `tmpl_${Date.now()}`,
      name: newName,
      metadata: {
        ...template.metadata,
        clonedFrom: templateId,
        clonedAt: new Date().toISOString(),
      },
    };

    this.templates.set(cloned.id, cloned);
    return cloned.id;
  },

  /**
   * Clear all templates
   */
  clear() {
    this.templates.clear();
    return { status: 'cleared', count: this.templates.size };
  },
};

// ============================================================================
// EXECUTION HISTORY & METRICS
// ============================================================================

/**
 * Execution history tracker
 */
const ExecutionHistory = {
  executions: [],
  maxSize: 1000,

  /**
   * Record execution
   */
  record(execution) {
    this.executions.push({
      ...execution,
      recordedAt: new Date().toISOString(),
    });

    // Trim to max size
    if (this.executions.length > this.maxSize) {
      this.executions = this.executions.slice(-this.maxSize);
    }

    return execution.id;
  },

  /**
   * Get execution
   */
  getExecution(executionId) {
    return this.executions.find(e => e.id === executionId);
  },

  /**
   * List executions
   */
  listExecutions(filter = {}) {
    let list = this.executions;

    if (filter.workflowId) {
      list = list.filter(e => e.workflowId === filter.workflowId);
    }

    if (filter.status) {
      list = list.filter(e => e.status === filter.status);
    }

    if (filter.limit) {
      list = list.slice(-filter.limit);
    }

    return list;
  },

  /**
   * Get execution metrics
   */
  getMetrics(workflowId, limit = 100) {
    const executions = this.listExecutions({ workflowId, limit });

    if (executions.length === 0) {
      return { message: 'No executions found' };
    }

    const durations = executions.map(e => e.metrics.totalDuration);
    const successCount = executions.filter(e => e.status === 'completed').length;

    return {
      totalExecutions: executions.length,
      successCount,
      failureCount: executions.length - successCount,
      successRate: ((successCount / executions.length) * 100).toFixed(2),
      avgDuration: (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2),
      minDuration: Math.min(...durations).toFixed(2),
      maxDuration: Math.max(...durations).toFixed(2),
    };
  },

  /**
   * Clear history
   */
  clear() {
    const count = this.executions.length;
    this.executions = [];
    return { cleared: count };
  },
};

// ============================================================================
// DRAG-DROP UI SIMULATION
// ============================================================================

/**
 * UI Builder for drag-drop workflow composition
 */
const UIBuilder = {
  /**
   * Generate UI schema for workflow
   */
  generateUISchema(workflow) {
    return {
      canvas: {
        width: 1200,
        height: 800,
        gridSize: 20,
      },
      nodes: workflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        label: node.name || node.type,
        position: calculateNodePosition(node, workflow),
        size: { width: 180, height: 80 },
        data: {
          nodeType: node.type,
          icon: getNodeIcon(node.type),
        },
        draggable: true,
      })),
      edges: workflow.edges.map((edge, idx) => ({
        id: edge.id,
        source: edge.from,
        target: edge.to,
        label: edge.label,
        animated: true,
        style: {
          stroke: '#666',
          strokeWidth: 2,
        },
      })),
      palette: [
        {
          category: 'Skills',
          items: [
            { type: NODE_TYPES.SKILL, label: 'Skill', icon: '⚙️' },
          ],
        },
        {
          category: 'Control Flow',
          items: [
            { type: NODE_TYPES.CONDITIONAL, label: 'Conditional', icon: '🔀' },
            { type: NODE_TYPES.LOOP, label: 'Loop', icon: '🔁' },
          ],
        },
        {
          category: 'Execution',
          items: [
            { type: NODE_TYPES.PARALLEL, label: 'Parallel', icon: '⚡' },
            { type: NODE_TYPES.ERROR_HANDLER, label: 'Error Handler', icon: '⚠️' },
          ],
        },
      ],
    };
  },

  /**
   * Validate drop operation
   */
  validateDrop(source, target, nodeType) {
    const allowedConnections = {
      [NODE_TYPES.SKILL]: [NODE_TYPES.SKILL, NODE_TYPES.CONDITIONAL, NODE_TYPES.LOOP],
      [NODE_TYPES.CONDITIONAL]: [NODE_TYPES.SKILL, NODE_TYPES.LOOP],
      [NODE_TYPES.LOOP]: [NODE_TYPES.SKILL, NODE_TYPES.CONDITIONAL],
      [NODE_TYPES.PARALLEL]: [NODE_TYPES.SKILL, NODE_TYPES.LOOP],
      [NODE_TYPES.ERROR_HANDLER]: [NODE_TYPES.SKILL, NODE_TYPES.CONDITIONAL],
    };

    const allowed = allowedConnections[source.type] || [];
    return allowed.includes(target.type);
  },
};

/**
 * Calculate node position in canvas
 */
function calculateNodePosition(node, workflow) {
  const nodeIndex = workflow.nodes.indexOf(node);
  const nodesPerRow = 4;
  const x = (nodeIndex % nodesPerRow) * 250 + 50;
  const y = Math.floor(nodeIndex / nodesPerRow) * 150 + 50;

  return { x, y };
}

/**
 * Get icon for node type
 */
function getNodeIcon(nodeType) {
  const icons = {
    [NODE_TYPES.SKILL]: '⚙️',
    [NODE_TYPES.CONDITIONAL]: '🔀',
    [NODE_TYPES.LOOP]: '🔁',
    [NODE_TYPES.PARALLEL]: '⚡',
    [NODE_TYPES.ERROR_HANDLER]: '⚠️',
  };

  return icons[nodeType] || '📦';
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createBuilder,
  executeWorkflow,
  executeNode,

  // Template management
  TemplateStorage,

  // Execution history
  ExecutionHistory,

  // UI Builder
  UIBuilder,

  // Constants
  NODE_TYPES,
  CONTROL_FLOW,
  ERROR_STRATEGIES,

  // Utilities
  validateWorkflow,
  topologicalSort,
  evaluateCondition,
  evaluateExpression,
  getValueByPath,
};
