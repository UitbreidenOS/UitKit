// task-executor.example.js — Usage examples and integration patterns
const TaskExecutor = require('./task-executor')

/**
 * Example 1: Basic code task execution
 */
async function exampleCodeTask() {
  const executor = new TaskExecutor({
    workdir: process.cwd(),
    verbose: true
  })

  const codeTask = {
    id: 'task-001',
    name: 'Add authentication middleware',
    type: 'code',
    description: 'Implement JWT authentication middleware for Express.js',
    content: 'Create a middleware function that validates JWT tokens',
    files: ['src/middleware/auth.js', 'src/routes/protected.js'],
    requirements: [
      'Use jsonwebtoken library',
      'Validate token signature',
      'Return 401 on invalid token',
      'Add token to request context'
    ]
  }

  executor.on('start', (event) => {
    console.log(`Starting: ${event.type} task (${event.taskId})`)
  })

  executor.on('complete', (event) => {
    console.log(`Complete: ${event.taskId}`)
    console.log(`Duration: ${event.metrics.duration}ms`)
    console.log(`Tokens: ${event.metrics.tokensUsed}`)
  })

  executor.on('error', (event) => {
    console.error(`Error in ${event.taskId}: ${event.error.message}`)
  })

  try {
    const result = await executor.run(codeTask)
    console.log('Result:', result.output)
  } catch (error) {
    console.error('Task failed:', error.message)
  }
}

/**
 * Example 2: Test task execution
 */
async function exampleTestTask() {
  const executor = new TaskExecutor({
    workdir: process.cwd(),
    timeout: 60000
  })

  const testTask = {
    id: 'task-002',
    name: 'Run authentication tests',
    type: 'test',
    description: 'Execute all tests in test/auth.test.js',
    command: 'npm test -- test/auth.test.js'
  }

  try {
    const result = await executor.route(testTask)
    console.log('Test Results:')
    console.log(`  Passed: ${result.metrics.testsPassed}`)
    console.log(`  Failed: ${result.metrics.testsFailed}`)
    console.log(`  Duration: ${result.metrics.duration}ms`)
    console.log(`  Success: ${result.metrics.success}`)
  } catch (error) {
    console.error('Test execution failed:', error.message)
  }
}

/**
 * Example 3: Documentation task
 */
async function exampleDocsTask() {
  const executor = new TaskExecutor()

  const docsTask = {
    id: 'task-003',
    name: 'API documentation',
    type: 'docs',
    subject: 'Document REST API endpoints',
    description: 'Generate comprehensive API documentation',
    outline: `
      - Overview
      - Authentication
      - Endpoints (GET, POST, PUT, DELETE)
      - Error Handling
      - Examples
    `,
    audience: 'Backend developers'
  }

  try {
    const result = await executor.route(docsTask)
    console.log('Documentation generated:')
    console.log(`  Words: ${result.metrics.wordsGenerated}`)
    console.log(`  Tokens: ${result.metrics.tokensUsed}`)
  } catch (error) {
    console.error('Doc generation failed:', error.message)
  }
}

/**
 * Example 4: Infrastructure task with script
 */
async function exampleInfraTask() {
  const executor = new TaskExecutor({
    workdir: process.cwd()
  })

  const infraTask = {
    id: 'task-004',
    name: 'Deploy database migrations',
    type: 'infra',
    description: 'Run Terraform to provision new database',
    targetPlatform: 'AWS',
    scriptPath: './scripts/deploy-infra.sh',
    constraints: 'Must preserve existing data'
  }

  try {
    const result = await executor.route(infraTask)
    console.log('Infrastructure deployment:')
    console.log(`  Status: ${result.metrics.success ? 'Success' : 'Failed'}`)
    console.log(`  Duration: ${result.metrics.duration}ms`)
    if (result.metrics.stderr) {
      console.log(`  Errors: ${result.metrics.stderr}`)
    }
  } catch (error) {
    console.error('Infrastructure deployment failed:', error.message)
  }
}

/**
 * Example 5: Deployment task
 */
async function exampleDeployTask() {
  const executor = new TaskExecutor({
    workdir: process.cwd(),
    timeout: 300000 // 5 minutes
  })

  const deployTask = {
    id: 'task-005',
    name: 'Production deployment',
    type: 'deploy',
    description: 'Deploy new version to production',
    environment: 'production',
    scriptPath: './scripts/deploy-prod.sh',
    rollbackPlan: 'true'
  }

  executor.on('complete', (event) => {
    if (event.metrics.success) {
      console.log(`✓ Deployment successful in ${event.metrics.duration}ms`)
    } else {
      console.log(`✗ Deployment failed`)
    }
  })

  try {
    const result = await executor.route(deployTask)
    return result
  } catch (error) {
    console.error('Deployment failed:', error.message)
  }
}

/**
 * Example 6: Batch task execution with metrics collection
 */
async function exampleBatchTasks() {
  const executor = new TaskExecutor()

  const tasks = [
    {
      id: 'batch-001',
      name: 'Unit tests',
      description: 'Run unit tests',
      content: 'jest --coverage'
    },
    {
      id: 'batch-002',
      name: 'Integration tests',
      description: 'Run integration tests',
      content: 'npm run test:integration'
    },
    {
      id: 'batch-003',
      name: 'Lint code',
      description: 'Check code style',
      content: 'eslint src/'
    }
  ]

  console.log('Executing batch of tasks...\n')

  const results = []
  for (const task of tasks) {
    try {
      const result = await executor.route(task)
      results.push({ task: task.id, success: true, result })
    } catch (error) {
      results.push({ task: task.id, success: false, error: error.message })
    }
  }

  // Summary
  console.log('\nBatch Summary:')
  console.log('==============')

  const metrics = executor.getMetrics()
  Object.entries(metrics).forEach(([taskId, metric]) => {
    console.log(`\n${taskId}:`)
    console.log(`  Type: ${metric.type}`)
    console.log(`  Success: ${metric.success}`)
    console.log(`  Duration: ${metric.duration}ms`)
    if (metric.tokensUsed) console.log(`  Tokens: ${metric.tokensUsed}`)
    if (metric.testsPassed !== undefined) {
      console.log(`  Tests Passed: ${metric.testsPassed}`)
      console.log(`  Tests Failed: ${metric.testsFailed}`)
    }
  })

  return results
}

/**
 * Example 7: Task type detection
 */
async function exampleTaskTypeDetection() {
  const executor = new TaskExecutor()

  const samples = [
    {
      name: 'add-login-page',
      description: 'Implement user login component using React',
      content: 'Create function SignupForm() { ... }'
    },
    {
      name: 'test-payment-flow.js',
      description: 'Write jest tests for payment processing',
      content: 'describe("payment", () => { test(...) })'
    },
    {
      name: 'README.md',
      description: 'Document project setup and usage',
      content: '# Project Guide\n\n## Installation\n\n## Usage'
    },
    {
      name: 'terraform-init.tf',
      description: 'Define AWS infrastructure',
      content: 'resource "aws_s3_bucket" "data" { ... }'
    },
    {
      name: 'deploy-staging.yml',
      description: 'GitHub Actions CI/CD workflow',
      content: 'on: push\njobs: deploy: ...'
    }
  ]

  console.log('Task Type Detection:\n')

  samples.forEach((sample) => {
    const detected = executor.detectTaskType(sample)
    console.log(`${sample.name} → ${detected}`)
  })
}

/**
 * Example 8: Event-driven task monitoring
 */
async function exampleEventMonitoring() {
  const executor = new TaskExecutor()

  // Setup monitoring
  const timeline = []

  executor.on('route', (event) => {
    timeline.push({ time: Date.now(), event: 'route', type: event.taskType })
    console.log(`[ROUTE] Task type detected: ${event.taskType}`)
  })

  executor.on('start', (event) => {
    timeline.push({ time: Date.now(), event: 'start', taskId: event.taskId })
    console.log(`[START] ${event.taskId} (${event.type})`)
  })

  executor.on('complete', (event) => {
    timeline.push({ time: Date.now(), event: 'complete', taskId: event.taskId })
    console.log(
      `[COMPLETE] ${event.taskId} - ${event.metrics.duration}ms (${event.metrics.success ? '✓' : '✗'})`
    )
  })

  executor.on('error', (event) => {
    timeline.push({ time: Date.now(), event: 'error', taskId: event.taskId })
    console.log(`[ERROR] ${event.taskId} - ${event.error.message}`)
  })

  const task = {
    id: 'monitored-task',
    name: 'Sample task',
    description: 'This is being monitored'
  }

  try {
    await executor.route(task)
    console.log('\nTimeline:', timeline)
  } catch (error) {
    console.error('Task failed')
  }
}

// Export examples
module.exports = {
  exampleCodeTask,
  exampleTestTask,
  exampleDocsTask,
  exampleInfraTask,
  exampleDeployTask,
  exampleBatchTasks,
  exampleTaskTypeDetection,
  exampleEventMonitoring
}

// Run if called directly
if (require.main === module) {
  const example = process.argv[2] || 'detection'

  switch (example) {
    case 'code':
      exampleCodeTask().catch(console.error)
      break
    case 'test':
      exampleTestTask().catch(console.error)
      break
    case 'docs':
      exampleDocsTask().catch(console.error)
      break
    case 'infra':
      exampleInfraTask().catch(console.error)
      break
    case 'deploy':
      exampleDeployTask().catch(console.error)
      break
    case 'batch':
      exampleBatchTasks().catch(console.error)
      break
    case 'detection':
    default:
      exampleTaskTypeDetection()
      break
    case 'monitor':
      exampleEventMonitoring().catch(console.error)
      break
  }
}
