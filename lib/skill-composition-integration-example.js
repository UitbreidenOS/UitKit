/**
 * Skill Composition - Integration Example
 *
 * Real-world workflow examples demonstrating:
 * - Data processing pipeline
 * - Error handling & recovery
 * - Conditional branching
 * - Parallel execution
 * - Loop processing
 * - Template reuse
 */

const composer = require('./skill-composition');

// ============================================================================
// EXAMPLE 1: Data Processing Pipeline
// ============================================================================

async function example1_dataProcessingPipeline() {
  console.log('\n=== Example 1: Data Processing Pipeline ===\n');

  const builder = composer.createBuilder();

  // Step 1: Validate input
  const validateId = builder.addSkill(
    'validate',
    async (data) => {
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid input: items must be an array');
      }
      console.log(`  ✓ Validated ${data.items.length} items`);
      return data;
    },
    { retries: 1 }
  );

  // Step 2: Filter data
  const filterId = builder.addSkill(
    'filter',
    async (data) => {
      const filtered = data.items.filter(item => item.value > 10);
      console.log(`  ✓ Filtered to ${filtered.length} items`);
      return { ...data, items: filtered };
    }
  );

  // Step 3: Transform data
  const transformId = builder.addSkill(
    'transform',
    async (data) => {
      const transformed = data.items.map(item => ({
        ...item,
        doubled: item.value * 2,
        processed: true,
      }));
      console.log(`  ✓ Transformed ${transformed.length} items`);
      return { ...data, items: transformed };
    }
  );

  // Step 4: Aggregate results
  const aggregateId = builder.addSkill(
    'aggregate',
    async (data) => {
      const total = data.items.reduce((sum, item) => sum + item.doubled, 0);
      const average = total / data.items.length;
      console.log(`  ✓ Aggregated: total=${total}, average=${average}`);
      return { ...data, summary: { total, average, count: data.items.length } };
    }
  );

  // Connect the pipeline
  builder.connect(validateId, filterId);
  builder.connect(filterId, transformId);
  builder.connect(transformId, aggregateId);

  const workflow = builder.build('dataPipeline');

  // Execute
  const input = {
    items: [
      { id: 1, value: 5 },
      { id: 2, value: 15 },
      { id: 3, value: 20 },
      { id: 4, value: 8 },
    ],
  };

  const result = await composer.executeWorkflow(workflow, input);

  console.log('\nResult:', JSON.stringify(result.output, null, 2));
  console.log(`\nMetrics:`, result.metrics);

  return result;
}

// ============================================================================
// EXAMPLE 2: Error Handling & Recovery
// ============================================================================

async function example2_errorHandling() {
  console.log('\n=== Example 2: Error Handling & Recovery ===\n');

  const builder = composer.createBuilder();

  // Unreliable API call with retry
  let attemptCount = 0;
  const apiCallId = builder.addSkill(
    'unreliableAPI',
    async (data) => {
      attemptCount++;
      console.log(`  → API call attempt ${attemptCount}`);

      if (attemptCount < 2) {
        throw new Error('API temporarily unavailable');
      }

      return { ...data, apiResponse: 'success' };
    },
    {
      retries: 3,
      errorStrategy: composer.ERROR_STRATEGIES.RETRY,
    }
  );

  // Fallback processing
  const fallbackProcessId = builder.addSkill(
    'processingWithFallback',
    async (data) => {
      if (!data.apiResponse) {
        throw new Error('Processing failed');
      }
      console.log(`  ✓ Processed API response`);
      return { ...data, processed: true };
    },
    {
      fallback: async (data) => {
        console.log(`  ⚠ Using fallback: cached data`);
        return { ...data, processed: false, usedFallback: true };
      },
      errorStrategy: composer.ERROR_STRATEGIES.FALLBACK,
    }
  );

  builder.connect(apiCallId, fallbackProcessId);

  const workflow = builder.build('errorHandling');
  const result = await composer.executeWorkflow(workflow, { data: 'test' });

  console.log('\nExecution steps:');
  result.steps.forEach((step, idx) => {
    console.log(`  ${idx + 1}. ${step.nodeName}: ${step.status} (${step.duration}ms)`);
  });

  return result;
}

// ============================================================================
// EXAMPLE 3: Conditional Branching
// ============================================================================

async function example3_conditionalBranching() {
  console.log('\n=== Example 3: Conditional Branching ===\n');

  const builder = composer.createBuilder();

  // Initial processing
  const processId = builder.addSkill(
    'initialProcess',
    async (data) => {
      console.log(`  → Processing user type: ${data.userType}`);
      return data;
    }
  );

  // Conditional: route based on user type
  const routeId = builder.addConditional(
    composer.CONTROL_FLOW.SWITCH,
    null,
    {
      branches: {
        'data.userType === "premium"': 'premiumPath',
        'data.userType === "standard"': 'standardPath',
      },
      defaultBranch: 'freePath',
    }
  );

  // Premium path
  const premiumId = builder.addSkill(
    'premiumFeatures',
    async (data) => {
      console.log(`  ✓ Applied premium features: priority support, advanced analytics`);
      return { ...data, features: ['priority_support', 'advanced_analytics', 'api_access'] };
    }
  );

  // Standard path
  const standardId = builder.addSkill(
    'standardFeatures',
    async (data) => {
      console.log(`  ✓ Applied standard features: basic analytics`);
      return { ...data, features: ['basic_analytics'] };
    }
  );

  // Free path
  const freeId = builder.addSkill(
    'freeFeatures',
    async (data) => {
      console.log(`  ✓ Applied free features: limited access`);
      return { ...data, features: ['limited_access'] };
    }
  );

  builder.connect(processId, routeId);
  builder.connect(routeId, premiumId);
  builder.connect(routeId, standardId);
  builder.connect(routeId, freeId);

  const workflow = builder.build('conditionalBranching');

  // Test different user types
  for (const userType of ['premium', 'standard', 'free']) {
    console.log(`\nProcessing ${userType} user:`);
    const result = await composer.executeWorkflow(workflow, { userType });
    console.log(`  Result features: ${result.output.features?.join(', ') || 'none'}`);
  }
}

// ============================================================================
// EXAMPLE 4: Parallel Execution
// ============================================================================

async function example4_parallelExecution() {
  console.log('\n=== Example 4: Parallel Execution ===\n');

  const builder = composer.createBuilder();

  // Parallel tasks
  const task1Id = builder.addSkill(
    'fetchUser',
    async (data) => {
      console.log(`  → Fetching user data...`);
      await new Promise(r => setTimeout(r, 100));
      console.log(`  ✓ User data fetched`);
      return { user: { id: 1, name: 'Alice' } };
    }
  );

  const task2Id = builder.addSkill(
    'fetchOrders',
    async (data) => {
      console.log(`  → Fetching orders...`);
      await new Promise(r => setTimeout(r, 150));
      console.log(`  ✓ Orders fetched`);
      return { orders: [{ id: 101, total: 50 }, { id: 102, total: 75 }] };
    }
  );

  const task3Id = builder.addSkill(
    'fetchAnalytics',
    async (data) => {
      console.log(`  → Fetching analytics...`);
      await new Promise(r => setTimeout(r, 80));
      console.log(`  ✓ Analytics fetched`);
      return { analytics: { pageViews: 1000, bounceRate: 0.25 } };
    }
  );

  // Merge results
  const mergeId = builder.addSkill(
    'mergeResults',
    async (data) => {
      console.log(`  ✓ Merged ${Object.keys(data).length} data sources`);
      return { userProfile: data };
    }
  );

  builder.connect(task1Id, mergeId);
  builder.connect(task2Id, mergeId);
  builder.connect(task3Id, mergeId);

  const workflow = builder.build('parallelExecution');
  const result = await composer.executeWorkflow(workflow, {});

  console.log('\nFinal profile:', JSON.stringify(result.output, null, 2));
  console.log(`\nTotal execution time: ${result.metrics.totalDuration}ms`);
}

// ============================================================================
// EXAMPLE 5: Loop Processing
// ============================================================================

async function example5_loopProcessing() {
  console.log('\n=== Example 5: Loop Processing ===\n');

  const builder = composer.createBuilder();

  // Process batch with loop
  const batchId = builder.addSkill(
    'processBatch',
    async (data) => {
      const batch = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        value: Math.random() * 100,
      }));
      console.log(`  ✓ Prepared batch of ${batch.length} items`);

      const processed = batch.map(item => {
        const result = {
          ...item,
          squared: item.value ** 2,
          doubled: item.value * 2,
        };
        console.log(`  → Processed item ${item.id}: value=${item.value.toFixed(2)}`);
        return result;
      });

      const stats = {
        total: processed.length,
        avgValue: (processed.reduce((sum, p) => sum + p.value, 0) / processed.length).toFixed(2),
        maxValue: Math.max(...processed.map(p => p.value)).toFixed(2),
      };

      console.log(`  ✓ Finalized: processed ${stats.total} items`);
      return { items: processed, stats };
    }
  );

  const workflow = builder.build('loopProcessing');
  const result = await composer.executeWorkflow(workflow, {});

  console.log('\nStats:', result.output.stats);
}

// ============================================================================
// EXAMPLE 6: Template Reuse
// ============================================================================

async function example6_templateReuse() {
  console.log('\n=== Example 6: Template Reuse ===\n');

  // Create and save a reusable validation template
  const builder = composer.createBuilder();

  const validateId = builder.addSkill('validate', async (data) => {
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    console.log(`  ✓ Email validated: ${data.email}`);
    return data;
  });

  const normalizeId = builder.addSkill('normalize', async (data) => {
    console.log(`  ✓ Data normalized`);
    return {
      ...data,
      email: data.email.toLowerCase(),
      timestamp: new Date().toISOString(),
    };
  });

  builder.connect(validateId, normalizeId);
  const workflow = builder.build('emailValidation');

  // Save as template
  const templateId = composer.TemplateStorage.saveTemplate(
    'emailWorkflow',
    workflow,
    {
      tags: ['validation', 'email'],
      description: 'Validates and normalizes email addresses',
    }
  );

  console.log(`  → Saved template: ${templateId}`);

  // Load and reuse template
  const loaded = composer.TemplateStorage.loadTemplate(templateId);
  console.log(`  → Loaded template: ${loaded.name}`);

  // Execute using loaded template
  const result = await composer.executeWorkflow(loaded.workflow, {
    email: 'User@Example.COM',
    name: 'John Doe',
  });

  console.log(`\n  Result:`, result.output);

  // List all templates
  const templates = composer.TemplateStorage.listTemplates();
  console.log(`\n  Available templates: ${templates.length}`);
  templates.forEach(t => {
    console.log(`    - ${t.name} (tags: ${t.tags.join(', ')})`);
  });
}

// ============================================================================
// EXAMPLE 7: Execution Metrics & History
// ============================================================================

async function example7_executionMetrics() {
  console.log('\n=== Example 7: Execution Metrics & History ===\n');

  composer.ExecutionHistory.clear();

  const builder = composer.createBuilder();
  const taskId = builder.addSkill('slowTask', async (data) => {
    await new Promise(r => setTimeout(r, Math.random() * 100));
    return { ...data, processed: true };
  });

  const workflow = builder.build('metricTest');

  // Execute workflow multiple times
  console.log('  → Running 5 executions...');
  for (let i = 0; i < 5; i++) {
    await composer.executeWorkflow(workflow, { index: i });
  }

  // Get metrics
  const metrics = composer.ExecutionHistory.getMetrics(workflow.id);
  console.log('\n  Metrics:');
  console.log(`    Total executions: ${metrics.totalExecutions}`);
  console.log(`    Success rate: ${metrics.successRate}%`);
  console.log(`    Avg duration: ${metrics.avgDuration}ms`);
  console.log(`    Min duration: ${metrics.minDuration}ms`);
  console.log(`    Max duration: ${metrics.maxDuration}ms`);

  // List execution history
  const history = composer.ExecutionHistory.listExecutions({ workflowId: workflow.id });
  console.log(`\n  Recent executions: ${history.length}`);
  history.slice(-3).forEach((exec, idx) => {
    console.log(`    ${idx + 1}. Status: ${exec.status}, Duration: ${exec.metrics.totalDuration}ms`);
  });
}

// ============================================================================
// EXAMPLE 8: UI Schema Generation
// ============================================================================

async function example8_uiSchema() {
  console.log('\n=== Example 8: UI Schema Generation ===\n');

  const builder = composer.createBuilder();

  const step1 = builder.addSkill('fetch', async (d) => d);
  const cond = builder.addConditional(composer.CONTROL_FLOW.IF, () => true);
  const step2 = builder.addSkill('process', async (d) => d);
  const step3 = builder.addSkill('save', async (d) => d);

  builder.connect(step1, cond);
  builder.connect(cond, step2);
  builder.connect(step2, step3);

  const workflow = builder.build('uiTest');
  const schema = composer.UIBuilder.generateUISchema(workflow);

  console.log('  Canvas dimensions:', schema.canvas.width, 'x', schema.canvas.height);
  console.log(`  Nodes: ${schema.nodes.length}`);
  schema.nodes.forEach(node => {
    console.log(`    - ${node.label} (${node.type}) at (${node.position.x}, ${node.position.y})`);
  });

  console.log(`  Edges: ${schema.edges.length}`);
  schema.edges.forEach(edge => {
    console.log(`    - ${edge.source} → ${edge.target}${edge.label ? ` [${edge.label}]` : ''}`);
  });

  console.log('\n  Palette categories: ' + schema.palette.length);
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Skill Composition - Integration Examples                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    await example1_dataProcessingPipeline();
    await example2_errorHandling();
    await example3_conditionalBranching();
    await example4_parallelExecution();
    await example5_loopProcessing();
    await example6_templateReuse();
    await example7_executionMetrics();
    await example8_uiSchema();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  All examples completed successfully!                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  example1_dataProcessingPipeline,
  example2_errorHandling,
  example3_conditionalBranching,
  example4_parallelExecution,
  example5_loopProcessing,
  example6_templateReuse,
  example7_executionMetrics,
  example8_uiSchema,
  runAllExamples,
};

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
