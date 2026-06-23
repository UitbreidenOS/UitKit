/**
 * Vision Workflow Builder - Integration Examples
 *
 * Real-world usage examples for different automation scenarios
 */

const builder = require('./vision-workflow-builder');

// ============================================================================
// EXAMPLE 1: E-COMMERCE CHECKOUT AUTOMATION
// ============================================================================

async function ecommerceCheckoutExample() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 1: E-Commerce Checkout Automation');
  console.log('='.repeat(70));

  const learner = builder.createLearner();

  // Simulate screenshots from a checkout flow
  const checkoutSequence = [
    // Step 1: Shopping cart page
    {
      name: 'Cart Page',
      visionData: [
        { type: 'text', text: 'Shopping Cart', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Item: Blue Shirt - $29.99', boundingBox: { left: 50, top: 100, width: 300, height: 30 }, confidence: 0.92 },
        { type: 'text', text: 'Proceed to Checkout', boundingBox: { left: 200, top: 400, width: 180, height: 45 }, confidence: 0.94 },
      ],
      visualData: [],
    },
    // Step 2: Shipping address
    {
      name: 'Shipping Address',
      visionData: [
        { type: 'text', text: 'Shipping Address', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Full Name', boundingBox: { left: 50, top: 80, width: 100, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'John Doe', boundingBox: { left: 160, top: 80, width: 200, height: 30 }, confidence: 0.91 },
        { type: 'text', text: 'Address', boundingBox: { left: 50, top: 130, width: 100, height: 25 }, confidence: 0.93 },
        { type: 'text', text: '123 Main St', boundingBox: { left: 160, top: 130, width: 200, height: 30 }, confidence: 0.90 },
        { type: 'text', text: 'Continue to Payment', boundingBox: { left: 200, top: 300, width: 180, height: 45 }, confidence: 0.94 },
      ],
      visualData: [],
    },
    // Step 3: Payment method
    {
      name: 'Payment Page',
      visionData: [
        { type: 'text', text: 'Payment Details', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Card Number', boundingBox: { left: 50, top: 80, width: 120, height: 25 }, confidence: 0.92 },
        { type: 'text', text: '4111 1111 1111 1111', boundingBox: { left: 180, top: 80, width: 250, height: 30 }, confidence: 0.89 },
        { type: 'text', text: 'Complete Purchase', boundingBox: { left: 200, top: 300, width: 180, height: 45 }, confidence: 0.94 },
      ],
      visualData: [],
    },
    // Step 4: Confirmation
    {
      name: 'Confirmation',
      visionData: [
        { type: 'text', text: 'Order Confirmed!', boundingBox: { left: 50, top: 100, width: 250, height: 50 }, confidence: 0.97 },
        { type: 'text', text: 'Order #123456', boundingBox: { left: 50, top: 170, width: 200, height: 30 }, confidence: 0.94 },
        { type: 'text', text: 'Total: $29.99', boundingBox: { left: 50, top: 210, width: 200, height: 30 }, confidence: 0.93 },
      ],
      visualData: [],
    },
  ];

  // Learn the checkout workflow
  console.log('\nLearning checkout workflow from 4-step sequence...');
  const learnResult = await learner.learnFromSequence(checkoutSequence, {
    domain: 'ecommerce-checkout',
    storeName: 'ShopXYZ',
    version: '1.0',
  });

  console.log(`✓ Pattern learned: ${learnResult.patternId}`);
  console.log(`  Steps: ${learnResult.stepCount}`);
  console.log(`  Rules: ${learnResult.ruleCount}`);
  console.log(`  Duration: ${learnResult.duration_ms}ms`);

  // Simulate applying workflow to a new product
  const newProductCheckout = [
    {
      visionData: [
        { type: 'text', text: 'Shopping Cart', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Item: Red Hat - $19.99', boundingBox: { left: 50, top: 100, width: 300, height: 30 }, confidence: 0.92 },
        { type: 'text', text: 'Proceed to Checkout', boundingBox: { left: 200, top: 400, width: 180, height: 45 }, confidence: 0.94 },
      ],
      visualData: [],
    },
  ];

  console.log('\nApplying workflow to new product...');
  const actionPlan = await learner.applyWorkflow(newProductCheckout[0], learnResult.patternId);

  console.log(`✓ Action plan generated`);
  console.log(`  Matched steps: ${actionPlan.metadata.matchedSteps}/${actionPlan.metadata.totalSteps}`);
  console.log(`  Match rate: ${actionPlan.metadata.matchRate}`);
  console.log(`  Actions: ${actionPlan.actions.length}`);

  // Show generated script snippet
  console.log('\nGenerated JavaScript (snippet):');
  const script = builder.generateWorkflowScript(actionPlan, 'javascript');
  console.log(script.split('\n').slice(0, 10).join('\n'));
  console.log('  ...');

  return learnResult.patternId;
}

// ============================================================================
// EXAMPLE 2: FORM FILLING WITH DATA PATTERN RECOGNITION
// ============================================================================

async function formFillingExample() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 2: Form Filling with Data Pattern Recognition');
  console.log('='.repeat(70));

  const learner = builder.createLearner();

  const contactFormSequence = [
    // Form page
    {
      visionData: [
        { type: 'text', text: 'Contact Form', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Name', boundingBox: { left: 50, top: 80, width: 80, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'name input', boundingBox: { left: 140, top: 80, width: 200, height: 30 }, confidence: 0.88 },
        { type: 'text', text: 'Email', boundingBox: { left: 50, top: 130, width: 80, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'email input', boundingBox: { left: 140, top: 130, width: 200, height: 30 }, confidence: 0.88 },
        { type: 'text', text: 'Phone', boundingBox: { left: 50, top: 180, width: 80, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'phone input', boundingBox: { left: 140, top: 180, width: 200, height: 30 }, confidence: 0.87 },
        { type: 'text', text: 'Submit', boundingBox: { left: 140, top: 250, width: 100, height: 40 }, confidence: 0.94 },
      ],
      visualData: [],
    },
    // Filled form
    {
      visionData: [
        { type: 'text', text: 'Contact Form', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Name', boundingBox: { left: 50, top: 80, width: 80, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'John Smith', boundingBox: { left: 140, top: 80, width: 200, height: 30 }, confidence: 0.90 },
        { type: 'text', text: 'Email', boundingBox: { left: 50, top: 130, width: 80, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'john@example.com', boundingBox: { left: 140, top: 130, width: 200, height: 30 }, confidence: 0.91 },
        { type: 'text', text: 'Phone', boundingBox: { left: 50, top: 180, width: 80, height: 25 }, confidence: 0.93 },
        { type: 'text', text: '555-123-4567', boundingBox: { left: 140, top: 180, width: 200, height: 30 }, confidence: 0.89 },
        { type: 'text', text: 'Submit', boundingBox: { left: 140, top: 250, width: 100, height: 40 }, confidence: 0.94 },
      ],
      visualData: [],
    },
  ];

  console.log('\nLearning form filling workflow...');
  const learnResult = await learner.learnFromSequence(contactFormSequence, {
    domain: 'contact-form',
    formType: 'contact-information',
  });

  console.log(`✓ Pattern learned: ${learnResult.patternId}`);

  // Apply and analyze data patterns
  console.log('\nAnalyzing extracted data patterns...');
  const actionPlan = await learner.applyWorkflow(contactFormSequence[1], learnResult.patternId);

  const dataPatterns = {
    names: [],
    emails: [],
    phones: [],
  };

  actionPlan.actions.forEach(action => {
    if (action.type === 'type' && action.payload.newText) {
      const pattern = builder.extractDataPattern(action.payload.newText);
      console.log(`  Found ${pattern.type}: ${action.payload.newText} (format: ${pattern.format})`);

      if (pattern.type === 'email') {
        dataPatterns.emails.push(action.payload.newText);
      } else if (pattern.type === 'phone') {
        dataPatterns.phones.push(action.payload.newText);
      } else if (pattern.type === 'text') {
        dataPatterns.names.push(action.payload.newText);
      }
    }
  });

  console.log(`\n✓ Data extraction summary:`);
  console.log(`  Names: ${dataPatterns.names.length}`);
  console.log(`  Emails: ${dataPatterns.emails.length}`);
  console.log(`  Phones: ${dataPatterns.phones.length}`);

  return learnResult.patternId;
}

// ============================================================================
// EXAMPLE 3: MULTI-PATTERN WORKFLOW MERGING
// ============================================================================

async function patternMergingExample(pattern1Id, pattern2Id) {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 3: Multi-Pattern Workflow Merging');
  console.log('='.repeat(70));

  const learner = builder.createLearner();

  // Simulate having learned patterns (in real scenario these would come from previous examples)
  if (pattern1Id && pattern2Id) {
    console.log('\nMerging learned patterns...');
    const mergeResult = learner.mergePatterns([pattern1Id, pattern2Id]);

    console.log(`✓ Patterns merged successfully`);
    console.log(`  Merged pattern ID: ${mergeResult.mergedId}`);
    console.log(`  Total steps: ${mergeResult.stepCount}`);

    // List all patterns
    console.log('\n✓ Current patterns:');
    const patterns = learner.listPatterns();
    patterns.forEach(p => {
      console.log(`  - ${p.id}: ${p.stepCount} steps, ${p.ruleCount} rules`);
    });

    return mergeResult.mergedId;
  }
}

// ============================================================================
// EXAMPLE 4: PATTERN COMPARISON AND ANALYSIS
// ============================================================================

async function patternComparisonExample() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 4: Pattern Comparison and Analysis');
  console.log('='.repeat(70));

  const learner = builder.createLearner();

  // Create two similar but slightly different checkout sequences
  const sequences = [
    // Sequence 1
    [
      {
        visionData: [
          { type: 'text', text: 'Cart', boundingBox: { left: 50, top: 20, width: 100, height: 40 }, confidence: 0.95 },
          { type: 'text', text: 'Proceed to Checkout', boundingBox: { left: 200, top: 400, width: 180, height: 45 }, confidence: 0.94 },
        ],
        visualData: [],
      },
      {
        visionData: [
          { type: 'text', text: 'Shipping', boundingBox: { left: 50, top: 20, width: 150, height: 40 }, confidence: 0.95 },
          { type: 'text', text: 'Continue to Payment', boundingBox: { left: 200, top: 300, width: 180, height: 45 }, confidence: 0.94 },
        ],
        visualData: [],
      },
    ],
    // Sequence 2 (slight variations)
    [
      {
        visionData: [
          { type: 'text', text: 'Shopping Cart', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
          { type: 'text', text: 'Checkout', boundingBox: { left: 200, top: 400, width: 150, height: 45 }, confidence: 0.94 },
        ],
        visualData: [],
      },
      {
        visionData: [
          { type: 'text', text: 'Shipping Address', boundingBox: { left: 50, top: 20, width: 200, height: 40 }, confidence: 0.95 },
          { type: 'text', text: 'Next', boundingBox: { left: 200, top: 300, width: 150, height: 45 }, confidence: 0.94 },
        ],
        visualData: [],
      },
    ],
  ];

  console.log('\nLearning two similar patterns...');
  const result1 = await learner.learnFromSequence(sequences[0], { variant: 'v1' });
  const result2 = await learner.learnFromSequence(sequences[1], { variant: 'v2' });

  console.log(`✓ Pattern 1: ${result1.patternId}`);
  console.log(`✓ Pattern 2: ${result2.patternId}`);

  // Compare patterns
  console.log('\nComparing patterns...');
  const pattern1 = learner.getPattern(result1.patternId);
  const pattern2 = learner.getPattern(result2.patternId);
  const comparison = builder.comparePatterns(pattern1, pattern2);

  console.log(`✓ Comparison Results:`);
  console.log(`  Similarity: ${(parseFloat(comparison.similarity) * 100).toFixed(1)}%`);
  console.log(`  Common steps: ${comparison.commonSteps.length}`);
  console.log(`  Unique to pattern 1: ${comparison.uniqueToPattern1.length}`);
  console.log(`  Unique to pattern 2: ${comparison.uniqueToPattern2.length}`);
}

// ============================================================================
// EXAMPLE 5: REAL-TIME WORKFLOW EXECUTION TRACKING
// ============================================================================

async function workflowExecutionExample() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 5: Workflow Execution Tracking');
  console.log('='.repeat(70));

  const learner = builder.createLearner();

  const loginSequence = [
    {
      visionData: [
        { type: 'text', text: 'Login', boundingBox: { left: 50, top: 20, width: 100, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Username', boundingBox: { left: 50, top: 80, width: 100, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'Password', boundingBox: { left: 50, top: 130, width: 100, height: 25 }, confidence: 0.93 },
        { type: 'text', text: 'Sign In', boundingBox: { left: 100, top: 200, width: 100, height: 40 }, confidence: 0.94 },
      ],
      visualData: [],
    },
    {
      visionData: [
        { type: 'text', text: 'Dashboard', boundingBox: { left: 50, top: 20, width: 150, height: 40 }, confidence: 0.96 },
        { type: 'text', text: 'Welcome back, John', boundingBox: { left: 50, top: 80, width: 250, height: 30 }, confidence: 0.92 },
      ],
      visualData: [],
    },
  ];

  console.log('\nLearning login workflow...');
  const result = await learner.learnFromSequence(loginSequence, { domain: 'login' });

  // Simulate multiple workflow executions
  console.log('\nSimulating 3 workflow executions...');
  for (let i = 1; i <= 3; i++) {
    const screenshot = loginSequence[0];
    const actionPlan = await learner.applyWorkflow(screenshot, result.patternId);

    console.log(`\nExecution ${i}:`);
    console.log(`  Match rate: ${actionPlan.metadata.matchRate}`);
    console.log(`  Duration: ${actionPlan.metadata.duration_ms}ms`);
    console.log(`  Confidence: ${(
      (actionPlan.actions.reduce((sum, a) => sum + a.confidence, 0) / actionPlan.actions.length) *
      100
    ).toFixed(1)}%`);
  }

  // Show execution history
  console.log('\n✓ Execution History:');
  const history = learner.getHistory(10);
  history.slice(-5).forEach((h, i) => {
    console.log(`  ${i + 1}. ${h.action} - ${h.result.timestamp || 'N/A'}`);
  });
}

// ============================================================================
// EXAMPLE 6: WORKFLOW SCRIPT GENERATION & EXPORT
// ============================================================================

async function scriptGenerationExample() {
  console.log('\n' + '='.repeat(70));
  console.log('EXAMPLE 6: Workflow Script Generation & Export');
  console.log('='.repeat(70));

  const learner = builder.createLearner();

  const sequence = [
    {
      visionData: [
        { type: 'text', text: 'Search Form', boundingBox: { left: 50, top: 20, width: 150, height: 40 }, confidence: 0.95 },
        { type: 'text', text: 'Search query input', boundingBox: { left: 50, top: 80, width: 300, height: 35 }, confidence: 0.88 },
        { type: 'text', text: 'Search', boundingBox: { left: 360, top: 80, width: 100, height: 35 }, confidence: 0.94 },
      ],
      visualData: [],
    },
    {
      visionData: [
        { type: 'text', text: 'Search Results', boundingBox: { left: 50, top: 20, width: 250, height: 40 }, confidence: 0.96 },
        { type: 'text', text: '5 results found for "nodejs"', boundingBox: { left: 50, top: 80, width: 300, height: 30 }, confidence: 0.93 },
      ],
      visualData: [],
    },
  ];

  console.log('\nLearning search workflow...');
  const result = await learner.learnFromSequence(sequence, { domain: 'search' });

  console.log(`✓ Pattern learned: ${result.patternId}`);

  const actionPlan = await learner.applyWorkflow(sequence[0], result.patternId);

  // Generate JavaScript
  console.log('\nGenerating JavaScript automation script...');
  const jsScript = builder.generateWorkflowScript(actionPlan, 'javascript');
  console.log('JavaScript output (first 500 chars):');
  console.log(jsScript.substring(0, 500));
  console.log('...\n');

  // Generate JSON
  console.log('Generating JSON workflow...');
  const jsonScript = builder.generateWorkflowScript(actionPlan, 'json');
  const actions = JSON.parse(jsonScript);
  console.log(`✓ JSON export: ${actions.length} actions`);
  actions.forEach((action, i) => {
    console.log(`  ${i + 1}. ${action.type} on "${action.target?.text || 'N/A'}"`);
  });
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runAllExamples() {
  console.log('\n');
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('║  Vision Workflow Builder - Integration Examples' + ' '.repeat(22) + '║');
  console.log('║  Build workflows from screenshot sequences' + ' '.repeat(28) + '║');
  console.log('║' + ' '.repeat(68) + '║');
  console.log('╚' + '═'.repeat(68) + '╝');

  try {
    const pattern1 = await ecommerceCheckoutExample();
    const pattern2 = await formFillingExample();
    await patternMergingExample(pattern1, pattern2);
    await patternComparisonExample();
    await workflowExecutionExample();
    await scriptGenerationExample();

    console.log('\n' + '='.repeat(70));
    console.log('All examples completed successfully!');
    console.log('='.repeat(70) + '\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for use in tests or other scripts
module.exports = {
  ecommerceCheckoutExample,
  formFillingExample,
  patternMergingExample,
  patternComparisonExample,
  workflowExecutionExample,
  scriptGenerationExample,
  runAllExamples,
};

// Run if executed directly
if (require.main === module) {
  runAllExamples();
}
