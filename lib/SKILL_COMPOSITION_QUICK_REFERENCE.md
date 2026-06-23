# Skill Composition - Quick Reference

## Core Pattern

```javascript
const composer = require('./skill-composition');

// 1. Create builder
const builder = composer.createBuilder();

// 2. Add nodes (skills, conditionals, loops)
const id1 = builder.addSkill('step1', async (data) => transform(data));
const id2 = builder.addSkill('step2', async (data) => process(data));

// 3. Connect nodes
builder.connect(id1, id2);

// 4. Build workflow
const workflow = builder.build('myWorkflow');

// 5. Execute
const result = await composer.executeWorkflow(workflow, { data: 'input' });
console.log(result.output);
```

## Node Types Cheat Sheet

### Skill (Function)
```javascript
builder.addSkill('name', async (data, vars) => newData, {
  retries: 3,
  errorStrategy: 'retry',
  fallback: async () => defaultValue,
  timeout: 10000,
});
```

### Conditional (If/Switch)
```javascript
// If/Else
builder.addConditional(
  composer.CONTROL_FLOW.IF,
  (data) => data.value > 100
);

// Switch
builder.addConditional(
  composer.CONTROL_FLOW.SWITCH,
  null,
  { branches: { 'data.type === "A"': 'A', ... } }
);
```

### Loop (For/Foreach/While)
```javascript
// For loop
builder.addLoop(composer.CONTROL_FLOW.FOR, { condition: 5 });

// Foreach
builder.addLoop(composer.CONTROL_FLOW.FOREACH, {
  iterator: 'items',
  variable: 'item',
});

// While
builder.addLoop(composer.CONTROL_FLOW.WHILE, {
  condition: (data) => data.count < 100,
});
```

### Parallel
```javascript
builder.addParallel({
  limit: 5,
  mergeStrategy: 'all'  // 'all', 'first', 'last', 'array'
});
```

### Error Handler
```javascript
builder.addErrorHandler(async (error) => {
  return recoveryValue;
});
```

## Error Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `FAIL_FAST` | Stop on first error | Critical operations |
| `RETRY` | Retry N times | Unreliable APIs |
| `FALLBACK` | Use alternate function | Graceful degradation |
| `CONTINUE` | Keep executing | Non-blocking steps |
| `SKIP` | Ignore silently | Optional steps |

## Execution Result Structure

```javascript
{
  id: 'exec_123',
  status: 'completed',        // completed, failed, running
  output: { /* result */ },
  steps: [
    {
      nodeId: 'skill_0',
      nodeName: 'validate',
      status: 'success',      // success, error, fallback
      duration: 45,           // milliseconds
      output: { /* data */ },
    },
  ],
  metrics: {
    totalDuration: 234,
    successRate: '100.00',
    errorCount: 0,
  },
}
```

## Template Management

```javascript
// Save
const id = composer.TemplateStorage.saveTemplate(
  'myTemplate',
  workflow,
  { tags: ['tag1', 'tag2'] }
);

// List
const templates = composer.TemplateStorage.listTemplates({ tag: 'tag1' });

// Load & execute
const template = composer.TemplateStorage.loadTemplate(id);
const result = await composer.executeWorkflow(template.workflow, data);

// Clone
const clonedId = composer.TemplateStorage.cloneTemplate(id, 'newName');

// Delete
composer.TemplateStorage.deleteTemplate(id);
```

## History & Metrics

```javascript
// List executions
const execs = composer.ExecutionHistory.listExecutions({
  workflowId: 'myWorkflow',
  status: 'completed',
  limit: 10,
});

// Get metrics
const metrics = composer.ExecutionHistory.getMetrics('myWorkflow');
// { totalExecutions, successCount, successRate, avgDuration, ... }
```

## Validation & Build

```javascript
// Validate workflow
const validation = composer.validateWorkflow(nodes, edges);
if (!validation.valid) {
  console.log(validation.errors);
}

// Topologically sort nodes
const sorted = composer.topologicalSort(nodes, edges);
```

## Constants

```javascript
// Node Types
composer.NODE_TYPES.SKILL
composer.NODE_TYPES.CONDITIONAL
composer.NODE_TYPES.LOOP
composer.NODE_TYPES.PARALLEL
composer.NODE_TYPES.ERROR_HANDLER

// Control Flow
composer.CONTROL_FLOW.IF
composer.CONTROL_FLOW.ELSE
composer.CONTROL_FLOW.ELSE_IF
composer.CONTROL_FLOW.SWITCH
composer.CONTROL_FLOW.FOR
composer.CONTROL_FLOW.WHILE
composer.CONTROL_FLOW.FOREACH
composer.CONTROL_FLOW.UNTIL

// Error Strategies
composer.ERROR_STRATEGIES.FAIL_FAST
composer.ERROR_STRATEGIES.RETRY
composer.ERROR_STRATEGIES.FALLBACK
composer.ERROR_STRATEGIES.CONTINUE
composer.ERROR_STRATEGIES.SKIP
```

## Common Patterns

### Data Pipeline
```javascript
builder.addSkill('validate', validateFn);
builder.addSkill('filter', filterFn);
builder.addSkill('transform', transformFn);
builder.addSkill('aggregate', aggregateFn);
// Connect in sequence
```

### Error Recovery
```javascript
builder.addSkill('primary', primaryFn, {
  errorStrategy: 'fallback',
  fallback: fallbackFn,
});
```

### Conditional Routing
```javascript
const cond = builder.addConditional('if', (data) => data.type === 'A');
const skillA = builder.addSkill('processA', fnA);
const skillB = builder.addSkill('processB', fnB);
builder.connect(cond, skillA);
builder.connect(cond, skillB);
```

### Batch Processing
```javascript
builder.addSkill('prepare', prepareFn);
const loop = builder.addLoop('foreach', { iterator: 'items', variable: 'item' });
builder.addSkill('processItem', itemFn);
builder.addSkill('finalize', finalizeFn);
// Connect: prepare → loop → processItem → finalize
```

## CLI Examples

```bash
# Create workflow
skill-composition create emailWorkflow

# Add skills
skill-composition add-skill emailWorkflow validate
skill-composition add-skill emailWorkflow normalize

# Execute
skill-composition execute emailWorkflow '{"email":"USER@EXAMPLE.COM"}'

# Save template
skill-composition template save emailWorkflow emailValidation

# View metrics
skill-composition metrics emailWorkflow

# Export/import
skill-composition export emailWorkflow > workflow.json
skill-composition import workflow.json
```

## Performance Tips

1. Set appropriate timeouts: `timeout: 5000`
2. Limit retries: `retries: 3`
3. Control parallelism: `parallelLimit: 5`
4. Prevent infinite loops: `maxIterations: 1000`
5. Monitor metrics regularly
6. Archive old templates

## Debugging

```javascript
// Check workflow validity
const validation = composer.validateWorkflow(workflow.nodes, workflow.edges);
console.log(validation.errors);

// Inspect execution steps
result.steps.forEach((step, i) => {
  console.log(`${i}: ${step.nodeName} - ${step.status}`);
});

// Check error details
result.errors.forEach(err => {
  console.log(`${err.nodeId}: ${err.error.message}`);
});

// Review metrics
console.log(`Duration: ${result.metrics.totalDuration}ms`);
console.log(`Success: ${result.metrics.successRate}%`);
```

## Integration Example

```javascript
// Complete workflow
const builder = composer.createBuilder();

// 1. Validate input
const validate = builder.addSkill('validate', async (data) => {
  if (!data.email) throw new Error('Missing email');
  return data;
}, { retries: 1 });

// 2. Conditional: check if premium
const isPremium = builder.addConditional(
  'if',
  (data) => data.plan === 'premium'
);

// 3. Premium path
const premiumProcess = builder.addSkill('premiumProcess', async (data) => {
  return { ...data, features: ['advanced'] };
});

// 4. Standard path
const standardProcess = builder.addSkill('standardProcess', async (data) => {
  return { ...data, features: ['basic'] };
});

// 5. Normalize
const normalize = builder.addSkill('normalize', async (data) => {
  return { ...data, processed: true };
});

// Connect
builder.connect(validate, isPremium);
builder.connect(isPremium, premiumProcess);
builder.connect(isPremium, standardProcess);
builder.connect(premiumProcess, normalize);
builder.connect(standardProcess, normalize);

// Build and execute
const workflow = builder.build('userProcessing');
const result = await composer.executeWorkflow(workflow, {
  email: 'user@example.com',
  plan: 'premium',
});
```

## Resources

- Main documentation: `SKILL_COMPOSITION_README.md`
- Test suite: `skill-composition.test.js`
- Examples: `skill-composition-integration-example.js`
- CLI: `skill-composition-cli.js`
