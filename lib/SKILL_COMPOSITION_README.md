# Skill Composition Engine

**Compose skills into reusable workflows with visual drag-drop UI, error handling, conditional routing, loops, and template storage.**

## Overview

Skill Composition provides a complete workflow orchestration system for Claude Code:

- **Drag-drop UI builder** for visually composing skill chains
- **Error handling strategies** (retry, fallback, skip, fail-fast)
- **Conditional routing** (if/else/switch) for branching logic
- **Loop support** (for/while/foreach/until) for batch processing
- **Parallel execution** for concurrent skill processing
- **Template storage** for reusable workflow templates
- **Execution history** and metrics tracking
- **Type-safe node system** with validation

## Quick Start

### Installation

```bash
npm install claudient
```

### Basic Workflow

```javascript
const composer = require('./skill-composition');

// Create builder
const builder = composer.createBuilder();

// Add skills
const validateId = builder.addSkill('validate', async (data) => {
  if (!data.email) throw new Error('Missing email');
  return data;
});

const normalizeId = builder.addSkill('normalize', async (data) => {
  return { ...data, email: data.email.toLowerCase() };
});

// Connect skills
builder.connect(validateId, normalizeId);

// Build workflow
const workflow = builder.build('emailWorkflow');

// Execute
const result = await composer.executeWorkflow(workflow, {
  email: 'USER@EXAMPLE.COM'
});

console.log(result.output); // { email: 'user@example.com' }
```

## Architecture

### Core Components

#### 1. **Workflow Builder**

Create and compose workflows programmatically:

```javascript
const builder = composer.createBuilder({
  timeout: 30000,      // Node timeout in ms
  retryCount: 3,       // Default retry attempts
  parallelLimit: 5,    // Max parallel tasks
});
```

#### 2. **Node Types**

Five primary node types for workflow composition:

**Skill Node** - Execute async function
```javascript
const skillId = builder.addSkill(
  'processData',
  async (data, variables) => {
    return transformedData;
  },
  {
    retries: 3,
    timeout: 10000,
    errorStrategy: 'retry',
    fallback: async (data, error) => defaultValue,
  }
);
```

**Conditional Node** - Route based on conditions
```javascript
const condId = builder.addConditional(
  'if',  // 'if', 'else_if', 'switch'
  (data) => data.value > 100,
  {
    branches: { /* optional switch branches */ },
    defaultBranch: 'fallback',
  }
);
```

**Loop Node** - Repeat processing
```javascript
const loopId = builder.addLoop(
  'foreach',  // 'for', 'while', 'until', 'foreach'
  {
    iterator: 'items',      // Data path for foreach
    variable: 'item',       // Variable name
    condition: 10,          // Max iterations for for/while
    maxIterations: 1000,    // Safety limit
  }
);
```

**Parallel Node** - Concurrent execution
```javascript
const parallelId = builder.addParallel({
  limit: 5,                    // Concurrency limit
  mergeStrategy: 'all',        // 'all', 'first', 'last', 'array'
});
```

**Error Handler Node** - Custom error handling
```javascript
const errorId = builder.addErrorHandler(
  async (error) => {
    // Handle error
    return recoveryValue;
  },
  { errorTypes: ['TimeoutError', 'ValidationError'] }
);
```

#### 3. **Connections**

Link nodes in workflow:

```javascript
builder.connect(fromNodeId, toNodeId, {
  label: 'success',
  condition: (data) => data.status === 'ok',
  metadata: { /* custom metadata */ },
});
```

#### 4. **Workflow Build & Execution**

Build workflow structure:

```javascript
const workflow = builder.build('myWorkflow');
// Validates structure, topologically sorts nodes
```

Execute with data:

```javascript
const result = await composer.executeWorkflow(workflow, inputData, {
  variables: { userId: 123 },
  timeout: 30000,
});

// Result structure:
{
  id: 'exec_1234567890',
  workflowId: 'myWorkflow',
  status: 'completed|failed|running',
  output: { /* final result */ },
  steps: [
    {
      nodeId: 'skill_0',
      nodeName: 'validate',
      nodeType: 'skill',
      status: 'success|error|fallback',
      duration: 45,  // ms
      output: { /* step output */ },
    },
  ],
  errors: [
    { nodeId: 'skill_0', error: Error, strategy: 'retry' }
  ],
  metrics: {
    totalDuration: 234,
    stepCount: 3,
    errorCount: 1,
    successRate: '66.67',
  },
}
```

## Error Handling

### Strategies

**FAIL_FAST** (default) - Stop on first error
```javascript
builder.addSkill('task', taskFn, {
  errorStrategy: composer.ERROR_STRATEGIES.FAIL_FAST,
});
```

**RETRY** - Attempt multiple times
```javascript
builder.addSkill('api', apiFn, {
  errorStrategy: composer.ERROR_STRATEGIES.RETRY,
  retries: 3,
  timeout: 5000,
});
```

**FALLBACK** - Use alternate function
```javascript
builder.addSkill('primary', primaryFn, {
  errorStrategy: composer.ERROR_STRATEGIES.FALLBACK,
  fallback: async (data, error) => cachedData,
});
```

**CONTINUE** - Keep executing
```javascript
builder.addSkill('optional', optionalFn, {
  errorStrategy: composer.ERROR_STRATEGIES.CONTINUE,
});
```

**SKIP** - Ignore errors silently
```javascript
builder.addSkill('nonCritical', fn, {
  errorStrategy: composer.ERROR_STRATEGIES.SKIP,
});
```

## Conditional Routing

### If/Else

```javascript
const condId = builder.addConditional(
  composer.CONTROL_FLOW.IF,
  (data) => data.priority === 'high'
);

const skillAId = builder.addSkill('processHigh', highPriorityFn);
const skillBId = builder.addSkill('processLow', lowPriorityFn);

builder.connect(condId, skillAId, { condition: true });
builder.connect(condId, skillBId, { condition: false });
```

### Switch

```javascript
const switchId = builder.addConditional(
  composer.CONTROL_FLOW.SWITCH,
  null,
  {
    branches: {
      'data.type === "email"': 'emailPath',
      'data.type === "sms"': 'smsPath',
    },
    defaultBranch: 'unknownPath',
  }
);
```

## Loops

### For Loop

```javascript
const loopId = builder.addLoop(composer.CONTROL_FLOW.FOR, {
  condition: 5,        // Run 5 times
  maxIterations: 1000,
});
```

### ForEach Loop

```javascript
const loopId = builder.addLoop(composer.CONTROL_FLOW.FOREACH, {
  iterator: 'items',   // Array in data.items
  variable: 'item',    // Access as vars.item
  maxIterations: 1000,
});

// Inside skill callback:
builder.addSkill('processItem', async (data, vars) => {
  const item = vars.item;  // Current item
  return processedData;
});
```

### While Loop

```javascript
const loopId = builder.addLoop(composer.CONTROL_FLOW.WHILE, {
  condition: (data) => data.count < 100,
  maxIterations: 1000,
});
```

## Template Management

### Save Workflow as Template

```javascript
const templateId = composer.TemplateStorage.saveTemplate(
  'emailValidation',
  workflow,
  {
    tags: ['validation', 'email'],
    description: 'Validates email addresses',
  }
);
```

### List Templates

```javascript
const templates = composer.TemplateStorage.listTemplates({
  tag: 'validation',  // Optional filter
  name: 'email',      // Optional search
});

// Returns:
// [
//   { id, name, tags, savedAt },
//   ...
// ]
```

### Load & Reuse

```javascript
const template = composer.TemplateStorage.loadTemplate(templateId);
const result = await composer.executeWorkflow(
  template.workflow,
  inputData
);
```

### Clone Template

```javascript
const clonedId = composer.TemplateStorage.cloneTemplate(
  originalId,
  'emailValidationV2'
);
```

### Export/Import

```javascript
// Export to JSON
const json = composer.TemplateStorage.exportTemplate(templateId);
fs.writeFileSync('workflow.json', json);

// Import from JSON
const imported = JSON.parse(fs.readFileSync('workflow.json'));
const importedId = composer.TemplateStorage.importTemplate(
  JSON.stringify(imported)
);
```

## Execution History

### Record Executions

Automatically recorded when workflows execute:

```javascript
const result = await composer.executeWorkflow(workflow, data);
// Execution recorded in ExecutionHistory
```

### Query History

```javascript
// List specific workflow executions
const executions = composer.ExecutionHistory.listExecutions({
  workflowId: 'myWorkflow',
  status: 'completed',
  limit: 50,
});

// Get single execution
const exec = composer.ExecutionHistory.getExecution('exec_1234');
```

### Get Metrics

```javascript
const metrics = composer.ExecutionHistory.getMetrics('myWorkflow', 100);
// Returns:
// {
//   totalExecutions: 100,
//   successCount: 95,
//   failureCount: 5,
//   successRate: '95.00',
//   avgDuration: '234.56',
//   minDuration: '100.00',
//   maxDuration: '500.00',
// }
```

## UI Generation

Generate schema for visual workflow builder:

```javascript
const schema = composer.UIBuilder.generateUISchema(workflow);

// Schema structure:
{
  canvas: {
    width: 1200,
    height: 800,
    gridSize: 20,
  },
  nodes: [
    {
      id: 'skill_0',
      type: 'skill',
      label: 'validate',
      position: { x: 50, y: 50 },
      size: { width: 180, height: 80 },
      data: { nodeType: 'skill', icon: '⚙️' },
      draggable: true,
    },
  ],
  edges: [
    {
      id: 'edge_0',
      source: 'skill_0',
      target: 'skill_1',
      label: 'success',
      animated: true,
    },
  ],
  palette: [
    {
      category: 'Skills',
      items: [{ type: 'skill', label: 'Skill', icon: '⚙️' }],
    },
    // ... more categories
  ],
}
```

## CLI Tool

### Usage

```bash
# Create workflow
skill-composition create emailWorkflow

# List workflows
skill-composition list

# Add skill
skill-composition add-skill emailWorkflow validate

# Build & validate
skill-composition build emailWorkflow

# Execute workflow
skill-composition execute emailWorkflow '{"email":"user@example.com"}'

# Save as template
skill-composition template save emailWorkflow emailValidation

# List templates
skill-composition template list

# Show execution history
skill-composition history list emailWorkflow

# Get metrics
skill-composition metrics emailWorkflow

# Export/import
skill-composition export emailWorkflow > workflow.json
skill-composition import workflow.json

# Generate UI schema
skill-composition ui emailWorkflow
```

## Advanced Examples

### Data Processing Pipeline

```javascript
const builder = composer.createBuilder();

// Validate → Filter → Transform → Aggregate
builder.addSkill('validate', validateFn);
builder.addSkill('filter', filterFn);
builder.addSkill('transform', transformFn);
builder.addSkill('aggregate', aggregateFn);

// Connect in sequence
const v = builder.nodes[0].id;
const f = builder.nodes[1].id;
const t = builder.nodes[2].id;
const a = builder.nodes[3].id;

builder.connect(v, f);
builder.connect(f, t);
builder.connect(t, a);

const workflow = builder.build('dataPipeline');
```

### Error Recovery Pattern

```javascript
const builder = composer.createBuilder();

// Primary path with retry
builder.addSkill('fetchData', fetchFn, {
  errorStrategy: 'retry',
  retries: 3,
  fallback: () => cachedData,
});

// Use fallback on error
builder.addSkill('process', processFn, {
  errorStrategy: 'fallback',
  fallback: () => defaultResult,
});

const workflow = builder.build('resilient');
```

### Conditional Processing

```javascript
const builder = composer.createBuilder();

// Process based on data type
const condId = builder.addConditional(
  'switch',
  null,
  {
    branches: {
      'data.type === "user"': 'userPath',
      'data.type === "order"': 'orderPath',
    },
  }
);

const userSkill = builder.addSkill('processUser', userFn);
const orderSkill = builder.addSkill('processOrder', orderFn);

builder.connect(condId, userSkill);
builder.connect(condId, orderSkill);
```

### Batch Processing

```javascript
const builder = composer.createBuilder();

// Prepare batch
builder.addSkill('prepare', prepareFn);

// Loop over items
const loopId = builder.addLoop('foreach', {
  iterator: 'items',
  variable: 'item',
});

// Process each item
builder.addSkill('processItem', itemProcessFn);

// Finalize
builder.addSkill('finalize', finalizeFn);

// Connect
const p = builder.nodes[0].id;
const l = builder.nodes[1].id;
const pi = builder.nodes[2].id;
const f = builder.nodes[3].id;

builder.connect(p, l);
builder.connect(l, pi);
builder.connect(pi, f);
```

## API Reference

### Builder Methods

- `addSkill(name, fn, options)` - Add skill node
- `addConditional(type, condition, options)` - Add conditional node
- `addLoop(type, options)` - Add loop node
- `addParallel(options)` - Add parallel execution node
- `addErrorHandler(fn, options)` - Add error handler
- `connect(fromId, toId, options)` - Connect nodes
- `build(name)` - Build workflow
- `exportJSON()` - Export as JSON
- `clear()` - Clear all nodes/edges

### Execution Functions

- `executeWorkflow(workflow, input, options)` - Execute workflow
- `executeNode(node, context, workflow)` - Execute single node
- `validateWorkflow(nodes, edges)` - Validate structure
- `topologicalSort(nodes, edges)` - Sort execution order

### Storage

- `TemplateStorage.saveTemplate(name, workflow, metadata)` - Save template
- `TemplateStorage.loadTemplate(id)` - Load template
- `TemplateStorage.listTemplates(filter)` - List templates
- `TemplateStorage.cloneTemplate(id, newName)` - Clone template
- `TemplateStorage.exportTemplate(id)` - Export as JSON
- `TemplateStorage.importTemplate(json, overwrite)` - Import from JSON
- `TemplateStorage.deleteTemplate(id)` - Delete template

### History & Metrics

- `ExecutionHistory.record(execution)` - Record execution
- `ExecutionHistory.getExecution(id)` - Get execution details
- `ExecutionHistory.listExecutions(filter)` - List executions
- `ExecutionHistory.getMetrics(workflowId, limit)` - Get metrics
- `ExecutionHistory.clear()` - Clear history

### UI Builder

- `UIBuilder.generateUISchema(workflow)` - Generate UI schema
- `UIBuilder.validateDrop(source, target)` - Validate node connection

## Performance Considerations

1. **Timeouts** - Set appropriate timeouts for long-running skills
2. **Retries** - Balance retry attempts with failure detection
3. **Parallel Limit** - Control concurrency to avoid resource exhaustion
4. **Max Iterations** - Prevent infinite loops with iteration limits
5. **History Size** - Execution history is limited to 1000 recent executions
6. **Memory** - Large workflows stay in memory; consider archiving old templates

## Best Practices

1. **Error Handling** - Always specify error strategy for critical skills
2. **Validation** - Validate input at workflow start
3. **Timeouts** - Set reasonable timeouts to prevent hanging
4. **Monitoring** - Track execution metrics for performance insights
5. **Templates** - Save reusable workflows as templates
6. **Composition** - Break complex workflows into smaller, composable skills
7. **Testing** - Test individual skills and complete workflows

## Limitations

- Functions must be JSON-serializable for template export
- Maximum 1000 nodes per workflow (recommended: <100)
- Execution history limited to 1000 recent executions
- No persistent storage (use templates for saving workflows)
- No built-in UI implementation (schema provided for custom UI)

## See Also

- `skill-composition.js` - Core engine implementation
- `skill-composition.test.js` - Comprehensive test suite
- `skill-composition-integration-example.js` - Real-world examples
- `skill-composition-cli.js` - Command-line interface
