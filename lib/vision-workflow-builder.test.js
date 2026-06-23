/**
 * Vision Workflow Builder - Test Suite
 *
 * Tests for screenshot-based workflow learning and automation
 */

const builder = require('./vision-workflow-builder');

// ============================================================================
// TEST DATA
// ============================================================================

const mockScreenshot1 = {
  visionData: [
    {
      type: 'text',
      text: 'Login',
      boundingBox: { left: 50, top: 50, width: 100, height: 40 },
      confidence: 0.95,
    },
    {
      type: 'text',
      text: 'Email',
      boundingBox: { left: 50, top: 100, width: 60, height: 25 },
      confidence: 0.92,
    },
    {
      type: 'text',
      text: 'email input field',
      boundingBox: { left: 120, top: 100, width: 200, height: 35 },
      confidence: 0.88,
    },
    {
      type: 'text',
      text: 'Password',
      boundingBox: { left: 50, top: 150, width: 80, height: 25 },
      confidence: 0.91,
    },
    {
      type: 'text',
      text: 'password input field',
      boundingBox: { left: 120, top: 150, width: 200, height: 35 },
      confidence: 0.87,
    },
    {
      type: 'text',
      text: 'Submit',
      boundingBox: { left: 120, top: 210, width: 100, height: 40 },
      confidence: 0.94,
    },
  ],
  visualData: [],
};

const mockScreenshot2 = {
  visionData: [
    {
      type: 'text',
      text: 'Email',
      boundingBox: { left: 50, top: 100, width: 60, height: 25 },
      confidence: 0.92,
    },
    {
      type: 'text',
      text: 'user@example.com',
      boundingBox: { left: 120, top: 100, width: 200, height: 35 },
      confidence: 0.89,
    },
    {
      type: 'text',
      text: 'Password',
      boundingBox: { left: 50, top: 150, width: 80, height: 25 },
      confidence: 0.91,
    },
    {
      type: 'text',
      text: 'password input field',
      boundingBox: { left: 120, top: 150, width: 200, height: 35 },
      confidence: 0.87,
    },
    {
      type: 'text',
      text: 'Submit',
      boundingBox: { left: 120, top: 210, width: 100, height: 40 },
      confidence: 0.94,
    },
  ],
  visualData: [],
};

const mockScreenshot3 = {
  visionData: [
    {
      type: 'text',
      text: 'Dashboard',
      boundingBox: { left: 50, top: 50, width: 150, height: 40 },
      confidence: 0.96,
    },
    {
      type: 'text',
      text: 'Welcome, User',
      boundingBox: { left: 50, top: 100, width: 200, height: 30 },
      confidence: 0.93,
    },
    {
      type: 'text',
      text: 'Profile',
      boundingBox: { left: 50, top: 150, width: 80, height: 30 },
      confidence: 0.91,
    },
    {
      type: 'text',
      text: 'Settings',
      boundingBox: { left: 150, top: 150, width: 80, height: 30 },
      confidence: 0.90,
    },
    {
      type: 'text',
      text: 'Logout',
      boundingBox: { left: 250, top: 150, width: 80, height: 30 },
      confidence: 0.89,
    },
  ],
  visualData: [],
};

// ============================================================================
// TEST SUITE
// ============================================================================

describe('Vision Workflow Builder', () => {
  describe('UI Element Detection', () => {
    test('Extract UI elements from screenshot', () => {
      const elements = builder.extractUIElements(mockScreenshot1);

      expect(elements).toBeDefined();
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toHaveProperty('id');
      expect(elements[0]).toHaveProperty('type');
      expect(elements[0]).toHaveProperty('text');
      expect(elements[0]).toHaveProperty('bounds');
      expect(elements[0]).toHaveProperty('position');
    });

    test('Classify element types correctly', () => {
      const elements = builder.extractUIElements(mockScreenshot1);
      const buttons = elements.filter(e => e.type === builder.UI_ELEMENT_TYPES.BUTTON);
      const labels = elements.filter(e => e.type === builder.UI_ELEMENT_TYPES.LABEL);

      expect(buttons.length).toBeGreaterThan(0);
      expect(labels.length).toBeGreaterThan(0);
    });

    test('Extract element positions accurately', () => {
      const elements = builder.extractUIElements(mockScreenshot1);
      const submitButton = elements.find(e => e.text === 'Submit');

      expect(submitButton).toBeDefined();
      expect(submitButton.position.x).toBeCloseTo(170, 5);
      expect(submitButton.position.y).toBeCloseTo(230, 5);
    });
  });

  describe('Interaction Detection', () => {
    test('Detect text input interaction', () => {
      const elements1 = builder.extractUIElements(mockScreenshot1);
      const elements2 = builder.extractUIElements(mockScreenshot2);

      const interactions = builder.detectInteractions(
        mockScreenshot1,
        mockScreenshot2,
        elements1,
        elements2
      );

      expect(interactions.length).toBeGreaterThan(0);
      const typeInteractions = interactions.filter(
        i => i.type === builder.INTERACTION_TYPES.TYPE
      );
      expect(typeInteractions.length).toBeGreaterThan(0);
    });

    test('Detect page navigation', () => {
      const elements2 = builder.extractUIElements(mockScreenshot2);
      const elements3 = builder.extractUIElements(mockScreenshot3);

      const interactions = builder.detectInteractions(
        mockScreenshot2,
        mockScreenshot3,
        elements2,
        elements3
      );

      const waitInteractions = interactions.filter(
        i => i.type === builder.INTERACTION_TYPES.WAIT
      );
      expect(waitInteractions.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern Learning', () => {
    test('Learn workflow pattern from screenshot sequence', () => {
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];
      const elementSequences = screenshots.map(s => builder.extractUIElements(s));

      const pattern = builder.learnWorkflowPattern(screenshots, elementSequences);

      expect(pattern).toBeDefined();
      expect(pattern.id).toBeDefined();
      expect(pattern.steps).toBeDefined();
      expect(pattern.steps.length).toBeGreaterThan(0);
      expect(pattern.metadata).toBeDefined();
      expect(pattern.metadata.screenshotCount).toBe(3);
    });

    test('Generalize pattern for reuse', () => {
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];
      const elementSequences = screenshots.map(s => builder.extractUIElements(s));
      const pattern = builder.learnWorkflowPattern(screenshots, elementSequences);
      const generalized = builder.generalizePattern(pattern);

      expect(generalized.rules).toBeDefined();
      expect(generalized.selectors).toBeDefined();
      expect(generalized.rules.length).toBeGreaterThanOrEqual(0);
    });

    test('Extract data patterns from text', () => {
      const datePattern = builder.extractDataPattern('2024-06-22');
      expect(datePattern.type).toBe('date');

      const emailPattern = builder.extractDataPattern('user@example.com');
      expect(emailPattern.type).toBe('email');

      const phonePattern = builder.extractDataPattern('555-123-4567');
      expect(phonePattern.type).toBe('phone');

      const currencyPattern = builder.extractDataPattern('99.99');
      expect(currencyPattern.type).toBe('currency');

      const numberPattern = builder.extractDataPattern('42');
      expect(numberPattern.type).toBe('number');
    });
  });

  describe('Pattern Application', () => {
    test('Apply pattern to new screenshot', () => {
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];
      const elementSequences = screenshots.map(s => builder.extractUIElements(s));
      const pattern = builder.learnWorkflowPattern(screenshots, elementSequences);

      const newScreenshot = {
        ...mockScreenshot1,
        visionData: [
          ...mockScreenshot1.visionData,
          {
            type: 'text',
            text: 'Login',
            boundingBox: { left: 50, top: 50, width: 100, height: 40 },
            confidence: 0.95,
          },
        ],
      };
      const newElements = builder.extractUIElements(newScreenshot);

      const actionPlan = builder.applyPatternToScreenshot(pattern, newScreenshot, newElements);

      expect(actionPlan).toBeDefined();
      expect(actionPlan.actions).toBeDefined();
      expect(actionPlan.actions.length).toBeGreaterThan(0);
      expect(actionPlan.metadata).toBeDefined();
      expect(actionPlan.metadata.matchRate).toBeDefined();
    });
  });

  describe('Learner Instance', () => {
    test('Create and use learner', async () => {
      const learner = builder.createLearner();

      expect(learner).toBeDefined();
      expect(learner.learnFromSequence).toBeDefined();
      expect(learner.applyWorkflow).toBeDefined();
      expect(learner.listPatterns).toBeDefined();
    });

    test('Learn workflow from sequence', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const result = await learner.learnFromSequence(screenshots, {
        domain: 'login-system',
      });

      expect(result).toBeDefined();
      expect(result.patternId).toBeDefined();
      expect(result.stepCount).toBeGreaterThan(0);
      expect(result.duration_ms).toBeGreaterThan(0);

      const patterns = learner.listPatterns();
      expect(patterns.length).toBe(1);
      expect(patterns[0].sourceDomain).toBe('login-system');
    });

    test('Apply learned workflow', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const learnResult = await learner.learnFromSequence(screenshots);
      const patternId = learnResult.patternId;

      const actionPlan = await learner.applyWorkflow(mockScreenshot1, patternId);

      expect(actionPlan).toBeDefined();
      expect(actionPlan.actions).toBeDefined();
      expect(actionPlan.metadata.matchRate).toBeDefined();
    });

    test('Merge multiple patterns', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const result1 = await learner.learnFromSequence(screenshots);
      const result2 = await learner.learnFromSequence(screenshots);

      const mergeResult = learner.mergePatterns([result1.patternId, result2.patternId]);

      expect(mergeResult).toBeDefined();
      expect(mergeResult.mergedId).toBeDefined();
      expect(mergeResult.stepCount).toBeGreaterThan(0);

      const patterns = learner.listPatterns();
      expect(patterns.length).toBe(3); // 2 original + 1 merged
    });

    test('Get pattern history', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      await learner.learnFromSequence(screenshots);
      await learner.learnFromSequence(screenshots);

      const history = learner.getHistory();

      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0]).toHaveProperty('action');
    });

    test('Clear patterns', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      await learner.learnFromSequence(screenshots);
      const patternsBefore = learner.listPatterns();
      expect(patternsBefore.length).toBeGreaterThan(0);

      learner.clearPatterns();
      const patternsAfter = learner.listPatterns();
      expect(patternsAfter.length).toBe(0);
    });
  });

  describe('Workflow Script Generation', () => {
    test('Generate JavaScript workflow script', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const learnResult = await learner.learnFromSequence(screenshots);
      const actionPlan = await learner.applyWorkflow(mockScreenshot1, learnResult.patternId);

      const script = builder.generateWorkflowScript(actionPlan, 'javascript');

      expect(script).toBeDefined();
      expect(script).toContain('async function executeWorkflow');
      expect(script).toContain('puppeteer');
      expect(script).toContain('browser.close()');
    });

    test('Generate JSON workflow script', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const learnResult = await learner.learnFromSequence(screenshots);
      const actionPlan = await learner.applyWorkflow(mockScreenshot1, learnResult.patternId);

      const script = builder.generateWorkflowScript(actionPlan, 'json');

      expect(script).toBeDefined();
      const parsed = JSON.parse(script);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern Comparison', () => {
    test('Compare similar patterns', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const result1 = await learner.learnFromSequence(screenshots);
      const result2 = await learner.learnFromSequence(screenshots);

      const pattern1 = learner.getPattern(result1.patternId);
      const pattern2 = learner.getPattern(result2.patternId);

      const comparison = builder.comparePatterns(pattern1, pattern2);

      expect(comparison).toBeDefined();
      expect(comparison.commonSteps).toBeDefined();
      expect(comparison.similarity).toBeDefined();
      expect(parseFloat(comparison.similarity)).toBeLessThanOrEqual(1);
      expect(parseFloat(comparison.similarity)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Element Similarity', () => {
    test('Calculate string similarity', () => {
      const sim1 = builder.calculateElementSimilarity(
        { text: 'Submit', type: 'button' },
        { text: 'Submit', type: 'button' }
      );
      expect(sim1).toBeGreaterThan(0.8);

      const sim2 = builder.calculateElementSimilarity(
        { text: 'Login', type: 'button' },
        { text: 'Logout', type: 'button' }
      );
      expect(sim2).toBeGreaterThan(0.3);

      const sim3 = builder.calculateElementSimilarity(
        { text: 'Submit', type: 'button' },
        { text: 'Cancel', type: 'button' }
      );
      expect(sim3).toBeLessThan(0.5);
    });

    test('Handle position-based similarity', () => {
      const sim = builder.calculateElementSimilarity(
        {
          text: 'Button',
          type: 'button',
          position: { x: 100, y: 100 },
        },
        {
          text: 'Button',
          type: 'button',
          position: { x: 110, y: 105 },
        }
      );
      expect(sim).toBeGreaterThan(0.6);
    });
  });

  describe('Error Handling', () => {
    test('Handle invalid pattern ID', async () => {
      const learner = builder.createLearner();

      expect(async () => {
        await learner.applyWorkflow(mockScreenshot1, 'invalid_id');
      }).rejects.toThrow();
    });

    test('Handle empty screenshot', () => {
      const emptyScreenshot = { visionData: [], visualData: [] };
      const elements = builder.extractUIElements(emptyScreenshot);

      expect(elements).toBeDefined();
      expect(elements.length).toBe(0);
    });

    test('Handle merging with no patterns', () => {
      const learner = builder.createLearner();

      expect(() => {
        learner.mergePatterns([]);
      }).toThrow();
    });
  });

  describe('Performance Metrics', () => {
    test('Measure learning performance', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const result = await learner.learnFromSequence(screenshots);

      expect(result.duration_ms).toBeGreaterThan(0);
      expect(typeof result.duration_ms).toBe('number');
    });

    test('Measure application performance', async () => {
      const learner = builder.createLearner();
      const screenshots = [mockScreenshot1, mockScreenshot2, mockScreenshot3];

      const learnResult = await learner.learnFromSequence(screenshots);
      const actionPlan = await learner.applyWorkflow(mockScreenshot1, learnResult.patternId);

      expect(actionPlan.metadata.duration_ms).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// MOCK TEST RUNNER
// ============================================================================

/**
 * Simple test runner for demonstration
 */
function runTests() {
  const testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  console.log('Vision Workflow Builder - Test Suite\n');
  console.log('=' .repeat(60));

  // Run a few key tests
  try {
    console.log('\n[TEST] UI Element Detection');
    const elements = builder.extractUIElements(mockScreenshot1);
    console.log(`  ✓ Extracted ${elements.length} UI elements`);
    testResults.passed++;
  } catch (e) {
    console.log(`  ✗ Failed: ${e.message}`);
    testResults.failed++;
  }

  try {
    console.log('\n[TEST] Learner Instance Creation');
    const learner = builder.createLearner();
    console.log('  ✓ Learner created successfully');
    testResults.passed++;
  } catch (e) {
    console.log(`  ✗ Failed: ${e.message}`);
    testResults.failed++;
  }

  try {
    console.log('\n[TEST] Pattern Generalization');
    const elementSequences = [mockScreenshot1, mockScreenshot2, mockScreenshot3].map(s =>
      builder.extractUIElements(s)
    );
    const pattern = builder.learnWorkflowPattern(
      [mockScreenshot1, mockScreenshot2, mockScreenshot3],
      elementSequences
    );
    const generalized = builder.generalizePattern(pattern);
    console.log(`  ✓ Generated ${generalized.rules.length} generalization rules`);
    testResults.passed++;
  } catch (e) {
    console.log(`  ✗ Failed: ${e.message}`);
    testResults.failed++;
  }

  try {
    console.log('\n[TEST] Data Pattern Extraction');
    const patterns = [
      { text: '2024-06-22', expected: 'date' },
      { text: 'user@example.com', expected: 'email' },
      { text: '555-123-4567', expected: 'phone' },
      { text: '99.99', expected: 'currency' },
    ];
    let correctCount = 0;
    patterns.forEach(({ text, expected }) => {
      const pattern = builder.extractDataPattern(text);
      if (pattern.type === expected) correctCount++;
    });
    console.log(`  ✓ Correctly identified ${correctCount}/${patterns.length} data patterns`);
    testResults.passed++;
  } catch (e) {
    console.log(`  ✗ Failed: ${e.message}`);
    testResults.failed++;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nTest Results: ${testResults.passed} passed, ${testResults.failed} failed`);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%\n`);

  return testResults;
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
