# Task Executor Quick Reference

One-page cheat sheet for TaskExecutor.

## Import

```javascript
const TaskExecutor = require('./lib/task-executor')
```

## Create Instance

```javascript
// Minimal
const executor = new TaskExecutor()

// With options
const executor = new TaskExecutor({
  workdir: '/path/to/project',
  timeout: 300000,        // 5 minutes
  verbose: true,
  agentBinary: 'claude'
})
```

## Execute Task

```javascript
// Auto-detect type
const result = await executor.route(task)

// Specify type manually
const result = await executor.executeCodeTask(task)
const result = await executor.executeTestTask(task)
const result = await executor.executeDocsTask(task)
const result = await executor.executeInfraTask(task)
const result = await executor.executeDeployTask(task)
```

## Task Object

```javascript
{
  id: 'task-001',                    // Unique ID
  name: 'Task name',                 // Required
  type: 'code',                      // 'code'|'test'|'docs'|'infra'|'deploy'
  description: 'What to do',         // Required
  content: 'More details',           // Optional
  
  // Code tasks
  files: ['src/auth.js'],            // Files to modify
  requirements: ['Use JWT'],         // Requirements
  
  // Test tasks
  command: 'npm test',               // Test command
  
  // Docs tasks
  outline: '- Overview\n- Usage',    // Structure
  audience: 'Developers',            // Target audience
  
  // Infra/Deploy tasks
  scriptPath: './deploy.sh',         // Path to script
  environment: 'production',         // Environment
  targetPlatform: 'AWS',             // Platform
  constraints: 'Zero downtime',      // Constraints
  rollbackPlan: 'true'               // Has rollback?
}
```

## Events

```javascript
executor.on('route', (event) => {
  console.log(event.taskType)  // 'code' | 'test' | ...
})

executor.on('start', (event) => {
  console.log(event.taskId, event.type)
})

executor.on('complete', (event) => {
  console.log(event.metrics)   // { duration, success, ... }
})

executor.on('error', (event) => {
  console.error(event.error)
  console.log(event.metrics)
})
```

## Task Types

| Type | Triggered By | Executor | Metrics |
|------|--------------|----------|---------|
| `code` | function, class, bug, feature, implement | Claude agent | tokens, duration |
| `test` | test, jest, mocha, cypress, spec | npm/bash command | duration, passed, failed |
| `docs` | document, readme, guide, markdown | Claude agent | tokens, duration, words |
| `infra` | docker, terraform, kubernetes, ansible | Bash script or agent | duration, script, stderr |
| `deploy` | deploy, release, ci/cd, github actions | Bash script or agent | duration, environment, stderr |

## Result Object

```javascript
{
  success: true,
  output: 'Generated output...',
  exitCode: 0,
  taskId: 'task-001',
  metrics: {
    type: 'code',
    duration: 12345,
    success: true,
    tokensUsed: 500,
    output: '...',
    // Type-specific
    testsPassed: 42,        // test
    testsFailed: 0,         // test
    wordsGenerated: 1234,   // docs
    script: './path.sh',    // infra/deploy
    stderr: '',             // infra/deploy
    environment: 'prod'     // deploy
  }
}
```

## Metrics

```javascript
// Get all metrics
const all = executor.getMetrics()
// { 'task-001': {...}, 'task-002': {...} }

// Get task metrics
const metrics = executor.getTaskMetrics('task-001')

// Clear metrics
executor.clearMetrics()
```

## Type Detection

```javascript
const type = executor.detectTaskType({
  name: 'test-auth.test.js',
  description: 'Test authentication',
  content: 'describe("auth", () => {...})'
})
// → 'test'
```

**Detection patterns:**
- `test` ← test, spec, jest, mocha, cypress, .test., .spec.
- `docs` ← document, readme, guide, markdown, .md
- `infra` ← docker, kubernetes, terraform, ansible, helm, k8s
- `deploy` ← deploy, release, ci/cd, github actions, gitlab ci, workflow
- `code` ← function, class, bug, feature, implement, .js, .ts, src/

## Common Examples

### Code task
```javascript
const task = {
  name: 'Implement login',
  type: 'code',
  description: 'Add JWT auth middleware',
  files: ['src/auth.js'],
  requirements: ['Use jsonwebtoken', 'Validate tokens']
}
const result = await executor.route(task)
```

### Test task
```javascript
const task = {
  name: 'Run tests',
  type: 'test',
  command: 'npm test -- --coverage'
}
const result = await executor.route(task)
console.log(`Passed: ${result.metrics.testsPassed}`)
```

### Docs task
```javascript
const task = {
  name: 'API docs',
  type: 'docs',
  description: 'Document REST API',
  outline: '- Overview\n- Endpoints',
  audience: 'Backend devs'
}
const result = await executor.route(task)
```

### Infra task
```javascript
const task = {
  name: 'Deploy DB',
  type: 'infra',
  scriptPath: './scripts/terraform.sh',
  environment: 'staging'
}
const result = await executor.route(task)
```

### Deploy task
```javascript
const task = {
  name: 'Production release',
  type: 'deploy',
  scriptPath: './scripts/deploy-prod.sh',
  environment: 'production'
}
const result = await executor.route(task)
```

### Batch processing
```javascript
const tasks = [
  { name: 'unit tests', type: 'test', command: 'npm test' },
  { name: 'docs', type: 'docs', description: 'Write docs' },
  { name: 'deploy', type: 'deploy', scriptPath: './deploy.sh' }
]

for (const task of tasks) {
  const result = await executor.route(task)
  console.log(`${task.name}: ${result.metrics.success ? '✓' : '✗'}`)
}

const allMetrics = executor.getMetrics()
```

### Monitored execution
```javascript
const executor = new TaskExecutor({ verbose: true })

executor.on('start', (e) => console.log(`▶ ${e.taskId}`))
executor.on('complete', (e) => {
  console.log(`✓ ${e.taskId}`)
  console.log(`  Duration: ${e.metrics.duration}ms`)
})
executor.on('error', (e) => {
  console.error(`✗ ${e.taskId}: ${e.error.message}`)
})

await executor.route(task)
```

### Error handling
```javascript
try {
  const result = await executor.route(task)
  if (!result.metrics.success) {
    throw new Error(`Task failed: ${result.metrics.error}`)
  }
} catch (error) {
  console.error(error.message)
}
```

## Prompts

### Code task prompt
```
Task: {name}

Description:
{description}

Files:
- src/auth.js
- src/routes/auth.js

Requirements:
- Use jsonwebtoken
- Validate tokens
- Return 401 on invalid
```

### Docs task prompt
```
Task: {name}

Description:
{description}

Outline:
- Overview
- Usage
- Examples

Audience: Developers
```

### Infra task prompt
```
Task: {name}

Description:
{description}

Platform: AWS

Constraints:
- Preserve data
- Zero downtime
```

## Config

### Global timeout
```javascript
new TaskExecutor({ timeout: 600000 })  // 10 min
```

### Verbose logging
```javascript
new TaskExecutor({ verbose: true })
```

### Custom workdir
```javascript
new TaskExecutor({ workdir: '/path/to/project' })
```

### Custom agent
```javascript
new TaskExecutor({ agentBinary: '/usr/local/bin/claude' })
```

## Patterns

### Chain tasks
```javascript
const result1 = await executor.executeCodeTask(task1)
const result2 = await executor.executeTestTask(task2)
const result3 = await executor.executeDocsTask(task3)
```

### Conditional execution
```javascript
const result = await executor.route(task)
if (result.metrics.success) {
  await executor.route(nextTask)
}
```

### Parallel execution (be careful with agent limits)
```javascript
const results = await Promise.all([
  executor.route(task1),
  executor.route(task2),
  executor.route(task3)
])
```

### Workflow pipeline
```javascript
const workflow = [
  { name: 'tests', type: 'test', command: 'npm test' },
  { name: 'docs', type: 'docs', description: 'Write API docs' },
  { name: 'deploy', type: 'deploy', scriptPath: './deploy.sh' }
]

for (const task of workflow) {
  try {
    await executor.route(task)
  } catch (error) {
    console.error(`Workflow failed at ${task.name}`)
    break
  }
}
```

## Helpers

### Detect type only
```javascript
const type = executor.detectTaskType(task)
```

### Get task metrics
```javascript
const metrics = executor.getTaskMetrics(taskId)
console.log(metrics.duration)
console.log(metrics.tokensUsed)
console.log(metrics.success)
```

### Summary report
```javascript
const metrics = executor.getMetrics()
for (const [id, m] of Object.entries(metrics)) {
  console.log(`${id}: ${m.type} (${m.duration}ms, ${m.success ? '✓' : '✗'})`)
}
```

## Files

- `task-executor.js` — Core (624 lines)
- `task-executor.example.js` — Examples (366 lines)
- `README.md` — Full docs
- `INTEGRATION_GUIDE.md` — Integration patterns
- `QUICK_REFERENCE.md` — This file

## Performance

| Operation | Time |
|-----------|------|
| Task type detection | <1ms |
| Spawn agent | 100-500ms |
| Run command | Variable (bash/test dependent) |
| Metrics collection | <1ms |

## Limits

- Default timeout: 5 minutes (300,000ms)
- Max task name: No limit
- Max description: No limit
- Concurrent tasks: Limited by agent/bash resource limits

## Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `ENOENT: spawn('claude')` | Agent not in PATH | Use full path |
| `Task timed out` | Execution exceeded timeout | Increase timeout |
| `EACCES: permission denied` | Script not executable | `chmod +x script.sh` |
| `Command not found` | Test command invalid | Verify command exists |

## Tips

1. **Auto-type detection works well** — Only set type if detection fails
2. **Use event listeners** — Better UX than callbacks
3. **Batch similar tasks** — Tests first, then docs, then deploy
4. **Set appropriate timeout** — Don't use default 5min for quick tasks
5. **Handle errors gracefully** — Tasks can fail; have fallbacks
6. **Monitor metrics** — Track duration, tokens, success rate
7. **Clear metrics periodically** — Prevent unbounded growth
8. **Use descriptive task names** — Makes logs readable
9. **Include requirements** — Helps Claude understand requirements
10. **Test locally first** — Verify task works before adding to workflow

---

For full documentation, see `README.md` and `INTEGRATION_GUIDE.md`.
