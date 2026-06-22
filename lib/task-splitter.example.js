/**
 * Task Splitter — Usage Examples
 *
 * Demonstrates:
 * - Task complexity analysis
 * - Split suggestions for large tasks
 * - Auto-split and retry
 * - Parallel execution
 * - Dependency analysis
 */

const { TaskSplitter } = require('./task-splitter')

// ═════════════════════════════════════════════════════════════════
// Example 1: Analyze task complexity
// ═════════════════════════════════════════════════════════════════

async function exampleAnalyzeComplexity() {
  console.log('\n=== Example 1: Analyze Task Complexity ===\n')

  const splitter = new TaskSplitter({ verbose: true })

  // Simple task
  const simpleTask = {
    id: 'simple-1',
    name: 'Update README',
    description: 'Fix a typo in README.md',
  }

  const simpleAnalysis = splitter.analyzeTask(simpleTask)
  console.log('Simple Task:')
  console.log(JSON.stringify(simpleAnalysis, null, 2))

  // Complex task
  const complexTask = {
    id: 'complex-1',
    name: 'Database Migration',
    description:
      'Migrate 50000 records from legacy database to new PostgreSQL cluster with parallel transactions, error recovery, and validation',
    files: Array(30).fill(null).map((_, i) => `file-${i}.sql`),
    subtasks: [
      { name: 'Connect to legacy DB' },
      { name: 'Connect to new DB' },
      { name: 'Validate schema mapping' },
      { name: 'Run migration' },
      { name: 'Verify data integrity' },
      { name: 'Rollback plan' },
    ],
  }

  const complexAnalysis = splitter.analyzeTask(complexTask)
  console.log('\nComplex Task:')
  console.log(JSON.stringify(complexAnalysis, null, 2))
}

// ═════════════════════════════════════════════════════════════════
// Example 2: Get split suggestions
// ═════════════════════════════════════════════════════════════════

async function exampleSuggestSplits() {
  console.log('\n=== Example 2: Suggest Splits ===\n')

  const splitter = new TaskSplitter()

  const task = {
    id: 'batch-task-1',
    name: 'Process Orders',
    description:
      'Process orders for customers A, B, C, D, E with different payment methods, validate each, then send confirmation emails',
    subtasks: Array(15)
      .fill(null)
      .map((_, i) => ({ id: `order-${i}`, status: 'pending' })),
  }

  const suggestions = splitter.suggestSplits(task)
  console.log('Task:', task.name)
  console.log('\nSplit Analysis:')
  console.log(JSON.stringify(suggestions, null, 2))
}

// ═════════════════════════════════════════════════════════════════
// Example 3: Auto-split and execute in parallel
// ═════════════════════════════════════════════════════════════════

async function exampleAutoSplitAndExecute() {
  console.log('\n=== Example 3: Auto-Split & Parallel Execution ===\n')

  const splitter = new TaskSplitter({
    verbose: true,
    concurrency: 3,
    timeoutMs: 10000,
  })

  const largeTask = {
    id: 'data-load-1',
    name: 'Load CSV Files',
    description:
      'Load and transform multiple CSV files with concurrent processing',
    subtasks: [
      { id: 'csv-1', file: 'users.csv', rows: 5000 },
      { id: 'csv-2', file: 'orders.csv', rows: 8000 },
      { id: 'csv-3', file: 'products.csv', rows: 2000 },
      { id: 'csv-4', file: 'payments.csv', rows: 6000 },
      { id: 'csv-5', file: 'reviews.csv', rows: 3000 },
    ],
  }

  // Auto-split
  const split = splitter.autoSplit(largeTask)
  console.log('Auto-Split Result:')
  console.log(`Strategy: ${split.strategy}`)
  console.log(`Sub-tasks: ${split.subtasks.length}`)
  console.log(`Parallelizable: ${split.parallelizable}\n`)

  // Mock executor
  const executor = async (task) => {
    const delay = Math.random() * 2000
    await new Promise(resolve => setTimeout(resolve, delay))

    if (Math.random() > 0.8) {
      throw new Error(`Failed to load ${task.file || task.name}`)
    }

    return { task: task.id, status: 'completed', processed: Math.floor(Math.random() * 1000) }
  }

  // Execute in parallel
  const result = await splitter.executeParallel(split.subtasks, executor)
  console.log('Execution Result:')
  console.log(`Completed: ${result.completed}`)
  console.log(`Failed: ${result.failed}`)
  console.log(`Results: ${result.results.size} tasks`)
}

// ═════════════════════════════════════════════════════════════════
// Example 4: Execute with auto-retry on failure
// ═════════════════════════════════════════════════════════════════

async function exampleExecuteWithRetry() {
  console.log('\n=== Example 4: Execute with Auto-Retry ===\n')

  const splitter = new TaskSplitter({
    verbose: true,
    maxRetries: 2,
    timeoutMs: 5000,
  })

  const task = {
    id: 'api-batch-1',
    name: 'Fetch API Data',
    description: 'Fetch data from multiple API endpoints with rate limiting and error recovery',
    subtasks: [
      { id: 'api-1', endpoint: '/users' },
      { id: 'api-2', endpoint: '/posts' },
      { id: 'api-3', endpoint: '/comments' },
    ],
  }

  // Executor that fails initially, then succeeds
  let attempts = 0
  const executor = async (t) => {
    attempts++
    if (attempts < 2) {
      throw new Error('Network timeout')
    }
    return { task: t.id || t.name, data: Math.random() }
  }

  const result = await splitter.executeWithRetry(task, executor)
  console.log('Retry Execution Result:')
  console.log(JSON.stringify(result, null, 2))
}

// ═════════════════════════════════════════════════════════════════
// Example 5: Analyze task dependencies
// ═════════════════════════════════════════════════════════════════

async function exampleAnalyzeDependencies() {
  console.log('\n=== Example 5: Analyze Dependencies ===\n')

  const splitter = new TaskSplitter()

  const tasks = [
    { id: 'setup', name: 'Setup DB', dependencies: [] },
    {
      id: 'migrate',
      name: 'Run Migration',
      dependencies: ['setup'],
    },
    {
      id: 'seed-1',
      name: 'Seed Users',
      dependencies: ['migrate'],
    },
    {
      id: 'seed-2',
      name: 'Seed Products',
      dependencies: ['migrate'],
    },
    {
      id: 'seed-3',
      name: 'Seed Orders',
      dependencies: ['seed-1', 'seed-2'],
    },
    {
      id: 'validate',
      name: 'Validate Data',
      dependencies: ['seed-3'],
    },
    { id: 'report', name: 'Generate Report', dependencies: [] },
  ]

  const analysis = splitter.analyzeDependencies(tasks)
  console.log('Dependency Analysis:')
  console.log(`Independent tasks: ${analysis.independent.length}`)
  console.log(
    `  ${analysis.independent.map(t => t.name).join(', ')}`
  )
  console.log(`\nDependent tasks: ${analysis.dependent.length}`)
  console.log(
    `  ${analysis.dependent.map(t => t.name).join(', ')}`
  )

  console.log('\nDependency Graph:')
  for (const [id, { task, deps }] of analysis.graph.entries()) {
    console.log(`  ${task.name} (${id}) -> deps: [${deps.join(', ')}]`)
  }
}

// ═════════════════════════════════════════════════════════════════
// Example 6: Events and logging
// ═════════════════════════════════════════════════════════════════

async function exampleEvents() {
  console.log('\n=== Example 6: Events & Logging ===\n')

  const splitter = new TaskSplitter({ verbose: false })

  // Listen to events
  splitter.on('log', msg => {
    console.log(`[EVENT] ${msg}`)
  })

  const task = {
    id: 'task-1',
    name: 'Sample Task',
    description: 'Run parallel operations with concurrent tasks',
    subtasks: [{ id: 'sub-1' }, { id: 'sub-2' }],
  }

  const executor = async t =>
    new Promise(resolve => {
      setTimeout(() => resolve({ id: t.id, status: 'done' }), 100)
    })

  const split = splitter.autoSplit(task)
  await splitter.executeParallel(split.subtasks, executor)
}

// ═════════════════════════════════════════════════════════════════
// Run all examples
// ═════════════════════════════════════════════════════════════════

async function runAllExamples() {
  try {
    await exampleAnalyzeComplexity()
    await exampleSuggestSplits()
    await exampleAutoSplitAndExecute()
    await exampleExecuteWithRetry()
    await exampleAnalyzeDependencies()
    await exampleEvents()

    console.log('\n✓ All examples completed successfully\n')
  } catch (err) {
    console.error('Error running examples:', err)
    process.exit(1)
  }
}

if (require.main === module) {
  runAllExamples()
}

module.exports = {
  exampleAnalyzeComplexity,
  exampleSuggestSplits,
  exampleAutoSplitAndExecute,
  exampleExecuteWithRetry,
  exampleAnalyzeDependencies,
  exampleEvents,
}
